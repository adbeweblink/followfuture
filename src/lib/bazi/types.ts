/**
 * 八字命理系統 - 型別定義
 */

// ========== 基礎型別 ==========

/** 十天干 */
export type TianGan = '甲' | '乙' | '丙' | '丁' | '戊' | '己' | '庚' | '辛' | '壬' | '癸';

/** 十二地支 */
export type DiZhi = '子' | '丑' | '寅' | '卯' | '辰' | '巳' | '午' | '未' | '申' | '酉' | '戌' | '亥';

/** 五行 */
export type WuXing = '木' | '火' | '土' | '金' | '水';

/** 陰陽 */
export type YinYang = '陰' | '陽';

/** 十神 */
export type ShiShen =
  | '比肩' | '劫財'   // 同我
  | '食神' | '傷官'   // 我生
  | '偏財' | '正財'   // 我剋
  | '七殺' | '正官'   // 剋我
  | '偏印' | '正印';  // 生我

/** 性別 */
export type Gender = '男' | '女';

// ========== 結構型別 ==========

/** 藏干資訊（含權重和十神） */
export interface HiddenStem {
  gan: TianGan;           // 藏干天干
  weight: number;         // 權重 (0-1)
  shiShen?: ShiShen;      // 十神（相對日主）
}

/** 單柱（天干+地支） */
export interface Pillar {
  gan: TianGan;           // 天干
  zhi: DiZhi;             // 地支
  ganElement: WuXing;     // 天干五行
  zhiElement: WuXing;     // 地支五行
  ganYinYang: YinYang;    // 天干陰陽
  zhiYinYang: YinYang;    // 地支陰陰
  hiddenStems: HiddenStem[]; // 地支藏干（含權重和十神）
  ganShiShen?: ShiShen;   // 天干十神（相對日主）
  naYin?: string;         // 納音
}

/** 四柱八字 */
export interface BaZiChart {
  year: Pillar;    // 年柱
  month: Pillar;   // 月柱
  day: Pillar;     // 日柱（日主）
  hour: Pillar;    // 時柱
}

/** 五行統計 */
export interface WuXingStats {
  木: number;
  火: number;
  土: number;
  金: number;
  水: number;
}

/** 身強身弱判定結果 */
export interface StrengthAnalysis {
  deLing: boolean;        // 得令（月令生扶）
  deDi: boolean;          // 得地（地支通根）
  deDiScore: number;      // 得地分數
  deShi: boolean;         // 得勢（印比數量）
  score: number;          // 強度分數 0-100
  verdict: '身極強' | '身強' | '身旺' | '中和' | '身弱' | '身衰' | '身極弱';
  reason: string[];       // 判定原因
}

/** 地支關係 */
export interface BranchRelation {
  type: '六合' | '三合' | '半合' | '三會' | '六沖' | '三刑' | '六害' | '暗合' | '自刑';
  branches: DiZhi[];
  positions: ('年' | '月' | '日' | '時')[];
  result?: WuXing;        // 合化結果
  description: string;
}

/** 格局 */
export interface Pattern {
  name: string;           // 格局名稱
  type: '正格' | '從格' | '專旺格' | '雜格';
  status: '成格' | '破格' | '假格';
  description: string;
  keyGod?: ShiShen;       // 格局用神
}

/** 大運 */
export interface LuckPillar {
  ganZhi: string;         // 干支
  ageStart: number;       // 起始年齡
  ageEnd: number;         // 結束年齡
  element: WuXing;        // 主要五行
  tenGod: ShiShen;        // 十神
  score: number;          // 運勢評分
  theme: string;          // 運勢主題
}

/** 流年 */
export interface AnnualFortune {
  year: number;           // 西元年
  ganZhi: string;         // 干支
  theme: string;          // 年度主題
  score: number;          // 運勢評分
  coreStrategy: string;   // 核心策略
}

/** 流月 */
export interface MonthlyFortune {
  month: number;          // 農曆月份
  ganZhi: string;         // 干支
  solarRange: string;     // 陽曆範圍
  score: number;          // 運勢評分
  status: 'green' | 'yellow' | 'red';
  title: string;          // 月份主題
  description: string;
  advice: string;
}

