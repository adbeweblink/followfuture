/**
 * 五行文案模板
 * 提供五行特質、相生相剋關係、調候建議
 */

import type { WuXing } from '@/lib/bazi/types';

interface WuXingDescription {
  name: WuXing;
  symbol: string;
  color: string;
  season: string;
  direction: string;
  organ: string;
  emotion: string;
  personality: string;
  strengths: string[];
  weaknesses: string[];
  enhancers: string[];
  reducers: string[];
  careers: string[];
  health: string;
}

export const WUXING_DESCRIPTIONS: Record<WuXing, WuXingDescription> = {
  '木': {
    name: '木',
    symbol: '🌳',
    color: '青綠色',
    season: '春季',
    direction: '東方',
    organ: '肝膽',
    emotion: '怒',
    personality: '木主仁，代表生發、向上的力量。木型人性格仁慈、正直，有同情心和責任感。思維積極向上，追求成長與進步。',
    strengths: [
      '仁慈善良，富有同情心',
      '積極進取，追求成長',
      '正直剛毅，有原則',
      '創意豐富，想像力強',
    ],
    weaknesses: [
      '容易急躁，缺乏耐心',
      '固執己見，不易妥協',
      '有時過於理想化',
      '壓力大時容易發怒',
    ],
    enhancers: ['水生木：多接觸水元素（藍黑色、北方）', '木助木：親近綠色植物、木製品'],
    reducers: ['金剋木：避免過多金屬元素', '木生火：過度消耗需注意休息'],
    careers: ['教育', '文化', '出版', '設計', '園藝', '醫療', '社工'],
    health: '木主肝膽，需注意肝臟保養，避免熬夜和情緒壓抑。建議多做舒展運動，保持心情舒暢。',
  },

  '火': {
    name: '火',
    symbol: '🔥',
    color: '紅色',
    season: '夏季',
    direction: '南方',
    organ: '心臟',
    emotion: '喜',
    personality: '火主禮，代表熱情、向上的能量。火型人性格熱情開朗，有感染力和表現欲。做事積極主動，喜歡成為焦點。',
    strengths: [
      '熱情洋溢，感染力強',
      '積極樂觀，充滿活力',
      '表達能力佳，善於溝通',
      '有領導魅力，敢於表現',
    ],
    weaknesses: [
      '容易衝動，缺乏深思',
      '脾氣急躁，不夠沉穩',
      '三分鐘熱度，持久力不足',
      '過於張揚，容易得罪人',
    ],
    enhancers: ['木生火：多接觸木元素（綠色、東方）', '火助火：適量紅色點綴'],
    reducers: ['水剋火：過多水元素會澆熄熱情', '火生土：過度付出會耗盡能量'],
    careers: ['演藝', '公關', '行銷', '運動', '餐飲', '美容', '傳媒'],
    health: '火主心臟，需注意心血管保養。避免過度興奮和熬夜，保持情緒穩定，適當冷靜。',
  },

  '土': {
    name: '土',
    symbol: '🏔️',
    color: '黃色',
    season: '四季末',
    direction: '中央',
    organ: '脾胃',
    emotion: '思',
    personality: '土主信，代表厚重、穩定的力量。土型人性格穩重踏實，有耐心和包容心。做事可靠，重視承諾和誠信。',
    strengths: [
      '穩重踏實，值得信賴',
      '包容心強，不與人計較',
      '有耐心，做事持久',
      '誠信守諾，言出必行',
    ],
    weaknesses: [
      '有時過於保守，缺乏變通',
      '反應較慢，不夠靈活',
      '容易固執，難以改變',
      '過度思慮，優柔寡斷',
    ],
    enhancers: ['火生土：多接觸火元素（紅色、南方）', '土助土：親近土地、陶瓷'],
    reducers: ['木剋土：過多木元素會動搖穩定', '土生金：過度消耗需補充能量'],
    careers: ['房地產', '農業', '建築', '倉儲', '信託', '管理', '顧問'],
    health: '土主脾胃，需注意消化系統保養。飲食規律，避免暴飲暴食，少吃生冷食物。',
  },

  '金': {
    name: '金',
    symbol: '⚔️',
    color: '白色、金色',
    season: '秋季',
    direction: '西方',
    organ: '肺大腸',
    emotion: '悲',
    personality: '金主義，代表堅毅、果斷的力量。金型人性格剛強果斷，有原則和魄力。做事講求效率，追求完美和精準。',
    strengths: [
      '果斷俐落，執行力強',
      '有原則，講求公正',
      '意志堅強，不輕言放棄',
      '追求完美，精益求精',
    ],
    weaknesses: [
      '過於剛強，缺乏彈性',
      '容易挑剔，標準過高',
      '有時太冷漠，缺乏溫情',
      '固執己見，不易溝通',
    ],
    enhancers: ['土生金：多接觸土元素（黃色、中央）', '金助金：佩戴金屬飾品'],
    reducers: ['火剋金：過多火元素會融化堅持', '金生水：過度消耗影響魄力'],
    careers: ['金融', '法律', '軍警', '機械', '珠寶', '科技', '外科'],
    health: '金主肺與大腸，需注意呼吸系統保養。保持空氣清新，避免菸酒，注意秋冬保暖。',
  },

  '水': {
    name: '水',
    symbol: '💧',
    color: '黑色、藍色',
    season: '冬季',
    direction: '北方',
    organ: '腎膀胱',
    emotion: '恐',
    personality: '水主智，代表流動、智慧的力量。水型人性格聰明靈活，有洞察力和適應能力。思維敏捷，善於應變。',
    strengths: [
      '聰明睿智，洞察力強',
      '靈活應變，適應力佳',
      '善於溝通，人際圓融',
      '思維深邃，善於謀略',
    ],
    weaknesses: [
      '有時過於圓滑，缺乏原則',
      '想太多，容易憂慮',
      '情緒起伏，不夠穩定',
      '缺乏行動力，猶豫不決',
    ],
    enhancers: ['金生水：多接觸金元素（白色、西方）', '水助水：親近水邊環境'],
    reducers: ['土剋水：過多土元素會阻礙流動', '水生木：過度付出會消耗智慧'],
    careers: ['貿易', '物流', '旅遊', '傳播', '諮詢', '研究', '外交'],
    health: '水主腎與膀胱，需注意泌尿系統保養。多喝水，避免過度勞累，冬天注意保暖腰部。',
  },
};

