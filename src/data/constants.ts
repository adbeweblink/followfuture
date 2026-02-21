/**
 * 八字命理系統 - 常數定義
 */

import type { TianGan, DiZhi, WuXing, YinYang, ShiShen } from '@/lib/bazi/types';

// ========== 天干 ==========

export const TIAN_GAN: TianGan[] = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];

export const TIAN_GAN_ELEMENT: Record<TianGan, WuXing> = {
  '甲': '木', '乙': '木',
  '丙': '火', '丁': '火',
  '戊': '土', '己': '土',
  '庚': '金', '辛': '金',
  '壬': '水', '癸': '水',
};

export const TIAN_GAN_YINYANG: Record<TianGan, YinYang> = {
  '甲': '陽', '乙': '陰',
  '丙': '陽', '丁': '陰',
  '戊': '陽', '己': '陰',
  '庚': '陽', '辛': '陰',
  '壬': '陽', '癸': '陰',
};

// ========== 地支 ==========

export const DI_ZHI: DiZhi[] = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

export const DI_ZHI_ELEMENT: Record<DiZhi, WuXing> = {
  '子': '水', '丑': '土',
  '寅': '木', '卯': '木',
  '辰': '土', '巳': '火',
  '午': '火', '未': '土',
  '申': '金', '酉': '金',
  '戌': '土', '亥': '水',
};

export const DI_ZHI_YINYANG: Record<DiZhi, YinYang> = {
  '子': '陽', '丑': '陰',
  '寅': '陽', '卯': '陰',
  '辰': '陽', '巳': '陰',
  '午': '陽', '未': '陰',
  '申': '陽', '酉': '陰',
  '戌': '陽', '亥': '陰',
};

// ========== 地支藏干 ==========

/** 地支藏干（本氣、中氣、餘氣） */
export const HIDDEN_STEMS: Record<DiZhi, { main: TianGan; middle?: TianGan; residue?: TianGan }> = {
  '子': { main: '癸' },
  '丑': { main: '己', middle: '癸', residue: '辛' },
  '寅': { main: '甲', middle: '丙', residue: '戊' },
  '卯': { main: '乙' },
  '辰': { main: '戊', middle: '乙', residue: '癸' },
  '巳': { main: '丙', middle: '庚', residue: '戊' },
  '午': { main: '丁', middle: '己' },
  '未': { main: '己', middle: '丁', residue: '乙' },
  '申': { main: '庚', middle: '壬', residue: '戊' },
  '酉': { main: '辛' },
  '戌': { main: '戊', middle: '辛', residue: '丁' },
  '亥': { main: '壬', middle: '甲' },
};

/** 藏干力量權重 */
export const HIDDEN_STEM_WEIGHT = {
  main: 1.0,      // 本氣 100%
  middle: 0.6,    // 中氣 60%
  residue: 0.3,   // 餘氣 30%
};

// ========== 五行關係 ==========

/** 五行相生（我生） */
export const WUXING_SHENG: Record<WuXing, WuXing> = {
  '木': '火',  // 木生火
  '火': '土',  // 火生土
  '土': '金',  // 土生金
  '金': '水',  // 金生水
  '水': '木',  // 水生木
};

/** 五行相剋（我剋） */
export const WUXING_KE: Record<WuXing, WuXing> = {
  '木': '土',  // 木剋土
  '土': '水',  // 土剋水
  '水': '火',  // 水剋火
  '火': '金',  // 火剋金
  '金': '木',  // 金剋木
};

/** 五行顏色 */
export const WUXING_COLOR: Record<WuXing, string> = {
  '木': '#10B981',  // 綠色
  '火': '#EF4444',  // 紅色
  '土': '#F59E0B',  // 黃色
  '金': '#9CA3AF',  // 灰白
  '水': '#3B82F6',  // 藍色
};

// ========== 十神 ==========

/** 十神名稱（用於顯示） */
export const SHI_SHEN_NAMES: ShiShen[] = [
  '比肩', '劫財', '食神', '傷官', '偏財', '正財', '七殺', '正官', '偏印', '正印'
];