/** 神煞 */
export interface ShenSha {
  name: string;           // 神煞名稱
  type: 'auspicious' | 'inauspicious' | 'neutral';  // 吉/凶/中性
  position: '年' | '月' | '日' | '時';  // 出現位置
  category: string;       // 分類
  description: string;    // 說明
  effect: string;         // 影響
  advice: string;         // 建議
}

/** 空亡資訊 */
export interface KongWang {
  dayKong: DiZhi[];       // 日柱空亡
  yearKong: DiZhi[];      // 年柱空亡
  affectedPositions: {
    position: '年' | '月' | '日' | '時';
    zhi: DiZhi;
    isKong: boolean;
  }[];
}

/** 天干合化 */
export interface GanHe {
  gan1: TianGan;
  gan2: TianGan;
  position1: '年' | '月' | '日' | '時';
  position2: '年' | '月' | '日' | '時';
  huaElement: WuXing;     // 合化五行
  isHua: boolean;         // 是否化成
  description: string;
}

/** 氣候狀態 */
export type ClimateState = '寒' | '熱' | '燥' | '濕' | '寒濕' | '燥熱' | '中和';

/** 調候用神（完整版） */
export interface TiaoHouAnalysis {
  /** 月令氣候 */
  climate: ClimateState;
  /** 氣候程度（0-100，越高越極端） */
  climateIntensity: number;
  /** 調候用神（最需要的五行） */
  tiaoHouShen: WuXing[];
  /** 調候忌神（最忌諱的五行） */
  tiaoHouJi: WuXing[];
  /** 是否急需調候 */
  isUrgent: boolean;
  /** 命局已有的調候力量 */
  existingTiaoHou: {
    element: WuXing;
    count: number;
    positions: string[];
  }[];
  /** 調候是否充足 */
  isSufficient: boolean;
  /** 調候評分（0-100） */
  score: number;
  /** 詳細說明 */
  description: string;
  /** 建議 */
  advice: string[];
}

/** 用神力量評估 */
export interface UshenStrength {
  element: WuXing;        // 用神五行
  strength: '有力' | '中等' | '無力';
  factors: string[];      // 判定因素
}

/** 喜用神深度分析 */
export interface PreferenceAnalysis {
  favorable: WuXing[];    // 喜用神（依優先級排序）
  unfavorable: WuXing[];  // 忌神
  tiaoHou?: TiaoHouAnalysis;  // 調候用神
  ushenStrength: UshenStrength;  // 用神力量
  description: string;    // 詳細說明
  method: '扶抑法' | '從勢法' | '專旺法' | '調候法';  // 分析方法
}

/** 大運詳細分析 */
export interface LuckPillarAnalysis {
  ganZhi: string;
  gan: TianGan;
  zhi: DiZhi;
  ganElement: WuXing;
  zhiElement: WuXing;
  ganTenGod: ShiShen;
  zhiTenGod: ShiShen;
  ageStart: number;
  ageEnd: number;
  favorableMatch: {
    gan: boolean;
    zhi: boolean;
    score: number;
  };
  theme: string;
  description: string;
  cautions: string[];
}

/** 大運流年交互 */
export interface LuckYearInteraction {
  luckPillar: LuckPillarAnalysis;
  year: number;
  yearGanZhi: string;
  yearGan: TianGan;
  yearZhi: DiZhi;
  ganInteraction: {
    type: '合' | '沖' | '生' | '剋' | '同' | '無';
    description: string;
    impact: 'positive' | 'negative' | 'neutral';
  };
  zhiInteraction: {
    types: ('沖' | '合' | '刑' | '害' | '破' | '無')[];
    description: string;
    impact: 'positive' | 'negative' | 'neutral';
  };
  chartInteraction: {
    fuYin: boolean;
    fanYin: boolean;
    description: string;
  };
  score: number;
  theme: string;
  advice: string;
}

// ========== 分析結果 ==========

