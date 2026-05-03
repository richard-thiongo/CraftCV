import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Bot, ArrowRight, ArrowLeft, SkipForward, Plus, Trash2 } from 'lucide-react';
import { CVData, FORM_STEPS, generateId } from '../types';

interface CVWizardProps {
  cvData: CVData;
  setCvData: React.Dispatch<React.SetStateAction<CVData>>;
  finishWizard: () => void;
  startAtLastStep?: boolean;
}

export const CVWizard: React.FC<CVWizardProps> = ({ cvData, setCvData, finishWizard, startAtLastStep }) => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(startAtLastStep ? FORM_STEPS.length - 1 : 0);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 500);
    }
  }, [currentStep]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCvData(prev => ({ ...prev, [name]: value }));
  };

  const handleArrayChange = (fieldId: keyof CVData, index: number, subField: string, value: string) => {
    setCvData(prev => {
      const array = [...(prev[fieldId] as any[])];
      array[index] = { ...array[index], [subField]: value };
      return { ...prev, [fieldId]: array };
    });
  };

  const addArrayItem = (fieldId: 'jobs' | 'education' | 'projects') => {
    setCvData(prev => {
      const newItem = fieldId === 'jobs' ? { id: generateId(), title: '', start: '', end: '', desc: '' }
                    : fieldId === 'education' ? { id: generateId(), degree: '', gradDate: '', certifications: '' }
                    : { id: generateId(), name: '', link: '', desc: '' };
      return { ...prev, [fieldId]: [...(prev[fieldId] as any[]), newItem] };
    });
  };

  const removeArrayItem = (fieldId: 'jobs' | 'education' | 'projects', index: number) => {
    setCvData(prev => {
      const array = [...(prev[fieldId] as any[])];
      array.splice(index, 1);
      return { ...prev, [fieldId]: array };
    });
  };

  const handleNext = () => {
    const field = FORM_STEPS[currentStep];
    const val = cvData[field.id];
    
    if (field.required && (typeof val === 'string') && (!val || val.trim() === '')) return; 

    if (currentStep < FORM_STEPS.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      finishWizard();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    } else {
      router.push('/');
    }
  };

  const handleSkip = () => {
    const field = FORM_STEPS[currentStep];
    if (!field.required) {
      if (typeof cvData[field.id] === 'string') {
        setCvData(prev => ({ ...prev, [field.id]: "No" }));
      }
      handleNext();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      const fieldType = FORM_STEPS[currentStep].type;
      if (fieldType === 'textarea' && !e.shiftKey) return; 
      if (fieldType === 'jobs' || fieldType === 'education' || fieldType === 'projects') return;
      e.preventDefault();
      handleNext();
    }
  };

  const currentField = FORM_STEPS[currentStep];
  const progressPercentage = ((currentStep + 1) / FORM_STEPS.length) * 100;
  const isCurrentRequiredAndEmpty = currentField.required && (typeof cvData[currentField.id] === 'string') && (!cvData[currentField.id] || (cvData[currentField.id] as string).trim() === '');

  return (
    <div className="min-h-screen w-full flex justify-center py-4 px-4 sm:px-6 lg:px-8 bg-slate-950">
      <main className="w-full max-w-3xl flex flex-col relative h-full">
        <header className="text-center pb-4 mb-4 sticky top-0 z-10">
          <div className="flex items-center justify-center gap-3">
            <div className="bg-sky-500/20 p-2 rounded-xl">
              <Bot size={28} className="text-sky-400" />
            </div>
            <h1 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-blue-500">CraftCV</h1>
          </div>
          
          <div className="mt-8 px-4">
            <div className="flex justify-between text-xs font-medium text-slate-400 mb-2 uppercase tracking-widest">
              <span>Step {currentStep + 1}</span>
              <span>{FORM_STEPS.length}</span>
            </div>
            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-sky-500 transition-all duration-500 ease-out"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </div>
        </header>

        <div className="w-full relative flex-1 flex flex-col">
          <div className="relative w-full overflow-hidden">
            <div 
              className="flex transition-transform duration-500 ease-in-out items-start"
              style={{ transform: `translateX(-${currentStep * 100}%)` }}
            >
              {FORM_STEPS.map((step, index) => {
                const isActive = index === currentStep;

                return (
                  <div 
                    key={step.id} 
                    className="w-full flex-shrink-0 px-2 transition-opacity duration-500"
                    style={{ 
                      opacity: isActive ? 1 : 0,
                      pointerEvents: isActive ? 'auto' : 'none',
                      height: isActive ? 'auto' : '0px',
                      overflow: isActive ? 'visible' : 'hidden'
                    }}
                  >
                    <div className="glass-panel p-5 sm:p-8 rounded-[2rem] flex flex-col gap-5">
                      <div className="flex flex-col gap-2 mb-2">
                        <div className="flex justify-between items-start">
                          <h2 className="text-2xl font-bold text-slate-100">{step.label}</h2>
                          {!step.required && (
                            <span className="text-xs font-semibold bg-slate-800 text-slate-400 px-2 py-1 rounded-md uppercase tracking-wide">Optional</span>
                          )}
                        </div>
                        {step.helper && <p className="text-xs text-slate-500 leading-relaxed max-w-[90%]">{step.helper}</p>}
                      </div>
                      
                      {step.type === 'textarea' ? (
                        <textarea 
                          ref={isActive ? (inputRef as React.RefObject<HTMLTextAreaElement>) : null}
                          name={step.id} 
                          className="w-full bg-slate-800/50 border border-slate-700 text-slate-100 px-4 py-4 rounded-xl text-base outline-none transition-all duration-300 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 placeholder:text-slate-600 min-h-[140px] resize-y" 
                          value={cvData[step.id] as string} 
                          onChange={handleChange}
                          onKeyDown={handleKeyDown}
                        />
                      ) : step.type === 'text' || step.type === 'email' ? (
                        <input 
                          ref={isActive ? (inputRef as React.RefObject<HTMLInputElement>) : null}
                          type={step.type} 
                          name={step.id} 
                          className="w-full bg-slate-800/50 border border-slate-700 text-slate-100 px-4 py-4 rounded-xl text-base outline-none transition-all duration-300 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 placeholder:text-slate-600" 
                          value={cvData[step.id] as string} 
                          onChange={handleChange}
                          onKeyDown={handleKeyDown}
                        />
                      ) : step.type === 'jobs' ? (
                        <div className="flex flex-col gap-6">
                          {(cvData.jobs).map((job, jIndex) => (
                             <div key={job.id} className="p-5 bg-slate-900/80 rounded-xl border border-slate-700 relative">
                               <button onClick={() => removeArrayItem('jobs', jIndex)} className="absolute top-3 right-3 text-red-400 hover:text-red-300"><Trash2 size={16} /></button>
                               <div className="grid grid-cols-1 gap-4">
                                  <input type="text" placeholder="Job Title & Company" className="w-full bg-slate-800 border border-slate-700 text-slate-100 px-3 py-2 rounded-lg text-sm outline-none" value={job.title} onChange={e => handleArrayChange('jobs', jIndex, 'title', e.target.value)} />
                                  <div className="grid grid-cols-2 gap-4">
                                    <input type="month" className="w-full bg-slate-800 border border-slate-700 text-slate-100 px-3 py-2 rounded-lg text-sm outline-none" value={job.start} onChange={e => handleArrayChange('jobs', jIndex, 'start', e.target.value)} />
                                    <input type="month" className="w-full bg-slate-800 border border-slate-700 text-slate-100 px-3 py-2 rounded-lg text-sm outline-none" value={job.end} onChange={e => handleArrayChange('jobs', jIndex, 'end', e.target.value)} />
                                  </div>
                                  <textarea placeholder="Key Responsibilities..." className="w-full bg-slate-800 border border-slate-700 text-slate-100 px-3 py-2 rounded-lg text-sm outline-none min-h-[80px]" value={job.desc} onChange={e => handleArrayChange('jobs', jIndex, 'desc', e.target.value)} />
                               </div>
                             </div>
                          ))}
                          <button onClick={() => addArrayItem('jobs')} className="flex items-center justify-center gap-2 text-sky-400 border border-dashed border-sky-500/50 py-3 rounded-xl hover:bg-sky-500/10 transition-colors font-medium"><Plus size={18} /> Add Job Experience</button>
                        </div>
                      ) : step.type === 'education' ? (
                        <div className="flex flex-col gap-6">
                          {(cvData.education).map((ed, eIndex) => (
                             <div key={ed.id} className="p-5 bg-slate-900/80 rounded-xl border border-slate-700 relative">
                               <button onClick={() => removeArrayItem('education', eIndex)} className="absolute top-3 right-3 text-red-400 hover:text-red-300"><Trash2 size={16} /></button>
                               <div className="grid grid-cols-1 gap-4">
                                  <input type="text" placeholder="Degree & Institution" className="w-full bg-slate-800 border border-slate-700 text-slate-100 px-3 py-2 rounded-lg text-sm outline-none" value={ed.degree} onChange={e => handleArrayChange('education', eIndex, 'degree', e.target.value)} />
                                  <input type="month" className="w-full bg-slate-800 border border-slate-700 text-slate-100 px-3 py-2 rounded-lg text-sm outline-none" value={ed.gradDate} onChange={e => handleArrayChange('education', eIndex, 'gradDate', e.target.value)} />
                                  <input type="text" placeholder="Certifications (e.g., AWS Certified Developer)" className="w-full bg-slate-800 border border-slate-700 text-slate-100 px-3 py-2 rounded-lg text-sm outline-none" value={ed.certifications} onChange={e => handleArrayChange('education', eIndex, 'certifications', e.target.value)} />
                               </div>
                             </div>
                          ))}
                          <button onClick={() => addArrayItem('education')} className="flex items-center justify-center gap-2 text-sky-400 border border-dashed border-sky-500/50 py-3 rounded-xl hover:bg-sky-500/10 transition-colors font-medium"><Plus size={18} /> Add Education Entry</button>
                        </div>
                      ) : step.type === 'projects' ? (
                        <div className="flex flex-col gap-6">
                          {(cvData.projects).map((proj, pIndex) => (
                             <div key={proj.id} className="p-5 bg-slate-900/80 rounded-xl border border-slate-700 relative">
                               <button onClick={() => removeArrayItem('projects', pIndex)} className="absolute top-3 right-3 text-red-400 hover:text-red-300"><Trash2 size={16} /></button>
                               <div className="grid grid-cols-1 gap-4">
                                  <input type="text" placeholder="Project Name" className="w-full bg-slate-800 border border-slate-700 text-slate-100 px-3 py-2 rounded-lg text-sm outline-none" value={proj.name} onChange={e => handleArrayChange('projects', pIndex, 'name', e.target.value)} />
                                  <input type="text" placeholder="Link (e.g., github.com/repo)" className="w-full bg-slate-800 border border-slate-700 text-slate-100 px-3 py-2 rounded-lg text-sm outline-none" value={proj.link} onChange={e => handleArrayChange('projects', pIndex, 'link', e.target.value)} />
                                  <textarea placeholder="Project Description..." className="w-full bg-slate-800 border border-slate-700 text-slate-100 px-3 py-2 rounded-lg text-sm outline-none min-h-[80px]" value={proj.desc} onChange={e => handleArrayChange('projects', pIndex, 'desc', e.target.value)} />
                               </div>
                             </div>
                          ))}
                          <button onClick={() => addArrayItem('projects')} className="flex items-center justify-center gap-2 text-sky-400 border border-dashed border-sky-500/50 py-3 rounded-xl hover:bg-sky-500/10 transition-colors font-medium"><Plus size={18} /> Add Project</button>
                        </div>
                      ) : null}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-6 px-2 flex items-center justify-between z-20 gap-4 flex-wrap pb-10">
            <button 
              onClick={handleBack} 
              className={`flex items-center gap-2 py-3 px-6 rounded-xl font-bold transition-all duration-300 text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 shadow-md`}
            >
              <ArrowLeft size={18} /> {currentStep === 0 ? 'Home' : 'Back'}
            </button>
            
            <div className="flex gap-3 ml-auto">
              {!currentField.required && (
                <button 
                  onClick={handleSkip} 
                  className="flex items-center gap-2 py-3 px-6 rounded-xl font-bold text-slate-400 hover:text-slate-200 border border-slate-700 hover:bg-slate-800 transition-all duration-300"
                >
                  Skip <SkipForward size={18} />
                </button>
              )}
              
              <button 
                onClick={handleNext} 
                disabled={isCurrentRequiredAndEmpty}
                className={`flex items-center gap-2 py-3 px-8 rounded-xl font-bold transition-all duration-300 shadow-lg ${isCurrentRequiredAndEmpty ? 'bg-slate-800 text-slate-500 cursor-not-allowed' : 'bg-sky-500 hover:bg-sky-400 text-slate-950 transform hover:-translate-y-0.5 shadow-[0_0_20px_rgba(14,165,233,0.3)]'}`}
              >
                {currentStep === FORM_STEPS.length - 1 ? (
                  <>Generate <Bot size={18} /></>
                ) : (
                  <>Next <ArrowRight size={18} /></>
                )}
              </button>
            </div>
          </div>
          
        </div>
      </main>
    </div>
  );
};
