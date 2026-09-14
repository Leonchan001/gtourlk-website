# Journey refinement — 2026-09-10

在 `redesign/world-class-v1` 的既有未提交版本上精修，保留 Hero、品牌、價格與商業資料；沒有 commit、push、merge 或部署。

## 已實作

- Atlas 閱讀狀態與行程偏好分開；明確按下加入才寫入共用 trip.stops。取消同步清理 priorities，切換時間保留偏好，Booking 自動展開已選內容。
- 地圖移除方向箭頭與「讀圖起點」，減輕目前層的線重，標明景點關聯而非行車路線。座標與既有參考景點不變。
- 景點選單有可見標籤；手機將加入偏好及安排時間並排，縮短 CTA，維持 44px 操作目標。
- Booking 先人數／時間、再選填日期。景點及接送／備註使用 native details 漸進展開，舊資料保留；景點不設硬上限，最想去仍最多兩個。
- 精簡 advisory 文案，移除 96px 按鈕及多行空白占位。不再把升級前後絕對等高當成體驗品質的替代指標。
- 主 CTA 先複製，成功後同區改為開啟 LINE 並轉移鍵盤焦點；修改摘要後重置為複製。複製失敗展開完整文字、選取並聚焦；另留直接聊天入口。不自動開窗或送出訊息。

## 檔案

`src/components/RouteExplorer.jsx`、`RouteExplorer.css`、`Contact.jsx`、`BookingPreferences.css`、`src/data/preferences.js`；新增 `scripts/journey-browser-qa.mjs` 及本報告。其他 working tree 變更來自之前版本。

## 驗證

- Production build 成功；JS gzip 75.98kB、CSS gzip 11.70kB，沒有新增依賴。
- 單元測試 30/30；`git diff --check` 通過（僅換行提示）。
- 新流程以獨立 Chrome 驗證中英文 × 320/360/375/390/430/768/1024/1440/1920，包含瀏覽不選取、加入、跨時長保留、優先級、真正 clipboard、LINE 焦點、刪除與摘要重置、clipboard 拒絕備援、無 overflow/page error。結果及截圖在 `artifacts/journey/`。
- 舊版 browser scripts 記錄舊 UI 合約（例如雙按鈕與 advisory 絕對等高）；本輪新流程以 journey suite 驗證，不將舊版通過紀錄冒充本輪驗證。

## 尚未完成

最終 production build：18 組流程全部通過，無 page errors。手機此次量測 Atlas 約 475–511px（不同語言與寬度）；不代表所有系統字級／瀏覽器工具列下均可整組容納。

最終 Lighthouse 中文 **84/100/100/100**，FCP 3.0s、LCP 3.7s、TBT 0ms、CLS .001；英文 **91/100/100/100**，FCP 2.4s、LCP 3.0s、TBT 10ms、CLS 0。原始報告為 `artifacts/lighthouse-zh-journey-final.json`、`artifacts/lighthouse-en-journey-final.json`。中文仍未達標，英文也未回到先前 95，不宣稱效能改善。

- 中文效能問題尚未定位，不宣稱本輪解決。中途量測中文 85、英文 91，LCP 3.6s／3.1s；其餘三類均 100。最終量測另補於下方，保留原始結果，不只取最高分。
- 真實 iPhone／Android 的 LINE 接續、輔助技術與動態字級仍須真機驗收。
- 真人導覽員介紹、授權照片、推薦模型的營運校準需導鹿提供／確認；未以虛構資料補足。
