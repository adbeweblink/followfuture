/**
 * 胎元、命宮、身宮模組
 * 八字命理的三個重要輔助參考點
 */

import type { TianGan, DiZhi, WuXing, BaZiChart, BirthInput } from './types';

/** 胎元分析結果 */
export interface TaiYuanAnalysis {
  ganZhi: string;
  gan: TianGan;
  zhi: DiZhi;
  ganElement: WuXing;
  zhiElement: WuXing;
  meaning: string;
  description: string;
}

/** 命宮分析結果 */
export interface MingGongAnalysis {
  ganZhi: string;
  gan: TianGan;
  zhi: DiZhi;
  ganElement: WuXing;
  zhiElement: WuXing;
  meaning: string;
  personality: string;
  destiny: string;
}

/** 身宮分析結果 */
export interface ShenGongAnalysis {
  ganZhi: string;
  gan: TianGan;
  zhi: DiZhi;
  ganElement: WuXing;
  zhiElement: WuXing;
  meaning: string;
  focus: string;
  advice: string;
}

/** 三宮綜合分析 */
export interface ThreeGongsAnalysis {
  taiYuan: TaiYuanAnalysis;
  mingGong: MingGongAnalysis;
  shenGong: ShenGongAnalysis;
  summary: string;
}

// ========== 常數定義 ==========

const TIAN_GAN: TianGan[] = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
const DI_ZHI: DiZhi[] = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

const GAN_ELEMENT: Record<TianGan, WuXing> = {
  '甲': '木', '乙': '木',
  '丙': '火', '丁': '火',
  '戊': '土', '己': '土',
  '庚': '金', '辛': '金',
  '壬': '水', '癸': '水',
};

const ZHI_ELEMENT: Record<DiZhi, WuXing> = {
  '寅': '木', '卯': '木',
  '巳': '火', '午': '火',
  '辰': '土', '丑': '土', '未': '土', '戌': '土',
  '申': '金', '酉': '金',
  '亥': '水', '子': '水',
};

/** 地支對應數字（用於命宮計算） */
const ZHI_NUMBER: Record<DiZhi, number> = {
  '子': 1, '丑': 2, '寅': 3, '卯': 4, '辰': 5, '巳': 6,
  '午': 7, '未': 8, '申': 9, '酉': 10, '戌': 11, '亥': 12,
};

/** 數字對應地支 */
const NUMBER_TO_ZHI: Record<number, DiZhi> = {
  1: '子', 2: '丑', 3: '寅', 4: '卯', 5: '辰', 6: '巳',
  7: '午', 8: '未', 9: '申', 10: '酉', 11: '戌', 12: '亥',
  0: '亥', // 12 mod 12 = 0，對應亥
};

// ========== 胎元計算 ==========

/**
 * 計算胎元
 * 胎元 = 月柱天干進一位 + 月柱地支進三位
 * 代表受胎時的干支，反映先天稟賦
 */
export function calculateTaiYuan(monthGan: TianGan, monthZhi: DiZhi): { gan: TianGan; zhi: DiZhi } {
  // 天干進一位
  const ganIndex = TIAN_GAN.indexOf(monthGan);
  const newGanIndex = (ganIndex + 1) % 10;
  const gan = TIAN_GAN[newGanIndex];

  // 地支進三位
  const zhiIndex = DI_ZHI.indexOf(monthZhi);
  const newZhiIndex = (zhiIndex + 3) % 12;
  const zhi = DI_ZHI[newZhiIndex];

  return { gan, zhi };
}

/**
 * 分析胎元
 */
