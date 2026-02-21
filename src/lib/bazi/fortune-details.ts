/**
 * 流年流月詳細說明模組
 * 提供更豐富的運勢解讀、開運建議等
 */

import type { TianGan, DiZhi, WuXing, ShiShen, BaZiChart } from './types';
import { TIAN_GAN_ELEMENT, DI_ZHI_ELEMENT } from '@/data/constants';
import { getTenGod } from './ten-gods';

/** 流年詳細分析結果 */
export interface AnnualFortuneDetail {
  year: number;
  ganZhi: string;
  gan: TianGan;
  zhi: DiZhi;
  tenGod: ShiShen;
  zhiTenGod: ShiShen;

  // 整體運勢
  overview: string;

  // 各方面運勢
  career: {
    score: number;
    description: string;
    opportunities: string[];
    challenges: string[];
  };
  wealth: {
    score: number;
    description: string;
    opportunities: string[];
    challenges: string[];
  };
  relationship: {
    score: number;
    description: string;
    opportunities: string[];
    challenges: string[];
  };
  health: {
    score: number;
    description: string;
    weakPoints: string[];
    advice: string[];
  };

  // 開運資訊
  luckyInfo: {
    colors: string[];
    directions: string[];
    numbers: number[];
    months: number[];
    activities: string[];
  };

  // 注意事項
  cautions: string[];

  // 每月重點
  monthlyHighlights: Array<{
    month: number;
    highlight: string;
    score: number;
  }>;
}

/** 流月詳細分析結果 */
export interface MonthlyFortuneDetail {
  month: number;
  ganZhi: string;
  gan: TianGan;
  zhi: DiZhi;
  tenGod: ShiShen;

  // 月份主題
  theme: string;
  overview: string;

  // 各方面運勢
  career: string;
  wealth: string;
  relationship: string;
  health: string;

  // 宜忌
  favorable: string[];
  unfavorable: string[];

  // 開運
  luckyDays: string;
  luckyColor: string;
  luckyDirection: string;

  // 提醒
  reminder: string;
}

