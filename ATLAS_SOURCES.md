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

「南北鹿港經典古蹟」is a regional description in the existing 150-minute plan. It deliberately has **no coordinate or point marker**. Selecting it highlights the north–south connection. No new sellable sights, opening hours, admission fees or guaranteed visits were inferred from these sources.

## Street geometry and license

© [OpenStreetMap contributors](https://www.openstreetmap.org/copyright), [Open Database License (ODbL) 1.0](https://opendatacommons.org/licenses/odbl/1-0/).

Retrieved through the public OSM map API, bounding box `120.4305,24.0495,120.4375,24.0602`. Selected named ways: 中山路、民權路、民族路、三民路、館前街、菜園路、金盛巷、龍山街. The delivered offline extraction is in `src/data/atlasStreets.js`; each entry retains its OSM way ID. This OSM-derived coordinate dataset is made available under ODbL. Website/application code is not relicensed by this notice.

No random buildings, synthetic road curves, guessed watercourses, unverified historic coastline or external map tiles. Some smaller lanes are not present in this street extraction and are not invented. No live OSM/API requests occur when a guest opens the site. On-page attribution and source links remain visible.

## Projection and interpretation

Both streets and sights use exactly the same axis-aligned transform:

```
x = 70 + (longitude - 120.431) × 80000
y = 45 + (24.0598 - latitude) × 43000
```

Coordinates are rounded to 0.1 SVG units in a `600 × 500` viewBox. North remains up and east remains right. The east–west axis is deliberately expanded relative to north–south; mobile uses a shorter canvas. **Not to scale.** No distance scale is shown because distances would be misleading.

Printed-number callouts are displaced for touch spacing. Fine leaders terminate at the unchanged geographic anchors. All seven callouts remain visible; included sights use brick and other sights muted ink. Selecting an out-of-duration sight does not silently change the plan: it is explicitly labelled as a customization inquiry.

Route connections are editorial links between sights, **not road-following driving directions**, a promised order, or a guarantee that an electric vehicle can enter any particular lane. The real street network is a separate, quieter layer. Existing `src/data/tours.js` remains the commercial source of truth: the 90-minute list does not include Osmanthus Alley even though the 60-minute list does. The atlas preserves that difference, rather than inventing nested packages. The 150-minute option expands east to Koo House and spans north–south.

## Maintenance

Update coordinates only with a cited official source, then project both road and sight data consistently. Do not move geographic anchors to resolve collisions: adjust `label` positions instead. Run `npm test`, including mobile callout separation tests, after every map data/layout change.