export function analyzeTaiYuan(chart: BaZiChart): TaiYuanAnalysis {
  const { gan, zhi } = calculateTaiYuan(chart.month.gan, chart.month.zhi);
  const ganZhi = `${gan}${zhi}`;
  const ganElement = GAN_ELEMENT[gan];
  const zhiElement = ZHI_ELEMENT[zhi];

  // 胎元與日主的關係
  const dayElement = chart.day.ganElement;
  const relation = getElementRelation(ganElement, dayElement);

  let meaning = '';
  let description = '';

  // 根據胎元五行與日主關係分析
  if (relation === '生') {
    meaning = '胎元生日主，先天得助';
    description = '胎元五行生助日主，代表先天稟賦良好，父母在受孕時身體健康，胎教良好。命主天生有福氣加持。';
  } else if (relation === '同') {
    meaning = '胎元助日主，先天強健';
    description = '胎元五行與日主相同，先天元氣充足，身體底子好，遺傳基因優良。';
  } else if (relation === '洩') {
    meaning = '胎元洩日主，先天耗損';
    description = '胎元五行洩耗日主，可能母親懷孕時較為辛苦，或先天稍有不足。但後天努力可以彌補。';
  } else if (relation === '剋') {
    meaning = '胎元剋日主，先天有礙';
    description = '胎元五行剋制日主，先天條件有些不順，可能懷孕過程有波折。需後天多加調養。';
  } else {
    meaning = '胎元耗日主，先天平穩';
    description = '胎元五行與日主無直接生剋，先天條件中等，平穩無大礙。';
  }

  // 加入胎元地支藏干分析
  description += `胎元${ganZhi}，${gan}${ganElement}為天干，${zhi}${zhiElement}為地支。`;

  return {
    ganZhi,
    gan,
    zhi,
    ganElement,
    zhiElement,
    meaning,
    description,
  };
}

// ========== 命宮計算 ==========

/**
 * 計算命宮地支
 * 命宮 = 14 - 月支數 - 時支數（若結果≤0則+12）
 * 命宮代表命主的先天性格和命運走向
 */
export function calculateMingGongZhi(monthZhi: DiZhi, hourZhi: DiZhi): DiZhi {
  const monthNum = ZHI_NUMBER[monthZhi];
  const hourNum = ZHI_NUMBER[hourZhi];

  let result = 14 - monthNum - hourNum;
  while (result <= 0) {
    result += 12;
  }
  while (result > 12) {
    result -= 12;
  }

  return NUMBER_TO_ZHI[result] || NUMBER_TO_ZHI[12];
}

/**
 * 根據命宮地支和年干推算命宮天干
 * 使用五虎遁月法
 */
export function calculateMingGongGan(yearGan: TianGan, mingGongZhi: DiZhi): TianGan {
  // 五虎遁：根據年干找寅月起始天干
  const yinGanMap: Record<TianGan, TianGan> = {
    '甲': '丙', '己': '丙',  // 甲己年，寅月起丙
    '乙': '戊', '庚': '戊',  // 乙庚年，寅月起戊
    '丙': '庚', '辛': '庚',  // 丙辛年，寅月起庚
    '丁': '壬', '壬': '壬',  // 丁壬年，寅月起壬
    '戊': '甲', '癸': '甲',  // 戊癸年，寅月起甲
  };

  const yinGan = yinGanMap[yearGan];
  const yinGanIndex = TIAN_GAN.indexOf(yinGan);

  // 計算命宮地支距離寅的位置
  const zhiIndex = DI_ZHI.indexOf(mingGongZhi);
  const yinIndex = DI_ZHI.indexOf('寅');
  let offset = zhiIndex - yinIndex;
  if (offset < 0) offset += 12;

  // 天干進位
  const ganIndex = (yinGanIndex + offset) % 10;
  return TIAN_GAN[ganIndex];
}

/**
 * 分析命宮
 */