/** 十神對應的詳細運勢說明 */
const TEN_GOD_FORTUNE_DETAILS: Record<ShiShen, {
  overview: string;
  career: { desc: string; opps: string[]; challenges: string[] };
  wealth: { desc: string; opps: string[]; challenges: string[] };
  relationship: { desc: string; opps: string[]; challenges: string[] };
  health: { desc: string; weakPoints: string[]; advice: string[] };
  cautions: string[];
}> = {
  '比肩': {
    overview: '比肩年是自我定位的一年。你會遇到與自己相似的人，可能是競爭對手，也可能是合作夥伴。這一年需要學會在競爭中合作，在合作中保持自我。',
    career: {
      desc: '事業上會遇到能力相當的競爭者，同時也有機會結識志同道合的夥伴。適合團隊合作，但要注意保持自己的核心競爭力。',
      opps: ['找到志同道合的合作夥伴', '同儕互助帶來資源', '團隊項目有發揮空間'],
      challenges: ['同儕競爭壓力', '合作中的意見分歧', '資源分配不均'],
    },
    wealth: {
      desc: '財運中等，有同儕資源可以互通有無。但也要注意財務界限，避免因人情而破財。',
      opps: ['合作項目的分成', '人脈帶來的商機', '同行推薦的機會'],
      challenges: ['因人情出借金錢', '合夥財務糾紛', '競爭導致價格戰'],
    },
    relationship: {
      desc: '感情上容易遇到與自己相似的人，有共同話題但也容易起爭執。單身者有機會在同好圈中認識對象。',
      opps: ['遇到價值觀相近的人', '透過興趣認識對象', '朋友介紹機會'],
      challenges: ['兩人太像容易摩擦', '缺乏互補性', '都很固執難妥協'],
    },
    health: {
      desc: '健康狀況穩定，但容易因為競爭壓力而影響睡眠和情緒。',
      weakPoints: ['肝膽系統（壓力）', '肌肉筋骨（過度使用）', '睡眠品質'],
      advice: ['保持適度運動', '學習放鬆技巧', '避免過度工作'],
    },
    cautions: ['避免與人爭鬥', '謹慎選擇合作對象', '保護自己的核心資源', '不要為了面子硬撐'],
  },

  '劫財': {
    overview: '劫財年是考驗理財能力的一年。容易有意外支出或投資風險，但同時也可能有偏財機會。關鍵在於謹慎評估，不要衝動行事。',
    career: {
      desc: '事業上可能面臨競爭和挑戰，有人可能會搶奪你的機會或功勞。但也是鍛鍊實力的好時機。',
      opps: ['證明自己實力的機會', '學習競爭中生存', '壓力下的成長'],
      challenges: ['被人搶功或搶位', '同事間的明爭暗鬥', '資源被瓜分'],
    },
    wealth: {
      desc: '財運波動大，有破財風險但也有偏財機會。不宜大額投資或投機。',
      opps: ['短期偏財運', '透過人脈獲得資訊', '危機中的機會'],
      challenges: ['意外破財', '投資失利', '被騙或被坑'],
    },
    relationship: {
      desc: '感情上容易有競爭者出現，或者感情中出現第三者。已有伴侶者要注意維護關係。',
      opps: ['感情中看清對方真心', '危機也是轉機', '篩選真正適合的人'],
      challenges: ['第三者介入', '感情競爭', '因錢財傷感情'],
    },
    health: {
      desc: '健康容易因為財務壓力或人際糾紛而受影響。要注意情緒管理。',
      weakPoints: ['肝臟（怒氣）', '心血管（壓力）', '失眠焦慮'],
      advice: ['避免賭博熬夜', '管理好情緒', '運動紓壓'],
    },
    cautions: ['謹慎投資理財', '避免賭博投機', '小心防騙', '不要輕易借錢給人', '保管好財物'],
  },

  '食神': {
    overview: '食神年是享受生活、展現才華的一年。創意靈感豐富，適合從事藝術、創作、教學等工作。但也要注意不要過度享樂。',
    career: {
      desc: '事業上適合發揮創意才能，有表現的舞台。適合文創、教育、餐飲、表演等行業。',
      opps: ['創意獲得認可', '有展現才華的機會', '教學或培訓機會'],
      challenges: ['容易懶散不積極', '創意難以商業化', '過於理想化'],
    },
    wealth: {
      desc: '財運穩定，透過才能獲得收入。但也容易花錢在享樂上。',
      opps: ['技能變現', '副業收入', '智慧財產收入'],
      challenges: ['花錢享樂', '投入太多在興趣上', '財務不夠謹慎'],
    },
    relationship: {
      desc: '感情運佳，有魅力吸引人。單身者容易遇到欣賞自己才華的人。',
      opps: ['才華吸引人', '相處輕鬆愉快', '有共同興趣'],
      challenges: ['太享受單身', '對感情不夠認真', '選擇太多'],
    },
    health: {
      desc: '健康狀況良好，但要注意飲食過量和消化系統。',
      weakPoints: ['脾胃消化', '體重管理', '代謝問題'],
      advice: ['飲食有節制', '保持適度運動', '享受但不過度'],
    },
    cautions: ['避免懶散', '控制享樂消費', '把創意轉化為實際成果'],
  },

  '傷官': {
    overview: '傷官年是突破創新的一年。有強烈的表現欲和創造力，但言行容易得罪人。適合技術突破，但要注意人際關係。',
    career: {
      desc: '事業上有創新突破的機會，適合技術研發、獨立作業。但容易與上司或權威衝突。',
      opps: ['技術創新突破', '獨立完成重要項目', '專業能力被認可'],
      challenges: ['得罪上司或貴人', '口舌是非', '過於特立獨行'],
    },
    wealth: {
      desc: '財運看專業能力，技術變現有機會。但可能因言行不當失去機會。',
      opps: ['專業技術帶來收入', '創新產品或服務', '獨特價值被看見'],
      challenges: ['因得罪人失去機會', '太理想化缺乏商業思維', '不屑於商業操作'],
    },
    relationship: {
      desc: '感情上容易因為太有主見而起衝突。單身者可能因為條件太高而錯過緣分。',
      opps: ['遇到欣賞真實自己的人', '不虛偽的感情', '知己難尋但真誠'],
      challenges: ['太挑剔', '說話傷人', '不願妥協'],
    },
    health: {
      desc: '健康要注意情緒起伏和言語過度。容易因為壓抑而身心失調。',
      weakPoints: ['呼吸系統', '神經系統', '情緒波動'],
      advice: ['學習適度表達', '找到宣洩出口', '運動釋放能量'],
    },
    cautions: ['管住嘴巴', '尊重權威', '收斂鋒芒', '不要太特立獨行'],
  },

  '偏財': {
    overview: '偏財年是財運活絡的一年。有意外之財的機會，但財來財去，不易守住。適合業務拓展、投資理財，但要見好就收。',
    career: {
      desc: '事業上適合業務開發、市場拓展。人脈廣泛，商機多多。',
      opps: ['業績突破', '新客戶開發', '跨界合作機會'],
      challenges: ['太多機會難以選擇', '分心於各種項目', '承諾太多做不到'],
    },
    wealth: {
      desc: '財運佳，有偏財和意外之財。但也容易大手大腳，財來財去。',
      opps: ['投資獲利', '意外收入', '業務獎金'],
      challenges: ['花錢不手軟', '投機過度', '財務管理鬆散'],
    },
    relationship: {
      desc: '感情上桃花旺盛，容易有多段感情機會。已婚者要注意異性緣。',
      opps: ['異性緣好', '社交機會多', '感情選擇多'],
      challenges: ['感情不專一', '桃花糾紛', '因財傷情'],
    },
    health: {
      desc: '健康要注意應酬過多帶來的負擔。',
      weakPoints: ['肝臟（應酬）', '脾胃（飲食不規律）', '作息紊亂'],
      advice: ['應酬有節制', '保持規律作息', '定期健康檢查'],
    },
    cautions: ['見好就收', '不要貪心', '保持財務紀律', '注意感情分寸'],
  },

  '正財': {
    overview: '正財年是穩健理財、感情進展的一年。適合儲蓄、投資穩定標的。感情上有望修成正果。',
    career: {
      desc: '事業穩定發展，適合本職工作深耕。薪資有望增長。',
      opps: ['薪資調漲', '穩定的項目', '老闆信任'],
      challenges: ['突破有限', '過於保守', '缺乏冒險精神'],
    },
    wealth: {
      desc: '財運穩定，適合儲蓄和長期投資。正當收入有增長。',
      opps: ['薪資收入增加', '穩健投資獲利', '資產保值'],
      challenges: ['過於保守錯失機會', '守財有餘開源不足', '太執著於錢'],
    },
    relationship: {
      desc: '感情上有實質進展，適合談婚論嫁。單身者容易遇到穩定對象。',
      opps: ['感情修成正果', '遇到可靠對象', '家庭和睦'],
      challenges: ['太重物質', '感情缺乏浪漫', '過於現實'],
    },
    health: {
      desc: '健康狀況穩定，注意保養即可。',
      weakPoints: ['脾胃（飲食）', '代謝（久坐）', '視力（用眼過度）'],
      advice: ['規律作息', '適度運動', '定期檢查'],
    },
    cautions: ['不要太保守', '適度投資', '感情中也要有浪漫'],
  },

  '七殺': {
    overview: '七殺年是充滿挑戰和壓力的一年。競爭激烈，壓力大，但也是突破和成長的機會。化壓力為動力，可以有大成就。',
    career: {
      desc: '事業上面臨強大競爭和壓力，但也是證明自己的機會。適合挑戰高難度任務。',
      opps: ['升職機會', '展現實力', '化敵為友'],
      challenges: ['壓力巨大', '競爭激烈', '工作過量'],
    },
    wealth: {
      desc: '財運看能力，有挑戰才有收穫。但不宜冒險投機。',
      opps: ['績效獎金', '能力提升帶來加薪', '競爭勝出'],
      challenges: ['壓力消費', '健康花費', '競爭失敗的損失'],
    },
    relationship: {
      desc: '感情上容易因為壓力而忽略伴侶。單身者可能在競爭環境中認識對象。',
      opps: ['共同奮鬥的革命情感', '危機中見真情', '強者吸引強者'],
      challenges: ['無暇經營感情', '壓力轉嫁伴侶', '太強勢'],
    },
    health: {
      desc: '健康是最大的挑戰，壓力大容易引發各種問題。必須特別注意。',
      weakPoints: ['心血管', '神經系統', '免疫系統', '腸胃問題'],
      advice: ['一定要運動', '學習減壓', '定期健康檢查', '不要硬撐'],
    },
    cautions: ['注意身體健康', '不要硬撐', '學習說不', '適時求助', '保持運動習慣'],
  },

  '正官': {
    overview: '正官年是事業晉升、建立威信的一年。適合考試、升職、建立專業形象。但也要注意遵守規則，不要踩線。',
    career: {
      desc: '事業運佳，有升遷機會。適合爭取正式職位，建立專業權威。',
      opps: ['升職加薪', '考試通過', '獲得認可'],
      challenges: ['責任加重', '規則限制', '被監督壓力'],
    },
    wealth: {
      desc: '財運穩定，正當收入有增長。適合透過升職加薪獲得財富。',
      opps: ['升職加薪', '正當收入增加', '穩定來源'],
      challenges: ['稅務問題', '花費在形象上', '交際應酬'],
    },
    relationship: {
      desc: '感情上有正式發展的機會，適合談婚論嫁。單身者可能遇到條件好的對象。',
      opps: ['正式交往', '結婚機會', '家長認可'],
      challenges: ['太注重條件', '形式大於感情', '缺乏浪漫'],
    },
    health: {
      desc: '健康穩定，但要注意壓力累積和應酬。',
      weakPoints: ['心血管', '肝臟', '壓力相關疾病'],
      advice: ['保持運動', '控制應酬', '注意血壓'],
    },
    cautions: ['遵守規則', '不要投機取巧', '維護好形象', '處理好上下關係'],
  },

  '偏印': {
    overview: '偏印年是學習轉型的一年。適合進修新技能、探索新領域。思想上會有轉變，可能改變職業方向。',
    career: {
      desc: '事業上可能面臨轉型，有機會進入新領域。適合學習和深造。',
      opps: ['學習新技能', '轉型機會', '特殊領域發展'],
      challenges: ['方向不明確', '中途放棄', '孤獨感'],
    },
    wealth: {
      desc: '財運平穩，可能花費在學習和自我提升上。投資回報較慢。',
      opps: ['技能提升帶來長期收益', '特殊知識變現', '深度發展'],
      challenges: ['短期收入減少', '投入學習的花費', '回報週期長'],
    },
    relationship: {
      desc: '感情上可能因為專注自我而忽略關係。單身者適合在學習環境中認識對象。',
      opps: ['遇到有深度的人', '精神契合', '共同成長'],
      challenges: ['太獨立', '不夠主動', '思慮太多'],
    },
    health: {
      desc: '健康上要注意精神層面，容易思慮過多。',
      weakPoints: ['神經系統', '睡眠問題', '精神狀態'],
      advice: ['保持社交', '不要太封閉', '運動紓壓'],
    },
    cautions: ['不要太孤僻', '完成開始的事', '保持社交', '不要鑽牛角尖'],
  },

  '正印': {
    overview: '正印年是貴人相助、學業進步的一年。適合進修、考試、養生。會得到長輩或貴人的幫助。',
    career: {
      desc: '事業上有貴人提攜，適合學習和考證。可能獲得培訓或進修機會。',
      opps: ['貴人提攜', '培訓機會', '考試通過'],
      challenges: ['太被動', '依賴他人', '缺乏主動性'],
    },
    wealth: {
      desc: '財運中等，透過貴人或學習獲得機會。不宜投機。',
      opps: ['貴人介紹機會', '穩定收入', '學習投資回報'],
      challenges: ['收入增長緩慢', '太保守', '錯過機會'],
    },
    relationship: {
      desc: '感情上有長輩或貴人介紹的機會。感情發展穩定溫馨。',
      opps: ['長輩介紹', '穩定發展', '家人認可'],
      challenges: ['太聽長輩的話', '缺乏激情', '被動等待'],
    },
    health: {
      desc: '健康狀況良好，適合養生調理。',
      weakPoints: ['脾胃', '代謝', '體重管理'],
      advice: ['規律作息', '養生調理', '適度運動'],
    },
    cautions: ['不要太被動', '學會主動爭取', '感恩但不依賴', '建立自己的能力'],
  },
};

