import React from 'react';

export const CVLoading = () => (
  <div className="min-h-screen w-full flex flex-col items-center justify-center bg-slate-950 text-slate-100">
     <div className="w-16 h-16 border-4 border-slate-800 border-t-sky-500 rounded-full animate-spin mb-6"></div>
     <h2 className="text-2xl font-bold tracking-widest uppercase text-sky-400 animate-pulse">Working on it...</h2>
     <p className="text-slate-500 mt-2 text-sm tracking-wide">Crafting your professional CV with precision.</p>
  </div>
);
