# Manje 3D Character Production Spec

## Goal

Create a true 3D Manje base model that matches the approved 2D mascot system in `assets/character` and the transparent exports in `assets/character-transparent`.

The first approval target is `models/manje-base.glb`. Mood and pose variants should only be produced after the base model identity is approved.

## Source Of Truth

- Character identity: young Black male financial companion, warm and approachable, polished "cool geek" energy.
- Face and hair: rounded friendly 3D style, expressive large eyes, short textured curls, neat brows, trimmed goatee.
- Brand wardrobe:
  - Formal: white/off-white shirt, green tie, dark trousers, brown shoes, Manje badge.
  - Casual: green overshirt or hoodie, tan trousers or loungewear, gold/green accents.
- Brand colors: deep green `#0D3B2E`, primary green `#1A6B4A`, gold `#F5C518`, dark gold `#B07D08`, off-white `#F8FAF9`.

## Required Model Deliverable

- Primary model: `models/manje-base.glb`
- Optional DCC interchange: `models/manje-base.fbx`
- Optional iOS AR preview: `models/manje-base.usdz`

The model should include:

- Clean humanoid topology suitable for posing.
- Separate materials for skin, hair, shirt, tie, trousers, shoes, badge, and accessories.
- PBR-style materials that preserve the soft 3D mascot look rather than photoreal skin.
- Neutral front-facing rest pose suitable for reuse across moods.
- Texture resolution suitable for mobile use, preferably 2K max per material set.

## First Approval Checks

- Looks like the same Manje mascot from the 2D assets.
- Works from front, side, and three-quarter angles.
- Hair silhouette is full and not clipped.
- Clothing badge and green/gold palette are visible.
- No uncanny realism shift; keep the friendly stylized mascot feel.
- Polygon count is mobile-conscious and can be reduced for runtime if needed.

## References

- `references/manje-3d-base-reference-sheet.jpg`
- `references/manje-3d-pose-mood-atlas.jpg`
- `../character-transparent/manifest.json`

