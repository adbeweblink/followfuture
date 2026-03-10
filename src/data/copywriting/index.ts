/**
 * 文案模板系統入口
 */

// 十神文案
export {
  TEN_GOD_DESCRIPTIONS,
  getTenGodDescription,
  generateTenGodAnalysis,
} from './ten-gods';

// 五行文案
export {
  WUXING_DESCRIPTIONS,
  WUXING_RELATIONS,
  generateDayMasterAnalysis,
  generateWuXingAdvice,
  getHealthAdvice,
  getCareerAdvice,
} from './wuxing';

// 格局文案
export {
  PATTERN_DESCRIPTIONS,
  getPatternDescription,
  generatePatternAnalysis,
} from './patterns';

// 身強弱文案
export {
  STRENGTH_DESCRIPTIONS,
  getStrengthDescription,
  generateStrengthAnalysis,
  generateFavorableAdvice,
} from './strength';

// 大運主題
export { DAYUN_THEMES } from './dayun-themes';
export type { DaYunTheme } from './dayun-themes';
