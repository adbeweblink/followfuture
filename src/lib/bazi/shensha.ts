/**
 * 神煞計算模組
 *
 * 負責根據八字盤計算命中的各種神煞
 */

import type { BaZiChart, ShenSha, KongWang, GanHe, TianGan, DiZhi, WuXing } from './types';
import {
  SHEN_SHA_INFO,
  TIAN_YI_GUI_REN,
  TAI_JI_GUI_REN,
  WEN_CHANG_GUI_REN,
  YANG_REN,
  LU_SHEN,
  TAO_HUA,
  YI_MA,
  JIANG_XING,
  HUA_GAI,
  JIE_SHA,
  WANG_SHEN,
  GU_CHEN_GUA_SU,
  TIAN_CHU,
  JIN_YU,
  GUO_YIN,
  XUE_TANG,
  CI_GUAN,
  YUE_DE_GUI_REN,
  getKongWang,
  TIAN_LUO_DI_WANG,
  // 新增神煞表
  KUI_GANG,
  TIAN_YI,
  HONG_LUAN,
  TIAN_XI,
  FEI_REN,
  XUE_REN,
  SHI_E_DA_BAI,
  YIN_YANG_CHA_CUO,
  SI_FEI,
  SAN_QI,
  LIU_XIA,
  SANG_MEN_DIAO_KE,
  BAI_HU,
  TIAN_GOU,
  FEI_LIAN,
} from '@/data/shensha';
import { TIAN_GAN_COMBINE } from '@/data/constants';

type Position = '年' | '月' | '日' | '時';

interface PillarInfo {
  position: Position;
  gan: TianGan;
  zhi: DiZhi;
}

/**
 * 分析八字盤中的所有神煞
 */
