/**
 * 八字命理系統 - 主入口
 */

// 重新導出所有型別
export * from './types';

// 重新導出計算模組
export {
  calculateBaZi,
  getBaZiChart,
  getDayMaster,
  getNaYin,
  getLunarInfo,
  calculateLuckPillars,
  getAnnualGanZhi,
  getMonthlyGanZhi,
} from './calculator';

// 重新導出十神模組
export {
  getTenGod,
  getHiddenStemsTenGods,
  calculateAllTenGods,
  countTenGods,
  getTenGodElement,
  TEN_GOD_CATEGORIES,
  isBenevolentGod,
} from './ten-gods';

// 重新導出身強身弱模組
export {
  isDeLing,
  getDeDiScore,
  isDeDi,
  isDeShi,
  getDeShiScore,
  analyzeStrength,
  canBeFromPattern,
  canBeSpecialPattern,
  getStrengthDescription,
} from './strength';

// 重新導出地支關係模組
export {
  analyzeAllBranchRelations,
  evaluateBranchRelationImpact,
  getBranchRelationDescription,
} from './branches';

// 重新導出五行模組
export {
  calculateWuXingStats,
  calculateWuXingPercentage,
  getWuXingDescription,
  getWuXingStatus,
  analyzePreference,
  getWuXingOrgans,
  prepareWuXingChartData,
} from './wuxing';

// 重新導出格局模組
export {
  determinePattern,
  checkPatternBreak,
  getPatternDescription,
} from './patterns';

// 重新導出報告生成器
export {
  generateFullReport,
  generateShortReport,
  type ReportSection,
  type FullReport,
} from './report-generator';

// 重新導出流年分析模組
export {
  analyzeAnnualFortune,
  analyzeMonthlyFortunes,
  analyzeMultipleYears,
  getAnnualKeyPoints,
} from './annual-fortune';

// 重新導出神煞模組
export {
  analyzeShenSha,
  analyzeKongWang,
  analyzeGanHe,
  getShenShaSummary,
  getKongWangDescription,
} from './shensha';

// 重新導出喜用神深度分析模組
export {
  analyzePreferenceAdvanced,
  analyzePreferenceSimple,
} from './preference';

// 重新導出大運流年交互分析模組
export {
  analyzeLuckPillars,
  analyzeLuckYearInteraction,
  analyzeMultipleYearInteractions,
  getCurrentLuckPillar,
} from './luck-pillar-analysis';

// 重新導出健康分析模組
export {
  WUXING_ORGANS,
  analyzeHealth,
  analyzeLuckPillarHealth,
  getWuXingFoodAdvice,
  generateHealthReport,
} from './health';

// 重新導出職業分析模組
export {
  WUXING_INDUSTRIES,
  TEN_GOD_CAREER,
  analyzeCareer,
  getIndustryByElement,
  getTenGodCareerAdvice,
} from './career';

// 重新導出感情婚姻分析模組
export {
  getSpouseStar,
  analyzeSpousePalace,
  findPeachBlossom,
  checkPeachBlossomInChart,
  findHongLuanTianXi,
  checkHongLuanTianXiInChart,
  analyzeRelationship,
} from './relationship';

// 重新導出六親分析模組
export {
  LIUQIN_MAPPING,
  PILLAR_PALACES,
  analyzeLiuQin,
  getTenGodLiuQin,
} from './liuqin';

// 重新導出長生十二宮模組
export {
  getTwelveStage,
  getTwelveStageByGan,
  getTwelveStageScore,
  getTwelveStageMeaning,
  isProsperous,
  isDeclined,
  isInTomb,
  isPeachBlossom,
  analyzeTwelveStageForFortune,
  analyzeChartTwelveStages,
  type TwelveStage,
} from './twelve-stages';

// 重新導出進階運勢分析模組
export {
  detectSuiYunBingLin,
  analyzePillarTriggers,
  getAnnualShenSha,
  checkKongWangStatus,
  analyzeAdvancedFortune,
  type TriggerType,
  type PillarTrigger,
  type SuiYunBingLin,
  type AnnualShenSha,
  type AdvancedFortuneAnalysis,
} from './fortune-advanced';

