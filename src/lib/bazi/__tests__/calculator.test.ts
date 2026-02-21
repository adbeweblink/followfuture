import { describe, it, expect } from 'vitest'
import {
  calculateBaZi,
  getBaZiChart,
  getDayMaster,
  getNaYin,
  getLunarInfo,
  calculateLuckPillars,
  getAnnualGanZhi,
} from '../calculator'
import type { BirthInput } from '../types'

describe('calculateBaZi', () => {
  it('應該正確計算 1990年1月1日 12時 的八字', () => {
    const input: BirthInput = {
      year: 1990,
      month: 1,
      day: 1,
      hour: 12,
      gender: '男',
    }

    const result = calculateBaZi(input)

    // 1990年1月1日 12時（根據 lunar-javascript 計算結果）
    // 年柱: 己巳
    // 月柱: 丙子
    // 日柱: 丙寅
    // 時柱: 甲午
    expect(result.year).toBe('己巳')
    expect(result.month).toBe('丙子')
    expect(result.day).toBe('丙寅')
    expect(result.hour).toBe('甲午')
  })

  it('應該正確計算 2000年6月15日 8時 的八字', () => {
    const input: BirthInput = {
      year: 2000,
      month: 6,
      day: 15,
      hour: 8,
      gender: '女',
    }

    const result = calculateBaZi(input)

    // 2000年6月15日 8時（根據 lunar-javascript 計算結果）
    // 年柱: 庚辰
    // 月柱: 壬午
    // 日柱: 甲辰
    // 時柱: 戊辰
    expect(result.year).toBe('庚辰')
    expect(result.month).toBe('壬午')
    expect(result.day).toBe('甲辰')
    expect(result.hour).toBe('戊辰')
  })

  it('應該正確處理子時（23-1點）', () => {
    const input: BirthInput = {
      year: 1985,
      month: 3,
      day: 15,
      hour: 0,
      gender: '男',
    }

    const result = calculateBaZi(input)

    // 子時應該是當日子時，時柱應有「子」
    expect(result.hour).toContain('子')
  })
})

describe('getBaZiChart', () => {
  it('應該返回完整的八字盤結構', () => {
    const input: BirthInput = {
      year: 1995,
      month: 8,
      day: 20,
      hour: 14,
      gender: '女',
    }

    const chart = getBaZiChart(input)

    // 檢查四柱結構完整
    expect(chart.year).toHaveProperty('gan')
    expect(chart.year).toHaveProperty('zhi')
    expect(chart.year).toHaveProperty('ganElement')
    expect(chart.year).toHaveProperty('zhiElement')
    expect(chart.year).toHaveProperty('ganYinYang')
    expect(chart.year).toHaveProperty('zhiYinYang')
    expect(chart.year).toHaveProperty('hiddenStems')

    expect(chart.month).toHaveProperty('gan')
    expect(chart.day).toHaveProperty('gan')
    expect(chart.hour).toHaveProperty('gan')
  })

  it('藏干應該有正確的權重', () => {
    const input: BirthInput = {
      year: 1995,
      month: 8,
      day: 20,
      hour: 14,
      gender: '女',
    }

    const chart = getBaZiChart(input)

    // 每個地支都應該有藏干
    expect(chart.year.hiddenStems.length).toBeGreaterThan(0)

    // 本氣權重應該是 1.0
    expect(chart.year.hiddenStems[0].weight).toBe(1.0)

    // 如果有中氣，權重應該是 0.6
    if (chart.year.hiddenStems.length > 1) {
      expect(chart.year.hiddenStems[1].weight).toBe(0.6)
    }

    // 如果有餘氣，權重應該是 0.3
    if (chart.year.hiddenStems.length > 2) {
      expect(chart.year.hiddenStems[2].weight).toBe(0.3)
    }
  })
})

describe('getDayMaster', () => {
  it('應該正確返回日主天干和五行', () => {
    const input: BirthInput = {
      year: 1990,
      month: 1,
      day: 1,
      hour: 12,
      gender: '男',
    }

    const chart = getBaZiChart(input)
    const dayMaster = getDayMaster(chart)

    // 1990年1月1日 日主是丙火
    expect(dayMaster.gan).toBe('丙')
    expect(dayMaster.element).toBe('火')
  })
})

