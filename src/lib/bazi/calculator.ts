/**
 * 八字排盤計算器
 * 整合 lunar-javascript 庫
 */

// @ts-expect-error - lunar-javascript 沒有 TypeScript 型別
import { Solar } from 'lunar-javascript';
import type { BaZiChart, Pillar, BirthInput, TianGan, DiZhi, WuXing, HiddenStem } from './types';
import {
  TIAN_GAN_ELEMENT,
  TIAN_GAN_YINYANG,
  DI_ZHI_ELEMENT,
  DI_ZHI_YINYANG,
  HIDDEN_STEMS,
  HIDDEN_STEM_WEIGHT,
} from '@/data/constants';

/**
 * 從 lunar-javascript 獲取原始八字資料
 */
interface LunarBaZiRaw {
  year: string;   // 年柱干支
  month: string;  // 月柱干支
  day: string;    // 日柱干支
  hour: string;   // 時柱干支
}

/**
 * 解析干支字串
 */
function parseGanZhi(ganZhi: string): { gan: TianGan; zhi: DiZhi } {
  const gan = ganZhi[0] as TianGan;
  const zhi = ganZhi[1] as DiZhi;
  return { gan, zhi };
}

/**
 * 獲取地支藏干列表（含權重）
 */
function getHiddenStemsWithWeight(zhi: DiZhi): HiddenStem[] {
  const hidden = HIDDEN_STEMS[zhi];
  const result: HiddenStem[] = [
    { gan: hidden.main, weight: HIDDEN_STEM_WEIGHT.main }
  ];
  if (hidden.middle) {
    result.push({ gan: hidden.middle, weight: HIDDEN_STEM_WEIGHT.middle });
  }
  if (hidden.residue) {
    result.push({ gan: hidden.residue, weight: HIDDEN_STEM_WEIGHT.residue });
  }
  return result;
}

/**
 * 建立單柱資料
 */
function createPillar(ganZhi: string): Pillar {
  const { gan, zhi } = parseGanZhi(ganZhi);

  return {
    gan,
    zhi,
    ganElement: TIAN_GAN_ELEMENT[gan],
    zhiElement: DI_ZHI_ELEMENT[zhi],
    ganYinYang: TIAN_GAN_YINYANG[gan],
    zhiYinYang: DI_ZHI_YINYANG[zhi],
    hiddenStems: getHiddenStemsWithWeight(zhi),
  };
}

/**
 * 使用 lunar-javascript 計算八字
 */
export function calculateBaZi(input: BirthInput): LunarBaZiRaw {
  const { year, month, day, hour, minute = 0 } = input;

  // 使用 lunar-javascript 計算
  const solar = Solar.fromYmdHms(year, month, day, hour, minute, 0);
  const lunar = solar.getLunar();

  // 獲取八字四柱
  const baZi = lunar.getEightChar();

  return {
    year: baZi.getYear(),
    month: baZi.getMonth(),
    day: baZi.getDay(),
    hour: baZi.getTime(),
  };
}

/**
 * 獲取完整八字盤（含所有解析資料）
 */
export function getBaZiChart(input: BirthInput): BaZiChart {
  const raw = calculateBaZi(input);

  return {
    year: createPillar(raw.year),
    month: createPillar(raw.month),
    day: createPillar(raw.day),
    hour: createPillar(raw.hour),
  };
}

/**
 * 獲取日主（日柱天干）
 */
export function getDayMaster(chart: BaZiChart): { gan: TianGan; element: WuXing } {
  return {
    gan: chart.day.gan,
    element: chart.day.ganElement,
  };
}

/**
 * 獲取納音
 */
export function getNaYin(input: BirthInput): string[] {
  const { year, month, day, hour, minute = 0 } = input;
  const solar = Solar.fromYmdHms(year, month, day, hour, minute, 0);
  const lunar = solar.getLunar();
  const baZi = lunar.getEightChar();

  return [
    baZi.getYearNaYin(),
    baZi.getMonthNaYin(),
    baZi.getDayNaYin(),
    baZi.getTimeNaYin(),
  ];
}

/**
 * 獲取農曆資訊
 */
export function getLunarInfo(input: BirthInput) {
  const { year, month, day, hour, minute = 0 } = input;
  const solar = Solar.fromYmdHms(year, month, day, hour, minute, 0);
  const lunar = solar.getLunar();

  return {
    lunarYear: lunar.getYear(),
    lunarMonth: lunar.getMonth(),
    lunarDay: lunar.getDay(),
    lunarMonthCn: lunar.getMonthInChinese(),
    lunarDayCn: lunar.getDayInChinese(),
    zodiac: lunar.getYearShengXiao(),      // 生肖
    jieQi: lunar.getJieQi(),               // 當前節氣
    yearInGanZhi: lunar.getYearInGanZhi(), // 年干支（中文）
  };
}

/**
 * 計算大運
 */
export function calculateLuckPillars(input: BirthInput, count: number = 8) {
  const { year, month, day, hour, minute = 0, gender } = input;
  const solar = Solar.fromYmdHms(year, month, day, hour, minute, 0);
  const lunar = solar.getLunar();
  const baZi = lunar.getEightChar();

  // 獲取大運
  const yun = baZi.getYun(gender === '男' ? 1 : 0);
  const startAge = yun.getStartYear(); // 起運年齡
  const daYunList = yun.getDaYun();

  const pillars = [];
  for (let i = 0; i < Math.min(count, daYunList.length); i++) {
    const daYun = daYunList[i];
    pillars.push({
      ganZhi: daYun.getGanZhi(),
      ageStart: daYun.getStartAge(),
      ageEnd: daYun.getEndAge(),
      startYear: daYun.getStartYear(),
      endYear: daYun.getEndYear(),
    });
  }

  return {
    startAge,
    pillars,
  };
}

/**
 * 獲取指定年份的流年干支
 */
export function getAnnualGanZhi(targetYear: number): string {
  const solar = Solar.fromYmd(targetYear, 6, 1); // 使用年中日期
  const lunar = solar.getLunar();
  return lunar.getYearInGanZhi();
}

/**
 * 獲取指定年份的十二流月
 */
export function getMonthlyGanZhi(targetYear: number) {
  const months = [];

  // 遍歷 12 個月（從寅月到丑月）
  for (let m = 1; m <= 12; m++) {
    // 使用每月 15 日來確保在月中
    const day = 15;
    const adjustedMonth = m;

    const solar = Solar.fromYmd(targetYear, adjustedMonth, day);
    const lunar = solar.getLunar();
    const baZi = lunar.getEightChar();

    months.push({
      solarMonth: m,
      ganZhi: baZi.getMonth(),
      jieQi: lunar.getJieQi(),
    });
  }

  return months;
}
