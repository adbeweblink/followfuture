/**
 * 納音深度論命模組
 * 六十甲子納音五行分析
 */

import type { BaZiChart, TianGan, DiZhi, WuXing } from './types';

export interface NaYinInfo {
  name: string;           // 納音名稱
  element: WuXing;        // 納音五行
  description: string;    // 納音說明
  personality: string;    // 性格特質
  career: string;         // 事業傾向
  wealth: string;         // 財運特點
  health: string;         // 健康提示
}

export interface NaYinAnalysis {
  yearNaYin: NaYinInfo;     // 年柱納音
  monthNaYin: NaYinInfo;    // 月柱納音
  dayNaYin: NaYinInfo;      // 日柱納音
  hourNaYin: NaYinInfo;     // 時柱納音

  lifeNaYin: NaYinInfo;     // 本命納音（年柱）
  dominantElement: WuXing;  // 主導五行
  elementBalance: string;   // 五行平衡分析

  summary: string;          // 納音總論
  advice: string[];         // 建議
}

/**
 * 六十甲子納音表
 */
const NAYIN_TABLE: Record<string, NaYinInfo> = {
  // ===== 甲子旬 =====
  '甲子': {
    name: '海中金',
    element: '金',
    description: '金藏於海水之中，深沉內斂，不易外露。',
    personality: '外表平和內心堅定，不輕易顯露鋒芒，但關鍵時刻能展現實力。',
    career: '適合幕後工作、投資理財、珠寶金融等行業。',
    wealth: '財運厚重但需等待時機，大器晚成型。',
    health: '注意腎臟、泌尿系統健康。',
  },
  '乙丑': {
    name: '海中金',
    element: '金',
    description: '金藏於海水之中，柔中帶剛。',
    personality: '溫和謙遜，但有自己的原則和底線。',
    career: '適合金融、投資、藝術品收藏等行業。',
    wealth: '財運穩定，善於守財。',
    health: '注意筋骨、肝膽健康。',
  },
  '丙寅': {
    name: '爐中火',
    element: '火',
    description: '火在爐中燃燒，光明熱烈。',
    personality: '熱情開朗，有領導氣質，行動力強。',
    career: '適合創業、管理、文化傳媒等行業。',
    wealth: '財運起伏，宜穩健投資。',
    health: '注意心血管、血壓健康。',
  },
  '丁卯': {
    name: '爐中火',
    element: '火',
    description: '爐中之火，溫暖而持久。',
    personality: '溫和有禮，內心有熱情和理想。',
    career: '適合教育、藝術、服務等行業。',
    wealth: '財運平穩，重視精神富足。',
    health: '注意眼睛、心臟健康。',
  },
  '戊辰': {
    name: '大林木',
    element: '木',
    description: '參天大樹，氣勢恢宏。',
    personality: '志向遠大，有開拓精神，適合成為領導者。',
    career: '適合大企業、政府機關、教育等領域。',
    wealth: '財運佳，但需注意守財。',
    health: '注意肝膽、筋骨健康。',
  },
  '己巳': {
    name: '大林木',
    element: '木',
    description: '大林之木，柔韌有生機。',
    personality: '智慧靈活，善於應變，有藝術天賦。',
    career: '適合策劃、設計、諮詢等行業。',
    wealth: '財運多變，需把握時機。',
    health: '注意肝臟、神經系統健康。',
  },
  '庚午': {
    name: '路旁土',
    element: '土',
    description: '路旁之土，承載萬物。',
    personality: '踏實穩重，樂於助人，有包容心。',
    career: '適合房地產、農業、服務等行業。',
    wealth: '財運穩定，適合長期積累。',
    health: '注意脾胃、消化系統健康。',
  },
  '辛未': {
    name: '路旁土',
    element: '土',
    description: '路旁沃土，滋養生命。',
    personality: '溫厚善良，重視家庭，有藝術品味。',
    career: '適合餐飲、農業、藝術等行業。',
    wealth: '財運平穩，宜穩健理財。',
    health: '注意脾胃、皮膚健康。',
  },
  '壬申': {
    name: '劍鋒金',
    element: '金',
    description: '鋒利之金，銳不可當。',
    personality: '聰明果斷，有魄力，適合競爭性強的環境。',
    career: '適合法律、軍警、外科醫生等行業。',
    wealth: '財運起伏大，宜冷靜決策。',
    health: '注意肺部、呼吸系統健康。',
  },
  '癸酉': {
    name: '劍鋒金',
    element: '金',
    description: '精緻之金，鋒芒內斂。',
    personality: '精明細膩，有審美眼光，追求完美。',
    career: '適合精密工業、珠寶、藝術等行業。',
    wealth: '財運佳，善於理財投資。',
    health: '注意肺部、皮膚健康。',
  },

  // ===== 甲戌旬 =====
  '甲戌': {
    name: '山頭火',
    element: '火',
    description: '山頂之火，光照四方。',
    personality: '志向高遠，有領袖氣質，喜歡挑戰。',
    career: '適合領導、創業、宗教等領域。',
    wealth: '財運起伏，需把握高點。',
    health: '注意心臟、血壓健康。',
  },
  '乙亥': {
    name: '山頭火',
    element: '火',
    description: '山頭餘暉，溫暖而深遠。',
    personality: '溫和有智慧，善於思考，有哲學傾向。',
    career: '適合文化、教育、諮詢等行業。',
    wealth: '財運平穩，重視精神財富。',
    health: '注意心血管、眼睛健康。',
  },
  '丙子': {
    name: '澗下水',
    element: '水',
    description: '山澗清流，靈動清澈。',
    personality: '聰明敏捷，思維活躍，適應力強。',
    career: '適合教育、研究、IT 等行業。',
    wealth: '財運流動，善於把握商機。',
    health: '注意腎臟、泌尿系統健康。',
  },
  '丁丑': {
    name: '澗下水',
    element: '水',
    description: '澗底靜水，深沉穩定。',
    personality: '內斂穩重，有耐心，善於積累。',
    career: '適合金融、研究、管理等行業。',
    wealth: '財運穩健，適合長期投資。',
    health: '注意腎臟、血液健康。',
  },
  '戊寅': {
    name: '城頭土',
    element: '土',
    description: '城牆之土，堅固可靠。',
    personality: '穩重守信，有責任感，適合擔當重任。',
    career: '適合建築、政府、管理等行業。',
    wealth: '財運穩定，宜守不宜攻。',
    health: '注意脾胃、骨骼健康。',
  },
  '己卯': {
    name: '城頭土',
    element: '土',
    description: '城牆沃土，孕育生機。',
    personality: '溫和包容，有藝術氣質，重視家庭。',
    career: '適合房地產、設計、教育等行業。',
    wealth: '財運平穩，善於理財。',
    health: '注意脾胃、肌肉健康。',
  },
  '庚辰': {
    name: '白蠟金',
    element: '金',
    description: '精煉之金，純淨高貴。',
    personality: '有原則，追求完美，不隨波逐流。',
    career: '適合金融、法律、藝術等行業。',
    wealth: '財運佳，但需謹慎決策。',
    health: '注意肺部、大腸健康。',
  },
  '辛巳': {
    name: '白蠟金',
    element: '金',
    description: '蠟中之金，柔韌有光。',
    personality: '聰明靈活，善於變通，有商業頭腦。',
    career: '適合商業、金融、諮詢等行業。',
    wealth: '財運活絡，善於投資。',
    health: '注意呼吸系統、神經健康。',
  },
  '壬午': {
    name: '楊柳木',
    element: '木',
    description: '楊柳依依，柔韌生命力強。',
    personality: '溫柔隨和，適應力強，有藝術天賦。',
    career: '適合藝術、服務、教育等行業。',
    wealth: '財運平穩，不宜投機。',
    health: '注意肝膽、筋骨健康。',
  },
  '癸未': {
    name: '楊柳木',
    element: '木',
    description: '柳樹成蔭，庇護眾生。',
    personality: '善良慈悲，有包容心，適合服務他人。',
    career: '適合醫療、慈善、教育等行業。',
    wealth: '財運穩定，知足常樂。',
    health: '注意肝臟、脾胃健康。',
  },

  // ===== 甲申旬 =====
  '甲申': {
    name: '泉中水',
    element: '水',
    description: '泉水清澈，源源不絕。',
    personality: '智慧過人，思維清晰，有創造力。',
    career: '適合科研、教育、IT 等行業。',
    wealth: '財運活絡，善於發現商機。',
    health: '注意腎臟、膀胱健康。',
  },
  '乙酉': {
    name: '泉中水',
    element: '水',
    description: '泉水甘甜，滋養萬物。',
    personality: '溫和有智慧，善於溝通，人緣好。',
    career: '適合諮詢、服務、藝術等行業。',
    wealth: '財運平穩，宜穩健理財。',
    health: '注意腎臟、血液健康。',
  },
  '丙戌': {
    name: '屋上土',
    element: '土',
    description: '屋頂之土，覆蓋保護。',
    personality: '穩重負責，有保護欲，適合照顧他人。',
    career: '適合建築、房地產、管理等行業。',
    wealth: '財運穩定，適合不動產投資。',
    health: '注意脾胃、皮膚健康。',
  },
  '丁亥': {
    name: '屋上土',
    element: '土',
    description: '屋瓦沃土，溫暖家園。',
    personality: '溫和善良，重視家庭，有藝術天賦。',
    career: '適合設計、家居、服務等行業。',
    wealth: '財運平穩，重視家庭理財。',
    health: '注意脾胃、消化健康。',
  },
  '戊子': {
    name: '霹靂火',
    element: '火',
    description: '雷霆之火，威力強大。',
    personality: '果斷有魄力，行動力強，適合開創事業。',
    career: '適合創業、科技、軍警等行業。',
    wealth: '財運起伏大，需把握時機。',
    health: '注意心血管、神經健康。',
  },
  '己丑': {
    name: '霹靂火',
    element: '火',
    description: '雷後餘光，深沉有力。',
    personality: '內斂有力量，善於謀劃，有遠見。',
    career: '適合策劃、投資、管理等行業。',
    wealth: '財運佳，適合長期投資。',
    health: '注意心臟、血液健康。',
  },
  '庚寅': {
    name: '松柏木',
    element: '木',
    description: '松柏常青，堅韌不拔。',
    personality: '剛毅正直，有原則，意志堅定。',
    career: '適合法律、教育、管理等行業。',
    wealth: '財運穩定，宜長期規劃。',
    health: '注意肝膽、筋骨健康。',
  },
  '辛卯': {
    name: '松柏木',
    element: '木',
    description: '松柏翠綠，生機盎然。',
    personality: '溫和堅定，有藝術氣質，追求品質。',
    career: '適合藝術、設計、教育等行業。',
    wealth: '財運平穩，重視精神生活。',
    health: '注意肝臟、眼睛健康。',
  },
  '壬辰': {
    name: '長流水',
    element: '水',
    description: '江河之水，奔流不息。',
    personality: '豪放大度，有遠見，喜歡挑戰。',
    career: '適合商業、外貿、航運等行業。',
    wealth: '財運流動，適合投資流動性資產。',
    health: '注意腎臟、泌尿系統健康。',
  },
  '癸巳': {
    name: '長流水',
    element: '水',
    description: '細水長流，綿延不絕。',
    personality: '聰明細膩，善於積累，有耐心。',
    career: '適合研究、金融、諮詢等行業。',
    wealth: '財運穩健，適合長期積累。',
    health: '注意腎臟、血液健康。',
  },

  // ===== 甲午旬 =====
  '甲午': {
    name: '沙中金',
    element: '金',
    description: '沙中淘金，難得珍貴。',
    personality: '有才華但需要伯樂，大器晚成型。',
    career: '適合專業技術、藝術、研究等領域。',
    wealth: '財運後發，需耐心等待。',
    health: '注意肺部、皮膚健康。',
  },
  '乙未': {
    name: '沙中金',
    element: '金',
    description: '沙土藏金，溫潤內斂。',
    personality: '溫和有才華，低調做事，善於等待時機。',
    career: '適合藝術、設計、金融等行業。',
    wealth: '財運穩定，適合穩健投資。',
    health: '注意肺部、脾胃健康。',
  },
  '丙申': {
    name: '山下火',
    element: '火',
    description: '山腳之火，溫暖實用。',
    personality: '熱情務實，有行動力，善於處理實際問題。',
    career: '適合服務、餐飲、製造等行業。',
    wealth: '財運穩定，宜腳踏實地。',
    health: '注意心臟、小腸健康。',
  },
  '丁酉': {
    name: '山下火',
    element: '火',
    description: '山下餘燼，溫和持久。',
    personality: '細膩溫和，有藝術天賦，追求品質。',
    career: '適合藝術、珠寶、設計等行業。',
    wealth: '財運平穩，重視品質生活。',
    health: '注意心血管、眼睛健康。',
  },
  '戊戌': {
    name: '平地木',
    element: '木',
    description: '平原林木，茁壯成長。',
    personality: '穩重踏實，有發展潛力，適合慢慢成長。',
    career: '適合農業、教育、管理等行業。',
    wealth: '財運穩健，宜長期發展。',
    health: '注意肝膽、脾胃健康。',
  },
  '己亥': {
    name: '平地木',
    element: '木',
    description: '沃野之木，生機勃勃。',
    personality: '溫和有智慧，善於成長，有包容心。',
    career: '適合教育、諮詢、服務等行業。',
    wealth: '財運平穩，知足常樂。',
    health: '注意肝臟、消化健康。',
  },
  '庚子': {
    name: '壁上土',
    element: '土',
    description: '牆壁之土，堅固可靠。',
    personality: '穩重守信，有責任感，適合管理工作。',
    career: '適合建築、政府、管理等行業。',
    wealth: '財運穩定，宜守財。',
    health: '注意脾胃、骨骼健康。',
  },
  '辛丑': {
    name: '壁上土',
    element: '土',
    description: '壁土厚實，安穩可靠。',
    personality: '踏實穩重，有耐心，善於積累。',
    career: '適合金融、房地產、管理等行業。',
    wealth: '財運穩健，適合長期投資。',
    health: '注意脾胃、皮膚健康。',
  },
  '壬寅': {
    name: '金箔金',
    element: '金',
    description: '金箔薄光，華麗精緻。',
    personality: '聰明有品味，注重外表，善於表達。',
    career: '適合藝術、傳媒、設計等行業。',
    wealth: '財運活絡，但需注意理財。',
    health: '注意肺部、皮膚健康。',
  },
  '癸卯': {
    name: '金箔金',
    element: '金',
    description: '金箔輕柔，柔中帶剛。',
    personality: '溫和有氣質，善於溝通，人緣好。',
    career: '適合公關、藝術、服務等行業。',
    wealth: '財運平穩，重視品質生活。',
    health: '注意呼吸系統、肝臟健康。',
  },

  // ===== 甲辰旬 =====
  '甲辰': {
    name: '覆燈火',
    element: '火',
    description: '燈火通明，照亮黑暗。',
    personality: '智慧明亮，有洞察力，善於引導他人。',
    career: '適合教育、諮詢、文化等行業。',
    wealth: '財運穩定，重視精神財富。',
    health: '注意心臟、眼睛健康。',
  },
  '乙巳': {
    name: '覆燈火',
    element: '火',
    description: '燈火溫暖，點亮希望。',
    personality: '溫和有智慧，善於照顧他人，有文藝氣質。',
    career: '適合服務、藝術、教育等行業。',
    wealth: '財運平穩，知足常樂。',
    health: '注意心血管、神經健康。',
  },
  '丙午': {
    name: '天河水',
    element: '水',
    description: '天河之水，氣勢磅礴。',
    personality: '胸襟開闊，有遠見，喜歡挑戰。',
    career: '適合國際業務、科研、航空等行業。',
    wealth: '財運起伏，需把握大機會。',
    health: '注意腎臟、心臟健康。',
  },
  '丁未': {
    name: '天河水',
    element: '水',
    description: '天河細流，深沉悠遠。',
    personality: '溫和有深度，善於思考，有哲學傾向。',
    career: '適合研究、教育、藝術等行業。',
    wealth: '財運平穩，重視精神生活。',
    health: '注意腎臟、脾胃健康。',
  },
  '戊申': {
    name: '大驛土',
    element: '土',
    description: '驛站之土，承載過客。',
    personality: '包容大度，善於交際，適合服務他人。',
    career: '適合服務、物流、房地產等行業。',
    wealth: '財運穩定，人脈即財源。',
    health: '注意脾胃、肌肉健康。',
  },
  '己酉': {
    name: '大驛土',
    element: '土',
    description: '驛土肥沃，滋養萬物。',
    personality: '溫和務實，有藝術眼光，善於經營。',
    career: '適合餐飲、藝術、服務等行業。',
    wealth: '財運平穩，宜穩健投資。',
    health: '注意脾胃、皮膚健康。',
  },
  '庚戌': {
    name: '釵釧金',
    element: '金',
    description: '首飾之金，精緻華美。',
    personality: '注重外表和品味，有審美眼光。',
    career: '適合珠寶、時尚、藝術等行業。',
    wealth: '財運活絡，善於投資奢侈品。',
    health: '注意肺部、大腸健康。',
  },
  '辛亥': {
    name: '釵釧金',
    element: '金',
    description: '飾品之金，精巧珍貴。',
    personality: '細膩有品味，追求完美，善於溝通。',
    career: '適合公關、藝術、金融等行業。',
    wealth: '財運佳，善於理財。',
    health: '注意呼吸系統、腎臟健康。',
  },
  '壬子': {
    name: '桑柘木',
    element: '木',
    description: '桑樹養蠶，實用價值高。',
    personality: '務實勤勞，有奉獻精神，善於創造價值。',
    career: '適合農業、製造、服務等行業。',
    wealth: '財運穩定，勤勞致富。',
    health: '注意肝膽、筋骨健康。',
  },
  '癸丑': {
    name: '桑柘木',
    element: '木',
    description: '桑木堅韌，耐寒耐熱。',
    personality: '堅韌務實，有耐心，適合長期耕耘。',
    career: '適合農業、教育、研究等行業。',
    wealth: '財運穩健，適合長期積累。',
    health: '注意肝臟、脾胃健康。',
  },

  // ===== 甲寅旬 =====
  '甲寅': {
    name: '大溪水',
    element: '水',
    description: '溪水奔流，活潑靈動。',
    personality: '聰明活潑，有創意，善於變通。',
    career: '適合創意、IT、諮詢等行業。',
    wealth: '財運流動，善於把握商機。',
    health: '注意腎臟、膀胱健康。',
  },
  '乙卯': {
    name: '大溪水',
    element: '水',
    description: '溪流清澈，滋潤萬物。',
    personality: '溫和善良，善於溝通，人緣好。',
    career: '適合服務、藝術、諮詢等行業。',
    wealth: '財運平穩，人和即財旺。',
    health: '注意腎臟、肝膽健康。',
  },
  '丙辰': {
    name: '沙中土',
    element: '土',
    description: '沙土鬆軟，包容萬物。',
    personality: '包容大度，適應力強，善於協調。',
    career: '適合服務、建築、諮詢等行業。',
    wealth: '財運穩定，宜穩健投資。',
    health: '注意脾胃、皮膚健康。',
  },
  '丁巳': {
    name: '沙中土',
    element: '土',
    description: '沙土溫暖，孕育生機。',
    personality: '溫和務實，有包容心，善於照顧他人。',
    career: '適合服務、教育、醫療等行業。',
    wealth: '財運平穩，知足常樂。',
    health: '注意脾胃、心臟健康。',
  },
  '戊午': {
    name: '天上火',
    element: '火',
    description: '太陽之火，光照萬物。',
    personality: '熱情開朗，有領袖氣質，喜歡成為焦點。',
    career: '適合領導、傳媒、娛樂等行業。',
    wealth: '財運起伏，需謹慎理財。',
    health: '注意心臟、眼睛健康。',
  },
  '己未': {
    name: '天上火',
    element: '火',
    description: '夕陽餘暉，溫暖祥和。',
    personality: '溫和有氣質，善於照顧他人，有藝術天賦。',
    career: '適合藝術、服務、教育等行業。',
    wealth: '財運平穩，重視家庭。',
    health: '注意心血管、脾胃健康。',
  },
  '庚申': {
    name: '石榴木',
    element: '木',
    description: '石榴多子，繁榮興旺。',
    personality: '有創造力，多才多藝，善於發展。',
    career: '適合創業、藝術、教育等行業。',
    wealth: '財運佳，有多元收入。',
    health: '注意肝膽、肺部健康。',
  },
  '辛酉': {
    name: '石榴木',
    element: '木',
    description: '石榴結實，碩果累累。',
    personality: '務實有才華，善於積累，追求品質。',
    career: '適合藝術、金融、服務等行業。',
    wealth: '財運穩定，善於理財。',
    health: '注意肝臟、呼吸系統健康。',
  },
  '壬戌': {
    name: '大海水',
    element: '水',
    description: '大海無垠，包容萬物。',
    personality: '胸襟寬廣，有大智慧，善於包容。',
    career: '適合國際業務、航運、金融等行業。',
    wealth: '財運廣闘，需大格局思維。',
    health: '注意腎臟、泌尿系統健康。',
  },
  '癸亥': {
    name: '大海水',
    element: '水',
    description: '海水深沉，智慧無窮。',
    personality: '深沉有智慧，善於思考，有哲學傾向。',
    career: '適合研究、教育、諮詢等行業。',
    wealth: '財運穩健，適合長期投資。',
    health: '注意腎臟、血液健康。',
  },
};

