/**
 * 年柱單論分析模組
 * 分析年柱的意義：祖業、根基、童年、祖父母緣分
 */

import type { BaZiChart, TianGan, DiZhi, WuXing, ShiShen } from './types';
import { getTenGod } from './ten-gods';
import { TIAN_GAN_ELEMENT, DI_ZHI_ELEMENT } from '@/data/constants';

export interface YearPillarAnalysis {
  ganZhi: string;
  naYin: string;
  ganElement: WuXing;
  zhiElement: WuXing;
  tenGod: ShiShen;

  // 六親與宮位
  ancestorRelation: string;      // 祖輩關係
  familyBackground: string;      // 家庭背景
  childhoodFortune: string;      // 童年運勢

  // 年柱特質
  socialImage: string;           // 社會形象
  rootFoundation: string;        // 根基穩固度
  inheritanceProspect: string;   // 祖業繼承

  // 綜合建議
  summary: string;
  advice: string[];
}

/**
 * 年柱天干性格特質（社會面向）
 */
const YEAR_GAN_TRAITS: Record<TianGan, {
  socialImage: string;
  familyStyle: string;
  rootStrength: string;
}> = {
  '甲': {
    socialImage: '家族有開創精神，祖輩多為正直之人，社會形象良好。',
    familyStyle: '家風正派，重視傳統價值，有領導家族的氣質。',
    rootStrength: '根基穩固，祖業有一定規模，適合繼承發展。',
  },
  '乙': {
    socialImage: '家族柔和內斂，祖輩為人圓融，人際關係佳。',
    familyStyle: '家風溫和，重視和諧，善於與人合作。',
    rootStrength: '根基柔韌，雖非大富大貴但穩定持久。',
  },
  '丙': {
    socialImage: '家族熱情開朗，祖輩性格外向，社交廣泛。',
    familyStyle: '家風光明，重視禮節，待人熱情大方。',
    rootStrength: '根基明亮，祖業或有起伏但不失正途。',
  },
  '丁': {
    socialImage: '家族細膩含蓄，祖輩有文化涵養，重視教育。',
    familyStyle: '家風文雅，重視內在修養，有書香氣息。',
    rootStrength: '根基內斂，祖業重在精神傳承而非物質。',
  },
  '戊': {
    socialImage: '家族厚重穩健，祖輩為人敦厚，信用良好。',
    familyStyle: '家風樸實，重視誠信，有容人之量。',
    rootStrength: '根基深厚，祖業穩固，適合守成發展。',
  },
  '己': {
    socialImage: '家族低調務實，祖輩勤勞節儉，重視積累。',
    familyStyle: '家風內斂，重視實際，不尚虛華。',
    rootStrength: '根基平實，祖業不顯但實用，需自己努力。',
  },
  '庚': {
    socialImage: '家族剛毅果斷，祖輩性格剛強，有開拓精神。',
    familyStyle: '家風嚴謹，重視原則，教育嚴格。',
    rootStrength: '根基堅實，祖業或起於艱難但有潛力。',
  },
  '辛': {
    socialImage: '家族精緻講究，祖輩有品味，重視質感。',
    familyStyle: '家風優雅，重視細節，追求完美。',
    rootStrength: '根基精巧，祖業或不大但質量優良。',
  },
  '壬': {
    socialImage: '家族大氣豪爽，祖輩心胸寬廣，交際廣泛。',
    familyStyle: '家風開放，重視智慧，善於變通。',
    rootStrength: '根基廣闊，祖業或有流動性，需把握機會。',
  },
  '癸': {
    socialImage: '家族聰慧內斂，祖輩有謀略，善於觀察。',
    familyStyle: '家風深沉，重視學問，有神秘感。',
    rootStrength: '根基靈活，祖業可能多變，需善加運用。',
  },
};

/**
 * 年柱地支特質（家族根源）
 */