export function analyzeMingGong(chart: BaZiChart): MingGongAnalysis {
  const zhi = calculateMingGongZhi(chart.month.zhi, chart.hour.zhi);
  const gan = calculateMingGongGan(chart.year.gan, zhi);
  const ganZhi = `${gan}${zhi}`;
  const ganElement = GAN_ELEMENT[gan];
  const zhiElement = ZHI_ELEMENT[zhi];

  // 命宮地支的性格特質
  const zhiPersonality = getMingGongPersonality(zhi);
  const zhiDestiny = getMingGongDestiny(zhi, chart.day.ganElement);

  return {
    ganZhi,
    gan,
    zhi,
    ganElement,
    zhiElement,
    meaning: `命宮${ganZhi}，${zhi}宮人`,
    personality: zhiPersonality,
    destiny: zhiDestiny,
  };
}

/**
 * 命宮地支對應的性格特質
 */
function getMingGongPersonality(zhi: DiZhi): string {
  const personalities: Record<DiZhi, string> = {
    '子': '聰明機智，善於應變，但性格較為敏感多疑。適應力強，有創意思維。',
    '丑': '穩重踏實，做事認真負責，但較為固執保守。有耐心，善於積累。',
    '寅': '積極進取，有領導才能，但性格急躁。勇於開創，不畏困難。',
    '卯': '溫和優雅，善於交際，但有時優柔寡斷。有藝術天分，人緣好。',
    '辰': '志向遠大，有理想抱負，但常感孤獨。思想深邃，有神秘感。',
    '巳': '精明幹練，觀察敏銳，但心機較重。善於謀劃，有洞察力。',
    '午': '熱情開朗，充滿活力，但性格衝動。有領袖魅力，敢作敢當。',
    '未': '溫和善良，有包容心，但有時過於軟弱。善解人意，樂於助人。',
    '申': '靈活變通，才思敏捷，但較為浮躁。善於社交，機會多。',
    '酉': '精緻講究，品味獨特，但較為挑剔。有審美能力，注重細節。',
    '戌': '忠誠可靠，正義感強，但過於執著。有責任心，重感情。',
    '亥': '智慧深沉，有遠見卓識，但較為內斂。善於思考，直覺敏銳。',
  };
  return personalities[zhi];
}

/**
 * 命宮與日主五行的關係分析
 */
function getMingGongDestiny(zhi: DiZhi, dayElement: WuXing): string {
  const zhiElement = ZHI_ELEMENT[zhi];
  const relation = getElementRelation(zhiElement, dayElement);

  const destinyBase: Record<DiZhi, string> = {
    '子': '早年奔波，中年漸穩，晚年安樂。一生多貴人相助。',
    '丑': '少年辛苦，中年發達，晚年富足。適合穩紮穩打。',
    '寅': '早年有成，中年波折，晚年順遂。事業心強，宜自主創業。',
    '卯': '一生平順，少有大起大落。適合文藝或服務行業。',
    '辰': '少年得志，中年有變，晚年榮華。適合遠離家鄉發展。',
    '巳': '早年多變，中年穩定，晚年享福。宜從事腦力工作。',
    '午': '一生起伏較大，但能逢凶化吉。適合公開場合發揮。',
    '未': '早年平淡，中年漸起，晚年富貴。適合服務或飲食行業。',
    '申': '一生機會多，但變動也多。適合流動性強的工作。',
    '酉': '少年得意，中年有阻，晚年安康。適合精緻或金融行業。',
    '戌': '早年辛苦，中年有成，晚年榮耀。適合公職或法律行業。',
    '亥': '一生多智多謀，適合學術或藝術領域。晚年有福。',
  };

  let destiny = destinyBase[zhi];

  if (relation === '生') {
    destiny += '命宮生助日主，先天運勢加分。';
  } else if (relation === '剋') {
    destiny += '命宮剋制日主，需後天努力克服。';
  }

  return destiny;
}

// ========== 身宮計算 ==========

/**
 * 計算身宮地支
 * 身宮 = 月支數 + 時支數 - 2（若結果>12則-12）
 * 身宮代表後天的努力方向和人生重心
 */
