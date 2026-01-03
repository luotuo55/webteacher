import React from 'react';
import { RefreshCw, TrendingUp } from 'lucide-react';

interface SummaryStageProps {
  onRestart: () => void;
}

const SummaryStage: React.FC<SummaryStageProps> = ({ onRestart }) => {
  return (
    <div className="flex flex-col h-full space-y-6 text-center">
      <div className="flex flex-col items-center justify-center flex-1 space-y-8 animate-fade-in-up">
        <h2 className="text-4xl font-bold text-green-600 font-handwriting">
          闯关成功！
        </h2>
        
        <div className="bg-yellow-50 p-8 rounded-2xl border-2 border-yellow-200 max-w-2xl w-full text-left space-y-4">
          <h3 className="text-xl font-bold text-yellow-800 border-b border-yellow-200 pb-2">我们的收获秘籍：</h3>
          <ul className="space-y-3 text-lg text-slate-700">
            <li className="flex items-center gap-2">
              <span className="bg-green-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm">1</span>
              <span><strong>看大数，分小数</strong>：看到9，把另一个数分成1和几。</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="bg-green-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm">2</span>
              <span><strong>凑成十</strong>：9 + 1 = 10，变成老朋友。</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="bg-green-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm">3</span>
              <span><strong>转化思想</strong>：把没学过的变成学过的。</span>
            </li>
          </ul>
        </div>

        <div className="bg-blue-50 p-6 rounded-xl border border-blue-100 max-w-xl w-full">
           <div className="flex items-center justify-center gap-2 text-blue-600 font-bold mb-4">
             <TrendingUp />
             <span>思考挑战</span>
           </div>
           <p className="text-lg text-slate-700 mb-4">
             如果下一节课学 <strong>8 + 5</strong>，你会怎么算？
           </p>
           <div className="flex justify-center gap-4">
              <div className="bg-white px-4 py-2 rounded shadow text-slate-500 text-sm">
                8需要几凑成10？
              </div>
              <div className="bg-white px-4 py-2 rounded shadow text-slate-500 text-sm">
                5要分成几和几？
              </div>
           </div>
        </div>
      </div>

      <div className="pb-8">
        <button 
          onClick={onRestart}
          className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-full font-bold shadow-lg flex items-center gap-2 mx-auto transition-transform hover:scale-105"
        >
          <RefreshCw size={20} />
          再玩一次
        </button>
      </div>
    </div>
  );
};

export default SummaryStage;