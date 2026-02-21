import { describe, it, expect } from 'vitest'
import {
  getTenGod,
  getHiddenStemsTenGods,
  countTenGods,
  getTenGodElement,
  TEN_GOD_CATEGORIES,
  isBenevolentGod,
} from '../ten-gods'
import { getBaZiChart } from '../calculator'
import type { BirthInput, TianGan, ShiShen } from '../types'

describe('getTenGod', () => {
  it('應該正確計算比肩（同五行同陰陽）', () => {
    // 甲對甲 = 比肩
    expect(getTenGod('甲', '甲')).toBe('比肩')
    // 乙對乙 = 比肩
    expect(getTenGod('乙', '乙')).toBe('比肩')
    // 丙對丙 = 比肩
    expect(getTenGod('丙', '丙')).toBe('比肩')
  })

  it('應該正確計算劫財（同五行異陰陽）', () => {
    // 甲對乙 = 劫財
    expect(getTenGod('甲', '乙')).toBe('劫財')
    // 乙對甲 = 劫財
    expect(getTenGod('乙', '甲')).toBe('劫財')
    // 丙對丁 = 劫財
    expect(getTenGod('丙', '丁')).toBe('劫財')
  })

  it('應該正確計算食神（我生同陰陽）', () => {
    // 甲木生丙火，同陽 = 食神
    expect(getTenGod('甲', '丙')).toBe('食神')
    // 乙木生丁火，同陰 = 食神
    expect(getTenGod('乙', '丁')).toBe('食神')
  })

  it('應該正確計算傷官（我生異陰陽）', () => {
    // 甲木生丁火，異陰陽 = 傷官
    expect(getTenGod('甲', '丁')).toBe('傷官')
    // 乙木生丙火，異陰陽 = 傷官
    expect(getTenGod('乙', '丙')).toBe('傷官')
  })

  it('應該正確計算偏財（我剋同陰陽）', () => {
    // 甲木剋戊土，同陽 = 偏財
    expect(getTenGod('甲', '戊')).toBe('偏財')
    // 乙木剋己土，同陰 = 偏財
    expect(getTenGod('乙', '己')).toBe('偏財')
  })

  it('應該正確計算正財（我剋異陰陽）', () => {
    // 甲木剋己土，異陰陽 = 正財
    expect(getTenGod('甲', '己')).toBe('正財')
    // 乙木剋戊土，異陰陽 = 正財
    expect(getTenGod('乙', '戊')).toBe('正財')
  })

  it('應該正確計算七殺（剋我同陰陽）', () => {
    // 庚金剋甲木，同陽 = 七殺
    expect(getTenGod('甲', '庚')).toBe('七殺')
    // 辛金剋乙木，同陰 = 七殺
    expect(getTenGod('乙', '辛')).toBe('七殺')
  })

  it('應該正確計算正官（剋我異陰陽）', () => {
    // 辛金剋甲木，異陰陽 = 正官
    expect(getTenGod('甲', '辛')).toBe('正官')
    // 庚金剋乙木，異陰陽 = 正官
    expect(getTenGod('乙', '庚')).toBe('正官')
  })

  it('應該正確計算偏印（生我同陰陽）', () => {
    // 壬水生甲木，同陽 = 偏印
    expect(getTenGod('甲', '壬')).toBe('偏印')
    // 癸水生乙木，同陰 = 偏印
    expect(getTenGod('乙', '癸')).toBe('偏印')
  })

  it('應該正確計算正印（生我異陰陽）', () => {
    // 癸水生甲木，異陰陽 = 正印
    expect(getTenGod('甲', '癸')).toBe('正印')
    // 壬水生乙木，異陰陽 = 正印
    expect(getTenGod('乙', '壬')).toBe('正印')
  })
})

