/**
 * 神煞資料表
 *
 * 神煞是八字命理中的重要元素，分為吉神和凶煞
 * 傳統命理幾乎必提神煞，對格局和運勢判斷有重要參考價值
 */

import type { TianGan, DiZhi } from '@/lib/bazi/types';

// ========== 神煞定義 ==========

export interface ShenShaInfo {
  name: string;           // 神煞名稱
  type: 'auspicious' | 'inauspicious' | 'neutral';  // 吉/凶/中性
  category: string;       // 分類
  description: string;    // 說明
  effect: string;         // 影響
  advice: string;         // 建議
}

export const SHEN_SHA_INFO: Record<string, ShenShaInfo> = {
  // ========== 吉神 ==========
  '天乙貴人': {
    name: '天乙貴人',
    type: 'auspicious',
    category: '貴人',
    description: '命中最重要的貴人星，主逢凶化吉、遇難呈祥。',
    effect: '一生多得貴人相助，事業順利，有化險為夷之力。',
    advice: '善待身邊的人，因為貴人往往就在身邊。',
  },
  '太極貴人': {
    name: '太極貴人',
    type: 'auspicious',
    category: '貴人',
    description: '主聰明好學，有研究精神，適合學術或宗教領域。',
    effect: '思維敏捷，領悟力強，對神秘學和哲學有天賦。',
    advice: '可往學術研究、命理或宗教方向發展。',
  },
  '天德貴人': {
    name: '天德貴人',
    type: 'auspicious',
    category: '貴人',
    description: '上天賜予的德行，主品性端正、逢凶化吉。',
    effect: '為人厚道，行善積德，災厄自然遠離。',
    advice: '保持善念，多行好事，福報自然來。',
  },
  '月德貴人': {
    name: '月德貴人',
    type: 'auspicious',
    category: '貴人',
    description: '月令所賜之德，主仁慈寬厚、有長輩緣。',
    effect: '與長輩、領導關係融洽，容易得到提拔照顧。',
    advice: '尊敬長輩，善待下屬，德行是最好的護身符。',
  },
  '文昌貴人': {
    name: '文昌貴人',
    type: 'auspicious',
    category: '學業',
    description: '主聰明伶俐、學業有成，考試運佳。',
    effect: '讀書考試順利，文筆佳，適合從事文教工作。',
    advice: '把握學習機會，發揮文才，從事教育出版等行業更佳。',
  },
  '學堂': {
    name: '學堂',
    type: 'auspicious',
    category: '學業',
    description: '主學業順遂，在校成績優異。',
    effect: '求學階段多有好表現，適合繼續深造。',
    advice: '珍惜求學時光，多充實自我。',
  },
  '詞館': {
    name: '詞館',
    type: 'auspicious',
    category: '學業',
    description: '主文采斐然，有寫作天賦。',
    effect: '文筆優美，適合從事寫作、編輯、文案等工作。',
    advice: '多練筆，發揮文才，可往媒體文化方向發展。',
  },
  '祿神': {
    name: '祿神',
    type: 'auspicious',
    category: '財祿',
    description: '主財祿豐厚，衣食無憂。',
    effect: '一生衣食不愁，財運穩定，有固定收入來源。',
    advice: '知足常樂，穩定發展比投機更適合你。',
  },
  '天廚貴人': {
    name: '天廚貴人',
    type: 'auspicious',
    category: '財祿',
    description: '主口福極佳，與飲食有緣。',
    effect: '一生不缺吃穿，適合從事餐飲、食品相關行業。',
    advice: '可考慮與飲食相關的事業，必有所成。',
  },
  '金輿': {
    name: '金輿',
    type: 'auspicious',
    category: '財祿',
    description: '主出行有車，身份尊貴。',
    effect: '有車馬之福，出門多有便利，生活品質較高。',
    advice: '注意行車安全，享受生活的同時也要懂得節制。',
  },
  '將星': {
    name: '將星',
    type: 'auspicious',
    category: '權位',
    description: '主有領導才能，適合當主管、帶兵。',
    effect: '有統御能力，適合擔任領導職位，下屬服從。',
    advice: '可往管理階層發展，培養領導力是你的課題。',
  },
  '國印貴人': {
    name: '國印貴人',
    type: 'auspicious',
    category: '權位',
    description: '主有權柄、掌印信，適合從政或任要職。',
    effect: '有管理才能，適合公職、管理層，掌握實權。',
    advice: '可考慮公職或大企業發展，權位運較強。',
  },
  '華蓋': {
    name: '華蓋',
    type: 'neutral',
    category: '特殊',
    description: '主聰明孤高，有藝術或宗教天賦。',
    effect: '思想獨特，不隨俗流，適合藝術、宗教或學術研究。',
    advice: '接受自己的獨特性，發揮專長比迎合大眾更重要。',
  },

  // ========== 桃花類 ==========
  '桃花': {
    name: '桃花（咸池）',
    type: 'neutral',
    category: '桃花',
    description: '主異性緣佳、風流多情。',
    effect: '感情機會多，人緣好，但也可能有感情困擾。',
    advice: '理性處理感情，桃花太旺需慎防爛桃花。',
  },
  '紅鸞': {
    name: '紅鸞',
    type: 'auspicious',
    category: '桃花',
    description: '主婚姻喜事、感情順利。',
    effect: '適婚年齡容易遇到好對象，婚姻運佳。',
    advice: '把握感情機會，紅鸞年適合談婚論嫁。',
  },
  '天喜': {
    name: '天喜',
    type: 'auspicious',
    category: '桃花',
    description: '主喜慶之事、人緣極佳。',
    effect: '有喜事臨門的象徵，人際關係和諧。',
    advice: '保持開朗心態，好運會自然到來。',
  },

  // ========== 凶煞 ==========
  '羊刃': {
    name: '羊刃',
    type: 'inauspicious',
    category: '凶煞',
    description: '主剛烈好勇、容易受傷，是最強的劫財星。',
    effect: '性格剛強，不服輸，但容易與人衝突或發生意外。',
    advice: '修身養性，避免衝動，行事需三思而後行。',
  },
  '劫煞': {
    name: '劫煞',
    type: 'inauspicious',
    category: '凶煞',
    description: '主破財、盜劫、口舌是非。',
    effect: '容易破財或遭小人，需防範詐騙和盜竊。',
    advice: '財不露白，謹慎交友，低調行事。',
  },
  '亡神': {
    name: '亡神',
    type: 'inauspicious',
    category: '凶煞',
    description: '主心神不寧、多疑多慮。',
    effect: '容易想太多，精神壓力大，睡眠品質不佳。',
    advice: '學習放鬆，培養正向思考，必要時尋求專業協助。',
  },
  '驛馬': {
    name: '驛馬',
    type: 'neutral',
    category: '遷移',
    description: '主奔波、出外、變動。',
    effect: '工作性質多需外出或出差，一生居所多變。',
    advice: '適合需要移動的工作，如業務、運輸、旅遊業。',
  },
  '孤辰': {
    name: '孤辰',
    type: 'inauspicious',
    category: '婚姻',
    description: '主孤獨、晚婚，男命尤忌。',
    effect: '性格較獨立，不易妥協，感情路較坎坷。',
    advice: '學習包容與溝通，不要過於堅持己見。',
  },
  '寡宿': {
    name: '寡宿',
    type: 'inauspicious',
    category: '婚姻',
    description: '主孤獨、晚婚，女命尤忌。',
    effect: '個性較清高，不易找到契合對象。',
    advice: '放下身段，學會欣賞他人優點。',
  },
  '元辰': {
    name: '元辰',
    type: 'inauspicious',
    category: '凶煞',
    description: '主耗散、破敗、不聚財。',
    effect: '容易有意外支出，財來財去難以累積。',
    advice: '加強理財觀念，建立儲蓄習慣。',
  },
  '天羅': {
    name: '天羅',
    type: 'inauspicious',
    category: '凶煞',
    description: '主阻礙、困頓，事業易受挫。',
    effect: '發展過程多阻礙，需要更多耐心。',
    advice: '遇到困難不要氣餒，堅持終能突破。',
  },
  '地網': {
    name: '地網',
    type: 'inauspicious',
    category: '凶煞',
    description: '主牽絆、糾纏，感情易受阻。',
    effect: '感情或家庭方面容易有牽絆和困擾。',
    advice: '釐清關係，該放手時要放手。',
  },
  '童子': {
    name: '童子',
    type: 'neutral',
    category: '特殊',
    description: '主聰明清秀，但婚姻多波折。',
    effect: '外表清秀，性格單純，但感情運不順。',
    advice: '可做化解，多行善事積累福報。',
  },
  '喪門': {
    name: '喪門',
    type: 'inauspicious',
    category: '凶煞',
    description: '主喪事、悲傷、精神不振。',
    effect: '容易遇到不開心的事，情緒低落。',
    advice: '多接觸正能量，遠離負面環境。',
  },
  '弔客': {
    name: '弔客',
    type: 'inauspicious',
    category: '凶煞',
    description: '主奔喪、傷心事，需防意外。',
    effect: '可能遇到令人傷心的事情，需多加小心。',
    advice: '注意安全，關心家中長輩健康。',
  },
  '白虎': {
    name: '白虎',
    type: 'inauspicious',
    category: '凶煞',
    description: '主血光、意外、官訟。',
    effect: '需防意外傷害，也主口舌是非。',
    advice: '凡事小心，避免衝突，可捐血化解。',
  },
  '天狗': {
    name: '天狗',
    type: 'inauspicious',
    category: '凶煞',
    description: '主破財、口舌、小人。',
    effect: '容易有意外破財或遇到小人。',
    advice: '謹言慎行，不要輕易借錢給人。',
  },
  // ========== 新增神煞 ==========
  '魁罡': {
    name: '魁罡',
    type: 'neutral',
    category: '特殊',
    description: '主聰明剛毅，有威嚴氣勢，但性格孤傲。',
    effect: '頭腦聰明，做事果斷，有領導氣質，但容易得罪人。',
    advice: '學會圓融處世，剛柔並濟才能成大事。',
  },
  '天醫': {
    name: '天醫',
    type: 'auspicious',
    category: '吉神',
    description: '主健康、醫療緣，適合從事醫療健康行業。',
    effect: '身體康健，或有醫療天賦，適合醫護、養生行業。',
    advice: '可往醫療、保健、養生方向發展。',
  },
  '福星': {
    name: '福星',
    type: 'auspicious',
    category: '吉神',
    description: '主福氣深厚，一生順遂。',
    effect: '福報深厚，常有好運降臨，逢凶化吉。',
    advice: '惜福積德，福氣才能綿延。',
  },
  '三奇貴人': {
    name: '三奇貴人',
    type: 'auspicious',
    category: '貴人',
    description: '天上三奇（乙丙丁）或地上三奇（甲戊庚），主大貴。',
    effect: '有特殊才能，人生際遇不凡，易成大業。',
    advice: '把握機遇，發揮天賦，必有大成。',
  },
  '飛刃': {
    name: '飛刃',
    type: 'inauspicious',
    category: '凶煞',
    description: '羊刃沖位，主意外傷災。',
    effect: '容易有血光意外，行事需格外小心。',
    advice: '遠離危險場所，注意交通安全。',
  },
  '血刃': {
    name: '血刃',
    type: 'inauspicious',
    category: '凶煞',
    description: '主血光之災、開刀手術。',
    effect: '需防意外受傷或手術，女命尤需注意生產。',
    advice: '定期健康檢查，行事小心謹慎。',
  },
  '十惡大敗': {
    name: '十惡大敗',
    type: 'inauspicious',
    category: '凶煞',
    description: '六甲旬中十日空亡，主大敗之象。',
    effect: '事業容易有大起大落，財運不穩定。',
    advice: '穩紮穩打，不宜冒險投機。',
  },
  '陰陽差錯': {
    name: '陰陽差錯',
    type: 'inauspicious',
    category: '婚姻',
    description: '主婚姻不順、感情波折。',
    effect: '感情路較坎坷，婚姻容易有問題。',
    advice: '選擇對象要謹慎，多溝通化解分歧。',
  },
  '四廢': {
    name: '四廢',
    type: 'inauspicious',
    category: '凶煞',
    description: '春庚申辛酉、夏壬子癸亥、秋甲寅乙卯、冬丙午丁巳。',
    effect: '做事容易虎頭蛇尾，有志難伸。',
    advice: '堅持到底，不要輕言放棄。',
  },
  '龍德': {
    name: '龍德',
    type: 'auspicious',
    category: '吉神',
    description: '主有德行、受人敬重。',
    effect: '品德高尚，人緣好，容易獲得尊重。',
    advice: '保持善念，多行善事。',
  },
  '紫微': {
    name: '紫微',
    type: 'auspicious',
    category: '吉神',
    description: '主尊貴、有帝王之相。',
    effect: '氣質尊貴，有領袖特質，事業發展順利。',
    advice: '培養領導能力，勇於承擔責任。',
  },
  '六厄': {
    name: '六厄',
    type: 'inauspicious',
    category: '凶煞',
    description: '主災厄、阻礙。',
    effect: '事情進展多阻礙，需要更多耐心。',
    advice: '遇事冷靜，不要急躁。',
  },
  '流霞': {
    name: '流霞',
    type: 'inauspicious',
    category: '凶煞',
    description: '主血光、酒色之災。',
    effect: '需防意外傷害，也主酒色傷身。',
    advice: '節制飲酒，注意安全。',
  },
  '飛廉': {
    name: '飛廉',
    type: 'inauspicious',
    category: '凶煞',
    description: '主口舌是非、小人暗害。',
    effect: '容易遭人背後議論或小人陷害。',
    advice: '謹言慎行，遠離是非之人。',
  },
  '天官': {
    name: '天官',
    type: 'auspicious',
    category: '權位',
    description: '主官運亨通、仕途順利。',
    effect: '適合從政或公職，有升遷之運。',
    advice: '把握升遷機會，清廉自守。',
  },
  '福德': {
    name: '福德',
    type: 'auspicious',
    category: '吉神',
    description: '主福澤深厚、子孫有靠。',
    effect: '一生福氣不斷，晚年有依靠。',
    advice: '積善行德，福澤延綿。',
  },
  '天赦': {
    name: '天赦',
    type: 'auspicious',
    category: '吉神',
    description: '主逢凶化吉、遇難呈祥。',
    effect: '有化解災厄的力量，大事化小。',
    advice: '保持正心，災厄自離。',
  },
  '陰煞': {
    name: '陰煞',
    type: 'inauspicious',
    category: '凶煞',
    description: '主陰暗小人、暗中破壞。',
    effect: '容易有人暗中作梗，防不勝防。',
    advice: '光明正大行事，不給小人可趁之機。',
  },
};

