# GtourLK V3 — Final refinement

完成：2026-09-14。本轮為本機精修；repository `Leonchan001/gtourlk-website`，branch `redesign/world-class-v1`。未 commit、push、merge、建立 PR 或 deploy；Sites 仍是此前版本。

## A. 診斷與基準

檢查 App、Header、Hero、BrandStatement、RouteExplorer／CSS、atlas／atlasStreets 與現行 town atlas、ExperienceStory、SocialProof、Pricing、About、Contact、TripControls、FAQ、Footer、FloatingCTA、全域 CSS／tokens、中英文 copy、tours／pricing／booking／reviews／media、攝影計畫及 QA／V2 紀錄。以當前工作樹與修改前實際渲染為準，而不是把歷史 V2 報告當成現況。

現況已經移除景點偏好勾選與第二套價格計算器；目前是預設路線、選填需求、LINE 詢問。Atlas 也已採新的真實街道與建築線稿、原生景點選單，不是歷史 V2 的水平 chips。因此沒有按舊提案復原那些介面。

實際問題：

1. 手機時長／人數操作之後，要經過日期、其他需求及摘要才能看到估價，價格回饋太遠。
2. 三個時長在選擇前只有數字；下方說明只解釋目前選項。90 分鐘還有未附統計依據的「熱門／Popular」標籤。
3. People 的「一群人」大標旁邊只有藝術村街景，缺乏人物證據。
4. 評價主題藏在引文後面的署名列，快速掃讀較難知道旅客讚賞什麼。
5. 精簡價格區後，CTA 與上方說明缺少間距。

## B. 本輪修改檔案

| 檔案 | 最小有效修改 |
| --- | --- |
| src/components/TripControls.jsx | 三個時長各自顯示資料中既有的描述標籤，保留選中後的細節提示及原生 radio／鍵盤操作。 |
| src/data/tours.js | 90 分鐘「熱門／Popular」改「經典／Classic」。價格、時間、景點清單完全不變。 |
| src/components/Contact.jsx | 手機估價移到時長後、選填日期前；桌面仍在摘要旁。兩處共用相同估價函式與顯示模板，CSS 每次只顯示一處，隱藏位置也不進 accessibility tree。 |
| src/data/experienceCopy.js | 估價名稱改為「預估總費用／Estimated tour total」；明示導覽員確認最終行程和費用；People 改談熟悉巷弄與故事；英文 Booking 開頭改為具體的人數與時長說明。 |
| src/components/SocialProof.jsx | 既有 review.tag 移到各則原文前方；不更動評價內容、作者、數量、評分或來源。 |
| src/index.css | 時長標籤布局、響應式估價可見性、價格 CTA 間距、評價主題與手機節奏。未新增顏色／動畫。 |
| TODO_PHOTOGRAPHY.md | 校正目前素材用途；新增獨立登車與自然交流任務，補齊十四組焦點與視角。 |
| scripts/final-polish.test.mjs | 3 項防回歸測試：描述性時長標籤、估價確認文字、兩語預渲染。 |
| scripts/final-polish-qa.mjs | 修改前後 16 組尺寸截圖／溢出檢查；修改後人數時長、單一可見價格、同步、複製成功／拒絕備援及鍵盤測試。 |
| V3_FINAL_REFINEMENT.md、QA_REPORT.md | 本輪驗證紀錄及指向最新報告。 |

工作樹另有前幾輪未提交修改；整份 git diff 不等於本輪修改。

## C. Booking 決策與價格

- 60／90／150 以精華／經典／全覽（Highlights／Classic／Grand Tour）協助選擇；沿用既有 tagline，沒有捏造熱門程度。
- 維持「沒有特別要求就按預設路線，特殊需求與導覽員討論」，不復活已刪除的景點勾選。
- 一個主要總價，下面是已含 LINE 95 折及活動券／最終確認條件。牌價仍可在完整 LINE 摘要與價格規則中核對，不再與主要數字競爭。
- 手機先得到价格回饋，再填選填資料；桌面保持並排摘要。不同斷點只顯示一處估價。沒有假付款或即時保留時段。
- LINE 仍為先複製再開啟官方帳號；測試只攔截 clipboard，不送出訊息、不建立真實預約。

## D. 信任與視覺判斷

People 保留既有街景、圖說與 guidePortrait slot；用「熟悉這些巷弄，也熟悉巷弄裡的故事」承接照片，不製造人物或身份。

Reviews 保留三則完整摘錄與 Google 連結；評分維持 5.0，評論數／日期於 2026 年 9 月人工月更為 254／2026 年 9 月。只提前主題、微調手機間距与首則字級。不是以刪除證據壓縮長度：390px 中文高度 1358→1319px、英文 1677→1618px；430px 中文 1245→1248px，並非所有斷點都變短，改善重點是掃讀。

