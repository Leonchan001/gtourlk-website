# GtourLK 下一輪攝影清單

目前網站完全使用 repository 原有照片，沒有 stock photo、AI 鹿港或假旅客。缺少人物素材時，以真實街景與文字留出位置，不假裝已有導覽員肖像。

## 現有照片 audit

| 類別             | 原始素材                                 | 使用方式／限制                                                                       |
| ---------------- | ---------------------------------------- | ------------------------------------------------------------------------------------ |
| Hero／車輛       | `public/hero-main.jpg`，1400 × 788       | 真實導鹿車輛與藝術村入口。桌面直向裁切、手機橫向裁切；原圖解析度限制超大螢幕銳利度。 |
| 鹿港建築         | `lukang-koo-house.jpg`，960 × 640        | 辜家大宅；保留 architecture slot，避免每個段落都塞照片。                             |
| 老城全景         | `lukang-rooftops-aerial.jpg`，1200 × 898 | Experience 寬幅紅瓦全景。                                                            |
| 路線景點         | `lukang-art-village.jpg`，1000 × 750     | People 區暫用在地街景，圖說明確標示藝術村，不冒充人物。                              |
| Detail           | `lukang-half-well.jpg`，500 × 375        | 品牌 opening spread 的小幅半邊井細節。                                               |
| Detail           | `lukang-sanhuai-house.jpg`，500 × 375    | 保留 houseDetail slot，適合小幅使用。                                                |
| Atmosphere       | `lukang-old-street-night.jpg`，500 × 332 | Experience 暮色小圖，不放大成滿版。                                                  |
| 人物／親子／長者 | 無可確認素材                             | slots 維持 null，不以陌生人或生成照片代替。                                          |
| Review／社會證明 | 原有具名文字評價                         | 使用既有摘錄及 Google 連結，不創造旅客肖像或新評價。                                 |

照片檔案均位於 `public/photos/`（Hero 除外）。Logo 和舊價格海報屬品牌／資訊圖，不作旅遊情境攝影使用。

## 補拍優先順序

1. HERO：導鹿四輪電動車穿越鹿港巷弄。車輛與地方都清楚，自然光，不刻意擺拍。橫幅 3:2 與直幅 4:5 各一組，保留文字留白區。
2. GUIDE：真實導覽員肖像、指向建築細節、與旅客自然交談。記錄姓名、可公開介紹、照片授權；不要只拍整齊站排。
3. FAMILY：親子一起聽故事、停下觀察、上車的自然片刻。兒童照片需監護人同意。
4. SENIOR：長者乘坐、上下車協助、折疊輪椅實際收納。呈現真實乘車條件，不暗示輪椅可直接駛入或保證所有行動需求皆適合。
5. DETAIL：紅磚、木窗、門環、屋瓦、香火、手寫招牌。近景與環境各一張；宗教空間先取得拍攝許可。
6. ATMOSPHERE：清晨、午後、黃昏、雨天；同一條巷弄不同光線，避免全部都是燈籠與廟宇。

## 替換方式

- 統一入口：`src/data/media.js` 的 `MEDIA`。
- 已準備：hero、guidePortrait、guestExperience、familyExperience、seniorExperience、streetDetail、templeDetail、vehicleDetail、lukangAtmosphere 等 slots。
- Hero／guidePortrait 已接入現有 layout；其餘預留 slots 用於下一輪故事選圖，不會因填入資料就自動增加 section。
- 新照片放入 `public/photos/`，更新來源、真實像素尺寸、中英文 alt 與 focal position；不要只覆蓋檔案卻保留舊尺寸。
- 用 `scripts/prepare-images.cjs` 產生 480／800／960／1400 寬 AVIF、WebP（不放大原圖）。須有 Sharp；可透過 `SHARP_PATH` 指向本機工具，不需加進產品 runtime。
- Hero 更換後，同步更新中英文 HTML 的 critical preload、Open Graph／Twitter image 及圖片尺寸。
- 原圖保留作 fallback。每張新圖記錄拍攝人、日期、授權及人物同意，並檢查手機 crop。
