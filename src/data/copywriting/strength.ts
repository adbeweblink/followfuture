/**
 * 身強身弱文案模板
 * 提供身強身弱的詳細解讀和建議
 */

import type { WuXing } from '@/lib/bazi/types';

interface StrengthDescription {
  verdict: '身強' | '身弱' | '身旺' | '身衰' | '中和';
  description: string;
  characteristics: string[];
  strengths: string[];
  weaknesses: string[];
  advice: string;
  favorableDirections: string;
  careers: string;
}

export const STRENGTH_DESCRIPTIONS: Record<string, StrengthDescription> = {
  '身強': {
    verdict: '身強',
    description: '日主得令、得地、得勢，三者俱備或具備二者以上，代表自身能量充沛，有足夠的力量去承擔事業、財富和壓力。身強者如一棵大樹，根深葉茂，能夠抵禦風雨。',
    characteristics: [
      '自信心強，有主見',
      '抗壓性好，不易被擊倒',
      '獨立自主，不依賴他人',
      '行動力強，敢於挑戰',
    ],
    strengths: [
      '適合創業或擔任領導',
      '能夠承擔較大的壓力和責任',
      '財運來時能夠把握',
      '適合競爭激烈的環境',
    ],
    weaknesses: [
      '可能過於自我，不聽他人意見',
      '容易固執己見',
      '有時過於強勢',
      '需要適當的發洩管道',
    ],
    advice: '身強宜洩，需要有表現的舞台和發揮的空間。適合追求事業、財富，可以承擔較大的挑戰。但要注意不要過於獨斷，學會傾聽和合作。',
    favorableDirections: '宜往能發揮的方向發展，如創業、競爭、挑戰',
    careers: '適合需要魄力和抗壓的工作：創業者、主管、業務、運動員等',
  },

  '身弱': {
    verdict: '身弱',
    description: '日主失令、失地、失勢，三者俱失或失去二者以上，代表自身能量較弱，需要外界的支持和幫助。身弱者如一棵小樹，需要呵護才能茁壯。',
    characteristics: [
      '較為謙虛，善於配合',
      '需要團隊支持',
      '較為敏感，善解人意',
      '適合輔助性角色',
    ],
    strengths: [
      '善於與人合作',
      '較有同理心',
      '適合穩定的環境',
      '貴人運較重要',
    ],
    weaknesses: [
      '承擔壓力的能力較弱',
      '較易受他人影響',
      '獨立性可能不足',
      '需要更多支持和鼓勵',
    ],
    advice: '身弱宜扶，需要貴人相助和穩定的環境。適合與人合作而非獨自創業，選擇適合自己能量的目標。善用智慧取代蠻力，以巧代勁。',
    favorableDirections: '宜往有支持的方向發展，如團隊合作、穩定職位',
    careers: '適合穩定且有支持的工作：幕僚、顧問、專業技術、行政等',
  },

  '身旺': {
    verdict: '身旺',
    description: '日主能量很強，介於身強與極旺之間。身旺者能量充沛，有強烈的表現欲和行動力，但需要有適當的管道來發洩能量。',
    characteristics: [
      '能量非常充沛',
      '行動力極強',
      '有強烈的企圖心',
      '不甘於平凡',
    ],
    strengths: [
      '有足夠能量去拼搏',
      '抗壓性非常好',
      '適合高挑戰的環境',
      '領導能力強',
    ],
    weaknesses: [
      '可能過於衝動',
      '不夠謙虛',
      '容易與人衝突',
      '需要更大的舞台',
    ],
    advice: '身旺需要更大的舞台來發揮，適合追求高目標、大事業。但要注意修養，避免過於強勢而得罪人。學會把能量用在正確的地方。',
    favorableDirections: '宜往大舞台、大目標發展',
    careers: '適合需要大量能量的工作：創業家、高管、運動員、藝術表演等',
  },

  '身衰': {
    verdict: '身衰',
    description: '日主能量很弱，介於身弱與極弱之間。身衰者能量不足，需要更多的支持和調養，選擇適合自己的道路很重要。',
    characteristics: [
      '能量較為不足',
      '需要更多休息',
      '適合輕鬆的環境',
      '善於以柔克剛',
    ],
    strengths: [
      '善於觀察和思考',
      '不會鋒芒畢露',
      '適合幕後工作',
      '有獨特的智慧',
    ],
    weaknesses: [
      '承擔力有限',
      '需要更多支持',
      '獨立性較弱',
      '健康需注意',
    ],
    advice: '身衰者要學會借力使力，善用智慧而非蠻力。選擇適合自己能量的目標和環境，不要硬撐。注意身體保養，適度休息。',
    favorableDirections: '宜往穩定、有支持的方向發展',
    careers: '適合輕鬆穩定的工作：研究、諮詢、創意、文職等',
  },

  '中和': {
    verdict: '中和',
    description: '日主能量適中，不強不弱，處於平衡狀態。中和者適應性較強，但也可能缺乏明顯特色，需要根據大運流年來調整方向。',
    characteristics: [
      '能量較為平衡',
      '適應性較強',
      '沒有明顯偏向',
      '可塑性高',
    ],
    strengths: [
      '能屈能伸',
      '適應各種環境',
      '平衡感好',
      '發展空間大',
    ],
    weaknesses: [
      '可能缺乏明顯特色',
      '需要找到自己的定位',
      '容易被環境影響',
      '需要明確目標',
    ],
    advice: '中和者要找到適合自己的發展方向，根據喜用神來調整。可以嘗試不同的領域，找到最適合自己的道路。',
    favorableDirections: '視喜用神而定，彈性較大',
    careers: '適合多種工作，可根據興趣和喜用神選擇',
  },
};

