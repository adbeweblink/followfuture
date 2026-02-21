'use client';

import { motion } from 'framer-motion';

// 煙霧效果背景
export function SmokeBackground({ className = '' }: { className?: string }) {
  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {/* 煙霧層 1 */}
      <motion.div
        initial={{ opacity: 0, x: -100 }}
        animate={{ opacity: 0.3, x: 100 }}
        transition={{ duration: 20, repeat: Infinity, repeatType: 'reverse', ease: 'linear' }}
        className="absolute top-0 left-0 w-96 h-96 bg-gradient-radial from-amber-200/30 via-transparent to-transparent rounded-full blur-3xl"
      />
      {/* 煙霧層 2 */}
      <motion.div
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 0.2, x: -50 }}
        transition={{ duration: 15, repeat: Infinity, repeatType: 'reverse', ease: 'linear', delay: 2 }}
        className="absolute bottom-0 right-0 w-80 h-80 bg-gradient-radial from-rose-200/20 via-transparent to-transparent rounded-full blur-3xl"
      />
      {/* 煙霧層 3 */}
      <motion.div
        initial={{ opacity: 0.1, y: 50 }}
        animate={{ opacity: 0.25, y: -50 }}
        transition={{ duration: 18, repeat: Infinity, repeatType: 'reverse', ease: 'linear', delay: 5 }}
        className="absolute top-1/2 left-1/3 w-64 h-64 bg-gradient-radial from-purple-200/20 via-transparent to-transparent rounded-full blur-3xl"
      />
    </div>
  );
}

// 太極圖
export function TaijiSymbol({ size = 80, className = '' }: { size?: number; className?: string }) {
  const half = size / 2;
  const quarter = size / 4;
  const eighth = size / 8;

  return (
    <motion.svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className={className}
      initial={{ rotate: 0 }}
      animate={{ rotate: 360 }}
      transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
    >
      {/* 外圓 */}
      <circle cx={half} cy={half} r={half - 2} fill="none" stroke="currentColor" strokeWidth="1" opacity="0.2" />

      {/* 陽（白） */}
      <path
        d={`M ${half} 0 A ${half} ${half} 0 0 1 ${half} ${size} A ${quarter} ${quarter} 0 0 0 ${half} ${half} A ${quarter} ${quarter} 0 0 1 ${half} 0`}
        fill="white"
        stroke="currentColor"
        strokeWidth="0.5"
      />

      {/* 陰（黑） */}
      <path
        d={`M ${half} 0 A ${half} ${half} 0 0 0 ${half} ${size} A ${quarter} ${quarter} 0 0 1 ${half} ${half} A ${quarter} ${quarter} 0 0 0 ${half} 0`}
        fill="currentColor"
        opacity="0.8"
      />

      {/* 陰中有陽 */}
      <circle cx={half} cy={quarter} r={eighth} fill="currentColor" opacity="0.8" />

      {/* 陽中有陰 */}
      <circle cx={half} cy={half + quarter} r={eighth} fill="white" />
    </motion.svg>
  );
}

// 印章效果
export function SealStamp({
  text,
  size = 'md',
  variant = 'red',
  className = ''
}: {
  text: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'red' | 'gold' | 'dark';
  className?: string;
}) {
  const sizeClasses = {
    sm: 'w-12 h-12 text-[8px]',
    md: 'w-16 h-16 text-[10px]',
    lg: 'w-20 h-20 text-xs',
  };

  const variantClasses = {
    red: 'border-red-600 text-red-600',
    gold: 'border-amber-600 text-amber-600',
    dark: 'border-slate-700 text-slate-700',
  };

  // 將文字分成兩行顯示（如果有4個字）
  const lines = text.length === 4
    ? [text.slice(0, 2), text.slice(2, 4)]
    : text.length === 2
    ? [text[0], text[1]]
    : [text];

  return (
    <motion.div
      initial={{ scale: 0, rotate: -15 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ type: 'spring', duration: 0.5 }}
      className={`
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        border-2 rounded-sm
        flex flex-col items-center justify-center
        font-serif font-bold tracking-widest
        opacity-80
        ${className}
      `}
      style={{
        // 仿印章的斑駁效果
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.08'/%3E%3C/svg%3E")`,
      }}
    >
      {lines.map((line, i) => (
        <span key={i} className="leading-tight">{line}</span>
      ))}
    </motion.div>
  );
}