// ========== 神煞查詢表 ==========

/**
 * 天乙貴人查詢表
 * 以日干查年支或日支
 */
export const TIAN_YI_GUI_REN: Record<TianGan, DiZhi[]> = {
  '甲': ['丑', '未'],
  '乙': ['子', '申'],
  '丙': ['亥', '酉'],
  '丁': ['亥', '酉'],
  '戊': ['丑', '未'],
  '己': ['子', '申'],
  '庚': ['丑', '未'],
  '辛': ['寅', '午'],
  '壬': ['卯', '巳'],
  '癸': ['卯', '巳'],
};

/**
 * 太極貴人查詢表
 * 以日干查地支
 */
export const TAI_JI_GUI_REN: Record<TianGan, DiZhi[]> = {
  '甲': ['子', '午'],
  '乙': ['子', '午'],
  '丙': ['卯', '酉'],
  '丁': ['卯', '酉'],
  '戊': ['辰', '戌', '丑', '未'],
  '己': ['辰', '戌', '丑', '未'],
  '庚': ['寅', '亥'],
  '辛': ['寅', '亥'],
  '壬': ['巳', '申'],
  '癸': ['巳', '申'],
};

/**
 * 天德貴人查詢表
 * 以月支查天干
 */
export const TIAN_DE_GUI_REN: Record<DiZhi, TianGan> = {
  '寅': '丁',
  '卯': '申' as unknown as TianGan, // 申是地支，這裡需特殊處理
  '辰': '壬',
  '巳': '辛',
  '午': '亥' as unknown as TianGan,
  '未': '甲',
  '申': '癸',
  '酉': '寅' as unknown as TianGan,
  '戌': '丙',
  '亥': '乙',
  '子': '巳' as unknown as TianGan,
  '丑': '庚',
};

