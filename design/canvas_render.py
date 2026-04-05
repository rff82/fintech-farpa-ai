#!/usr/bin/env python3
"""
Phosphene Logic — Canvas Render  (final refined pass)
CDHR1 retinal decay mapped as luminous cartography.
"""

import numpy as np
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import matplotlib.patches as patches
from matplotlib.patches import Circle
from matplotlib.font_manager import FontProperties
import matplotlib.colors as mcolors
import math

# ── Fonts ─────────────────────────────────────────────────────────────────────
FD = "/Users/rodrigofelipefernandes/.claude/skills/canvas-design/canvas-fonts"
fp_ibm_r = FontProperties(fname=f"{FD}/IBMPlexMono-Regular.ttf")
fp_ibm_b = FontProperties(fname=f"{FD}/IBMPlexMono-Bold.ttf")
fp_sans_b = FontProperties(fname=f"{FD}/WorkSans-Bold.ttf")
fp_sans_r = FontProperties(fname=f"{FD}/WorkSans-Regular.ttf")
fp_sans_i = FontProperties(fname=f"{FD}/WorkSans-Italic.ttf")
fp_crim_i = FontProperties(fname=f"{FD}/CrimsonPro-Italic.ttf")
fp_gloock = FontProperties(fname=f"{FD}/Gloock-Regular.ttf")

# ── Canvas ────────────────────────────────────────────────────────────────────
W, H = 3000, 3800
DPI  = 300
BG   = '#020207'

fig = plt.figure(figsize=(W/DPI, H/DPI), facecolor=BG)
ax  = fig.add_axes([0, 0, 1, 1])
ax.set_xlim(0, W); ax.set_ylim(0, H)
ax.set_aspect('equal'); ax.axis('off'); ax.set_facecolor(BG)

# ── Palette ───────────────────────────────────────────────────────────────────
AMB   = '#F9AA1F'
AMB2  = '#C97832'
AMB3  = '#7A4C28'
SIL   = '#7A8FA8'
GHOST = '#131322'
GRIDC = '#0B0B1A'
TP    = '#D8D0BE'       # text pale
TD    = '#3E3A55'       # text dim
TM    = '#6A6282'       # text mid
WG    = '#EDE8DE'       # white ghost

# ── Model ─────────────────────────────────────────────────────────────────────
r_G = 0.035
ERC0 = 1.0
years   = np.linspace(0, 20, 600)
erc_arr = ERC0 * np.exp(-r_G * years)

# ── Layout ────────────────────────────────────────────────────────────────────
ML, MR = 380, 300
MB, MT = 380, 220
CURVE_L = ML
CURVE_R = W - MR
CURVE_B = MB + 30
CURVE_T = int(H * 0.458)
CW = CURVE_R - CURVE_L
CH = CURVE_T - CURVE_B

RCX = int(W * 0.50)   # retina center x
RCY = int(H * 0.630)  # retina center y

def dc(yr, e):
    return (CURVE_L + (yr / 20.0) * CW,
            CURVE_B + e * CH)

# ════════════════════════════════════════════════════════════════════════════════
# RETINAL FIELD
# ════════════════════════════════════════════════════════════════════════════════

# Deep ambient glow — tight radius, sharp falloff
for r_g, a_g in zip(
    np.linspace(860, 10, 70),
    [(1 - i/70)**5.0 * 0.019 for i in range(70)]
):
    ax.add_patch(Circle((RCX, RCY), r_g,
                 color=mcolors.to_rgb(AMB), alpha=a_g, zorder=0))

# Concentric rings — tighter radius
rings = [(65,1.50,0.55),(130,1.15,0.43),(230,0.88,0.33),
         (355,0.65,0.24),(500,0.46,0.17),(670,0.30,0.11),
         (860,0.18,0.07),(1060,0.10,0.04)]
for rr, lw_r, al_r in rings:
    ax.add_patch(Circle((RCX, RCY), rr, fill=False,
                 edgecolor=AMB, linewidth=lw_r, alpha=al_r, zorder=4))

