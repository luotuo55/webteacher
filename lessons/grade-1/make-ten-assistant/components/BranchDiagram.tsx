
import React, { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle2, ArrowRightCircle, Sparkles } from 'lucide-react';
import { Language } from '../types';

interface BranchDiagramProps {
  num1: number;
  num2: number;
  borrowed: number;
  onBorrowedChange: (val: number) => void;
  lang: Language;
}

const BranchDiagram: React.FC<BranchDiagramProps> = ({ num1, num2, borrowed, onBorrowedChange, lang }) => {
  const [activeField, setActiveField] = useState<'part1' | 'part2' | 'resultField' | null>(null);
  const [localPart2, setLocalPart2] = useState<string>("");
  const [localResult, setLocalResult] = useState<string>("");

  const part1 = borrowed;
  const part2Num = parseInt(localPart2) || 0;
  const resultNum = parseInt(localResult) || 0;
  
  const isMakeTenSuccessful = (num1 + part1) === 10;
  const isDecompositionCorrect = (part1 + part2Num) === num2;
  const isFinalResultCorrect = resultNum === (num1 + num2);

  const hasPart2Input = localPart2 !== "";
  const hasResultInput = localResult !== "";
  const correctSum = num1 + num2;

  useEffect(() => {
    setLocalPart2("");
    setLocalResult("");
    setActiveField(null);
  }, [num1, num2]);

  const handleKeypadInput = (digit: number) => {
    if (activeField === 'part1') {
      onBorrowedChange(Math.min(digit, num2));
    } else if (activeField === 'part2') {
      setLocalPart2(digit.toString());
    } else if (activeField === 'resultField') {
      setLocalResult(prev => {
        const next = prev + digit.toString();
        if (next.length > 2) return digit.toString();
        return next;
      });
    }
  };

  const handleClear = () => {
    if (activeField === 'part1') onBorrowedChange(0);
    else if (activeField === 'part2') setLocalPart2("");
    else if (activeField === 'resultField') setLocalResult("");
  };

  const num1CenterX = 60; 
  const num2CenterX = 240; 
  const boxWidth = 80;
  const boxGap = 16;
  const part1CenterX = num2CenterX - (boxWidth / 2 + boxGap / 2) + 4;

  const getGuidance = () => {
    if (lang === 'zh') {
      if (part1 === 0) return { text: `想：${num1} 加几等于 10？`, subText: "点击左边蓝色框，给左边凑个 10 吧！", color: "text-blue-600", type: 'step1' };
      if (!isMakeTenSuccessful) return { text: `${num1} 加 ${part1} 不等于 10 哦`, subText: "凑成 10 还需要几？", color: "text-red-500", type: 'error' };
      if (!hasPart2Input) return { text: `凑成 10 了！那 ${num2} 还可以分成 ${part1} 和几？`, subText: "点击右边橙色框填入余数", color: "text-orange-600", type: 'step2' };
      if (!isDecompositionCorrect) return { text: `分解不对哦，${part1} 加 ${part2Num} 不等于 ${num2}`, subText: "重新检查右边的数字", color: "text-red-500", type: 'error' };
      if (!hasResultInput) return { text: `算一算：10 加 ${part2Num} 等于多少？`, subText: "点击等号后的框填入结果", color: "text-indigo-600", type: 'step3' };
      if (!isFinalResultCorrect) return { text: `结果算错啦！10 加 ${part2Num} 是多少呢？`, subText: "别灰心，再算一次", color: "text-red-500", type: 'error' };
      return { text: `太棒了！你完全掌握了凑十法！`, subText: `${num1} + ${num2} = ${correctSum}，正确！`, color: "text-green-600", type: 'success' };
    } else {
      if (part1 === 0) return { text: `Think: ${num1} + ? = 10`, subText: "Click the blue box to reach 10!", color: "text-blue-600", type: 'step1' };
      if (!isMakeTenSuccessful) return { text: `${num1} + ${part1} is not 10`, subText: "How many more to make 10?", color: "text-red-500", type: 'error' };
      if (!hasPart2Input) return { text: `Made 10! Now split ${num2} into ${part1} and ?`, subText: "Click the orange box for the rest", color: "text-orange-600", type: 'step2' };
      if (!isDecompositionCorrect) return { text: `Wrong split! ${part1} + ${part2Num} != ${num2}`, subText: "Check the number on the right", color: "text-red-500", type: 'error' };
      if (!hasResultInput) return { text: `Now: what is 10 + ${part2Num}?`, subText: "Click the box after '=' for result", color: "text-indigo-600", type: 'step3' };
      if (!isFinalResultCorrect) return { text: `Incorrect! What is 10 + ${part2Num}?`, subText: "Try again, you can do it!", color: "text-red-500", type: 'error' };
      return { text: `Great Job! You mastered it!`, subText: `${num1} + ${num2} = ${correctSum} is correct!`, color: "text-green-600", type: 'success' };
    }
  };

  const guidance = getGuidance();
  const keypadLabel = lang === 'zh' ? 
    (activeField === 'part1' ? '凑十位？' : activeField === 'part2' ? '余数位？' : '结果？') :
    (activeField === 'part1' ? 'Give how many?' : activeField === 'part2' ? 'Left how many?' : 'Final result?');
  const clearBtn = lang === 'zh' ? '清除' : 'Clear';
  const doneBtn = lang === 'zh' ? '完成' : 'Done';
  const continuePrompt = lang === 'zh' ? '点击空框继续' : 'Click a box to start';

  return (
    <div className="flex flex-row items-center justify-between p-12 bg-white rounded-[50px] shadow-2xl border-4 border-slate-50 w-full h-full min-h-[550px]">
      <div className="relative h-full w-[480px] shrink-0">
        <div className="grid grid-cols-[120px_60px_120px_60px_120px] items-center justify-items-center text-[100px] font-medium text-slate-900 mb-4 h-32">
          <div className="w-full text-center">{num1}</div>
          <div className="text-slate-800 text-7xl font-light">+</div>
          <div className="w-full text-center">{num2}</div>
          <div className="text-slate-800 text-7xl font-light">=</div>
          <div onClick={() => setActiveField('resultField')} className={`w-28 h-28 border-[4px] rounded-xl flex items-center justify-center cursor-pointer transition-all duration-300 ${activeField === 'resultField' ? 'border-indigo-500 bg-indigo-50 ring-4 ring-indigo-100' : isFinalResultCorrect ? 'border-green-500 bg-green-50' : 'border-slate-300 bg-white'}`}>
             {hasResultInput ? <span className={`text-6xl font-black ${isFinalResultCorrect ? 'text-green-600' : 'text-slate-700'}`}>{localResult}</span> : <span className="text-slate-200 text-5xl">?</span>}
          </div>
        </div>
        <div className="grid grid-cols-[120px_60px_120px_60px_120px] justify-items-center h-20">
          <div className="col-start-3 w-full h-full relative">
            <svg className="w-full h-full" viewBox="0 0 120 80" preserveAspectRatio="none">
              <line x1="60" y1="0" x2="25" y2="70" stroke="#94a3b8" strokeWidth="3" strokeLinecap="round" />
              <line x1="60" y1="0" x2="95" y2="70" stroke="#94a3b8" strokeWidth="3" strokeLinecap="round" />
            </svg>
          </div>
        </div>
        <div className="grid grid-cols-[120px_60px_120px_60px_120px] justify-items-center h-24">
          <div className="col-start-3 w-full flex justify-center gap-4 items-center">
            <div onClick={() => setActiveField('part1')} className={`w-20 h-20 border-[3px] rounded-xl flex items-center justify-center cursor-pointer transition-all ${activeField === 'part1' ? 'border-blue-500 bg-blue-50 ring-4 ring-blue-100' : isMakeTenSuccessful ? 'border-green-500 bg-green-50' : 'border-slate-300 bg-slate-50/50'}`}>
              <span className={`text-5xl font-medium ${part1 ? (isMakeTenSuccessful ? 'text-green-600' : 'text-blue-600') : 'text-slate-300'}`}>{part1 || '?'}</span>
            </div>
            <div onClick={() => setActiveField('part2')} className={`w-20 h-20 border-[3px] rounded-xl flex items-center justify-center cursor-pointer transition-all ${activeField === 'part2' ? 'border-orange-500 bg-orange-50 ring-4 ring-orange-100' : isDecompositionCorrect ? 'border-green-500 bg-green-50' : 'border-slate-300 bg-slate-50/50'}`}>
              <span className={`text-5xl font-medium ${hasPart2Input ? (isDecompositionCorrect ? 'text-green-600' : 'text-red-600') : 'text-slate-300'}`}>{hasPart2Input ? localPart2 : '?'}</span>
            </div>
          </div>
        </div>
        <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 480 550" preserveAspectRatio="none">
          <path d={`M ${num1CenterX},150 L ${num1CenterX},380 L ${part1CenterX},380 L ${part1CenterX},340`} fill="none" stroke={isMakeTenSuccessful ? "#22c55e" : "#94a3b8"} strokeWidth="4" strokeLinecap="round" className="transition-colors duration-500" />
          <text x={num1CenterX + 20} y="425" fill={isMakeTenSuccessful ? "#22c55e" : "#ef4444"} fontSize="36" fontWeight="bold" className="kids-font transition-colors">10</text>
        </svg>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center border-l-2 border-slate-50 ml-8 pl-8 h-full min-w-[420px] gap-8">
        <div className="w-full flex flex-col gap-4 min-h-[160px] justify-center text-center px-4">
          <div className={`text-5xl font-bold leading-tight kids-font transition-all duration-300 ${guidance.color}`}>{guidance.text}</div>
          <div className="text-2xl text-slate-400 font-medium kids-font flex items-center justify-center gap-2">
            {guidance.type === 'error' ? <AlertCircle size={24} className="text-red-400" /> : guidance.type === 'success' ? <Sparkles size={24} className="text-yellow-400" /> : <ArrowRightCircle size={24} className="text-slate-300" />}
            {guidance.subText}
          </div>
        </div>
        <div className="w-full flex justify-center">
          {activeField ? (
            <div className="w-full max-w-[320px] bg-slate-50 p-6 rounded-[40px] shadow-inner border-2 border-slate-100">
              <div className="flex justify-between items-center mb-4 px-2">
                <span className="text-xl font-bold text-slate-700 kids-font">{keypadLabel}</span>
                <button onClick={() => setActiveField(null)} className="text-slate-400 p-2">✕</button>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                  <button key={num} onClick={() => handleKeypadInput(num)} className="h-16 bg-white text-3xl font-bold rounded-2xl border-2 border-slate-100 hover:bg-indigo-500 hover:text-white transition-all">{num}</button>
                ))}
                <button onClick={handleClear} className="h-16 bg-slate-200 text-lg font-bold rounded-2xl">{clearBtn}</button>
                <button onClick={() => handleKeypadInput(0)} className="h-16 bg-white text-3xl font-bold rounded-2xl border-2 border-slate-100">{0}</button>
                <button onClick={() => setActiveField(null)} className="h-16 bg-indigo-500 text-white text-lg font-bold rounded-2xl">{doneBtn}</button>
              </div>
            </div>
          ) : (
            <div onClick={() => { if (!isMakeTenSuccessful) setActiveField('part1'); else if (!isDecompositionCorrect) setActiveField('part2'); else setActiveField('resultField'); }} className="p-8 bg-blue-50 rounded-[40px] border-2 border-blue-100 flex flex-col items-center gap-4 cursor-pointer hover:bg-blue-100 transition-all animate-pulse">
               <div className="w-16 h-16 bg-blue-500 text-white rounded-full flex items-center justify-center shadow-lg"><ArrowRightCircle size={40} /></div>
               <span className="text-blue-600 font-bold kids-font text-2xl">{continuePrompt}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BranchDiagram;
