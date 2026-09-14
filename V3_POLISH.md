# GtourLK V3 — Product polish handoff

日期：2026-09-08。Repository：Leonchan001/gtourlk-website；分支：`redesign/world-class-v1`；基準提交：`bba14c4`。

V3 是局部產品打磨，不是第三次 redesign。未 commit、push、merge 或 deploy；未切換或修改 main。沒有新增產品 dependency、照片或字型下載。

## 1. 檢查範圍

閱讀 App、所有現用首頁 components、global CSS / tokens、RouteExplorer CSS、中英文 copy、商業／價格／行程／預約／媒體／評價資料、i18n、既有測試與 QA_REPORT.md、V2_REFINEMENT.md、TODO_PHOTOGRAPHY.md。檢查 production prerender 與中英文 metadata / JSON-LD 的既有測試。

實際 Chrome production preview：中英文各 320、375、390、430、768、1024、1440、1920px；共 16 個組合、每組 10 個主區塊的截圖與布局檢查。人工查看涵蓋每一寬度的代表畫面，並針對變更區域、兩種語言、大小螢幕作視覺複查；沒有把自動截圖等同真人使用者測試。

| 區塊 | 審查結論與處理 |
| --- | --- |
| Hero | 車輛、服務種類、導覽員與 CTA 已清楚；保留圖文層級和裁切。現有低解析照片是主要限制。 |
| BrandStatement | 中文留白與半邊井關係成立；375–430px 英文正文被壓成極短行，局部調整。 |
| Route Atlas | 保留地理底圖、節點、三種時長、緊貼地圖的選擇與資訊；不重建。 |
| Experience | 大數字、寬幅屋瓦、小幅暮色形成節奏；保留布局，僅修少量模糊英文。 |
| Reviews | 5.0 層級、三段真實評論及長者／文化／親子標籤已回答選擇理由；不額外疊加徽章。 |
| Pricing | 600／200 計價與折扣試算已清楚；時長旁補上既有簡短差異文案。 |
| People | 目前是真實藝術村街景且圖說誠實；guidePortrait slot 已接入，不假造人物或再造容器。 |
| Booking | 補景點偏好與價格上下文；修複製後按鈕位移；保留真人確認、複製再 LINE 流程。 |
| FAQ | 保留七題；英文提前預約敘述與中文的「建議」對齊，不新增強制期限。 |
| Footer / CTA | warm ink、聯絡資料、手機 48px CTA 及桌面輕量 CTA 保留；修全頁跳轉高度問題。 |

## 2. 實際發現的問題

1. Booking 選景點旁未直接說明「偏好不等於保證停靠」；此資訊原本只在 Atlas / FAQ。
2. Booking 大字顯示 LINE 折後價，牌價、95 折與活動券限制沒有在同一個可見摘要內交代。
3. 複製成功的 status 插在兩個按鈕中間：基準手機 LINE 按鈕下移約 33.39px，英文 320px 約 56.78px。
4. Pricing / Booking 的 duration controls 只有分鐘數；手機 Atlas 的較長行程介紹刻意隱藏，離開 Atlas 後缺少選擇依據。
5. 英文 375–430px Brand 正文與照片並排，正文行寬過短；少量英文如 “Places you could meet”、 “A little planning” 不夠自然或不夠明確。
6. V3 回歸中重現跨區跳轉偏移：英文 320px 點 CTA 後 URL 已是 `#contact`，但 Booking top 仍在 621.89px、超出 568px viewport。原因為原有 `content-visibility: auto` / 900px 離屏估計高度；實際布局展開後目標位置改變。

## 3. 修改內容與檔案

| 檔案 | 變更 |
| --- | --- |
| `src/components/Contact.jsx` | 關聯景點偏好說明；可見牌價／折扣／優惠券限制；詢問語氣；複製 status 移至 LINE 按鈕後。 |
| `src/components/TripControls.jsx` | 直接使用 tours.js 既有 tagline，依所選時長更新說明；aria-describedby / polite live region。 |
| `src/components/Pricing.jsx` | 修正英文單台車的單複數，計算不變。 |
| `src/data/experienceCopy.js` | 雙語預約說明、日期選填、摘要標題與少量英文修辭。 |
| `src/data/faq.js` | 英文預約提前三天為建議；移除無必要的 studio 稱呼。 |
| `src/index.css` | 摘要小字層級、時長提示最小高度、窄手機英文 Brand 行寬；取消造成錨點偏移的離屏高度估算，保留圖片 lazy loading。 |
| `scripts/site.test.mjs` | 新增兩種語言的預渲染 inquiry context / duration guidance 測試。 |
| `scripts/polish-browser-qa.mjs` | 新增可重跑的 16 組視覺／overflow／conversion／剪貼簿成功及失敗備援檢查。 |
| `scripts/atlas-browser-qa.mjs` | CTA 失敗時保存位置診斷與截圖；原有通過條件不放寬。 |
| `TODO_PHOTOGRAPHY.md` | 擴充為 12 組拍攝 art direction、現場流程、權利紀錄與裁切驗收。 |
| `V3_POLISH.md` | 本次稽核、變更與驗證紀錄。 |