/**
 * 月德貴人查詢表
 * 以月支查天干
 */
export const YUE_DE_GUI_REN: Record<DiZhi, TianGan> = {
  '寅': '丙',
  '卯': '甲',
  '辰': '壬',
  '巳': '庚',
  '午': '丙',
  '未': '甲',
  '申': '壬',
  '酉': '庚',
  '戌': '丙',
  '亥': '甲',
  '子': '壬',
  '丑': '庚',
};

/**
 * 文昌貴人查詢表
 * 以日干查地支
 */
export const WEN_CHANG_GUI_REN: Record<TianGan, DiZhi> = {
  '甲': '巳',
  '乙': '午',
  '丙': '申',
  '丁': '酉',
  '戊': '申',
  '己': '酉',
  '庚': '亥',
  '辛': '子',
  '壬': '寅',
  '癸': '卯',
};

/**
 * 羊刃查詢表
 * 以日干查地支
 */
export const YANG_REN: Record<TianGan, DiZhi> = {
  '甲': '卯',
  '乙': '辰',
  '丙': '午',
  '丁': '未',
  '戊': '午',
  '己': '未',
  '庚': '酉',
  '辛': '戌',
  '壬': '子',
  '癸': '丑',
};

/**
 * 祿神查詢表
 * 以日干查地支（臨官位）
 */
