import React from 'react';
import Link from 'next/link';
import { FileText, Bot, Zap, Printer } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen w-full flex flex-col bg-slate-950 text-slate-100 font-sans">
      
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md p-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Bot size={24} className="text-sky-500" />
          <span className="text-xl font-bold text-slate-100 tracking-wider">CraftCV</span>
        </div>
        <Link 
          href="/build"
          className="bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold py-2 px-5 rounded-lg transition-colors"
        >
          Build CV
        </Link>
      </header>

      {/* Main Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 pt-32 pb-20">
        <div className="text-center max-w-3xl flex flex-col gap-6 mb-16">
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-slate-100 leading-tight">
            Build Your Professional CV <span className="text-sky-500">with AI</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Create a stunning, job-winning curriculum vitae in minutes. Answer a few questions, let our AI refine your content, and instantly download a professional A4 PDF.
          </p>
          <div className="mt-4">
            <Link 
              href="/build"
              className="inline-flex items-center gap-2 bg-sky-500 hover:bg-sky-400 text-slate-950 font-extrabold text-lg py-4 px-10 rounded-xl transition-colors shadow-lg"
            >
              <FileText size={22} />
              Create Your CV Now
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl w-full px-4">
          <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl flex flex-col gap-4">
            <div className="bg-slate-800 w-12 h-12 flex items-center justify-center rounded-xl">
              <Bot size={24} className="text-sky-400" />
            </div>
            <h3 className="text-xl font-bold text-slate-200">Conversational AI</h3>
            <p className="text-slate-500 leading-relaxed">
              Our smart wizard asks you simple questions to extract your professional details perfectly, without the headache of complex forms.
            </p>
          </div>
          
          <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl flex flex-col gap-4">
            <div className="bg-slate-800 w-12 h-12 flex items-center justify-center rounded-xl">
              <Zap size={24} className="text-sky-400" />
            </div>
            <h3 className="text-xl font-bold text-slate-200">AI Content Editor</h3>
            <p className="text-slate-500 leading-relaxed">
              Not sure how to phrase your experience? Just type what you mean, and our AI will rewrite it to sound professional and polished.
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl flex flex-col gap-4">
            <div className="bg-slate-800 w-12 h-12 flex items-center justify-center rounded-xl">
              <Printer size={24} className="text-sky-400" />
            </div>
            <h3 className="text-xl font-bold text-slate-200">Instant PDF Export</h3>
            <p className="text-slate-500 leading-relaxed">
              When you're done, download a beautifully formatted, print-ready A4 PDF document that looks perfect on any screen or paper.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-slate-800 p-6 text-center text-slate-500 text-sm">
        &copy; {new Date().getFullYear()} CraftCV. All rights reserved.
      </footer>
    </div>
  );
}