`dist/` 與 ignored `artifacts/` 重新產生，不是新的產品來源檔。Package / lockfile 不變。

## 4. 刻意不改的內容

首頁 IA 仍為 Hero → Campaign announcement → Brand → Atlas → Experience → Reviews → Pricing → People → Booking → FAQ → Footer。沒有重建 Hero、地圖、故事、評價或人物區；沒有新增卡片、裝飾、動畫、評價、人物、行程套裝或即時庫存。

business.js、tours.js、booking.js、reviews.js、media.js、Atlas 資料／元件、App 共享狀態、LINE URL、價目與折扣計算均未修改。SEO 原始 metadata / JSON-LD 不變。

## 5. 轉換改善

- 不知道鹿港的人可在試算及預約選擇時長時，立即讀到現有的 60／90／150 差異；不必另開長清單。
- 日期可留白先詢問；「請導覽員安排」仍預設勾選、位置明顯，與指定景點互斥。
- Booking 現在同時呈現牌價、LINE 折後價、優惠券未扣與真人確認條件。沒有新增價格承諾。
- 「Trip inquiry」不是訂位成功頁；偏好不保證全部停靠，也不自動保留時段。
- 複製成功後 LINE 按鈕不再因提示插入而移動；失敗則展開全文、聚焦並選取，供手動複製。
- 修正跨區 CTA 的目標位置；表單測試也驗證 Pricing CTA 後 Booking 位於頁首下方、標題取得焦點。

## 6. 視覺調整

英文 ≤430px 的 Brand 正文改為完整行寬，小幅半邊井仍靠右，不改中文構圖或 section 次序。摘要用低權重小字補計價上下文，保留磚紅金額與單一主要 LINE CTA。時長說明保留兩行最小高度，減少切換時的布局變動。

其餘保留 paper / smoked wood / brick、無圓角照片、桌面不對稱布局與段落留白。未以壓縮全站字級或改成更多 cards 換取畫面密度。

## 7. 文案可信度

「Explore the sights」「Estimate your tour」「Your trip inquiry」取代不明確標籤；少量 Experience 英文改成實際上車、和導覽員安排內容。英文 “at least three days” 改為 “we recommend … three days ahead”，對齊原中文建議，沒有自行新增預約政策。

Google 評論原文、翻譯、作者與主題標籤完整保留；評分維持 5.0，評論數／日期人工月更為 254／2026 年 9 月。People 不新增姓名、傳記或未驗證的歷史。營業資訊、價格、優惠、時間、人數、電話、地址與 LINE 未變。

## 8. 攝影 Art Direction

見 TODO_PHOTOGRAPHY.md：P0 Hero／Guide／真實互動，P1 車輛／親子／長者／建築，P2 街道細節／寺廟工藝／清晨／午後／黃昏，共 12 組。

每組包含故事目的、主體、環境、時刻、構圖、比例、留白、光線、手機裁切、真實性、避免事項與授權。另有安全與天候備案、contact sheet、原檔及 sRGB 交付、private rights log、slot 替換與八尺寸 crop 驗收。尚未取得新照片，現有素材及 null 人物 slots 保持不變。

## 9. 手機／響應式驗證

| 寬度 | 中文／英文全頁 | 複製後 LINE 在摘要內的位移 | 核心流程 |
| --- | --- | --- | --- |
| 320 | 通過 | 0 / 0px | 通過 |
| 375 | 通過 | 0 / 0px | 通過 |
| 390 | 通過 | 0 / 0px | 通過 |
| 430 | 通過 | 0 / 0px | 通過 |
| 768 | 通過 | 0 / 0px | 通過 |
| 1024 | 通過 | 0 / 0px | 通過 |
| 1440 | 通過 | 0 / 0px | 通過 |
| 1920 | 通過 | 0 / 0px | 通過 |

16 組無水平 overflow、無圖片載入失敗、無 page / console errors。每組驗證 6 人 × 150 分鐘 → NT$3,000 牌價 / NT$2,850 LINE 試算、同步至 Booking、指定景點取消 guide choice、重新選 guide 清空景點、接送及備註進入實際剪貼簿。沒有點擊或送出外部 LINE 訊息。

