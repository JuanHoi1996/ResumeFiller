"""
Export icons/active/icon{16,32,48,128}.png from svg/icon.svg geometry (Pillow).

Usage: python icons/export_svg_to_png.py
"""

from __future__ import annotations

from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent
ACTIVE = ROOT / "active"
BLUE = "#1d6ef2"
WHITE = "#ffffff"
SIZES = (16, 32, 48, 128)
RX_RATIO = 28 / 128
FONT_RATIO_R = 100 / 128
ITALIC_SHEAR = 0.20


def _try_font(paths: tuple[str, ...], size: int) -> ImageFont.FreeTypeFont | None:
    for path in paths:
        p = Path(path)
        if p.exists():
            try:
                return ImageFont.truetype(str(p), size=size)
            except OSError:
                continue
    return None


def _load_black(size: int) -> ImageFont.FreeTypeFont | ImageFont.ImageFont:
    return (
        _try_font(
            (
                "C:/Windows/Fonts/ariblk.ttf",
                "C:/Windows/Fonts/ARIBLK.TTF",
                "C:/Windows/Fonts/arialbd.ttf",
                "C:/Windows/Fonts/ARIALBD.TTF",
            ),
            size,
        )
        or ImageFont.load_default()
    )


def _glyph_bbox(layer: Image.Image) -> tuple[int, int, int, int] | None:
    return layer.split()[3].getbbox()


def _recenter_layer(layer: Image.Image) -> Image.Image:
    size = layer.size[0]
    bbox = _glyph_bbox(layer)
    if not bbox:
        return layer
    cx = (bbox[0] + bbox[2]) / 2
    cy = (bbox[1] + bbox[3]) / 2
    out = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    out.paste(layer, (int(round(size / 2 - cx)), int(round(size / 2 - cy))), layer)
    return out


def _apply_center_shear(layer: Image.Image, shear: float) -> Image.Image:
    size = layer.size[0]
    bbox = _glyph_bbox(layer)
    if not bbox:
        return layer
    cy = (bbox[1] + bbox[3]) / 2.0
    k = shear
    coeffs = (1, k, -k * cy, 0, 1, 0)
    return layer.transform((size, size), Image.AFFINE, coeffs, resample=Image.Resampling.BICUBIC)


def render_icon(size: int) -> Image.Image:
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    radius = max(2, round(size * RX_RATIO))
    draw.rounded_rectangle((0, 0, size - 1, size - 1), radius=radius, fill=BLUE)

    font_size = max(9, int(size * FONT_RATIO_R * 0.96))
    font = _load_black(font_size)
    layer = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    ldraw = ImageDraw.Draw(layer)
    bbox = ldraw.textbbox((0, 0), "R", font=font)
    tw, th = bbox[2] - bbox[0], bbox[3] - bbox[1]
    x = (size - tw) / 2 - bbox[0]
    y = (size - th) / 2 - bbox[1] - size * 0.02
    ldraw.text((x, y), "R", fill=WHITE, font=font)
    layer = _apply_center_shear(layer, ITALIC_SHEAR)
    layer = _recenter_layer(layer)
    img.alpha_composite(layer)
    return img


def main() -> None:
    ACTIVE.mkdir(parents=True, exist_ok=True)
    for size in SIZES:
        dest = ACTIVE / f"icon{size}.png"
        render_icon(size).save(dest, format="PNG")
        print(dest)


if __name__ == "__main__":
    main()