/**
 * 獲取納音信息
 */
export function getNaYinInfo(ganZhi: string): NaYinInfo {
  return NAYIN_TABLE[ganZhi] || {
    name: '未知',
    element: '土' as WuXing,
    description: '納音資料不完整',
    personality: '',
    career: '',
    wealth: '',
    health: '',
  };
}

/**
 * 分析四柱納音
 */
export function analyzeNaYin(chart: BaZiChart): NaYinAnalysis {
  const yearGanZhi = chart.year.gan + chart.year.zhi;
  const monthGanZhi = chart.month.gan + chart.month.zhi;
  const dayGanZhi = chart.day.gan + chart.day.zhi;
  const hourGanZhi = chart.hour.gan + chart.hour.zhi;

  const yearNaYin = getNaYinInfo(yearGanZhi);
  const monthNaYin = getNaYinInfo(monthGanZhi);
  const dayNaYin = getNaYinInfo(dayGanZhi);
  const hourNaYin = getNaYinInfo(hourGanZhi);

  // 統計納音五行
  const elementCount: Record<WuXing, number> = { '木': 0, '火': 0, '土': 0, '金': 0, '水': 0 };
  [yearNaYin, monthNaYin, dayNaYin, hourNaYin].forEach(n => {
    elementCount[n.element]++;
  });

  // 找出主導五行
  const dominantElement = (Object.entries(elementCount) as [WuXing, number][])
    .sort((a, b) => b[1] - a[1])[0][0];

  // 五行平衡分析
  const elementBalance = analyzeElementBalance(elementCount);

  // 生成總結
  const summary = generateNaYinSummary(yearNaYin, dayNaYin, dominantElement);
  const advice = generateNaYinAdvice(yearNaYin, dominantElement, elementCount);

  return {
    yearNaYin,
    monthNaYin,
    dayNaYin,
    hourNaYin,
    lifeNaYin: yearNaYin,
    dominantElement,
    elementBalance,
    summary,
    advice,
  };
}