V2 Atlas 獨立回歸通過：四手機寬度 × 中英文 × 三時長 × 七地理節點，雙向同步、area 選擇、水平 reveal、44px targets、互動前後高度／垂直位置變動 ≤1px。模組高度仍約 496／500／508／531px；桌面四寬度鍵盤導航與 138 × 44px CTA 通過。

結果：`artifacts/polish-v3/results.json`、`artifacts/atlas-browser-qa.json`。基準截圖在 `artifacts/polish-baseline/`，V3 在 `artifacts/polish-v3/`。Element screenshot 會包含當時 viewport 的 fixed CTA，不能將長截圖中的 CTA 位置誤認為頁面內的固定插入位置。

## 10. Accessibility / Performance / SEO

- `npm run build`：通過，兩種語言均預渲染成功。
- `npm test`：21/21 通過，沒有 skip；原有 19 項加 2 項 V3 測試。
- 無既有 lint script；本次修改的 JS/CSS 使用本機 Prettier，`git diff --check` 通過，僅 Git 換行正規化提示。
- 表單仍使用 native inputs / fieldsets / labels；新說明由 aria-describedby 關聯；live region、focus、reduced motion 與 Atlas 鍵盤行為保留。
- SEO 測試保留 canonical、hreflang、Open Graph、Twitter、LocalBusiness / TouristAttraction / AggregateRating / OfferCatalog / FAQPage；一個 h1、七個 UI FAQ、SSR 可讀內容。
- JS 215.18kB / gzip 73.54kB，CSS 49.64kB / gzip 11.37kB。相較 V2 紀錄 JS gzip 約 +0.34kB，沒有新增 runtime library。移除有誤差的離屏布局捷徑，保留 hero critical preload、responsive AVIF/WebP、下方 lazy images、自架 fonts 及 inline critical stylesheet。

Lighthouse mobile local production preview 結果如下；這是本機模擬，不是正式站真實使用者 Core Web Vitals。

| 語言 | Performance | Accessibility | Best Practices | SEO | FCP | LCP | TBT | CLS |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 中文 | 94 | 100 | 100 | 100 | 1.2s | 2.9s | 150ms | .001 |
| 英文 | 94 | 100 | 100 | 100 | 1.3s | 3.0s | 20ms | 0 |

報告：`artifacts/lighthouse-zh-v3.json`、`artifacts/lighthouse-en-v3.json`。本次各語言一次有效最終量測，沒有挑選較高分重跑結果。V2 紀錄為中文 90、英文 95；不同時間的單次 lab 分數不能視為受控效能比較。中文 TBT 本次 150ms，高於 V2 紀錄的 20ms；英文 Performance 低 1 分，仍符合 ≥90 目標，不宣稱所有指標均改善。

重跑方式（一般 npm 環境）：`npm run build` → `npm test` → `npm run preview -- --host 127.0.0.1`。可選 QA 使用既有 `.tooling/qa`、設定 `CHROME_PATH`，依序執行 `node scripts/atlas-browser-qa.mjs`、`node scripts/polish-browser-qa.mjs http://127.0.0.1:4173 v3`、兩種語言的 `scripts/lighthouse.mjs`。剪貼簿測試與效能量測請分開跑，避免隔離瀏覽器互相影響。

## 11. 尚存限制

- 尚無經確認的真人攝影；Hero 與暮色原圖解析度仍有限，不做 AI 補景或放大替代。
- 真實 iOS Safari / Android、動態字級、VoiceOver / TalkBack 仍需真機驗收；Chrome 模擬與 Lighthouse 100 不等同完整無障礙認證。
- LINE 仍需複製摘要後貼上，profile URL 沒有新增未驗證的預填能力；真實 LINE App 接續未實機送出測試。
- 地圖仍是 stylized atlas，不是導航、保證路線或完整 GIS。Google 評分仍是有日期的既有資料，不是 live API。
- 單次實驗室效能可能浮動；正式主機快取、壓縮與實際行動網路需要後續量測。中文 LCP 仍高於理想 2.5s。
- 攝影、正式聯絡人介紹與真實旅客回饋才是下一個內容品質提升來源，不應繼續靠新增 section 補足。

## 12. 建議下一步

依攝影 brief 先完成 P0 三組真人／車輛素材，請導鹿確認可公開介紹與地點敘事；換圖後以真實 iPhone / Android 完成一次「選時間 → 試算 → LINE」客戶驗收。正式分享或部署需另行授權，本次未執行。