# Radial spokes
for i in range(48):
    ang = i * math.pi * 2 / 48
    ax.plot([RCX + 58*math.cos(ang), RCX + 1040*math.cos(ang)],
            [RCY + 58*math.sin(ang), RCY + 1040*math.sin(ang)],
            color=AMB, linewidth=0.13, alpha=0.065, zorder=3)

# Photoreceptor dots — brighter, higher contrast
rng = np.random.default_rng(2024)
for _ in range(3200):
    r_d = abs(rng.normal(0, 290))
    if r_d > 1020: continue
    ang = rng.uniform(0, 2*math.pi)
    xd = RCX + r_d*math.cos(ang)
    yd = RCY + r_d*math.sin(ang)
    ecc = r_d / 1020
    al  = (1-ecc)**2.2 * 0.88
    sz  = (1-ecc)**1.8 * 4.0 + 0.4
    wf  = (1-ecc)**2.0
    # Brighter core: push warmth toward 1.0 at fovea
    rc  = min(1.0, 0.990*wf + 0.520*(1-wf))
    gc  = min(1.0, 0.720*wf + 0.580*(1-wf))
    bc  = 0.090*wf + 0.680*(1-wf)
    ax.plot(xd, yd, 'o', color=(rc, gc, bc),
            markersize=sz, alpha=al, zorder=5)

# Fovea core — layered bloom
for r_f, a_f in [(110,0.04),(78,0.07),(50,0.11),(30,0.17),(16,0.26),(8,0.45)]:
    ax.add_patch(Circle((RCX,RCY), r_f, color=AMB, alpha=a_f, zorder=7))
# Crisp white pinpoint
ax.plot(RCX, RCY, 'o', color=WG, markersize=6.5, alpha=0.98, zorder=9)
ax.plot(RCX, RCY, 'o', color=WG, markersize=11,  alpha=0.22, zorder=9)

# Optic disc
dx, dy = RCX+260, RCY+72
ax.add_patch(Circle((dx,dy), 38, fill=False, edgecolor=TD,
             linewidth=0.5, alpha=0.32, linestyle=':', zorder=6))
ax.text(dx, dy-52, 'optic disc',
        ha='center', va='top', fontsize=5.8, color=TD,
        fontproperties=fp_ibm_r, alpha=0.30, zorder=8)
ax.text(RCX, RCY+98, 'fovea centralis',
        ha='center', va='bottom', fontsize=5.8, color=TD,
        fontproperties=fp_ibm_r, alpha=0.28, zorder=8)

# ════════════════════════════════════════════════════════════════════════════════
# DIVIDER BAND
# ════════════════════════════════════════════════════════════════════════════════
DIV = int(H * 0.535)
ax.plot([ML-20, W-MR+20], [DIV, DIV],
        color=TD, linewidth=0.35, alpha=0.30, zorder=6)

# Gene annotation
ax.text(ML, DIV+28,
        'CDHR1',
        ha='left', va='bottom', fontsize=7.8,
        color=AMB2, fontproperties=fp_ibm_b, alpha=0.50, zorder=10)
ax.text(ML+72, DIV+26,
        'Cadherin-Related Family Member 1  /  Autosomal Recessive Retinal Dystrophy',
        ha='left', va='bottom', fontsize=6.2,
        color=TD, fontproperties=fp_ibm_r, alpha=0.32, zorder=10)
ax.text(W-MR, DIV+28,
        'OMIM #609. Xq22.1',
        ha='right', va='bottom', fontsize=6.2,
        color=TD, fontproperties=fp_ibm_r, alpha=0.25, zorder=10)

# ════════════════════════════════════════════════════════════════════════════════
# DECAY CURVE SECTION
# ════════════════════════════════════════════════════════════════════════════════

# Gradient dark veil — fades from transparent (top) to opaque BG (bottom)
# Ensures clean chart zone while blending naturally with the retinal field
VEIL_TOP  = DIV + 400   # where gradient starts (inside retinal field)
VEIL_BOT  = DIV - 60    # where it becomes fully opaque
n_bands = 80
for i in range(n_bands):
    frac   = i / (n_bands - 1)
    y_bot  = VEIL_BOT + (VEIL_TOP - VEIL_BOT) * (1 - frac)
    y_top  = VEIL_BOT + (VEIL_TOP - VEIL_BOT) * (1 - frac + 1/n_bands)
    # alpha: 0 at top (frac=0 → near VEIL_TOP), 1 at bottom (frac→1)
    band_a = frac ** 1.8 * 0.94
    ax.add_patch(patches.Rectangle(
        (0, y_bot), W, y_top - y_bot,
        facecolor=BG, alpha=band_a, zorder=1
    ))

