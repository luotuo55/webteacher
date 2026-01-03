import React, { useState } from 'react';
import { Star, RotateCcw } from 'lucide-react';

const PracticeStage: React.FC = () => {
  // Simple state for a single question flow
  const [question, setQuestion] = useState({ add: 5 });
  const [input, setInput] = useState('');
  const [feedback, setFeedback] = useState<'idle' | 'correct' | 'wrong'>('idle');
  const [score, setScore] = useState(0);

  const generateQuestion = () => {
    const nextAdd = Math.floor(Math.random() * 8) + 2; // 2 to 9
    setQuestion({ add: nextAdd });
    setInput('');
    setFeedback('idle');
  };

  const checkAnswer = (val: string) => {
    const num = parseInt(val);
    if (isNaN(num)) return;
    
    const correct = 9 + question.add;
    if (num === correct) {
      setFeedback('correct');
      setScore(s => s + 1);
      // Auto next after 1.5s
      setTimeout(generateQuestion, 1500);
    } else {
      setFeedback('wrong');
      setInput(''); // Clear input to try again
    }
  };

  return (
    <div className="flex flex-col h-full space-y-6">
      <div className="flex items-center gap-4 border-b pb-4 justify-between">
        <div className="flex items-center gap-4">
          <div className="bg-red-100 p-2 rounded-lg text-red-700 font-bold">第五关</div>
          <h2 className="text-2xl font-bold text-slate-700">大显身手</h2>
        </div>
        <div className="flex items-center gap-2 text-yellow-500 font-bold text-xl">
           <Star fill="currentColor" />
           <span>{score}</span>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center">
         <div className="bg-white p-12 rounded-3xl shadow-xl border-4 border-green-100 w-full max-w-lg text-center relative overflow-hidden">
            {feedback === 'correct' && (
               <div className="absolute inset-0 bg-green-100/80 flex items-center justify-center z-10 animate-fade-in">
                  <span className="text-5xl font-bold text-green-600 animate-bounce">太棒了！</span>
               </div>
            )}
            
            <div className="text-6xl font-mono font-bold mb-12 text-slate-700">
               9 + {question.add} = ?
            </div>

            <div className="grid grid-cols-3 gap-4">
               {/* Number Pad */}
               {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map(num => (
                  <button
                    key={num}
                    onClick={() => {
                      const newVal = input + num.toString();
                      if (parseInt(newVal) > 20) {
                         setInput(num.toString()); // Reset if too big
                      } else {
                         setInput(newVal);
                         if (newVal.length === 2) checkAnswer(newVal);
                      }
                    }}
                    className={`h-16 rounded-xl text-2xl font-bold shadow-sm transition-all active:scale-95 ${num === 0 ? 'col-span-3' : ''} bg-slate-50 hover:bg-blue-50 text-slate-600 border border-slate-200`}
                  >
                    {num}
                  </button>
               ))}
            </div>

            <div className="mt-8 flex justify-center items-center h-16">
               <div className="text-4xl font-bold text-blue-600 tracking-widest border-b-4 border-blue-200 px-8 min-w-[150px]">
                  {input}
               </div>
            </div>
         </div>
         
         <div className="mt-8">
            <p className="text-slate-500 text-sm">提示：想把 {question.add} 分成 1 和 ...</p>
         </div>
      </div>
    </div>
  );
};

export default PracticeStage;