export const LU_SHEN: Record<TianGan, DiZhi> = {
  '甲': '寅',
  '乙': '卯',
  '丙': '巳',
  '丁': '午',
  '戊': '巳',
  '己': '午',
  '庚': '申',
  '辛': '酉',
  '壬': '亥',
  '癸': '子',
};

/**
 * 桃花（咸池）查詢表
 * 以年支或日支查桃花位
 */
export const TAO_HUA: Record<DiZhi, DiZhi> = {
  '寅': '卯', '午': '卯', '戌': '卯',  // 寅午戌見卯
  '申': '酉', '子': '酉', '辰': '酉',  // 申子辰見酉
  '亥': '子', '卯': '子', '未': '子',  // 亥卯未見子
  '巳': '午', '酉': '午', '丑': '午',  // 巳酉丑見午
};

/**
 * 驛馬查詢表
 * 以年支或日支查驛馬位
 */
export const YI_MA: Record<DiZhi, DiZhi> = {
  '寅': '申', '午': '申', '戌': '申',  // 寅午戌見申
  '申': '寅', '子': '寅', '辰': '寅',  // 申子辰見寅
  '亥': '巳', '卯': '巳', '未': '巳',  // 亥卯未見巳
  '巳': '亥', '酉': '亥', '丑': '亥',  // 巳酉丑見亥
};

