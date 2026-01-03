
import React from 'react';
import { Language } from '../types';

interface CircleGridProps {
  count: number;
  total: number;
  color: string;
  label: string;
  onCircleClick?: (isBorrowedCircle: boolean) => void;
  highlightCount?: number;
  baseCount?: number;
  isLocked?: boolean;
  lang: Language;
}

const CircleGrid: React.FC<CircleGridProps> = ({ 
  count, 
  color, 
  label, 
  onCircleClick, 
  highlightCount = 0,
  baseCount = 0,
  isLocked = false,
  lang
}) => {
  const circles = Array.from({ length: 10 }, (_, i) => i);
  const localizedLabel = lang === 'zh' ? (label === 'Left' ? '左边' : '右边') : label;
  const successMsg = lang === 'zh' ? '✨ 凑成 10 啦！' : '✨ Made 10!';

  return (
    <div className={`flex flex-col items-center p-8 bg-white rounded-[40px] shadow-2xl border-4 ${isLocked && label === 'Left' ? 'border-green-400' : 'border-slate-100'} transition-all w-full`}>
      <h3 className="text-3xl font-black mb-6 text-slate-700 kids-font">{localizedLabel}: <span className="text-5xl">{count}</span></h3>
      <div className="grid grid-cols-5 gap-4 bg-slate-100 p-6 rounded-[30px] border-4 border-dashed border-slate-300">
        {circles.map((i) => {
          const isActive = i < count;
          const isBorrowed = highlightCount > 0 && i >= baseCount && i < count;
          
          return (
            <div
              key={i}
              onClick={() => {
                if (isActive && onCircleClick) {
                  onCircleClick(isBorrowed);
                }
              }}
              className={`w-16 h-16 md:w-20 md:h-20 rounded-full transition-all duration-300 border-4 flex items-center justify-center ${
                isActive 
                  ? `${isBorrowed ? 'bg-orange-500 border-orange-700' : color + ' border-blue-700'} ${onCircleClick ? 'cursor-pointer hover:scale-110 active:scale-90' : 'scale-100'}` 
                  : 'bg-white border-slate-200'
              } ${isBorrowed ? 'animate-pulse shadow-[0_0_20px_rgba(249,115,22,0.6)]' : ''}`}
            >
              {isActive && <div className="w-6 h-6 rounded-full bg-white opacity-50"></div>}
            </div>
          );
        })}
      </div>
      <div className="mt-4 h-6">
        {isLocked && label === 'Left' && count === 10 && (
          <span className="text-green-600 font-bold text-xl animate-bounce flex items-center gap-2">
            {successMsg}
          </span>
        )}
      </div>
    </div>
  );
};

export default CircleGrid;
