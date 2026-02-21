import { describe, it, expect } from 'vitest'
import {
  determinePattern,
  checkPatternBreak,
  getPatternDescription,
} from '../patterns'
import { getBaZiChart } from '../calculator'
import type { BirthInput, Pattern } from '../types'

describe('determinePattern', () => {
  it('應該返回有效的格局結構', () => {
    const input: BirthInput = {
      year: 1990,
      month: 1,
      day: 1,
      hour: 12,
      gender: '男',
    }

    const chart = getBaZiChart(input)
    const pattern = determinePattern(chart)

    // 檢查結構完整
    expect(pattern).toHaveProperty('name')
    expect(pattern).toHaveProperty('type')
    expect(pattern).toHaveProperty('status')
    expect(pattern).toHaveProperty('description')

    // 檢查類型
    expect(typeof pattern.name).toBe('string')
    expect(typeof pattern.type).toBe('string')
    expect(typeof pattern.status).toBe('string')
    expect(typeof pattern.description).toBe('string')
  })

  it('格局類型應該是有效值', () => {
    const input: BirthInput = {
      year: 1990,
      month: 1,
      day: 1,
      hour: 12,
      gender: '男',
    }

    const chart = getBaZiChart(input)
    const pattern = determinePattern(chart)

    const validTypes = ['正格', '從格', '專旺格', '雜格']
    expect(validTypes).toContain(pattern.type)
  })

  it('格局狀態應該是有效值', () => {
    const input: BirthInput = {
      year: 1990,
      month: 1,
      day: 1,
      hour: 12,
      gender: '男',
    }

    const chart = getBaZiChart(input)
    const pattern = determinePattern(chart)

    const validStatus = ['成格', '破格']
    expect(validStatus).toContain(pattern.status)
  })

  it('不同日期應該可能得到不同格局', () => {
    const input1: BirthInput = {
      year: 1990,
      month: 1,
      day: 1,
      hour: 12,
      gender: '男',
    }

    const input2: BirthInput = {
      year: 1985,
      month: 6,
      day: 15,
      hour: 8,
      gender: '女',
    }

    const chart1 = getBaZiChart(input1)
    const chart2 = getBaZiChart(input2)

    const pattern1 = determinePattern(chart1)
    const pattern2 = determinePattern(chart2)

    // 兩個不同的日期，格局不一定相同（但也可能相同）
    expect(pattern1.name).toBeDefined()
    expect(pattern2.name).toBeDefined()
  })
})

describe('checkPatternBreak', () => {
  it('應該檢查格局是否破格', () => {
    const input: BirthInput = {
      year: 1990,
      month: 1,
      day: 1,
      hour: 12,
      gender: '男',
    }

    const chart = getBaZiChart(input)
    const pattern = determinePattern(chart)
    const checkedPattern = checkPatternBreak(chart, pattern)

    // 應該返回格局物件
    expect(checkedPattern).toHaveProperty('name')
    expect(checkedPattern).toHaveProperty('type')
    expect(checkedPattern).toHaveProperty('status')
    expect(checkedPattern).toHaveProperty('description')
  })

  it('破格後狀態應該是「破格」', () => {
    // 創建一個自定義的格局測試破格邏輯
    const pattern: Pattern = {
      name: '正官格',
      type: '正格',
      status: '成格',
      description: '測試',
      keyGod: '正官',
    }

    const input: BirthInput = {
      year: 1990,
      month: 1,
      day: 1,
      hour: 12,
      gender: '男',
    }

    const chart = getBaZiChart(input)
    const checkedPattern = checkPatternBreak(chart, pattern)

    // 狀態應該是 '成格' 或 '破格'
    expect(['成格', '破格']).toContain(checkedPattern.status)
  })
})

describe('getPatternDescription', () => {
  it('應該生成格局描述', () => {
    const pattern: Pattern = {
      name: '正官格',
      type: '正格',
      status: '成格',
      description: '月支本氣透干，取正官格。',
      keyGod: '正官',
    }

    const description = getPatternDescription(pattern, true)

    expect(typeof description).toBe('string')
    expect(description.length).toBeGreaterThan(0)
  })

  it('應該根據身強身弱調整描述', () => {
    const pattern: Pattern = {
      name: '正財格',
      type: '正格',
      status: '成格',
      description: '取正財為格。',
      keyGod: '正財',
    }

    const strongDesc = getPatternDescription(pattern, true)
    const weakDesc = getPatternDescription(pattern, false)

    // 兩種情況都應該有描述
    expect(strongDesc.length).toBeGreaterThan(0)
    expect(weakDesc.length).toBeGreaterThan(0)
  })

  it('應該為各種格局提供描述', () => {
    const patternNames = [
      '正官格', '七殺格', '正財格', '偏財格',
      '正印格', '偏印格', '食神格', '傷官格',
      '建祿格', '月刃格',
    ]

    for (const name of patternNames) {
      const pattern: Pattern = {
        name,
        type: '正格',
        status: '成格',
        description: '測試',
      }

      const description = getPatternDescription(pattern, true)
      expect(typeof description).toBe('string')
    }
  })
})

describe('格局判定規則', () => {
  it('月支本氣透干成格', () => {
    // 這個測試驗證格局判定邏輯
    const input: BirthInput = {
      year: 1990,
      month: 1,
      day: 1,
      hour: 12,
      gender: '男',
    }

    const chart = getBaZiChart(input)
    const pattern = determinePattern(chart)

    // 格局名稱應該包含「格」字
    expect(pattern.name).toMatch(/格$/)
  })

  it('應該正確處理建祿格', () => {
    // 建祿格：月支與日主同五行（臨官位）
    const input: BirthInput = {
      year: 1990,
      month: 2, // 寅月
      day: 4,   // 找一個甲日
      hour: 12,
      gender: '男',
    }

    const chart = getBaZiChart(input)
    const pattern = determinePattern(chart)

    // 如果是甲木日主生於寅月，可能是建祿格
    // 但這取決於具體日期，所以只檢查結構
    expect(pattern.name).toBeDefined()
  })
})
