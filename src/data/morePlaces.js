// Additional places to explore, separate from the operator's duration plans.
// Coordinates are representative points, not entrances or vehicle access.
const tourism = id => `https://media.taiwan.net.tw/zh-tw/portal/travel/details/attraction_376470000a_${id}`
function place(id, category, coordinates, source, name, detail, english, description, coordinateSource = source) {
  return { id, category, coordinates, source, coordinateSource, kind: category,
    zh: {name, short:name, detail}, en: {name:english, short:english, detail:description} }
}
export const MORE_PLACES = [
  place('興安宮', 'temple', [120.43568,24.05254], 'https://taiwangods.moi.gov.tw/html/Cultural/3_0011.aspx?i=261', '興安宮', '走進興化移民的信仰故事，看街屋之間的媽祖廟與木作細節。', 'Xing’an Temple', 'A Mazu temple set between townhouses, carrying the stories of migrants from Xinghua.'),
  place('意樓', 'house', [120.43526,24.052972], 'https://www.taiwan.net.tw/m1.aspx?id=10854&sNo=0001016', '意樓', '慶昌古厝裡的小閣樓，以葫蘆與古錢紋樣的圓窗，留下鹿港的建築巧思。', 'Yi House', 'A small upper room in the Qingchang residence, known for its round window with gourd and coin motifs.'),
  place('丁家大宅', 'house', [120.436061,24.053511], 'https://media.taiwan.net.tw/en-us/portal/poi/details/c1_376470000a_000150', '丁家大宅', '從中山路的店面走讀傳統宅院，認識丁家經商與讀書的家族故事。', 'Ding Family Mansion', 'A traditional residence behind the Zhongshan Road shopfronts, recalling the Ding family’s trade and scholarly life.'),
  place('和興青創基地', 'arts', [120.4366,24.05306], tourism('000439'), '和興青創基地', '舊派出所宿舍群再利用，木造老屋、巷道與青年創作在這裡相遇。', 'Hexing Creative Hub', 'Former police dormitories bring together timber buildings, small lanes and contemporary creative work.'),
  place('謝家甕牆', 'lane', [120.4362,24.05298], 'https://rhs.boch.gov.tw/rhs/news_D.aspx?id=125', '謝家甕牆', '和興派出所旁，以酒甕砌成的牆面，讓日常器物成為老宅的裝飾。', 'Xie Family Urn Wall', 'Beside the former Hexing police dormitories, reused wine jars form a distinctive residential wall.', tourism('000135')),
  place('十宜樓', 'house', [120.43517,24.053425], 'https://www.taiwan.net.tw/m1.aspx?id=A12-00090&sNo=0001016', '十宜樓', '抬頭看連接樓屋的跑馬廊，想像昔日文人相聚、吟詩賞月的鹿港。', 'Shiyi House', 'Look up at the passage linking the upper rooms, associated with Lukang’s literary gatherings.'),
  place('文武廟', 'temple', [120.438029,24.048864], 'https://media.taiwan.net.tw/en-us/portal/poi/details/c1_376470000a_000092', '鹿港文武廟', '文昌祠、武廟與文開書院相鄰，從信仰與教育讀南鹿港的另一面。', 'Lukang Wenwu Temple', 'The Wenchang shrine, martial temple and Wenkai Academy bring faith and learning together in southern Lukang.'),
  place('新祖宮', 'temple', [120.4312,24.05812], tourism('000156'), '新祖宮', '從清代敕建的媽祖廟與碑記，認識鹿港信仰和歷史的交會。', 'Xinzu Temple', 'An imperially commissioned Mazu temple whose inscriptions connect local faith with Qing-era history.'),
  place('玉渠宮', 'temple', [120.43384,24.05344], 'https://crgis.rchss.sinica.edu.tw/temples/ChanghuaCounty/lugang/0702017-YQG', '玉渠宮', '車圍巷裡主祀田都元帥的角頭廟，從戲曲信仰看見地方生活。', 'Yuqu Temple', 'A neighbourhood temple in Chewei Lane dedicated to Tiandu Yuanshuai, a deity associated with traditional theatre.', 'https://mapcarta.com/W561803809'),
]
