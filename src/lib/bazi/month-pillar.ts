/**
 * 月柱單論模組
 * 分析月柱的意義、社會形象、父母緣、事業運等
 */

import type { TianGan, DiZhi, WuXing, Pillar, BaZiChart } from './types';

/** 月柱分析結果 */
export interface MonthPillarAnalysis {
  gan: TianGan;
  zhi: DiZhi;
  ganElement: WuXing;
  zhiElement: WuXing;
  season: string;              // 季節
  monthName: string;           // 月令名稱
  socialImage: string;         // 社會形象
  externalStyle: string;       // 外在表現風格
  parentRelation: {
    father: string;            // 與父親的關係
    mother: string;            // 與母親的關係
    overview: string;          // 父母緣概述
  };
  careerTiming: string;        // 事業發展時機（17-32歲）
  youthFortune: string;        // 青年運勢
  monthEnergy: {
    description: string;       // 月令能量描述
    strength: '旺' | '相' | '休' | '囚' | '死';  // 月令狀態
  };
  advice: string[];            // 建議
}

/** 地支對應月份 */
const ZHI_MONTH: Record<DiZhi, { month: number; season: string; name: string }> = {
  '寅': { month: 1, season: '初春', name: '孟春・立春月' },
  '卯': { month: 2, season: '仲春', name: '仲春・驚蟄月' },
  '辰': { month: 3, season: '季春', name: '季春・清明月' },
  '巳': { month: 4, season: '初夏', name: '孟夏・立夏月' },
  '午': { month: 5, season: '仲夏', name: '仲夏・芒種月' },
  '未': { month: 6, season: '季夏', name: '季夏・小暑月' },
  '申': { month: 7, season: '初秋', name: '孟秋・立秋月' },
  '酉': { month: 8, season: '仲秋', name: '仲秋・白露月' },
  '戌': { month: 9, season: '季秋', name: '季秋・寒露月' },
  '亥': { month: 10, season: '初冬', name: '孟冬・立冬月' },
  '子': { month: 11, season: '仲冬', name: '仲冬・大雪月' },
  '丑': { month: 12, season: '季冬', name: '季冬・小寒月' },
};

/** 天干五行 */
const GAN_ELEMENT: Record<TianGan, WuXing> = {
  '甲': '木', '乙': '木',
  '丙': '火', '丁': '火',
  '戊': '土', '己': '土',
  '庚': '金', '辛': '金',
  '壬': '水', '癸': '水',
};

/** 地支五行 */
const ZHI_ELEMENT: Record<DiZhi, WuXing> = {
  '寅': '木', '卯': '木',
  '巳': '火', '午': '火',
  '辰': '土', '丑': '土', '未': '土', '戌': '土',
  '申': '金', '酉': '金',
  '亥': '水', '子': '水',
};

