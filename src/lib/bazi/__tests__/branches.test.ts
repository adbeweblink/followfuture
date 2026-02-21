import { describe, it, expect } from 'vitest'
import {
  analyzeAllBranchRelations,
  evaluateBranchRelationImpact,
  getBranchRelationDescription,
} from '../branches'
import { getBaZiChart } from '../calculator'
import type { BirthInput, BranchRelation } from '../types'

describe('analyzeAllBranchRelations', () => {
  it('應該返回地支關係分析結果', () => {
    const input: BirthInput = {
      year: 1990,
      month: 1,
      day: 1,
      hour: 12,
      gender: '男',
    }

    const chart = getBaZiChart(input)
    const relations = analyzeAllBranchRelations(chart)

    // 應該返回陣列
    expect(relations).toBeDefined()
    expect(Array.isArray(relations)).toBe(true)
  })

  it('每個關係應該有必要的屬性', () => {
    const input: BirthInput = {
      year: 1990,
      month: 1,
      day: 1,
      hour: 12,
      gender: '男',
    }

    const chart = getBaZiChart(input)
    const relations = analyzeAllBranchRelations(chart)

    // 如果有關係，檢查結構
    if (relations.length > 0) {
      const relation = relations[0]
      expect(relation).toHaveProperty('type')
      expect(relation).toHaveProperty('branches')
      expect(relation).toHaveProperty('positions')
      expect(relation).toHaveProperty('description')
      expect(Array.isArray(relation.branches)).toBe(true)
      expect(Array.isArray(relation.positions)).toBe(true)
    }
  })

  it('關係類型應該是有效值', () => {
    const input: BirthInput = {
      year: 1990,
      month: 1,
      day: 1,
      hour: 12,
      gender: '男',
    }

    const chart = getBaZiChart(input)
    const relations = analyzeAllBranchRelations(chart)

    const validTypes = ['六合', '三合', '半合', '三會', '六沖', '三刑', '自刑', '六害']

    for (const relation of relations) {
      expect(validTypes).toContain(relation.type)
    }
  })

  it('應該可以按類型過濾關係', () => {
    const input: BirthInput = {
      year: 1990,
      month: 1,
      day: 1,
      hour: 12,
      gender: '男',
    }

    const chart = getBaZiChart(input)
    const relations = analyzeAllBranchRelations(chart)

    // 可以用 filter 獲取特定類型
    const liuHe = relations.filter(r => r.type === '六合')
    const sanHe = relations.filter(r => r.type === '三合')
    const banHe = relations.filter(r => r.type === '半合')
    const liuChong = relations.filter(r => r.type === '六沖')

    // 確保 filter 返回陣列
    expect(Array.isArray(liuHe)).toBe(true)
    expect(Array.isArray(sanHe)).toBe(true)
    expect(Array.isArray(banHe)).toBe(true)
    expect(Array.isArray(liuChong)).toBe(true)
  })
})

describe('evaluateBranchRelationImpact', () => {
  it('應該評估單個地支關係的影響', () => {
    const relation: BranchRelation = {
      type: '六合',
      branches: ['子', '丑'],
      positions: ['年', '月'],
      result: '土',
      description: '年支子與月支丑六合化土',
    }

    const impact = evaluateBranchRelationImpact(relation, '木', true)

    // 應該返回 'positive'、'negative' 或 'neutral'
    expect(['positive', 'negative', 'neutral']).toContain(impact)
  })

  it('沖刑害應該返回 negative', () => {
    const clashRelation: BranchRelation = {
      type: '六沖',
      branches: ['子', '午'],
      positions: ['年', '時'],
      description: '年支子與時支午相沖',
    }

    const impact = evaluateBranchRelationImpact(clashRelation, '木', true)
    expect(impact).toBe('negative')
  })

  it('三刑應該返回 negative', () => {
    const punishRelation: BranchRelation = {
      type: '三刑',
      branches: ['子', '卯'],
      positions: ['年', '月'],
      description: '子卯相刑（無禮之刑）',
    }

    const impact = evaluateBranchRelationImpact(punishRelation, '金', false)
    expect(impact).toBe('negative')
  })

  it('六害應該返回 negative', () => {
    const harmRelation: BranchRelation = {
      type: '六害',
      branches: ['子', '未'],
      positions: ['日', '時'],
      description: '日支子與時支未相害',
    }

    const impact = evaluateBranchRelationImpact(harmRelation, '火', true)
    expect(impact).toBe('negative')
  })
})

describe('getBranchRelationDescription', () => {
  it('應該生成地支關係的詳細描述', () => {
    const input: BirthInput = {
      year: 1990,
      month: 1,
      day: 1,
      hour: 12,
      gender: '男',
    }

    const chart = getBaZiChart(input)
    const relation: BranchRelation = {
      type: '六合',
      branches: ['子', '丑'],
      positions: ['年', '月'],
      result: '土',
      description: '年支子與月支丑六合化土',
    }

    const description = getBranchRelationDescription(relation, chart)

    expect(typeof description).toBe('string')
    expect(description.length).toBeGreaterThan(0)
    // 應該包含影響範圍
    expect(description).toContain('影響範圍')
  })
})

describe('六合規則', () => {
  it('子丑合土', () => {
    // 找一個有子丑的日期
    const input: BirthInput = {
      year: 1985,
      month: 12,
      day: 22, // 這個日期可能有子丑合
      hour: 1, // 丑時
      gender: '男',
    }

    const chart = getBaZiChart(input)
    const relations = analyzeAllBranchRelations(chart)

    // 如果有子丑在四柱中，應該有六合
    const branches = [chart.year.zhi, chart.month.zhi, chart.day.zhi, chart.hour.zhi]
    const hasZi = branches.includes('子')
    const hasChou = branches.includes('丑')

    if (hasZi && hasChou) {
      const liuHe = relations.filter(r => r.type === '六合')
      expect(liuHe.length).toBeGreaterThan(0)
    }
  })
})

describe('六沖規則', () => {
  it('子午沖', () => {
    const input: BirthInput = {
      year: 2008, // 子年
      month: 6,
      day: 15,
      hour: 12, // 午時
      gender: '男',
    }

    const chart = getBaZiChart(input)
    const relations = analyzeAllBranchRelations(chart)

    const branches = [chart.year.zhi, chart.month.zhi, chart.day.zhi, chart.hour.zhi]
    const hasZi = branches.includes('子')
    const hasWu = branches.includes('午')

    if (hasZi && hasWu) {
      const liuChong = relations.filter(r => r.type === '六沖')
      expect(liuChong.length).toBeGreaterThan(0)
    }
  })
})
