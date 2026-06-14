#!/usr/bin/env python3
"""
Re-hue the eduvale tool pages from blue/purple/cyan -> dark teal, preserving each
color's saturation & lightness (so contrast/depth survive). Semantic hues are left
alone: green (safe), red (danger -> becomes the red accent), amber/gold (warning),
and low-saturation grays. Colors only; no layout/markup changes.

Usage:
  python3 scripts/rehue_eduvale.py --dry     # show what would change (no writes)
  python3 scripts/rehue_eduvale.py           # apply in place
"""
import re, glob, sys, colorsys

DRY = "--dry" in sys.argv
TEAL_HUE = 174/360.0          # dark teal #0f766e hue
# hue band to rotate (in degrees): cyan .. blue .. indigo .. purple .. violet
BAND_LO, BAND_HI = 176, 300
MIN_SAT = 0.18                # below this = gray; re-hue would be invisible AND risky -> skip

def hex_to_rgb(h):
    h = h.lstrip('#')
    if len(h) == 3: h = ''.join(c*2 for c in h)
    return tuple(int(h[i:i+2], 16) for i in (0, 2, 4))

def rgb_to_hex(r, g, b):
    return '#%02x%02x%02x' % (round(r), round(g), round(b))

def rehue(r, g, b):
    h, l, s = colorsys.rgb_to_hls(r/255, g/255, b/255)
    deg = h*360
    if s < MIN_SAT:                 # gray -> leave
        return None
    if not (BAND_LO <= deg <= BAND_HI):   # green/red/amber -> leave
        return None
    nr, ng, nb = colorsys.hls_to_rgb(TEAL_HUE, l, s)
    return (nr*255, ng*255, nb*255)

HEX_RE = re.compile(r'#[0-9a-fA-F]{6}\b|#[0-9a-fA-F]{3}\b')
RGB_RE = re.compile(r'rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*(,[^)]*)?\)')

changes = {}
def sub_hex(m):
    r, g, b = hex_to_rgb(m.group(0))
    out = rehue(r, g, b)
    if out is None: return m.group(0)
    new = rgb_to_hex(*out)
    changes[m.group(0).lower()] = new
    return new

def sub_rgb(m):
    r, g, b = int(m.group(1)), int(m.group(2)), int(m.group(3))
    out = rehue(r, g, b)
    if out is None: return m.group(0)
    tail = m.group(4) or ''
    fn = 'rgba' if tail else 'rgb'
    new = f'{fn}({round(out[0])},{round(out[1])},{round(out[2])}{tail})'
    changes[f'rgb({r},{g},{b})'] = new
    return new

files = sorted(glob.glob('src/_eduvale/*.head.html') +
               glob.glob('src/_eduvale/*.body.html') +
               glob.glob('src/_eduvale/*.inline.js'))
total = 0
for f in files:
    src = open(f, encoding='utf-8').read()
    new = HEX_RE.sub(sub_hex, src)
    new = RGB_RE.sub(sub_rgb, new)
    n = sum(1 for a, b in zip(src, new) if a != b)
    if new != src:
        total += 1
        if not DRY:
            open(f, 'w', encoding='utf-8').write(new)

print(f"files {'scanned' if DRY else 'rewritten'}: {total}/{len(files)}")
print(f"distinct colors remapped: {len(changes)}")
print("\nsample mappings (old -> new):")
for old in sorted(changes)[:40]:
    print(f"  {old:18} -> {changes[old]}")
