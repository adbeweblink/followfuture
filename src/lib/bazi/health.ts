/**
 * 八字命理系統 - 健康分析模組
 * 五行與臟腑對應、健康風險評估
 */

import type { BaZiChart, WuXing, WuXingStats, StrengthAnalysis, HealthAnalysis } from './types';

// ========== 五行臟腑對應表 ==========

/** 五行對應臟腑 */
export const WUXING_ORGANS: Record<WuXing, {
  zang: string;      // 臟（陰）
  fu: string;        // 腑（陽）
  sense: string;     // 開竅
  tissue: string;    // 主管組織
  emotion: string;   // 對應情志
  season: string;    // 對應季節
}> = {
  木: {
    zang: '肝',
    fu: '膽',
    sense: '目',
    tissue: '筋腱、指甲',
    emotion: '怒',
    season: '春',
  },
  火: {
    zang: '心',
    fu: '小腸',
    sense: '舌',
    tissue: '血脈、面色',
    emotion: '喜',
    season: '夏',
  },
  土: {
    zang: '脾',
    fu: '胃',
    sense: '口',
    tissue: '肌肉、四肢',
    emotion: '思',
    season: '長夏',
  },
  金: {
    zang: '肺',
    fu: '大腸',
    sense: '鼻',
    tissue: '皮膚、毛髮',
    emotion: '悲',
    season: '秋',
  },
  水: {
    zang: '腎',
    fu: '膀胱',
    sense: '耳',
    tissue: '骨骼、牙齒',
    emotion: '恐',
    season: '冬',
  },
};

/** 五行過旺的健康風險 */
const WUXING_EXCESS_RISKS: Record<WuXing, {
  symptoms: string[];
  diseases: string[];
  advice: string;
}> = {
  木: {
    symptoms: ['易怒、煩躁', '頭痛、頭暈', '眼睛乾澀紅腫', '肌肉僵硬抽筋'],
    diseases: ['肝炎、肝火旺', '高血壓', '膽結石', '眼疾'],
    advice: '宜疏肝解鬱，少熬夜、戒酒，多吃綠色蔬菜，保持心情舒暢。',
  },
  火: {
    symptoms: ['心煩、失眠', '口舌生瘡', '面紅耳赤', '多夢易驚'],
    diseases: ['心臟疾病', '心血管問題', '口腔炎症', '精神焦慮'],
    advice: '宜清心降火，避免情緒激動，少吃辛辣，多喝水，保證睡眠。',
  },
  土: {
    symptoms: ['腹脹、消化不良', '肌肉鬆弛', '思慮過度', '嗜睡乏力'],
    diseases: ['胃病、脾胃虛', '糖尿病', '肥胖', '消化系統疾病'],
    advice: '宜健脾養胃，飲食規律，少吃甜食和生冷，適度運動。',
  },
  金: {
    symptoms: ['咳嗽、氣喘', '皮膚乾燥', '悲傷抑鬱', '便秘'],
    diseases: ['肺病、支氣管炎', '皮膚病', '大腸疾病', '呼吸系統問題'],
    advice: '宜潤肺養陰，遠離煙塵，多吃白色食物，保持呼吸道濕潤。',
  },
  水: {
    symptoms: ['腰膝酸軟', '耳鳴、聽力下降', '恐懼不安', '頻尿、水腫'],
    diseases: ['腎病、泌尿系統', '骨質疏鬆', '生殖系統問題', '內分泌失調'],
    advice: '宜補腎固本，避免過勞，少吃寒涼，保暖護腰，適當補充黑色食物。',
  },
};

/** 五行不足的健康風險 */
const WUXING_DEFICIENCY_RISKS: Record<WuXing, {
  symptoms: string[];
  diseases: string[];
  advice: string;
}> = {
  木: {
    symptoms: ['視力模糊', '指甲脆弱', '筋骨無力', '情緒低落'],
    diseases: ['肝血不足', '貧血', '眼疾', '抑鬱傾向'],
    advice: '宜養肝血，多吃綠色蔬菜和酸味食物，避免過度用眼，保持運動。',
  },
  火: {
    symptoms: ['手腳冰冷', '面色蒼白', '精神萎靡', '心悸氣短'],
    diseases: ['心陽不足', '低血壓', '貧血', '循環不良'],
    advice: '宜溫補心陽，多吃紅色食物，適度運動，避免寒涼食物。',
  },
  土: {
    symptoms: ['食欲不振', '肌肉萎縮', '消化吸收差', '四肢無力'],
    diseases: ['脾虛', '營養不良', '慢性腸胃病', '免疫力低下'],
    advice: '宜健脾益氣，規律飲食，多吃黃色食物，適當按摩腹部。',
  },
  金: {
    symptoms: ['氣短乏力', '皮膚暗淡', '容易感冒', '聲音低弱'],
    diseases: ['肺氣不足', '免疫力差', '過敏體質', '皮膚問題'],
    advice: '宜補益肺氣，多做呼吸運動，吃白色食物，避免煙塵環境。',
  },
  水: {
    symptoms: ['精力不足', '腰酸背痛', '記憶力減退', '畏寒怕冷'],
    diseases: ['腎虛', '早衰', '生育能力下降', '骨骼問題'],
    advice: '宜補腎養精，多吃黑色食物，適當休息，避免過度消耗。',
  },
};

