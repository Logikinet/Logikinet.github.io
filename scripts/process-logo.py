"""从源图导出站点图标。

新版策略：保留完整 App 图标（浅底圆角 + 渐变 A），只裁掉外圈纯黑留白。
不再做像素级「抠黑」透明化——那会在小尺寸下产生锯齿和脏边。
"""
from __future__ import annotations

from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "public" / "assets" / "logo-source.png"
PUBLIC = ROOT / "public"
ASSETS = PUBLIC / "assets"


def crop_letterbox(im: Image.Image, black_threshold: int = 18) -> Image.Image:
    """裁掉四周接近纯黑的留白，保留图标本体（含浅色圆角面板）。"""
    rgba = im.convert("RGBA")
    w, h = rgba.size
    pixels = rgba.load()
    assert pixels is not None

    def is_letterbox(x: int, y: int) -> bool:
        r, g, b, a = pixels[x, y]
        if a < 8:
            return True
        return r <= black_threshold and g <= black_threshold and b <= black_threshold

    # 找非留白 bbox
    min_x, min_y = w, h
    max_x, max_y = -1, -1
    for y in range(h):
        for x in range(w):
            if not is_letterbox(x, y):
                if x < min_x:
                    min_x = x
                if y < min_y:
                    min_y = y
                if x > max_x:
                    max_x = x
                if y > max_y:
                    max_y = y

    if max_x < 0:
        return rgba

    # 轻微内缩，去掉抗锯齿脏边，但不要裁进圆角面板
    pad = max(2, int(min(w, h) * 0.004))
    x0 = max(0, min_x + pad)
    y0 = max(0, min_y + pad)
    x1 = min(w, max_x + 1 - pad)
    y1 = min(h, max_y + 1 - pad)
    if x1 <= x0 or y1 <= y0:
        return rgba.crop((min_x, min_y, max_x + 1, max_y + 1))
    return rgba.crop((x0, y0, x1, y1))


def make_square(img: Image.Image, size: int, *, fill: tuple[int, int, int, int] | None = None) -> Image.Image:
    """等比缩放到正方形画布。小尺寸 favicon 可用浅底填充，避免透明棋盘感。"""
    if fill is None:
        canvas = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    else:
        canvas = Image.new("RGBA", (size, size), fill)

    # 图标本身已是圆角方块：几乎贴边，留 2–4% 呼吸
    margin = max(0, int(size * 0.02))
    target = size - margin * 2
    ratio = min(target / img.width, target / img.height)
    nw = max(1, int(img.width * ratio))
    nh = max(1, int(img.height * ratio))
    resized = img.resize((nw, nh), Image.Resampling.LANCZOS)
    ox = (size - nw) // 2
    oy = (size - nh) // 2
    canvas.paste(resized, (ox, oy), resized)
    return canvas


def to_rgb_on(img: Image.Image, bg: tuple[int, int, int] = (245, 247, 251)) -> Image.Image:
    """ICO 部分环境对透明支持差，叠浅灰底再转 RGB。"""
    base = Image.new("RGBA", img.size, (*bg, 255))
    base.alpha_composite(img)
    return base.convert("RGB")


def main() -> None:
    if not SRC.exists():
        raise SystemExit(f"missing source: {SRC}")

    ASSETS.mkdir(parents=True, exist_ok=True)
    cropped = crop_letterbox(Image.open(SRC))
    logo_path = ASSETS / "logo.png"
    cropped.save(logo_path, "PNG", optimize=True)
    print("logo", cropped.size, logo_path)

    outputs: dict[Path, int] = {
        PUBLIC / "favicon-32.png": 32,
        PUBLIC / "favicon-48.png": 48,
        PUBLIC / "favicon.png": 32,
        PUBLIC / "apple-touch-icon.png": 180,
        PUBLIC / "icon-192.png": 192,
        PUBLIC / "icon-512.png": 512,
        ASSETS / "logo-64.png": 64,
    }
    for path, size in outputs.items():
        make_square(cropped, size).save(path, "PNG", optimize=True)
        print("wrote", path.name, size)

    # ICO：Pillow 多帧 ICO 不稳定，写入 48px 单帧；浏览器优先用 favicon.png
    ico_path = PUBLIC / "favicon.ico"
    to_rgb_on(make_square(cropped, 48)).save(ico_path, format="ICO", sizes=[(48, 48)])
    print("ico", ico_path, ico_path.stat().st_size)


if __name__ == "__main__":
    main()