/** 月柱天干的社會形象 */
const MONTH_GAN_IMAGE: Record<TianGan, { image: string; style: string }> = {
  '甲': {
    image: '給人正直可靠、有主見的印象。在社會上展現出領導氣質，容易被賦予責任。',
    style: '外在表現直接坦蕩，不喜歡拐彎抹角。工作中展現專業和擔當，是團隊中的定心丸。',
  },
  '乙': {
    image: '給人溫和優雅、善於協調的印象。在社會上展現柔軟身段，擅長人際周旋。',
    style: '外在表現隨和謙遜，懂得配合他人。工作中善於溝通協調，是團隊的潤滑劑。',
  },
  '丙': {
    image: '給人熱情開朗、充滿活力的印象。在社會上展現陽光特質，容易成為焦點。',
    style: '外在表現大方外向，喜歡與人互動。工作中積極主動，能帶動團隊氣氛。',
  },
  '丁': {
    image: '給人溫文儒雅、內斂有深度的印象。在社會上展現文雅氣質，令人感覺有涵養。',
    style: '外在表現含蓄細膩，注重細節。工作中心思縝密，善於分析和規劃。',
  },
  '戊': {
    image: '給人穩重可靠、值得信賴的印象。在社會上展現踏實特質，是可以託付的對象。',
    style: '外在表現沉穩持重，不輕易動搖。工作中一步一腳印，穩紮穩打。',
  },
  '己': {
    image: '給人親切隨和、平易近人的印象。在社會上展現包容特質，容易親近。',
    style: '外在表現溫和謙虛，不張揚。工作中細心周到，善於服務和支持。',
  },
  '庚': {
    image: '給人果決幹練、雷厲風行的印象。在社會上展現俐落風格，辦事效率高。',
    style: '外在表現直接俐落，說到做到。工作中講求效率，敢於決斷。',
  },
  '辛': {
    image: '給人精緻講究、品味獨特的印象。在社會上展現優雅氣質，注重形象。',
    style: '外在表現精緻細膩，追求完美。工作中注重品質，標準較高。',
  },
  '壬': {
    image: '給人聰明靈活、見多識廣的印象。在社會上展現機智特質，反應敏捷。',
    style: '外在表現圓融變通，適應力強。工作中善於變通，能處理多樣情況。',
  },
  '癸': {
    image: '給人深沉內斂、神秘有深度的印象。在社會上展現沉靜氣質，讓人想探索。',
    style: '外在表現安靜內斂，不愛張揚。工作中善於觀察思考，有獨特見解。',
  },
};

/** 月柱地支對父母緣的影響 */
const MONTH_ZHI_PARENT: Record<DiZhi, { father: string; mother: string; overview: string }> = {
  '寅': {
    father: '父親可能有領導氣質，對你有高期望。青年時期可能因理念不同而有摩擦。',
    mother: '母親可能較為獨立能幹，對家庭有主導作用。',
    overview: '父母緣中等，與父母的關係需要雙向溝通和理解。',
  },
  '卯': {
    father: '與父親的緣分較淡，可能聚少離多或意見不合。',
    mother: '與母親關係較親近，能得到母親的關愛和支持。',
    overview: '母緣勝父緣，青年時期多得母親助力。',
  },
  '辰': {
    father: '父親可能較為傳統保守，對你有嚴格要求。',
    mother: '母親可能較為包容，是家庭的穩定力量。',
    overview: '父母緣穩定，家庭環境較為傳統。',
  },
  '巳': {
    father: '父親可能較為忙碌，相處時間較少。',
    mother: '母親可能性格活潑，家庭氣氛較為活絡。',
    overview: '父母關係需要更多互動經營，不要疏於聯繫。',
  },
  '午': {
    father: '父親可能性格急躁，但內心關愛你。',
    mother: '母親可能較為熱情，對你的照顧無微不至。',
    overview: '父母緣較深，但可能有代溝需要跨越。',
  },
  '未': {
    father: '父親可能較為溫和，但不善表達感情。',
    mother: '母親可能較為慈愛，是家庭的精神支柱。',
    overview: '父母緣良好，能得到家庭的溫暖支持。',
  },
  '申': {
    father: '父親可能較為精明能幹，對你有實際幫助。',
    mother: '母親可能較為理性，教育方式較為嚴謹。',
    overview: '父母緣中等偏好，能從父母處學到實用技能。',
  },
  '酉': {
    father: '與父親的互動較少，可能各自忙碌。',
    mother: '與母親關係可能有起伏，需要溝通。',
    overview: '父母緣較平淡，成年後關係可能改善。',
  },
  '戌': {
    father: '父親可能較為嚴肅，但實際上很關心你。',
    mother: '母親可能較為操勞，為家庭付出很多。',
    overview: '父母緣穩定但傳統，要學會表達感謝。',
  },
  '亥': {
    father: '父親可能較為開明，支持你的想法。',
    mother: '母親可能較為智慧，對你有正面引導。',
    overview: '父母緣良好，能得到父母的智慧引導。',
  },
  '子': {
    father: '父親可能較為忙碌或外出工作多。',
    mother: '母親可能是主要照顧者，對你影響較大。',
    overview: '母緣較深，青年時期多依靠母親支持。',
  },
  '丑': {
    father: '父親可能較為務實，重視實際成就。',
    mother: '母親可能較為勤儉，為家庭默默付出。',
    overview: '父母緣平穩，家風較為傳統務實。',
  },
};