// ========== 健康分析函數 ==========

/**
 * 判斷五行狀態
 */
function getWuXingStatus(percentage: number): 'excess' | 'normal' | 'deficiency' {
  if (percentage >= 30) return 'excess';
  if (percentage <= 10) return 'deficiency';
  return 'normal';
}

/**
 * 計算健康風險等級
 */
function calculateSeverity(
  status: 'excess' | 'normal' | 'deficiency',
  percentage: number,
  isUnfavorable: boolean
): 'low' | 'medium' | 'high' {
  if (status === 'normal') return 'low';

  // 極端值
  if (percentage >= 40 || percentage <= 5) {
    return isUnfavorable ? 'high' : 'medium';
  }

  // 中等偏離
  if (percentage >= 30 || percentage <= 10) {
    return isUnfavorable ? 'medium' : 'low';
  }

  return 'low';
}

/**
 * 生成健康狀態描述
 */
function generateHealthStatus(
  element: WuXing,
  status: 'excess' | 'normal' | 'deficiency',
  percentage: number
): string {
  const organs = WUXING_ORGANS[element];

  if (status === 'excess') {
    return `${element}氣過旺（${percentage.toFixed(1)}%），${organs.zang}${organs.fu}系統需留意`;
  } else if (status === 'deficiency') {
    return `${element}氣不足（${percentage.toFixed(1)}%），${organs.zang}${organs.fu}功能偏弱`;
  }
  return `${element}氣平和（${percentage.toFixed(1)}%），${organs.zang}${organs.fu}系統正常`;
}

/**
 * 生成健康風險描述
 */
function generateHealthRisk(
  element: WuXing,
  status: 'excess' | 'normal' | 'deficiency'
): string {
  if (status === 'normal') {
    return '五行平衡，此方面健康風險較低。';
  }

  const risks = status === 'excess'
    ? WUXING_EXCESS_RISKS[element]
    : WUXING_DEFICIENCY_RISKS[element];

  return `常見症狀：${risks.symptoms.slice(0, 2).join('、')}。潛在風險：${risks.diseases.slice(0, 2).join('、')}。`;
}

/**
 * 生成健康建議
 */
function generateHealthAdvice(
  element: WuXing,
  status: 'excess' | 'normal' | 'deficiency'
): string {
  if (status === 'normal') {
    const organs = WUXING_ORGANS[element];
    return `保持現有生活方式，注意${organs.season}季節的養護，適當食用對應五行的食物。`;
  }

  const risks = status === 'excess'
    ? WUXING_EXCESS_RISKS[element]
    : WUXING_DEFICIENCY_RISKS[element];

  return risks.advice;
}

/**
 * 分析五行健康
 * @param chart 八字盤
 * @param wuXingPercentage 五行百分比
 * @param unfavorable 忌神
 */
export function analyzeHealth(
  chart: BaZiChart,
  wuXingPercentage: WuXingStats,
  unfavorable: WuXing[]
): HealthAnalysis[] {
  const results: HealthAnalysis[] = [];
  const elements: WuXing[] = ['木', '火', '土', '金', '水'];

  for (const element of elements) {
    const percentage = wuXingPercentage[element];
    const status = getWuXingStatus(percentage);
    const isUnfavorable = unfavorable.includes(element);

    // 只有過旺或不足時才加入分析結果
    if (status !== 'normal') {
      const organs = WUXING_ORGANS[element];

      results.push({
        element,
        status: generateHealthStatus(element, status, percentage),
        organs: `${organs.zang}、${organs.fu}（${organs.sense}、${organs.tissue}）`,
        risk: generateHealthRisk(element, status),
        advice: generateHealthAdvice(element, status),
        severity: calculateSeverity(status, percentage, isUnfavorable),
      });
    }
  }

  // 按嚴重程度排序
  const severityOrder = { high: 0, medium: 1, low: 2 };
  results.sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity]);

  // 如果都正常，加入一條說明
  if (results.length === 0) {
    results.push({
      element: chart.day.ganElement,
      status: '五行整體平衡，無明顯偏頗',
      organs: '整體臟腑系統',
      risk: '整體健康風險較低，但仍需注意日常保養。',
      advice: '保持規律作息、均衡飲食、適度運動，定期健康檢查。',
      severity: 'low',
    });
  }

  return results;
}

/**
 * 分析大運健康影響
 */
