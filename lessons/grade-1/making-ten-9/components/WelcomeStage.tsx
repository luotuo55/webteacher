
import React, { useState } from 'react';
import { Play, Milk, HelpCircle } from 'lucide-react';
import OperationGuide from './OperationGuide';

interface WelcomeStageProps {
  onStart: () => void;
}

// 辅助组件：渲染跑道上的学生（蓝黄运动服）
// Fix: Use React.FC to allow standard React props like 'key' when mapping
const StudentOnTrack: React.FC<{ color: 'blue' | 'yellow', className?: string }> = ({ color, className }) => (
  <div className={`relative w-6 h-10 ${className}`}>
    <div className={`absolute top-0 left-1 w-3 h-3 rounded-full bg-[#ffead1] border border-slate-400`} />
    <div className={`absolute top-2.5 left-0 w-5 h-5 rounded-t-lg ${color === 'blue' ? 'bg-[#3b82f6]' : 'bg-[#facc15]'}`} />
    <div className={`absolute top-7 left-0 w-2 h-3 bg-slate-700 -rotate-12`} />
    <div className={`absolute top-7 left-3 w-2 h-3 bg-slate-700 rotate-12`} />
  </div>
);

// 辅助组件：啦啦队学生
// Fix: Use React.FC to allow standard React props like 'key' when mapping
const Cheerleader: React.FC<{ className?: string }> = ({ className }) => (
  <div className={`relative w-5 h-8 ${className}`}>
    <div className={`absolute top-0 left-0.5 w-2.5 h-2.5 rounded-full bg-[#ffead1]`} />
    <div className={`absolute top-2 left-0 w-4 h-4 rounded-sm bg-[#f87171]`} />
    <div className={`absolute -top-1 -left-1 w-2 h-2 rounded-full bg-orange-400`} />
    <div className={`absolute -top-1 -right-1 w-2 h-2 rounded-full bg-orange-400`} />
  </div>
);

