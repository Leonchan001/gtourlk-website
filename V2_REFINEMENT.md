# GtourLK focused V2 refinement

Completed 2026-09-07. Repository `Leonchan001/gtourlk-website`, branch `redesign/world-class-v1`.

No commit, push, merge or deployment. `HEAD` and `main` remain `44a7fe3eace85c8ef2e7213c6a53406e82c6d8a6`. Existing uncommitted V1 work is retained.

## All V2 changes

### Lukang Route Atlas

- Replaced invented building rectangles and arbitrary sight positions with an offline SVG cultural atlas.
- Seven official representative sight coordinates; real named street geometry from OpenStreetMap. North–south and east–west relationships are preserved. Callout positions can move for readability; geographic anchors cannot.
- Visible north/south labels, street names, restrained numbered editorial callouts, brick connections, selected-segment emphasis and geographic anchor rings. Other sights and street structure remain visible.
- The existing 60/90/150-minute commercial sight memberships are unchanged. Longer durations expand southward and toward Koo House, without inventing nested packages or fixed driving routes.
- 「南北鹿港經典古蹟」is an area selector, not an invented eighth geographic point.
- Full bilingual short descriptions, in-page official source links, OSM attribution and explicit non-navigation/customizable-route notes.
- Out-of-duration sights remain explorable and are clearly labelled as customization inquiries. Exploring does not silently add a sight to the Booking Builder.

### Mobile interaction

- Duration tabs → compact map → adjacent horizontal stop strip → short selected detail → planning CTA.
- Map labels/numbered nodes, geographic anchors and stop strip update the same selection. The selected chip scrolls horizontally into view; the website does not scroll the page on selection.
- Primary map callouts and all controls have at least 44px targets. Callouts do not overlap at the tested widths. No hover, dragging, sticky map or pan/zoom dependency.
- Stable canvas and reserved detail space; no added vertical list when duration changes. Full primary module fits even a 320 × 568 viewport below the 72px header.
- Duration tabs retain arrow keys, Home/End and roving tab focus. Native map/chip buttons retain keyboard focus and pressed state. Selected detail is a polite live region; reduced motion disables drawing animation.

### Palette and booking CTA

- Removed green-tinted ink, deep backgrounds, borders and muted text. Warm ink `#322d29`, smoked charcoal `#2c2723`, warm muted text `#70675e`; brick `#943f31` remains the primary accent.
- Reviews/Footer retain their V1 composition and hierarchy. Hero layout/photo/copy remain unchanged; its overlay tint follows the warmer palette.
- Desktop floating booking link is now a quiet paper/ink control, measured 138 × 44px in Chinese, without the previous heavy shadow.
- Mobile uses a bottom, safe-area-aware, full-width booking CTA. It stays hidden over Hero, while the Atlas is visible, and when Booking enters the viewport or has been passed. No duplicate Booking CTA.
- Removed unused V1 RouteExplorer CSS and animations rather than leaving competing overrides.

### Performance and build

- No new product dependency, map SDK, map tile request, font request to a third-party service, generated photo or raster asset.
- Do not measure the offscreen stop strip on hydration; horizontal measurement is deferred until a local interaction.
- The prerender step now embeds the existing ~11.33 kB gzip stylesheet into both static HTML documents. This removes a render-blocking stylesheet round trip without changing CSS, hydration or metadata. Tradeoff: CSS is included in each language document rather than shared as a separately cached initial request.
- Final compressed HTML: Chinese 26,409 bytes; English 24,878 bytes. Product JS: 214.20 kB / 73.20 kB gzip (V1 ~69.41 kB gzip). No large framework added.
- Lighthouse runner now fails explicitly on a navigation/runtime error rather than misleadingly reporting zero category scores.
- Existing local font subsets are unchanged. Refreshing them through Google Fonts was declined by the execution safety review because the request would send repository-derived characters externally. That operation was not bypassed; missing characters use the existing system fallback. A future refresh needs explicit authorization for that data transfer or an appropriately licensed offline font source.

## V1 preserved

SHA-256 checks before/after V2 match for `App.jsx`, `Hero.jsx`, `BrandStatement.jsx`, `ExperienceStory.jsx`, `SocialProof.jsx`, `Pricing.jsx`, `Contact.jsx`, `FAQ.jsx`, `i18n.jsx`, `tours.js`, `booking.js`, `index.html` and `en/index.html`.

Homepage IA, Hero photography, brand/experience storytelling, review data, pricing and discount logic, shared trip state, LINE flow, FAQ, canonical/hreflang/metadata/JSON-LD and business facts remain unchanged. Palette changes are centralized in CSS. `TODO_PHOTOGRAPHY.md` is unchanged.

## Changed files — V2 only

