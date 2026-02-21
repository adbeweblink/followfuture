'use client';

import { useState, useRef, useEffect, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Info, X } from 'lucide-react';

interface TooltipProps {
  term: string;
  children: ReactNode;
  className?: string;
}

// 八字術語詞典
const BAZI_GLOSSARY: Record<string, { title: string; description: string; category: string }> = {
  // 十神
  '比肩': {
    title: '比肩',
    description: '與日主同性同五行的天干。代表兄弟姐妹、朋友、同事等平輩關係。性格上表現為獨立、自信、競爭意識強。',
    category: '十神',
  },
  '劫財': {
    title: '劫財',
    description: '與日主異性同五行的天干。代表競爭者、合作者。性格上表現為積極、冒險、善於交際，但也可能衝動。',
    category: '十神',
  },
  '食神': {
    title: '食神',
    description: '日主所生的同性天干。代表才華、口福、子女（女命）。性格上表現為溫和、樂觀、有藝術天賦、享受生活。',
    category: '十神',
  },
  '傷官': {
    title: '傷官',
    description: '日主所生的異性天干。代表創意、表達、叛逆。性格上表現為聰明、創新、口才好，但可能過於自負。',
    category: '十神',
  },
  '偏財': {
    title: '偏財',
    description: '日主所剋的異性天干。代表意外之財、父親、情人。性格上表現為慷慨、交際廣、善於把握機會。',
    category: '十神',
  },
  '正財': {
    title: '正財',
    description: '日主所剋的同性天干。代表正當收入、妻子（男命）。性格上表現為務實、節儉、重視家庭。',
    category: '十神',
  },
  '七殺': {
    title: '七殺（偏官）',
    description: '剋日主的異性天干。代表壓力、競爭、權威。性格上表現為果斷、有魄力、領導力強，但也可能過於強勢。',
    category: '十神',
  },
  '正官': {
    title: '正官',
    description: '剋日主的同性天干。代表規矩、上司、丈夫（女命）。性格上表現為正直、守規矩、有責任感。',
    category: '十神',
  },
  '偏印': {
    title: '偏印（梟神）',
    description: '生日主的異性天干。代表偏門學問、繼母。性格上表現為獨特思維、興趣廣泛，但可能孤僻。',
    category: '十神',
  },
  '正印': {
    title: '正印',
    description: '生日主的同性天干。代表母親、貴人、學業。性格上表現為仁慈、有學識、受人尊重。',
    category: '十神',
  },

  // 地支關係
  '六合': {
    title: '六合',
    description: '子丑合、寅亥合、卯戌合、辰酉合、巳申合、午未合。六合為最吉的關係，代表和諧、融洽、貴人相助。合化後力量增強。',
    category: '地支關係',
  },
  '三合': {
    title: '三合局',
    description: '申子辰合水、亥卯未合木、寅午戌合火、巳酉丑合金。三合為大吉，三方力量匯聚，主大事可成。',
    category: '地支關係',
  },
  '半合': {
    title: '半合',
    description: '三合局的兩個地支。力量雖不如三合完整，但仍有合化傾向，屬於吉象。',
    category: '地支關係',
  },
  '六沖': {
    title: '六沖',
    description: '子午沖、丑未沖、寅申沖、卯酉沖、辰戌沖、巳亥沖。六沖為正面衝突，主變動、分離、動盪。但有時也代表突破。',
    category: '地支關係',
  },
  '三刑': {
    title: '三刑',
    description: '寅巳申三刑、丑戌未三刑、子卯刑。三刑主是非、官司、疾病、意外。需特別注意對應的流年。',
    category: '地支關係',
  },
  '六害': {
    title: '六害（穿害）',
    description: '子未害、丑午害、寅巳害、卯辰害、申亥害、酉戌害。六害為暗中傷害，主小人、阻礙、不順。',
    category: '地支關係',
  },
  '暗合': {
    title: '暗合',
    description: '地支藏干之間的天干五合關係。表面不顯，暗中有助力或牽連。',
    category: '地支關係',
  },

  // 格局
  '正官格': {
    title: '正官格',
    description: '月令藏干透出正官，且正官得用。此格主正直守法、有官運、受人尊重。宜從事公職或管理工作。',
    category: '格局',
  },
  '七殺格': {
    title: '七殺格',
    description: '月令藏干透出七殺，且七殺得制化。此格主有魄力、能擔大任。宜從事軍警、創業等需魄力的工作。',
    category: '格局',
  },
  '正印格': {
    title: '正印格',
    description: '月令藏干透出正印，且正印得用。此格主聰明好學、有貴人緣。宜從事學術、教育等工作。',
    category: '格局',
  },
  '偏印格': {
    title: '偏印格',
    description: '月令藏干透出偏印，且偏印得用。此格主思維獨特、有特殊才能。宜從事研究、技術等專門領域。',
    category: '格局',
  },
  '正財格': {
    title: '正財格',
    description: '月令藏干透出正財，且正財得用。此格主勤儉持家、善於理財。宜從事財務、商業等穩健工作。',
    category: '格局',
  },
  '偏財格': {
    title: '偏財格',
    description: '月令藏干透出偏財，且偏財得用。此格主交際廣、善於投資。宜從事貿易、業務等靈活工作。',
    category: '格局',
  },
  '食神格': {
    title: '食神格',
    description: '月令藏干透出食神，且食神得用。此格主福氣、口才、藝術天賦。宜從事餐飲、藝術、教育等工作。',
    category: '格局',
  },
  '傷官格': {
    title: '傷官格',
    description: '月令藏干透出傷官，且傷官得用。此格主聰明、創意、口才。宜從事創作、演說、技術創新等工作。',
    category: '格局',
  },

  // 身強身弱
  '身強': {
    title: '身強',
    description: '日主得令、得地、得助，力量充足。身強者宜洩（食傷）、宜剋（財）、宜官殺。適合主動出擊、創業開拓。',
    category: '強弱',
  },
  '身弱': {
    title: '身弱',
    description: '日主失令、失地、失助，力量不足。身弱者宜印（生扶）、宜比劫（幫扶）。適合借力使力、依附發展。',
    category: '強弱',
  },
  '身旺': {
    title: '身旺',
    description: '日主力量較強，介於身強與中和之間。有足夠能量發揮，但不至於過度。',
    category: '強弱',
  },
  '中和': {
    title: '中和',
    description: '日主與其他五行力量相當，達到平衡狀態。此為最佳狀態，各方面發展均衡。',
    category: '強弱',
  },

  // 五行
  '木': {
    title: '木（五行）',
    description: '方位東方，季節春天，顏色青綠。代表生長、仁慈、創新。木旺者性格正直、有愛心，但可能固執。',
    category: '五行',
  },
  '火': {
    title: '火（五行）',
    description: '方位南方，季節夏天，顏色紅色。代表熱情、禮儀、光明。火旺者性格熱情、有感染力，但可能急躁。',
    category: '五行',
  },
  '土': {
    title: '土（五行）',
    description: '方位中央，季節四季末，顏色黃色。代表穩重、信用、包容。土旺者性格穩重、守信，但可能保守。',
    category: '五行',
  },
  '金': {
    title: '金（五行）',
    description: '方位西方，季節秋天，顏色白色。代表果斷、義氣、肅殺。金旺者性格剛毅、有魄力，但可能過於嚴厲。',
    category: '五行',
  },
  '水': {
    title: '水（五行）',
    description: '方位北方，季節冬天，顏色黑色。代表智慧、靈活、包容。水旺者性格聰慧、善變通，但可能過於圓滑。',
    category: '五行',
  },

  // 用神喜忌
  '喜用神': {
    title: '喜用神',
    description: '對命局有利的五行或十神。喜用神旺則運勢佳，遇喜用神流年則諸事順遂。應多接近喜用神對應的方位、顏色、行業。',
    category: '用神',
  },
  '忌神': {
    title: '忌神',
    description: '對命局不利的五行或十神。忌神旺則運勢差，遇忌神流年則需謹慎。應避開忌神對應的方位、顏色、行業。',
    category: '用神',
  },

  // 大運流年
  '大運': {
    title: '大運',
    description: '每十年一個階段的運勢週期。大運從月柱推算，順行或逆行取決於陰陽與性別。大運代表人生大方向的轉變。',
    category: '運勢',
  },
  '流年': {
    title: '流年',
    description: '每一年的運勢。流年與命局、大運交互作用，決定該年的吉凶禍福。重要的流年有合、沖、刑、害等關係。',
    category: '運勢',
  },
  '流月': {
    title: '流月',
    description: '每個月的運勢變化。流月較流年影響小，但對短期決策有參考價值。',
    category: '運勢',
  },
};