export function calculateShenGongZhi(monthZhi: DiZhi, hourZhi: DiZhi): DiZhi {
  const monthNum = ZHI_NUMBER[monthZhi];
  const hourNum = ZHI_NUMBER[hourZhi];

  let result = monthNum + hourNum - 2;
  while (result <= 0) {
    result += 12;
  }
  while (result > 12) {
    result -= 12;
  }

  return NUMBER_TO_ZHI[result] || NUMBER_TO_ZHI[12];
}

/**
 * 分析身宮
 */
export function analyzeShenGong(chart: BaZiChart): ShenGongAnalysis {
  const zhi = calculateShenGongZhi(chart.month.zhi, chart.hour.zhi);
  const gan = calculateMingGongGan(chart.year.gan, zhi); // 同樣使用五虎遁
  const ganZhi = `${gan}${zhi}`;
  const ganElement = GAN_ELEMENT[gan];
  const zhiElement = ZHI_ELEMENT[zhi];

  // 身宮地支對應的人生重心
  const focus = getShenGongFocus(zhi);
  const advice = getShenGongAdvice(zhi, chart.day.ganElement);

  return {
    ganZhi,
    gan,
    zhi,
    ganElement,
    zhiElement,
    meaning: `身宮${ganZhi}，後天重心在${getShenGongArea(zhi)}`,
    focus,
    advice,
  };
}

/**
 * 身宮地支對應的人生領域
 */
function getShenGongArea(zhi: DiZhi): string {
  const areas: Record<DiZhi, string> = {
    '子': '智慧學問',
    '丑': '財富積累',
    '寅': '事業開創',
    '卯': '人際關係',
    '辰': '精神追求',
    '巳': '技術專業',
    '午': '名聲地位',
    '未': '家庭情感',
    '申': '交際變通',
    '酉': '藝術審美',
    '戌': '信念堅守',
    '亥': '內在修養',
  };
  return areas[zhi];
}

/**
 * 身宮地支對應的人生重心
 */
function getShenGongFocus(zhi: DiZhi): string {
  const focuses: Record<DiZhi, string> = {
    '子': '後天應注重知識的積累和智慧的開發。適合從事研究、教育、顧問等工作。一生中學習是重要的主題。',
    '丑': '後天應注重財富的積累和資產的管理。適合從事金融、房產、農業等行業。穩健理財是人生重點。',
    '寅': '後天應注重事業的開創和領導能力的培養。適合自主創業或擔任管理職位。事業心強是主要特質。',
    '卯': '後天應注重人際關係的經營和溝通能力的提升。適合從事公關、銷售、服務等工作。人脈是重要資源。',
    '辰': '後天應注重精神層面的追求和理想的實現。適合從事宗教、哲學、藝術等領域。內心富足是人生目標。',
    '巳': '後天應注重專業技術的精進和分析能力的培養。適合從事技術、法律、醫療等專業工作。',
    '午': '後天應注重社會地位的建立和個人影響力的擴大。適合從事政治、演藝、媒體等公開領域。',
    '未': '後天應注重家庭情感的經營和人際和諧。適合從事餐飲、服務、社工等關懷型工作。',
    '申': '後天應注重靈活變通和多元發展。適合從事貿易、交通、通訊等流動性強的行業。',
    '酉': '後天應注重藝術審美和精緻品味的培養。適合從事設計、珠寶、美容等精緻行業。',
    '戌': '後天應注重信念的堅守和責任的承擔。適合從事軍警、法律、公職等正義型工作。',
    '亥': '後天應注重內在修養和智慧的沉澱。適合從事研究、寫作、心靈輔導等內斂型工作。',
  };
  return focuses[zhi];
}

/**
 * 身宮建議
 */
