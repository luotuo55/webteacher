import React, { useState } from 'react';
import { MousePointer2, Circle, Calculator, RefreshCcw, Package, Sparkles, PencilLine, Lightbulb, HelpCircle } from 'lucide-react';

const MethodStage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'sticks' | 'dots' | 'abacus' | 'branch'>('sticks');

  // --- Sticks State ---
  const [sticksMoved, setSticksMoved] = useState(false);
  const [sticksBundled, setSticksBundled] = useState(false);

  // --- Dots State ---
  const [isCircled, setIsCircled] = useState(false);

  // --- Abacus State ---
  const [abacusStage, setAbacusStage] = useState(0); 
  const [outsideBeads, setOutsideBeads] = useState(4);
  const [onesBeads, setOnesBeads] = useState(9);
  const [tensBeads, setTensBeads] = useState(0);

  // --- Branch State ---
  const [branchStep, setBranchStep] = useState(0); 

  const resetSticks = () => { setSticksMoved(false); setSticksBundled(false); };
  const resetDots = () => { setIsCircled(false); };
  const resetAbacus = () => { setAbacusStage(0); setOutsideBeads(4); setOnesBeads(9); setTensBeads(0); };
  const resetBranch = () => { setBranchStep(0); };

  const handleBeadClick = (index: number) => {
    if (abacusStage === 0 && index === 0) {
      setAbacusStage(1);
      setTimeout(() => {
        setOnesBeads(10);
        setOutsideBeads(3);
        setAbacusStage(2);
      }, 600);
    } else if (abacusStage === 4) {
      setAbacusStage(5);
      setTimeout(() => {
        setOnesBeads(prev => prev + 1);
        setOutsideBeads(prev => prev - 1);
        setAbacusStage(4);
      }, 600);
    }
  };

  const handleCarry = () => {
    if (abacusStage !== 2) return;
    setAbacusStage(3);
    setTimeout(() => {
      setOnesBeads(0);
      setTensBeads(1);
      setAbacusStage(4);
    }, 800);
  };

  return (
    <div className="flex flex-col min-h-full space-y-4 pb-20 md:pb-32">
      <div className="flex items-center justify-between border-b pb-4 flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <div className="bg-purple-100 p-2 rounded-lg text-purple-700 font-bold">第三关</div>
          <h2 className="text-2xl font-bold text-slate-700 font-handwriting">感悟算理：学会“凑十法”</h2>
        </div>
        
        <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200 shadow-inner">
          <button 
            onClick={() => { setActiveTab('sticks'); resetSticks(); }}
            className={`px-4 py-2 md:px-6 rounded-xl font-bold transition-all flex items-center gap-2 ${activeTab === 'sticks' ? 'bg-white shadow-md text-blue-600' : 'text-slate-500 hover:bg-white/50'}`}
          >
            <MousePointer2 size={18} /> 摆一摆
          </button>
          <button 
            onClick={() => { setActiveTab('dots'); resetDots(); }}
            className={`px-4 py-2 md:px-6 rounded-xl font-bold transition-all flex items-center gap-2 ${activeTab === 'dots' ? 'bg-white shadow-md text-red-600' : 'text-slate-500 hover:bg-white/50'}`}
          >
            <Circle size={18} /> 圈一圈
          </button>
          <button 
            onClick={() => { setActiveTab('abacus'); resetAbacus(); }}
            className={`px-4 py-2 md:px-6 rounded-xl font-bold transition-all flex items-center gap-2 ${activeTab === 'abacus' ? 'bg-white shadow-md text-indigo-600' : 'text-slate-500 hover:bg-white/50'}`}
          >
            <Calculator size={18} /> 拨一拨
          </button>
          <button 
            onClick={() => { setActiveTab('branch'); resetBranch(); }}
            className={`px-4 py-2 md:px-6 rounded-xl font-bold transition-all flex items-center gap-2 ${activeTab === 'branch' ? 'bg-white shadow-md text-orange-600' : 'text-slate-500 hover:bg-white/50'}`}
          >
            <PencilLine size={18} /> 枝型图
          </button>
        </div>
      </div>

      <div className="flex-1 bg-slate-50/30 rounded-[3rem] border-2 border-dashed border-slate-200 relative p-3 md:p-4 flex flex-col items-center justify-center min-h-[480px]">
        
        {/* 1. Sticks Interaction */}
        {activeTab === 'sticks' && (
          <div className="flex flex-col items-center gap-8 w-full animate-fade-in">
            <div className="text-xl font-bold text-slate-500 bg-white px-8 py-3 rounded-full shadow-sm border border-slate-100 text-center">
              {sticksBundled ? "凑成了一个“十”，真棒！" : sticksMoved ? "9根和1根，可以凑成十了" : "左边9根，右边4根。先拿1根给9。"}
            </div>
            
            <div className="flex flex-wrap items-center justify-center gap-12 md:gap-24 min-h-[220px]">
              <div className="relative flex flex-col items-center">
                <div className={`relative p-8 rounded-[2.5rem] transition-all duration-700 flex items-end justify-center min-w-[180px] ${sticksBundled ? 'bg-orange-50 ring-4 ring-orange-400 shadow-2xl scale-110' : 'bg-white shadow-lg border-2 border-slate-100'}`}>
                  {sticksBundled && (
                    <div className="absolute top-1/2 left-0 w-full h-10 bg-yellow-400/90 shadow-sm z-30 flex items-center justify-center border-y-2 border-yellow-500 -translate-y-1/2 animate-scale-in">
                       <span className="text-[10px] font-black text-yellow-900 uppercase tracking-tighter">10根一捆</span>
                    </div>
                  )}
                  <div className={`flex items-end transition-all duration-700 ${sticksBundled ? 'gap-0.5' : 'gap-2'}`}>
                    {Array.from({ length: 9 }).map((_, i) => (
                      <div key={`s9-${i}`} className={`w-2.5 h-32 md:h-40 bg-blue-500 rounded-full shadow-sm transition-all duration-500 ${sticksBundled ? 'rotate-1' : ''}`}></div>
                    ))}
                    {sticksMoved && (
                      <div className={`w-2.5 h-32 md:h-40 bg-green-500 rounded-full shadow-sm animate-stick-move-left transition-all duration-500 ${sticksBundled ? '-rotate-1' : ''}`}></div>
                    )}
                  </div>
                </div>
                <span className="mt-6 text-2xl font-black text-blue-600">{sticksBundled ? '1个十' : sticksMoved ? '10' : '9'}</span>
              </div>
              <div className="text-4xl font-black text-slate-300 italic">和</div>
              <div className="relative flex flex-col items-center">
                <div className="bg-white p-8 rounded-[2.5rem] shadow-lg border-2 border-slate-100 flex items-end justify-center min-w-[100px]">
                  <div className="flex gap-2">
                    {!sticksMoved && (
                      <div 
                        onClick={() => setSticksMoved(true)}
                        className="w-2.5 h-32 md:h-40 bg-green-500 rounded-full shadow-md cursor-pointer hover:bg-green-400 hover:scale-105 active:scale-95 transition-all relative group"
                      >
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/20 animate-ping"></div>
                      </div>
                    )}
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div key={`s3-${i}`} className="w-2.5 h-32 md:h-40 bg-green-500 rounded-full shadow-sm"></div>
                    ))}
                  </div>
                </div>
                <span className="mt-6 text-2xl font-black text-green-600">{sticksMoved ? '3' : '4'}</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-6 mt-4 justify-center">
              {sticksMoved && !sticksBundled && (
                <button 
                  onClick={() => setSticksBundled(true)}
                  className="group flex items-center gap-3 bg-orange-500 hover:bg-orange-600 text-white px-10 py-5 rounded-[2rem] font-black text-2xl shadow-[0_8px_0_rgb(194,65,12)] transition-all animate-bounce"
                >
                  <Package size={28} /> 捆成一捆
                </button>
              )}
              <button onClick={resetSticks} className="text-slate-400 flex items-center gap-2 hover:text-slate-600 font-bold px-6 py-3 rounded-2xl transition-all">
                <RefreshCcw size={20}/> 重新开始
              </button>
            </div>
          </div>
        )}

        {/* 2. Dots Interaction - Adjusted Position: Down and Left */}
        {activeTab === 'dots' && (
          <div className="flex flex-col items-center gap-8 w-full animate-fade-in py-4">
            <div className="text-xl font-bold text-slate-500 bg-white px-8 py-3 rounded-full shadow-sm border border-slate-100">
              在点子图上圈出10个
            </div>
            <div className="relative bg-white p-14 md:p-16 rounded-[4rem] shadow-2xl border-4 border-slate-100 flex flex-wrap items-center justify-center gap-8 transition-all duration-500 overflow-visible mt-6 md:mr-16">
              <div className="relative p-8 bg-slate-50/50 rounded-[3rem] border border-slate-100">
                <div className="grid grid-cols-5 gap-6 relative z-10">
                  {Array.from({ length: 9 }).map((_, i) => (
                    <div key={`d-b-${i}`} className="w-12 h-12 rounded-full bg-blue-500 shadow-inner ring-4 ring-blue-50/50"></div>
                  ))}
                  <div className="w-12 h-12 rounded-full bg-red-500 shadow-inner ring-4 ring-red-50/50"></div>
                </div>
                {isCircled && (
                  <div className="absolute inset-0 pointer-events-none z-20 flex items-center justify-center">
                    <svg viewBox="0 0 420 180" className="w-[112%] h-[120%] drop-shadow-lg overflow-visible">
                      <rect 
                        x="5" y="5" width="410" height="170" rx="36" ry="36"
                        fill="none" 
                        stroke="#f97316" 
                        strokeWidth="5" 
                        strokeLinecap="round"
                        className="animate-draw-circle"
                      />
                    </svg>
                  </div>
                )}
              </div>
              <div className="flex flex-col items-center gap-2">
                 <div className="h-20 w-1 bg-slate-100 rounded-full"></div>
                 <span className="text-slate-300 font-black italic">+</span>
                 <div className="h-20 w-1 bg-slate-100 rounded-full"></div>
              </div>
              <div className="flex gap-6 p-8 bg-slate-50/50 rounded-[3rem] border border-slate-100">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={`d-r-out-${i}`} className="w-12 h-12 rounded-full bg-red-500 shadow-inner ring-4 ring-red-50/50"></div>
                ))}
              </div>
            </div>
            <div className="flex flex-col items-center gap-6 pb-4">
              {!isCircled ? (
                <button 
                  onClick={() => setIsCircled(true)}
                  className="px-16 py-5 bg-red-500 hover:bg-red-600 text-white rounded-[2rem] font-black text-2xl shadow-[0_8px_0_rgb(185,28,28)] transition-all"
                >
                  点击圈出 10
                </button>
              ) : (
                <div className="text-center animate-scale-up">
                   <div className="text-5xl font-black text-slate-800 mb-2 font-mono tracking-tighter">10 + 3 = 13</div>
                   <button onClick={resetDots} className="text-slate-400 font-bold hover:text-slate-600 flex items-center justify-center gap-2 mx-auto">
                     <RefreshCcw size={18}/> 重新开始
                   </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 3. Abacus Interaction */}
        {activeTab === 'abacus' && (
          <div className="flex flex-col items-center gap-8 w-full animate-fade-in relative">
            <div className="bg-indigo-50 border border-indigo-100 px-8 py-3 rounded-full text-lg font-bold text-indigo-700 shadow-sm min-h-[50px] flex items-center justify-center text-center">
              {abacusStage === 0 && "第一步：点击一颗红珠子，凑成十"}
              {abacusStage === 2 && "第二步：个位满十了，点击“满十进一”"}
              {abacusStage === 3 && "正在进位..."}
              {abacusStage === 4 && outsideBeads > 0 && "第三步：点击剩下的红珠子，拨入个位"}
              {abacusStage === 4 && outsideBeads === 0 && "真棒！9+4=13 的过程演示完毕"}
            </div>
            <div className="flex flex-wrap items-start justify-center gap-16 md:gap-24 w-full">
              <div className="flex flex-col items-center gap-6 pt-10">
                <div className="bg-white p-8 rounded-[2rem] border-4 border-slate-100 shadow-xl min-w-[280px] text-center">
                   <div className="text-xs font-black text-slate-300 uppercase tracking-widest mb-3">数学算式</div>
                   <div className="text-5xl font-black text-slate-800 font-mono tracking-tighter italic">
                      {abacusStage < 3 ? '9 + 4 =' : abacusStage === 3 ? '9 + 1 + 3 =' : outsideBeads > 0 ? '10 + 3 =' : '10 + 3 = 13'}
                   </div>
                </div>
                {abacusStage === 2 && (
                  <button onClick={handleCarry} className="group flex items-center gap-3 bg-orange-500 hover:bg-orange-600 text-white px-10 py-5 rounded-[2rem] font-black text-2xl shadow-[0_8px_0_rgb(194,65,12)] transition-all animate-bounce">
                    <Sparkles size={28} /> 满十进一
                  </button>
                )}
                <button onClick={resetAbacus} className="text-slate-400 font-bold hover:text-indigo-500 transition-colors flex items-center gap-1 mt-4">
                  <RefreshCcw size={16}/>重新演示
                </button>
              </div>
              <div className="bg-white p-10 md:p-14 rounded-[4rem] shadow-2xl border-b-[20px] border-slate-200 flex items-end gap-16 md:gap-24 min-h-[420px] relative">
                 <div className="flex flex-col items-center gap-6">
                   <div className="relative w-14 h-80 bg-slate-100 rounded-full border-4 border-slate-200 flex flex-col-reverse items-center py-3 gap-1">
                      {Array.from({ length: tensBeads }).map((_, i) => (
                        <div key={`tens-${i}`} className="w-12 h-7 bg-indigo-600 rounded-xl shadow-lg border-2 border-indigo-400 animate-bead-land"></div>
                      ))}
                      {abacusStage === 3 && <div className="w-12 h-7 bg-indigo-600 rounded-xl shadow-lg border-2 border-indigo-400 animate-carry-fly"></div>}
                   </div>
                   <span className="text-xl md:text-2xl font-black text-slate-400 uppercase tracking-widest">十位</span>
                 </div>
                 <div className="flex flex-col items-center gap-6">
                   <div className="relative w-14 h-80 bg-slate-100 rounded-full border-4 border-slate-200 flex flex-col-reverse items-center py-3 gap-1 overflow-hidden">
                      {Array.from({ length: onesBeads }).map((_, i) => (
                        <div key={`ones-${i}`} className={`w-12 h-6 rounded-xl shadow-md border-2 ${i < 9 ? 'bg-blue-500 border-blue-400' : 'bg-red-500 border-red-400 animate-bead-land'} ${abacusStage === 3 ? 'animate-beads-disappear' : ''}`}></div>
                      ))}
                      {(abacusStage === 1 || abacusStage === 5) && <div className="w-12 h-7 bg-red-500 rounded-xl shadow-lg border-2 border-red-400 animate-fly-in-ones absolute" style={{ top: '0', left: '50%', marginLeft: '-24px' }}></div>}
                   </div>
                   <span className="text-xl md:text-2xl font-black text-slate-400 uppercase tracking-widest">个位</span>
                 </div>
              </div>
              <div className="flex flex-col gap-6 pt-10">
                 <div className="bg-slate-50/50 p-8 rounded-[3rem] border-2 border-dashed border-slate-200 flex flex-col items-center gap-4 min-w-[140px]">
                    <span className="text-xs font-black text-slate-300 uppercase tracking-widest">外面散珠</span>
                    <div className="flex flex-col gap-4">
                       {Array.from({ length: outsideBeads }).map((_, i) => (
                         <button 
                           key={`out-${i}`}
                           disabled={abacusStage !== 0 && abacusStage !== 4}
                           onClick={() => handleBeadClick(i)}
                           className={`w-12 h-7 bg-red-500 rounded-xl shadow-md border-2 border-red-400 transition-all ${abacusStage === 0 || abacusStage === 4 ? 'hover:scale-110 active:scale-95 cursor-pointer hover:bg-red-400' : 'opacity-50 cursor-not-allowed'}`}
                         ></button>
                       ))}
                    </div>
                 </div>
              </div>
            </div>
          </div>
        )}

        {/* 4. Branch Diagram - Shifted Content: Down and Left */}
        {activeTab === 'branch' && (
          <div className="flex flex-col items-center gap-2 md:gap-4 w-full animate-fade-in relative -mt-4">
             <div className="bg-white p-4 md:p-6 rounded-[3rem] shadow-2xl border-4 border-slate-100 w-full max-w-6xl relative min-h-[550px] flex flex-col items-center overflow-auto custom-scrollbar">
                
                {/* Visual Area (Unified SVG) - Content Shifted Down and Left */}
                <div className="w-full h-[360px] md:h-[400px] flex-shrink-0 mt-2">
                  <svg viewBox="0 0 1000 450" className="w-full h-full font-mono">
                    {/* Top Level: 9 + 4 = [ ] - Shifted Left (x-50) and Down (y+40) */}
                    <text x="100" y="130" textAnchor="middle" fontSize="120" fontWeight="900" fill="#1e293b">9</text>
                    <text x="200" y="130" textAnchor="middle" fontSize="80" fontWeight="900" fill="#94a3b8">+</text>
                    <text x="300" y="130" textAnchor="middle" fontSize="120" fontWeight="900" fill="#1e293b">4</text>
                    <text x="400" y="130" textAnchor="middle" fontSize="80" fontWeight="900" fill="#94a3b8">=</text>
                    
                    {/* Answer Box - Shifted Left and Down */}
                    <rect x="470" y="30" width="130" height="130" fill="#f8fafc" stroke="#1e293b" strokeWidth="6" />
                    {branchStep >= 4 && (
                      <text x="535" y="130" textAnchor="middle" fontSize="100" fontWeight="900" fill="#ea580c" className="animate-bounce-in">13</text>
                    )}

                    {/* Branching from 4 (Step 1+) - Shifted Left and Down */}
                    {branchStep >= 1 && (
                      <g className="animate-fade-in">
                        <line x1="300" y1="160" x2="250" y2="230" stroke="#334155" strokeWidth="6" strokeLinecap="round" className="animate-draw-line" />
                        <line x1="300" y1="160" x2="350" y2="230" stroke="#334155" strokeWidth="6" strokeLinecap="round" className="animate-draw-line" style={{animationDelay: '0.2s'}} />
                        <text x="250" y="300" textAnchor="middle" fontSize="80" fontWeight="900" fill="#1e293b" className="animate-fade-in-up">1</text>
                        <text x="350" y="300" textAnchor="middle" fontSize="80" fontWeight="900" fill="#1e293b" className="animate-fade-in-up">3</text>
                      </g>
                    )}

                    {/* Connecting Bracket (Step 2+) - Shifted Left and Down */}
                    {branchStep >= 2 && (
                      <g className="animate-fade-in">
                        <path d="M 100,160 L 100,360 L 250,360 L 250,320" fill="none" stroke="#334155" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" className="animate-draw-line-long" />
                        <text x="175" y="415" textAnchor="middle" fontSize="70" fontWeight="900" fill="#ef4444" className="animate-scale-up">10</text>
                      </g>
                    )}

                    {/* Thought Prompt (Step 3+) - Shifted further Left (x-80) and Down */}
                    {branchStep >= 3 && (
                      <g className="animate-fade-in-left">
                         <text x="620" y="210" fontSize="55" fontWeight="bold" fill="#ef4444" style={{fontFamily: "'ZCOOL KuaiLe', cursive"}}>想：9 加 1 得 10，</text>
                         <text x="670" y="300" fontSize="55" fontWeight="bold" fill="#ef4444" style={{fontFamily: "'ZCOOL KuaiLe', cursive"}}>10 加 3 得 13。</text>
                      </g>
                    )}
                  </svg>
                </div>

                {/* Information Area - Focused Content */}
                <div className="w-full mt-2 grid grid-cols-1 md:grid-cols-2 gap-4 border-t pt-4 bg-white z-10">
                   <div className="bg-indigo-50/80 p-4 rounded-3xl border-2 border-indigo-100 flex flex-col gap-1 shadow-sm">
                      <div className="flex items-center gap-2 text-indigo-700 font-black text-lg">
                        <HelpCircle size={22} /> 核心追问
                      </div>
                      <p className="text-slate-700 font-bold text-lg">为什么要把 4 分成 1 和 3？</p>
                   </div>

                   <div className="bg-amber-50/80 p-4 rounded-3xl border-2 border-amber-100 flex flex-col gap-1 shadow-sm items-center justify-center">
                      <div className="flex items-center gap-2 text-amber-700 font-black text-lg mb-1">
                        <Lightbulb size={22} /> 思维小结
                      </div>
                      <p className="text-2xl font-black text-orange-600 bg-orange-100 px-6 py-2 rounded-full border border-orange-200">
                        凑十法
                      </p>
                   </div>
                </div>

                {/* Local Navigation Bar - Compact control */}
                <div className="w-full flex justify-center gap-4 mt-6 mb-2 flex-shrink-0">
                   <button 
                     onClick={() => setBranchStep(prev => Math.min(prev + 1, 4))}
                     className={`px-12 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-full font-black text-xl shadow-xl transition-all ${branchStep >= 4 ? 'opacity-0 scale-0 pointer-events-none' : 'animate-bounce'}`}
                   >
                     演示下一步
                   </button>
                   <button onClick={resetBranch} className="p-3 bg-slate-100 text-slate-500 hover:text-orange-500 rounded-full shadow-md transition-transform active:rotate-180">
                     <RefreshCcw size={24} />
                   </button>
                </div>
             </div>
          </div>
        )}

      </div>

      {/* Global Conclusion Banner */}
      <div className="flex items-center justify-center p-3 bg-white rounded-[2rem] border-2 border-slate-100 shadow-sm mx-auto w-full max-w-4xl fixed bottom-4 left-1/2 -translate-x-1/2 z-40 scale-90 md:scale-100">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-blue-100 flex-shrink-0 flex items-center justify-center text-blue-600 font-black text-xl">?</div>
          <p className="text-base md:text-lg font-bold text-slate-600 leading-relaxed">
             核心结论：先把 <span className="text-blue-500 border-b-2 border-blue-200">9</span> 和右边的 <span className="text-red-500 border-b-2 border-red-200">1</span> 凑成 <span className="text-orange-500 font-black">10</span>，再加剩下的就方便啦！
          </p>
        </div>
      </div>

      <style>{`
        /* Mathematical Geometry Animations */
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

export default MethodStage;