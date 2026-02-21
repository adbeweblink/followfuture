import { describe, it, expect } from 'vitest'
import {
  isDeLing,
  getDeDiScore,
  isDeDi,
  isDeShi,
  getDeShiScore,
  analyzeStrength,
  canBeFromPattern,
  canBeSpecialPattern,
  getStrengthDescription,
} from '../strength'
import { getBaZiChart } from '../calculator'
import type { BirthInput, DiZhi, WuXing } from '../types'

describe('isDeLing', () => {
  it('木日主春天得令', () => {
    // 木日主在寅月（春季木旺）
    expect(isDeLing('木', '寅')).toBe(true)
    expect(isDeLing('木', '卯')).toBe(true)
  })

  it('木日主冬天相令（水生木）', () => {
    // 木日主在子月（冬季水旺，水生木）
    expect(isDeLing('木', '子')).toBe(true)
    expect(isDeLing('木', '亥')).toBe(true)
  })

  it('木日主夏天休令', () => {
    // 木日主在午月（夏季火旺，木生火，氣洩）
    expect(isDeLing('木', '午')).toBe(false)
    expect(isDeLing('木', '巳')).toBe(false)
  })

  it('木日主秋天囚令', () => {
    // 木日主在酉月（秋季金旺，金剋木）
    expect(isDeLing('木', '酉')).toBe(false)
    expect(isDeLing('木', '申')).toBe(false)
  })

  it('火日主夏天得令', () => {
    expect(isDeLing('火', '午')).toBe(true)
    expect(isDeLing('火', '巳')).toBe(true)
  })

  it('金日主秋天得令', () => {
    expect(isDeLing('金', '申')).toBe(true)
    expect(isDeLing('金', '酉')).toBe(true)
  })

  it('水日主冬天得令', () => {
    expect(isDeLing('水', '子')).toBe(true)
    expect(isDeLing('水', '亥')).toBe(true)
  })

  it('土日主四季月得令', () => {
    // 土在辰戌丑未四庫月旺
    expect(isDeLing('土', '辰')).toBe(true)
    expect(isDeLing('土', '戌')).toBe(true)
    expect(isDeLing('土', '丑')).toBe(true)
    expect(isDeLing('土', '未')).toBe(true)
  })
})

describe('getDeDiScore', () => {
  it('應該計算地支通根分數', () => {
    // 木日主在寅卯辰亥中有通根
    const branches: DiZhi[] = ['寅', '卯', '辰', '亥']
    const score = getDeDiScore('木', branches)

    expect(score).toBeGreaterThan(0)
    expect(score).toBeLessThanOrEqual(100)
  })

  it('無通根時分數應該較低', () => {
    // 木日主在申酉戌中無通根
    const branches: DiZhi[] = ['申', '酉', '戌', '午']
    const score = getDeDiScore('木', branches)

    expect(score).toBeLessThan(30)
  })
})

describe('isDeDi', () => {
  it('有通根時應該返回 true', () => {
    const branches: DiZhi[] = ['寅', '卯', '辰', '亥']
    expect(isDeDi('木', branches)).toBe(true)
  })

  it('無通根時應該返回 false', () => {
    const branches: DiZhi[] = ['申', '酉', '戌', '午']
    expect(isDeDi('木', branches)).toBe(false)
  })
})

describe('isDeShi', () => {
  it('應該基於印比 vs 財官食傷判斷得勢', () => {
    const input: BirthInput = {
      year: 1990,
      month: 1,
      day: 1,
      hour: 12,
      gender: '男',
    }

    const chart = getBaZiChart(input)
    const result = isDeShi(chart)

    expect(typeof result).toBe('boolean')
  })
})

describe('getDeShiScore', () => {
  it('應該返回 0-100 的分數', () => {
    const input: BirthInput = {
      year: 1990,
      month: 1,
      day: 1,
      hour: 12,
      gender: '男',
    }

    const chart = getBaZiChart(input)
    const score = getDeShiScore(chart)

    expect(score).toBeGreaterThanOrEqual(0)
    expect(score).toBeLessThanOrEqual(100)
  })
})

describe('analyzeStrength', () => {
  it('應該返回完整的身強身弱分析結果', () => {
    const input: BirthInput = {
      year: 1990,
      month: 1,
      day: 1,
      hour: 12,
      gender: '男',
    }

    const chart = getBaZiChart(input)
    const analysis = analyzeStrength(chart)

    // 檢查結構完整
    expect(analysis).toHaveProperty('deLing')
    expect(analysis).toHaveProperty('deDi')
    expect(analysis).toHaveProperty('deDiScore')
    expect(analysis).toHaveProperty('deShi')
    expect(analysis).toHaveProperty('score')
    expect(analysis).toHaveProperty('verdict')
    expect(analysis).toHaveProperty('reason')

    // 檢查類型
    expect(typeof analysis.deLing).toBe('boolean')
    expect(typeof analysis.deDi).toBe('boolean')
    expect(typeof analysis.deShi).toBe('boolean')
    expect(typeof analysis.score).toBe('number')
    expect(Array.isArray(analysis.reason)).toBe(true)
  })

  it('verdict 應該是有效的身強身弱等級', () => {
    const input: BirthInput = {
      year: 1990,
      month: 1,
      day: 1,
      hour: 12,
      gender: '男',
    }

    const chart = getBaZiChart(input)
    const analysis = analyzeStrength(chart)

    const validVerdicts = ['身極強', '身強', '身旺', '中和', '身弱', '身衰', '身極弱']
    expect(validVerdicts).toContain(analysis.verdict)
  })

  it('score 應該在 0-100 之間', () => {
    const input: BirthInput = {
      year: 1990,
      month: 1,
      day: 1,
      hour: 12,
      gender: '男',
    }

    const chart = getBaZiChart(input)
    const analysis = analyzeStrength(chart)

    expect(analysis.score).toBeGreaterThanOrEqual(0)
    expect(analysis.score).toBeLessThanOrEqual(100)
  })
})

describe('canBeFromPattern', () => {
  it('應該基於強度分析判斷是否可能從格', () => {
    const input: BirthInput = {
      year: 1990,
      month: 1,
      day: 1,
      hour: 12,
      gender: '男',
    }

    const chart = getBaZiChart(input)
    const analysis = analyzeStrength(chart)
    const result = canBeFromPattern(analysis)

    expect(typeof result).toBe('boolean')
  })
})

describe('canBeSpecialPattern', () => {
  it('應該基於強度分析判斷是否可能專旺格', () => {
    const input: BirthInput = {
      year: 1990,
      month: 1,
      day: 1,
      hour: 12,
      gender: '男',
    }

    const chart = getBaZiChart(input)
    const analysis = analyzeStrength(chart)
    const result = canBeSpecialPattern(analysis)

    expect(typeof result).toBe('boolean')
  })
})

describe('getStrengthDescription', () => {
  it('應該根據分析結果生成描述', () => {
    const input: BirthInput = {
      year: 1990,
      month: 1,
      day: 1,
      hour: 12,
      gender: '男',
    }

    const chart = getBaZiChart(input)
    const analysis = analyzeStrength(chart)
    const description = getStrengthDescription(analysis, chart.day.ganElement)

    expect(typeof description).toBe('string')
    expect(description.length).toBeGreaterThan(0)
  })
})