/**
 * 將星查詢表
 * 以年支或日支查將星位
 */
export const JIANG_XING: Record<DiZhi, DiZhi> = {
  '寅': '午', '午': '午', '戌': '午',  // 寅午戌見午
  '申': '子', '子': '子', '辰': '子',  // 申子辰見子
  '亥': '卯', '卯': '卯', '未': '卯',  // 亥卯未見卯
  '巳': '酉', '酉': '酉', '丑': '酉',  // 巳酉丑見酉
};

/**
 * 華蓋查詢表
 * 以年支或日支查華蓋位
 */
export const HUA_GAI: Record<DiZhi, DiZhi> = {
  '寅': '戌', '午': '戌', '戌': '戌',  // 寅午戌見戌
  '申': '辰', '子': '辰', '辰': '辰',  // 申子辰見辰
  '亥': '未', '卯': '未', '未': '未',  // 亥卯未見未
  '巳': '丑', '酉': '丑', '丑': '丑',  // 巳酉丑見丑
};

/**
 * 劫煞查詢表
 * 以年支或日支查劫煞位
 */
export const JIE_SHA: Record<DiZhi, DiZhi> = {
  '寅': '巳', '午': '巳', '戌': '巳',  // 寅午戌見巳
  '申': '亥', '子': '亥', '辰': '亥',  // 申子辰見亥
  '亥': '申', '卯': '申', '未': '申',  // 亥卯未見申
  '巳': '寅', '酉': '寅', '丑': '寅',  // 巳酉丑見寅
};