/**
 * 根據判定結果獲取描述
 */
export function getStrengthDescription(verdict: string): StrengthDescription {
  return STRENGTH_DESCRIPTIONS[verdict] || STRENGTH_DESCRIPTIONS['中和'];
}

/**
 * 生成身強弱分析文案
 */
export function generateStrengthAnalysis(
  dayElement: WuXing,
  verdict: string,
  deLing: boolean,
  deDiScore: number,
  deShi: boolean
): string {
  const desc = getStrengthDescription(verdict);

  let analysis = `**${dayElement}日主 · ${verdict}**\n\n`;
  analysis += `${desc.description}\n\n`;

  analysis += `**判定依據**：\n`;
  analysis += `• 得令（月令生扶）：${deLing ? '✅ 是' : '❌ 否'}\n`;
  analysis += `• 得地（通根力量）：${deDiScore >= 1.5 ? '✅' : deDiScore >= 0.5 ? '🔸' : '❌'} ${deDiScore.toFixed(1)} 分\n`;
  analysis += `• 得勢（印比數量）：${deShi ? '✅ 是' : '❌ 否'}\n\n`;

  analysis += `**性格特點**：\n${desc.characteristics.map(c => `• ${c}`).join('\n')}\n\n`;

  analysis += `**發展建議**：\n${desc.advice}\n\n`;

  analysis += `**適合方向**：${desc.favorableDirections}\n`;
  analysis += `**適合職業**：${desc.careers}`;

  return analysis;
}

/**
 * 生成喜用神建議
 */
export function generateFavorableAdvice(
  favorable: WuXing[],
  unfavorable: WuXing[],
  isStrong: boolean
): string {
  let advice = '**用神喜忌分析**\n\n';

  if (isStrong) {
    advice += '日主身強，能量充沛，宜「洩」「剋」來平衡。\n\n';
    advice += `**喜用神（宜接觸）**：${favorable.join('、')}\n`;
    advice += '• 食傷洩秀：發揮才華，表現自我\n';
    advice += '• 財星生官：追求財富，建立事業\n';
    advice += '• 官殺制身：接受挑戰，承擔責任\n\n';
  } else {
    advice += '日主身弱，能量不足，宜「生」「扶」來補強。\n\n';
    advice += `**喜用神（宜接觸）**：${favorable.join('、')}\n`;
    advice += '• 印星生身：學習進修，貴人提攜\n';
    advice += '• 比劫幫身：團隊合作，夥伴支持\n\n';
  }

  advice += `**忌神（宜避開）**：${unfavorable.join('、')}\n`;
  advice += '避免過多接觸這些五行，可減少不必要的阻礙和消耗。\n\n';

  advice += '**實際應用**：\n';
  advice += '• 選擇職業時，優先考慮與喜用神相關的行業\n';
  advice += '• 居家環境可增加喜用神對應的顏色和方位\n';
  advice += '• 穿著配飾也可參考喜用神的顏色';

  return advice;
}