/** 五行對應的開運資訊 */
const WUXING_LUCKY_INFO: Record<WuXing, {
  colors: string[];
  directions: string[];
  numbers: number[];
  activities: string[];
}> = {
  '木': {
    colors: ['綠色', '青色', '藍綠色'],
    directions: ['東方', '東南方'],
    numbers: [3, 8],
    activities: ['園藝', '登山健行', '閱讀學習', '創新創業'],
  },
  '火': {
    colors: ['紅色', '紫色', '橙色'],
    directions: ['南方'],
    numbers: [2, 7],
    activities: ['社交活動', '演講表演', '運動健身', '慶典聚會'],
  },
  '土': {
    colors: ['黃色', '咖啡色', '米色'],
    directions: ['中央', '東北方', '西南方'],
    numbers: [5, 10],
    activities: ['冥想靜心', '整理收納', '料理烹飪', '房產投資'],
  },
  '金': {
    colors: ['白色', '金色', '銀色'],
    directions: ['西方', '西北方'],
    numbers: [4, 9],
    activities: ['健身塑形', '學習技術', '投資理財', '精緻藝術'],
  },
  '水': {
    colors: ['黑色', '藍色', '深灰色'],
    directions: ['北方'],
    numbers: [1, 6],
    activities: ['游泳戲水', '旅遊探索', '學術研究', '冥想修行'],
  },
};