// 裝飾性分隔線（帶雲紋）
export function CloudDivider({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center gap-4 py-4 ${className}`}>
      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent" />
      <div className="flex items-center gap-2 text-slate-300">
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
          <path d="M3 15c0-2.21 1.79-4 4-4 .34 0 .67.04.99.12C8.63 9.27 10.66 8 13 8c2.76 0 5 2.24 5 5h1c1.66 0 3 1.34 3 3s-1.34 3-3 3H7c-2.21 0-4-1.79-4-4z" opacity="0.3" />
        </svg>
        <span className="text-xs font-serif">☯</span>
        <svg className="w-6 h-6 scale-x-[-1]" viewBox="0 0 24 24" fill="currentColor">
          <path d="M3 15c0-2.21 1.79-4 4-4 .34 0 .67.04.99.12C8.63 9.27 10.66 8 13 8c2.76 0 5 2.24 5 5h1c1.66 0 3 1.34 3 3s-1.34 3-3 3H7c-2.21 0-4-1.79-4-4z" opacity="0.3" />
        </svg>
      </div>
      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent" />
    </div>
  );
}

// 山水畫風格背景
export function LandscapeBackground({ className = '' }: { className?: string }) {
  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none opacity-[0.03] ${className}`}>
      {/* 遠山 */}
      <svg className="absolute bottom-0 w-full h-48" viewBox="0 0 400 100" preserveAspectRatio="none">
        <path
          d="M0,100 L0,60 Q50,40 100,55 Q150,70 200,45 Q250,20 300,50 Q350,80 400,40 L400,100 Z"
          fill="currentColor"
        />
      </svg>
      {/* 近山 */}
      <svg className="absolute bottom-0 w-full h-32" viewBox="0 0 400 100" preserveAspectRatio="none">
        <path
          d="M0,100 L0,70 Q80,50 150,65 Q220,80 280,55 Q340,30 400,60 L400,100 Z"
          fill="currentColor"
          opacity="0.5"
        />
      </svg>
    </div>
  );
}

// 八卦裝飾
export function BaguaCorner({ position = 'top-right', className = '' }: { position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'; className?: string }) {
  const positionClasses = {
    'top-left': 'top-4 left-4',
    'top-right': 'top-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'bottom-right': 'bottom-4 right-4',
  };

  return (
    <div className={`absolute ${positionClasses[position]} opacity-10 ${className}`}>
      <motion.div
        initial={{ rotate: 0 }}
        animate={{ rotate: 360 }}
        transition={{ duration: 120, repeat: Infinity, ease: 'linear' }}
      >
        <svg width="60" height="60" viewBox="0 0 60 60" fill="currentColor">
          {/* 八卦線條簡化版 */}
          <g transform="translate(30, 30)">
            {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
              <g key={i} transform={`rotate(${angle})`}>
                <rect x="20" y="-2" width="8" height="4" rx="1" />
              </g>
            ))}
          </g>
          <circle cx="30" cy="30" r="15" fill="none" stroke="currentColor" strokeWidth="1" />
        </svg>
      </motion.div>
    </div>
  );
}