const YEAR_ZHI_TRAITS: Record<DiZhi, {
  ancestorType: string;
  childhoodEnv: string;
  inheritance: string;
}> = {
  '子': {
    ancestorType: '祖輩聰明機敏，家族中多有智者，重視教育和知識傳承。',
    childhoodEnv: '童年環境靈活多變，可能居住環境有變動。',
    inheritance: '祖業可能涉及水相關或流動性較大的產業。',
  },
  '丑': {
    ancestorType: '祖輩勤勞務實，家族重視積累，有土地或不動產傳承。',
    childhoodEnv: '童年環境穩定，但可能較為保守。',
    inheritance: '祖業多為實體資產，如房產、土地等。',
  },
  '寅': {
    ancestorType: '祖輩有開拓精神，家族中可能有從政或經商者。',
    childhoodEnv: '童年活力充沛，可能較早獨立。',
    inheritance: '祖業有發展潛力，適合繼承並擴大。',
  },
  '卯': {
    ancestorType: '祖輩溫和仁慈，家族重視和諧，有文藝氣息。',
    childhoodEnv: '童年環境和睦，受長輩疼愛。',
    inheritance: '祖業可能與木材、家具、文化相關。',
  },
  '辰': {
    ancestorType: '祖輩有威望，家族可能有特殊成就或地位。',
    childhoodEnv: '童年環境有變化，可能經歷重要轉折。',
    inheritance: '祖業可能涉及土地、倉儲或有神秘色彩。',
  },
  '巳': {
    ancestorType: '祖輩聰明變通，家族中可能有從事專業技術者。',
    childhoodEnv: '童年思維活躍，學習能力強。',
    inheritance: '祖業可能與火、能源或技術相關。',
  },
  '午': {
    ancestorType: '祖輩熱情外向，家族社交活躍，重視名聲。',
    childhoodEnv: '童年陽光開朗，受到關注較多。',
    inheritance: '祖業可能與馬、交通或文化娛樂相關。',
  },
  '未': {
    ancestorType: '祖輩溫順善良，家族重視傳統，有信仰傾向。',
    childhoodEnv: '童年環境溫馨，但可能有些壓抑。',
    inheritance: '祖業可能與農業、飲食或宗教相關。',
  },
  '申': {
    ancestorType: '祖輩精明能幹，家族有商業頭腦或技術專長。',
    childhoodEnv: '童年多動好學，接觸面廣。',
    inheritance: '祖業可能與金屬、機械或法律相關。',
  },
  '酉': {
    ancestorType: '祖輩講究精細，家族重視品質，有藝術傾向。',
    childhoodEnv: '童年環境精緻，教育良好。',
    inheritance: '祖業可能與珠寶、精密工業或酒業相關。',
  },
  '戌': {
    ancestorType: '祖輩忠厚守信，家族重視道德，有護衛精神。',
    childhoodEnv: '童年環境安全，但可能較嚴肅。',
    inheritance: '祖業可能與土地、保安或宗教相關。',
  },
  '亥': {
    ancestorType: '祖輩豁達大度，家族有文化底蘊，善於交際。',
    childhoodEnv: '童年環境自由，想像力豐富。',
    inheritance: '祖業可能與水產、航運或教育相關。',
  },
};

/**
 * 年柱十神意義（相對日主）
 */
const YEAR_TEN_GOD_MEANING: Record<ShiShen, string> = {
  '比肩': '祖輩同輩兄弟多，家族競爭意識強，需靠自己奮鬥。',
  '劫財': '祖業可能有爭奪，早年經濟不穩，需防財務流失。',
  '食神': '祖輩福氣好，家族重視享受，童年生活優渥。',
  '傷官': '祖輩有才華但叛逆，家族關係可能有波折。',
  '偏財': '祖輩善於理財，家族有商業傳統，可得意外之財。',
  '正財': '祖業穩定，家族財務管理良好，有固定資產傳承。',
  '七殺': '祖輩有權威或軍事背景，童年管教嚴格，早熟獨立。',
  '正官': '祖輩有官職或社會地位，家族重視規矩和名聲。',
  '偏印': '祖輩有特殊技藝，家族可能有藝術或宗教傳統。',
  '正印': '祖輩有學問，家族重視教育，童年受長輩疼愛照顧。',
};

/**
 * 分析年柱
 */
