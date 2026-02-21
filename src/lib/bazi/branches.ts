/**
 * 地支關係分析模組
 */

import type { BaZiChart, DiZhi, BranchRelation, WuXing } from './types';
import {
  BRANCH_SIX_COMBINE,
  BRANCH_THREE_COMBINE,
  BRANCH_THREE_MEETING,
  BRANCH_SIX_CLASH,
  BRANCH_THREE_PUNISHMENT,
  BRANCH_SIX_HARM,
} from '@/data/constants';

type Position = '年' | '月' | '日' | '時';

interface BranchWithPosition {
  branch: DiZhi;
  position: Position;
}

/**
 * 獲取四柱地支及其位置
 */
function getBranchesWithPosition(chart: BaZiChart): BranchWithPosition[] {
  return [
    { branch: chart.year.zhi, position: '年' },
    { branch: chart.month.zhi, position: '月' },
    { branch: chart.day.zhi, position: '日' },
    { branch: chart.hour.zhi, position: '時' },
  ];
}

/**
 * 檢查兩個地支是否相鄰（力量更強）
 */
function areAdjacent(pos1: Position, pos2: Position): boolean {
  const order: Position[] = ['年', '月', '日', '時'];
  const idx1 = order.indexOf(pos1);
  const idx2 = order.indexOf(pos2);
  return Math.abs(idx1 - idx2) === 1;
}

/**
 * 分析六合
 */
function analyzeSixCombine(branches: BranchWithPosition[]): BranchRelation[] {
  const relations: BranchRelation[] = [];

  for (const [b1, b2, result] of BRANCH_SIX_COMBINE) {
    const match1 = branches.filter(b => b.branch === b1);
    const match2 = branches.filter(b => b.branch === b2);

    if (match1.length > 0 && match2.length > 0) {
      for (const m1 of match1) {
        for (const m2 of match2) {
          const adjacent = areAdjacent(m1.position, m2.position);
          relations.push({
            type: '六合',
            branches: [b1, b2],
            positions: [m1.position, m2.position],
            result: result as WuXing,
            description: `${m1.position}支${b1}與${m2.position}支${b2}六合化${result}${adjacent ? '（相鄰，力強）' : ''}`,
          });
        }
      }
    }
  }

  return relations;
}

/**
 * 分析三合
 */
function analyzeThreeCombine(branches: BranchWithPosition[]): BranchRelation[] {
  const relations: BranchRelation[] = [];
  const branchSet = new Set(branches.map(b => b.branch));

  for (const [b1, b2, b3, result] of BRANCH_THREE_COMBINE) {
    // 完整三合
    if (branchSet.has(b1) && branchSet.has(b2) && branchSet.has(b3)) {
      const positions = branches
        .filter(b => [b1, b2, b3].includes(b.branch))
        .map(b => b.position);

      relations.push({
        type: '三合',
        branches: [b1, b2, b3],
        positions: positions as Position[],
        result: result as WuXing,
        description: `${b1}${b2}${b3}三合${result}局`,
      });
    }
    // 半合（任意兩個）
    else {
      const pairs: [DiZhi, DiZhi][] = [[b1, b2], [b2, b3], [b1, b3]];
      for (const [p1, p2] of pairs) {
        if (branchSet.has(p1) && branchSet.has(p2)) {
          const positions = branches
            .filter(b => [p1, p2].includes(b.branch))
            .map(b => b.position);

          const isCenter = (p1 === b2 || p2 === b2); // 帶中心字力量較強
          relations.push({
            type: '半合',
            branches: [p1, p2],
            positions: positions as Position[],
            result: result as WuXing,
            description: `${p1}${p2}半合${result}局${isCenter ? '（帶中心字，力強）' : '（拱合，力弱）'}`,
          });
        }
      }
    }
  }

  return relations;
}

/**
 * 分析三會（方局）
 */
function analyzeThreeMeeting(branches: BranchWithPosition[]): BranchRelation[] {
  const relations: BranchRelation[] = [];
  const branchSet = new Set(branches.map(b => b.branch));

  for (const [b1, b2, b3, result] of BRANCH_THREE_MEETING) {
    if (branchSet.has(b1) && branchSet.has(b2) && branchSet.has(b3)) {
      const positions = branches
        .filter(b => [b1, b2, b3].includes(b.branch))
        .map(b => b.position);

      relations.push({
        type: '三會',
        branches: [b1, b2, b3],
        positions: positions as Position[],
        result: result as WuXing,
        description: `${b1}${b2}${b3}三會${result}方局（力量最強）`,
      });
    }
  }

  return relations;
}

/**
 * 分析六沖
 */
function analyzeSixClash(branches: BranchWithPosition[]): BranchRelation[] {
  const relations: BranchRelation[] = [];

  for (const [b1, b2] of BRANCH_SIX_CLASH) {
    const match1 = branches.filter(b => b.branch === b1);
    const match2 = branches.filter(b => b.branch === b2);

    if (match1.length > 0 && match2.length > 0) {
      for (const m1 of match1) {
        for (const m2 of match2) {
          const adjacent = areAdjacent(m1.position, m2.position);
          relations.push({
            type: '六沖',
            branches: [b1, b2],
            positions: [m1.position, m2.position],
            description: `${m1.position}支${b1}與${m2.position}支${b2}相沖${adjacent ? '（相鄰，沖力強）' : ''}`,
          });
        }
      }
    }
  }

  return relations;
}

