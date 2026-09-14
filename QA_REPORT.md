# Redesign QA — 2026-09-06

> 最新本機精修驗證：見 [V3_FINAL_REFINEMENT.md](V3_FINAL_REFINEMENT.md)（2026-09-14）。以下為歷史 QA；其中景點勾選及價格計算器互動不代表目前產品。

## 範圍

Repository：Leonchan001/gtourlk-website；branch：redesign/world-class-v1。未修改 main、未發布正式站。測試以本機 Vite production preview 為主，沒有傳送 LINE 訊息或建立真實預約。

## Build / tests

- 已執行 npm install（本環境使用 npm 10.9.4 CLI；ignore-scripts，Vite build 的 esbuild 另行實際驗證）。
- npm run build：Vite build + 中英文 static prerender 成功，無警告。
- npm test：12 項測試，包括 21 組基本價格組合、多人跨車計價、95 折、非法輸入、完整摘要、語言 ID、metadata／JSON-LD、圖片來源、robots、reduced-motion、活動期限與預渲染內容。
- 原專案沒有 lint script；新增 tests，並使用暫存 Prettier 整理本次程式碼。未加入產品 lint／UI／animation dependency。
- git diff --check：通過。
- 中英文原始 JSON-LD 與 HEAD 比較：內容完整相同；包含 LocalBusiness、TouristAttraction、AggregateRating、OfferCatalog、FAQPage。

## Lighthouse

Lighthouse 12.8.2，Chrome headless，預設 mobile 模擬節流，冷載入；使用隔離測試 profile。測試網址為 http://127.0.0.1:4173/ 與 /en/，不是 gtourlk.com.tw 線上流量。

| 頁面    | Performance | Accessibility | Best Practices | SEO |  FCP |  LCP |   TBT |   CLS |
| ------- | ----------: | ------------: | -------------: | --: | ---: | ---: | ----: | ----: |
| 中文    |          90 |           100 |            100 | 100 | 1.8s | 3.4s | 120ms | 0.001 |
| English |          93 |           100 |            100 | 100 | 2.4s | 2.8s |   0ms |     0 |

本次 redesign 早期版本（仍使用外部 Google Fonts）為 64／100／100／92；這不是正式站重設計前的基準。正式 host 的結果會受硬體、CDN、壓縮、快取及網路影響，部署後應重測。LCP 尚未達到 2.5s good threshold，不能因綜合分數達標而忽略。

原始報告存放在忽略追蹤的 artifacts/lighthouse-zh-final.json 與 artifacts/lighthouse-en-final.json。

## Responsive

中英文逐一驗證下列 CSS viewport width，document scrollWidth 均等於 clientWidth，無水平溢出。Windows 捲軸佔 15px，因此內容寬小於設定 viewport。

| Viewport | Content width | 中文 | English |
| -------: | ------------: | ---- | ------- |
|      320 |           305 | Pass | Pass    |
|      375 |           360 | Pass | Pass    |
|      390 |           375 | Pass | Pass    |
|      430 |           415 | Pass | Pass    |
|      768 |           753 | Pass | Pass    |
|     1024 |          1009 | Pass | Pass    |
|     1440 |          1425 | Pass | Pass    |
|     1920 |          1905 | Pass | Pass    |

人工視覺檢查包含：手機 Hero／navigation／route explorer；320px 英文日期與人數輸入、copy／LINE CTA；1440px 路線與價格；1920px 評價；桌面 Hero、旅程照片與 People。

## Interaction / business logic

- 60／90／150 tabs 更新路線、參考景點、文案與共享時長。
- ArrowLeft／ArrowRight／Home／End 支援選擇及焦點；景點點選高亮對應節點。
- 6 人 × 150 分鐘：牌價 NT$3,000，LINE NT$2,850，2 台車。
- 6 人 × 60 分鐘：牌價 NT$1,200，LINE NT$1,140，非兩台車各套最低費率。
- 1–2 人 × 90 分鐘：牌價 NT$900，LINE NT$855。
- 空白／非整數／0／51 人與非 60／90／150 時長不輸出可用估價。
- 2020-01-01 過去日期顯示錯誤，停用 copy；日期未定仍可建立待確認詢問。
- 2026-09-10、10:30、6 人、150 分鐘、老街＋龍山寺、測試接送位置及備註完整進入 clipboard。
- 中英文切換及 production hydration 後，草稿與費用保持正確，未見 console error／hydration warning。
- 「請導覽員安排」與指定景點互斥；重選具體景點後切回客製選擇。
- LINE 仍是官方 https://line.me/R/ti/p/@lk167；摘要需先 copy 再 paste。沒有宣稱 profile URL 支援文字預填。
- Campaign 保留兩個不同 LINE：@lukang2012 領券、@lk167 預約，及原有活動條件與截止時間。
- 手機選單 Escape 關閉並還原焦點；預約區附近浮動 CTA 收起。
- 測試輸入已清除，預覽恢復 2 人／90 分鐘／日期待確認。

## Accessibility / 未完成的人工驗證

- 自動稽核及程式檢查通過；主要操作 44px 以上、native controls、focus、labels、live regions、SVG 文字替代與 reduced-motion CSS 均存在。
- Clipboard 拒絕時有選取全文 fallback；受瀏覽器測試介面限制，未人工強制拒絕 clipboard 權限。
- 尚未使用 VoiceOver／TalkBack 或真實 iOS／Android 測試，不能以 Lighthouse 100 取代輔具及真機驗收。
- 不會偽造 GIS 路徑、真人肖像、live Google 評分或已確認的預約時段。

## 重跑

一般 Node/npm 環境：npm install → npm run build → npm test → npm run preview。

可選的 Lighthouse 工具只安裝在 .tooling/qa（不進產品 dependencies）：npm install --prefix .tooling/qa lighthouse@12.8.2。設定 CHROME_PATH 後，執行 node scripts/lighthouse.mjs http://127.0.0.1:4173/ zh-final；英文改 /en/ 和 en-final。

build 的預渲染不需網路；只有主動重建照片／字型素材時才需 Sharp／Google Fonts。不要在正式站上傳測試 profile 或 artifacts。
