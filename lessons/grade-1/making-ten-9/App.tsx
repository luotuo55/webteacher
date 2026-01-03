
import React, { useState } from 'react';
import { Stage } from './types';
import { STAGE_ORDER } from './constants';
import WelcomeStage from './components/WelcomeStage';
import WarmUpStage from './components/WarmUpStage';
import ScenarioStage from './components/ScenarioStage';
import MethodStage from './components/MethodStage';
import TryStage from './components/TryStage';
import PatternStage from './components/PatternStage';
import PracticeStage from './components/PracticeStage';
import SummaryStage from './components/SummaryStage';
import Navigation from './components/Navigation';
import { BookOpen, Star } from 'lucide-react';

const App: React.FC = () => {
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const currentStage = STAGE_ORDER[currentStageIndex];

  const handleNext = () => {
    if (currentStageIndex < STAGE_ORDER.length - 1) {
      setCurrentStageIndex(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentStageIndex > 0) {
      setCurrentStageIndex(prev => prev - 1);
    }
  };

  const renderStage = () => {
    switch (currentStage) {
      case Stage.WELCOME:
        return <WelcomeStage onStart={handleNext} />;
      case Stage.WARMUP:
        return <WarmUpStage />;
      case Stage.SCENARIO:
        return <ScenarioStage />;
      case Stage.METHOD:
        return <MethodStage />;
      case Stage.TRY:
        return <TryStage />;
      case Stage.PATTERN:
        return <PatternStage />;
      case Stage.PRACTICE:
        return <PracticeStage />;
      case Stage.SUMMARY:
        return <SummaryStage onRestart={() => setCurrentStageIndex(0)} />;
      default:
        return <div>Stage not found</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex flex-col font-sans text-slate-800 overflow-hidden relative">
      {/* Header */}
      <header className="bg-white shadow-md p-4 flex justify-between items-center z-10 px-8">
        <div className="flex items-center gap-3 text-green-600">
          <BookOpen className="w-10 h-10" />
          <h1 className="text-3xl font-bold font-handwriting">9加几：凑十法大冒险</h1>
        </div>
        <div className="flex items-center gap-4">
           <div className="flex gap-2">
             {STAGE_ORDER.map((stage, idx) => (
               <div 
                  key={stage} 
                  className={`w-4 h-4 rounded-full transition-all duration-300 ${idx === currentStageIndex ? 'bg-green-500 scale-125 ring-4 ring-green-100' : idx < currentStageIndex ? 'bg-green-300' : 'bg-gray-200'}`}
               />
             ))}
           </div>
           <span className="text-slate-400 font-bold ml-2">进度 {currentStageIndex + 1}/{STAGE_ORDER.length}</span>
        </div>
      </header>

      {/* Main Content Area - Optimized for Desktop */}
      <main className="flex-1 relative flex flex-col justify-center items-center p-6 md:p-12 w-full">
        <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-[1400px] h-[calc(100vh-180px)] min-h-[700px] p-8 md:p-12 relative border-[6px] border-green-50 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-auto custom-scrollbar">
            {renderStage()}
          </div>
        </div>
      </main>

      {/* Navigation Controls */}
      {currentStage !== Stage.WELCOME && (
        <Navigation 
          onNext={handleNext} 
          onPrev={handlePrev} 
          isFirst={currentStageIndex === 0} 
          isLast={currentStageIndex === STAGE_ORDER.length - 1} 
        />
      )}
      
      {/* Decorative Background Elements */}
      <div className="absolute top-24 left-12 text-yellow-300 opacity-20 pointer-events-none animate-bounce-slow">
        <Star size={120} />
      </div>
      <div className="absolute bottom-16 right-16 text-blue-300 opacity-20 pointer-events-none animate-bounce-slow" style={{animationDelay: '1.5s'}}>
        <div className="text-[12rem] font-bold select-none">9</div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>
    </div>
  );
};

export default App;
