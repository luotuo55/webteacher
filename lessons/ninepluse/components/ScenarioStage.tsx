import React, { useState } from 'react';
import { Milk, Calculator, RefreshCcw, CheckCircle2 } from 'lucide-react';

const ScenarioStage: React.FC = () => {
  const [milkMoved, setMilkMoved] = useState(false);
  const [showEquation, setShowEquation] = useState(false);

  const handleReset = () => {
    setMilkMoved(false);
    setShowEquation(false);
  };

  return (
    <div className="flex flex-col h-full space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4 border-b pb-4">
        <div className="bg-blue-100 p-2 rounded-lg text-blue-700 font-bold">第二关</div>
        <h2 className="text-2xl font-bold text-slate-700 font-handwriting">运动会分牛奶</h2>
      </div>

      <div className="flex-1 flex flex-col items-center justify-start p-4 space-y-8">
         {/* Question Area */}
         <div className="text-2xl md:text-3xl text-center max-w-2xl font-bold text-slate-700 bg-white/50 px-8 py-4 rounded-3xl border-2 border-slate-100 shadow-sm">
           盒子里有 <span className="text-blue-600">9</span> 盒牛奶，外面有 <span className="text-green-600">4</span> 盒。
           <br/>
           <span className="text-slate-500 text-xl mt-2 block">一共有多少盒？ <span className="font-mono bg-blue-50 text-blue-600 px-4 py-1 rounded-xl border border-blue-100">9 + 4 = ?</span></span>
         </div>

         {/* Interactive Visual Area (Always Visible) */}
         <div className="relative w-full max-w-5xl bg-amber-50 rounded-[3rem] border-b-[12px] border-amber-200 shadow-xl flex flex-col items-center p-8 gap-8 overflow-hidden transition-all duration-500">
            
            <div className="flex flex-wrap items-center justify-center gap-12 md:gap-20 w-full">
              {/* The Box (Crate) */}
              <div className="relative bg-white border-4 border-blue-200 rounded-[2rem] p-6 w-80 h-64 shadow-lg flex flex-col">
                 <span className="absolute -top-6 left-6 bg-blue-600 text-white px-5 py-1.5 rounded-full text-base font-bold shadow-lg ring-4 ring-white">盒子里</span>
                 
                 <div className="grid grid-cols-5 gap-3 h-full items-center">
                    {/* First 9 slots filled */}
                    {Array.from({ length: 9 }).map((_, i) => (
                      <div key={`in-${i}`} className="flex items-center justify-center bg-blue-50 rounded-xl border border-blue-100 h-16 w-12 shadow-sm">
                         <Milk className="text-blue-500 w-8 h-8" fill="currentColor" />
                      </div>
                    ))}
                    
                    {/* The 10th slot (Target) */}
                    <div className="flex items-center justify-center border-4 border-dashed border-blue-200 rounded-xl bg-blue-50/50 h-16 w-12 relative overflow-hidden">
                      {milkMoved ? (
                        <div className="animate-bounce-in">
                          <Milk className="text-green-600 w-8 h-8" fill="currentColor" />
                        </div>
                      ) : (
                        <span className="text-[10px] text-blue-300 font-bold uppercase text-center">空位</span>
                      )}
                    </div>
                 </div>
              </div>

              {/* Outside Milk */}
              <div className="flex flex-col justify-center h-64">
                 <span className="text-center text-sm font-black text-slate-400 mb-6 uppercase tracking-widest bg-slate-100 py-1 rounded-full">外面剩下</span>
                 <div className="grid grid-cols-2 gap-4">
                    {/* The moving milk */}
                    <div className={`transition-all duration-700 ease-in-out transform ${milkMoved ? 'opacity-0 scale-0 pointer-events-none -translate-x-40' : 'opacity-100 scale-100 cursor-pointer hover:scale-110 active:scale-95 group'}`}
                         onClick={() => setMilkMoved(true)}
                    >
                       <div className="bg-white p-3 rounded-2xl shadow-md border-2 border-green-200 flex items-center justify-center relative group-hover:border-blue-400">
                          <Milk className="text-green-500 w-12 h-12" fill="currentColor" />
                          <div className="absolute -top-3 -right-3 bg-red-500 text-white w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shadow-md animate-pulse">1</div>
                       </div>
                    </div>
                    
                    {/* Remaining 3 */}
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div key={`out-${i}`} className="bg-white p-3 rounded-2xl shadow-md border border-slate-100 flex items-center justify-center">
                         <Milk className="text-green-500 w-12 h-12 opacity-80" fill="currentColor" />
                      </div>
                    ))}
                 </div>
                 {!milkMoved && (
                   <div className="text-sm font-bold text-center mt-6 text-blue-600 animate-bounce flex items-center justify-center gap-2">
                     <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                     点一盒搬进盒子里
                   </div>
                 )}
              </div>
            </div>

            {/* Bottom Control Area - Shown after movement */}
            <div className={`w-full max-w-2xl transition-all duration-500 ${milkMoved ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-10 scale-95 pointer-events-none h-0'}`}>
               {!showEquation ? (
                 <div className="flex justify-center py-4">
                    <button 
                      onClick={() => setShowEquation(true)}
                      className="group flex items-center gap-4 bg-orange-500 hover:bg-orange-600 text-white px-12 py-5 rounded-3xl shadow-[0_8px_0_rgb(194,65,12)] transition-all hover:translate-y-1 hover:shadow-[0_4px_0_rgb(194,65,12)] active:translate-y-2 active:shadow-none"
                    >
                      <Calculator size={32} className="group-hover:rotate-12 transition-transform" />
                      <span className="text-2xl font-black tracking-wider">列式计算</span>
                    </button>
                 </div>
               ) : (
                 <div className="bg-white/80 backdrop-blur-md p-8 rounded-[2.5rem] shadow-xl border-4 border-green-400 w-full animate-scale-up">
                    <div className="flex flex-col md:flex-row items-center gap-8">
                      <div className="flex-1 space-y-3 w-full">
                        <h4 className="text-xl font-bold text-slate-500 mb-4 flex items-center gap-2">
                          <CheckCircle2 className="text-green-500" />
                          图意解析：
                        </h4>
                        <div className="flex justify-between items-center text-slate-700 font-bold bg-blue-50 p-4 rounded-2xl border border-blue-100">
                          <span className="text-lg">盒子里凑成了</span>
                          <span className="text-4xl text-blue-600 font-mono">10</span>
                        </div>
                        <div className="flex justify-between items-center text-slate-700 font-bold bg-green-50 p-4 rounded-2xl border border-green-100">
                          <span className="text-lg">外面剩下了</span>
                          <span className="text-4xl text-green-600 font-mono">3</span>
                        </div>
                      </div>

                      <div className="flex flex-col items-center justify-center bg-orange-100 p-8 rounded-[2rem] border-4 border-orange-200 min-w-[240px]">
                         <div className="text-sm font-bold text-orange-400 uppercase tracking-widest mb-2">算式</div>
                         <div className="text-5xl font-black text-orange-600 font-mono">
                           10 + 3 = 13
                         </div>
                         <button 
                          onClick={handleReset}
                          className="mt-6 text-slate-400 hover:text-orange-500 flex items-center gap-2 text-sm font-bold transition-colors"
                        >
                          <RefreshCcw size={16} /> 重新操作
                        </button>
                      </div>
                    </div>
                 </div>
               )}
            </div>
         </div>

         <div className="flex flex-col items-center gap-2">
           <p className="text-slate-500 font-medium italic text-lg bg-white px-6 py-2 rounded-full border border-slate-100 shadow-sm">
             💡 凑成十以后，<span className="text-orange-500 font-bold">10加几</span>一眼就能看出得数了！
           </p>
         </div>
      </div>

      <style>{`
        @keyframes bounce-in {
          0% { transform: scale(0.3); opacity: 0; }
          50% { transform: scale(1.1); }
          70% { transform: scale(0.9); }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes scale-up {
          0% { transform: scale(0.95); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        .animate-bounce-in {
          animation: bounce-in 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }
        .animate-scale-up {
          animation: scale-up 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
      `}</style>
    </div>
  );
};

export default ScenarioStage;