#!/usr/bin/env python3
import hashlib
import io
import json
import os
import shutil
import tempfile
import urllib.request
import zipfile
from pathlib import Path

SOURCE_URL = (
    "https://s3.sa-east-1.amazonaws.com/"
    "ckan.saude.gov.br/CNES/cnes_estabelecimentos_json.zip"
)
OUTPUT_DIR = Path(
    os.environ.get(
        "TERRITORY_DATA_OUTPUT",
        "territory-health-cnes-metadata",
    )
)

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
        content_type = response.headers.get("Content-Type")
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
        "contentType": content_type,
        "lastModified": last_modified,
    }

def read_first_json_value(stream):
    text = io.TextIOWrapper(stream, encoding="utf-8-sig")
    first = ""

    while True:
        ch = text.read(1)
        if not ch:
            raise RuntimeError("cnes_json_empty")
        if not ch.isspace():
            first = ch
            break

    if first == "[":
        while True:
            ch = text.read(1)
            if not ch:
                raise RuntimeError("cnes_json_array_empty")
            if not ch.isspace():
                first = ch
                break

    if first != "{":
        return {
            "topLevelPrefix": first,
            "firstRecord": None,
        }

    chars = [first]
    depth = 1
    in_string = False
    escaped = False

    while depth:
        ch = text.read(1)
        if not ch:
            raise RuntimeError("cnes_first_object_truncated")
        chars.append(ch)

        if in_string:
            if escaped:
                escaped = False
            elif ch == "\\":
                escaped = True
            elif ch == '"':
                in_string = False
            continue

        if ch == '"':
            in_string = True
        elif ch == "{":
            depth += 1
        elif ch == "}":
            depth -= 1

        if len(chars) > 4_000_000:
            raise RuntimeError("cnes_first_object_too_large")

    record = json.loads("".join(chars))
    return {
        "topLevelPrefix": "[{",
        "firstRecord": record,
    }

OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

with tempfile.TemporaryDirectory() as temp_dir:
    archive_path = Path(temp_dir) / "cnes_estabelecimentos_json.zip"
    download = download_file(SOURCE_URL, archive_path)

    if download["sizeBytes"] <= 0:
        raise RuntimeError("cnes_archive_empty")

    with zipfile.ZipFile(archive_path) as archive:
        bad_member = archive.testzip()
        if bad_member:
            raise RuntimeError(f"cnes_zip_crc_failed:{bad_member}")

        members = [
            {
                "name": item.filename,
                "sizeBytes": item.file_size,
                "compressedSizeBytes": item.compress_size,
                "crc": item.CRC,
            }
            for item in archive.infolist()
            if not item.is_dir()
        ]

        json_members = [
            member for member in archive.infolist()
            if not member.is_dir()
            and member.filename.lower().endswith(".json")
        ]

        if not json_members:
            raise RuntimeError("cnes_json_member_missing")

        chosen = max(json_members, key=lambda item: item.file_size)

        with archive.open(chosen) as source:
            first_value = read_first_json_value(source)

    first_record = first_value["firstRecord"]

    manifest = {
        "schema": "acheguese.cnes-metadata-probe/1",
        "sourceUrl": SOURCE_URL,
        "downloadedAt": __import__("datetime").datetime.now(
            __import__("datetime").timezone.utc
        ).isoformat(),
        "archive": download,
        "members": members,
        "chosenJsonMember": chosen.filename,
        "chosenJsonSizeBytes": chosen.file_size,
        "topLevelPrefix": first_value["topLevelPrefix"],
        "firstRecordKeys": (
            sorted(first_record.keys())
            if isinstance(first_record, dict)
            else []
        ),
        "firstRecord": first_record,
    }

OUTPUT_DIR.joinpath("cnes-health-metadata.json").write_text(
    json.dumps(
        manifest,
        ensure_ascii=False,
        indent=2,
        sort_keys=True,
    ) + "\n",
    encoding="utf-8",
)

print(
    "TERRITORY_HEALTH_CNES_METADATA_RESULT="
    + json.dumps(
        manifest,
        ensure_ascii=False,
        separators=(",", ":"),
    )
)