export function analyzeShenSha(chart: BaZiChart): ShenSha[] {
  const results: ShenSha[] = [];
  const dayGan = chart.day.gan;
  const yearZhi = chart.year.zhi;
  const monthZhi = chart.month.zhi;

  const pillars: PillarInfo[] = [
    { position: '年', gan: chart.year.gan, zhi: chart.year.zhi },
    { position: '月', gan: chart.month.gan, zhi: chart.month.zhi },
    { position: '日', gan: chart.day.gan, zhi: chart.day.zhi },
    { position: '時', gan: chart.hour.gan, zhi: chart.hour.zhi },
  ];

  const allZhi = pillars.map(p => p.zhi);

  // ========== 以日干查神煞 ==========

  // 天乙貴人
  const tianYiPositions = TIAN_YI_GUI_REN[dayGan];
  for (const pillar of pillars) {
    if (tianYiPositions.includes(pillar.zhi)) {
      results.push(createShenSha('天乙貴人', pillar.position));
    }
  }

  // 太極貴人
  const taiJiPositions = TAI_JI_GUI_REN[dayGan];
  for (const pillar of pillars) {
    if (taiJiPositions.includes(pillar.zhi)) {
      results.push(createShenSha('太極貴人', pillar.position));
    }
  }

  // 文昌貴人
  const wenChangZhi = WEN_CHANG_GUI_REN[dayGan];
  for (const pillar of pillars) {
    if (pillar.zhi === wenChangZhi) {
      results.push(createShenSha('文昌貴人', pillar.position));
    }
  }

  // 羊刃
  const yangRenZhi = YANG_REN[dayGan];
  for (const pillar of pillars) {
    if (pillar.zhi === yangRenZhi) {
      results.push(createShenSha('羊刃', pillar.position));
    }
  }

  // 祿神
  const luShenZhi = LU_SHEN[dayGan];
  for (const pillar of pillars) {
    if (pillar.zhi === luShenZhi) {
      results.push(createShenSha('祿神', pillar.position));
    }
  }

  // 天廚貴人
  const tianChuZhi = TIAN_CHU[dayGan];
  for (const pillar of pillars) {
    if (pillar.zhi === tianChuZhi) {
      results.push(createShenSha('天廚貴人', pillar.position));
    }
  }

  // 金輿
  const jinYuZhi = JIN_YU[dayGan];
  for (const pillar of pillars) {
    if (pillar.zhi === jinYuZhi) {
      results.push(createShenSha('金輿', pillar.position));
    }
  }

  // 國印貴人
  const guoYinZhi = GUO_YIN[dayGan];
  for (const pillar of pillars) {
    if (pillar.zhi === guoYinZhi) {
      results.push(createShenSha('國印貴人', pillar.position));
    }
  }

  // 學堂
  const xueTangZhi = XUE_TANG[dayGan];
  for (const pillar of pillars) {
    if (pillar.zhi === xueTangZhi) {
      results.push(createShenSha('學堂', pillar.position));
    }
  }

  // 詞館
  const ciGuanZhi = CI_GUAN[dayGan];
  for (const pillar of pillars) {
    if (pillar.zhi === ciGuanZhi) {
      results.push(createShenSha('詞館', pillar.position));
    }
  }

  // ========== 以年支或日支查神煞 ==========

  // 桃花（以年支和日支查）
  const taoHuaByYear = TAO_HUA[yearZhi];
  const taoHuaByDay = TAO_HUA[chart.day.zhi];
  for (const pillar of pillars) {
    if (pillar.zhi === taoHuaByYear || pillar.zhi === taoHuaByDay) {
      // 避免重複
      if (!results.some(r => r.name === '桃花' && r.position === pillar.position)) {
        results.push(createShenSha('桃花', pillar.position));
      }
    }
  }

  // 驛馬
  const yiMaByYear = YI_MA[yearZhi];
  const yiMaByDay = YI_MA[chart.day.zhi];
  for (const pillar of pillars) {
    if (pillar.zhi === yiMaByYear || pillar.zhi === yiMaByDay) {
      if (!results.some(r => r.name === '驛馬' && r.position === pillar.position)) {
        results.push(createShenSha('驛馬', pillar.position));
      }
    }
  }

  // 將星
  const jiangXingByYear = JIANG_XING[yearZhi];
  const jiangXingByDay = JIANG_XING[chart.day.zhi];
  for (const pillar of pillars) {
    if (pillar.zhi === jiangXingByYear || pillar.zhi === jiangXingByDay) {
      if (!results.some(r => r.name === '將星' && r.position === pillar.position)) {
        results.push(createShenSha('將星', pillar.position));
      }
    }
  }

  // 華蓋
  const huaGaiByYear = HUA_GAI[yearZhi];
  const huaGaiByDay = HUA_GAI[chart.day.zhi];
  for (const pillar of pillars) {
    if (pillar.zhi === huaGaiByYear || pillar.zhi === huaGaiByDay) {
      if (!results.some(r => r.name === '華蓋' && r.position === pillar.position)) {
        results.push(createShenSha('華蓋', pillar.position));
      }
    }
  }

  // 劫煞
  const jieShaByYear = JIE_SHA[yearZhi];
  const jieShaByDay = JIE_SHA[chart.day.zhi];
  for (const pillar of pillars) {
    if (pillar.zhi === jieShaByYear || pillar.zhi === jieShaByDay) {
      if (!results.some(r => r.name === '劫煞' && r.position === pillar.position)) {
        results.push(createShenSha('劫煞', pillar.position));
      }
    }
  }

  // 亡神
  const wangShenByYear = WANG_SHEN[yearZhi];
  const wangShenByDay = WANG_SHEN[chart.day.zhi];
  for (const pillar of pillars) {
    if (pillar.zhi === wangShenByYear || pillar.zhi === wangShenByDay) {
      if (!results.some(r => r.name === '亡神' && r.position === pillar.position)) {
        results.push(createShenSha('亡神', pillar.position));
      }
    }
  }

  // ========== 孤辰寡宿 ==========
  const guChenGuaSu = GU_CHEN_GUA_SU[yearZhi];
  for (const pillar of pillars) {
    if (pillar.zhi === guChenGuaSu.guChen) {
      results.push(createShenSha('孤辰', pillar.position));
    }
    if (pillar.zhi === guChenGuaSu.guaSu) {
      results.push(createShenSha('寡宿', pillar.position));
    }
  }

  // ========== 月德貴人（以月支查） ==========
  const yueDe = YUE_DE_GUI_REN[monthZhi];
  for (const pillar of pillars) {
    if (pillar.gan === yueDe) {
      results.push(createShenSha('月德貴人', pillar.position));
    }
  }

  // ========== 天羅地網 ==========
  for (const pillar of pillars) {
    if (TIAN_LUO_DI_WANG.tianLuo.includes(pillar.zhi)) {
      results.push(createShenSha('天羅', pillar.position));
    }
    if (TIAN_LUO_DI_WANG.diWang.includes(pillar.zhi)) {
      results.push(createShenSha('地網', pillar.position));
    }
  }

  // ========== 魁罡（以日柱查） ==========
  const dayGanZhi = chart.day.gan + chart.day.zhi;
  if (KUI_GANG.includes(dayGanZhi)) {
    results.push(createShenSha('魁罡', '日'));
  }

  // ========== 天醫（以月支查） ==========
  const tianYiZhi = TIAN_YI[monthZhi];
  for (const pillar of pillars) {
    if (pillar.zhi === tianYiZhi) {
      results.push(createShenSha('天醫', pillar.position));
    }
  }

  // ========== 紅鸞天喜（以年支查） ==========
  const hongLuanZhi = HONG_LUAN[yearZhi];
  const tianXiZhi = TIAN_XI[yearZhi];
  for (const pillar of pillars) {
    if (pillar.zhi === hongLuanZhi) {
      results.push(createShenSha('紅鸞', pillar.position));
    }
    if (pillar.zhi === tianXiZhi) {
      results.push(createShenSha('天喜', pillar.position));
    }
  }

  // ========== 飛刃（以日干查） ==========
  const feiRenZhi = FEI_REN[dayGan];
  for (const pillar of pillars) {
    if (pillar.zhi === feiRenZhi) {
      results.push(createShenSha('飛刃', pillar.position));
    }
  }

  // ========== 血刃（以月支查） ==========
  const xueRenZhi = XUE_REN[monthZhi];
  for (const pillar of pillars) {
    if (pillar.zhi === xueRenZhi) {
      results.push(createShenSha('血刃', pillar.position));
    }
  }

  // ========== 十惡大敗（以日柱查） ==========
  if (SHI_E_DA_BAI.includes(dayGanZhi)) {
    results.push(createShenSha('十惡大敗', '日'));
  }

  // ========== 陰陽差錯（以日柱查） ==========
  if (YIN_YANG_CHA_CUO.includes(dayGanZhi)) {
    results.push(createShenSha('陰陽差錯', '日'));
  }

  // ========== 四廢（以月令配合日柱查） ==========
  const seasonMap: Record<DiZhi, string> = {
    '寅': '春', '卯': '春', '辰': '春',
    '巳': '夏', '午': '夏', '未': '夏',
    '申': '秋', '酉': '秋', '戌': '秋',
    '亥': '冬', '子': '冬', '丑': '冬',
  };
  const currentSeason = seasonMap[monthZhi];
  if (SI_FEI[currentSeason]?.includes(dayGanZhi)) {
    results.push(createShenSha('四廢', '日'));
  }

  // ========== 三奇貴人（天三奇或地三奇連續排列） ==========
  const allGan = pillars.map(p => p.gan);
  const ganStr = allGan.join('');
  if (ganStr.includes('甲戊庚') || ganStr.includes('乙丙丁')) {
    results.push(createShenSha('三奇貴人', '日'));
  }

  // ========== 流霞（以日干查） ==========
  const liuXiaZhi = LIU_XIA[dayGan];
  for (const pillar of pillars) {
    if (pillar.zhi === liuXiaZhi) {
      results.push(createShenSha('流霞', pillar.position));
    }
  }

  // ========== 喪門弔客（以年支查） ==========
  const sangMenDiaoKe = SANG_MEN_DIAO_KE[yearZhi];
  for (const pillar of pillars) {
    if (pillar.zhi === sangMenDiaoKe.sangMen) {
      results.push(createShenSha('喪門', pillar.position));
    }
    if (pillar.zhi === sangMenDiaoKe.diaoKe) {
      results.push(createShenSha('弔客', pillar.position));
    }
  }

  // ========== 白虎（以年支查） ==========
  const baiHuZhi = BAI_HU[yearZhi];
  for (const pillar of pillars) {
    if (pillar.zhi === baiHuZhi) {
      results.push(createShenSha('白虎', pillar.position));
    }
  }

  // ========== 天狗（以年支查） ==========
  const tianGouZhi = TIAN_GOU[yearZhi];
  for (const pillar of pillars) {
    if (pillar.zhi === tianGouZhi) {
      results.push(createShenSha('天狗', pillar.position));
    }
  }

  // ========== 飛廉（以年支查） ==========
  const feiLianZhi = FEI_LIAN[yearZhi];
  for (const pillar of pillars) {
    if (pillar.zhi === feiLianZhi) {
      results.push(createShenSha('飛廉', pillar.position));
    }
  }

  // 排序：吉神在前，凶煞在後
  results.sort((a, b) => {
    const typeOrder = { auspicious: 0, neutral: 1, inauspicious: 2 };
    return typeOrder[a.type] - typeOrder[b.type];
  });

  return results;
}

