# V3.1 — Atlas + Booking UX Refinement

2026-09-10 · Leonchan001/gtourlk-website · `redesign/world-class-v1`

本輪接續尚未提交的 V3 working tree。沒有重建網站、切換分支、commit、push、merge 或 deploy。以下只列 V3.1 增量，不把原有 V3 修改算成本輪成果。

## 1. 問題與資料流

原本 Atlas、Pricing、Booking 已共用 App 的 `trip.minutes`；但 Atlas 的景點檢視是 local state，Booking 的景點偏好只是一個陣列，沒有時長判斷或優先級。三份 tours.js 參考清單並非累積套裝，因此切換地圖時看起來像換路線。

本輪保留商業參考清單，另以「累積探索圖層」解釋增加時間的價值。Booking 的推薦使用相同資料推導分級；不推算精準車程、不捏造景點停留分鐘、不把偏好改成保證行程。

## 2. Atlas 修改

- 保留所有 WGS84 座標、標籤錨點與既有 OSM 街道底圖，沒有交換景點位置或新增假景點。
- 60 分鐘顯示北鹿港核心；90 保留核心並展開巷弄、龍山寺；150 保留前兩層，延伸到辜家大宅。未啟用的連線仍淡淡可見。
- 地圖顯示鹿港地名、較清楚的南北區域文字與低對比閱讀分區；淡色不是行政區邊界，也不是河流或道路。
- 天后宮標示「讀圖起點」，目前層使用一個克制的方向提示。這不是上車點、實際順序或導航線，地圖下明確說明集合地點與順序另行確認。
- 移除重複編號與橫向景點 chip 清單；改為地圖旁／下方 native 景點選單，與地圖按鈕雙向同步。沒有水平操作需求，保留全名及鍵盤操作。
- 地圖標籤縮小視覺底色，仍保留 44px 以上的實際按鈕範圍；手機減少次要道路文字，沒有另建一套座標。
- 每個時長顯示一句新增價值，以及「以 N 分鐘開始安排」CTA，沿用已修正的 Booking 捲動與標題焦點。

Repository 沒有寧靖王府資料。本輪保留已有辜家大宅，不自行新增寧靖王府的座標、故事或商業路線。

## 3. Booking UX 修改

- 景點選擇旁依 60／90／150 顯示 guidance，保留偏好不等於保證停靠的說明。
- 偏好多或涵蓋較高分級時，出現一般文字與細線構成的 inline advisory，沒有 error icon、紅色警告或禁止送出。
- 推薦按鈕直接更新共用時長，保留全部景點、最想去、人數及其他輸入；Pricing、Atlas、摘要一起更新。
- 提醒首次需要時才顯示。升級後保留該區塊的空間與按鈕焦點，改為安排提示，避免突然收合；切回導覽員安排／清空偏好時收起。
- 已到 150 分鐘仍負荷偏高時，請旅客與導覽員取捨，不提供不存在的更長方案，也不阻擋 LINE 詢問。

## 4. Recommendation model

集中在 `src/data/preferences.js`，使用 JSDoc 型別與明確註解。這是可調整的 editorial heuristic，**不是導鹿核准的時間容量或「最多能去幾個景點」承諾**。

| 依據 | 規則 |
| --- | --- |
| 分級 tier | 使用景點在 tours.js 第一次出現的時長：核心三點 60；摸乳巷／九曲巷／龍山寺 90；辜家大宅／南北古蹟區域 150。 |
| 負荷 weight | 單一景點 1；「南北鹿港經典古蹟」代表一片區域，為 2，不假裝是單一停靠點。 |
| 60／90／150 參考負荷 | 3／5／6，直接取既有三份參考清單長度，僅用來觸發溫和提醒。不是 UI 勾選上限。 |
| 提醒條件 | 總負荷高於所選時長的參考負荷，或包含更高 tier。未知及重複 ID 不重複計算；guide choice 不提醒。 |
| 升級建議 | 找第一個能容納目前 tier 與負荷的較長時長；90 仍不合適就直接提議 150。若 150 也超出，仍可選 150，但提醒持續。 |