// 重新導出調候用神模組
export {
  analyzeTiaoHou,
  getTiaoHouImpact,
  needsTiaoHou,
  getPrimaryTiaoHou,
  type ClimateState,
} from './tiao-hou';

// 重新導出日主天干單論模組
export {
  analyzeDayMaster,
  getDayMasterSummary,
  getDayMasterCorePersonality,
  getDayMasterTraits,
  type DayMasterAnalysis,
} from './day-master';

// 重新導出月柱單論模組
export {
  analyzeMonthPillar,
  getMonthPillarSummary,
  analyzeDayMonthRelation,
  type MonthPillarAnalysis,
} from './month-pillar';

// 重新導出流年流月詳細說明模組
export {
  getAnnualFortuneDetail,
  getMonthlyFortuneDetail,
  type AnnualFortuneDetail,
  type MonthlyFortuneDetail,
} from './fortune-details';

// 重新導出合婚分析模組
export {
  analyzeMarriageMatching,
  getMarriageMatchingSummary,
  type MarriageMatchingResult,
} from './marriage-matching';

// 重新導出胎元命宮身宮模組
export {
  calculateTaiYuan,
  calculateMingGongZhi,
  calculateShenGongZhi,
  calculateMingGongGan,
  analyzeTaiYuan,
  analyzeMingGong,
  analyzeShenGong,
  analyzeThreeGongs,
  type TaiYuanAnalysis,
  type MingGongAnalysis,
  type ShenGongAnalysis,
  type ThreeGongsAnalysis,
} from './auxiliary-stars';

// 重新導出年柱單論模組
export {
  analyzeYearPillar,
  getYearPillarSummary,
  type YearPillarAnalysis,
} from './year-pillar';

// 重新導出時柱單論模組
export {
  analyzeHourPillar,
  getHourPillarSummary,
  type HourPillarAnalysis,
} from './hour-pillar';

// 重新導出流日分析模組
export {
  getDailyGanZhi,
  analyzeDailyFortune,
  analyzeWeeklyFortune,
  getTodayFortuneBrief,
  type DailyFortune,
  type WeeklyFortune,
} from './daily-fortune';

// 重新導出納音深度論命模組
export {
  getNaYinInfo,
  analyzeNaYin,
  getNaYinBrief,
  type NaYinInfo,
  type NaYinAnalysis,
} from './nayin';

// 重新導出真太陽時校正模組
export {
  calculateTrueSolarTime,
  calculateEquationOfTime,
  calculateLongitudeCorrection,
  getDayOfYear,
  getHourBranch,
  findCityByName,
  getCitiesByProvince,
  getAllProvinces,
  formatTimeDifference,
  getTrueSolarTimeExplanation,
  getTrueSolarTimeAdvice,
  needsTrueSolarTimeCorrection,
  CITY_COORDINATES,
  type CityData,
  type TrueSolarTimeResult,
} from './true-solar-time';

// 重新導出小運（童限）分析模組
export {
  analyzeMinorFortune,
  getMinorFortuneByAge,
  getMinorFortuneBrief,
  isInMinorFortunePeriod,
  getCurrentMinorFortune,
  type MinorFortuneYear,
  type MinorFortuneAnalysis,
} from './minor-fortune';

// ========== 整合分析函數 ==========

import type { BirthInput, BaZiAnalysis } from './types';
import { getBaZiChart, calculateLuckPillars } from './calculator';
import { calculateAllTenGods } from './ten-gods';
import { analyzeStrength } from './strength';
import { analyzeAllBranchRelations } from './branches';
import { calculateWuXingStats, calculateWuXingPercentage, analyzePreference } from './wuxing';
import { analyzePreferenceAdvanced } from './preference';
import { determinePattern, checkPatternBreak } from './patterns';
import { analyzeAnnualFortune, analyzeMonthlyFortunes } from './annual-fortune';
import { analyzeShenSha, analyzeKongWang, analyzeGanHe } from './shensha';
import { analyzeLuckPillars, analyzeMultipleYearInteractions, getCurrentLuckPillar } from './luck-pillar-analysis';
import { analyzeHealth, generateHealthReport } from './health';
import { analyzeCareer } from './career';
import { analyzeRelationship } from './relationship';
import { analyzeLiuQin } from './liuqin';
import { analyzeTiaoHou } from './tiao-hou';

/**
 * 執行完整的八字分析
 */