/**
 * 取得流年詳細分析
 */
export function getAnnualFortuneDetail(
  chart: BaZiChart,
  year: number,
  ganZhi: string,
  score: number,
  favorable: WuXing[],
  unfavorable: WuXing[]
): AnnualFortuneDetail {
  const gan = ganZhi[0] as TianGan;
  const zhi = ganZhi[1] as DiZhi;
  const dayGan = chart.day.gan;

  const tenGod = getTenGod(dayGan, gan);
  const zhiTenGod = getTenGod(dayGan, getZhiGan(zhi));

  const detail = TEN_GOD_FORTUNE_DETAILS[tenGod];
  const ganElement = TIAN_GAN_ELEMENT[gan];
  const luckyInfo = WUXING_LUCKY_INFO[favorable[0] || ganElement];

  // 計算各方面分數
  const careerScore = calculateAspectScore(score, tenGod, 'career');
  const wealthScore = calculateAspectScore(score, tenGod, 'wealth');
  const relationshipScore = calculateAspectScore(score, tenGod, 'relationship');
  const healthScore = calculateAspectScore(score, tenGod, 'health');

  // 計算每月重點
  const monthlyHighlights = generateMonthlyHighlights(year, tenGod, score);

  // 開運月份
  const luckyMonths = favorable.map(el => getElementMonth(el)).flat().filter(m => m > 0);

  return {
    year,
    ganZhi,
    gan,
    zhi,
    tenGod,
    zhiTenGod,
    overview: detail.overview,
    career: {
      score: careerScore,
      description: detail.career.desc,
      opportunities: detail.career.opps,
      challenges: detail.career.challenges,
    },
    wealth: {
      score: wealthScore,
      description: detail.wealth.desc,
      opportunities: detail.wealth.opps,
      challenges: detail.wealth.challenges,
    },
    relationship: {
      score: relationshipScore,
      description: detail.relationship.desc,
      opportunities: detail.relationship.opps,
      challenges: detail.relationship.challenges,
    },
    health: {
      score: healthScore,
      description: detail.health.desc,
      weakPoints: detail.health.weakPoints,
      advice: detail.health.advice,
    },
    luckyInfo: {
      colors: luckyInfo.colors,
      directions: luckyInfo.directions,
      numbers: luckyInfo.numbers,
      months: luckyMonths.slice(0, 4),
      activities: luckyInfo.activities,
    },
    cautions: detail.cautions,
    monthlyHighlights,
  };
}