例：60 + 核心三點 → 無提醒；60 + 核心三點／摸乳巷／九曲巷 → 提議 90；60 + 辜家大宅 → 可直接提議 150；90 + 辜家大宅 → 提議 150；150 + 全部偏好 → 保留提醒，仍可詢問。

沒有新增實測車程、停留時間或地理位置 metadata。新增的 tier／weight／kind 是集中、可重用的推導及編輯性 metadata。上線營運前請真人導覽員確認分級與提醒強度是否符合常見接送點、交通、人潮、步行與旅客節奏。

## 5. 最想去 / Must-see

- 僅能從已選景點標記，最多 2 個；勾選景點本身不設硬上限。
- 使用 native button、aria-pressed、打勾及邊線表示狀態，不只依賴顏色或 hover。
- 達到 2 個時，其餘優先級按鈕為 aria-disabled 且不新增；仍可聚焦讀取「先取消其中一個」說明，已選項目可正常取消。
- 移除景點時清除相應優先級；導覽員安排清空優先級；升級時長則保留。
- sessionStorage 舊草稿沒有此欄位時預設空陣列；重複、不存在或未選景點的優先級會清理，最多保留兩個。

## 6. 中英文與摘要

Atlas 使用短句說明北鹿港 → 巷弄與龍山寺 → 宅邸與更多停留時間。中文 Atlas intro 的「必去」改為「最想看」，未修改其他故事區文案。

Booking 頁面摘要與複製文字都包含景點偏好、最想去及其他需求；Must-see 明列為 preferences, not guaranteed stops。LINE 仍使用原有官方 profile URL，以複製再貼上的摘要作為訊息，沒有未驗證的文字預填或自動送出。

價格、LINE 95 折、車輛數、優惠條件、電話、地址、營業資料與真人確認原則均不變。

## 7. V3.1 修改檔案

- `src/App.jsx`：優先級草稿讀取與共享更新時的清理。
- `src/data/preferences.js`：新偏好模型、型別與雙語 guidance。
- `src/data/booking.js`：新增 priorities 預設值與雙語摘要。
- `src/data/atlas.js`：累積圖層、探索範圍 helper、文案與閱讀方式。
- `src/data/experienceCopy.js`：僅 Atlas 中文 intro 的「最想看」調整。
- `src/components/RouteExplorer.jsx`、`RouteExplorer.css`：Atlas 視覺層級、picker、累積路線與 CTA。
- `src/components/Contact.jsx`、`BookingPreferences.css`：時長提醒、最想去與摘要。
- `scripts/preferences.test.mjs`：新模型與雙語摘要測試。
- `scripts/preferences-browser-qa.mjs`：本輪轉換／觸控／優先級／草稿／剪貼簿驗證。
- `scripts/atlas-browser-qa.mjs`：保留原有驗證意圖，將 chip 同步改為新 picker 同步，加入 360px 及累積圖層。
- `V3_1_ATLAS_BOOKING_UX.md`：本報告。

沒有新增 dependencies；Hero、Brand、Experience、Reviews、People、FAQ、Footer、global identity 本輪未修改。工作樹另含上一輪 V3 未提交的檔案，不應混為本輪改動。

## 8. Tests

`npm test`：30/30 通過，包含既有 21 項與新增 9 項，沒有 skipped tests。

新增涵蓋合理／過多偏好、tier 不同但少量景點、150 仍需取捨、guide choice、重複／未知資料、最多兩個優先級、雙語摘要非保證語氣、累積探索圖層。瀏覽器另驗證升級 CTA、選擇保留、共享價格、Atlas CTA、keyboard、reload 草稿與真正的 clipboard 文字。

## 9. Build

`npm run build` 通過，雙語 prerender 成功。JS 221.38kB / gzip 75.79kB；CSS 50.86kB / gzip 11.65kB。相較 V3 gzip JS 約增加 2.25kB、CSS 約 0.28kB；未引入 GIS 或動畫套件。

## 10. Responsive / regression QA

