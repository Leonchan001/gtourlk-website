"""
壓縮所有照片：限制最大寬度，重新編碼 JPEG (progressive, optimized)。
覆蓋原檔。同時印出壓縮前後檔案大小。
"""
from pathlib import Path
from PIL import Image, ImageOps

ROOT = Path(__file__).parent.parent / 'public'

# (相對路徑, 最大寬度, JPEG 品質)
TARGETS = [
    ('hero-main.jpg', 1600, 82),
    ('photos/616161739_122194558484552238_4429188020215802451_n.jpg', 1400, 82),
    ('photos/480205747_122137951886552238_3513916884789453651_n.jpg', 1200, 82),
    ('photos/Lugang_Koo\'s_House.JPG', 1400, 82),
    ('photos/鹿港老街小巷07.jpg', 1400, 82),
    ('photos/鹿港老街_三槐挺秀宅_Lukang_Old_Street_-_panoramio_(1).jpg', 1200, 82),
    ('photos/鹿港_半邊井_-_panoramio.jpg', 1200, 82),
]


def compress(rel_path: str, max_width: int, quality: int):
    src = ROOT / rel_path
    if not src.exists():
        print(f'[skip] not found: {rel_path}')
        return
    before = src.stat().st_size

    img = Image.open(src)
    img = ImageOps.exif_transpose(img)  # 修正手機照片旋轉
    if img.mode != 'RGB':
        img = img.convert('RGB')

    if img.width > max_width:
        ratio = max_width / img.width
        new_size = (max_width, round(img.height * ratio))
        img = img.resize(new_size, Image.LANCZOS)

    img.save(
        src,
        format='JPEG',
        quality=quality,
        optimize=True,
        progressive=True,
    )
    after = src.stat().st_size
    saved = (1 - after / before) * 100
    print(f'{rel_path}\n  {before/1024:8.1f} KB → {after/1024:8.1f} KB  ({saved:+.0f}%)  {img.width}x{img.height}')


if __name__ == '__main__':
    for rel, w, q in TARGETS:
        compress(rel, w, q)
    print('\nDone.')
