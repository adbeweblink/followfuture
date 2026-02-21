/**
 * 時柱單論分析模組
 * 分析時柱的意義：晚年、子女、事業成就、創業運
 */

import type { BaZiChart, TianGan, DiZhi, WuXing, ShiShen, Gender } from './types';
import { getTenGod } from './ten-gods';
import { TIAN_GAN_ELEMENT, DI_ZHI_ELEMENT } from '@/data/constants';

export interface HourPillarAnalysis {
  ganZhi: string;
  naYin: string;
  ganElement: WuXing;
  zhiElement: WuXing;
  tenGod: ShiShen;

  // 子女宮位
  childrenFortune: string;       // 子女運
  childrenRelation: string;      // 子女關係
  childrenCount: string;         // 子女數量傾向

  // 晚年運勢
  lateLifeFortune: string;       // 晚年運勢
  retirementLife: string;        // 退休生活
  healthOutlook: string;         // 晚年健康展望

  // 事業成就
  careerAchievement: string;     // 事業成就
  creativeAbility: string;       // 創業能力
  legacyProspect: string;        // 留給後代的遺產

  // 綜合建議
  summary: string;
  advice: string[];
}

/**
 * 時柱天干性格特質（內在傾向、晚年展現）
 */
const HOUR_GAN_TRAITS: Record<TianGan, {
  innerSelf: string;
  lateLife: string;
  achievement: string;
}> = {
  '甲': {
    innerSelf: '內心有領導慾望，晚年仍保持進取心和正義感。',
    lateLife: '晚年健朗，有長者風範，受晚輩尊敬。',
    achievement: '事業有開創性成就，能留下可傳承的基業。',
  },
  '乙': {
    innerSelf: '內心柔和善良，晚年追求平靜和諧的生活。',
    lateLife: '晚年隨和，享受家庭天倫之樂。',
    achievement: '事業成就溫和持久，重視人際和諧。',
  },
  '丙': {
    innerSelf: '內心熱情開朗，晚年仍保持活力和樂觀。',
    lateLife: '晚年活躍，社交生活豐富，心態年輕。',
    achievement: '事業有光彩亮眼的成就，留下美好名聲。',
  },
  '丁': {
    innerSelf: '內心細膩溫暖，晚年重視精神生活和內在修養。',
    lateLife: '晚年恬淡，可能投入宗教或藝術修養。',
    achievement: '事業成就在精神層面，留下思想智慧。',
  },
  '戊': {
    innerSelf: '內心穩重踏實，晚年成為家族支柱。',
    lateLife: '晚年安穩，物質生活有保障，子孫孝順。',
    achievement: '事業成就厚實，留下實質性的財產或基業。',
  },
  '己': {
    innerSelf: '內心包容寬厚，晚年照顧家人、服務他人。',
    lateLife: '晚年平靜，可能涉及公益或助人工作。',
    achievement: '事業成就在積累和服務，低調但實在。',
  },
  '庚': {
    innerSelf: '內心剛毅果斷，晚年仍有決斷力和原則。',
    lateLife: '晚年剛健，可能仍活躍於專業領域。',
    achievement: '事業有突破性成就，開創新局面。',
  },
  '辛': {
    innerSelf: '內心精緻敏感，晚年追求品質生活。',
    lateLife: '晚年講究，享受精緻生活，注重健康。',
    achievement: '事業成就在精細領域，留下高品質作品。',
  },
  '壬': {
    innerSelf: '內心智慧通達，晚年思維清晰、見多識廣。',
    lateLife: '晚年豁達，可能旅遊或學習新事物。',
    achievement: '事業成就廣泛，影響力深遠。',
  },
  '癸': {
    innerSelf: '內心聰慧深沉，晚年有智者風範。',
    lateLife: '晚年內斂，重視靈性成長和智慧傳承。',
    achievement: '事業成就在智識領域，留下智慧遺產。',
  },
};

/**
 * 時柱地支特質（子女緣、晚年環境）
 */