指定 320、360、375、390、430、768、1024、1440 加上 1920px，兩種語言共 18 組全部通過獨立 Chrome production preview 驗證。每組涵蓋三時長 Atlas CTA、Booking 同步、合理／過量偏好、兩個優先級上限、keyboard、90／150 升級、景點保留、完整 clipboard、草稿 reload、guide choice reset 與無 overflow。升級前後捲動位移均為 0px，advisory 高度變化 ≤1px，無 console / page errors。

Atlas 獨立回歸已通過：手機五寬度 × 雙語 × 三時長 × 七個地理節點、picker 雙向同步、區域選擇、無 target 重疊、44px+、高度及垂直變化 ≤1px、reduced motion、Booking CTA 收起。模組高度約 486／486／490／498／522px；桌面鍵盤與無 overflow 通過。

回歸中發現英文 320px 在升級後按鈕文字換成多行，使 advisory 高度改變；已改為保留三行文字所需的空間，最終流程通過。此處沒有放寬高度檢查。

結果檔：`artifacts/atlas-browser-qa.json`、`artifacts/v3-1/results.json`；截圖在 `artifacts/v3-1/`。沒有送出 LINE 訊息，也沒有改動個人瀏覽器資料。

## 11. Lighthouse / performance

已執行 production preview 的 mobile Lighthouse 12.8.2，使用相同預設模擬節流及獨立 Chrome profile。維持圖片 lazy loading、responsive AVIF/WebP、自架 fonts、靜態 SEO、inline CSS、reduced motion。沒有為追分重新設計其他區塊。

| 量測 | Performance | Accessibility | Best Practices | SEO | FCP | LCP | TBT | CLS |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| V3 中文基線 | 94 | 100 | 100 | 100 | 1.2s | 2.9s | 150ms | .001 |
| V3.1 中文首輪 | 84 | 100 | 100 | 100 | 3.0s | 3.7s | 10ms | .001 |
| V3.1 中文複測 | 89 | 100 | 100 | 100 | 1.7s | 3.7s | 0ms | .001 |
| V3.1 中文第三輪 | 84 | 100 | 100 | 100 | 3.0s | 3.7s | 10ms | .001 |
| V3.1 英文 | 95 | 100 | 100 | 100 | 1.2s | 2.9s | 0ms | 0 |

**中文效能尚未通過「不顯著倒退」驗收。** 三次中位數為 84，不只採用最高分。英文 V3 基線為 94，本輪 95；其餘三類皆維持 100。功能完成不代表整體 Definition of Done 已全部滿足。

已核對設定、Chrome 版本、請求及 LCP 元素：依然是相同 Hero AVIF，沒有新增遠端依賴。首輪實際觀測 FCP 246ms（V3 221ms），但模擬 FCP 差異較大；中文複測的模擬 LCP 延遲主要列在 render delay。這些線索不足以斷言純粹是環境波動，尚未定位及修正根因。下一步應在固定環境建立同時段 V3／V3.1 trace 對照，釐清中文字型／首次 layout 與模擬依賴，再做最小修正。不要重加曾造成 Booking anchor 跳動的 section content-visibility。

原始報告：`artifacts/lighthouse-zh-v31.json`、`artifacts/lighthouse-zh-v31-repeat.json`、`artifacts/lighthouse-zh-v31-third.json`、`artifacts/lighthouse-en-v31.json`。保留所有結果，沒有覆寫低分或改用較寬鬆節流。

## 12. 真人確認與限制

- 請導覽員校準提醒模型，而不是把 3／5／6 宣傳為保證的可停靠數。
- 地圖的讀圖起點不是集合點；方向、分區與連線是 editorial presentation，不是實際車行／步行路線。地點位置未改，仍需真人審閱敘事。
- iPhone Safari／Android native picker、動態字級、VoiceOver／TalkBack 與實際 LINE App 接續需真機驗收；Chrome 模擬不取代此步驟。
- 未新增寧靖王府或缺乏來源的其他景點。需要加入時先提供正確資料與營運確認。
- 預估費用、時段、交通、排隊、步行、上下車地點與停留時間仍由導覽員最後確認。最想去只是優先級。
- 完成後停在 working tree，不自動提交或部署。
