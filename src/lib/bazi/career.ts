/**
 * 八字命理系統 - 職業事業分析模組
 * 行業推薦、財官印分析、十神職業傾向
 */

import type {
  BaZiChart,
  WuXing,
  ShiShen,
  Pattern,
  StrengthAnalysis,
  CareerAnalysis,
  Gender,
} from './types';
import { countTenGods } from './ten-gods';

// ========== 五行行業對應表 ==========

/** 五行對應行業 */
export const WUXING_INDUSTRIES: Record<WuXing, {
  categories: string[];
  jobs: string[];
  traits: string;
}> = {
  木: {
    categories: ['教育文化', '醫療健康', '農林環保', '服飾紡織'],
    jobs: [
      '教師、教授、講師',
      '醫生、中醫師、藥劑師',
      '作家、編輯、記者',
      '園藝師、農業專家',
      '服裝設計師、造型師',
      '社工、心理諮詢師',
    ],
    traits: '適合需要成長、創意、人文關懷的工作',
  },
  火: {
    categories: ['科技電子', '餐飲娛樂', '傳媒廣告', '能源電力'],
    jobs: [
      '工程師、程式設計師',
      '廚師、餐廳經營者',
      '演員、主持人、網紅',
      '廣告創意、行銷企劃',
      '攝影師、影視製作',
      '電力工程、新能源',
    ],
    traits: '適合需要熱情、表現力、快速反應的工作',
  },
  土: {
    categories: ['房地產建築', '農業畜牧', '金融保險', '人事行政'],
    jobs: [
      '建築師、室內設計師',
      '房地產經紀、物業管理',
      '會計師、審計師',
      '人力資源、行政管理',
      '保險業務、理財規劃',
      '倉儲物流、供應鏈',
    ],
    traits: '適合需要穩定、誠信、務實的工作',
  },
  金: {
    categories: ['金融投資', '法律司法', '機械製造', '軍警安保'],
    jobs: [
      '銀行家、投資經理',
      '律師、法官、檢察官',
      '機械工程師、技師',
      '珠寶設計、鐘錶業',
      '軍人、警察、保安',
      '外科醫生、牙醫',
    ],
    traits: '適合需要決斷力、精確度、權威性的工作',
  },
  水: {
    categories: ['貿易物流', '旅遊交通', '水利航運', '服務諮詢'],
    jobs: [
      '國際貿易、進出口',
      '導遊、旅行社、飯店',
      '航運、船務、漁業',
      '顧問、諮詢師',
      '業務銷售、公關',
      '酒水飲料、清潔業',
    ],
    traits: '適合需要靈活、流動、溝通協調的工作',
  },
};

// ========== 十神職業傾向 ==========

/** 十神職業特質 */
export const TEN_GOD_CAREER: Record<ShiShen, {
  style: string;
  strengths: string[];
  suitableRoles: string[];
  challenges: string;
}> = {
  比肩: {
    style: '獨立自主型',
    strengths: ['獨立作業能力強', '競爭意識強', '技術專精'],
    suitableRoles: ['自由職業者', '技術專家', '獨立創業者', '顧問'],
    challenges: '需注意團隊合作，避免單打獨鬥',
  },
  劫財: {
    style: '積極進取型',
    strengths: ['開拓能力強', '社交廣泛', '敢於冒險'],
    suitableRoles: ['業務開發', '市場拓展', '投資人', '合夥人'],
    challenges: '需控制風險意識，謹慎理財',
  },
  食神: {
    style: '創意表現型',
    strengths: ['創造力豐富', '表達能力強', '藝術天賦'],
    suitableRoles: ['藝術家', '設計師', '老師', '美食家', '創作者'],
    challenges: '需增加行動力，將創意落實',
  },
  傷官: {
    style: '創新突破型',
    strengths: ['創新能力強', '技術精湛', '追求卓越'],
    suitableRoles: ['研發工程師', '發明家', '評論家', '改革者'],
    challenges: '需收斂鋒芒，學會圓融處世',
  },
  偏財: {
    style: '商業經營型',
    strengths: ['商業嗅覺敏銳', '人脈廣泛', '投資眼光'],
    suitableRoles: ['企業家', '投資者', '銷售總監', '商人'],
    challenges: '需穩健經營，避免投機',
  },
  正財: {
    style: '穩健務實型',
    strengths: ['理財能力強', '誠實守信', '穩定可靠'],
    suitableRoles: ['財務經理', '會計師', '銀行職員', '採購'],
    challenges: '可適度擴大格局，把握機會',
  },
  七殺: {
    style: '領導威權型',
    strengths: ['決策果斷', '抗壓力強', '執行力強'],
    suitableRoles: ['高管', '軍警', '外科醫生', '運動員', '創業家'],
    challenges: '需柔和處事，關注團隊氛圍',
  },
  正官: {
    style: '管理規範型',
    strengths: ['組織能力強', '守規矩', '有責任感'],
    suitableRoles: ['公務員', '管理層', '法律工作者', '行政主管'],
    challenges: '可增加靈活度，適應變化',
  },
  偏印: {
    style: '研究學術型',
    strengths: ['思維獨特', '研究能力強', '善於學習'],
    suitableRoles: ['研究員', '學者', '程式設計師', '哲學家', '神秘學'],
    challenges: '需增加社交，避免過度封閉',
  },
  正印: {
    style: '教育傳承型',
    strengths: ['學習能力強', '善於教導', '受人信任'],
    suitableRoles: ['教育者', '顧問', '醫療人員', '宗教人士'],
    challenges: '需提升魄力，勇於決斷',
  },
};