/** 健康分析 */
export interface HealthAnalysis {
  element: WuXing;
  status: string;
  organs: string;
  risk: string;
  advice: string;
  severity: 'low' | 'medium' | 'high';
}

/** 職涯分析 */
export interface CareerAnalysis {
  strategy: string;
  description: string;
  suitableIndustries: {
    element: WuXing;
    jobs: string;
    reason: string;
  }[];
  roles: {
    title: string;
    description: string;
  }[];
}

/** 感情婚姻分析 */
export interface RelationshipAnalysis {
  spousePalace: {
    position: DiZhi;
    element: WuXing;
    traits: { personality: string; appearance: string; relationship: string };
    analysis: string;
  };
  spouseStar: {
    primary: ShiShen;
    secondary: ShiShen;
    count: number;
    status: string;
    advice: string;
  };
  peachBlossom: {
    hasPeachBlossom: boolean;
    positions: ('年' | '月' | '日' | '時')[];
    analysis: string;
  };
  hongLuanTianXi: {
    hasHongLuan: boolean;
    hasTianXi: boolean;
    analysis: string;
  };
  marriageTiming: string;
  overallAdvice: string;
}

/** 六親單柱分析 */
export interface LiuQinPillarAnalysis {
  position: '年' | '月' | '日' | '時';
  palace: {
    position: '年' | '月' | '日' | '時';
    upperPalace: string;
    lowerPalace: string;
    lifeStage: string;
    ageRange: string;
  };
  ganTenGod: ShiShen;
  zhiTenGod: ShiShen;
  ganLiuQin: string[];
  zhiLiuQin: string[];
  analysis: string;
  advice: string;
}

/** 完整六親報告 */
export interface FullLiuQinReport {
  year: LiuQinPillarAnalysis;
  month: LiuQinPillarAnalysis;
  day: LiuQinPillarAnalysis;
  hour: LiuQinPillarAnalysis;
  fatherAnalysis: string;
  motherAnalysis: string;
  spouseAnalysis: string;
  childrenAnalysis: string;
  summary: string;
}

/** 健康報告 */
export interface HealthReport {
  summary: string;
  analyses: HealthAnalysis[];
  constitution: string;
  seasonalAdvice: string[];
}

/** 完整解盤結果 */
export interface BaZiAnalysis {
  // 基本資訊
  basic: {
    name?: string;
    gender: Gender;
    birthDate: Date;
    birthPlace?: string;
  };

  // 八字盤
  chart: BaZiChart;

  // 五行統計
  wuXing: WuXingStats;
  wuXingPercentage: WuXingStats;

  // 身強身弱
  strength: StrengthAnalysis;

  // 格局
  pattern: Pattern;

  // 地支關係
  branchRelations: BranchRelation[];

  // 用神喜忌（基礎版）
  favorable: WuXing[];    // 喜用神
  unfavorable: WuXing[];  // 忌神

  // 用神喜忌（深度分析版）
  preferenceAnalysis?: PreferenceAnalysis;

  // 調候用神分析
  tiaoHouAnalysis?: TiaoHouAnalysis;

  // 大運
  luckPillars: LuckPillar[];
  currentLuckPillar?: LuckPillar;

  // 大運詳細分析
  luckPillarAnalysis?: LuckPillarAnalysis[];
  currentLuckPillarAnalysis?: LuckPillarAnalysis;

  // 大運流年交互
  luckYearInteractions?: LuckYearInteraction[];

  // 健康
  health: HealthAnalysis[];

  // 職涯
  career: CareerAnalysis;

  // 感情婚姻
  relationship?: RelationshipAnalysis;

  // 六親
  liuQin?: FullLiuQinReport;

  // 健康報告
  healthReport?: HealthReport;

  // 流年（可選）
  annualFortune?: AnnualFortune;
  monthlyFortunes?: MonthlyFortune[];

  // 神煞
  shenSha?: ShenSha[];

  // 空亡
  kongWang?: KongWang;

  // 天干合化
  ganHe?: GanHe[];
}

/** 輸入參數 */
export interface BirthInput {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute?: number;
  gender: Gender;
  name?: string;
  timezone?: string;
}
