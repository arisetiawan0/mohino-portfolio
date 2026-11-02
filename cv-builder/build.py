"""Cetak CV dari cv.html menjadi dua PDF lewat Chrome headless.

  python3 cv-builder/build.py

- cv-builder/Ari-Setiawan-CV.pdf   versi lamaran, lengkap dengan nomor HP
- public/cv/ari-setiawan-cv.pdf    versi web untuk portfolio, nomor HP dibuang
                                    (pengunjung web memakai tombol WhatsApp)

Nomor HP tidak disimpan di cv.html (repo publik). Isinya dibaca dari
cv-builder/private.json yang tidak ikut ke git:
  {"phone_display": "+62 ...", "phone_intl": "62..."}
Tanpa berkas itu, hanya versi web yang dicetak.
"""

import json
import re
import shutil
import subprocess
import tempfile
from pathlib import Path

HERE = Path(__file__).resolve().parent
ROOT = HERE.parent
CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"

TARGETS = [
    ("full", HERE / "Ari-Setiawan-CV.pdf"),
    ("web", ROOT / "public" / "cv" / "ari-setiawan-cv.pdf"),
]


def variant(html: str, kind: str, private: dict | None) -> str:
    if kind == "web":
        html, n = re.subn(r"<!--PHONE-->.*?<!--/PHONE-->", "", html, flags=re.S)
        assert n == 1, "penanda <!--PHONE--> tidak ditemukan"
        if private:
            assert private["phone_intl"][-6:] not in html, "nomor HP masih ada di versi web"
    else:
        html = html.replace("{{PHONE_DISPLAY}}", private["phone_display"]).replace("{{PHONE_INTL}}", private["phone_intl"])
    assert "{{" not in html, "masih ada placeholder yang belum diisi"
    return html


def main() -> None:
    source = (HERE / "cv.html").read_text(encoding="utf-8")
    private_file = HERE / "private.json"
    private = json.loads(private_file.read_text(encoding="utf-8")) if private_file.exists() else None
    profile = tempfile.mkdtemp(prefix="cv-chrome-")
    try:
        for kind, out in TARGETS:
            if kind == "full" and not private:
                print("full: dilewati (cv-builder/private.json tidak ada)")
                continue
            # File sementara di folder yang sama supaya path foto relatif tetap benar.
            page = HERE / f".cv-{kind}.html"
            page.write_text(variant(source, kind, private), encoding="utf-8")
            out.parent.mkdir(parents=True, exist_ok=True)
            try:
                subprocess.run(
                    [
                        CHROME,
                        "--headless=new",
                        "--disable-gpu",
                        f"--user-data-dir={profile}",  # profil terpisah, tidak mengganggu Chrome yang sedang dibuka
                        "--no-pdf-header-footer",
                        "--run-all-compositor-stages-before-draw",
                        "--virtual-time-budget=15000",  # beri waktu font Archivo dimuat
                        f"--print-to-pdf={out}",
                        page.as_uri(),
                    ],
                    check=True,
                    capture_output=True,
                    timeout=120,
                )
            finally:
                page.unlink(missing_ok=True)
            print(f"{kind}: {out.relative_to(ROOT)} ({out.stat().st_size // 1024} KB)")
    finally:
        shutil.rmtree(profile, ignore_errors=True)


if __name__ == "__main__":
    main()