| File | V2 change |
| --- | --- |
| `src/components/RouteExplorer.jsx` | Atlas, shared selection, compact mobile flow, provenance |
| `src/components/RouteExplorer.css` | New scoped atlas visual/responsive/motion rules |
| `src/data/atlas.js` | Verified coordinates, bilingual descriptions, projection, selection helpers |
| `src/data/atlasStreets.js` | Offline OSM geometry and way IDs |
| `src/components/FloatingCTA.jsx` | Atlas/Booking visibility behavior |
| `src/index.css` | Warm palette, lighter desktop/mobile CTA, remove old route CSS |
| `src/data/experienceCopy.js` | Only route map labels/help text |
| `scripts/atlas.test.mjs` | Seven new geographic/data/layout unit tests |
| `scripts/atlas-browser-qa.mjs` | Isolated browser touch/keyboard/viewport regression checks |
| `scripts/prerender.mjs` | Inline emitted CSS into static language documents |
| `scripts/site.test.mjs` | Assert non-blocking inline CSS output |
| `scripts/lighthouse.mjs` | Explicit navigation/runtime failure handling |
| `ATLAS_SOURCES.md` | Geographic provenance, ODbL attribution, projection limitations |
| `V2_REFINEMENT.md` | This changelog and QA handoff |

`dist/` and ignored `artifacts/` were regenerated. Package manifests, lockfile, product dependencies, photographs and font files were not changed in V2. The full Git worktree diff also contains the preceding V1 implementation; it must not be mistaken for the V2-only list above.

## Verification

- `npm run build`: passed, including both pre-rendered languages.
- `npm test`: **19/19 passed** (existing 12 + seven atlas tests).
- No lint script exists. Formatting checked with local Prettier; `git diff --check` passes (Git emits only existing LF/CRLF normalization warnings).
- Isolated headless Chrome touch tests, not locator auto-scroll: all physical sights at all three durations, map → chip and chip → map, geographic area selector, inclusion labels, horizontal reveal, no target collisions, reduced motion, mobile CTA and Booking entry.
- No page errors or console errors in the browser regression suite.

| Mobile viewport | Module height, Chinese / English | Vertical jump tolerance | Height change tolerance |
| --- | --- | --- | --- |
| 320 × 568 | 496 / 496px | ≤1px | ≤1px |
| 375 × 667 | 499.50 / 499.69px | ≤1px | ≤1px |
| 390 × 844 | 508.19 / 508.38px | ≤1px | ≤1px |
| 430 × 932 | 531.39 / 531.58px | ≤1px | ≤1px |

Desktop/tablet: 768, 1024, 1440 and 1920px; no horizontal overflow, duration keyboard navigation passes, small floating CTA and Booking suppression pass.

### Final Lighthouse (mobile, local production preview)

| Language | Performance | Accessibility | Best Practices | SEO | FCP | LCP | TBT | CLS |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Chinese | 90 | 100 | 100 | 100 | 1.5s | 3.6s | 20ms | .001 |
| English | 95 | 100 | 100 | 100 | 1.2s | 2.9s | 40ms | 0 |

Reports: `artifacts/lighthouse-zh-v2-inline.json`, `artifacts/lighthouse-en-v2-inline.json`. Earlier pre-inline Chinese results ranged 85–91; these are retained as diagnostics, not presented as the final result. A failed run while the preview server was stopped is not a valid audit. These are lab measurements, not deployed field Core Web Vitals or a guarantee of scores on every run.

Browser results: `artifacts/atlas-browser-qa.json`; screenshots `artifacts/atlas-{zh,en}-{320,375,390,430}.png`, `artifacts/cta-*.png`, `artifacts/atlas-desktop-*.png`.

Re-run optional browser QA with `CHROME_PATH` pointing to Chrome and the existing `.tooling/qa` tools. QA libraries are intentionally not added to the shipping dependency tree.

## Remaining limitations / next iteration

1. This atlas is deliberately anisotropic, with representative sight coordinates and editorial connections. It is **not a navigation map or a promise of driving access**. Smaller streets missing from the selected dataset were not invented. See `ATLAS_SOURCES.md`.
2. Test on physical iOS Safari and Android devices, including browser chrome/safe-area behavior and larger accessibility text settings. The current checks are Chrome viewport/touch emulation; increased text sizes may reasonably need more vertical space.
3. Chinese simulated LCP is still 3.6s. Validate actual hosting compression, caching and field metrics before claiming production Core Web Vitals success. If a future host imposes a strict style CSP, authorize the generated inline stylesheet with an appropriate hash/nonce.
4. Have a local guide review geographic interpretation and preferred narrative order. Keep commercial itineraries in `tours.js`, rather than treating drawn connections as fixed packages.
5. Continue the existing photography plan when real photography becomes possible; no new photography is needed to use V2 now.
