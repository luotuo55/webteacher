import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Apple, CheckCircle2, Pencil, Trash2, Zap, ArrowRight, Lightbulb } from 'lucide-react';

const WarmUpStage: React.FC = () => {
  // --- Apple Counting State ---
  const [isGrouped, setIsGrouped] = useState(false);
  const [isPencilActive, setIsPencilActive] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDrawingRef = useRef(false);
  const lastPosRef = useRef({ x: 0, y: 0 });
  const totalApples = 15;

  // --- Quick Math State ---
  const [quizPhase, setQuizPhase] = useState<'group1' | 'summary1' | 'group2' | 'summary2'>('group1');
  const [currentQIdx, setCurrentQIdx] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const group1Questions = [
    { q: '10 + 3 = ?', options: [12, 13, 14], ans: 13 },
    { q: '10 + 7 = ?', options: [16, 17, 18], ans: 17 },
    { q: '5 + 10 = ?', options: [14, 15, 16], ans: 15 },
  ];

  const group2Questions = [
    { q: '9 + 1 + 2 = ?', options: [11, 12, 13], ans: 12 },
    { q: '9 + 1 + 6 = ?', options: [15, 16, 17], ans: 16 },
  ];

  const currentQuestions = quizPhase === 'group1' || quizPhase === 'summary1' ? group1Questions : group2Questions;

  const displayOptions = useMemo(() => {
    if ((quizPhase === 'group1' || quizPhase === 'group2') && currentQuestions[currentQIdx]) {
      return [...currentQuestions[currentQIdx].options].sort(() => Math.random() - 0.5);
    }
    return [];
  }, [currentQIdx, quizPhase]);

  const handleAnswer = (num: number) => {
    const correctAns = currentQuestions[currentQIdx].ans;
    setSelectedAnswer(num);
    if (num === correctAns) {
      setIsCorrect(true);
      setTimeout(() => {
        if (currentQIdx < currentQuestions.length - 1) {
          setCurrentQIdx(currentQIdx + 1);
          setSelectedAnswer(null);
          setIsCorrect(null);
        } else {
          setQuizPhase(quizPhase === 'group1' ? 'summary1' : 'summary2');
        }
      }, 800);
    } else {
      setIsCorrect(false);
      setTimeout(() => {
        setSelectedAnswer(null);
        setIsCorrect(null);
      }, 800);
    }
  };

  // --- 优化苹果位置逻辑 ---
  const [positions] = useState(() => {
    const apples: { top: string; left: string; rotate: number }[] = [];
    const usedPositions: { x: number; y: number }[] = [];
    const minDistance = 12; 
    
    for (let i = 0; i < totalApples; i++) {
      let attempts = 0;
      let pos = { x: 0, y: 0 };
      let tooClose = true;
      
      while (tooClose && attempts < 500) {
        pos = { x: 10 + Math.random() * 80, y: 10 + Math.random() * 80 };
        tooClose = usedPositions.some(p => 
          Math.sqrt(Math.pow(p.x - pos.x, 2) + Math.pow(p.y - pos.y, 2)) < minDistance
        );
        attempts++;
      }
      
      usedPositions.push(pos);
      apples.push({ 
        top: `${pos.y}%`, 
        left: `${pos.x}%`, 
        rotate: Math.floor(Math.random() * 360) 
      });
    }
    return apples;
  });

  useEffect(() => {
    const initCanvas = () => {
      if (canvasRef.current && containerRef.current) {
        const canvas = canvasRef.current;
        const container = containerRef.current;
        canvas.width = container.clientWidth;
        canvas.height = container.clientHeight;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.lineCap = 'round'; 
          ctx.lineJoin = 'round'; 
          ctx.strokeStyle = '#ef4444'; 
          ctx.lineWidth = 6;
        }
      }
    };
    initCanvas();
    const timer = setTimeout(initCanvas, 100);
    window.addEventListener('resize', initCanvas);
    return () => { 
      window.removeEventListener('resize', initCanvas); 
      clearTimeout(timer); 
    };
  }, [isGrouped]);

  const getCoordinates = (e: React.MouseEvent | React.TouchEvent | MouseEvent | TouchEvent) => {
    if (!canvasRef.current) return { x: 0, y: 0 };
    const rect = canvasRef.current.getBoundingClientRect();
    let clientX, clientY;
    if ('touches' in e) {
      clientX = e.touches[0].clientX; 
      clientY = e.touches[0].clientY;
    } else {
      clientX = (e as MouseEvent).clientX; 
      clientY = (e as MouseEvent).clientY;
    }
    return { x: clientX - rect.left, y: clientY - rect.top };
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isPencilActive) return;
    isDrawingRef.current = true;
    const pos = getCoordinates(e);
    lastPosRef.current = pos;
    const ctx = canvasRef.current?.getContext('2d');
    if (ctx) { 
      ctx.beginPath(); 
      ctx.moveTo(pos.x, pos.y); 
    }
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawingRef.current || !isPencilActive) return;
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;
    const pos = getCoordinates(e);
    ctx.lineTo(pos.x, pos.y); 
    ctx.stroke();
    lastPosRef.current = pos;
  };

  const stopDrawing = () => {
    if (isDrawingRef.current) { 
      canvasRef.current?.getContext('2d')?.closePath(); 
    }
    isDrawingRef.current = false;
  };

  const clearCanvas = () => {
    const ctx = canvasRef.current?.getContext('2d');
    if (ctx && canvasRef.current) { 
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height); 
    }
  };

  return (
    <div className="flex flex-col h-full space-y-4">
      <div className="flex items-center gap-4 border-b pb-4">
        <div className="bg-yellow-100 px-3 py-1 rounded-lg text-yellow-700 font-bold">第一关</div>
        <h2 className="text-2xl font-bold text-slate-700 font-handwriting">热身运动：数一数 & 抢个答</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_0.7fr] gap-6 flex-1 overflow-auto min-h-0 custom-scrollbar pr-2">
        {/* Activity 1: Counting */}
        <div className="bg-white rounded-[2rem] p-6 border-2 border-slate-100 shadow-sm relative overflow-hidden flex flex-col min-h-[500px]">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
              <Apple className="text-red-500" />
              这里有多少个苹果？
            </h3>
            <div className="flex gap-2">
               <button 
                onClick={() => { setIsPencilActive(!isPencilActive); if (isPencilActive) stopDrawing(); }}
                className={`p-3 rounded-xl transition-all shadow-sm flex items-center gap-2 border-2 z-30 ${isPencilActive ? 'bg-red-500 border-red-600 text-white scale-105' : 'bg-white text-slate-500 border-slate-200 hover:border-red-400'}`}
              >
                <Pencil size={20} />
                <span className="font-bold">{isPencilActive ? '正在圈画' : '手动圈一圈'}</span>
              </button>
              <button onClick={clearCanvas} className="p-3 rounded-xl bg-white text-slate-500 hover:text-red-500 border-2 border-slate-200 shadow-sm transition-colors z-30"><Trash2 size={20} /></button>
            </div>
          </div>
          
          <div ref={containerRef} className="relative flex-1 bg-slate-50/50 rounded-[1.5rem] shadow-inner border-2 border-dashed border-slate-200 touch-none overflow-hidden min-h-[350px]">
            {isGrouped ? (
              <div className="flex items-center justify-center h-full gap-12 p-10 animate-fade-in">
                <div className="bg-white p-8 rounded-[2.5rem] border-4 border-red-200 relative shadow-xl">
                  <span className="absolute -top-5 -right-5 bg-red-500 text-white px-6 py-2 rounded-full text-xl font-bold shadow-lg ring-4 ring-white">10个</span>
                  <div className="grid grid-cols-5 gap-3">
                    {Array.from({ length: 10 }).map((_, i) => <Apple key={`group-10-${i}`} className="text-red-500 w-12 h-12" fill="currentColor" />)}
                  </div>
                </div>
                <div className="bg-white p-8 rounded-[2.5rem] border-4 border-red-100 relative shadow-xl">
                   <span className="absolute -top-5 -right-5 bg-red-400 text-white px-6 py-2 rounded-full text-xl font-bold shadow-lg ring-4 ring-white">5个</span>
                  <div className="grid grid-cols-5 gap-3">
                    {Array.from({ length: 5 }).map((_, i) => <Apple key={`group-5-${i}`} className="text-red-500 w-12 h-12" fill="currentColor" />)}
                  </div>
                </div>
              </div>
            ) : (
              <div className="absolute inset-0 pointer-events-none">
                {positions.map((pos, i) => (
                  <div 
                    key={`scatter-${i}`} 
                    className="absolute" 
                    style={{ 
                      top: pos.top, 
                      left: pos.left, 
                      transform: `translate(-50%, -50%) rotate(${pos.rotate}deg)`,
                      zIndex: 10
                    }}
                  >
                     <Apple className="text-red-500 w-16 h-16 md:w-20 md:h-20 drop-shadow-xl" fill="currentColor" />
                  </div>
                ))}
              </div>
            )}
            <canvas 
              ref={canvasRef} 
              className={`absolute inset-0 z-20 ${isPencilActive ? 'cursor-crosshair' : 'pointer-events-none'}`} 
              onMouseDown={startDrawing} 
              onMouseMove={draw} 
              onMouseUp={stopDrawing} 
              onMouseLeave={stopDrawing} 
              onTouchStart={startDrawing} 
              onTouchMove={draw} 
              onTouchEnd={stopDrawing}
            />
          </div>

          <div className="mt-4 flex flex-col items-center gap-3">
            <button 
              onClick={() => { setIsGrouped(!isGrouped); setIsPencilActive(false); }} 
              className={`px-12 py-4 rounded-2xl font-bold text-xl transition-all shadow-lg hover:scale-105 active:scale-95 z-30 ${isGrouped ? 'bg-slate-500 text-white' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
            >
              {isGrouped ? "重新尝试圈画" : "看看参考圈法"}
            </button>
            {isGrouped && <div className="text-green-600 text-2xl font-bold animate-bounce tracking-wide">1个十和5个一，合起来是 15！</div>}
          </div>
        </div>

        {/* Activity 2: Quick Math - 允许垂直滚动以防显示不全 */}
        <div className="bg-white rounded-[2rem] p-6 border-2 border-slate-100 shadow-sm flex flex-col min-h-[500px]">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <Zap className="text-yellow-500 fill-yellow-500" />
              抢答：谁快？
            </h3>
            <div className="flex gap-1">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className={`w-2 h-2 rounded-full ${
                  (quizPhase === 'group1' && i === 0) || (quizPhase === 'summary1' && i === 1) || (quizPhase === 'group2' && i === 2) || (quizPhase === 'summary2' && i === 3)
                  ? 'bg-blue-500 scale-125' : 'bg-slate-200'
                }`} />
              ))}
            </div>
          </div>

          <div className="flex-1 bg-slate-50/50 rounded-[1.5rem] p-6 flex flex-col items-center justify-start border border-slate-100 relative overflow-y-auto custom-scrollbar min-h-0">
            
            {(quizPhase === 'group1' || quizPhase === 'group2') ? (
              <div className="w-full space-y-6 animate-fade-in flex flex-col items-center py-4">
                <div className="text-center">
                  <span className="text-blue-500 font-bold bg-blue-50 px-3 py-1 rounded-full text-xs mb-3 block">
                    {quizPhase === 'group1' ? '第一组：10加几' : '第二组：凑十再加'}
                  </span>
                  <div className="text-5xl md:text-6xl font-black text-slate-800 font-mono tracking-tighter mb-6">
                    {currentQuestions[currentQIdx].q}
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 w-full max-w-[240px]">
                  {displayOptions.map(num => (
                    <button 
                      key={num}
                      onClick={() => handleAnswer(num)}
                      className={`py-4 rounded-2xl font-bold text-3xl border-4 transition-all shadow-md ${
                        selectedAnswer === num 
                          ? isCorrect ? 'bg-green-500 text-white border-green-600 scale-105' : 'bg-red-500 text-white border-red-600 animate-shake'
                          : 'border-white bg-white hover:border-blue-400 text-slate-700 hover:scale-105 active:scale-95'
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>

                <div className="mt-4 text-slate-400 font-bold text-sm bg-white px-4 py-1 rounded-full border border-slate-100">
                  进度 {currentQIdx + 1} / {currentQuestions.length}
                </div>
              </div>
            ) : quizPhase === 'summary1' ? (
              <div className="text-center space-y-6 animate-fade-in py-8 w-full flex flex-col items-center">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <CheckCircle2 size={40} className="text-green-600" />
                </div>
                <h4 className="text-2xl font-bold text-green-700">全对了！</h4>
                <div className="bg-yellow-50 p-6 rounded-2xl border-2 border-yellow-200 text-left w-full max-w-sm">
                   <p className="font-bold text-yellow-800 mb-2 flex items-center gap-2">
                     <Lightbulb size={18} /> 我的发现：
                   </p>
                   <p className="text-yellow-700 text-base font-medium leading-relaxed">10加几就等于十几，<br/>算起来特别快！</p>
                </div>
                <button 
                  onClick={() => { setQuizPhase('group2'); setCurrentQIdx(0); setSelectedAnswer(null); setIsCorrect(null); }}
                  className="w-full max-w-sm flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-bold transition-all shadow-lg hover:scale-105"
                >
                  继续挑战 <ArrowRight size={20} />
                </button>
              </div>
            ) : (
              <div className="text-center space-y-6 animate-fade-in py-8 w-full flex flex-col items-center">
                <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Zap size={40} className="text-indigo-600 fill-indigo-200" />
                </div>
                <h4 className="text-2xl font-bold text-indigo-700">真聪明！</h4>
                <div className="bg-blue-50 p-6 rounded-2xl border-2 border-blue-200 text-left w-full max-w-sm">
                   <p className="font-bold text-blue-800 mb-2">思考方法：</p>
                   <p className="text-blue-700 text-base font-medium leading-relaxed">先看到9和1凑成10，<br/>转化成10加几就好算了！</p>
                </div>
                <div className="text-slate-400 font-bold text-sm italic py-2">准备好开始新课了吗？</div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default WarmUpStage;