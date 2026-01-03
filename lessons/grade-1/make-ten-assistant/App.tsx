
import React, { useState, useEffect, useCallback } from 'react';
import { Settings, Calculator, ChevronLeft, ChevronRight, X, Lightbulb, BookOpen, Languages } from 'lucide-react';
import CircleGrid from './components/CircleGrid';
import BranchDiagram from './components/BranchDiagram';
import { MathState, ExplanationResponse, Language } from './types';

// Helper to generate local math explanation without AI
const getLocalMathExplanation = (num1: number, num2: number, lang: Language = 'en'): ExplanationResponse => {
  const need = 10 - num1;
  const result = num1 + num2;

  if (lang === 'zh') {
    if (result < 10) {
      return {
        steps: [
          `当前算式是 ${num1} + ${num2}。`,
          `结果是 ${result}，还没到 10 呢。`,
          `直接数一数下面的圆圈，就能得到答案啦！`
        ],
        tips: "当两个数相加超过 10 时，凑十法会让计算变得超级简单！"
      };
    }
    return {
      steps: [
        `第一步：看大数 ${num1}。想一想，${num1} 加几等于 10？加 ${need} 等于 10。`,
        `第二步：拆小数 ${num2}。把 ${num2} 分成 ${need} 和 ${num2 - need}。`,
        `第三步：凑成十。${num1} 加上 ${need} 等于 10。`,
        `第四步：加剩数。10 加上 ${num2 - need}，结果就是 ${result}。`
      ],
      tips: "记住口诀：看大数，分小数，凑成十，加剩数！"
    };
  } else {
    if (result < 10) {
      return {
        steps: [
          `The equation is ${num1} + ${num2}.`,
          `The result is ${result}, which is less than 10.`,
          `Just count the circles to find the answer!`
        ],
        tips: "The Make-Ten method is great for sums bigger than 10!"
      };
    }
    return {
      steps: [
        `Step 1: Look at ${num1}. ${num1} needs ${need} more to make 10.`,
        `Step 2: Split ${num2}. Divide ${num2} into ${need} and ${num2 - need}.`,
        `Step 3: Make ten. ${num1} + ${need} = 10.`,
        `Step 4: Add the rest. 10 + ${num2 - need} = ${result}.`
      ],
      tips: "Remember: Look at the big number, split the small one, make 10, then add the rest!"
    };
  }
};