/**
 * 亡神查詢表
 * 以年支或日支查亡神位
 */
export const WANG_SHEN: Record<DiZhi, DiZhi> = {
  '寅': '巳', '午': '申', '戌': '亥',
  '申': '亥', '子': '寅', '辰': '巳',
  '亥': '寅', '卯': '巳', '未': '申',
  '巳': '申', '酉': '亥', '丑': '寅',
};

/**
 * 孤辰寡宿查詢表
 */
export const GU_CHEN_GUA_SU: Record<DiZhi, { guChen: DiZhi; guaSu: DiZhi }> = {
  '寅': { guChen: '巳', guaSu: '丑' },
  '卯': { guChen: '巳', guaSu: '丑' },
  '辰': { guChen: '巳', guaSu: '丑' },
  '巳': { guChen: '申', guaSu: '辰' },
  '午': { guChen: '申', guaSu: '辰' },
  '未': { guChen: '申', guaSu: '辰' },
  '申': { guChen: '亥', guaSu: '未' },
  '酉': { guChen: '亥', guaSu: '未' },
  '戌': { guChen: '亥', guaSu: '未' },
  '亥': { guChen: '寅', guaSu: '戌' },
  '子': { guChen: '寅', guaSu: '戌' },
  '丑': { guChen: '寅', guaSu: '戌' },
};

/**
 * 天廚貴人查詢表
 * 以日干查地支
 */
export const TIAN_CHU: Record<TianGan, DiZhi> = {
  '甲': '巳',
  '乙': '午',
  '丙': '巳',
  '丁': '酉',
  '戊': '申',
  '己': '未',
  '庚': '亥',
  '辛': '子',
  '壬': '子',
  '癸': '丑',
};

/**
 * 金輿查詢表
 * 以日干查地支
 */
export const JIN_YU: Record<TianGan, DiZhi> = {
  '甲': '辰',
  '乙': '巳',
  '丙': '未',
  '丁': '申',
  '戊': '未',
  '己': '申',
  '庚': '戌',
  '辛': '亥',
  '壬': '丑',
  '癸': '寅',
};

/**
 * 國印貴人查詢表
 * 以日干查地支
 */
export const GUO_YIN: Record<TianGan, DiZhi> = {
  '甲': '戌',
  '乙': '亥',
  '丙': '丑',
  '丁': '寅',
  '戊': '丑',
  '己': '寅',
  '庚': '辰',
  '辛': '巳',
  '壬': '未',
  '癸': '申',
};

/**
 * 學堂查詢表
 * 以日干查地支
 */
export const XUE_TANG: Record<TianGan, DiZhi> = {
  '甲': '亥',
  '乙': '午',
  '丙': '寅',
  '丁': '酉',
  '戊': '寅',
  '己': '酉',
  '庚': '巳',
  '辛': '子',
  '壬': '申',
  '癸': '卯',
};

/**
 * 詞館查詢表
 * 以日干查地支
 */
