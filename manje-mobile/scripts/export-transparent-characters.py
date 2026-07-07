from __future__ import annotations

from collections import deque
from pathlib import Path

from PIL import Image, ImageChops, ImageDraw, ImageFilter, ImageStat


SOURCE_ROOT = Path("assets/character")
OUT_ROOT = Path("assets/character-transparent")
QA_ROOT = OUT_ROOT / "_qa"

MOODS = ["wave", "happy", "thinking", "celebrate", "concern", "encourage", "sleep", "surprise"]
VARIANTS = ["full", "half", "badge"]


def estimate_background(image: Image.Image) -> tuple[int, int, int]:
    rgb = image.convert("RGB")
    width, height = rgb.size
    patches = [
        (0, 0, 28, 28),
        (width - 28, 0, width, 28),
        (0, height - 28, 28, height),
        (width - 28, height - 28, width, height),
    ]
    samples = []
    for box in patches:
        crop = rgb.crop(box)
        stat = ImageStat.Stat(crop)
        samples.append(tuple(int(v) for v in stat.median))
    return tuple(int(sum(channel) / len(channel)) for channel in zip(*samples))


def is_background_candidate(pixel: tuple[int, int, int], bg: tuple[int, int, int]) -> bool:
    r, g, b = pixel
    distance = ((r - bg[0]) ** 2 + (g - bg[1]) ** 2 + (b - bg[2]) ** 2) ** 0.5
    # Stay conservative: white shirts and sleeves are common in this set, so only remove
    # pixels that closely match the actual off-white background sampled from the corners.
    return distance <= 14


def flood_background_mask(image: Image.Image) -> Image.Image:
    rgb = image.convert("RGB")
    width, height = rgb.size
    bg = estimate_background(rgb)
    pixels = rgb.load()
    mask = Image.new("L", (width, height), 0)
    mask_pixels = mask.load()
    queue: deque[tuple[int, int]] = deque()

    def enqueue(x: int, y: int) -> None:
        if mask_pixels[x, y] == 0 and is_background_candidate(pixels[x, y], bg):
            mask_pixels[x, y] = 255
            queue.append((x, y))

    for x in range(width):
        enqueue(x, 0)
        enqueue(x, height - 1)
    for y in range(height):
        enqueue(0, y)
        enqueue(width - 1, y)

    while queue:
        x, y = queue.popleft()
        if x > 0:
            enqueue(x - 1, y)
        if x < width - 1:
            enqueue(x + 1, y)
        if y > 0:
            enqueue(x, y - 1)
        if y < height - 1:
            enqueue(x, y + 1)

    # Slightly grow then blur the background matte to avoid pale halos.
    mask = mask.filter(ImageFilter.MaxFilter(3)).filter(ImageFilter.GaussianBlur(0.55))
    return mask


def transparent_export(source: Path, destination_png: Path, destination_webp: Path) -> None:
    image = Image.open(source).convert("RGB")
    background = flood_background_mask(image)
    alpha = ImageChops.invert(background)

    rgba = image.convert("RGBA")
    rgba.putalpha(alpha)

    destination_png.parent.mkdir(parents=True, exist_ok=True)
    rgba.save(destination_png, optimize=True)
    rgba.save(destination_webp, "WEBP", quality=96, method=4)


def checkerboard(size: tuple[int, int], cell: int = 18) -> Image.Image:
    width, height = size
    board = Image.new("RGB", size, "#f8faf9")
    draw = ImageDraw.Draw(board)
    for y in range(0, height, cell):
        for x in range(0, width, cell):
            color = "#dce7e2" if (x // cell + y // cell) % 2 else "#f8faf9"
            draw.rectangle((x, y, x + cell - 1, y + cell - 1), fill=color)
    return board


def composite_on_background(asset: Image.Image, background: Image.Image) -> Image.Image:
    frame = background.convert("RGBA")
    frame.alpha_composite(asset.convert("RGBA"), (0, 0))
    return frame.convert("RGB")


def make_contact_sheet(files: list[Path], output: Path) -> None:
    tile_w, tile_h = 248, 300
    preview = 96
    cols = 4
    rows = (len(files) + cols - 1) // cols
    sheet = Image.new("RGB", (cols * tile_w, rows * tile_h), "#f8faf9")
    draw = ImageDraw.Draw(sheet)

    for index, source in enumerate(files):
        rel = source.relative_to(OUT_ROOT)
        asset = Image.open(source).convert("RGBA")
        asset.thumbnail((preview, preview), Image.Resampling.LANCZOS)
        col, row = index % cols, index // cols
        x, y = col * tile_w + 14, row * tile_h + 12

        backgrounds = [
            Image.new("RGB", (preview, preview), "#f8faf9"),
            Image.new("RGB", (preview, preview), "#0d3b2e"),
            checkerboard((preview, preview), 12),
        ]
        labels = ["light", "dark", "grid"]
        for slot, bg in enumerate(backgrounds):
            px = x + slot * 74
            py = y + 34
            draw.rounded_rectangle((px - 4, py - 4, px + preview + 4, py + preview + 4), 10, fill="#ffffff", outline="#d9e6df")
            canvas = bg.convert("RGBA")
            canvas.alpha_composite(asset, ((preview - asset.width) // 2, (preview - asset.height) // 2))
            sheet.paste(canvas.convert("RGB"), (px, py))
            draw.text((px, py + preview + 8), labels[slot], fill="#426356")

        draw.text((x, y), str(rel).replace("\\", "/"), fill="#0d3b2e")

    output.parent.mkdir(parents=True, exist_ok=True)
    sheet.save(output, quality=92)


def iter_source_files() -> list[Path]:
    files: list[Path] = []
    for mood in MOODS:
        for variant in VARIANTS:
            files.append(SOURCE_ROOT / mood / f"{mood}-{variant}.png")
    files.extend(sorted((SOURCE_ROOT / "utility").glob("*.png")))
    return files


def main() -> None:
    source_files = iter_source_files()
    exported_pngs: list[Path] = []
    for source in source_files:
        relative = source.relative_to(SOURCE_ROOT)
        destination_png = OUT_ROOT / relative
        destination_webp = destination_png.with_suffix(".webp")
        transparent_export(source, destination_png, destination_webp)
        exported_pngs.append(destination_png)
        print(f"exported {destination_png}")

    make_contact_sheet(exported_pngs, QA_ROOT / "transparent-character-contact-sheet.jpg")


if __name__ == "__main__":
    main()