export function analyzeLuckPillarHealth(
  dayElement: WuXing,
  luckPillarElement: WuXing,
  wuXingPercentage: WuXingStats
): {
  element: WuXing;
  impact: 'positive' | 'negative' | 'neutral';
  description: string;
  advice: string;
} {
  const organs = WUXING_ORGANS[luckPillarElement];
  const currentPercentage = wuXingPercentage[luckPillarElement];

  // 判斷大運五行對原局的影響
  const status = getWuXingStatus(currentPercentage);

  if (status === 'excess') {
    // 原局已過旺，大運再來同五行
    return {
      element: luckPillarElement,
      impact: 'negative',
      description: `大運${luckPillarElement}氣加重原局${luckPillarElement}旺，需特別注意${organs.zang}${organs.fu}健康。`,
      advice: WUXING_EXCESS_RISKS[luckPillarElement].advice,
    };
  } else if (status === 'deficiency') {
    // 原局不足，大運補充
    return {
      element: luckPillarElement,
      impact: 'positive',
      description: `大運${luckPillarElement}氣補充原局不足，有利於${organs.zang}${organs.fu}調養。`,
      advice: `可藉此運勢調理${organs.zang}${organs.fu}，多接觸${luckPillarElement}行相關事物。`,
    };
  }

  return {
    element: luckPillarElement,
    impact: 'neutral',
    description: `大運${luckPillarElement}氣對健康影響平穩，${organs.zang}${organs.fu}系統無特殊波動。`,
    advice: `保持正常養生即可，${organs.season}季注意對應臟腑保養。`,
  };
}

/**
 * 獲取五行養生食物建議
 */
export function getWuXingFoodAdvice(element: WuXing): {
  colors: string[];
  foods: string[];
  flavors: string[];
  avoid: string[];
} {
  const foodAdvice: Record<WuXing, {
    colors: string[];
    foods: string[];
    flavors: string[];
    avoid: string[];
  }> = {
    木: {
      colors: ['綠色'],
      foods: ['菠菜、芹菜、青花菜', '奇異果、綠葡萄', '綠茶、薄荷'],
      flavors: ['酸味'],
      avoid: ['過辣、過油膩'],
    },
    火: {
      colors: ['紅色'],
      foods: ['番茄、紅椒、紅莧菜', '蘋果、草莓、櫻桃', '紅棗、枸杞'],
      flavors: ['苦味'],
      avoid: ['過寒涼的食物'],
    },
    土: {
      colors: ['黃色'],
      foods: ['南瓜、玉米、地瓜', '香蕉、木瓜、芒果', '小米、黃豆'],
      flavors: ['甘味'],
      avoid: ['過甜、生冷'],
    },
    金: {
      colors: ['白色'],
      foods: ['白蘿蔔、山藥、蓮藕', '梨子、白木耳', '杏仁、百合'],
      flavors: ['辛味'],
      avoid: ['燥熱辛辣'],
    },
    水: {
      colors: ['黑色'],
      foods: ['黑芝麻、黑豆、黑木耳', '藍莓、桑葚', '海帶、紫菜'],
      flavors: ['鹹味'],
      avoid: ['過鹹、冰冷'],
    },
  };

  return foodAdvice[element];
}

/**
 * 獲取完整健康報告
 */
export function generateHealthReport(
  chart: BaZiChart,
  wuXingPercentage: WuXingStats,
  unfavorable: WuXing[],
  strength: StrengthAnalysis
): {
  summary: string;
  analyses: HealthAnalysis[];
  constitution: string;
  seasonalAdvice: string[];
} {
  const analyses = analyzeHealth(chart, wuXingPercentage, unfavorable);
  const dayElement = chart.day.ganElement;

  // 體質判定
  let constitution: string;
  if (strength.verdict === '身強' || strength.verdict === '身極強') {
    constitution = `${dayElement}旺體質，精力充沛，但需防過亢。`;
  } else if (strength.verdict === '身弱' || strength.verdict === '身極弱') {
    constitution = `${dayElement}弱體質，宜溫補調養，避免過勞。`;
  } else {
    constitution = `${dayElement}平和體質，整體較為均衡。`;
  }

  // 季節養生建議
  const seasonalAdvice: string[] = [
    `春季（木旺）：宜養肝護眼，多吃綠色蔬菜，避免熬夜。`,
    `夏季（火旺）：宜養心清熱，多喝水，避免情緒激動。`,
    `長夏（土旺）：宜健脾祛濕，飲食清淡，避免生冷。`,
    `秋季（金旺）：宜潤肺養陰，多吃白色食物，避免燥氣。`,
    `冬季（水旺）：宜補腎藏精，多吃黑色食物，注意保暖。`,
  ];

  // 總結
  const highRiskCount = analyses.filter(a => a.severity === 'high').length;
  const mediumRiskCount = analyses.filter(a => a.severity === 'medium').length;

  let summary: string;
  if (highRiskCount > 0) {
    summary = `健康方面需特別關注，有 ${highRiskCount} 項高風險提醒，建議定期檢查相關臟腑。`;
  } else if (mediumRiskCount > 0) {
    summary = `整體健康尚可，有 ${mediumRiskCount} 項中度提醒，日常注意調養即可。`;
  } else {
    summary = `五行較為平衡，健康基礎良好，保持良好生活習慣即可。`;
  }

  return {
    summary,
    analyses,
    constitution,
    seasonalAdvice,
  };
}