/** 月令季節的事業發展特點 */
const SEASON_CAREER: Record<string, { timing: string; youth: string }> = {
  '初春': {
    timing: '事業如春筍般破土而出，17-32歲是播種期。宜積極開創，勇於嘗試新事物。',
    youth: '青年時期充滿希望和可能性，要把握機會學習成長，為日後發展奠定基礎。',
  },
  '仲春': {
    timing: '事業在青年時期穩步成長，17-32歲宜培養專業技能，建立人脈網絡。',
    youth: '青年運勢較順，但不宜急躁冒進。穩紮穩打，累積實力最重要。',
  },
  '季春': {
    timing: '事業發展需要轉型調整，17-32歲可能經歷變動，但變動中有機會。',
    youth: '青年時期可能不太穩定，但這是磨練和學習的好時機。',
  },
  '初夏': {
    timing: '事業開始升溫，17-32歲是發光發熱的時期。宜積極表現，爭取機會。',
    youth: '青年運勢漸入佳境，適合向外拓展，不要害怕展現自己。',
  },
  '仲夏': {
    timing: '事業處於高峰期，17-32歲能量充沛。但也要注意不要過於張揚。',
    youth: '青年時期風生水起，但要學會收斂，避免樹大招風。',
  },
  '季夏': {
    timing: '事業發展需要沉澱，17-32歲宜厚積薄發，不宜急功近利。',
    youth: '青年運勢平穩中帶有挑戰，保持耐心，機會會來。',
  },
  '初秋': {
    timing: '事業開始收穫，17-32歲是收穫學習成果的時期。宜整合資源，謹慎前行。',
    youth: '青年時期能初見成效，但要注意保持謙虛，不斷進步。',
  },
  '仲秋': {
    timing: '事業趨於成熟，17-32歲宜精益求精，在專業領域深耕。',
    youth: '青年運勢較為穩定，適合深度發展而非廣泛嘗試。',
  },
  '季秋': {
    timing: '事業面臨轉折，17-32歲可能需要做出重要抉擇。',
    youth: '青年時期可能經歷波折，但這是成長的契機，要勇於面對。',
  },
  '初冬': {
    timing: '事業需要蓄勢待發，17-32歲是儲備能量的時期。宜充實自己，等待時機。',
    youth: '青年運勢內斂，但內在成長很多。不要急於求成，厚積薄發。',
  },
  '仲冬': {
    timing: '事業處於蟄伏期，17-32歲宜潛心學習，累積實力。',
    youth: '青年時期可能較為沉寂，但這正是沉澱的好時機。大器晚成型。',
  },
  '季冬': {
    timing: '事業即將迎來轉機，17-32歲是承先啟後的時期。宜為未來做準備。',
    youth: '青年運勢在谷底但即將回升，保持信心，曙光就在前方。',
  },
};

/**
 * 分析月柱
 * @param chart 八字盤
 * @returns 月柱分析結果
 */