# Solid dark fill below VEIL_BOT
ax.add_patch(patches.Rectangle(
    (0, 0), W, VEIL_BOT,
    facecolor=BG, alpha=0.96, zorder=1
))

# Grid
for x in np.linspace(CURVE_L, CURVE_R, 21):
    ax.plot([x,x],[CURVE_B,CURVE_T], color=GRIDC, lw=0.36, alpha=1.0, zorder=1)
for y in np.linspace(CURVE_B, CURVE_T, 11):
    ax.plot([CURVE_L,CURVE_R],[y,y], color=GRIDC, lw=0.36, alpha=1.0, zorder=1)
for x in np.linspace(CURVE_L, CURVE_R, 101):
    ax.plot([x,x],[CURVE_B,CURVE_T], color=GRIDC, lw=0.10, alpha=0.55, zorder=1)
for y in np.linspace(CURVE_B, CURVE_T, 51):
    ax.plot([CURVE_L,CURVE_R],[y,y], color=GRIDC, lw=0.10, alpha=0.55, zorder=1)

# Impairment bands
bands = [
    (0.85,1.00,'#152015',0.11,'normal'),
    (0.70,0.85,'#201A0C',0.13,'mild'),
    (0.50,0.70,'#1C1208',0.14,'moderate'),
    (0.30,0.50,'#180E06',0.15,'severe'),
    (0.00,0.30,'#130808',0.13,'profound'),
]
for e_lo,e_hi,bc_,ba_,bl_ in bands:
    _,ylo=dc(0,e_lo); _,yhi=dc(0,e_hi)
    ax.add_patch(patches.Rectangle((CURVE_L,ylo),CW,yhi-ylo,
                 facecolor=bc_, alpha=ba_, zorder=2))
    ym = (ylo+yhi)/2
    ax.text(CURVE_R+34, ym, bl_,
            ha='left', va='center', fontsize=6.2,
            color=TM, fontproperties=fp_ibm_r, alpha=0.60, zorder=8)
    ax.plot([CURVE_R+8,CURVE_R+30],[ym,ym],
            color=TD, lw=0.35, alpha=0.28, zorder=8)

# Axis lines
ax.plot([CURVE_L,CURVE_R+20],[CURVE_B,CURVE_B],
        color=TM, lw=0.65, alpha=0.35, zorder=4)
ax.plot([CURVE_L,CURVE_L],[CURVE_B,CURVE_T+20],
        color=TM, lw=0.65, alpha=0.35, zorder=4)

# Ticks
for yr_t in range(0,21):
    cxt,_ = dc(yr_t,0)
    maj   = yr_t%5==0
    tl    = 20 if maj else 9
    ax.plot([cxt,cxt],[CURVE_B-tl,CURVE_B],
            color=TM, lw=(0.8 if maj else 0.38), alpha=0.60, zorder=4)
    if maj:
        ax.text(cxt, CURVE_B-32, f'{yr_t}',
                ha='center', va='top', fontsize=7.2,
                color=TM, fontproperties=fp_ibm_r, zorder=4)

for e_t in np.arange(0,1.01,0.1):
    _,cyt = dc(0,e_t)
    maj   = abs(e_t%0.5)<0.001
    tl    = 20 if maj else 9
    ax.plot([CURVE_L-tl,CURVE_L],[cyt,cyt],
            color=TM, lw=(0.8 if maj else 0.38), alpha=0.60, zorder=4)
    if maj or abs(e_t-0.1)<0.001 or abs(e_t-0.3)<0.001:
        ax.text(CURVE_L-28, cyt, f'{e_t:.1f}',
                ha='right', va='center', fontsize=7.0,
                color=TM, fontproperties=fp_ibm_r, zorder=4)