/** 十神簡稱 */
export const SHI_SHEN_SHORT: Record<ShiShen, string> = {
  '比肩': '比',
  '劫財': '劫',
  '食神': '食',
  '傷官': '傷',
  '偏財': '才',
  '正財': '財',
  '七殺': '殺',
  '正官': '官',
  '偏印': '梟',
  '正印': '印',
};

// ========== 地支關係表 ==========

/** 地支六合 */
export const BRANCH_SIX_COMBINE: [DiZhi, DiZhi, WuXing][] = [
  ['子', '丑', '土'],
  ['寅', '亥', '木'],
  ['卯', '戌', '火'],
  ['辰', '酉', '金'],
  ['巳', '申', '水'],
  ['午', '未', '土'],
];

/** 地支三合 */
export const BRANCH_THREE_COMBINE: [DiZhi, DiZhi, DiZhi, WuXing][] = [
  ['申', '子', '辰', '水'],
  ['亥', '卯', '未', '木'],
  ['寅', '午', '戌', '火'],
  ['巳', '酉', '丑', '金'],
];

/** 地支三會（方局） */
export const BRANCH_THREE_MEETING: [DiZhi, DiZhi, DiZhi, WuXing][] = [
  ['寅', '卯', '辰', '木'],  // 東方木局
  ['巳', '午', '未', '火'],  // 南方火局
  ['申', '酉', '戌', '金'],  // 西方金局
  ['亥', '子', '丑', '水'],  // 北方水局
];

/** 地支六沖 */
export const BRANCH_SIX_CLASH: [DiZhi, DiZhi][] = [
  ['子', '午'],
  ['丑', '未'],
  ['寅', '申'],
  ['卯', '酉'],
  ['辰', '戌'],
  ['巳', '亥'],
];

/** 地支三刑 */
export const BRANCH_THREE_PUNISHMENT = {
  無禮之刑: ['子', '卯'] as DiZhi[],
  無恩之刑: ['寅', '巳', '申'] as DiZhi[],
  恃勢之刑: ['丑', '戌', '未'] as DiZhi[],
  自刑: ['辰', '午', '酉', '亥'] as DiZhi[],
};

/** 地支六害 */
export const BRANCH_SIX_HARM: [DiZhi, DiZhi][] = [
  ['子', '未'],
  ['丑', '午'],
  ['寅', '巳'],
  ['卯', '辰'],
  ['申', '亥'],
  ['酉', '戌'],
];

// ========== 月令得令表 ==========

/** 日主五行得令的月支 */
export const LING_TABLE: Record<WuXing, DiZhi[]> = {
  '木': ['寅', '卯', '亥', '子'],         // 木旺於春，水生木
  '火': ['巳', '午', '寅', '卯'],          // 火旺於夏，木生火
  '土': ['辰', '戌', '丑', '未', '巳', '午'],  // 土旺四季，火生土
  '金': ['申', '酉', '辰', '戌', '丑', '未'],  // 金旺於秋，土生金
  '水': ['亥', '子', '申', '酉'],          // 水旺於冬，金生水
};

// ========== 時辰對照 ==========

/** 時辰對應小時 */
export const HOUR_TO_ZHI: Record<number, DiZhi> = {
  23: '子', 0: '子',
  1: '丑', 2: '丑',
  3: '寅', 4: '寅',
  5: '卯', 6: '卯',
  7: '辰', 8: '辰',
  9: '巳', 10: '巳',
  11: '午', 12: '午',
  13: '未', 14: '未',
  15: '申', 16: '申',
  17: '酉', 18: '酉',
  19: '戌', 20: '戌',
  21: '亥', 22: '亥',
};

// ========== 生肖 ==========

export const SHENGXIAO: Record<DiZhi, string> = {
  '子': '鼠', '丑': '牛', '寅': '虎', '卯': '兔',
  '辰': '龍', '巳': '蛇', '午': '馬', '未': '羊',
  '申': '猴', '酉': '雞', '戌': '狗', '亥': '豬',
};

// ========== 天干五合 ==========

export const TIAN_GAN_COMBINE: [TianGan, TianGan, WuXing][] = [
  ['甲', '己', '土'],
  ['乙', '庚', '金'],
  ['丙', '辛', '水'],
  ['丁', '壬', '木'],
  ['戊', '癸', '火'],
];