/**
 * 取得流月詳細分析
 */
export function getMonthlyFortuneDetail(
  chart: BaZiChart,
  month: number,
  ganZhi: string,
  score: number,
  favorable: WuXing[]
): MonthlyFortuneDetail {
  const gan = ganZhi[0] as TianGan;
  const zhi = ganZhi[1] as DiZhi;
  const dayGan = chart.day.gan;

  const tenGod = getTenGod(dayGan, gan);
  const detail = TEN_GOD_FORTUNE_DETAILS[tenGod];
  const ganElement = TIAN_GAN_ELEMENT[gan];
  const zhiElement = DI_ZHI_ELEMENT[zhi];

  const isFavorable = favorable.includes(ganElement) || favorable.includes(zhiElement);
  const luckyInfo = WUXING_LUCKY_INFO[favorable[0] || ganElement];

  // 生成宜忌
  const favorableActions = generateFavorableActions(tenGod, score);
  const unfavorableActions = generateUnfavorableActions(tenGod, score);

  // 開運日期建議
  const luckyDays = generateLuckyDays(month, tenGod);

  return {
    month,
    ganZhi,
    gan,
    zhi,
    tenGod,
    theme: getMonthTheme(tenGod, month),
    overview: generateMonthOverview(tenGod, score, isFavorable),
    career: generateMonthCareer(tenGod, score),
    wealth: generateMonthWealth(tenGod, score),
    relationship: generateMonthRelationship(tenGod, score),
    health: generateMonthHealth(tenGod, score),
    favorable: favorableActions,
    unfavorable: unfavorableActions,
    luckyDays,
    luckyColor: luckyInfo.colors[0],
    luckyDirection: luckyInfo.directions[0],
    reminder: generateMonthReminder(tenGod, score),
  };
}

