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

## Active street geometry and license (2026-09-20)

© OpenStreetMap contributors, ODbL 1.0: https://www.openstreetmap.org/copyright . Current `src/data/townAtlasRoads.js` preserves 62 ways with original WGS84 coordinates and node IDs. Source: https://www.openstreetmap.org/api/0.6/map?bbox=120.4295,24.0475,120.4400,24.0615 ; checked-in response: `artifacts/atlas-osm-20260920.xml`. The OSM-derived coordinate dataset remains available under ODbL; application code is not relicensed.

Only selected contextual lanes and three principal roads (中山路、民權路、三民路) form the base map. Other extracted ways support the selected exploration line. Original shared nodes preserve intersections; no invented connectors. Minquan is NE–SW, Zhongshan NNW–SSE, and Sanmin approximately east–west.

## Active projection and responsive layout

`townProject` applies the same unrotated editorial transform to roads and geographic anchors:

- x = 90 + (longitude − 120.431) × 40000 + (desktop ? 40 : 0)
- y = 105 + (24.05937 − latitude) × 65000
- Desktop viewBox 480 × 850; mobile 400 × 850. North is up, east right.
- Longitude is compressed relative to latitude; this is not an equidistant projection. Distances come from WGS84 road geometry, never screen pixels. No scale bar.

Tier 1: Tianhou, Old Street and Longshan. Tier 2: four cultural sights. Tier 3: restrained public landmarks (Lukang Assembly Hall, first multistorey car park, Wenwu–Wenkai complex). See `ATLAS_GEOGRAPHY_REVISION.md` for source links and coordinates. Architectural drawings are stylized callouts, not surveyed footprints. HTML labels use short leaders terminating at the measured label edge; extension captions avoid nearby text and road crossings without moving geographic anchors.

## Architectural observations

- Tianhou: layered eaves, raised roof ends, central columns/entrance observed at https://tourism.chcg.gov.tw/upload/27/2023103114161448720.jpg (official attraction 000091).
- Longshan: broad low five-door hall, recessed entrances and side arches observed at https://tourism.chcg.gov.tw/upload/27/2023051611271545195.jpg (official attraction 000079).
- Koo House: twin domed towers / central facade, repository public/photos/lukang-koo-house.jpg.
- Osmanthus Alley: low eaves / window bays, repository public/photos/lukang-art-village.jpg.

Sketches are original simplified SVG geometry, not photo copies or architectural surveys. Official temple photos are reference only, not new public photo assets. Longshan's previous standalone caisson icon has been removed from the map.

## Interaction and maintenance

Brick highlights the existing exact plan membership. Thin exploration lines are offline editorial examples along connected OSM walkable edges, not vehicle directions or guaranteed stops. `atlasItineraries.js` retains node/way IDs and distances; raw-OSM tests verify every edge. Private/no-access/foot=no/area=yes ways are excluded from path preparation. Snapshot data does not guarantee current access.

Browsing preserves duration and booking data. Explicit preferences are temporary component state, separately copyable, and are not silently added to booking notes or LINE text. Reloading/language navigation clears this temporary list. Duration controls continue synchronizing the existing price calculation. Regional descriptions have no fabricated point.

Walking hints use only 134 m (Old Street–Osmanthus) and 377 m (Molu–Longshan), rounded for display; 60–80 m/min estimates exclude visits, waiting and small representative-point snap gaps. No unsupported dwell-time estimates.

Validation: `scripts/atlas-geography.test.mjs` and `scripts/town-atlas.test.mjs`, plus responsive browser checks documented in `ATLAS_GEOGRAPHY_REVISION.md`. Older standalone browser scripts describe prior layouts and are not evidence of this revision's visual verification.
