
import React, { useState } from 'react';
import { Lightbulb, ChevronRight, HelpCircle, Target, Sparkles, RefreshCcw } from 'lucide-react';

const PatternStage: React.FC = () => {
  const [step, setStep] = useState(0);

  const equations = [
    { add: 2, sum: 11 },
    { add: 3, sum: 12 },
    { add: 4, sum: 13 },
    { add: 5, sum: 14 },
    { add: 6, sum: 15 },
    { add: 7, sum: 16 },
    { add: 8, sum: 17 },
    { add: 9, sum: 18 },
  ];

  const discoverySteps = [
    {
      title: '第1步：找相同',
      question: '仔细观察这些算式，它们有什么共同点？',
      answer: '都是 9 加几，和都是十几。',
      icon: <Target className="text-blue-500" />
    },
    {
      title: '第2步：找不同',
      question: '观察加号后的数（加数）与和的个位，你发现了什么？',
      answer: '和的个位总比加号后面的那个加数少 1。',
      icon: <HelpCircle className="text-orange-500" />
    },
    {
      title: '第3步：深度思考',
      question: '为什么和的个位总比那个加数少 1 呢？',
      answer: '因为那个加数借给 9 一个，去凑成十啦！',
      icon: <Sparkles className="text-purple-500" />
    }
  ];

  return (
    <div className="flex flex-col h-full space-y-6">
      <div className="flex items-center gap-4 border-b pb-4">
        <div className="bg-pink-100 p-2 rounded-lg text-pink-700 font-bold">第四关</div>
        <h2 className="text-2xl font-bold text-slate-700 font-handwriting">火眼金睛找规律</h2>
      </div>

      <div className="flex-1 flex flex-col md:flex-row gap-8 items-stretch">
        {/* Left Side: The Table */}
        <div className="flex-1 bg-white rounded-[2.5rem] shadow-xl border-4 border-slate-50 p-8 overflow-y-auto custom-scrollbar">
           <div className="grid grid-cols-2 gap-x-8 gap-y-4">
              {equations.map((eq, idx) => (
                <div 
                  key={idx} 
                  className={`flex items-center justify-center text-3xl font-mono py-4 rounded-2xl transition-all duration-500 ${
                    step > 0 ? 'bg-slate-50' : 'bg-white border border-slate-100'
                  }`}
                >
                   <span className={step >= 1 ? 'text-blue-500 font-black' : 'text-slate-400'}>9 + </span>
                   <span className={`mx-2 transition-all duration-300 ${
                     step >= 2 ? 'text-orange-600 font-black scale-110 bg-orange-50 px-2 rounded-lg ring-2 ring-orange-100' : 'text-slate-800'
                   }`}>{eq.add}</span>
                   <span className="text-slate-300 mx-1">=</span>
                   <span className={step >= 1 ? 'text-blue-500 font-black' : 'text-slate-400'}> 1</span>
                   <span className={`transition-all duration-300 ${
                     step >= 2 ? 'text-purple-600 font-black scale-110 bg-purple-50 px-2 rounded-lg ring-2 ring-purple-100' : 'text-slate-800'
                   }`}>{eq.sum % 10}</span>
                </div>
              ))}
           </div>
        </div>

        {/* Right Side: Guided Discovery */}
        <div className="flex-1 flex flex-col items-center justify-between py-4">
           {step === 0 ? (
             <div className="flex flex-col items-center justify-center space-y-8 animate-fade-in flex-1">
                <div className="bg-yellow-100 p-8 rounded-full animate-bounce-slow">
                   <Lightbulb size={100} className="text-yellow-500 fill-yellow-200" />
                </div>
                <div className="text-center space-y-4">
                  <h3 className="text-3xl font-black text-slate-800">算式里藏着小秘密！</h3>
                  <p className="text-slate-500 text-xl">快来点击按钮，开启火眼金睛吧！</p>
                </div>
                <button 
                  onClick={() => setStep(1)}
                  className="px-16 py-6 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full font-black text-2xl shadow-[0_8px_0_rgb(49,46,129)] transition-all hover:translate-y-1 hover:shadow-[0_4px_0_rgb(49,46,129)] active:translate-y-2 active:shadow-none"
                >
                  开始寻找规律
                </button>
             </div>
           ) : (
             <div className="w-full h-full flex flex-col justify-between space-y-6">
                <div className="space-y-6 flex-1">
                  {discoverySteps.map((s, i) => (
                    <div 
                      key={i} 
                      className={`transition-all duration-500 transform ${
                        step > i 
                          ? 'opacity-100 translate-x-0 scale-100' 
                          : 'opacity-0 translate-x-10 scale-95 pointer-events-none absolute'
                      } ${step === i + 1 ? 'relative' : 'opacity-40 grayscale scale-95'}`}
                    >
                      <div className={`p-6 rounded-[2rem] border-4 shadow-lg flex flex-col gap-4 ${
                        step === i + 1 ? 'bg-white border-indigo-400 ring-8 ring-indigo-50' : 'bg-slate-50 border-slate-200'
                      }`}>
                         <div className="flex items-center gap-3">
                            <div className="p-3 bg-white rounded-2xl shadow-sm border border-slate-100">
                               {s.icon}
                            </div>
                            <h4 className="text-2xl font-black text-slate-800">{s.title}</h4>
                         </div>
                         
                         <p className="text-xl font-bold text-slate-600 bg-slate-100/50 p-4 rounded-xl italic">
                           “{s.question}”
                         </p>

                         <div className={`mt-2 p-5 bg-green-50 rounded-2xl border-2 border-green-200 transition-all duration-700 delay-300 ${
                           step === i + 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                         }`}>
                            <p className="text-2xl font-black text-green-700 leading-relaxed">
                              发现：{s.answer}
                            </p>
                         </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-center gap-4 pt-4">
                  {step < 3 ? (
                    <button 
                      onClick={() => setStep(prev => prev + 1)}
                      className="group flex items-center gap-3 bg-indigo-600 hover:bg-indigo-700 text-white px-12 py-5 rounded-full font-black text-2xl shadow-[0_8px_0_rgb(49,46,129)] transition-all animate-bounce"
                    >
                      继续发现 <ChevronRight size={28} />
                    </button>
                  ) : (
                    <button 
                      onClick={() => setStep(0)}
                      className="flex items-center gap-3 bg-slate-500 hover:bg-slate-600 text-white px-12 py-4 rounded-full font-black text-xl shadow-lg transition-all"
                    >
                      <RefreshCcw size={24} /> 重新观察
                    </button>
                  )}
                </div>
             </div>
           )}
        </div>
      </div>

      {step === 3 && (
        <div className="bg-purple-600 p-6 rounded-[2.5rem] shadow-2xl animate-bounce-in mx-auto max-w-4xl w-full border-4 border-white">
           <div className="flex items-center justify-center gap-6">
              <div className="text-5xl">💡</div>
              <p className="text-3xl font-black text-white tracking-wide">
                规律口诀：<span className="text-yellow-300">看大数，分小数，凑成十，加剩数。</span>
              </p>
           </div>
        </div>
      )}

      <style>{`
        @keyframes bounce-in {
          0% { transform: scale(0.3); opacity: 0; }
          50% { transform: scale(1.05); }
          70% { transform: scale(0.95); }
          100% { transform: scale(1); opacity: 1; }
        }
        .animate-bounce-in {
          animation: bounce-in 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default PatternStage;
