import React from 'react';
import { X, Book, Layout, MousePointer, Target, Zap, Milk, Calculator, PencilLine, HelpCircle, Star } from 'lucide-react';

interface OperationGuideProps {
  onClose: () => void;
}

const OperationGuide: React.FC<OperationGuideProps> = ({ onClose }) => {
  const steps = [
    { title: '封面', icon: <Star className="text-yellow-500" />, content: '点击正中央的“开始学习”按钮即可进入教学主流程。右下角随时可以打开本指南查看。' },
    { title: '第一关：热身', icon: <Zap className="text-orange-500" />, content: '包含“数一数”和“抢个答”。在左侧可以利用画笔手动圈出10个苹果，或点击“参考圈法”查看；右侧点击数字按钮快速回答10加几的算式。' },
    { title: '第二关：情境', icon: <Milk className="text-blue-500" />, content: '模拟分牛奶。点击外面的一盒牛奶，它会自动搬进箱子的空位中。凑成10后，点击“列式计算”展示算式。' },
    { title: '第三关：算理', icon: <MousePointer className="text-purple-500" />, content: '通过四个维度理解算理。点击上方切换：1. 摆一摆：点击散落小棒捆成十；2. 圈一圈：点击图片圈出10个点；3. 拨一拨：点击个位珠子凑十并进位；4. 枝型图：逐步演示分拆计算过程。' },
    { title: '第四关：尝试', icon: <Calculator className="text-green-500" />, content: '自主尝试环节。点击加号两侧的箭头调整加数，点击“开始凑十”观察不同数字下的分拆变化。' },
    { title: '第五关：规律', icon: <Layout className="text-pink-500" />, content: '火眼金睛环节。点击“开始寻找规律”，跟随引导按钮逐步发现“找相同”、“找不同”和“深度思考”三个层次的发现。' },
    { title: '第六关：练习', icon: <PencilLine className="text-red-500" />, content: '大显身手。根据随机出现的算式，使用下方的数字键盘输入正确答案。答对后会自动进入下一题并计分。' },
    { title: '结课：总结', icon: <Book className="text-indigo-500" />, content: '回顾本课的核心秘籍，并给出一个思考挑战，引导学生预习“8加几”。' },
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-[3rem] shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden border-[8px] border-blue-50">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 flex justify-between items-center text-white">
          <div className="flex items-center gap-4">
            <div className="bg-white/20 p-2 rounded-xl">
              <Book size={28} />
            </div>
            <h2 className="text-3xl font-black font-handwriting">《9加几》操作指南</h2>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-full transition-colors"
          >
            <X size={32} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-8 bg-slate-50/50">
          {/* Section 1: Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-blue-50 p-6 rounded-[2rem] border-2 border-blue-100 flex flex-col items-center text-center">
              <Target className="text-blue-600 mb-3" size={40} />
              <h3 className="text-xl font-black text-blue-800 mb-2">教学目标</h3>
              <p className="text-slate-600 font-bold leading-relaxed">
                掌握“凑十法”计算9加几，理解“拆小数、凑大数”的算理，培养转换思维。
              </p>
            </div>
            <div className="bg-green-50 p-6 rounded-[2rem] border-2 border-green-100 flex flex-col items-center text-center">
              <Book className="text-green-600 mb-3" size={40} />
              <h3 className="text-xl font-black text-green-800 mb-2">教学内容</h3>
              <p className="text-slate-600 font-bold leading-relaxed">
                小学数学一年级上册《20以内的进位加法》第一课时：9加几。
              </p>
            </div>
            <div className="bg-purple-50 p-6 rounded-[2rem] border-2 border-purple-100 flex flex-col items-center text-center">
              <Layout className="text-purple-600 mb-3" size={40} />
              <h3 className="text-xl font-black text-purple-800 mb-2">模块规划</h3>
              <p className="text-slate-600 font-bold leading-relaxed">
                热身激发 → 情境引入 → 探究算理 → 自主尝试 → 寻找规律 → 巩固练习。
              </p>
            </div>
          </div>

          {/* Section 2: Step-by-Step */}
          <div className="space-y-4">
            <h3 className="text-2xl font-black text-slate-800 flex items-center gap-3 mb-6 px-4">
              <HelpCircle className="text-orange-500" />
              全流程操作详解
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {steps.map((step, idx) => (
                <div 
                  key={idx}
                  className="bg-white p-5 rounded-3xl border-2 border-slate-100 shadow-sm hover:shadow-md transition-shadow flex items-start gap-4 group"
                >
                  <div className="p-3 rounded-2xl bg-slate-50 group-hover:bg-blue-50 transition-colors flex-shrink-0">
                    {step.icon}
                  </div>
                  <div>
                    <h4 className="text-lg font-black text-slate-800 mb-1">{step.title}</h4>
                    <p className="text-slate-500 text-sm font-medium leading-relaxed">
                      {step.content}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-white p-6 border-t flex justify-center">
          <button 
            onClick={onClose}
            className="px-12 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-black text-xl shadow-lg transition-all hover:scale-105"
          >
            我明白了
          </button>
        </div>
      </div>
      
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 8px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in { animation: fade-in 0.3s ease-out forwards; }
      `}</style>
    </div>
  );
};

export default OperationGuide;