const WelcomeStage: React.FC<WelcomeStageProps> = ({ onStart }) => {
  const [showGuide, setShowGuide] = useState(false);

  return (
    <div className="relative h-full w-full flex flex-col items-center overflow-hidden bg-[#e0f2f1]">
      {/* 操作指南弹出层 */}
      {showGuide && <OperationGuide onClose={() => setShowGuide(false)} />}
      
      {/* 顶部标题栏 */}
      <div className="absolute top-4 left-0 w-full flex justify-center z-50">
        <div className="flex items-center">
          <div className="w-12 h-12 bg-[#0277bd] rounded-full flex items-center justify-center text-white text-2xl font-serif shadow-md border-2 border-white translate-x-4">
            五
          </div>
          <div className="bg-[#fff9c4] px-12 py-2 rounded shadow-sm border border-[#fbc02d]">
            <h2 className="text-[#01579b] text-2xl font-bold tracking-widest font-serif">
              20以内的进位加法
            </h2>
          </div>
        </div>
      </div>

      {/* 远景：树林与天空 */}
      <div className="absolute top-0 w-full h-32 bg-[#c8e6c9] flex items-end justify-around px-10 pb-4">
         {Array.from({length: 15}).map((_, i) => (
           <div key={i} className="w-8 h-12 bg-[#4caf50] rounded-t-full opacity-60"></div>
         ))}
      </div>

      {/* 远景：领奖台与啦啦队 */}
      <div className="absolute top-24 right-10 z-10">
         <div className="w-64 h-12 bg-[#9ccc65] relative flex justify-around items-end pb-1 border-b-2 border-slate-400">
            {Array.from({length: 8}).map((_, i) => (
              <Cheerleader key={i} className="scale-75" />
            ))}
         </div>
         <div className="absolute -bottom-6 left-0 w-64 h-6 bg-[#81c784] skew-x-[-20deg]"></div>
      </div>

      {/* 中景：跑道系统 */}
      <div className="absolute top-[25%] w-full h-[35%] z-10">
        <div className="absolute inset-0 bg-[#f48b76] skew-y-[-3deg] border-y-2 border-white flex flex-col justify-around">
          <div className="w-full h-0.5 bg-white opacity-40"></div>
          <div className="w-full h-0.5 bg-white opacity-40"></div>
          <div className="w-full h-0.5 bg-white opacity-40"></div>
        </div>
        
        {/* 跑道上的运动人群 */}
        <StudentOnTrack color="blue" className="absolute top-4 left-[10%] scale-90" />
        <StudentOnTrack color="yellow" className="absolute top-10 left-[18%]" />
        <StudentOnTrack color="blue" className="absolute top-2 left-[30%] scale-110" />
        <StudentOnTrack color="yellow" className="absolute top-12 left-[45%] scale-125" />
        <StudentOnTrack color="blue" className="absolute top-8 left-[60%]" />
        <StudentOnTrack color="blue" className="absolute top-14 left-[75%] scale-110" />
        <StudentOnTrack color="yellow" className="absolute top-2 left-[85%] scale-90" />
      </div>

      {/* 近景：草地核心教学场景 */}
      <div className="absolute bottom-0 w-full h-[45%] bg-[#9ccc65] z-20">
        <div className="absolute top-[-15%] left-[10%] flex gap-8">
           <div className="relative w-8 h-14">
             <div className="w-4 h-4 rounded-full bg-[#ffead1] mx-auto border" />
             <div className="w-6 h-8 bg-[#facc15] rounded-t-md" />
             <div className="absolute top-4 -left-2 w-10 h-8 border-2 border-slate-500 rounded-full border-t-transparent opacity-50" />
           </div>
        </div>

        {/* 核心场景：分牛奶的对话 */}
        <div className="relative w-full h-full flex flex-col items-center justify-start pt-4">
          <div className="flex items-end gap-20">
            {/* 穿白衬衫的女孩 */}
            <div className="flex flex-col items-center translate-y-4">
              <div className="w-10 h-10 rounded-full bg-[#ffead1] border relative z-10">
                 <div className="absolute top-1 left-0 w-2 h-2 bg-black rounded-full -translate-x-1" />
                 <div className="absolute top-1 right-0 w-2 h-2 bg-black rounded-full translate-x-1" />
              </div>
              <div className="w-10 h-14 bg-white rounded-t-xl border border-slate-200 relative">
                 <div className="absolute top-2 left-1/2 -translate-x-1/2 w-0.5 h-full bg-slate-100" />
              </div>
              <div className="w-14 h-6 bg-[#ff7043] rounded-full -mt-1" />
            </div>

            {/* 牛奶箱场景 */}
            <div className="relative flex flex-col items-center">
              <div className="bg-[#d7ccc8] p-3 rounded shadow-lg border-b-4 border-[#8d6e63] transform rotate-[-1deg]">
                <div className="bg-white border w-36 h-24 grid grid-cols-5 gap-0.5 p-1.5">
                  {Array.from({ length: 9 }).map((_, i) => (
                    <div key={i} className="flex justify-center items-center">
                      <Milk size={14} className="text-[#2196f3]" fill="currentColor" />
                    </div>
                  ))}
                  <div className="border border-dashed border-slate-200 bg-slate-50 flex items-center justify-center">
                     <span className="text-[6px] text-slate-300">空位</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2 mt-2">
                 <div className="flex flex-col gap-0.5">
                   <Milk size={18} className="text-[#2196f3]" fill="currentColor" />
                   <Milk size={18} className="text-[#2196f3]" fill="currentColor" />
                 </div>
                 <div className="flex flex-col gap-0.5 translate-y-2">
                   <Milk size={18} className="text-[#2196f3]" fill="currentColor" />
                   <Milk size={18} className="text-[#2196f3]" fill="currentColor" />
                 </div>
              </div>
            </div>

            {/* 穿 blue 条纹衫的男孩 */}
            <div className="flex flex-col items-center translate-y-4">
               <div className="w-10 h-10 rounded-full bg-[#ffead1] border z-10" />
               <div className="w-10 h-16 bg-[#3b82f6] rounded-t-xl border border-slate-200 overflow-hidden">
                  <div className="w-full h-1 bg-white/30 my-1"></div>
                  <div className="w-full h-1 bg-white/30 my-1"></div>
                  <div className="w-full h-1 bg-white/30 my-1"></div>
                  <div className="w-full h-1 bg-white/30 my-1"></div>
               </div>
               <div className="w-14 h-6 bg-[#fbc02d] rounded-full -mt-1" />
            </div>
          </div>

          {/* 交互按钮 */}
          <div className="mt-8 z-50">
            <button 
              onClick={onStart}
              className="group flex items-center gap-3 bg-[#2e7d32] hover:bg-[#1b5e20] text-white px-8 py-3 rounded-full text-xl font-bold shadow-[0_6px_0_rgb(27,94,32)] hover:shadow-[0_3px_0_rgb(27,94,32)] active:shadow-none transition-all active:translate-y-[6px] font-handwriting"
            >
              <Play size={24} fill="currentColor" />
              开始学习 9加几
            </button>
          </div>
        </div>
      </div>

      {/* 操作指南按钮 - 右下角 */}
      <button 
        onClick={() => setShowGuide(true)}
        className="absolute bottom-6 right-6 z-[60] flex items-center gap-2 bg-white/80 backdrop-blur-sm border-2 border-blue-200 text-blue-600 px-6 py-3 rounded-2xl font-bold shadow-xl hover:bg-blue-50 hover:scale-105 active:scale-95 transition-all"
      >
        <HelpCircle size={24} />
        操作指南
      </button>

      {/* 页码与边缘装饰 */}
      <div className="absolute bottom-4 left-6 text-slate-600 font-serif text-lg opacity-40 z-30">
        88
      </div>

      {/* 算式气泡 */}
      <div className="absolute top-[45%] right-[15%] z-40">
        <div className="bg-white/90 p-3 rounded-xl border-2 border-orange-400 shadow-md rotate-6">
           <span className="text-2xl font-black text-orange-500 font-mono">9 + 4 = ?</span>
        </div>
      </div>
    </div>
  );
};

export default WelcomeStage;
