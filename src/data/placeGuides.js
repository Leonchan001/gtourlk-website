// Long-form sight guides for /places/<slug>/. Every fact paraphrases a listed
// source; contested claims are attributed or left out. Details that change
// (residents, events, opening hours) point to the venue's own channel instead.
const tourism = (id) => ({
  url: `https://media.taiwan.net.tw/zh-tw/portal/travel/details/attraction_376470000a_${id}`,
  name: { zh: '交通部觀光署', en: 'Taiwan Tourism Administration' },
})
const changhua = (url) => ({
  url,
  name: { zh: '彰化縣觀光旅遊網', en: 'Changhua County tourism' },
})

export const PLACE_GUIDES = {
  鹿港天后宮: {
    official: {
      url: 'http://www.lugangmazu.org/',
      label: { zh: '鹿港天后宮官方網站', en: 'Lukang Tianhou Temple website' },
      note: {
        zh: '祭典、進香與廟方公告請以官方網站為準。',
        en: 'Check the temple’s own website for festivals, pilgrimages and notices.',
      },
    },
    zh: {
      history: [
        '鹿港早年是天然良港，與對岸往來貿易頻繁。商人與船戶為了祈求航海平安而供奉媽祖，相傳天后宮的信仰可以追溯到明末。',
        '廟宇在清雍正三年（1725 年）遷到現址，後來歷經多次修建，現在看到的建築大多是 1920 到 1930 年代大修後留下的樣貌。2019 年由縣定古蹟升格為國定古蹟，文化部特別肯定這裡的木雕與石雕保存完整。',
      ],
      highlights: [
        ['三川殿藻井', '八卦形的藻井層層向上收攏，周邊有八仙等雕飾，頂端是一朵蓮花。進廟後記得抬頭看，這是天后宮最值得停留的地方。'],
        ['木雕與石雕', '據記載，前殿有部分木作是日治時期鹿港城隍廟拆除後移來的。可以留意樑柱、門窗和石獅的細節。'],
        ['開基媽祖', '廟方表示供奉的是湄洲祖廟分靈的開基聖母，因為長年受香火燻黑，俗稱「黑面媽」。'],
        ['清代匾額', '殿內保存多面清代皇帝御賜的匾額。'],
      ],
      tips: [
        '農曆一到三月是進香旺季，假日人潮很多，想慢慢看建築細節的話，建議平日或早上來。廟宇是信仰空間，參拜的人多時請讓出動線。',
      ],
    },
    en: {
      history: [
        'Lukang was once a natural harbour with busy trade across the strait. Merchants and seafarers worshipped Mazu for safe passage, and the temple’s tradition is said to date back to the late Ming dynasty.',
        'The temple moved to its present site in 1725 and has been rebuilt several times; most of what you see today dates from major restoration in the 1920s and 1930s. In 2019 it was upgraded from a county to a national monument, with the Ministry of Culture noting its well-preserved wood and stone carving.',
      ],
      highlights: [
        ['The front-hall caisson ceiling', 'An octagonal ceiling rises in tiers, surrounded by carvings including the Eight Immortals and crowned with a lotus. Look up as you enter: this is the place to linger.'],
        ['Wood and stone carving', 'Records say some of the front hall’s woodwork came from Lukang’s City God Temple when it was demolished in the Japanese era. Notice the beams, doors, windows and stone lions.'],
        ['The founding Mazu', 'The temple says its founding statue was brought from the Meizhou ancestral temple. Centuries of incense have darkened it, earning the nickname “Black-faced Mazu”.'],
        ['Qing-era plaques', 'The halls keep several plaques bestowed by Qing emperors.'],
      ],
      tips: [
        'The first three lunar months are pilgrimage season and weekends are busy. Come on a weekday or in the morning to see the details at your own pace, and make way for worshippers when the halls are crowded.',
      ],
    },
    sources: [
      { url: 'https://www.taiwan.net.tw/m1.aspx?id=2155&sNo=0001016', name: { zh: '交通部觀光署', en: 'Taiwan Tourism Administration' } },
      { url: 'https://news.pts.org.tw/article/457077', name: { zh: '公視新聞（2019 升格國定古蹟）', en: 'PTS News (2019 national monument)' } },
      { url: 'https://en.wikipedia.org/wiki/Lugang_Mazu_Temple', name: { zh: 'Wikipedia', en: 'Wikipedia' } },
    ],
  },
  九曲巷: {
    zh: {
      history: [
        '九曲巷的正式名稱是金盛巷。清代鹿港是兩岸貨物轉運的重鎮，泉州、廈門的商人來此設行，金盛巷一帶便是富商聚居的地方。「九曲」的「九」不是實際數字，而是形容彎折很多。',
        '巷道刻意蜿蜒，一般認為是為了擋住秋冬強勁的東北季風「九降風」，也能防止盜賊直闖。昔日文人以「曲巷冬晴」形容這裡，列為鹿港八景之一。',
      ],
      highlights: [
        ['十宜樓', '橫跨巷道的跑馬廊連接兩側樓房，相傳是文人吟詩、品茗、賞月的地方。2003 年登錄為歷史建築。'],
        ['銃櫃', '十宜樓旁二樓牆面留有銃孔與瞭望口，是老街區自我防衛的痕跡。'],
        ['意樓', '巷子南端的閣樓，以葫蘆與古錢造型的圓窗寓意福氣與財富，並流傳著「見樹思君」的故事。'],
        ['巷弄小吃', '巷內有傳統油飯、龜粿等米食老店，走累了可以停下來吃一口。'],
      ],
      tips: [
        '九曲巷是居民生活的巷弄，請放低音量，不要擅自進入住家。可以從民族路側的巷口進入，一路接到十宜樓、意樓，再串連和興青創基地與丁家大宅。',
      ],
    },
    en: {
      history: [
        'Nine-Turns Lane is officially Jinsheng Lane. In the Qing era Lukang was a key trading port, and merchants from Quanzhou and Xiamen set up businesses here, making this a wealthy neighbourhood. “Nine” simply means “many turns”.',
        'The winding layout is generally explained as shelter from the strong autumn and winter northeasterly wind, and as a defence against intruders. Writers once listed “sunny winter days in the winding lane” among the Eight Views of Lukang.',
      ],
      highlights: [
        ['Shiyi House', 'An elevated passage bridges the lane, linking the buildings on either side. It is said to have hosted poetry, tea and moon-viewing gatherings. Registered as a historic building in 2003.'],
        ['The gun turret', 'Beside Shiyi House, an upper wall still has gun holes and lookout slits: a reminder that the old town once defended itself.'],
        ['Yi House', 'At the southern end, a small upper room with a round window shaped like gourds and coins, symbols of luck and wealth, and a local love story about a tree planted for an absent husband.'],
        ['Lane-side snacks', 'Old shops along the lane sell traditional rice dishes and sweet rice cakes.'],
      ],
      tips: [
        'People live in these lanes, so keep voices down and do not enter homes. Enter from Minzu Road and follow the lane past Shiyi House and Yi House to the Hexing Creative Hub and Ding Family Mansion.',
      ],
    },
    sources: [
      tourism('000130'),
      changhua('https://tourism.chcg.gov.tw/AttractionsContent.aspx?chk=54c802d7-4beb-4025-b018-dfeb791f398e&id=143'),
    ],
  },
  摸乳巷: {
    zh: {
      history: [
        '摸乳巷原本是前後兩條街之間的通道，其實是長條店屋之間的防火巷。居民為了抵擋強勁的海風，把屋子蓋得很近，巷子最窄處不到 70 公分，兩個人迎面相遇時只能側身擦過，因此得名。',
        '這條巷子也有「護胸巷」「君子巷」等稱呼，另有一說原名「夢麟巷」，台語發音相近，才流傳成今天的名字。',
      ],
      highlights: [
        ['巷口的路牌', '紅磚牆上的巷名是許多旅客必拍的地方。'],
        ['一人寬的巷道', '走進去感受兩側高牆夾住的狹窄尺度，抬頭只看得到一線天空。'],
        ['防火巷的智慧', '從巷子的寬度，可以想像老鹿港街屋如何密集排列，以及居民怎麼和海風共處。'],
      ],
      tips: [
        '巷子全天開放，但一次只能容納一個人通過。遇到對向來人請禮讓，拍照時也盡量不要長時間擋在巷口。',
      ],
    },
    en: {
      history: [
        'Molu Lane began as a shortcut between two streets: in fact a firebreak between long, narrow shophouses. Residents built close together against the strong sea wind, leaving a passage under 70 cm at its narrowest. Two people meeting must turn sideways to squeeze past, which gave the lane its cheeky name.',
        'It has also been called the “Gentleman’s Lane”, and one account says an earlier name sounded similar in Taiwanese before today’s name took hold.',
      ],
      highlights: [
        ['The lane sign', 'The name on the red-brick wall is a favourite photo stop.'],
        ['A one-person passage', 'Step inside to feel the high walls on either side and a thin strip of sky above.'],
        ['A lesson in town planning', 'The width alone shows how tightly Lukang’s shophouses were packed, and how residents lived with the sea wind.'],
      ],
      tips: [
        'The lane is open at all hours but fits one person at a time. Give way to people coming the other direction and avoid blocking the entrance for long photo sessions.',
      ],
    },
    sources: [
      tourism('000134'),
      changhua('https://tourism.chcg.gov.tw/AttractionsContent.aspx?id=147&chk=410219db-b79a-4464-9e75-75d910ae8ce4&l=TW'),
    ],
  },
  鹿港龍山寺: {
    zh: {
      history: [
        '鹿港龍山寺創建於明末清初，原本位在舊港溝邊（今大有街）。清乾隆五十一年（1786 年）遷建到現址，之後歷經多次整修。1983 年指定為第一級古蹟，現為國定古蹟。',
        '1999 年九二一地震時，龍山寺正殿屋脊斷落、山門與戲台木柱移位。2001 年起由政府規劃修復，主體工程由鹿港出身的企業家全額捐資，是近百年來規模最大的一次修復。',
      ],
      highlights: [
        ['戲台八卦藻井', '五門殿戲台上方的八卦藻井建於清道光十一年（1831 年）重修時，是台灣保存年代最早的藻井作品，結構還有共鳴效果。'],
        ['三進二院的格局', '全區約一千六百多坪，由前到後依序是山門、五門殿、正殿與後殿，院落層層展開，很適合慢慢走。'],
        ['木作細節', '樑架、斗栱與彩繪是欣賞重點，可以和天后宮的工藝互相比較。'],
      ],
      tips: [
        '開放時間為每日 07:00 至 20:00。龍山寺位在南鹿港，搭配導覽車可以和九曲巷、摸乳巷串成一條南線。',
      ],
    },
    en: {
      history: [
        'Longshan Temple was founded in the late Ming or early Qing dynasty beside the old harbour channel, then moved to its present site in 1786 and restored many times since. Designated a first-class historic site in 1983, it is now a national monument.',
        'The 1999 Chi-Chi earthquake broke the main hall’s ridge and shifted the gate and stage columns. Restoration began in 2001, with the main works fully funded by entrepreneurs from Lukang: the largest restoration in about a century.',
      ],
      highlights: [
        ['The stage caisson ceiling', 'Built during the 1831 restoration, the octagonal ceiling above the stage is Taiwan’s oldest surviving example, and its structure even helps carry sound.'],
        ['Three halls, two courtyards', 'Covering more than 5,000 square metres, the complex unfolds from the gate through the Five-Door Hall to the main and rear halls. Take it slowly.'],
        ['Timber detail', 'Look at the beams, brackets and paintwork, and compare them with Tianhou Temple’s craft.'],
      ],
      tips: [
        'Open daily 07:00–20:00. Longshan sits in southern Lukang and pairs naturally with Nine-Turns Lane and Molu Lane.',
      ],
    },
    sources: [tourism('000079')],
  },
  桂花巷藝術村: {
    official: {
      url: 'https://www.facebook.com/lukangartistvillage/',
      label: { zh: '桂花巷藝術村 Facebook', en: 'Osmanthus Alley Art Village on Facebook' },
      note: {
        zh: '進駐藝術家每年甄選、會更換，工作室開放時間也各自不同。最新的藝術家、展覽與活動請看藝術村粉專。',
        en: 'Resident artists are selected each year and change over time, and studio hours vary. Check the village’s page for current artists, exhibitions and events.',
      },
    },
    zh: {
      history: [
        '這一帶早年是捕撈烏魚的地方，清代是貿易河道，傳說河岸種滿桂花，因此得名。日治時期填土後，在昭和年間興建了一片日式宿舍。',
        '戰後宿舍歸鹿港鎮公所所有，曾作為警察宿舍，後來逐漸荒廢。2009 年整修後，2010 年迎來第一屆駐村藝術家，成為彰化縣第一個藝術村。',
      ],
      highlights: [
        ['日式木造宿舍', '木造屋身、窗框與灰瓦屋頂，和老街的閩南長條街屋是完全不同的風景。'],
        ['藝術家工作室', '園區約有十間工作室，創作類型曾包括獅頭、捏麵人、書法、插畫、藺草編織、玻璃工藝等，每年依甄選結果更換。'],
        ['節慶布置', '藝術村常隨節慶更換裝飾，過去有鯉魚旗、光廊等裝置，假日也常有藝文活動或街頭表演。'],
        ['串連周邊', '北側是縣定古蹟鹿港公會堂，沿紅磚步道往南就能走到鹿港老街。'],
      ],
      tips: [
        '各工作室開放時間依藝術家而定，沒有統一時間，想看特定工作室建議先查粉專或來電鹿港鎮公所 (04)7772006 詢問。走進工作室時，請先徵得藝術家同意再拍照。',
      ],
    },
    en: {
      history: [
        'This area was once a mullet-fishing spot, then a Qing-era trading channel whose banks were said to be lined with osmanthus trees. After the land was filled in during the Japanese era, a group of Japanese-style residences was built here in the Showa period.',
        'After 1945 the houses passed to the township office and served as police housing before falling into disrepair. Restored in 2009, they welcomed the first resident artists in 2010, becoming Changhua County’s first artist village.',
      ],
      highlights: [
        ['Japanese-era timber houses', 'Wooden walls, window frames and grey-tiled roofs offer a very different scene from Old Street’s Fujian-style townhouses.'],
        ['Artist studios', 'About ten studios have hosted crafts such as lion-dance heads, dough figurines, calligraphy, illustration, rush weaving and glass. Residents change with each year’s selection.'],
        ['Seasonal installations', 'Decorations change with the festivals, from carp streamers to light tunnels, and weekends often bring performances or arts events.'],
        ['Walk on from here', 'The county-listed Lukang Public Hall is just north, and a brick path leads south to Old Street.'],
      ],
      tips: [
        'Studio hours depend on each artist. If you hope to visit a particular studio, check the village’s page first or call the township office on (04) 7772006. Ask before photographing inside a studio.',
      ],
    },
    sources: [
      tourism('000202'),
      changhua('https://tourism.chcg.gov.tw/AttractionsContent.aspx?id=216&chk=f4458a75-f6ae-4a40-aabc-66011c2c294a&l=TW'),
    ],
  },
  鹿港老街: {
    zh: {
      history: [
        '瑤林街與埔頭街合稱鹿港老街。清乾隆、嘉慶年間，鹿港是兩岸貨物轉運的中心，當年的瑤林廣場一帶還是河港。後來港口淤積，商業重心轉移，老街反而因此被保留下來，成為台灣第一個被指定的古蹟保存區。',
        '街屋多是「前店後河」的格局：前面開店，後面臨河讓船靠岸卸貨，住家與商行合而為一。',
      ],
      highlights: [
        ['瑤林街', '全長約 30 公尺，是最短的古街。街上的合和行曾是最大的船頭行。'],
        ['半邊井', '一半在牆內、一半在牆外的水井，讓路過的人也能取水，是鹿港人情味的代表故事。'],
        ['福州杉門面', '門窗與門聯多用福州杉木，埔頭街的門板還能拆卸，方便貨物進出。'],
        ['周邊廟宇', '附近的南靖宮建於 1783 年，是鹿港第一座祭祀關公的廟；鹿港公會堂原是商人集資興建的萬春宮，現為藝文展覽館。'],
      ],
      tips: [
        '老街店家大多在 10:00 到 18:00 營業。合和行、合德堂等老宅目前不開放入內，請在外觀賞。街上糕餅、麵茶、烏魚子等伴手禮很多，假日下午人潮最多。',
      ],
    },
    en: {
      history: [
        'Yaolin Street and Putou Street together form Lukang Old Street. In the 18th and early 19th centuries Lukang was a hub of cross-strait trade, and Yaolin Square was once a river port. When the harbour silted up, commerce moved elsewhere, which is why the street survived; it became Taiwan’s first designated heritage preservation area.',
        'Most townhouses had a shop at the front and a river landing at the back, where boats unloaded goods: home and business under one roof.',
      ],
      highlights: [
        ['Yaolin Street', 'About 30 metres long, the shortest of the old streets. Its He-He trading house was once the largest shipping firm.'],
        ['The Half Well', 'Half inside the wall and half outside, so passers-by could draw water too: a well-loved story of Lukang hospitality.'],
        ['Fuzhou fir shopfronts', 'Doors, windows and couplet boards are mostly Fuzhou fir; on Putou Street the door panels lift out to move goods in and out.'],
        ['Nearby temples', 'Nanjing Temple (1783) was Lukang’s first temple to Guan Gong, and the Lukang Public Hall began as a merchants’ temple and now hosts exhibitions.'],
      ],
      tips: [
        'Most shops open roughly 10:00–18:00. Historic houses such as He-He and Hede Hall are not open inside, so admire them from the street. Weekend afternoons are the busiest time.',
      ],
    },
    sources: [
      tourism('000139'),
      changhua('https://tourism.chcg.gov.tw/AttractionsContent.aspx?id=152&chk=a85eda86-370a-434e-b612-b04b3dc848ab&l=TW'),
    ],
  },
  辜家大宅: {
    official: {
      url: 'https://www.facebook.com/lukangarts/',
      label: { zh: '鹿港民俗文物館 Facebook', en: 'Lukang Folk Arts Museum on Facebook' },
      note: {
        zh: '門票、特展與休館公告請以文物館粉專為準。',
        en: 'Check the museum’s page for admission, special exhibitions and closures.',
      },
    },
    zh: {
      history: [
        '這裡原是辜顯榮家族的祖宅。1973 年辜家捐出祖居的土地、建築、家具與收藏，成立財團法人經營，以「取之社會、用之社會」為理念，成為今天的鹿港民俗文物館。',
      ],
      highlights: [
        ['巴洛克式洋樓', '近百年的洋樓採文藝復興後期的巴洛克風格，立面是鹿港最具代表性的西式建築之一。'],
        ['古風樓', '約兩百年歷史的傳統閩南式磚木古厝，和洋樓並排，呈現兩個時代的生活樣貌。'],
        ['六千多件館藏', '收藏以清中葉到民國初年的民俗器物為主，涵蓋飲食、衣著、居住、交通、宗教禮俗與節慶。'],
      ],
      tips: [
        '開放時間為週二到週日 09:00 至 17:00，週一休館；入館需購票。洋樓外觀適合拍照，室內展區建議預留至少 40 分鐘。',
      ],
    },
    en: {
      history: [
        'This was the ancestral home of the Koo family. In 1973 the family donated the land, buildings, furniture and collections to a foundation, under the motto of giving back to society, and it became the Lukang Folk Arts Museum.',
      ],
      highlights: [
        ['The Baroque mansion', 'The nearly century-old Western-style building in late Renaissance Baroque style is one of Lukang’s best-known facades.'],
        ['Gufeng House', 'A roughly 200-year-old Fujian-style brick and timber house stands beside the mansion, showing two eras of domestic life.'],
        ['6,000+ objects', 'The collection centres on everyday objects from the mid-Qing to the early Republic: food, clothing, homes, transport, ritual and festivals.'],
      ],
      tips: [
        'Open Tuesday to Sunday 09:00–17:00, closed Mondays; admission is charged. Allow at least 40 minutes for the galleries.',
      ],
    },
    sources: [
      tourism('000137'),
      changhua('https://tourism.chcg.gov.tw/AttractionsContent.aspx?id=150&chk=d189a6d4-64e5-4e0b-8c48-6732e6202319&l=TW'),
    ],
  },
  興安宮: {
    zh: {
      history: [
        '興安宮創建於清康熙二十三年（1684 年），由福建興化府的移民帶著媽祖香火來到鹿港建廟，取「興化平安」之意命名，俗稱「興化媽祖宮」，是鹿港最早的媽祖廟之一。',
        '廟宇歷經多次地震損毀與重修，1993 年由政府撥款修復，1996 年完工。廟內咸豐二年（1852 年）的匾額上寫著「興安會館」，可見這裡也是興化同鄉聚會的會館。',
      ],
      highlights: [
        ['街屋式廟宇', '單開間、二進一院的小巧格局，夾在街屋之間，是鹿港少見的廟宇形式。'],
        ['門神與石獅', '三川門中門繪有秦叔寶與尉遲恭，兩側是太監門神；墀頭的石獅與門楣木雕也值得細看。'],
        ['古匾與碑記', '「慈航普渡」匾與光緒年間的「奉憲示禁」碑，記錄了廟產與地方歷史。'],
      ],
      tips: [
        '興安宮空間不大，參拜者多時請讓出動線。開放時間建議先電話洽詢 (04)7770780。從這裡步行即可串連九曲巷與十宜樓。',
      ],
    },
    en: {
      history: [
        'Xing’an Temple was founded in 1684 by migrants from Xinghua in Fujian, who brought Mazu’s incense to Lukang. Known locally as the Xinghua Mazu Temple, it is among the oldest Mazu temples in town.',
        'Damaged and rebuilt several times after earthquakes, it was restored with public funding between 1993 and 1996. An 1852 plaque names it the Xing’an Guild Hall, showing it also served as a meeting place for people from Xinghua.',
      ],
      highlights: [
        ['A townhouse temple', 'One bay wide with two halls and a courtyard, it sits tucked between townhouses: an unusual form for a temple.'],
        ['Door gods and lions', 'The central doors show the generals Qin Shubao and Yuchi Gong, flanked by eunuch guardians; look too at the stone lions and carved lintel.'],
        ['Plaques and steles', 'An 1887 plaque and a stele from the same era record the temple’s property and local history.'],
      ],
      tips: [
        'The temple is small, so make way when worshippers are present. Call (04) 7770780 to confirm opening times. Nine-Turns Lane and Shiyi House are a short walk away.',
      ],
    },
    sources: [
      { url: 'https://taiwangods.moi.gov.tw/html/Cultural/3_0011.aspx?i=261', name: { zh: '內政部全國宗教資訊網', en: 'Ministry of the Interior religion database' } },
      changhua('https://tourism.chcg.gov.tw/AttractionsContent.aspx?id=107&chk=49b8933f-e953-461b-8cea-a3bebad31ef3&l=TW'),
    ],
  },
  意樓: {
    zh: {
      history: [
        '意樓是慶昌古厝中間的一座閨樓，位在九曲巷（金盛巷）南端。這裡以一段淒美的愛情故事聞名：相傳丈夫赴京趕考前在院中種下一棵樹，留在家中的妻子日日望樹思念遠行的人。',
      ],
      highlights: [
        ['葫蘆與古錢圓窗', '圓窗以瓦片堆疊出葫蘆與古錢的窗花，象徵福氣與財富，這種窗花在鹿港巷弄很常見，意樓的是最有名的一扇。'],
        ['閨樓的尺度', '抬頭看二樓的小閣樓，想像昔日深宅女子的生活。'],
      ],
      tips: [
        '意樓是私人古厝，請在巷中欣賞外觀，不要進入。可從中山路 119 號旁的巷口進入，和十宜樓、九曲巷一起走。',
      ],
    },
    en: {
      history: [
        'Yi House is a small upper room in the middle of the Qingchang residence, at the southern end of Nine-Turns Lane. It is known for a bittersweet love story: a husband is said to have planted a tree in the courtyard before leaving for the imperial exams, and his wife gazed at it while she waited for him.',
      ],
      highlights: [
        ['The gourd-and-coin window', 'Roof tiles form gourds and coins, symbols of luck and wealth. This window style is common in Lukang’s lanes, and Yi House has the most famous one.'],
        ['A glimpse of upper-floor life', 'Look up at the small room and imagine life for the women of a merchant household.'],
      ],
      tips: [
        'Yi House is privately owned: view it from the lane and do not go inside. Enter beside No. 119 Zhongshan Road and combine it with Shiyi House and Nine-Turns Lane.',
      ],
    },
    sources: [
      { url: 'https://www.taiwan.net.tw/m1.aspx?id=10854&sNo=0001016', name: { zh: '交通部觀光署', en: 'Taiwan Tourism Administration' } },
      changhua('https://tourism.chcg.gov.tw/AttractionsContent.aspx?chk=54c802d7-4beb-4025-b018-dfeb791f398e&id=143'),
    ],
  },
  丁家大宅: {
    zh: {
      history: [
        '丁家大宅又稱丁進士宅，是丁壽泉考中進士後增建修葺的宅第。丁家多人參加科舉並考取功名，以仁風孝行與重視教育聞名。',
      ],
      highlights: [
        ['三坎五落兩過水', '早期格局稱為「三坎五落兩過水」：前面三間店面，後面是縱深三進的四合院，一坎是一間店面、一落是一進，落與落之間的廊道叫「過水」。'],
        ['75 公尺的縱深', '佔地三百多坪、進深約 75 公尺，從中山路的店面一路走進去，可以感受鹿港長條街屋的尺度。'],
        ['雕飾彩繪', '建築架構與雕刻彩繪都保存得很好，值得慢慢看。'],
      ],
      tips: [
        '開放時間為週三到週日 09:15 至 16:30，週一、週二休館。大宅就在中山路上，可以和九曲巷、和興青創基地一起安排。',
      ],
    },
    en: {
      history: [
        'Also called the Ding Jinshi Residence, the house was enlarged after Ding Shouquan passed the highest imperial examination. Several family members earned degrees, and the Ding family was known for its filial piety and devotion to learning.',
      ],
      highlights: [
        ['Three bays, five sections', 'Three shopfronts face the street, with a three-courtyard house behind; covered passages link each section.'],
        ['75 metres deep', 'Walking in from the Zhongshan Road shopfront shows just how deep Lukang’s long townhouses run.'],
        ['Carving and paintwork', 'The structure, carving and painted decoration are well preserved and reward a slow look.'],
      ],
      tips: [
        'Open Wednesday to Sunday 09:15–16:30, closed Mondays and Tuesdays. It sits on Zhongshan Road, close to Nine-Turns Lane and the Hexing Creative Hub.',
      ],
    },
    sources: [
      changhua('https://tourism.chcg.gov.tw/AttractionsContent.aspx?id=163&chk=de49b041-d891-4e85-b452-7a21b6b361dd&l=TW'),
    ],
  },
  和興青創基地: {
    official: {
      url: 'https://www.facebook.com/profile.php?id=100090755537355',
      label: { zh: '和興青創基地 Facebook', en: 'Hexing Creative Hub on Facebook' },
      note: {
        zh: '進駐店家與市集、工作坊活動會更換，最新資訊請看基地粉專。',
        en: 'Shops, markets and workshops change; check the hub’s page for what is on now.',
      },
    },
    zh: {
      history: [
        '和興青創基地位在中山路和興派出所後方，由 8 棟舊警察宿舍修復而成，佔地約 1,377 平方公尺。和興派出所清代是鹽業總館，日治時期改為派出所，2018 年登錄為歷史建築。',
        '2023 年起委託民間經營，作為協助青年返鄉創業的基地，不定期舉辦文化工作坊與市集。',
      ],
      highlights: [
        ['日治木造宿舍', '園區保留日治時期的木造建築與一對洗石子門柱。'],
        ['二樓天空步道', '步道呼應舊時鹿港「不見天街」的意象，也能從高處看到旁邊的謝家甕牆。'],
        ['糕餅模裝飾', '入口以傳統餅模組成裝飾，向鹿港的糕餅文化致敬。'],
      ],
      tips: [
        '園區全天開放，各店家營業時間不同。從這裡往巷內走，就能接到九曲巷與十宜樓。',
      ],
    },
    en: {
      history: [
        'Behind the Hexing police station on Zhongshan Road, eight former police dormitories have been restored into a creative hub of about 1,377 square metres. The station itself was the Qing-era salt administration office before becoming a police station in the Japanese era, and was registered as a historic building in 2018.',
        'Since 2023 it has been run by a private operator to help young people start businesses in their hometown, with occasional workshops and markets.',
      ],
      highlights: [
        ['Japanese-era timber buildings', 'Wooden dormitories and a pair of granolithic gateposts survive.'],
        ['The sky walk', 'An upper walkway echoes Lukang’s old covered streets and looks over the neighbouring Xie family urn wall.'],
        ['Cake-mould decoration', 'Traditional pastry moulds decorate the entrance, a nod to Lukang’s baking heritage.'],
      ],
      tips: [
        'The grounds are open all day, but each shop keeps its own hours. Lanes from here lead into Nine-Turns Lane and Shiyi House.',
      ],
    },
    sources: [
      tourism('000439'),
      changhua('https://tourism.chcg.gov.tw/AttractionsContent.aspx?id=439&chk=889ead24-43c0-4723-ab96-9f414c9f883f&l=TW'),
      { url: 'https://rhs.boch.gov.tw/rhs/news_D.aspx?id=125', name: { zh: '文化部文化資產局', en: 'Bureau of Cultural Heritage' } },
    ],
  },
  謝家甕牆: {
    zh: {
      history: [
        '甕牆是早期把喝完的紹興酒甕砌進牆裡當裝飾的做法，用在圍牆就叫甕牆，用在窗上就叫甕窗。相傳以前生了孩子會埋酒，男孩叫「狀元紅」、女孩叫「女兒紅」，喝完的空甕便拿來砌牆。',
        '和興派出所旁巷道裡的這面甕牆，被視為鹿港最有名的甕牆。2020 年附近宿舍整修時，還發現了一段原本被宿舍遮住的「隱藏版」甕牆。',
      ],
      highlights: [
        ['瓶底對瓶底', '兩層酒甕瓶底相對排列，每三到四層之間再砌磚作為底座，加強結構。'],
        ['從高處看', '從和興青創基地二樓的步道，可以從另一個角度看到甕牆。'],
      ],
      tips: [
        '甕牆位在住宅巷弄，全天都可以經過欣賞，請勿攀爬或敲打酒甕。可以和和興青創基地一起安排。',
      ],
    },
    en: {
      history: [
        'Urn walls reuse empty Shaoxing wine jars as decoration, built into walls or windows. Tradition says families buried wine when a child was born, to be opened at a son’s success or a daughter’s wedding; the empty jars then went into the walls.',
        'This wall in the lane beside the Hexing police station is considered Lukang’s most famous. In 2020, restoration of the nearby dormitories uncovered another section that had been hidden for years.',
      ],
      highlights: [
        ['Base to base', 'Jars are laid in pairs, base to base, with a course of brick every three or four layers for strength.'],
        ['The view from above', 'The upper walkway at the Hexing Creative Hub gives a different angle on the wall.'],
      ],
      tips: [
        'The wall is in a residential lane and can be seen at any time. Please do not climb on or tap the jars. Combine it with the Hexing Creative Hub.',
      ],
    },
    sources: [
      { url: 'https://rhs.boch.gov.tw/rhs/news_D.aspx?id=125', name: { zh: '文化部文化資產局', en: 'Bureau of Cultural Heritage' } },
      tourism('000135'),
    ],
  },
  十宜樓: {
    zh: {
      history: [
        '十宜樓位在中山路與九曲巷之間，過去是文人雅士夜宴、吟詩、對句的地方，見證鹿港文風鼎盛的年代。相傳主人好客，為了讓客人能在高處倚欄賞月，在相連的兩棟樓之間搭起了跑馬廊。',
      ],
      highlights: [
        ['跑馬廊', '橫跨金盛巷的廊道和巷子交叉成十字，是九曲巷最具代表性的畫面。'],
        ['「十宜」的由來', '取名自宜琴、宜棋、宜詩、宜酒、宜畫、宜花、宜月、宜博、宜煙、宜茶，十件適合在這裡做的雅事。'],
      ],
      tips: [
        '十宜樓目前以外觀欣賞為主，最佳角度是從九曲巷內抬頭看跑馬廊。可以和意樓、九曲巷一起走。',
      ],
    },
    en: {
      history: [
        'Between Zhongshan Road and Nine-Turns Lane, Shiyi House once hosted evening banquets of poetry and couplets, a reminder of Lukang’s literary heyday. The story goes that the hospitable owner built an elevated passage between two buildings so guests could lean on the railing and admire the moon.',
      ],
      highlights: [
        ['The elevated passage', 'It crosses Jinsheng Lane to form a cross: the signature view of Nine-Turns Lane.'],
        ['Ten fitting pleasures', '“Shiyi” means ten things this house suits: music, chess, poetry, wine, painting, flowers, the moon, games, smoking and tea.'],
      ],
      tips: [
        'Shiyi House is mainly seen from outside. The best view is from inside Nine-Turns Lane, looking up at the passage. Pair it with Yi House.',
      ],
    },
    sources: [
      { url: 'https://www.taiwan.net.tw/m1.aspx?id=A12-00090&sNo=0001016', name: { zh: '交通部觀光署', en: 'Taiwan Tourism Administration' } },
      changhua('https://tourism.chcg.gov.tw/AttractionsContent.aspx?id=124&chk=2d0ebabc-61ef-466d-960d-0e379c9ddfe2&l=TW'),
    ],
  },
  文武廟: {
    zh: {
      history: [
        '鹿港文武廟由文昌祠、武廟與文開書院三座建築組成。文昌祠與武廟由海防同知薛志亮在清嘉慶十六年（1811 年）倡建；文開書院則由海防同知鄧傳安於道光四年（1824 年）倡議、地方商紳捐資，道光七年（1827 年）落成，名稱紀念明末儒者沈光文（字文開）。',
        '書院在 1975 年遭火災，1985 年指定為第三級古蹟後修復；1999 年九二一地震再度受損，2005 年修復完成。',
      ],
      highlights: [
        ['泮池與「入泮」', '文昌祠前有泮池，古時考中秀才的人要來這裡摘芹葉插在帽上，稱為「入泮」。'],
        ['虎井', '文祠與武廟之間的古井名為「虎井」，有「蓬萊第一泉」之稱。'],
        ['古碑與匾額', '三川殿內有 1819 年與 1869 年的重修碑記，武廟正殿有嘉慶年間的「藻耀海天」匾。'],
        ['官祀廟宇的樸素', '武廟三川殿沒有門神彩繪，這是官方祭祀廟宇的特色。'],
      ],
      tips: [
        '開放時間為 06:30 至 17:00。文武廟主祀文昌帝君與關聖帝君，院落寬敞，適合放慢腳步。',
      ],
    },
    en: {
      history: [
        'The complex combines a Wenchang shrine, a martial temple and the Wenkai Academy. The two temples were founded in 1811 by the coastal defence sub-prefect Xue Zhiliang; the academy was proposed in 1824 by his successor Deng Chuan’an, funded by local merchants and completed in 1827. It is named after the late-Ming scholar Shen Guangwen.',
        'Fire damaged the academy in 1975. Designated a third-class historic site in 1985, it was restored, damaged again in the 1999 earthquake, and restored once more by 2005.',
      ],
      highlights: [
        ['The semicircular pond', 'Scholars who passed the county exam once came here to pick celery leaves for their caps, a rite called “entering the pond”.'],
        ['The Tiger Well', 'The old well between the two temples was praised as the “First Spring of Penglai”.'],
        ['Steles and plaques', 'Restoration records from 1819 and 1869 stand in the entrance hall, and the martial temple keeps an 1811 imperial-era plaque.'],
        ['Official simplicity', 'The martial temple’s doors have no painted door gods, a mark of state-sponsored temples.'],
      ],
      tips: [
        'Open 06:30–17:00. The temples honour Wenchang, god of literature, and Guan Gong; the spacious courtyards reward a slower pace.',
      ],
    },
    sources: [
      changhua('https://tourism.chcg.gov.tw/AttractionsContent.aspx?id=105&chk=f13ee2ac-03eb-4f6d-89f4-0c6c3f825658&l=TW'),
    ],
  },
  新祖宮: {
    zh: {
      history: [
        '新祖宮是清乾隆皇帝頒官帑敕建的媽祖廟。乾隆五十二年（1787 年），大將軍福康安率軍在鹿港登陸平定林爽文事件，撥款倡建，隔年六月完工，俗稱「新宮」。',
        '廟宇在嘉慶、道光年間兩度重修，日治時期遭砲火損毀，戰後由信眾集資重修。1970 年重建拜亭與前殿廣場時，原本的石材與福杉被替換為磚與水泥，近年也改建了牌樓。',
      ],
      highlights: [
        ['敕建的身分', '由朝廷出資敕建的媽祖廟，和民間集資的天后宮形成有趣的對照。'],
        ['與天后宮比一比', '兩座媽祖廟相距不遠，可以比較官建與民建廟宇在歷史與樣貌上的不同。'],
      ],
      tips: [
        '新祖宮全天開放，就在埔頭街上，從天后宮或老街步行幾分鐘即可抵達。',
      ],
    },
    en: {
      history: [
        'Xinzu Temple was built with imperial funds. In 1787 General Fukang’an landed at Lukang to suppress the Lin Shuangwen uprising and funded the temple, completed the following year and known locally as the “New Temple”.',
        'It was restored twice in the early 19th century, damaged by shelling in the Japanese era and rebuilt by worshippers after the war. A 1970 rebuild replaced much of the original stone and fir with brick and concrete, and the gateway has recently been rebuilt.',
      ],
      highlights: [
        ['Built by imperial order', 'A Mazu temple funded by imperial order: an interesting contrast with the community-founded Tianhou Temple.'],
        ['Compare the two Mazu temples', 'They are close together, so it is easy to compare how official and community temples differ.'],
      ],
      tips: [
        'Open all day, on Putou Street a few minutes’ walk from Tianhou Temple and Old Street.',
      ],
    },
    sources: [
      tourism('000156'),
      changhua('https://tourism.chcg.gov.tw/AttractionsContent.aspx?id=169&chk=f3131356-f7a8-453e-9ca4-341efd08f6c7&l=TW'),
    ],
  },
}