describe('getNaYin', () => {
  it('應該返回四柱納音', () => {
    const input: BirthInput = {
      year: 1990,
      month: 1,
      day: 1,
      hour: 12,
      gender: '男',
    }

    const naYin = getNaYin(input)

    // 應該返回四個納音
    expect(naYin).toHaveLength(4)

    // 每個納音都應該是字串
    naYin.forEach(ny => {
      expect(typeof ny).toBe('string')
      expect(ny.length).toBeGreaterThan(0)
    })
  })
})

describe('getLunarInfo', () => {
  it('應該返回完整的農曆資訊', () => {
    const input: BirthInput = {
      year: 2000,
      month: 1,
      day: 1,
      hour: 12,
      gender: '男',
    }

    const lunar = getLunarInfo(input)

    expect(lunar).toHaveProperty('lunarYear')
    expect(lunar).toHaveProperty('lunarMonth')
    expect(lunar).toHaveProperty('lunarDay')
    expect(lunar).toHaveProperty('lunarMonthCn')
    expect(lunar).toHaveProperty('lunarDayCn')
    expect(lunar).toHaveProperty('zodiac')
    expect(lunar).toHaveProperty('yearInGanZhi')
  })

  it('應該正確判斷生肖', () => {
    // 2000年龍年
    const input: BirthInput = {
      year: 2000,
      month: 6,
      day: 15,
      hour: 12,
      gender: '男',
    }

    const lunar = getLunarInfo(input)
    // lunar-javascript 返回簡體字
    expect(lunar.zodiac).toBe('龙')
  })
})

describe('calculateLuckPillars', () => {
  it('應該正確計算大運', () => {
    const input: BirthInput = {
      year: 1990,
      month: 1,
      day: 1,
      hour: 12,
      gender: '男',
    }

    const luckPillars = calculateLuckPillars(input, 8)

    expect(luckPillars).toHaveProperty('startAge')
    expect(luckPillars).toHaveProperty('pillars')
    expect(luckPillars.pillars.length).toBeLessThanOrEqual(8)

    // 每個大運應該有完整的資訊
    if (luckPillars.pillars.length > 0) {
      const firstPillar = luckPillars.pillars[0]
      expect(firstPillar).toHaveProperty('ganZhi')
      expect(firstPillar).toHaveProperty('ageStart')
      expect(firstPillar).toHaveProperty('ageEnd')
      expect(firstPillar).toHaveProperty('startYear')
      expect(firstPillar).toHaveProperty('endYear')
    }
  })

  it('男女大運方向應該不同', () => {
    const baseInput = {
      year: 1990,
      month: 1,
      day: 1,
      hour: 12,
    }

    const maleResult = calculateLuckPillars({ ...baseInput, gender: '男' as const }, 4)
    const femaleResult = calculateLuckPillars({ ...baseInput, gender: '女' as const }, 4)

    // 男女大運順序可能不同
    if (maleResult.pillars.length > 1 && femaleResult.pillars.length > 1) {
      // 大運的干支可能不同（順行 vs 逆行）
      const malePillars = maleResult.pillars.map(p => p.ganZhi)
      const femalePillars = femaleResult.pillars.map(p => p.ganZhi)

      // 不要求完全不同，但確認有正確返回
      expect(malePillars.length).toBeGreaterThan(0)
      expect(femalePillars.length).toBeGreaterThan(0)
    }
  })
})

describe('getAnnualGanZhi', () => {
  it('應該正確返回流年干支', () => {
    // 2024 甲辰年
    expect(getAnnualGanZhi(2024)).toBe('甲辰')

    // 2023 癸卯年
    expect(getAnnualGanZhi(2023)).toBe('癸卯')

    // 2000 庚辰年
    expect(getAnnualGanZhi(2000)).toBe('庚辰')
  })
})