// ===== 輔助函數 =====

function getZhiGan(zhi: DiZhi): TianGan {
  const zhiGanMap: Record<DiZhi, TianGan> = {
    '子': '癸', '丑': '己', '寅': '甲', '卯': '乙',
    '辰': '戊', '巳': '丙', '午': '丁', '未': '己',
    '申': '庚', '酉': '辛', '戌': '戊', '亥': '壬',
  };
  return zhiGanMap[zhi];
}

function calculateAspectScore(baseScore: number, tenGod: ShiShen, aspect: string): number {
  const adjustments: Record<ShiShen, Record<string, number>> = {
    '比肩': { career: 0, wealth: -5, relationship: 0, health: 5 },
    '劫財': { career: -5, wealth: -10, relationship: -5, health: 0 },
    '食神': { career: 5, wealth: 5, relationship: 10, health: 10 },
    '傷官': { career: 5, wealth: 0, relationship: -5, health: 0 },
    '偏財': { career: 5, wealth: 10, relationship: 5, health: -5 },
    '正財': { career: 5, wealth: 10, relationship: 10, health: 5 },
    '七殺': { career: 10, wealth: 5, relationship: -5, health: -10 },
    '正官': { career: 15, wealth: 5, relationship: 5, health: 0 },
    '偏印': { career: 0, wealth: -5, relationship: -5, health: 5 },
    '正印': { career: 5, wealth: 0, relationship: 5, health: 10 },
  };

  const adj = adjustments[tenGod][aspect] || 0;
  return Math.max(0, Math.min(100, baseScore + adj));
}