// 重點 Callout 區塊（帶東方風格）
export function InsightCallout({
  title,
  children,
  variant = 'default',
  icon,
  className = ''
}: {
  title?: string;
  children: React.ReactNode;
  variant?: 'default' | 'warning' | 'success' | 'fortune';
  icon?: React.ReactNode;
  className?: string;
}) {
  const variants = {
    default: {
      bg: 'bg-gradient-to-br from-amber-50 via-orange-50 to-amber-50',
      border: 'border-amber-200',
      accent: 'from-amber-500 to-orange-500',
      text: 'text-amber-900',
    },
    warning: {
      bg: 'bg-gradient-to-br from-rose-50 via-red-50 to-rose-50',
      border: 'border-rose-200',
      accent: 'from-rose-500 to-red-500',
      text: 'text-rose-900',
    },
    success: {
      bg: 'bg-gradient-to-br from-emerald-50 via-teal-50 to-emerald-50',
      border: 'border-emerald-200',
      accent: 'from-emerald-500 to-teal-500',
      text: 'text-emerald-900',
    },
    fortune: {
      bg: 'bg-gradient-to-br from-violet-50 via-purple-50 to-violet-50',
      border: 'border-violet-200',
      accent: 'from-violet-500 to-purple-500',
      text: 'text-violet-900',
    },
  };

  const v = variants[variant];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`
        relative overflow-hidden
        ${v.bg} ${v.border}
        border rounded-2xl p-5
        ${className}
      `}
    >
      {/* 左側裝飾條 */}
      <div className={`absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b ${v.accent}`} />

      {/* 背景裝飾 */}
      <div className="absolute top-2 right-2 opacity-5">
        <TaijiSymbol size={40} />
      </div>

      <div className="relative">
        {title && (
          <div className="flex items-center gap-2 mb-2">
            {icon && <span className="text-lg">{icon}</span>}
            <h4 className={`font-bold ${v.text}`}>{title}</h4>
          </div>
        )}
        <div className={`text-sm leading-relaxed ${v.text}`}>
          {children}
        </div>
      </div>
    </motion.div>
  );
}

// 數字統計卡片（帶百分比對比）
export function StatCard({
  label,
  value,
  unit = '',
  percentile,
  trend,
  icon,
  color = 'amber',
  className = '',
}: {
  label: string;
  value: number | string;
  unit?: string;
  percentile?: number; // 0-100，表示「超過 X% 的人」
  trend?: 'up' | 'down' | 'neutral';
  icon?: React.ReactNode;
  color?: 'amber' | 'rose' | 'emerald' | 'violet' | 'blue';
  className?: string;
}) {
  const colors = {
    amber: { bg: 'bg-amber-500', light: 'bg-amber-100', text: 'text-amber-600' },
    rose: { bg: 'bg-rose-500', light: 'bg-rose-100', text: 'text-rose-600' },
    emerald: { bg: 'bg-emerald-500', light: 'bg-emerald-100', text: 'text-emerald-600' },
    violet: { bg: 'bg-violet-500', light: 'bg-violet-100', text: 'text-violet-600' },
    blue: { bg: 'bg-blue-500', light: 'bg-blue-100', text: 'text-blue-600' },
  };

  const c = colors[color];

  return (
    <div className={`p-4 bg-white rounded-xl border border-slate-100 shadow-sm ${className}`}>
      <div className="flex items-start justify-between mb-3">
        <div className={`p-2 rounded-lg ${c.light}`}>
          {icon || <span className={`text-lg ${c.text}`}>📊</span>}
        </div>
        {trend && (
          <span className={`text-xs px-2 py-0.5 rounded-full ${
            trend === 'up' ? 'bg-emerald-100 text-emerald-600' :
            trend === 'down' ? 'bg-rose-100 text-rose-600' :
            'bg-slate-100 text-slate-600'
          }`}>
            {trend === 'up' ? '↑ 上升' : trend === 'down' ? '↓ 下降' : '— 持平'}
          </span>
        )}
      </div>

      <div className="text-2xl font-bold text-slate-800 mb-1">
        {value}
        {unit && <span className="text-sm font-normal text-slate-500 ml-1">{unit}</span>}
      </div>

      <div className="text-xs text-slate-500 mb-2">{label}</div>

      {percentile !== undefined && (
        <div className="mt-3 pt-3 border-t border-slate-100">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-slate-400">相對位置</span>
            <span className={c.text}>超過 {percentile}% 的人</span>
          </div>
          <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${percentile}%` }}
              transition={{ duration: 1, delay: 0.3 }}
              className={`h-full ${c.bg} rounded-full`}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default {
  SmokeBackground,
  TaijiSymbol,
  SealStamp,
  CloudDivider,
  LandscapeBackground,
  BaguaCorner,
  InsightCallout,
  StatCard,
};