export function analyzeMonthPillar(chart: BaZiChart): MonthPillarAnalysis {
  const monthPillar = chart.month;
  const gan = monthPillar.gan;
  const zhi = monthPillar.zhi;

  const zhiInfo = ZHI_MONTH[zhi];
  const ganImageData = MONTH_GAN_IMAGE[gan];
  const parentData = MONTH_ZHI_PARENT[zhi];
  const careerData = SEASON_CAREER[zhiInfo.season];

  // 計算月令強度
  const monthStrength = getMonthStrength(chart.day.ganElement, zhi);

  // 生成建議
  const advice = generateMonthAdvice(gan, zhi, zhiInfo.season);

  return {
    gan,
    zhi,
    ganElement: GAN_ELEMENT[gan],
    zhiElement: ZHI_ELEMENT[zhi],
    season: zhiInfo.season,
    monthName: zhiInfo.name,
    socialImage: ganImageData.image,
    externalStyle: ganImageData.style,
    parentRelation: parentData,
    careerTiming: careerData.timing,
    youthFortune: careerData.youth,
    monthEnergy: {
      description: getMonthEnergyDescription(zhi, monthStrength),
      strength: monthStrength,
    },
    advice,
  };
}

/**
 * 取得月令強度
 */
function getMonthStrength(dayElement: WuXing, monthZhi: DiZhi): '旺' | '相' | '休' | '囚' | '死' {
  const monthElement = ZHI_ELEMENT[monthZhi];

  // 五行生剋關係
  const generateMap: Record<WuXing, WuXing> = {
    '木': '火', '火': '土', '土': '金', '金': '水', '水': '木'
  };
  const controlMap: Record<WuXing, WuXing> = {
    '木': '土', '火': '金', '土': '水', '金': '木', '水': '火'
  };
  const weakenMap: Record<WuXing, WuXing> = {
    '木': '金', '火': '水', '土': '木', '金': '火', '水': '土'
  };
  const drainMap: Record<WuXing, WuXing> = {
    '木': '水', '火': '木', '土': '火', '金': '土', '水': '金'
  };

  if (dayElement === monthElement) return '旺';
  if (generateMap[dayElement] === monthElement) return '相';
  if (drainMap[dayElement] === monthElement) return '休';
  if (controlMap[dayElement] === monthElement) return '囚';
  if (weakenMap[dayElement] === monthElement) return '死';

  return '休'; // 預設
}

/**
 * 取得月令能量描述
 */
function getMonthEnergyDescription(zhi: DiZhi, strength: string): string {
  const zhiInfo = ZHI_MONTH[zhi];
  const baseDesc = `出生於${zhiInfo.name}，${zhiInfo.season}之氣`;

  const strengthDesc: Record<string, string> = {
    '旺': '日主得令，元氣充沛，先天稟賦良好。',
    '相': '日主得助，氣勢漸長，發展潛力大。',
    '休': '日主休養，需要後天努力補足。',
    '囚': '日主受制，需要克服先天不足。',
    '死': '日主失令，需要特別注意調養。',
  };

  return `${baseDesc}。${strengthDesc[strength]}`;
}

/**
 * 生成月柱相關建議
 */
function generateMonthAdvice(gan: TianGan, zhi: DiZhi, season: string): string[] {
  const advice: string[] = [];
  const zhiElement = ZHI_ELEMENT[zhi];

  // 根據季節給建議
  if (season.includes('春')) {
    advice.push('春生之人，宜把握機會積極發展，但不宜急躁冒進');
    advice.push('人際關係上多主動出擊，建立有價值的連結');
  } else if (season.includes('夏')) {
    advice.push('夏生之人，能量充沛但要注意收斂，避免過度張揚');
    advice.push('事業上可積極表現，但要注意人際關係的維護');
  } else if (season.includes('秋')) {
    advice.push('秋生之人，宜收穫沉澱，整合現有資源');
    advice.push('做事講究策略和效率，不宜過於感情用事');
  } else if (season.includes('冬')) {
    advice.push('冬生之人，宜潛心修養，為未來蓄力');
    advice.push('保持耐心，厚積薄發，大器晚成');
  }

  // 根據五行給建議
  const elementAdvice: Record<WuXing, string> = {
    '木': '培養創新思維，勇於開拓新領域',
    '火': '發揮個人魅力，但要學習控制情緒',
    '土': '腳踏實地，穩健發展是最佳策略',
    '金': '發揮專業能力，但要注意人際關係的柔軟度',
    '水': '發揮智慧和變通能力，但要避免過於飄忽',
  };
  advice.push(elementAdvice[zhiElement]);

  return advice;
}

