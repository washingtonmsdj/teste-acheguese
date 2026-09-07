#!/usr/bin/env python3
"""Build the deterministic inline Vercel source payload."""

from __future__ import annotations

import argparse
import json
from pathlib import Path


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--manifest",
        default="infra/vercel-source-manifest.json",
    )
    parser.add_argument("--output", required=True)
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    root = Path(".")
    manifest_path = root / args.manifest
    manifest = json.loads(
        manifest_path.read_text(encoding="utf-8")
    )

    paths: list[Path] = []

    for value in manifest["files"]:
        path = root / value
        if not path.is_file():
            raise SystemExit(
                f"vercel_source_required_file_missing:{value}"
            )
        paths.append(path)

    for value in manifest["directories"]:
        directory = root / value
        if not directory.exists():
            continue

        paths.extend(
            sorted(
                path
                for path in directory.rglob("*")
                if path.is_file()
            )
        )

    unique_paths = sorted(
        {path.as_posix(): path for path in paths}.values(),
        key=lambda path: path.as_posix(),
    )

    files = []
    for path in unique_paths:
        try:
            data = path.read_text(encoding="utf-8")
        except UnicodeDecodeError as error:
            raise SystemExit(
                "vercel_source_binary_file_not_supported:"
                f"{path.as_posix()}"
            ) from error

        files.append(
            {
                "file": path.as_posix(),
                "data": data,
            }
        )

    output = Path(args.output)
    output.parent.mkdir(parents=True, exist_ok=True)
    output.write_text(
        json.dumps(
            files,
            ensure_ascii=False,
            separators=(",", ":"),
        ),
        encoding="utf-8",
    )

    if not files:
        raise SystemExit("vercel_source_payload_empty")

    print(
        "VERCEL_SOURCE_BUNDLE=PASS "
        f"files={len(files)} output={output}"
    )


if __name__ == "__main__":
    main()
