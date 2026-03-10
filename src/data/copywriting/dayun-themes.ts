/**
 * 大運主題描述
 * 供 DaYunTab 與 FortuneTab 共用
 */

import type { ShiShen } from '@/lib/bazi/types';

export interface DaYunTheme {
  theme: string;
  focus: string;
  opportunity: string;
  risk: string;
}

export const DAYUN_THEMES: Record<ShiShen, DaYunTheme> = {
  比肩: {
    theme: '自我成長期',
    focus: '個人能力提升、獨立發展',
    opportunity: '創業、自主事業、技能精進',
    risk: '競爭壓力、獨斷固執',
  },
  劫財: {
    theme: '競爭突破期',
    focus: '把握機會、拓展人脈',
    opportunity: '投資機會、合作項目、社交拓展',
    risk: '財務風險、衝動決策',
  },
  食神: {
    theme: '才華展現期',
    focus: '創意發揮、享受生活',
    opportunity: '藝術創作、教學分享、品牌建立',
    risk: '過於安逸、缺乏目標',
  },
  傷官: {
    theme: '創新突破期',
    focus: '打破框架、技術創新',
    opportunity: '專利發明、技術突破、個人品牌',
    risk: '人際衝突、口舌是非',
  },
  偏財: {
    theme: '財運活絡期',
    focus: '商業機會、投資理財',
    opportunity: '副業發展、投資收益、人脈變現',
    risk: '財來財去、感情複雜',
  },
  正財: {
    theme: '穩健積累期',
    focus: '穩定收入、財富累積',
    opportunity: '薪資成長、儲蓄投資、家庭建設',
    risk: '過於保守、錯失機會',
  },
  七殺: {
    theme: '權力挑戰期',
    focus: '事業突破、領導力',
    opportunity: '升遷機會、權力擴張、競爭勝出',
    risk: '壓力過大、健康問題',
  },
  正官: {
    theme: '穩定發展期',
    focus: '名譽地位、事業穩定',
    opportunity: '升職加薪、社會認可、穩定發展',
    risk: '壓力內化、過於拘謹',
  },
  偏印: {
    theme: '學習轉型期',
    focus: '進修學習、思維轉變',
    opportunity: '專業深造、特殊領域、研究成果',
    risk: '孤獨感、方向迷失',
  },
  正印: {
    theme: '貴人相助期',
    focus: '學業進步、貴人提攜',
    opportunity: '學歷提升、貴人助力、智慧增長',
    risk: '依賴他人、行動力不足',
  },
};