/**
 * 五行生剋關係
 */
export const WUXING_RELATIONS = {
  generates: {
    '木': '火',
    '火': '土',
    '土': '金',
    '金': '水',
    '水': '木',
  } as Record<WuXing, WuXing>,

  controls: {
    '木': '土',
    '土': '水',
    '水': '火',
    '火': '金',
    '金': '木',
  } as Record<WuXing, WuXing>,
};

/**
 * 根據日主五行生成基礎性格分析
 */
export function generateDayMasterAnalysis(dayElement: WuXing): string {
  const desc = WUXING_DESCRIPTIONS[dayElement];

  return `**元神屬${dayElement}** ${desc.symbol}\n\n${desc.personality}\n\n` +
    `**色彩**：${desc.color}｜**方位**：${desc.direction}｜**季節**：${desc.season}\n\n` +
    `**性格優勢**：\n${desc.strengths.map(s => `• ${s}`).join('\n')}\n\n` +
    `**需要注意**：\n${desc.weaknesses.map(w => `• ${w}`).join('\n')}`;
}

/**
 * 根據五行分布生成平衡建議
 */
export function generateWuXingAdvice(
  dayElement: WuXing,
  wuXingStats: Record<WuXing, number>,
  isStrong: boolean
): string {
  const total = Object.values(wuXingStats).reduce((a, b) => a + b, 0);
  const percentages: Record<WuXing, number> = {} as Record<WuXing, number>;

  for (const [element, count] of Object.entries(wuXingStats)) {
    percentages[element as WuXing] = Math.round((count / total) * 100);
  }

  // 找出最強和最弱的五行
  const sorted = Object.entries(percentages).sort(([, a], [, b]) => b - a);
  const strongest = sorted[0][0] as WuXing;
  const weakest = sorted[sorted.length - 1][0] as WuXing;

  let advice = '**五行調候建議**\n\n';

  if (isStrong) {
    // 身強需要洩耗
    const exhausting = WUXING_RELATIONS.generates[dayElement]; // 食傷
    const controlling = WUXING_RELATIONS.controls[dayElement]; // 財
    advice += `日主身強，宜適度消耗能量。\n`;
    advice += `• 可多接觸「${exhausting}」元素來洩秀（${WUXING_DESCRIPTIONS[exhausting].color}）\n`;
    advice += `• 或透過「${controlling}」元素來發揮（${WUXING_DESCRIPTIONS[controlling].color}）\n`;
  } else {
    // 身弱需要生扶
    const generating = Object.entries(WUXING_RELATIONS.generates)
      .find(([_, v]) => v === dayElement)?.[0] as WuXing; // 印
    advice += `日主身弱，宜補充能量。\n`;
    advice += `• 可多接觸「${generating}」元素來生扶（${WUXING_DESCRIPTIONS[generating].color}）\n`;
    advice += `• 或親近「${dayElement}」元素來加強（${WUXING_DESCRIPTIONS[dayElement].color}）\n`;
  }

  advice += `\n**當前五行分布**：\n`;
  advice += sorted.map(([el, pct]) => `${el}：${pct}%`).join('｜');

  if (percentages[weakest] < 10) {
    advice += `\n\n⚠️ 注意：「${weakest}」較為不足，可適當補充。`;
  }

  return advice;
}

/**
 * 獲取五行相關的健康建議
 */
export function getHealthAdvice(dayElement: WuXing): string {
  return WUXING_DESCRIPTIONS[dayElement].health;
}

/**
 * 獲取五行相關的職業建議
 */
export function getCareerAdvice(dayElement: WuXing, favorableElements: WuXing[]): string {
  let careers: string[] = [];

  for (const element of favorableElements) {
    careers = [...careers, ...WUXING_DESCRIPTIONS[element].careers.slice(0, 2)];
  }

  return `根據命盤五行配置，適合從事與「${favorableElements.join('、')}」相關的行業：\n` +
    `${careers.join('、')}等。`;
}