/**
 * 創建神煞物件
 */
function createShenSha(name: string, position: Position): ShenSha {
  const info = SHEN_SHA_INFO[name];
  if (!info) {
    return {
      name,
      type: 'neutral',
      position,
      category: '未分類',
      description: '',
      effect: '',
      advice: '',
    };
  }

  return {
    name: info.name,
    type: info.type,
    position,
    category: info.category,
    description: info.description,
    effect: info.effect,
    advice: info.advice,
  };
}

/**
 * 分析空亡
 */
export function analyzeKongWang(chart: BaZiChart): KongWang {
  // 以日柱查空亡
  const dayKong = getKongWang(chart.day.gan, chart.day.zhi);
  // 以年柱查空亡
  const yearKong = getKongWang(chart.year.gan, chart.year.zhi);

  const pillars: { position: Position; zhi: DiZhi }[] = [
    { position: '年', zhi: chart.year.zhi },
    { position: '月', zhi: chart.month.zhi },
    { position: '日', zhi: chart.day.zhi },
    { position: '時', zhi: chart.hour.zhi },
  ];

  const affectedPositions = pillars.map(p => ({
    position: p.position,
    zhi: p.zhi,
    isKong: dayKong.includes(p.zhi),
  }));

  return {
    dayKong,
    yearKong,
    affectedPositions,
  };
}

