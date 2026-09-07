#!/usr/bin/env python3
import hashlib
import json
import os
import tempfile
import urllib.request
import zipfile
from pathlib import Path

SOURCE_KEY = "cnes-estabelecimentos-sus"
SOURCE_URL = (
    "https://s3.sa-east-1.amazonaws.com/"
    "ckan.saude.gov.br/CNES/cnes_estabelecimentos_json.zip"
)
SALVADOR_IBGE = "292740"
BOUNDARY_MIGRATION = Path(
    "supabase/migrations/20260907073139_territory_complexo_boundaries_v1.sql"
)
OUTPUT_DIR = Path(
    os.environ.get(
        "TERRITORY_DATA_OUTPUT",
        "territory-health-cnes-output",
    )
)

MVP_PATHS = {
    "/br/ba/salvador/chapada-do-rio-vermelho",
    "/br/ba/salvador/nordeste-de-amaralina",
    "/br/ba/salvador/santa-cruz",
    "/br/ba/salvador/vale-das-pedrinhas",
}

def download_file(url: str, destination: Path):
    request = urllib.request.Request(
        url,
        headers={
            "Accept": "application/zip",
            "User-Agent": "achegue-se-territory-data-probe/1",
        },
    )
    digest = hashlib.sha256()
    total = 0

    with urllib.request.urlopen(request, timeout=120) as response:
        last_modified = response.headers.get("Last-Modified")
        with destination.open("wb") as target:
            while True:
                chunk = response.read(1024 * 1024)
                if not chunk:
                    break
                target.write(chunk)
                digest.update(chunk)
                total += len(chunk)

    return {
        "sha256": digest.hexdigest(),
        "sizeBytes": total,
        "lastModified": last_modified,
    }

def load_boundaries():
    import re

    sql = BOUNDARY_MIGRATION.read_text(encoding="utf-8")
    pattern = re.compile(
        r"\('([^']+)',\s*'([^']+)',\s*'(\{.*?\})'::jsonb\)",
        re.S,
    )

    result = []
    for match in pattern.finditer(sql):
        geographic_path = match.group(1)
        if geographic_path not in MVP_PATHS:
            continue
        result.append(
            {
                "geographicPath": geographic_path,
                "sourceObjectId": match.group(2),
                "geometry": json.loads(match.group(3)),
            }
        )

    if len(result) != 4:
        raise RuntimeError(
            f"health_boundary_count_invalid:{len(result)}"
        )

    return result

def point_on_segment(point, start, end):
    px, py = point
    ax, ay = start
    bx, by = end
    cross = (px - ax) * (by - ay) - (py - ay) * (bx - ax)
    if abs(cross) > 1e-12:
        return False
    return (
        px >= min(ax, bx) - 1e-12
        and px <= max(ax, bx) + 1e-12
        and py >= min(ay, by) - 1e-12
        and py <= max(ay, by) + 1e-12
    )

def point_in_ring(point, ring):
    inside = False
    x, y = point
    j = len(ring) - 1

    for i in range(len(ring)):
        current = ring[i]
        previous = ring[j]

        if point_on_segment(point, previous, current):
            return True

        xi, yi = current
        xj, yj = previous

        intersects = (
            (yi > y) != (yj > y)
            and x < ((xj - xi) * (y - yi)) / (yj - yi) + xi
        )
        if intersects:
            inside = not inside

        j = i

    return inside

def point_in_polygon(point, polygon):
    outer, *holes = polygon
    return point_in_ring(point, outer) and not any(
        point_in_ring(point, hole) for hole in holes
    )

def point_in_geometry(point, geometry):
    if geometry["type"] == "Polygon":
        return point_in_polygon(point, geometry["coordinates"])
    if geometry["type"] == "MultiPolygon":
        return any(
            point_in_polygon(point, polygon)
            for polygon in geometry["coordinates"]
        )
    raise RuntimeError(
        f"unsupported_boundary_geometry:{geometry.get('type')}"
    )

def stream_json_array(stream):
    decoder = json.JSONDecoder()
    buffer = ""
    started = False
    finished = False

    while not finished:
        chunk = stream.read(1024 * 1024)
        if not chunk:
            finished = True
        else:
            buffer += chunk.decode("utf-8")

        cursor = 0

        while True:
            while cursor < len(buffer) and buffer[cursor].isspace():
                cursor += 1

            if not started:
                if cursor >= len(buffer):
                    break
                if buffer[cursor] != "[":
                    raise RuntimeError("cnes_top_level_not_array")
                started = True
                cursor += 1
                continue

            while (
                cursor < len(buffer)
                and (buffer[cursor].isspace() or buffer[cursor] == ",")
            ):
                cursor += 1

            if cursor < len(buffer) and buffer[cursor] == "]":
                return

            if cursor >= len(buffer):
                break

            try:
                value, next_cursor = decoder.raw_decode(buffer, cursor)
            except json.JSONDecodeError:
                break

            if not isinstance(value, dict):
                raise RuntimeError("cnes_record_not_object")

            yield value
            cursor = next_cursor

        if cursor:
            buffer = buffer[cursor:]

        if len(buffer) > 8 * 1024 * 1024:
            raise RuntimeError("cnes_stream_buffer_exceeded")

    if buffer.strip() not in ("", "]"):
        raise RuntimeError("cnes_json_truncated")