export function performFullAnalysis(input: BirthInput): BaZiAnalysis {
  // 1. 排盤
  const chart = getBaZiChart(input);

  // 2. 計算十神
  calculateAllTenGods(chart);

  // 3. 五行統計
  const wuXingStats = calculateWuXingStats(chart);
  const wuXingPercentage = calculateWuXingPercentage(wuXingStats);

  // 4. 身強身弱
  const strength = analyzeStrength(chart);

  // 5. 格局判定
  let pattern = determinePattern(chart);
  pattern = checkPatternBreak(chart, pattern);

  // 6. 地支關係
  const branchRelations = analyzeAllBranchRelations(chart);

  // 7. 用神喜忌（基礎版）
  const isStrong = strength.verdict === '身強' || strength.verdict === '身極強' || strength.verdict === '身旺';
  const { favorable, unfavorable } = analyzePreference(chart.day.ganElement, isStrong);

  // 7.5 用神喜忌（深度分析版）
  const preferenceAnalysis = analyzePreferenceAdvanced(chart, pattern, strength);

  // 7.6 調候用神分析
  const tiaoHouAnalysis = analyzeTiaoHou(chart);

  // 8. 大運（基礎版）
  const luckPillarsResult = calculateLuckPillars(input, 8);

  // 8.5 大運深度分析（傳入 isStrong 參數）
  const luckPillarAnalysis = analyzeLuckPillars(chart, input, favorable, unfavorable, 8, isStrong);
  const currentLuckPillarAnalysis = getCurrentLuckPillar(input, chart, favorable, unfavorable);

  // 9. 流年分析（當年，傳入 isStrong 參數）
  const currentYear = new Date().getFullYear();
  const annualFortune = analyzeAnnualFortune(chart, currentYear, favorable, unfavorable, isStrong);

  // 9.5 大運×流年交互分析（未來5年，傳入 isStrong 參數）
  const luckYearInteractions = analyzeMultipleYearInteractions(
    chart, input, currentYear, 5, favorable, unfavorable, isStrong
  );

  // 10. 流月分析（當年12個月，傳入 isStrong 參數）
  const monthlyFortunes = analyzeMonthlyFortunes(chart, currentYear, favorable, unfavorable, isStrong);

  // 11. 神煞分析
  const shenSha = analyzeShenSha(chart);

  // 12. 空亡分析
  const kongWang = analyzeKongWang(chart);

  // 13. 天干合化分析
  const ganHe = analyzeGanHe(chart);

  // 14. 健康分析
  const healthAnalyses = analyzeHealth(chart, wuXingPercentage, unfavorable);
  const healthReport = generateHealthReport(chart, wuXingPercentage, unfavorable, strength);

  // 15. 職業分析
  const career = analyzeCareer(chart, pattern, strength, favorable, input.gender);

  // 16. 感情婚姻分析
  const relationship = analyzeRelationship(chart, input.gender);

  // 17. 六親分析
  const liuQin = analyzeLiuQin(chart, input.gender);

  // 18. 組裝結果
  return {
    basic: {
      gender: input.gender,
      birthDate: new Date(input.year, input.month - 1, input.day, input.hour, input.minute || 0),
      name: input.name,
    },
    chart,
    wuXing: wuXingStats,
    wuXingPercentage,
    strength,
    pattern,
    branchRelations,
    favorable,
    unfavorable,
    preferenceAnalysis,
    tiaoHouAnalysis,
    luckPillars: luckPillarsResult.pillars.map((p, idx) => {
      const analysis = luckPillarAnalysis[idx];
      return {
        ganZhi: p.ganZhi,
        ageStart: p.ageStart,
        ageEnd: p.ageEnd,
        element: analysis?.ganElement || '木' as const,
        tenGod: analysis?.ganTenGod || '比肩' as const,
        score: analysis?.favorableMatch.score || 50,
        theme: analysis?.theme || '',
      };
    }),
    luckPillarAnalysis,
    currentLuckPillarAnalysis: currentLuckPillarAnalysis || undefined,
    luckYearInteractions,
    health: healthAnalyses,
    healthReport,
    career,
    relationship,
    liuQin,
    annualFortune,
    monthlyFortunes,
    shenSha,
    kongWang,
    ganHe,
  };
}