function generateMonthlyHighlights(year: number, tenGod: ShiShen, baseScore: number): Array<{ month: number; highlight: string; score: number }> {
  const highlights: Array<{ month: number; highlight: string; score: number }> = [];
  const monthHighlights: Record<number, string> = {
    1: '新年新氣象，規劃全年目標',
    2: '人際活絡期，多參與社交',
    3: '事業發力月，把握機會',
    4: '穩定發展期，鞏固成果',
    5: '財運活絡月，注意理財',
    6: '調整休養期，保持健康',
    7: '下半年開端，重新出發',
    8: '收穫期來臨，見好就收',
    9: '轉型調整月，規劃未來',
    10: '衝刺關鍵期，全力以赴',
    11: '收尾準備月，完成任務',
    12: '年終總結，休養生息',
  };

  for (let m = 1; m <= 12; m++) {
    const scoreVariation = Math.floor(Math.random() * 20) - 10;
    highlights.push({
      month: m,
      highlight: monthHighlights[m],
      score: Math.max(30, Math.min(90, baseScore + scoreVariation)),
    });
  }

  return highlights;
}

function getElementMonth(element: WuXing): number[] {
  const elementMonths: Record<WuXing, number[]> = {
    '木': [2, 3],    // 春
    '火': [5, 6],    // 夏
    '土': [3, 6, 9, 12], // 四季末
    '金': [8, 9],    // 秋
    '水': [11, 12],  // 冬
  };
  return elementMonths[element] || [];
}

function getMonthTheme(tenGod: ShiShen, month: number): string {
  const baseTheme = TEN_GOD_FORTUNE_DETAILS[tenGod].overview.split('。')[0];
  const seasonTheme: Record<number, string> = {
    1: '新年開局', 2: '春意萌動', 3: '萬物生長',
    4: '穩步前進', 5: '熱情高漲', 6: '夏日當道',
    7: '承先啟後', 8: '秋收在望', 9: '金風送爽',
    10: '收穫季節', 11: '沉澱蓄力', 12: '歲末總結',
  };
  return `${seasonTheme[month] || '穩定發展'}・${baseTheme}`;
}

function generateMonthOverview(tenGod: ShiShen, score: number, isFavorable: boolean): string {
  const detail = TEN_GOD_FORTUNE_DETAILS[tenGod];
  let overview = detail.overview;

  if (score >= 70) {
    overview += '本月運勢順遂，把握機會積極行動。';
  } else if (score >= 50) {
    overview += '本月運勢平穩，穩中求進為佳。';
  } else {
    overview += '本月運勢需謹慎，避免冒險行事。';
  }

  if (isFavorable) {
    overview += '五行配合良好，有利於發展。';
  }

  return overview;
}

function generateMonthCareer(tenGod: ShiShen, score: number): string {
  const detail = TEN_GOD_FORTUNE_DETAILS[tenGod];
  if (score >= 65) return `${detail.career.desc} 本月事業運佳，可積極爭取機會。`;
  if (score >= 45) return `${detail.career.desc} 本月事業穩定，按部就班即可。`;
  return `${detail.career.desc} 本月事業需謹慎，避免重大決策。`;
}

