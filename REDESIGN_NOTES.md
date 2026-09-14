# GtourLK — World Class V1 實作交付

## 1. Redesign summary

將首頁從服務資訊集合改成「先認識鹿港與導鹿，再形成自己的行程」。保留 React、Vite、Tailwind，沒有轉框架或加入動畫／UI library。主視覺為紙色、墨綠、磚紅；以地方實景、中文襯線字、留白和路線圖建立品牌。

Repository：Leonchan001/gtourlk-website。工作分支：redesign/world-class-v1。未修改 main、未 commit、未 push、未部署正式站。

## 2. Changed files

### App、design system、既有 components

- `src/App.jsx`、`src/i18n.jsx`、`src/main.jsx`、`src/prerender.jsx`、`src/index.css`、`src/fonts.css`
- `src/components/Hero.jsx`、`Header.jsx`、`LanguageSwitcher.jsx`
- `src/components/CampaignSpotlight.jsx`、`SocialProof.jsx`、`Pricing.jsx`
- `src/components/About.jsx`、`Contact.jsx`、`FAQ.jsx`、`Footer.jsx`、`FloatingCTA.jsx`
- 刪除舊 `src/components/Services.jsx`，由路線、旅程故事與價格區取代。

### 新 components 與資料

- `src/components/BrandStatement.jsx`、`RouteExplorer.jsx`、`ExperienceStory.jsx`、`Photo.jsx`、`TripControls.jsx`
- `src/data/booking.js`、`experienceCopy.js`、`media.js`、`reviews.js`、`campaign.js`、`faq.js`
- 更新 `src/data/business.js`、`siteCopy.js`；原有 `tours.js` 的景點及計價規則保留。

### 資產、工具、設定、文件

- `index.html`、`en/index.html`、`public/robots.txt`
- `public/media/*`：原照片 responsive AVIF／WebP、輕量 logo／favicon
- `public/fonts/*`：本機 WOFF2 subsets 與 SIL Open Font License
- `scripts/prepare-images.cjs`、`prepare-fonts.mjs`、`audit-media.cjs`
- 刪除已引用失效照片路徑的 `scripts/compress_images.py`；新的 prepare-images 保留原圖，不覆寫來源。
- `scripts/booking.test.mjs`、`site.test.mjs`、`lighthouse.mjs`、`prerender.mjs`
- `package.json`、`package-lock.json`、`tailwind.config.js`、`vite.config.js`、`.gitignore`
- `TODO_PHOTOGRAPHY.md`、`REDESIGN_NOTES.md`、`QA_REPORT.md`

## 3. Homepage IA before / after

Before：Hero → 活動公告 → Services（特色、行程、價格）→ 大型活動 section → 評價 → About → FAQ → Contact → Footer。

After：Hero → 小型可展開活動公告 → Brand statement → Route explorer → Experience story → Reviews → Pricing → People → Booking → 7 題 FAQ → Footer。

活動詳情仍可透過 `#campaign` 直接開啟，不再中斷主敘事。

## 4. Major UX improvements

- 60／90／150 分鐘 tabs 改變 SVG 路線、參考景點與適合對象；景點名稱可對應高亮節點。明示非比例示意、不供導航、不保證走完、不是固定套裝。
- 路線、價格與預約共用同一份人數／時間狀態，不必重填。
- 價格先呈現兩個費率，再提供簡單試算。多人依總人數計費，而非拆車後重套低人數底價。
- 預約包括日期、選填出發時間、人數、時長、多選景點／交由導覽員安排、接送位置及備註。
- 摘要即時反映條件、車數、牌價及 LINE 95 折參考價；跨中英文切換保留目前分頁草稿（sessionStorage，無後端傳送）。
- 保留既有官方 LINE profile URL。採「複製摘要 → 開 LINE 貼上」可行流程；沒有假稱預填成功。複製失敗會展開可選取全文。
- 時段及費用必須由真人確認，表單不假裝即時保留車輛或完成預約。
- 浮動 CTA 導向目前的預約草稿；靠近 booking 時收起。

## 5. Major visual changes

- 全 viewport Hero：真實導鹿車輛、三行中文 display、節制 metadata、兩個明確 CTA。
- 品牌 opening spread 以大字與小幅半邊井照片形成對比，不使用特色三卡片。
- 以線條、圖上節點與紙面肌理建立 GtourLK route explorer。
- 五段旅程故事採大數字、寬幅紅瓦照片、交錯敘事、小幅暮色照片，不平均切成五張卡。
- Reviews 改成大型 5.0 與原有具名評價摘錄，移除泛用 carousel 模式。
- 價格資訊較密、People 區安靜、Booking 像旅程草稿，建立不同的閱讀節奏。