describe('getHiddenStemsTenGods', () => {
  it('應該返回地支藏干的十神及權重', () => {
    // 寅藏 甲（本氣）、丙（中氣）、戊（餘氣）
    const result = getHiddenStemsTenGods('甲', '寅')

    expect(result.length).toBeGreaterThan(0)
    expect(result[0].weight).toBe(1.0) // 本氣權重

    if (result.length > 1) {
      expect(result[1].weight).toBe(0.6) // 中氣權重
    }
    if (result.length > 2) {
      expect(result[2].weight).toBe(0.3) // 餘氣權重
    }
  })

  it('應該正確計算每個藏干的十神', () => {
    // 子藏癸水（本氣）
    const result = getHiddenStemsTenGods('甲', '子')
    expect(result[0].stem).toBe('癸')
    expect(result[0].tenGod).toBe('正印') // 癸水生甲木，異陰陽
  })
})

describe('countTenGods', () => {
  it('應該統計八字盤中的十神數量', () => {
    const input: BirthInput = {
      year: 1990,
      month: 1,
      day: 1,
      hour: 12,
      gender: '男',
    }

    const chart = getBaZiChart(input)
    const count = countTenGods(chart)

    // 確認所有十神都有計數
    const allTenGods: ShiShen[] = [
      '比肩', '劫財', '食神', '傷官',
      '偏財', '正財', '七殺', '正官',
      '偏印', '正印',
    ]

    for (const god of allTenGods) {
      expect(count[god]).toBeDefined()
      expect(typeof count[god]).toBe('number')
    }
  })

  it('應該包含天干和藏干的統計', () => {
    const input: BirthInput = {
      year: 1990,
      month: 1,
      day: 1,
      hour: 12,
      gender: '男',
    }

    const chart = getBaZiChart(input)
    const count = countTenGods(chart)

    // 總數應該大於 3（至少有年月時三個天干 + 藏干）
    const total = Object.values(count).reduce((sum, n) => sum + n, 0)
    expect(total).toBeGreaterThan(3)
  })
})

describe('getTenGodElement', () => {
  it('應該正確返回十神對應的五行', () => {
    // 對於甲木日主
    // 比肩/劫財 = 木（同我）
    expect(getTenGodElement('比肩', '木')).toBe('木')
    expect(getTenGodElement('劫財', '木')).toBe('木')

    // 食傷 = 火（我生）
    expect(getTenGodElement('食神', '木')).toBe('火')
    expect(getTenGodElement('傷官', '木')).toBe('火')

    // 財星 = 土（我剋）
    expect(getTenGodElement('偏財', '木')).toBe('土')
    expect(getTenGodElement('正財', '木')).toBe('土')
  })
})

describe('TEN_GOD_CATEGORIES', () => {
  it('應該正確分類十神', () => {
    expect(TEN_GOD_CATEGORIES.比劫).toContain('比肩')
    expect(TEN_GOD_CATEGORIES.比劫).toContain('劫財')

    expect(TEN_GOD_CATEGORIES.食傷).toContain('食神')
    expect(TEN_GOD_CATEGORIES.食傷).toContain('傷官')

    expect(TEN_GOD_CATEGORIES.財星).toContain('偏財')
    expect(TEN_GOD_CATEGORIES.財星).toContain('正財')

    expect(TEN_GOD_CATEGORIES.官殺).toContain('七殺')
    expect(TEN_GOD_CATEGORIES.官殺).toContain('正官')

    expect(TEN_GOD_CATEGORIES.印星).toContain('偏印')
    expect(TEN_GOD_CATEGORIES.印星).toContain('正印')
  })
})

describe('isBenevolentGod', () => {
  it('應該正確判斷吉神', () => {
    // 四吉神：正官、正財、正印、食神
    expect(isBenevolentGod('正官')).toBe(true)
    expect(isBenevolentGod('正財')).toBe(true)
    expect(isBenevolentGod('正印')).toBe(true)
    expect(isBenevolentGod('食神')).toBe(true)
  })

  it('應該正確判斷凶神', () => {
    // 四凶神：七殺、偏財、偏印、傷官（以及比劫）
    expect(isBenevolentGod('七殺')).toBe(false)
    expect(isBenevolentGod('偏財')).toBe(false)
    expect(isBenevolentGod('偏印')).toBe(false)
    expect(isBenevolentGod('傷官')).toBe(false)
    expect(isBenevolentGod('比肩')).toBe(false)
    expect(isBenevolentGod('劫財')).toBe(false)
  })
})