def clean_text(value):
    text = str(value or "").strip()
    return text or None

def parse_coordinate(value, field, cnes):
    text = clean_text(value)
    if text is None:
        return None
    try:
        number = float(text.replace(",", "."))
    except ValueError as exc:
        raise RuntimeError(
            f"health_coordinate_invalid:{field}:{cnes}"
        ) from exc
    return number

boundaries = load_boundaries()
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

with tempfile.TemporaryDirectory() as temp_dir:
    archive_path = Path(temp_dir) / "cnes_estabelecimentos_json.zip"
    archive = download_file(SOURCE_URL, archive_path)

    with zipfile.ZipFile(archive_path) as zipped:
        members = [
            item for item in zipped.infolist()
            if not item.is_dir()
            and item.filename.lower().endswith(".json")
        ]
        if not members:
            raise RuntimeError("cnes_json_member_missing")

        chosen = max(members, key=lambda item: item.file_size)

        national_count = 0
        salvador_count = 0
        salvador_active_count = 0
        salvador_active_with_coordinates = 0
        outside_mvp = 0
        salvador_missing_coordinates = []
        records = []

        with zipped.open(chosen) as source:
            for row in stream_json_array(source):
                national_count += 1

                if clean_text(row.get("CO_IBGE")) != SALVADOR_IBGE:
                    continue
                salvador_count += 1

                if clean_text(row.get("CO_MOTIVO_DESAB")):
                    continue
                salvador_active_count += 1

                cnes = clean_text(row.get("CO_CNES"))
                name = clean_text(row.get("NO_FANTASIA"))
                if not cnes or not name:
                    raise RuntimeError(
                        f"health_required_field_missing:{cnes or 'unknown'}"
                    )

                latitude = parse_coordinate(
                    row.get("NU_LATITUDE"), "NU_LATITUDE", cnes
                )
                longitude = parse_coordinate(
                    row.get("NU_LONGITUDE"), "NU_LONGITUDE", cnes
                )

                if latitude is None or longitude is None:
                    salvador_missing_coordinates.append(
                        {
                            "cnesCode": cnes,
                            "name": name,
                            "sourceNeighborhood": clean_text(
                                row.get("NO_BAIRRO")
                            ),
                            "street": clean_text(
                                row.get("NO_LOGRADOURO")
                            ),
                            "number": clean_text(
                                row.get("NU_ENDERECO")
                            ),
                            "postalCode": clean_text(
                                row.get("CO_CEP")
                            ),
                            "ambulatorySus": clean_text(
                                row.get("CO_AMBULATORIAL_SUS")
                            ),
                            "facilityTypeCode": clean_text(
                                row.get("TP_UNIDADE")
                            ),
                        }
                    )
                    continue

                if (
                    latitude < -90
                    or latitude > 90
                    or longitude < -180
                    or longitude > 180
                ):
                    raise RuntimeError(
                        f"health_coordinates_out_of_range:{cnes}"
                    )

                salvador_active_with_coordinates += 1

                matches = [
                    boundary
                    for boundary in boundaries
                    if point_in_geometry(
                        (longitude, latitude),
                        boundary["geometry"],
                    )
                ]

                if not matches:
                    outside_mvp += 1
                    continue

                if len(matches) != 1:
                    raise RuntimeError(
                        f"health_boundary_overlap:{cnes}:{len(matches)}"
                    )

                records.append(
                    {
                        "sourceRecordId": cnes,
                        "externalId": f"cnes:{cnes}",
                        "cnesCode": cnes,
                        "name": name,
                        "legalName": clean_text(
                            row.get("NO_RAZAO_SOCIAL")
                        ),
                        "geographicPath": matches[0]["geographicPath"],
                        "sourceNeighborhood": clean_text(
                            row.get("NO_BAIRRO")
                        ),
                        "facilityTypeCode": clean_text(
                            row.get("TP_UNIDADE")
                        ),
                        "managementType": clean_text(
                            row.get("TP_GESTAO")
                        ),
                        "administrativeSphere": clean_text(
                            row.get("DS_ESFERA_ADMINISTRATIVA")
                        ),
                        "ambulatorySus": clean_text(
                            row.get("CO_AMBULATORIAL_SUS")
                        ),
                        "latitude": latitude,
                        "longitude": longitude,
                        "address": {
                            "street": clean_text(
                                row.get("NO_LOGRADOURO")
                            ),
                            "number": clean_text(
                                row.get("NU_ENDERECO")
                            ),
                            "postalCode": clean_text(
                                row.get("CO_CEP")
                            ),
                        },
                        "phone": clean_text(row.get("NU_TELEFONE")),
                        "email": clean_text(row.get("NO_EMAIL")),
                    }
                )