// Tooltip 內容面板
function TooltipPanel({ term, onClose }: { term: string; onClose: () => void }) {
  const glossary = BAZI_GLOSSARY[term];

  if (!glossary) return null;

  const categoryColors: Record<string, string> = {
    '十神': 'from-violet-500 to-purple-500',
    '地支關係': 'from-rose-500 to-pink-500',
    '格局': 'from-amber-500 to-orange-500',
    '強弱': 'from-blue-500 to-cyan-500',
    '五行': 'from-emerald-500 to-teal-500',
    '用神': 'from-indigo-500 to-blue-500',
    '運勢': 'from-sky-500 to-blue-500',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className="absolute z-50 w-72 sm:w-80 bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden"
      style={{ bottom: '100%', left: '50%', transform: 'translateX(-50%)', marginBottom: '8px' }}
    >
      {/* 標題 */}
      <div className={`px-4 py-3 bg-gradient-to-r ${categoryColors[glossary.category] || 'from-slate-500 to-slate-600'}`}>
        <div className="flex items-center justify-between">
          <div>
            <span className="text-white/70 text-xs">{glossary.category}</span>
            <h4 className="text-white font-bold">{glossary.title}</h4>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
          >
            <X className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>

      {/* 內容 */}
      <div className="p-4">
        <p className="text-sm text-slate-700 leading-relaxed">
          {glossary.description}
        </p>
      </div>

      {/* 小三角 */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full">
        <div className="w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-white" />
      </div>
    </motion.div>
  );
}

// 主要 Tooltip 元件
export function GlossaryTerm({ term, children, className = '' }: TooltipProps) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  // 點擊外部關閉
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const hasGlossary = BAZI_GLOSSARY[term];

  if (!hasGlossary) {
    return <span className={className}>{children}</span>;
  }

  return (
    <span ref={ref} className="relative inline-block">
      <span
        onClick={() => setIsOpen(!isOpen)}
        className={`
          cursor-help border-b border-dashed border-slate-400 hover:border-violet-500
          hover:text-violet-600 transition-colors
          ${className}
        `}
      >
        {children}
        <Info className="inline-block w-3 h-3 ml-0.5 opacity-50" />
      </span>

      <AnimatePresence>
        {isOpen && <TooltipPanel term={term} onClose={() => setIsOpen(false)} />}
      </AnimatePresence>
    </span>
  );
}

// 簡易版 - 只顯示 hover 效果
export function TermHint({ term, children, className = '' }: TooltipProps) {
  const glossary = BAZI_GLOSSARY[term];

  if (!glossary) {
    return <span className={className}>{children}</span>;
  }

  return (
    <span
      className={`
        cursor-help border-b border-dotted border-slate-300
        hover:border-violet-500 hover:text-violet-600 transition-colors
        ${className}
      `}
      title={glossary.description}
    >
      {children}
    </span>
  );
}

export default GlossaryTerm;