const HOUR_ZHI_TRAITS: Record<DiZhi, {
  childrenTrait: string;
  lateEnvironment: string;
  legacy: string;
}> = {
  '子': {
    childrenTrait: '子女聰明機靈，有學習天賦，但可能較任性。',
    lateEnvironment: '晚年思維活躍，可能居住環境近水。',
    legacy: '留給子女的是智慧和變通能力。',
  },
  '丑': {
    childrenTrait: '子女踏實穩重，勤勞肯幹，孝順父母。',
    lateEnvironment: '晚年安穩，有固定居所和財產。',
    legacy: '留給子女實質的財產和勤勞精神。',
  },
  '寅': {
    childrenTrait: '子女有領導氣質，獨立自主，可能較早離家。',
    lateEnvironment: '晚年仍有活力，喜歡戶外活動。',
    legacy: '留給子女開創精神和進取心。',
  },
  '卯': {
    childrenTrait: '子女溫和有禮，有藝術天賦，人緣好。',
    lateEnvironment: '晚年和諧，居住環境優美。',
    legacy: '留給子女和善待人的品德。',
  },
  '辰': {
    childrenTrait: '子女有特殊才能，可能較晚成熟或有特異表現。',
    lateEnvironment: '晚年可能有重大變化或特殊經歷。',
    legacy: '留給子女獨特的家族傳承。',
  },
  '巳': {
    childrenTrait: '子女聰明伶俐，有專業技術，思維敏捷。',
    lateEnvironment: '晚年頭腦清晰，可能從事顧問工作。',
    legacy: '留給子女專業技能和智慧。',
  },
  '午': {
    childrenTrait: '子女活潑外向，有表現慾，社交能力強。',
    lateEnvironment: '晚年活躍，社交生活豐富。',
    legacy: '留給子女熱情開朗的性格。',
  },
  '未': {
    childrenTrait: '子女溫順聽話，重感情，可能較晚獨立。',
    lateEnvironment: '晚年有宗教或精神追求。',
    legacy: '留給子女善良和感恩的心。',
  },
  '申': {
    childrenTrait: '子女精明能幹，有商業頭腦，適應力強。',
    lateEnvironment: '晚年可能仍活躍於社交或商業。',
    legacy: '留給子女變通能力和人脈資源。',
  },
  '酉': {
    childrenTrait: '子女有藝術氣質，講究品味，可能較挑剔。',
    lateEnvironment: '晚年注重品質生活，可能涉及藝術。',
    legacy: '留給子女審美能力和品味。',
  },
  '戌': {
    childrenTrait: '子女忠厚老實，有責任感，值得信賴。',
    lateEnvironment: '晚年有伴侶或寵物陪伴，重視家庭。',
    legacy: '留給子女忠誠和守信的品格。',
  },
  '亥': {
    childrenTrait: '子女聰穎好學，有想像力，可能較理想化。',
    lateEnvironment: '晚年豁達，可能有宗教信仰或哲學追求。',
    legacy: '留給子女開闊的視野和智慧。',
  },
};

/**
 * 時柱十神意義（相對日主）
 */
const HOUR_TEN_GOD_MEANING: Record<ShiShen, {
  children: string;
  lateLife: string;
  career: string;
}> = {
  '比肩': {
    children: '子女獨立自主，可能與父母意見不同。',
    lateLife: '晚年有同輩相伴，可能需自己照顧自己。',
    career: '事業靠自己打拼，可能有競爭者。',
  },
  '劫財': {
    children: '子女個性強，可能有花費較大的傾向。',
    lateLife: '晚年財務需謹慎規劃，防止流失。',
    career: '事業有波折，但也有突破機會。',
  },
  '食神': {
    children: '子女福氣好，有才藝，孝順父母。',
    lateLife: '晚年享福，生活安逸，子女孝順。',
    career: '事業有創意成就，口福好。',
  },
  '傷官': {
    children: '子女才華出眾但個性強，親子關係需經營。',
    lateLife: '晚年有創造力，但也可能較孤獨。',
    career: '事業有突破性成就，但過程辛苦。',
  },
  '偏財': {
    children: '子女善於理財，可能在商業上有成就。',
    lateLife: '晚年財運活絡，有意外收入。',
    career: '事業有偏財運，投資可獲利。',
  },
  '正財': {
    children: '子女穩重踏實，經濟觀念好。',
    lateLife: '晚年經濟穩定，有固定收入來源。',
    career: '事業穩健發展，有固定成就。',
  },
  '七殺': {
    children: '子女有魄力，可能較早獨立或叛逆。',
    lateLife: '晚年仍有壓力，需注意健康。',
    career: '事業有突破，但競爭激烈。',
  },
  '正官': {
    children: '子女有教養，守規矩，可能從事公職。',
    lateLife: '晚年有地位，受人尊重。',
    career: '事業有正當成就，名聲好。',
  },
  '偏印': {
    children: '子女有特殊才能，可能較晚得子或子女較少。',
    lateLife: '晚年有精神追求，可能較孤獨。',
    career: '事業在專業領域有成就。',
  },
  '正印': {
    children: '子女孝順，有學問，親子關係融洽。',
    lateLife: '晚年有人照顧，子女孝順。',
    career: '事業有學術或教育相關成就。',
  },
};

/**
 * 分析時柱
 */
export function analyzeHourPillar(chart: BaZiChart, gender: Gender = '男'): HourPillarAnalysis {
  const hourGan = chart.hour.gan;
  const hourZhi = chart.hour.zhi;
  const ganZhi = hourGan + hourZhi;

  const ganElement = TIAN_GAN_ELEMENT[hourGan];
  const zhiElement = DI_ZHI_ELEMENT[hourZhi];
  const naYin = chart.hour.naYin || '';
  const tenGod = getTenGod(chart.day.gan, hourGan);

  const ganTraits = HOUR_GAN_TRAITS[hourGan];
  const zhiTraits = HOUR_ZHI_TRAITS[hourZhi];
  const tenGodMeaning = HOUR_TEN_GOD_MEANING[tenGod];

  // 組合分析
  const childrenFortune = tenGodMeaning.children;
  const childrenRelation = zhiTraits.childrenTrait;
  const childrenCount = analyzeChildrenCount(hourZhi, tenGod, gender);

  const lateLifeFortune = tenGodMeaning.lateLife;
  const retirementLife = ganTraits.lateLife;
  const healthOutlook = analyzeHealthOutlook(hourZhi, ganElement);

  const careerAchievement = ganTraits.achievement;
  const creativeAbility = tenGodMeaning.career;
  const legacyProspect = zhiTraits.legacy;

  // 生成總結
  const summary = generateHourSummary(hourGan, hourZhi, tenGod);
  const advice = generateHourAdvice(tenGod, ganElement, zhiElement);

  return {
    ganZhi,
    naYin,
    ganElement,
    zhiElement,
    tenGod,
    childrenFortune,
    childrenRelation,
    childrenCount,
    lateLifeFortune,
    retirementLife,
    healthOutlook,
    careerAchievement,
    creativeAbility,
    legacyProspect,
    summary,
    advice,
  };
}