function getShenGongAdvice(zhi: DiZhi, dayElement: WuXing): string {
  const zhiElement = ZHI_ELEMENT[zhi];
  const relation = getElementRelation(zhiElement, dayElement);

  let advice = '';

  if (relation === '生') {
    advice = '身宮五行生助日主，後天發展順利，努力容易得到回報。應把握這個優勢，積極拓展。';
  } else if (relation === '同') {
    advice = '身宮五行與日主相同，後天有充足的能量支持。但要注意不要過於自我，需要配合他人。';
  } else if (relation === '洩') {
    advice = '身宮五行洩耗日主，後天付出較多但收穫需要時間。建議選擇能夠累積的領域深耕。';
  } else if (relation === '剋') {
    advice = '身宮五行剋制日主，後天挑戰較多。但克服困難後會有更大的成長。建議培養韌性。';
  } else {
    advice = '身宮五行與日主關係中和，後天發展平穩。建議根據自身興趣選擇發展方向。';
  }

  return advice;
}

// ========== 綜合分析 ==========

/**
 * 三宮綜合分析
 */
export function analyzeThreeGongs(chart: BaZiChart): ThreeGongsAnalysis {
  const taiYuan = analyzeTaiYuan(chart);
  const mingGong = analyzeMingGong(chart);
  const shenGong = analyzeShenGong(chart);

  // 生成綜合說明
  const summary = generateThreeGongsSummary(taiYuan, mingGong, shenGong, chart.day.ganElement);

  return {
    taiYuan,
    mingGong,
    shenGong,
    summary,
  };
}

/**
 * 生成三宮綜合說明
 */
function generateThreeGongsSummary(
  taiYuan: TaiYuanAnalysis,
  mingGong: MingGongAnalysis,
  shenGong: ShenGongAnalysis,
  dayElement: WuXing
): string {
  const parts: string[] = [];

  parts.push(`【胎元${taiYuan.ganZhi}】${taiYuan.meaning}。`);
  parts.push(`【命宮${mingGong.ganZhi}】${mingGong.meaning}。`);
  parts.push(`【身宮${shenGong.ganZhi}】${shenGong.meaning}。`);

  // 三宮五行統計
  const elements = [taiYuan.ganElement, taiYuan.zhiElement, mingGong.ganElement, mingGong.zhiElement, shenGong.ganElement, shenGong.zhiElement];
  const elementCount: Record<WuXing, number> = { '木': 0, '火': 0, '土': 0, '金': 0, '水': 0 };
  elements.forEach(el => elementCount[el]++);

  // 找出最旺的五行
  const maxEl = Object.entries(elementCount).sort((a, b) => b[1] - a[1])[0];
  if (maxEl[1] >= 3) {
    parts.push(`三宮中${maxEl[0]}行偏旺（${maxEl[1]}個），命主先後天${maxEl[0]}的特質明顯。`);
  }

  // 與日主的關係
  const helpCount = elements.filter(el => el === dayElement || getElementRelation(el, dayElement) === '生').length;
  if (helpCount >= 4) {
    parts.push('三宮多助日主，先後天條件皆優，人生發展順遂。');
  } else if (helpCount <= 2) {
    parts.push('三宮助力有限，需要後天更多努力。但逆境出英雄，磨練中成長。');
  }

  return parts.join('');
}

// ========== 輔助函數 ==========

function getElementRelation(el1: WuXing, el2: WuXing): '生' | '同' | '洩' | '剋' | '耗' {
  if (el1 === el2) return '同';

  const generateMap: Record<WuXing, WuXing> = {
    '木': '火', '火': '土', '土': '金', '金': '水', '水': '木'
  };
  const controlMap: Record<WuXing, WuXing> = {
    '木': '土', '火': '金', '土': '水', '金': '木', '水': '火'
  };

  if (generateMap[el1] === el2) return '洩'; // el1 生 el2，對 el1 是洩
  if (generateMap[el2] === el1) return '生'; // el2 生 el1，對 el1 是得生
  if (controlMap[el1] === el2) return '耗'; // el1 剋 el2，對 el1 是耗
  if (controlMap[el2] === el1) return '剋'; // el2 剋 el1，對 el1 是被剋

  return '耗'; // 預設
}