# Axis labels
ax.text(CURVE_L+CW/2, CURVE_B-76,
        'T   ( years )',
        ha='center', va='top', fontsize=8.2,
        color=TM, fontproperties=fp_ibm_r, zorder=4)
ax.text(CURVE_L-178, CURVE_B+CH/2,
        'ERC ( t )',
        ha='center', va='center', fontsize=8.2,
        color=TM, fontproperties=fp_ibm_r, zorder=4, rotation=90)

# Fill under curve — extremely subtle
from matplotlib.patches import Polygon
fill_pts = list(zip(
    [dc(y,e)[0] for y,e in zip(years,erc_arr)],
    [dc(y,e)[1] for y,e in zip(years,erc_arr)]
))
fill_pts += [(dc(20,0)[0], CURVE_B), (dc(0,0)[0], CURVE_B)]
poly = Polygon(fill_pts, closed=True,
               facecolor=AMB, alpha=0.012, zorder=3)
ax.add_patch(poly)

# Curve glow layers
cxv = [dc(y,e)[0] for y,e in zip(years,erc_arr)]
cyv = [dc(y,e)[1] for y,e in zip(years,erc_arr)]
for lw_,al_,col_ in [
    (32, 0.007, AMB),
    (20, 0.015, AMB),
    (12, 0.033, AMB),
    (7,  0.070, AMB2),
    (4,  0.16,  AMB2),
    (2.2,0.45,  '#E8C060'),
    (1.1,0.92,  WG),
]:
    ax.plot(cxv,cyv, color=col_, lw=lw_, alpha=al_,
            solid_capstyle='round', zorder=6)

# Photoreceptor markers — more luminous halos
for yr_s in [0,1,2,3,4,5,6,7,8,9,10,12,14,16,18,20]:
    e_s = ERC0*np.exp(-r_G*yr_s)
    cxs,cys = dc(yr_s,e_s)
    iv = e_s
    # Three halo rings per marker
    for hr,ha_,hw_ in [
        (iv*52+16, 0.035*iv, 0.4),
        (iv*32+10, 0.080*iv, 0.6),
        (iv*18+6,  0.160*iv, 0.8),
    ]:
        ax.add_patch(Circle((cxs,cys), hr, fill=False,
                     edgecolor=AMB, lw=hw_, alpha=ha_, zorder=7))
    # Core: amber hot at year 0, cool silver at year 20
    r_ = min(1.0, 0.990*iv + 0.478*(1-iv))
    g_ = min(1.0, 0.720*iv + 0.561*(1-iv))
    b_ = 0.090*iv + 0.659*(1-iv)
    inner_r = 6 + iv*16
    ax.add_patch(Circle((cxs,cys), inner_r,
                 color=(r_,g_,b_), alpha=0.95, zorder=8))
    # Bright pinpoint center
    ax.plot(cxs, cys, 'o', color=WG,
            markersize=max(1.0, iv*3.5), alpha=0.85*iv+0.10, zorder=9)

# Crosshairs at origin and endpoint
for yr_x,col_x,al_x in [(0,AMB2,0.52),(20,SIL,0.38)]:
    ex   = ERC0*np.exp(-r_G*yr_x)
    cxx,cyx = dc(yr_x,ex)
    arm = 25
    ax.plot([cxx-arm,cxx+arm],[cyx,cyx],color=col_x,lw=0.7,alpha=al_x,zorder=8)
    ax.plot([cxx,cxx],[cyx-arm,cyx+arm],color=col_x,lw=0.7,alpha=al_x,zorder=8)
    lbl  = f'({yr_x},  {ex:.3f})'
    ox   = 28 if yr_x==20 else -28
    hax  = 'left' if yr_x==20 else 'right'
    ax.text(cxx+ox, cyx+22, lbl,
            ha=hax, va='bottom', fontsize=6.2,
            color=col_x, fontproperties=fp_ibm_r, alpha=0.52, zorder=8)

# Moderate threshold dashed drop
t_mod = -math.log(0.50)/r_G
if t_mod<=20:
    cxm,cym = dc(t_mod,0.50)
    ax.plot([cxm,cxm],[CURVE_B,cym],
            color=AMB3, lw=0.7, ls='--', alpha=0.38, zorder=5)
    ax.text(cxm+14, CURVE_B+36,
            f'yr {t_mod:.1f}  /  0.50 ERC',
            ha='left', va='bottom', fontsize=6.0,
            color=AMB3, fontproperties=fp_ibm_r, alpha=0.52, zorder=8)