/**
 * 分析五行平衡
 */
function analyzeElementBalance(elementCount: Record<WuXing, number>): string {
  const entries = Object.entries(elementCount) as [WuXing, number][];
  const max = Math.max(...entries.map(e => e[1]));
  const min = Math.min(...entries.map(e => e[1]));

  if (max - min <= 1) {
    return '納音五行較為平衡，命主性格均衡，適應力強。';
  }

  const dominant = entries.filter(e => e[1] === max).map(e => e[0]);
  const weak = entries.filter(e => e[1] === 0).map(e => e[0]);

  let result = `納音五行以${dominant.join('、')}為主`;
  if (weak.length > 0) {
    result += `，缺${weak.join('、')}`;
  }
  result += '。';

  return result;
}

/**
 * 生成納音總結
 */
function generateNaYinSummary(
  lifeNaYin: NaYinInfo,
  dayNaYin: NaYinInfo,
  dominantElement: WuXing
): string {
  return `本命納音為「${lifeNaYin.name}」，${lifeNaYin.description} ` +
    `日柱納音為「${dayNaYin.name}」，內在性格${dayNaYin.personality.slice(0, 20)}... ` +
    `整體納音五行以${dominantElement}為主導。`;
}

/**
 * 生成納音建議
 */
function generateNaYinAdvice(
  lifeNaYin: NaYinInfo,
  dominantElement: WuXing,
  elementCount: Record<WuXing, number>
): string[] {
  const advice: string[] = [];

  // 基於本命納音的建議
  advice.push(`本命「${lifeNaYin.name}」：${lifeNaYin.career}`);

  // 基於主導五行的建議
  const elementAdvice: Record<WuXing, string> = {
    '木': '多親近自然，綠色植物有助運勢',
    '火': '保持熱情，但注意情緒管理',
    '土': '腳踏實地，穩健發展最適合',
    '金': '注重品質，精益求精',
    '水': '善於變通，把握流動的機會',
  };
  advice.push(elementAdvice[dominantElement]);

  // 補五行建議
  const weakElements = (Object.entries(elementCount) as [WuXing, number][])
    .filter(([, count]) => count === 0)
    .map(([element]) => element);

  if (weakElements.length > 0) {
    const supplementAdvice: Record<WuXing, string> = {
      '木': '可多穿綠色、居住靠東',
      '火': '可多穿紅色、居住靠南',
      '土': '可多穿黃色、居住中央或西南',
      '金': '可多穿白色、居住靠西',
      '水': '可多穿黑色、居住靠北',
    };
    weakElements.forEach(el => {
      advice.push(`納音缺${el}，${supplementAdvice[el]}`);
    });
  }

  return advice;
}

/**
 * 獲取納音簡要
 */
export function getNaYinBrief(chart: BaZiChart): string {
  const analysis = analyzeNaYin(chart);
  return `本命納音「${analysis.lifeNaYin.name}」（${analysis.lifeNaYin.element}），${analysis.lifeNaYin.description}`;
}