/**
 * 分析三刑
 */
function analyzeThreePunishment(branches: BranchWithPosition[]): BranchRelation[] {
  const relations: BranchRelation[] = [];
  const branchList = branches.map(b => b.branch);

  // 無禮之刑（子卯相刑）
  const wuLi = BRANCH_THREE_PUNISHMENT.無禮之刑;
  if (branchList.includes(wuLi[0]) && branchList.includes(wuLi[1])) {
    const positions = branches
      .filter(b => wuLi.includes(b.branch))
      .map(b => b.position);

    relations.push({
      type: '三刑',
      branches: wuLi,
      positions: positions as Position[],
      description: '子卯相刑（無禮之刑）：容易因任性而惹禍',
    });
  }

  // 無恩之刑（寅巳申）
  const wuEn = BRANCH_THREE_PUNISHMENT.無恩之刑;
  const wuEnCount = wuEn.filter(b => branchList.includes(b)).length;
  if (wuEnCount >= 2) {
    const matched = wuEn.filter(b => branchList.includes(b));
    const positions = branches
      .filter(b => matched.includes(b.branch))
      .map(b => b.position);

    relations.push({
      type: '三刑',
      branches: matched,
      positions: positions as Position[],
      description: `${matched.join('')}相刑（無恩之刑）：容易恩將仇報、忘恩負義`,
    });
  }

  // 恃勢之刑（丑戌未）
  const chiShi = BRANCH_THREE_PUNISHMENT.恃勢之刑;
  const chiShiCount = chiShi.filter(b => branchList.includes(b)).length;
  if (chiShiCount >= 2) {
    const matched = chiShi.filter(b => branchList.includes(b));
    const positions = branches
      .filter(b => matched.includes(b.branch))
      .map(b => b.position);

    relations.push({
      type: '三刑',
      branches: matched,
      positions: positions as Position[],
      description: `${matched.join('')}相刑（恃勢之刑）：容易仗勢欺人、剛愎自用`,
    });
  }

  // 自刑（辰午酉亥）
  const ziXing = BRANCH_THREE_PUNISHMENT.自刑;
  for (const b of ziXing) {
    const count = branchList.filter(x => x === b).length;
    if (count >= 2) {
      const positions = branches
        .filter(x => x.branch === b)
        .map(x => x.position);

      relations.push({
        type: '自刑',
        branches: [b, b],
        positions: positions as Position[],
        description: `${b}${b}自刑：容易自我糾結、鑽牛角尖`,
      });
    }
  }

  return relations;
}

/**
 * 分析六害
 */
function analyzeSixHarm(branches: BranchWithPosition[]): BranchRelation[] {
  const relations: BranchRelation[] = [];

  for (const [b1, b2] of BRANCH_SIX_HARM) {
    const match1 = branches.filter(b => b.branch === b1);
    const match2 = branches.filter(b => b.branch === b2);

    if (match1.length > 0 && match2.length > 0) {
      for (const m1 of match1) {
        for (const m2 of match2) {
          relations.push({
            type: '六害',
            branches: [b1, b2],
            positions: [m1.position, m2.position],
            description: `${m1.position}支${b1}與${m2.position}支${b2}相害：暗中阻礙、小人作祟`,
          });
        }
      }
    }
  }

  return relations;
}

/**
 * 完整分析地支關係
 */
export function analyzeAllBranchRelations(chart: BaZiChart): BranchRelation[] {
  const branches = getBranchesWithPosition(chart);

  const relations: BranchRelation[] = [];

  // 按力量強弱順序分析
  relations.push(...analyzeThreeMeeting(branches));   // 三會最強
  relations.push(...analyzeThreeCombine(branches));   // 三合/半合
  relations.push(...analyzeSixCombine(branches));     // 六合
  relations.push(...analyzeSixClash(branches));       // 六沖
  relations.push(...analyzeThreePunishment(branches)); // 三刑
  relations.push(...analyzeSixHarm(branches));        // 六害

  return relations;
}

/**
 * 判斷地支關係對日主的影響
 */
export function evaluateBranchRelationImpact(
  relation: BranchRelation,
  dayElement: WuXing,
  isStrong: boolean
): 'positive' | 'negative' | 'neutral' {
  // 如果有合化結果
  if (relation.result) {
    // 身強喜洩耗（食傷、財、官殺）
    // 身弱喜生扶（印、比劫）
    // 簡化邏輯：看合化結果對日主的影響
    if (isStrong) {
      // 身強：合化為財官食傷為吉
      if (['財', '官', '食'].some(x => relation.result !== dayElement)) {
        return 'positive';
      }
    } else {
      // 身弱：合化為印比為吉
      if (relation.result === dayElement) {
        return 'positive';
      }
    }
  }

  // 沖刑害通常為負面
  if (['六沖', '三刑', '六害', '自刑'].includes(relation.type)) {
    return 'negative';
  }

  return 'neutral';
}

/**
 * 獲取地支關係的詳細解讀
 */
export function getBranchRelationDescription(
  relation: BranchRelation,
  chart: BaZiChart
): string {
  const positionMeaning: Record<Position, string> = {
    '年': '長輩/祖業/童年',
    '月': '父母/事業/青年',
    '日': '自己/配偶/中年',
    '時': '子女/晚年/成就',
  };

  const affectedAreas = relation.positions
    .map(p => positionMeaning[p])
    .join('與');

  return `${relation.description}。影響範圍：${affectedAreas}。`;
}
