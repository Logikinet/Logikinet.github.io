from pathlib import Path

from PIL import Image

PUBLIC = Path(__file__).resolve().parents[1] / "public"
logo = Image.open(PUBLIC / "assets" / "logo.png").convert("RGBA")


def sq(img: Image.Image, size: int) -> Image.Image:
    c = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    m = max(1, int(size * 0.04))
    t = size - 2 * m
    r = min(t / img.width, t / img.height)
    nw, nh = max(1, int(img.width * r)), max(1, int(img.height * r))
    resized = img.resize((nw, nh), Image.Resampling.LANCZOS)
    c.paste(resized, ((size - nw) // 2, (size - nh) // 2), resized)
    return c


# Multi-size ICO: pass list of images
imgs = [sq(logo, s) for s in (16, 32, 48)]
imgs[0].save(
    PUBLIC / "favicon.ico",
    format="ICO",
    sizes=[(16, 16), (32, 32), (48, 48)],
    append_images=imgs[1:],
)
sq(logo, 32).save(PUBLIC / "favicon.png")
print("favicon.ico", (PUBLIC / "favicon.ico").stat().st_size)
print("favicon.png", (PUBLIC / "favicon.png").stat().st_size)