/**
 * 分析子女數量傾向
 */
function analyzeChildrenCount(hourZhi: DiZhi, tenGod: ShiShen, gender: Gender): string {
  // 簡化的子女數量分析
  const multipleChildZhi = ['子', '卯', '午', '酉'];  // 四正位主子女多
  const singleChildZhi = ['辰', '戌', '丑', '未'];    // 四庫位主子女少

  let count = '子女數量適中';

  if (multipleChildZhi.includes(hourZhi)) {
    count = '子女緣佳，可能有多個子女';
  } else if (singleChildZhi.includes(hourZhi)) {
    count = '子女較少，但質量優良';
  }

  // 根據十神調整
  if (tenGod === '偏印') {
    count += '，但可能較晚得子';
  } else if (tenGod === '傷官' && gender === '女') {
    count += '，需注意生育健康';
  } else if (tenGod === '食神') {
    count += '，子女福氣好';
  }

  return count;
}

/**
 * 分析晚年健康展望
 */
function analyzeHealthOutlook(hourZhi: DiZhi, ganElement: WuXing): string {
  const zhiElement = DI_ZHI_ELEMENT[hourZhi];

  // 簡化的健康分析
  const healthAreas: Record<WuXing, string> = {
    '木': '注意肝膽、筋骨方面的保養',
    '火': '注意心血管、眼睛方面的保養',
    '土': '注意脾胃、消化系統的保養',
    '金': '注意呼吸系統、皮膚的保養',
    '水': '注意腎臟、泌尿系統的保養',
  };

  return `晚年${healthAreas[zhiElement]}，保持規律作息和適度運動有助健康。`;
}

/**
 * 生成時柱總結
 */
function generateHourSummary(gan: TianGan, zhi: DiZhi, tenGod: ShiShen): string {
  const summaryParts: string[] = [];

  // 基於十神的總結
  switch (tenGod) {
    case '食神':
    case '正印':
      summaryParts.push('晚年享福，子女孝順');
      break;
    case '傷官':
    case '偏印':
      summaryParts.push('晚年有才華展現，但需注意健康');
      break;
    case '正財':
    case '偏財':
      summaryParts.push('晚年經濟穩定，生活無憂');
      break;
    case '正官':
    case '七殺':
      summaryParts.push('晚年有地位，但壓力也大');
      break;
    case '比肩':
    case '劫財':
      summaryParts.push('晚年獨立自主，需自己規劃');
      break;
  }

  // 基於地支的補充
  if (['子', '午', '卯', '酉'].includes(zhi)) {
    summaryParts.push('子女緣佳');
  } else if (['寅', '申', '巳', '亥'].includes(zhi)) {
    summaryParts.push('晚年仍活躍');
  } else {
    summaryParts.push('晚年穩重');
  }

  return summaryParts.join('，') + '。';
}

/**
 * 生成時柱建議
 */
function generateHourAdvice(tenGod: ShiShen, ganElement: WuXing, zhiElement: WuXing): string[] {
  const advice: string[] = [];

  // 基於十神的建議
  switch (tenGod) {
    case '食神':
    case '正印':
      advice.push('善待子女，經營親子關係');
      advice.push('為晚年生活做好規劃');
      break;
    case '傷官':
    case '偏印':
      advice.push('發揮創造力，留下精神遺產');
      advice.push('注意情緒管理和健康');
      break;
    case '正財':
    case '偏財':
      advice.push('穩健理財，為晚年積累');
      advice.push('傳授子女理財觀念');
      break;
    case '正官':
    case '七殺':
      advice.push('適時放手，不要過度操勞');
      advice.push('建立良好家庭關係');
      break;
    case '比肩':
    case '劫財':
      advice.push('培養興趣愛好，充實晚年生活');
      advice.push('建立自己的社交圈');
      break;
  }

  // 通用建議
  advice.push('重視健康，定期體檢');
  advice.push('培養子女獨立能力');

  return advice;
}

/**
 * 獲取時柱簡要摘要
 */
export function getHourPillarSummary(chart: BaZiChart): string {
  const analysis = analyzeHourPillar(chart);
  return `時柱${analysis.ganZhi}（${analysis.naYin}），${analysis.summary}`;
}