export const CI_GUAN: Record<TianGan, DiZhi> = {
  '甲': '寅',
  '乙': '卯',
  '丙': '巳',
  '丁': '午',
  '戊': '巳',
  '己': '午',
  '庚': '申',
  '辛': '酉',
  '壬': '亥',
  '癸': '子',
};

/**
 * 六十甲子旬空（空亡）
 */
export const XUN_KONG: Record<string, DiZhi[]> = {
  '甲子': ['戌', '亥'],
  '甲戌': ['申', '酉'],
  '甲申': ['午', '未'],
  '甲午': ['辰', '巳'],
  '甲辰': ['寅', '卯'],
  '甲寅': ['子', '丑'],
};

/**
 * 獲取所屬旬首
 * @param gan 天干
 * @param zhi 地支
 */
export function getXunShou(gan: TianGan, zhi: DiZhi): string {
  const ganOrder = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
  const zhiOrder = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

  const ganIdx = ganOrder.indexOf(gan);
  const zhiIdx = zhiOrder.indexOf(zhi);

  // 計算到旬首的距離
  const distance = ganIdx; // 天干從甲開始數幾位

  // 地支往前推相應位數
  const xunShouZhiIdx = (zhiIdx - distance + 12) % 12;

  return '甲' + zhiOrder[xunShouZhiIdx];
}

/**
 * 獲取空亡地支
 * @param gan 天干
 * @param zhi 地支
 */
export function getKongWang(gan: TianGan, zhi: DiZhi): DiZhi[] {
  const xunShou = getXunShou(gan, zhi);
  return XUN_KONG[xunShou] || [];
}

/**
 * 天羅地網查詢
 * 戌亥為天羅（火命人忌）
 * 辰巳為地網（水命人忌）
 */
export const TIAN_LUO_DI_WANG = {
  tianLuo: ['戌', '亥'] as DiZhi[],
  diWang: ['辰', '巳'] as DiZhi[],
};

/**
 * 魁罡日查詢表
 * 庚戌、庚辰、壬辰、戊戌 四日為魁罡
 */
export const KUI_GANG: string[] = ['庚戌', '庚辰', '壬辰', '戊戌'];

/**
 * 天醫查詢表
 * 以月支查天醫位
 */
export const TIAN_YI: Record<DiZhi, DiZhi> = {
  '寅': '丑', '卯': '寅', '辰': '卯', '巳': '辰',
  '午': '巳', '未': '午', '申': '未', '酉': '申',
  '戌': '酉', '亥': '戌', '子': '亥', '丑': '子',
};

/**
 * 紅鸞查詢表
 * 以年支查紅鸞位
 */
export const HONG_LUAN: Record<DiZhi, DiZhi> = {
  '子': '卯', '丑': '寅', '寅': '丑', '卯': '子',
  '辰': '亥', '巳': '戌', '午': '酉', '未': '申',
  '申': '未', '酉': '午', '戌': '巳', '亥': '辰',
};

/**
 * 天喜查詢表
 * 以年支查天喜位（紅鸞對沖）
 */
export const TIAN_XI: Record<DiZhi, DiZhi> = {
  '子': '酉', '丑': '申', '寅': '未', '卯': '午',
  '辰': '巳', '巳': '辰', '午': '卯', '未': '寅',
  '申': '丑', '酉': '子', '戌': '亥', '亥': '戌',
};

/**
 * 飛刃查詢表（羊刃沖位）
 * 以日干查地支
 */
export const FEI_REN: Record<TianGan, DiZhi> = {
  '甲': '酉', '乙': '戌', '丙': '子', '丁': '丑',
  '戊': '子', '己': '丑', '庚': '卯', '辛': '辰',
  '壬': '午', '癸': '未',
};

/**
 * 血刃查詢表
 * 以月支查血刃位
 */
export const XUE_REN: Record<DiZhi, DiZhi> = {
  '寅': '丑', '卯': '未', '辰': '寅', '巳': '申',
  '午': '卯', '未': '酉', '申': '辰', '酉': '戌',
  '戌': '巳', '亥': '亥', '子': '午', '丑': '子',
};

