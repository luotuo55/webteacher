import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface NavigationProps {
  onNext: () => void;
  onPrev: () => void;
  isFirst: boolean;
  isLast: boolean;
}

const Navigation: React.FC<NavigationProps> = ({ onNext, onPrev, isFirst, isLast }) => {
  return (
    <div className="fixed bottom-0 left-0 w-full p-6 flex justify-between items-center pointer-events-none px-12 md:px-24 z-20">
      <button 
        onClick={onPrev}
        disabled={isFirst}
        className={`pointer-events-auto flex items-center gap-3 px-10 py-5 rounded-2xl font-bold shadow-xl transition-all hover:scale-105 active:scale-95 text-xl ${
          isFirst ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-white text-green-600 hover:bg-green-50 border-2 border-green-100'
        }`}
      >
        <ChevronLeft size={32} />
        上一步
      </button>

      <button 
        onClick={onNext}
        disabled={isLast}
        className={`pointer-events-auto flex items-center gap-3 px-10 py-5 rounded-2xl font-bold shadow-xl text-white transition-all hover:scale-105 active:scale-95 text-xl ${
          isLast ? 'bg-gray-300 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
        }`}
      >
        下一步
        <ChevronRight size={32} />
      </button>
    </div>
  );
};

export default Navigation;