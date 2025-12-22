
import React, { useState } from 'react';
import { RefreshCcw, ChevronLeft, ChevronRight } from 'lucide-react';

const TryStage: React.FC = () => {
  const [addend2, setAddend2] = useState(5);
  const [branchStep, setBranchStep] = useState(0);

  const resetBranch = () => {
    setBranchStep(0);
  };

  const changeAddend = (delta: number) => {
    const newVal = Math.max(2, Math.min(9, addend2 + delta));
    setAddend2(newVal);
    setBranchStep(0);
  };

  const result = 9 + addend2;
  const split1 = 1;
  const split2 = addend2 - 1;

  return (
    <div className="flex flex-col min-h-full space-y-4">
      {/* Header */}
      <div className="flex items-center gap-4 border-b pb-4">
        <div className="bg-orange-100 p-2 rounded-lg text-orange-700 font-bold">自主尝试</div>
        <h2 className="text-2xl font-bold text-slate-700 font-handwriting">我也会“凑十法”</h2>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-4">
        {/* Adjustment Controls */}
        <div className="flex items-center gap-8 mb-8 bg-slate-50 p-6 rounded-[2.5rem] border-2 border-slate-100 shadow-sm">
           <div className="text-4xl font-black text-slate-700 font-mono">9 +</div>
           <div className="flex items-center gap-4">
              <button 
                onClick={() => changeAddend(-1)}
                className="p-3 bg-white rounded-full shadow-md hover:bg-orange-50 text-orange-500 transition-all active:scale-90 border border-slate-100"
              >
                <ChevronLeft size={32} />
              </button>
              <div className="w-20 text-center text-6xl font-black text-orange-600 font-mono">
                {addend2}
              </div>
              <button 
                onClick={() => changeAddend(1)}
                className="p-3 bg-white rounded-full shadow-md hover:bg-orange-50 text-orange-500 transition-all active:scale-90 border border-slate-100"
              >
                <ChevronRight size={32} />
              </button>
           </div>
           <div className="text-4xl font-black text-slate-300 font-mono">= ?</div>
        </div>

        {/* Interaction Stage */}
        <div className="bg-white p-6 md:p-8 rounded-[3rem] shadow-2xl border-4 border-slate-100 w-full max-w-5xl relative min-h-[500px] flex flex-col items-center">
           
           <div className="w-full h-[380px] md:h-[420px] flex-shrink-0">
             <svg viewBox="0 0 1000 450" className="w-full h-full font-mono">
                {/* Top Level: 9 + X = [ ] - Content Shifted Down and Left as in MethodStage */}
                <text x="100" y="130" textAnchor="middle" fontSize="120" fontWeight="900" fill="#1e293b">9</text>
                <text x="200" y="130" textAnchor="middle" fontSize="80" fontWeight="900" fill="#94a3b8">+</text>
                <text x="300" y="130" textAnchor="middle" fontSize="120" fontWeight="900" fill="#1e293b">{addend2}</text>
                <text x="400" y="130" textAnchor="middle" fontSize="80" fontWeight="900" fill="#94a3b8">=</text>
                
                {/* Answer Box */}
                <rect x="470" y="30" width="130" height="130" fill="#f8fafc" stroke="#1e293b" strokeWidth="6" />
                {branchStep >= 4 && (
                  <text x="535" y="130" textAnchor="middle" fontSize="100" fontWeight="900" fill="#ea580c" className="animate-bounce-in">{result}</text>
                )}

                {/* Branching from X (Step 1+) */}
                {branchStep >= 1 && (
                  <g className="animate-fade-in">
                    <line x1="300" y1="160" x2="250" y2="230" stroke="#334155" strokeWidth="6" strokeLinecap="round" className="animate-draw-line" />
                    <line x1="300" y1="160" x2="350" y2="230" stroke="#334155" strokeWidth="6" strokeLinecap="round" className="animate-draw-line" style={{animationDelay: '0.2s'}} />
                    <text x="250" y="300" textAnchor="middle" fontSize="80" fontWeight="900" fill="#1e293b" className="animate-fade-in-up">{split1}</text>
                    <text x="350" y="300" textAnchor="middle" fontSize="80" fontWeight="900" fill="#1e293b" className="animate-fade-in-up">{split2}</text>
                  </g>
                )}

                {/* Connecting Bracket (Step 2+) */}
                {branchStep >= 2 && (
                  <g className="animate-fade-in">
                    <path d="M 100,160 L 100,360 L 250,360 L 250,320" fill="none" stroke="#334155" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" className="animate-draw-line-long" />
                    <text x="175" y="415" textAnchor="middle" fontSize="70" fontWeight="900" fill="#ef4444" className="animate-scale-up">10</text>
                  </g>
                )}

                {/* Thought Prompt (Step 3+) */}
                {branchStep >= 3 && (
                  <g className="animate-fade-in-left">
                     <text x="620" y="210" fontSize="55" fontWeight="bold" fill="#ef4444" style={{fontFamily: "'ZCOOL KuaiLe', cursive"}}>想：9 加 1 得 10，</text>
                     <text x="670" y="300" fontSize="55" fontWeight="bold" fill="#ef4444" style={{fontFamily: "'ZCOOL KuaiLe', cursive"}}>10 加 {split2} 得 {result}。</text>
                  </g>
                )}
             </svg>
           </div>

           {/* Controls */}
           <div className="w-full flex justify-center gap-6 mt-4">
              <button 
                onClick={() => setBranchStep(prev => Math.min(prev + 1, 4))}
                disabled={branchStep >= 4}
                className={`px-16 py-4 bg-orange-500 hover:bg-orange-600 text-white rounded-full font-black text-2xl shadow-xl transition-all ${branchStep >= 4 ? 'opacity-50 cursor-not-allowed' : 'animate-bounce'}`}
              >
                {branchStep === 0 ? "开始凑十" : branchStep === 4 ? "演示完成" : "演示下一步"}
              </button>
              <button 
                onClick={resetBranch}
                className="p-4 bg-slate-100 text-slate-500 hover:text-orange-500 rounded-full shadow-md transition-transform active:rotate-180"
              >
                <RefreshCcw size={32} />
              </button>
           </div>
        </div>

        <div className="mt-8 text-slate-400 font-bold italic">
          改变上面的数字，看看“凑十法”是怎么算的吧！
        </div>
      </div>

      <style>{`
        /* Reuse common animations */
        @keyframes draw-line {
          from { stroke-dasharray: 100; stroke-dashoffset: 100; opacity: 0; }
          to { stroke-dasharray: 100; stroke-dashoffset: 0; opacity: 1; }
        }
        .animate-draw-line {
          stroke-dasharray: 100;
          stroke-dashoffset: 100;
          animation: draw-line 0.5s ease-out forwards;
        }

        @keyframes draw-line-long {
          from { stroke-dasharray: 800; stroke-dashoffset: 800; opacity: 0; }
          to { stroke-dasharray: 800; stroke-dashoffset: 0; opacity: 1; }
        }
        .animate-draw-line-long {
          stroke-dasharray: 800;
          stroke-dashoffset: 800;
          animation: draw-line-long 1s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }

        @keyframes fade-in-left {
          from { opacity: 0; transform: translateX(30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .animate-fade-in-left {
          animation: fade-in-left 0.7s ease-out forwards;
        }

        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.5s ease-out forwards;
        }

        @keyframes scale-up {
          0% { transform: scale(0.9); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        .animate-scale-up {
          animation: scale-up 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }

        @keyframes bounce-in {
          0% { transform: scale(0.3); opacity: 0; }
          50% { transform: scale(1.1); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
        .animate-bounce-in {
          animation: bounce-in 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }

        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.4s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default TryStage;