function generateMonthWealth(tenGod: ShiShen, score: number): string {
  const detail = TEN_GOD_FORTUNE_DETAILS[tenGod];
  if (score >= 65) return `${detail.wealth.desc} 財運活絡，可適度投資。`;
  if (score >= 45) return `${detail.wealth.desc} 財運平穩，以守為主。`;
  return `${detail.wealth.desc} 財運較弱，避免大額支出。`;
}

function generateMonthRelationship(tenGod: ShiShen, score: number): string {
  const detail = TEN_GOD_FORTUNE_DETAILS[tenGod];
  if (score >= 65) return `${detail.relationship.desc} 感情運佳，適合主動出擊。`;
  if (score >= 45) return `${detail.relationship.desc} 感情平穩，維護現有關係。`;
  return `${detail.relationship.desc} 感情需經營，避免爭執。`;
}

function generateMonthHealth(tenGod: ShiShen, score: number): string {
  const detail = TEN_GOD_FORTUNE_DETAILS[tenGod];
  const weakPoints = detail.health.weakPoints.slice(0, 2).join('、');
  if (score >= 65) return `健康狀況良好，保持運動習慣。注意${weakPoints}。`;
  if (score >= 45) return `健康狀況穩定，注意作息。留意${weakPoints}。`;
  return `健康需留意，避免過勞。特別注意${weakPoints}。`;
}

function generateFavorableActions(tenGod: ShiShen, score: number): string[] {
  const baseActions = ['規劃未來', '學習新知', '保持健康'];
  const tenGodActions: Record<ShiShen, string[]> = {
    '比肩': ['團隊合作', '同儕交流', '建立人脈'],
    '劫財': ['謹慎投資', '保護資產', '提升技能'],
    '食神': ['展現才華', '美食享受', '藝術創作'],
    '傷官': ['創新突破', '技術研發', '獨立作業'],
    '偏財': ['業務拓展', '商機把握', '人脈經營'],
    '正財': ['穩健理財', '長期投資', '經營感情'],
    '七殺': ['迎接挑戰', '鍛鍊身體', '證明實力'],
    '正官': ['爭取升遷', '考試進修', '建立威信'],
    '偏印': ['學習進修', '探索新領域', '深度思考'],
    '正印': ['接受幫助', '養生調理', '學業精進'],
  };

  return [...tenGodActions[tenGod], ...baseActions.slice(0, 2)];
}

function generateUnfavorableActions(tenGod: ShiShen, score: number): string[] {
  const baseAvoid = ['過度勞累', '衝動決策'];
  const tenGodAvoid: Record<ShiShen, string[]> = {
    '比肩': ['與人爭執', '獨自蠻幹'],
    '劫財': ['賭博投機', '借錢給人'],
    '食神': ['過度享樂', '懶散懈怠'],
    '傷官': ['得罪貴人', '言語傷人'],
    '偏財': ['大額投機', '感情不專'],
    '正財': ['過於保守', '錯失良機'],
    '七殺': ['硬撐不休息', '樹敵太多'],
    '正官': ['投機取巧', '違規踩線'],
    '偏印': ['半途而廢', '過於封閉'],
    '正印': ['過度依賴', '被動等待'],
  };

  return [...tenGodAvoid[tenGod], ...baseAvoid];
}

function generateLuckyDays(month: number, tenGod: ShiShen): string {
  const luckyDays = [3, 8, 13, 18, 23, 28].filter(d => d <= 28);
  return `${month}月${luckyDays.slice(0, 3).join('、')}日`;
}

function generateMonthReminder(tenGod: ShiShen, score: number): string {
  const detail = TEN_GOD_FORTUNE_DETAILS[tenGod];
  if (score >= 65) {
    return '運勢順遂，把握機會但不要驕傲。';
  } else if (score >= 45) {
    return `${detail.cautions[0]}，穩健前進。`;
  }
  return `${detail.cautions.slice(0, 2).join('，')}。`;
}