records.sort(key=lambda item: item["externalId"])

TYPE_DESCRIPTIONS = {
    "1": "POSTO DE SAUDE",
    "2": "CENTRO DE SAUDE/UNIDADE BASICA",
    "4": "POLICLINICA",
    "5": "HOSPITAL GERAL",
    "7": "HOSPITAL ESPECIALIZADO",
    "15": "UNIDADE MISTA",
    "20": "PRONTO SOCORRO GERAL",
    "21": "PRONTO SOCORRO ESPECIALIZADO",
    "22": "CONSULTORIO ISOLADO",
    "36": "CLINICA/CENTRO DE ESPECIALIDADE",
    "39": "UNIDADE DE APOIO DIAGNOSE E TERAPIA",
    "40": "UNIDADE MOVEL TERRESTRE",
    "42": "UNIDADE MOVEL PRE-HOSPITALAR DE URGENCIA",
    "43": "FARMACIA",
    "50": "UNIDADE DE VIGILANCIA EM SAUDE",
    "61": "CENTRO DE PARTO NORMAL",
    "62": "HOSPITAL/DIA",
    "67": "LACEN",
    "69": "CENTRO DE HEMOTERAPIA/HEMATOLOGIA",
    "70": "CENTRO DE ATENCAO PSICOSSOCIAL",
    "71": "CENTRO DE APOIO A SAUDE DA FAMILIA",
    "73": "PRONTO ATENDIMENTO",
    "74": "POLO ACADEMIA DA SAUDE",
    "80": "LABORATORIO DE SAUDE PUBLICA",
    "85": "CENTRO DE IMUNIZACAO",
}

sus_records = []
for item in records:
    if item["ambulatorySus"] != "SIM":
        continue

    facility_type = item["facilityTypeCode"]
    item["facilityTypeLabel"] = TYPE_DESCRIPTIONS.get(facility_type)
    sus_records.append(item)

external_ids = {item["externalId"] for item in sus_records}
if len(external_ids) != len(sus_records):
    raise RuntimeError("health_duplicate_cnes_code")

if not sus_records:
    raise RuntimeError("health_no_sus_records_in_mvp")

normalized_text = (
    json.dumps(
        sus_records,
        ensure_ascii=False,
        indent=2,
        sort_keys=True,
    )
    + "\n"
)
normalized_sha256 = hashlib.sha256(
    normalized_text.encode("utf-8")
).hexdigest()

counts_by_territory = {
    geographic_path: sum(
        1
        for item in sus_records
        if item["geographicPath"] == geographic_path
    )
    for geographic_path in sorted(MVP_PATHS)
}

manifest = {
    "schema": "acheguese.public-places-health-probe/2",
    "selectionPolicy": "active + coordinates + inside-boundary + CO_AMBULATORIAL_SUS=SIM",
    "deferredPolicy": "non-SUS/private CNES records stay out of Territory public health; future Businesses may consume them separately",
    "sourceKey": SOURCE_KEY,
    "sourceUrl": SOURCE_URL,
    "sourceLastModified": archive["lastModified"],
    "archiveSha256": archive["sha256"],
    "archiveSizeBytes": archive["sizeBytes"],
    "chosenJsonMember": chosen.filename,
    "chosenJsonSizeBytes": chosen.file_size,
    "salvadorIbge": SALVADOR_IBGE,
    "territoryResolution": "point-in-versioned-boundary",
    "boundaryMigration": str(BOUNDARY_MIGRATION),
    "nationalRecordCount": national_count,
    "salvadorRecordCount": salvador_count,
    "salvadorActiveCount": salvador_active_count,
    "salvadorActiveWithCoordinates": (
        salvador_active_with_coordinates
    ),
    "salvadorActiveMissingCoordinates": salvador_missing_coordinates,
    "insideMvpAllHealthCount": len(records),
    "insideMvpDeferredNonSusCount": len(records) - len(sus_records),
    "outsideMvpWithCoordinates": outside_mvp,
    "recordCount": len(sus_records),
    "countsByTerritory": counts_by_territory,
    "normalizedSha256": normalized_sha256,
    "records": sus_records,
}

OUTPUT_DIR.joinpath("health-cnes-complexo-normalized.json").write_text(
    normalized_text,
    encoding="utf-8",
)
OUTPUT_DIR.joinpath("health-cnes-complexo-manifest.json").write_text(
    json.dumps(
        manifest,
        ensure_ascii=False,
        indent=2,
        sort_keys=True,
    )
    + "\n",
    encoding="utf-8",
)

print(
    "TERRITORY_HEALTH_CNES_PROBE_RESULT="
    + json.dumps(
        manifest,
        ensure_ascii=False,
        separators=(",", ":"),
    )
)