export function analyzeYearPillar(chart: BaZiChart): YearPillarAnalysis {
  const yearGan = chart.year.gan;
  const yearZhi = chart.year.zhi;
  const ganZhi = yearGan + yearZhi;

  const ganElement = TIAN_GAN_ELEMENT[yearGan];
  const zhiElement = DI_ZHI_ELEMENT[yearZhi];
  const naYin = chart.year.naYin || '';
  const tenGod = getTenGod(chart.day.gan, yearGan);

  const ganTraits = YEAR_GAN_TRAITS[yearGan];
  const zhiTraits = YEAR_ZHI_TRAITS[yearZhi];
  const tenGodMeaning = YEAR_TEN_GOD_MEANING[tenGod];

  // 組合分析
  const ancestorRelation = `${zhiTraits.ancestorType} ${tenGodMeaning}`;
  const familyBackground = ganTraits.familyStyle;
  const childhoodFortune = zhiTraits.childhoodEnv;
  const socialImage = ganTraits.socialImage;
  const rootFoundation = ganTraits.rootStrength;
  const inheritanceProspect = zhiTraits.inheritance;

  // 生成總結
  const summary = generateYearSummary(yearGan, yearZhi, tenGod);
  const advice = generateYearAdvice(tenGod, ganElement, zhiElement);

  return {
    ganZhi,
    naYin,
    ganElement,
    zhiElement,
    tenGod,
    ancestorRelation,
    familyBackground,
    childhoodFortune,
    socialImage,
    rootFoundation,
    inheritanceProspect,
    summary,
    advice,
  };
}

/**
 * 生成年柱總結
 */
function generateYearSummary(gan: TianGan, zhi: DiZhi, tenGod: ShiShen): string {
  const summaryParts: string[] = [];

  // 基於十神的總結
  switch (tenGod) {
    case '正印':
    case '偏印':
      summaryParts.push('童年得長輩照顧，家庭教育良好');
      break;
    case '正官':
    case '七殺':
      summaryParts.push('家族有規矩傳統，童年管教較嚴');
      break;
    case '正財':
    case '偏財':
      summaryParts.push('家族經濟條件不錯，祖業有傳承');
      break;
    case '食神':
    case '傷官':
      summaryParts.push('童年生活較自由，有發揮才華空間');
      break;
    case '比肩':
    case '劫財':
      summaryParts.push('家族同輩競爭，需靠自己打拼');
      break;
  }

  // 基於地支的補充
  if (['寅', '午', '戌'].includes(zhi)) {
    summaryParts.push('家族有開拓進取精神');
  } else if (['申', '子', '辰'].includes(zhi)) {
    summaryParts.push('家族重視智慧和變通');
  } else if (['巳', '酉', '丑'].includes(zhi)) {
    summaryParts.push('家族重視品質和細節');
  } else {
    summaryParts.push('家族重視傳統和仁義');
  }

  return summaryParts.join('，') + '。';
}

/**
 * 生成年柱建議
 */
function generateYearAdvice(tenGod: ShiShen, ganElement: WuXing, zhiElement: WuXing): string[] {
  const advice: string[] = [];

  // 基於十神的建議
  switch (tenGod) {
    case '正印':
    case '偏印':
      advice.push('善用長輩資源，尊重傳統智慧');
      advice.push('定期回家探望長輩，維繫家族感情');
      break;
    case '正官':
    case '七殺':
      advice.push('傳承家族優良傳統，但不必過度拘泥');
      advice.push('將家族期望轉化為前進動力');
      break;
    case '正財':
    case '偏財':
      advice.push('善加利用祖業資源，穩健發展');
      advice.push('理財時可參考家族經驗');
      break;
    case '食神':
    case '傷官':
      advice.push('發揮創意才華，開創新局面');
      advice.push('保持與家族的良好溝通');
      break;
    case '比肩':
    case '劫財':
      advice.push('與家族成員保持適當距離');
      advice.push('靠自己努力建立基業');
      break;
  }

  // 通用建議
  advice.push('了解家族歷史，傳承優良品德');

  return advice;
}

/**
 * 獲取年柱簡要摘要
 */
export function getYearPillarSummary(chart: BaZiChart): string {
  const analysis = analyzeYearPillar(chart);
  return `年柱${analysis.ganZhi}（${analysis.naYin}），${analysis.summary}`;
}