/**
 * 十惡大敗日
 */
export const SHI_E_DA_BAI: string[] = [
  '甲辰', '乙巳', '丙申', '丁亥', '戊戌',
  '己丑', '庚辰', '辛巳', '壬申', '癸亥',
];

/**
 * 陰陽差錯日
 */
export const YIN_YANG_CHA_CUO: string[] = [
  '丙子', '丁丑', '戊寅', '辛卯', '壬辰', '癸巳',
  '丙午', '丁未', '戊申', '辛酉', '壬戌', '癸亥',
];

/**
 * 四廢日查詢表
 * 春月：庚申、辛酉；夏月：壬子、癸亥
 * 秋月：甲寅、乙卯；冬月：丙午、丁巳
 */
export const SI_FEI: Record<string, string[]> = {
  '春': ['庚申', '辛酉'],  // 寅卯辰月
  '夏': ['壬子', '癸亥'],  // 巳午未月
  '秋': ['甲寅', '乙卯'],  // 申酉戌月
  '冬': ['丙午', '丁巳'],  // 亥子丑月
};

/**
 * 天三奇：甲戊庚
 * 地三奇：乙丙丁
 */
export const SAN_QI = {
  tian: ['甲', '戊', '庚'] as TianGan[],
  di: ['乙', '丙', '丁'] as TianGan[],
};

/**
 * 流霞查詢表
 * 以日干查流霞位
 */
export const LIU_XIA: Record<TianGan, DiZhi> = {
  '甲': '酉', '乙': '戌', '丙': '未', '丁': '申',
  '戊': '未', '己': '申', '庚': '巳', '辛': '午',
  '壬': '卯', '癸': '辰',
};

/**
 * 喪門弔客查詢表
 * 以年支查喪門弔客位
 */
export const SANG_MEN_DIAO_KE: Record<DiZhi, { sangMen: DiZhi; diaoKe: DiZhi }> = {
  '子': { sangMen: '寅', diaoKe: '戌' },
  '丑': { sangMen: '卯', diaoKe: '亥' },
  '寅': { sangMen: '辰', diaoKe: '子' },
  '卯': { sangMen: '巳', diaoKe: '丑' },
  '辰': { sangMen: '午', diaoKe: '寅' },
  '巳': { sangMen: '未', diaoKe: '卯' },
  '午': { sangMen: '申', diaoKe: '辰' },
  '未': { sangMen: '酉', diaoKe: '巳' },
  '申': { sangMen: '戌', diaoKe: '午' },
  '酉': { sangMen: '亥', diaoKe: '未' },
  '戌': { sangMen: '子', diaoKe: '申' },
  '亥': { sangMen: '丑', diaoKe: '酉' },
};

/**
 * 白虎查詢表
 * 以年支查白虎位
 */
export const BAI_HU: Record<DiZhi, DiZhi> = {
  '子': '申', '丑': '酉', '寅': '戌', '卯': '亥',
  '辰': '子', '巳': '丑', '午': '寅', '未': '卯',
  '申': '辰', '酉': '巳', '戌': '午', '亥': '未',
};

/**
 * 天狗查詢表
 * 以年支查天狗位
 */
export const TIAN_GOU: Record<DiZhi, DiZhi> = {
  '子': '戌', '丑': '亥', '寅': '子', '卯': '丑',
  '辰': '寅', '巳': '卯', '午': '辰', '未': '巳',
  '申': '午', '酉': '未', '戌': '申', '亥': '酉',
};

/**
 * 飛廉查詢表
 * 以年支查飛廉位
 */
export const FEI_LIAN: Record<DiZhi, DiZhi> = {
  '子': '申', '丑': '酉', '寅': '戌', '卯': '亥',
  '辰': '子', '巳': '丑', '午': '寅', '未': '卯',
  '申': '辰', '酉': '巳', '戌': '午', '亥': '未',
};
