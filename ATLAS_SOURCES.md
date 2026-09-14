# Lukang Route Atlas — geographic sources

Verified 2026-09-06. This is an editorial cultural atlas, not navigation, an access map, a historical reconstruction, or a fixed itinerary.

## Sight anchors

Source: Changhua County Government's records on the Taiwan Tourism Administration Open Multimedia Data portal. Coordinates below are the published WGS84 representative locations, not surveyed building entrances. In particular, Old Street and the lanes are linear places represented by a point.

| Existing repository sight | Latitude | Longitude | Official record |
| --- | --- | --- | --- |
| 鹿港天后宮 | 24.05937 | 120.4315 | [000091](https://media.taiwan.net.tw/zh-tw/portal/travel/details/attraction_376470000a_000091) |
| 桂花巷藝術村 | 24.05585 | 120.4319 | [000202](https://media.taiwan.net.tw/zh-tw/portal/travel/details/attraction_376470000a_000202) |
| 鹿港老街 | 24.05592 | 120.4328 | [000139](https://media.taiwan.net.tw/zh-tw/portal/travel/details/attraction_376470000a_000139) |
| 辜家大宅／鹿港民俗文物館 | 24.05388 | 120.4365 | [000137](https://media.taiwan.net.tw/zh-tw/portal/travel/details/attraction_376470000a_000137) |
| 九曲巷 | 24.05346 | 120.435 | [000130](https://media.taiwan.net.tw/zh-tw/portal/travel/details/attraction_376470000a_000130) |
| 摸乳巷 | 24.0517 | 120.4323 | [000134](https://media.taiwan.net.tw/zh-tw/portal/travel/details/attraction_376470000a_000134) |
| 鹿港龍山寺 | 24.05038 | 120.4349 | [000079](https://media.taiwan.net.tw/zh-tw/portal/travel/details/attraction_376470000a_000079) |

「南北鹿港經典古蹟」is a regional description in the existing 150-minute plan. It deliberately has **no coordinate or point marker**. It is regional context, without a drawn route connection. No new sellable sights, opening hours, admission fees or guaranteed visits were inferred from these sources.

## Active street geometry and license (2026-09-12)

© OpenStreetMap contributors, ODbL 1.0: https://www.openstreetmap.org/copyright . Current data: `src/data/townAtlasRoads.js`, 31 named ways / 209 WGS84 nodes, retrieved 2026-09-11 from https://www.openstreetmap.org/api/0.6/map?bbox=120.4305,24.0495,120.4375,24.0602 . Original response: artifacts/atlas-osm-20260911.xml. The OSM-derived coordinate dataset remains available under ODbL; application code is not relicensed.

Three principal roads (中山路、民權路、三民路), cultural lanes (瑤林街、埔頭街、桂花巷藝術村、金盛巷、九曲巷、摸乳巷), quieter context streets (文開路、民族路、館前街、菜園路、龍山街). Complete node coordinates are retained for selected ways. No invented links or road curves. Streets are clipped by the viewport, not extended by hand. The older atlasStreets.js remains a legacy extract, not the active renderer.

## Active projection and responsive layout

`townProject` in src/data/townAtlas.js is a local equirectangular projection:

- x = 70 + (longitude − 120.431) × 56000 × cos(24.055°)
- y = 50 + (24.0598 − latitude) × 56000
- Mobile adds 60 to x for framing only; it does not change geographic proportions.
- Desktop viewBox 480 × 680, matching CSS aspect ratio 12 / 17. Mobile viewBox 600 × 680, matching 15 / 17. Neither stretches SVG axes. Compass north is up, east right.

All roads and geographic anchors use the same function. The previous expanded-longitude projection in atlas.js is retained for legacy helpers/tests only, not this renderer. There is no navigation scale or promised vehicle access.

TOWN_LABELS stores distinct desktop/mobile callout arrangements keyed by sight ID. Fine dashed leaders end beside text, with one common offset rule per layout. Actual anchor coordinates never move to solve collisions. Four monochrome drawings are place callouts, not geographic building footprints.

## Architectural observations

- Tianhou: layered eaves, raised roof ends, central columns/entrance observed at https://tourism.chcg.gov.tw/upload/27/2023103114161448720.jpg (official attraction 000091).
- Longshan: broad low five-door hall, recessed entrances and side arches observed at https://tourism.chcg.gov.tw/upload/27/2023051611271545195.jpg (official attraction 000079).
- Koo House: twin domed towers / central facade, repository public/photos/lukang-koo-house.jpg.
- Osmanthus Alley: low eaves / window bays, repository public/photos/lukang-art-village.jpg.

Sketches are original simplified SVG geometry, not photo copies or architectural surveys. Official temple photos are reference only, not new public photo assets. Longshan's previous standalone caisson icon has been removed from the map.

## Interaction and maintenance

Brick highlights exactly the reference membership in tours.js; other landmarks remain muted and browsable. No route paths, arrowheads, fixed start or promised stop sequence. Selecting a place only changes the description; it does not add a booking preference or change duration. Seven physical places have callouts; the north/south regional entry deliberately has no fabricated coordinate.

Verification: scripts/town-atlas.test.mjs covers geographic aspect, shared projection, authentic lane IDs/presence, four drawing types, distinct mobile placement and exact plan membership. scripts/town-atlas-qa.mjs covers both languages, ten widths, three times, all seven buttons, actual clicks, keyboard duration tabs, 44px targets, separation/containment, aspect-ratio and page errors. Human visual review remains necessary for new labels/drawings.
