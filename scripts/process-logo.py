"""抠除黑底并导出站点图标。"""
from __future__ import annotations

from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "public" / "assets" / "logo-source.png"
PUBLIC = ROOT / "public"
ASSETS = PUBLIC / "assets"


def cutout_black(im: Image.Image, threshold: int = 28) -> Image.Image:
    im = im.convert("RGBA")
    pixels = im.load()
    w, h = im.size
    for y in range(h):
        for x in range(w):
            r, g, b, a = pixels[x, y]
            if r <= threshold and g <= threshold and b <= threshold:
                pixels[x, y] = (0, 0, 0, 0)
    bbox = im.getbbox()
    if not bbox:
        return im
    pad = 4
    x0, y0, x1, y1 = bbox
    return im.crop(
        (
            max(0, x0 - pad),
            max(0, y0 - pad),
            min(w, x1 + pad),
            min(h, y1 + pad),
        )
    )


def square_resize(img: Image.Image, size: int) -> Image.Image:
    canvas = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    margin = max(1, int(size * 0.04))
    target = size - margin * 2
    ratio = min(target / img.width, target / img.height)
    nw = max(1, int(img.width * ratio))
    nh = max(1, int(img.height * ratio))
    resized = img.resize((nw, nh), Image.Resampling.LANCZOS)
    ox = (size - nw) // 2
    oy = (size - nh) // 2
    canvas.paste(resized, (ox, oy), resized)
    return canvas


def main() -> None:
    ASSETS.mkdir(parents=True, exist_ok=True)
    im = cutout_black(Image.open(SRC))
    logo = ASSETS / "logo.png"
    im.save(logo, "PNG", optimize=True)
    print("logo", im.size, logo)

    outputs = {
        PUBLIC / "favicon-32.png": 32,
        PUBLIC / "favicon-48.png": 48,
        PUBLIC / "apple-touch-icon.png": 180,
        PUBLIC / "icon-192.png": 192,
        PUBLIC / "icon-512.png": 512,
        ASSETS / "logo-64.png": 64,
    }
    for path, size in outputs.items():
        square_resize(im, size).save(path, "PNG", optimize=True)
        print("wrote", path)

    ico_images = [square_resize(im, s) for s in (16, 32, 48)]
    ico_path = PUBLIC / "favicon.ico"
    ico_images[0].save(
        ico_path,
        format="ICO",
        sizes=[(16, 16), (32, 32), (48, 48)],
        append_images=ico_images[1:],
    )
    print("ico", ico_path)


if __name__ == "__main__":
    main()