/**
 * 分析天干合化
 */
export function analyzeGanHe(chart: BaZiChart): GanHe[] {
  const results: GanHe[] = [];

  const pillars: { position: Position; gan: TianGan; zhi: DiZhi }[] = [
    { position: '年', gan: chart.year.gan, zhi: chart.year.zhi },
    { position: '月', gan: chart.month.gan, zhi: chart.month.zhi },
    { position: '日', gan: chart.day.gan, zhi: chart.day.zhi },
    { position: '時', gan: chart.hour.gan, zhi: chart.hour.zhi },
  ];

  // 檢查相鄰天干是否有合
  for (let i = 0; i < pillars.length - 1; i++) {
    const current = pillars[i];
    const next = pillars[i + 1];

    for (const [gan1, gan2, huaElement] of TIAN_GAN_COMBINE) {
      if (
        (current.gan === gan1 && next.gan === gan2) ||
        (current.gan === gan2 && next.gan === gan1)
      ) {
        // 判斷是否化成（需要月令配合）
        const isHua = checkHuaCondition(chart.month.zhi, huaElement);

        results.push({
          gan1: current.gan,
          gan2: next.gan,
          position1: current.position,
          position2: next.position,
          huaElement,
          isHua,
          description: isHua
            ? `${current.gan}${next.gan}相合，化${huaElement}成功，增強${huaElement}氣。`
            : `${current.gan}${next.gan}相合，但月令不助化${huaElement}，合而不化，減弱雙方力量。`,
        });
      }
    }
  }

  return results;
}

/**
 * 檢查合化條件（簡化版）
 * 合化需要月令配合
 */
function checkHuaCondition(monthZhi: DiZhi, huaElement: WuXing): boolean {
  // 五行對應的旺月
  const elementSeasons: Record<WuXing, DiZhi[]> = {
    '木': ['寅', '卯'],
    '火': ['巳', '午'],
    '土': ['辰', '戌', '丑', '未'],
    '金': ['申', '酉'],
    '水': ['亥', '子'],
  };

  return elementSeasons[huaElement].includes(monthZhi);
}

/**
 * 獲取神煞統計摘要
 */
export function getShenShaSummary(shenSha: ShenSha[]): {
  auspicious: ShenSha[];
  inauspicious: ShenSha[];
  neutral: ShenSha[];
  summary: string;
} {
  const auspicious = shenSha.filter(s => s.type === 'auspicious');
  const inauspicious = shenSha.filter(s => s.type === 'inauspicious');
  const neutral = shenSha.filter(s => s.type === 'neutral');

  let summary = '';

  if (auspicious.length > inauspicious.length) {
    summary = '命中吉神較多，一生多有貴人相助，逢凶化吉的能力強。';
  } else if (inauspicious.length > auspicious.length) {
    summary = '命中凶煞較多，人生多有波折，但只要謹慎行事，亦可化險為夷。';
  } else {
    summary = '命中吉凶參半，人生起伏正常，把握機會、趨吉避凶為上策。';
  }

  // 特殊組合判斷
  const hasGuiRen = auspicious.some(s => s.name.includes('貴人'));
  const hasYangRen = inauspicious.some(s => s.name === '羊刃');
  const hasTaoHua = neutral.some(s => s.name === '桃花');

  if (hasGuiRen) {
    summary += '命帶貴人，關鍵時刻多有貴人扶持。';
  }
  if (hasYangRen) {
    summary += '羊刃入命，性格剛強，需修身養性。';
  }
  if (hasTaoHua) {
    summary += '桃花入命，異性緣佳，需慎防情感困擾。';
  }

  return { auspicious, inauspicious, neutral, summary };
}

/**
 * 獲取空亡解讀
 */
export function getKongWangDescription(kongWang: KongWang): string {
  const kongPositions = kongWang.affectedPositions.filter(p => p.isKong);

  if (kongPositions.length === 0) {
    return '四柱無空亡，六親宮位皆實，整體穩定。';
  }

  const descriptions: string[] = [];

  for (const pos of kongPositions) {
    switch (pos.position) {
      case '年':
        descriptions.push('年柱空亡，與祖輩緣分較淺，或早年離鄉。');
        break;
      case '月':
        descriptions.push('月柱空亡，與父母或兄弟姐妹緣分較淺。');
        break;
      case '時':
        descriptions.push('時柱空亡，與子女緣分較淺，或晚年較清靜。');
        break;
    }
  }

  return descriptions.join('');
}