// Main Application Component for Make-Ten Math Visualization
const App: React.FC = () => {
  const [lang, setLang] = useState<Language>('en'); // Default to English
  const [state, setState] = useState<MathState>({
    num1: 8,
    num2: 5,
    borrowed: 0
  });

  const [explanation, setExplanation] = useState<ExplanationResponse | null>(null);
  const [showConfig, setShowConfig] = useState(true);

  const t = {
    zh: {
      title: "凑十法演示助手",
      changeBtn: "换题",
      stepBtn: "解析步骤",
      hint1: "凑齐 10 个啦！观察上面的枝形图变化。",
      hint2: (n1: number) => `帮左边的 ${n1} 凑齐 10 个`,
      configTitle: "更换题目",
      confirm: "确定",
      panelTitle: "凑十法解析",
      panelTip: "小贴士"
    },
    en: {
      title: "Make-Ten Assistant",
      changeBtn: "Change Problem",
      stepBtn: "Show Steps",
      hint1: "Made 10! Look at the diagram above.",
      hint2: (n1: number) => `Help the left side (${n1}) reach 10`,
      configTitle: "New Problem",
      confirm: "OK",
      panelTitle: "Make-Ten Analysis",
      panelTip: "Tips"
    }
  }[lang];

  const updateAddend = (key: 'num1' | 'num2', val: number) => {
    const clampedVal = Math.max(1, Math.min(9, val));
    setState(prev => ({ ...prev, [key]: clampedVal, borrowed: 0 }));
  };

  const handleLeftClick = (isBorrowed: boolean) => {
    if (isBorrowed && state.borrowed > 0) {
      setState(prev => ({ ...prev, borrowed: prev.borrowed - 1 }));
    }
  };

  const handleRightClick = () => {
    const currentTotalLeft = state.num1 + state.borrowed;
    if (currentTotalLeft < 10 && state.borrowed < state.num2) {
      setState(prev => ({ ...prev, borrowed: prev.borrowed + 1 }));
    }
  };

  const generateExplanation = useCallback(() => {
    const data = getLocalMathExplanation(state.num1, state.num2, lang);
    setExplanation(data);
  }, [state.num1, state.num2, lang]);

  const isMakeTenComplete = (state.num1 + state.borrowed) === 10;

  return (
    <div className="w-full h-screen bg-slate-50 flex flex-col p-8 overflow-hidden select-none">
      {/* Top Header & Controls */}
      <div className="flex justify-between items-center mb-6 px-10">
        <div className="flex items-center gap-4">
           <Calculator size={36} className="text-blue-600" />
           <h1 className="text-3xl font-black text-slate-800 kids-font tracking-tight">{t.title}</h1>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 bg-white border border-slate-200 px-4 py-2 rounded-2xl shadow-sm">
            <Languages size={20} className="text-slate-400" />
            <select 
              value={lang} 
              onChange={(e) => setLang(e.target.value as Language)}
              className="bg-transparent text-lg font-bold text-slate-600 focus:outline-none cursor-pointer"
            >
              <option value="en">English</option>
              <option value="zh">简体中文</option>
            </select>
          </div>

          <div className="flex gap-4">
            <button 
              onClick={() => setShowConfig(true)}
              className="flex items-center gap-2 bg-white hover:bg-slate-100 text-slate-700 px-6 py-3 rounded-2xl text-lg font-bold border-2 border-slate-100 transition-all shadow-sm active:scale-95"
            >
              <Settings size={22} />
              <span>{t.changeBtn}</span>
            </button>
            <button 
              onClick={generateExplanation}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-2xl text-lg font-bold transition-all shadow-lg active:scale-95"
            >
              <BookOpen size={22} />
              <span>{t.stepBtn}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col gap-6 overflow-hidden">
        {/* Upper: Branch Diagram */}
        <div className="h-[52%] flex flex-col">
           <BranchDiagram 
              num1={state.num1} 
              num2={state.num2} 
              borrowed={state.borrowed} 
              onBorrowedChange={(val) => setState(prev => ({ ...prev, borrowed: val }))}
              lang={lang}
           />
        </div>

        {/* Dynamic Explanation Area */}
        {explanation && (
          <div className="bg-indigo-900 text-white rounded-[40px] p-6 mx-auto w-full max-w-7xl shadow-xl flex items-center justify-between animate-in fade-in zoom-in duration-300 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-2 h-full bg-yellow-400"></div>
            <div className="flex gap-8 overflow-x-auto no-scrollbar py-2">
              {explanation.steps.map((step, idx) => (
                <div key={idx} className="flex gap-3 items-start min-w-[300px]">
                  <span className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center text-sm font-bold shrink-0">{idx + 1}</span>
                  <p className="text-lg leading-snug text-slate-100">{step}</p>
                </div>
              ))}
            </div>
            <button onClick={() => setExplanation(null)} className="ml-4 p-2 hover:bg-white/10 rounded-full shrink-0"><X size={24}/></button>
          </div>
        )}

        {/* Lower: Circle Interaction Area */}
        <div className="flex-1 flex flex-col items-center justify-center gap-6 bg-white rounded-[50px] p-6 border-2 border-slate-100 shadow-xl relative">
          <div className="flex gap-16 items-center scale-90 md:scale-100">
            <CircleGrid 
              count={state.num1 + state.borrowed} 
              total={10} 
              color="bg-blue-600" 
              label="Left" 
              highlightCount={state.borrowed}
              baseCount={state.num1}
              onCircleClick={handleLeftClick}
              isLocked={isMakeTenComplete}
              lang={lang}
            />
            
            <div className={`text-7xl font-black transition-all duration-500 ${isMakeTenComplete ? 'text-green-500 scale-125' : 'text-slate-200'}`}>
              {isMakeTenComplete ? "✓" : "→"}
            </div>

            <CircleGrid 
              count={state.num2 - state.borrowed} 
              total={10} 
              color="bg-orange-500" 
              label="Right" 
              onCircleClick={handleRightClick}
              lang={lang}
            />
          </div>
          
          <div className="flex items-center gap-4 text-blue-900 kids-font text-2xl bg-blue-50/50 px-10 py-4 rounded-full border-2 border-blue-100 transition-all">
             <Lightbulb className="text-yellow-500 animate-pulse" size={32} />
             <span className="font-bold">{isMakeTenComplete ? t.hint1 : t.hint2(state.num1)}</span>
          </div>
        </div>
      </div>

      {/* Configuration Modal */}
      {showConfig && (
        <div className="fixed inset-0 z-[150] bg-slate-900/80 backdrop-blur-xl flex items-center justify-center p-6">
          <div className="bg-white rounded-[60px] p-12 md:p-16 w-full max-w-5xl shadow-[0_0_100px_rgba(0,0,0,0.2)] relative border-b-[12px] border-indigo-100 flex flex-col items-center">
            <h2 className="text-5xl md:text-6xl font-black text-center mb-12 md:mb-16 kids-font text-slate-800">{t.configTitle}</h2>
            
            <div className="w-full flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12 mb-12 md:mb-20">
              {/* Num 1 Controls */}
              <div className="flex items-center justify-center gap-6 md:gap-10 bg-slate-100 px-10 md:px-16 py-8 md:py-10 rounded-[60px] md:rounded-[80px] border-4 border-white shadow-lg min-w-[280px] md:min-w-[400px]">
                <button 
                  onClick={() => updateAddend('num1', state.num1 - 1)}
                  className="p-4 md:p-6 bg-white hover:bg-slate-200 rounded-full text-slate-400 hover:text-indigo-600 transition-colors shadow-sm active:scale-90"
                >
                  <ChevronLeft size={48} md:size={72} />
                </button>
                <div className="flex flex-col items-center min-w-[80px] md:min-w-[120px]">
                   <span className="text-8xl md:text-[10rem] font-black text-indigo-600 drop-shadow-sm leading-none">{state.num1}</span>
                </div>
                <button 
                  onClick={() => updateAddend('num1', state.num1 + 1)}
                  className="p-4 md:p-6 bg-white hover:bg-slate-200 rounded-full text-slate-400 hover:text-indigo-600 transition-colors shadow-sm active:scale-90"
                >
                  <ChevronRight size={48} md:size={72} />
                </button>
              </div>

              <div className="text-6xl md:text-8xl font-light text-slate-300">+</div>

              {/* Num 2 Controls */}
              <div className="flex items-center justify-center gap-6 md:gap-10 bg-slate-100 px-10 md:px-16 py-8 md:py-10 rounded-[60px] md:rounded-[80px] border-4 border-white shadow-lg min-w-[280px] md:min-w-[400px]">
                <button 
                  onClick={() => updateAddend('num2', state.num2 - 1)}
                  className="p-4 md:p-6 bg-white hover:bg-slate-200 rounded-full text-slate-400 hover:text-orange-600 transition-colors shadow-sm active:scale-90"
                >
                  <ChevronLeft size={48} md:size={72} />
                </button>
                <div className="flex flex-col items-center min-w-[80px] md:min-w-[120px]">
                   <span className="text-8xl md:text-[10rem] font-black text-orange-600 drop-shadow-sm leading-none">{state.num2}</span>
                </div>
                <button 
                  onClick={() => updateAddend('num2', state.num2 + 1)}
                  className="p-4 md:p-6 bg-white hover:bg-slate-200 rounded-full text-slate-400 hover:text-orange-600 transition-colors shadow-sm active:scale-90"
                >
                  <ChevronRight size={48} md:size={72} />
                </button>
              </div>
            </div>

            <div className="w-full px-4 md:px-10">
              <button 
                onClick={() => setShowConfig(false)}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-6 md:py-8 rounded-[30px] md:rounded-[40px] text-3xl md:text-4xl font-black shadow-2xl transition-all active:scale-95"
              >
                {t.confirm}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