## E. 刻意不改

- Hero 的照片、構圖、主要 typography、CTA 與 responsive source：已經改善，不再覆蓋或增加效果。
- BrandStatement、Experience、FAQ、Footer、暖色 tokens 及全站 IA：節奏具備強弱，不為變化新增區塊。
- Atlas 的幾何、線稿、地理位置、選單、互動及來源：不重畫，只由共用資料帶入 Classic 標籤。
- Floating CTA：不加重；進入 Atlas／Booking 的隱藏行為保留並回歸。
- 商業數據、計價函式、評論、JSON-LD、canonical／hreflang、圖片、字型與 dependency：未改。

## F. 攝影計畫

十四組：Hero、導覽員肖像、建築解說、車輛與街道、親子、長者、建築、材質細節、寺廟／工藝、清晨、午後、黃昏、登車、自然交流。每組定義故事目的、主體與場合、瞬間、視角、比例與構圖、留白、光線、焦點、手機裁切、真實性、同意／權利與避雷事項。

先完成 P0 真人、Hero 與互動；不以模型、假旅客或 AI 補景交差。肖像與攝影授權紀錄需私人保存，不上傳公開 repository。

## G. QA

- Build：Vite + 兩語 prerender 成功。37/37 單元測試通過，沒有 lint script。
- 修改前後：中文／英文 × 320、375、390、430、768、1024、1440、1920，16 組皆無水平溢出。各尺寸保留整頁與 Reviews／Booking／People／Pricing 畫面；人工檢視桌面全頁、People 及中英窄螢幕 Booking／Reviews。
- 預約：6 人／150 分鐘 NT$2,850；所有尺寸只有一處可見估價。鍵盤時長切換、Atlas 共享時長、Booking 隱藏浮動 CTA、複製成功後 LINE 連結、拒絕後自動顯示並選取完整摘要皆通過。
- Atlas：既有 town-atlas-qa 共 20 組中英尺寸通過，含額外 360／640。三時長參考集合、七個地圖標籤實際點擊、雙向同步、44px、無重疊或裁切及鍵盤均通過。
- 以上瀏覽器測試未記錄 page／console errors。git diff --check 通過（Windows LF／CRLF 提示不是錯誤）。
- Lighthouse mobile：本機 production preview，單輪冷載入；不是 Sites／正式網站的實際流量。

| 語言 | Performance | Accessibility | Best Practices | SEO | FCP | LCP | TBT | CLS |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 中文 | 80 | 100 | 100 | 100 | 3.0s | 4.1s | 150ms | 0.001 |
| 英文 | 88 | 100 | 100 | 100 | 2.4s | 3.5s | 10ms | 0 |

結果低於先前歷史分數，不宣稱效能改善或全數達 90。LCP 元素為手機 Hero；工具已確認 eager／high priority／HTML 可發現，仍提示圖片傳輸與呈現成本。不能把單輪分數差直接歸因於本轮下半頁修改；沒有同環境成對 Lighthouse 基準。沒有為分數降低照片品質或取消必要資訊。

產品 JS 224.03kB／gzip 76.95kB；CSS 48.76kB／gzip 11.24kB。相較這輪開始前的 build，gzip 約增加 0.11／0.10kB，無新依賴。

證據：`artifacts/final-polish-before/`、`artifacts/final-polish-after/`、`artifacts/lighthouse-zh-final-polish.json`、`artifacts/lighthouse-en-final-polish.json`。

## H. 限制與下一步

- **程式／UX：** LINE 仍需貼上摘要；手機完整詢問區仍較長，但价格已前移。尚未用真人 usability session 證實轉換效果。
- **內容：** 缺少 verified guide portraits／自然互動；現有部分照片原始解析度有限。Review 數字為標示日期的快照，不是即時串接。
- **真機：** 本輪為 Windows Chrome 模擬，尚需 iOS Safari／Android、VoiceOver／TalkBack、放大文字、軟鍵盤與真實 LINE app 跳轉驗證。Lighthouse 100 不代表完整無障礙認證。
- **Hosting／效能：** 未更新 Sites；CDN、快取、壓縮與正式流量的 Core Web Vitals 未量測。後續效能工作應先建立同環境對照，而非依歷史綜合分數下結論。
- **下一步：** 先由真實導覽員核對介紹與預設路線，再拍攝 P0 人物／互動／Hero。下一次品牌提升應来自真實內容，不是另一輪全面 UI redesign。