// ========== 格局職業方向 ==========

/** 格局對應職業方向 */
const PATTERN_CAREER: Record<string, {
  direction: string;
  industries: string[];
  advice: string;
}> = {
  正官格: {
    direction: '適合穩定體制內發展',
    industries: ['公職', '國企', '大型企業管理層', '法律'],
    advice: '循序漸進，重視名譽，適合走管理路線。',
  },
  七殺格: {
    direction: '適合挑戰性強的領域',
    industries: ['創業', '軍警', '外科', '競技運動', '高壓管理'],
    advice: '發揮魄力，勇於突破，適合擔任開創性角色。',
  },
  正財格: {
    direction: '適合穩健理財相關',
    industries: ['金融', '會計', '財務管理', '銀行', '穩定企業'],
    advice: '重視積累，穩紮穩打，財運靠勤勞獲得。',
  },
  偏財格: {
    direction: '適合商業投資領域',
    industries: ['貿易', '投資', '創業', '銷售', '自營事業'],
    advice: '發揮商業頭腦，但需控制風險，忌投機。',
  },
  正印格: {
    direction: '適合文教學術領域',
    industries: ['教育', '學術研究', '出版', '醫療', '宗教'],
    advice: '修身養性，以德服人，適合教育傳承工作。',
  },
  偏印格: {
    direction: '適合專業技術領域',
    industries: ['技術研發', 'IT', '中醫', '神秘學', '獨特專業'],
    advice: '深耕專業領域，發展獨特技能，走專家路線。',
  },
  食神格: {
    direction: '適合創意表演領域',
    industries: ['藝術', '餐飲', '教學', '設計', '娛樂'],
    advice: '發揮創造力，享受工作過程，適合自由發揮的環境。',
  },
  傷官格: {
    direction: '適合技術創新領域',
    industries: ['科技研發', '專利發明', '藝術創作', '改革工作'],
    advice: '發揮創新能力，但需學會圓融，與人合作。',
  },
  建祿格: {
    direction: '適合獨立創業',
    industries: ['自營事業', '專業服務', '技術顧問', '個人品牌'],
    advice: '依靠自身能力，獨立發展，不宜過度依賴他人。',
  },
  月刃格: {
    direction: '適合競爭性行業',
    industries: ['銷售', '業務拓展', '運動競技', '投資'],
    advice: '發揮競爭優勢，但需控制衝動，謹慎理財。',
  },
  從財格: {
    direction: '以財為重心發展',
    industries: ['商業經營', '投資理財', '貿易', '金融'],
    advice: '順應財運，大膽經營，財來財往皆自然。',
  },
  從官殺格: {
    direction: '以權力地位為目標',
    industries: ['政治', '高管', '領導職位', '權力機構'],
    advice: '順應大勢，借力使力，適合依附大機構發展。',
  },
  從兒格: {
    direction: '以創意才藝為主',
    industries: ['藝術創作', '教育培訓', '媒體娛樂'],
    advice: '發揮才華，以技藝服人，適合自由發展。',
  },
};

// ========== 分析函數 ==========

/**
 * 分析財官印配置
 */