/**
 * 取得月柱簡述
 */
export function getMonthPillarSummary(chart: BaZiChart): string {
  const analysis = analyzeMonthPillar(chart);
  return `${analysis.gan}${analysis.zhi}月（${analysis.monthName}）：${analysis.socialImage.split('。')[0]}。`;
}

/**
 * 分析日月柱綜合關係
 * @param chart 八字盤
 * @returns 日月柱關係分析
 */
export function analyzeDayMonthRelation(chart: BaZiChart): {
  relationship: string;
  interaction: string;
  advice: string;
} {
  const dayGan = chart.day.gan;
  const monthGan = chart.month.gan;
  const dayZhi = chart.day.zhi;
  const monthZhi = chart.month.zhi;

  const dayGanElement = GAN_ELEMENT[dayGan];
  const monthGanElement = GAN_ELEMENT[monthGan];

  // 判斷天干關係
  let ganRelation = '';
  const ganHeMap: Record<string, string> = {
    '甲己': '中正之合', '己甲': '中正之合',
    '乙庚': '仁義之合', '庚乙': '仁義之合',
    '丙辛': '威制之合', '辛丙': '威制之合',
    '丁壬': '淫佚之合', '壬丁': '淫佚之合',
    '戊癸': '無情之合', '癸戊': '無情之合',
  };

  const ganKey = `${dayGan}${monthGan}`;
  if (ganHeMap[ganKey]) {
    ganRelation = `天干相合（${ganHeMap[ganKey]}），內外一致，表裡如一`;
  } else if (dayGanElement === monthGanElement) {
    ganRelation = '天干同五行，內心想法與外在表現一致';
  } else {
    // 判斷生剋
    const generateMap: Record<WuXing, WuXing> = {
      '木': '火', '火': '土', '土': '金', '金': '水', '水': '木'
    };
    if (generateMap[dayGanElement] === monthGanElement) {
      ganRelation = '日主生月柱，願意付出和表現，社交消耗較大';
    } else if (generateMap[monthGanElement] === dayGanElement) {
      ganRelation = '月柱生日主，外在環境支持內心發展，有貴人運';
    } else {
      ganRelation = '日月天干有張力，內心想法與外在表現可能有差異';
    }
  }

  // 判斷地支關係
  let zhiRelation = '';
  const zhiHe = ['子丑', '丑子', '寅亥', '亥寅', '卯戌', '戌卯', '辰酉', '酉辰', '巳申', '申巳', '午未', '未午'];
  const zhiChong = ['子午', '午子', '丑未', '未丑', '寅申', '申寅', '卯酉', '酉卯', '辰戌', '戌辰', '巳亥', '亥巳'];

  const zhiKey = `${dayZhi}${monthZhi}`;
  if (zhiHe.includes(zhiKey)) {
    zhiRelation = '地支六合，與父母關係和諧，青年時期得助力';
  } else if (zhiChong.includes(zhiKey)) {
    zhiRelation = '地支相沖，與父母或青年環境有衝突，但也代表變動和機會';
  } else {
    zhiRelation = '地支平和，青年時期穩定發展';
  }

  // 綜合建議
  let advice = '';
  if (ganRelation.includes('相合') && zhiRelation.includes('六合')) {
    advice = '日月柱和諧，內外一致，青年時期發展順遂。善用這個優勢，積極發展。';
  } else if (ganRelation.includes('相沖') || zhiRelation.includes('相沖')) {
    advice = '日月柱有衝突，內心與外在表現可能有落差。學會整合內外，化衝突為動力。';
  } else {
    advice = '日月柱關係中和，發展穩定。可以根據自身優勢，選擇適合的發展方向。';
  }

  return {
    relationship: ganRelation,
    interaction: zhiRelation,
    advice,
  };
}
