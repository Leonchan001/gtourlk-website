# 鹿港散策圖精修

2026-09-12；Leonchan001/gtourlk-website，redesign/world-class-v1 工作樹，未提交或部署，未修改 main。

- 地理比例：LukangMap.jsx 使用依鹿港緯度修正經度的局部等距圓柱投影，街道與景點共用座標轉換。北上南下；桌面 480×680、手機 600×680，CSS 與 viewBox 比例一致，不拉伸座標軸。
- 城市骨架：OSM 真實 31 條具名 way、209 個 WGS84 節點。中山路、民權路、三民路為主骨架，文化街巷次之，其餘道路淡化，不自行補造道路。來源、投影與授權記錄於 ATLAS_SOURCES.md。
- 移除景點間的行程折線、箭頭、隨機閱讀分區。僅保留真實街道、地理點及標籤引線。
- 景點標記：四個不同的單色 SVG 線稿——天后宮層疊屋簷、龍山寺低矮五門立面、辜家大宅雙塔、桂花巷長屋簷窗格。依官方或 repository 真實照片簡化，不是建築測繪；龍山寺不再使用單獨藻井圖示。
- 選中景點用字重、圓點及地理位置圓環辨識；無白色標籤方塊或表單式底線。按鈕至少 44px，鍵盤焦點仍可見。
- 時長高亮改由 atlasStops 讀取原有 tours.js 參考清單，不再推定 150 包含所有較短時長景點。沒有更動營運資料；仍須導覽員核對正式預設路線。
- 不加入景點偏好或排程操作；保留選時間、瀏覽簡介、前往 Booking。
- 文字：每個版型統一字級與引線端點規則，引線停在文字側邊，避免穿過建築線稿。
- 手機版：TOWN_LABELS 提供獨立標籤布局及取景範圍，實際地理位置不因避碰移動；不是直接壓縮桌面 SVG。

驗證：build、34 個單元測試通過；scripts/town-atlas-qa.mjs 驗證中英文 × 320/360/375/390/430/640/768/1024/1440/1920 共 20 組，涵蓋三時長景點集合、七個地圖標籤實際點擊、地圖／picker 雙向同步、鍵盤切換、44px、標籤不重疊不裁切、圖框比例、四個線稿、無水平溢出、無 page errors。人工檢視桌面與窄螢幕截圖 artifacts/atlas-refined-*.png。舊 atlas-browser-qa.mjs 的路線折線斷言屬於舊設計，不適用新圖。

Hero、照片版位、價格、預約流程、SEO 本輪未改。無新增依賴。

本輪 Lighthouse（本機 production preview）：

| 語言 | Performance | Accessibility | Best Practices | SEO | LCP | CLS |
| --- | --- | --- | --- | --- | --- | --- |
| 中文 | 85 | 100 | 100 | 100 | 3.6s | 0.001 |
| 英文 | 91 | 100 | 100 | 100 | 3.0s | 0 |

兩者 TBT 均為 10ms。中文效能仍未達 90，不能宣稱全數達標；下一輪應另行分析初始載入與 LCP。本機單輪量測不等於正式網站實際使用者數據。

主要檔案：src/components/LukangMap.jsx、RouteExplorer.jsx、RouteExplorer.css；src/data/townAtlas.js、townAtlasRoads.js、atlas.js；scripts/town-atlas.test.mjs、town-atlas-qa.mjs；ATLAS_SOURCES.md、本文件。

限制：文化閱讀圖不是導航或車輛通行保證。官方座標是代表位置而非實測入口；建築線稿不是地理建物輪廓。「南北鹿港經典古蹟」不捏造座標。正式預設路線仍需營運方核對，不自行改動商業資料。
