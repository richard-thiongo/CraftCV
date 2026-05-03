import React, { useState, useEffect, useRef } from 'react';
import { Bot, RefreshCw, Maximize2, ArrowLeft, ChevronLeft, ChevronRight, Edit3 } from 'lucide-react';
import dynamic from 'next/dynamic';
import { CVData } from '../types';
import { CVWebView } from './CVWebView';

const PDFDownloadButton = dynamic(() => import("./PDFDownloadButton"), { 
  ssr: false, 
  loading: () => <button className="bg-sky-500/50 text-slate-950 font-bold py-3 px-6 rounded-xl flex items-center justify-center gap-2 cursor-not-allowed w-full" disabled>Preparing PDF...</button> 
});

interface CVResultProps {
  cvData: CVData;
  setCvData: React.Dispatch<React.SetStateAction<CVData>>;
  resetSession: () => void;
  editSession: () => void;
}

export const CVResult: React.FC<CVResultProps> = ({ cvData, setCvData, resetSession, editSession }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [enhanceError, setEnhanceError] = useState("");

  const contentRef = useRef<HTMLDivElement>(null);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    // Small delay to ensure rendering is complete before measuring
    setTimeout(() => {
      if (contentRef.current && contentRef.current.parentElement) {
        const scrollHeight = contentRef.current.scrollHeight;
        const clientHeight = contentRef.current.parentElement.clientHeight;
        if (clientHeight > 0) {
           setTotalPages(Math.max(1, Math.ceil(scrollHeight / clientHeight)));
        }
      }
    }, 100);
  }, [cvData]);

  const handlePrevPage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentPage(p => Math.max(0, p - 1));
  };

  const handleNextPage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentPage(p => Math.min(totalPages - 1, p + 1));
  };

  const handleEnhance = async () => {
    if (!aiPrompt.trim()) return;
    setIsEnhancing(true);
    setEnhanceError("");
    try {
      const response = await fetch('/api/enhance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cvData, prompt: aiPrompt })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to enhance CV');
      setCvData(data.cvData);
      setAiPrompt("");
    } catch (err: any) {
      setEnhanceError(err.message);
    } finally {
      setIsEnhancing(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center py-12 px-4 bg-slate-950">
      <h2 className="text-slate-200 text-xl font-bold mb-6 uppercase tracking-widest text-center">Your Generated CV</h2>
      
      <div className="relative mb-12 sm:mb-16 mt-4 flex justify-center">
        {/* Main Thumbnail Container */}
        <div className="relative">
          <div 
            className="relative group cursor-pointer bg-white rounded-xl overflow-hidden shadow-[0_0_40px_rgba(14,165,233,0.15)] border-2 border-slate-700 hover:border-sky-500 transition-all duration-300 transform hover:scale-105 w-[240px] h-[340px] shrink-0"
            onClick={() => setIsFullscreen(true)}
          >
             <div className="pointer-events-none origin-top-left scale-[0.30] w-[210mm] h-[297mm] bg-white text-slate-900 overflow-hidden">
                 <div 
                   ref={contentRef}
                   className="p-[20mm] transition-transform duration-500 ease-in-out"
                   style={{ transform: `translateY(calc(-${currentPage * 297}mm))` }}
                 >
                    <CVWebView cvData={cvData} />
                 </div>
             </div>
             
             <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm pointer-events-none">
                <span className="bg-sky-500 text-slate-950 font-bold py-2 px-4 rounded-lg flex items-center gap-2 text-sm pointer-events-auto"><Maximize2 size={16} /> View Full</span>
             </div>
          </div>

          {totalPages > 1 && (
            <>
              <button 
                onClick={handlePrevPage}
                disabled={currentPage === 0}
                className="absolute -left-12 sm:-left-16 top-1/2 -translate-y-1/2 bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed text-white p-2 sm:p-3 rounded-full shadow-lg z-10 transition-colors border border-slate-700"
              >
                <ChevronLeft size={24} />
              </button>
              <button 
                onClick={handleNextPage}
                disabled={currentPage === totalPages - 1}
                className="absolute -right-12 sm:-right-16 top-1/2 -translate-y-1/2 bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed text-white p-2 sm:p-3 rounded-full shadow-lg z-10 transition-colors border border-slate-700"
              >
                <ChevronRight size={24} />
              </button>
              <div className="absolute -bottom-8 left-0 right-0 text-center text-xs text-slate-400 font-medium tracking-widest uppercase">
                 Page {currentPage + 1} of {totalPages}
              </div>
            </>
          )}
        </div>

        {/* Floating Side Buttons */}
        <div className="absolute -right-16 sm:-right-24 top-1/2 -translate-y-1/2 flex flex-col gap-10">
           <PDFDownloadButton cvData={cvData} iconOnly={true} />
           <button 
             onClick={editSession}
             title="Edit CV"
             className="bg-slate-800 hover:bg-sky-500 text-sky-400 hover:text-slate-950 p-3 rounded-full shadow-lg transition-all duration-300 flex items-center justify-center border border-slate-700 opacity-70 hover:opacity-100"
           >
             <Edit3 size={20} />
           </button>
        </div>
      </div>

      <div className="w-full max-w-[500px] flex flex-col gap-8 items-stretch no-print">
        <div className="glass-panel p-5 sm:p-6 rounded-2xl flex flex-col gap-4">
           <div className="flex items-center gap-2">
             <Bot size={20} className="text-sky-400" />
             <h3 className="m-0 text-lg font-bold text-slate-100">Ask AI to Edit Your CV</h3>
           </div>
           <p className="text-slate-400 text-xs sm:text-sm m-0">
             Want to make it sound more professional? Fix typos? Translate a section? Just ask!
           </p>
           <div className="flex flex-col sm:flex-row gap-3 mt-2">
             <input 
               type="text" 
               className="w-full bg-slate-800/80 border border-slate-700 text-slate-100 px-4 py-3 rounded-xl text-sm outline-none transition-all focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 placeholder:text-slate-500"
               placeholder="e.g., Make my summary executive..." 
               value={aiPrompt}
               onChange={(e) => setAiPrompt(e.target.value)}
               onKeyDown={(e) => e.key === 'Enter' && handleEnhance()}
               disabled={isEnhancing}
             />
             <button 
               onClick={handleEnhance} 
               disabled={isEnhancing || !aiPrompt.trim()} 
               className="bg-sky-500 hover:bg-sky-400 disabled:opacity-50 disabled:cursor-not-allowed text-slate-950 font-bold py-3 px-6 rounded-xl transition-all duration-300 flex items-center justify-center shadow-lg transform hover:-translate-y-0.5 whitespace-nowrap"
             >
               {isEnhancing ? 'Working...' : 'Enhance'}
             </button>
           </div>
           {enhanceError && <p className="text-red-400 text-xs m-0 font-medium">{enhanceError}</p>}
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
            <button onClick={resetSession} className="w-full sm:w-1/2 bg-slate-800 hover:bg-slate-700 text-slate-100 font-semibold py-3 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 border border-slate-700 shadow-md">
              <RefreshCw size={18} /> Start Over Completely
            </button>
        </div>
      </div>

      {isFullscreen && (
        <div className="fixed inset-0 z-[100] bg-slate-950/95 backdrop-blur-md flex flex-col">
           <div className="flex-none w-full bg-slate-950/80 backdrop-blur-md border-b border-slate-800 p-4 flex items-center justify-center sm:justify-between shadow-lg z-10">
              <h3 className="text-slate-200 font-bold tracking-widest uppercase text-sm hidden sm:block">Full Preview</h3>
              <button 
                onClick={() => setIsFullscreen(false)} 
                className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 px-6 py-2.5 rounded-full font-bold transition-all duration-300 shadow-lg border border-slate-700"
              >
                <ArrowLeft size={18} /> Go Back
              </button>
           </div>
           
           <div className="flex-1 overflow-auto p-4 sm:p-8 pb-20 relative">
              <div className="relative w-[210mm] h-[297mm] bg-white text-slate-900 shadow-[0_0_50px_rgba(0,0,0,0.5)] mx-auto rounded-sm overflow-hidden shrink-0">
                 <div 
                   className="p-[20mm] transition-transform duration-500 ease-in-out"
                   style={{ transform: `translateY(calc(-${currentPage * 297}mm))` }}
                 >
                    <CVWebView cvData={cvData} />
                 </div>
              </div>
           </div>

           {totalPages > 1 && (
             <>
               <button 
                 onClick={handlePrevPage}
                 disabled={currentPage === 0}
                 className="fixed left-4 sm:left-12 top-1/2 -translate-y-1/2 bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed text-white p-3 sm:p-4 rounded-full shadow-xl z-[110] transition-colors border border-slate-700"
               >
                 <ChevronLeft size={32} />
               </button>
               <button 
                 onClick={handleNextPage}
                 disabled={currentPage === totalPages - 1}
                 className="fixed right-4 sm:right-12 top-1/2 -translate-y-1/2 bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed text-white p-3 sm:p-4 rounded-full shadow-xl z-[110] transition-colors border border-slate-700"
               >
                 <ChevronRight size={32} />
               </button>
               <div className="fixed bottom-6 left-1/2 -translate-x-1/2 text-center text-sm text-slate-400 font-medium tracking-widest uppercase bg-slate-950/80 py-2 px-6 rounded-full backdrop-blur-md border border-slate-800 z-[110]">
                  Page {currentPage + 1} of {totalPages}
               </div>
             </>
           )}
        </div>
      )}
    </div>
  );
};