function analyzeFinanceOfficeSeal(
  chart: BaZiChart,
  strength: StrengthAnalysis
): {
  finance: { status: string; advice: string };
  office: { status: string; advice: string };
  seal: { status: string; advice: string };
} {
  const tenGodCount = countTenGods(chart);

  // 財星（正財、偏財）
  const financeCount = tenGodCount.正財 + tenGodCount.偏財;
  let financeStatus: string;
  let financeAdvice: string;

  if (financeCount === 0) {
    financeStatus = '財星缺乏';
    financeAdvice = '財運需靠自身努力，宜從事技術或服務業，不宜大規模投資。';
  } else if (financeCount >= 3) {
    financeStatus = '財星旺盛';
    if (strength.verdict.includes('弱')) {
      financeAdvice = '財多身弱，見財不能得，宜先強化自身能力再求財。';
    } else {
      financeAdvice = '財運亨通，可大膽經營，適合商業投資。';
    }
  } else {
    financeStatus = '財星適中';
    financeAdvice = '財運平穩，勤勞致富，穩健理財為上。';
  }

  // 官星（正官、七殺）
  const officeCount = tenGodCount.正官 + tenGodCount.七殺;
  let officeStatus: string;
  let officeAdvice: string;

  if (officeCount === 0) {
    officeStatus = '官星缺乏';
    officeAdvice = '不宜追求體制內職位，適合自由業或創業。';
  } else if (officeCount >= 3) {
    officeStatus = '官殺旺盛';
    if (strength.verdict.includes('弱')) {
      officeAdvice = '官殺太重壓力大，宜選擇較輕鬆的工作環境。';
    } else {
      officeAdvice = '適合管理職位，可往領導方向發展。';
    }
  } else {
    officeStatus = '官星適中';
    officeAdvice = '可在體制內穩定發展，也可自立門戶。';
  }

  // 印星（正印、偏印）
  const sealCount = tenGodCount.正印 + tenGodCount.偏印;
  let sealStatus: string;
  let sealAdvice: string;

  if (sealCount === 0) {
    sealStatus = '印星缺乏';
    sealAdvice = '學歷或證照助力較弱，宜靠實力和經驗累積。';
  } else if (sealCount >= 3) {
    sealStatus = '印星旺盛';
    sealAdvice = '適合學術研究、教育、或需要專業證照的工作。';
  } else {
    sealStatus = '印星適中';
    sealAdvice = '可透過進修提升，學歷證照能加分。';
  }

  return {
    finance: { status: financeStatus, advice: financeAdvice },
    office: { status: officeStatus, advice: officeAdvice },
    seal: { status: sealStatus, advice: sealAdvice },
  };
}

/**
 * 獲取主要十神（出現最多的十神）
 */
function getDominantTenGod(chart: BaZiChart): ShiShen {
  const tenGodCount = countTenGods(chart);
  let maxCount = 0;
  let dominantGod: ShiShen = '比肩';

  for (const [god, count] of Object.entries(tenGodCount)) {
    if (count > maxCount) {
      maxCount = count;
      dominantGod = god as ShiShen;
    }
  }

  return dominantGod;
}

/**
 * 生成職業策略
 */
function generateCareerStrategy(
  pattern: Pattern,
  strength: StrengthAnalysis,
  dominantGod: ShiShen
): string {
  const patternCareer = PATTERN_CAREER[pattern.name];
  const godCareer = TEN_GOD_CAREER[dominantGod];

  if (patternCareer) {
    return `${patternCareer.direction}。${patternCareer.advice}`;
  }

  // 根據身強身弱給建議
  if (strength.verdict.includes('強')) {
    return `身旺有力，適合獨當一面，可往${godCareer.style}發展。${godCareer.challenges}`;
  } else if (strength.verdict.includes('弱')) {
    return `身弱需借力，適合依附大平台發展，選擇壓力較小的環境。${godCareer.challenges}`;
  }

  return `中和之局，可隨心選擇，發揮${godCareer.style}特質。${godCareer.challenges}`;
}

/**
 * 分析職業事業
 */
export function analyzeCareer(
  chart: BaZiChart,
  pattern: Pattern,
  strength: StrengthAnalysis,
  favorable: WuXing[],
  gender: Gender
): CareerAnalysis {
  const dominantGod = getDominantTenGod(chart);
  const godCareer = TEN_GOD_CAREER[dominantGod];
  const fosAnalysis = analyzeFinanceOfficeSeal(chart, strength);

  // 職業策略
  const strategy = generateCareerStrategy(pattern, strength, dominantGod);

  // 詳細描述
  const description = `
命主${dominantGod}特質明顯，屬於${godCareer.style}人才。
${godCareer.strengths.join('、')}是您的職場優勢。
${fosAnalysis.finance.advice}
${fosAnalysis.office.advice}
${fosAnalysis.seal.advice}
`.trim();

  // 適合行業（根據喜用神）
  const suitableIndustries = favorable.slice(0, 2).map(element => ({
    element,
    jobs: WUXING_INDUSTRIES[element].jobs.slice(0, 3).join('、'),
    reason: WUXING_INDUSTRIES[element].traits,
  }));

  // 適合角色
  const roles = [
    {
      title: godCareer.suitableRoles[0],
      description: `最適合的角色，發揮${dominantGod}特質`,
    },
    {
      title: godCareer.suitableRoles[1] || godCareer.suitableRoles[0],
      description: '次適合的角色',
    },
  ];

  return {
    strategy,
    description,
    suitableIndustries,
    roles,
  };
}

/**
 * 獲取行業五行對照
 */
export function getIndustryByElement(element: WuXing): {
  categories: string[];
  jobs: string[];
  traits: string;
} {
  return WUXING_INDUSTRIES[element];
}

/**
 * 獲取十神職業建議
 */
export function getTenGodCareerAdvice(tenGod: ShiShen): {
  style: string;
  strengths: string[];
  suitableRoles: string[];
  challenges: string;
} {
  return TEN_GOD_CAREER[tenGod];
}