## 6. Performance changes

- 圖片透過 picture／srcset／sizes，AVIF → WebP → 原 JPEG fallback；只有 Hero high-priority preload，其餘 lazy。
- 七張原圖合計 1,080,190 bytes；同尺寸 AVIF 合計 475,826 bytes，約減少 56%。不代表使用者會下載全部 variants。
- Google Fonts 外部樣式與多個中文字型請求改為本機 subsets，font-display: optional。慢速首次載入可先使用系統 fallback，避免等待字型或後續跳動。
- 子集分為拉丁字、Hero／品牌開場中文及其他內文中文，透過 unicode-range 按需下載。
- build-time React 預渲染中英文整頁，再由 hydrateRoot 接手；輸出仍是純靜態 Vite 網站，無新 runtime 或服務端。以相同 render timestamp 避免日期／活動期限造成 hydration mismatch，掛載後恢復即時日期與本分頁草稿。
- 移除 Inter／JetBrains Mono；eyebrow 使用 system monospace。產品沒有新增 dependency，移除不再使用的 react-qr-code。
- 非首屏 sections 使用原生 content-visibility；保留可搜尋、可聚焦的 DOM。圖片明確寬高，避免 layout shift。
- 手機 Hero 不播放進場 scale；桌面微幅 1.02 → 1，route 切換保留短暫線條動畫。
- 實測分數與尚未達標項目見 QA_REPORT.md，不以理論值宣稱達標。

## 7. Accessibility changes

- semantic landmarks、單一 h1、heading hierarchy、skip link、可見 focus。
- tabs 支援 Left／Right／Home／End，使用 aria-selected／tabpanel；節點同時有文字景點清單與 SVG 描述。
- 表單有 labels、fieldset／legend、錯誤訊息、polite live summary；native date／time、radio／checkbox。
- 手機選單 Escape 關閉並返回觸發按鈕；外部點擊／焦點離開關閉；主要操作至少 44px。
- FAQ／campaign 用 native details，無 focus trap。中英文照片 alt、裝飾符號 aria-hidden。
- prefers-reduced-motion 關閉動畫、transition 與平滑捲動。

## 8. Remaining limitations

- 目前缺真實導覽員、親子、長者互動照片；People 使用明確標示的藝術村街景，沒有捏造肖像或人物資料。
- Hero 原圖只有 1400px，超大螢幕品質受原始素材限制。
- 地圖是關係示意，沒有 GIS 或導航功能。
- Google 5.0／254 則是 2026 年 9 月人工確認的資料快照，不是 live API。
- LINE prefill 尚未驗證可直達官方帳號，因此提供 copy + 原 LINE URL；未實際傳送測試預約。
- 最終模擬手機 Lighthouse：中文 90／100／100／100、英文 93／100／100／100。LCP 分別約 3.4s／2.8s，仍有改善空間；正式部署的 CDN、快取與真機網路尚未實測，單次分數不等於實際使用者成效。
- 字型只含目前文案字元；新增中文文案後執行 prepare-fonts，未含字元由系統字型 fallback。
- iOS Safari／Android 真機、screen reader 人工驗收與實際轉換率需下一階段驗證。

## 9. TODO_PHOTOGRAPHY summary

優先拍：車輛穿越巷弄的 Hero → 真實導覽員與旅客互動 → 親子 → 長者／折疊輪椅 → 紅磚木窗門環等細節 → 清晨／午後／黃昏／雨天。影像 slots 已集中，替换不需重排 layout；完整尺寸、授權與拍攝方向見 TODO_PHOTOGRAPHY.md。

## 10. Next iteration

1. 先完成正式 host 上的冷快取效能與 LCP 追蹤，確認靜態預渲染、圖片／字型快取及壓縮策略在真機的效果。
2. 取得真人攝影與導覽員經核准的名字／介紹，替換 People 与 Hero。
3. 以真實 iPhone／Android、VoiceOver／TalkBack 完成預約與長輩使用測試。
4. 若官方 LINE 確認支援帶文字的指定帳號連結，再縮短 copy → paste；保留現在可用 fallback。
5. 經同意後加入最小化 conversion events（路線選擇、開始預約、複製摘要、前往 LINE），以真實旅客回饋調整。