# Formula — top-right of chart area
ax.text(CURVE_R-18, CURVE_T-44,
        'ERC(t)  =  ERC0 * exp( -r  *  t )',
        ha='right', va='top', fontsize=9.2,
        color=TP, fontproperties=fp_ibm_r, alpha=0.48, zorder=10)
ax.text(CURVE_R-18, CURVE_T-86,
        'r = 0.035 yr-1        ERC0 = 1.000',
        ha='right', va='top', fontsize=7.5,
        color=TM, fontproperties=fp_ibm_r, alpha=0.40, zorder=10)

# ════════════════════════════════════════════════════════════════════════════════
# TITLE BLOCK
# ════════════════════════════════════════════════════════════════════════════════

# Top-right classification (upper right corner)
ax.text(W-MR, H-90,
        'RETINAL CARTOGRAPHY  /  FIG. 01',
        ha='right', va='top', fontsize=7.2,
        color=TD, fontproperties=fp_ibm_r, alpha=0.52, zorder=12)
ax.text(W-MR, H-126,
        'Photoreceptor Sensitivity Decay  —  Human Macula',
        ha='right', va='top', fontsize=6.5,
        color=TD, fontproperties=fp_ibm_r, alpha=0.30, zorder=12)

# Large title — WorkSans Bold — anchored left with generous margin
T_TOP = H - 85        # Title baseline-top
ax.text(ML + 30, T_TOP,
        'PHOSPHENE',
        ha='left', va='top', fontsize=82,
        color=TP, fontproperties=fp_sans_b, alpha=0.93, zorder=12)

# Subtitle — IBMPlexMono ensures even spacing; spaces give visual tracking
T_SUB = T_TOP - 342 - 42
ax.text(ML + 36, T_SUB,
        'L  O  G  I  C',
        ha='left', va='top', fontsize=24,
        color=AMB, fontproperties=fp_ibm_r, alpha=0.84, zorder=12)

# Thin horizontal rule beneath subtitle
T_RULE = T_SUB - 90
ax.plot([ML, W-MR], [T_RULE, T_RULE],
        color=GHOST, lw=0.45, alpha=1.0, zorder=11)

# ════════════════════════════════════════════════════════════════════════════════
# COLOPHON
# ════════════════════════════════════════════════════════════════════════════════
ax.plot([ML, W-MR], [160, 160],
        color=GHOST, lw=0.45, alpha=0.9, zorder=11)
ax.text(ML, 126,
        'FIG. 01  —  PHOTORECEPTOR SENSITIVITY DECAY  /  20-YEAR PROJECTION',
        ha='left', va='top', fontsize=6.2,
        color=TD, fontproperties=fp_ibm_r, alpha=0.38, zorder=12)
ax.text(W-MR, 126,
        'ERC MODEL  *  PHOSPHENE LOGIC  *  2026',
        ha='right', va='top', fontsize=6.2,
        color=TD, fontproperties=fp_ibm_r, alpha=0.38, zorder=12)

# ════════════════════════════════════════════════════════════════════════════════
# GHOST LIGHT TRACES — fovea to curve origin
# ════════════════════════════════════════════════════════════════════════════════
ocx,ocy = dc(0,1.0)
for i in range(7):
    f = (i+1)/8
    sp = (f-0.5)*280
    ax.plot([RCX,(RCX+ocx)/2+sp,ocx],
            [RCY,(RCY+ocy)/2,ocy],
            color=AMB, lw=0.25, alpha=0.016, zorder=2)

# ── Clip and save ─────────────────────────────────────────────────────────────
ax.set_xlim(0,W); ax.set_ylim(0,H)
out = "/Users/rodrigofelipefernandes/Documents/@Engenharia/Projetos/health-farpa-ai/design/phosphene-logic.png"
fig.savefig(out, dpi=DPI, bbox_inches='tight', pad_inches=0,
            facecolor=BG, edgecolor='none')
print(f"Saved: {out}")
plt.close(fig)
