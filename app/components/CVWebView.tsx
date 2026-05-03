import React from 'react';
import { CVData, isSkipped } from '../types';

export const CVWebView = ({ cvData }: { cvData: CVData }) => (
  <>
    <header className="mb-6">
      <h1 className="text-4xl font-bold tracking-widest text-slate-900 uppercase m-0 mb-8">{cvData.fullName || "YOUR NAME"}</h1>
      <section className="mb-6">
        <h2 className="text-lg font-bold border-b-2 border-slate-900 pb-1 mb-3 text-slate-900 uppercase tracking-wider">Personal Details</h2>
        <div className="pl-1 flex flex-col gap-2 text-sm text-slate-700 break-words">
          {!isSkipped(cvData.email) && <div><span className="font-bold w-20 inline-block text-slate-900">Email:</span> <span className="break-words">{cvData.email}</span></div>}
          {!isSkipped(cvData.phone) && <div><span className="font-bold w-20 inline-block text-slate-900">Phone:</span> <span className="break-words">{cvData.phone}</span></div>}
          {!isSkipped(cvData.location) && <div><span className="font-bold w-20 inline-block text-slate-900">Location:</span> <span className="break-words">{cvData.location}</span></div>}
        </div>
      </section>
    </header>

    <main>
      {!isSkipped(cvData.summary) && (
        <section className="mb-6">
          <h2 className="text-lg font-bold border-b-2 border-slate-900 pb-1 mb-3 text-slate-900 uppercase tracking-wider">Professional Summary</h2>
          <div className="pl-1 text-base leading-relaxed break-words">
            <p className="whitespace-pre-wrap">{cvData.summary}</p>
          </div>
        </section>
      )}

      {cvData.jobs.length > 0 && (
        <section className="mb-6">
          <h2 className="text-lg font-bold border-b-2 border-slate-900 pb-1 mb-3 text-slate-900 uppercase tracking-wider">Work Experience</h2>
          <div className="pl-1 text-base leading-relaxed flex flex-col gap-4">
            {cvData.jobs.map(job => (
               <div key={job.id}>
                 <div className="flex justify-between font-bold mb-1">
                   <span className="text-slate-900">{job.title}</span>
                   <span className="text-slate-600 font-normal text-sm">
                     {job.start} {job.start && job.end ? " — " : ""} {job.end}
                   </span>
                 </div>
                 {job.desc && <p className="whitespace-pre-wrap mt-1 text-slate-700 break-words">{job.desc}</p>}
               </div>
            ))}
          </div>
        </section>
      )}

      {cvData.education.length > 0 && (
        <section className="mb-6">
          <h2 className="text-lg font-bold border-b-2 border-slate-900 pb-1 mb-3 text-slate-900 uppercase tracking-wider">Education & Certifications</h2>
          <div className="pl-1 text-base leading-relaxed flex flex-col gap-4">
            {cvData.education.map(ed => (
               <div key={ed.id}>
                 <div className="flex justify-between font-bold mb-1">
                   <span className="text-slate-900">{ed.degree}</span>
                   {ed.gradDate && <span className="text-slate-600 font-normal text-sm">Graduated: {ed.gradDate}</span>}
                 </div>
                 {ed.certifications && <p className="text-sm text-slate-600 italic mt-1 break-words">Certifications: {ed.certifications}</p>}
               </div>
            ))}
          </div>
        </section>
      )}

      {cvData.projects.length > 0 && (
        <section className="mb-6">
          <h2 className="text-lg font-bold border-b-2 border-slate-900 pb-1 mb-3 text-slate-900 uppercase tracking-wider">Notable Projects</h2>
          <div className="pl-1 text-base leading-relaxed flex flex-col gap-4">
            {cvData.projects.map(proj => (
               <div key={proj.id} className="break-words">
                 <span className="font-bold text-slate-900 block">{proj.name}</span>
                 {proj.desc && <p className="whitespace-pre-wrap text-slate-700 mt-1">{proj.desc}</p>}
                 {proj.link && (
                   <a href={proj.link.startsWith('http') ? proj.link : `https://${proj.link}`} target="_blank" rel="noreferrer" className="text-sky-600 hover:text-sky-800 hover:underline text-sm mt-1 inline-block font-medium">
                     {proj.link}
                   </a>
                 )}
               </div>
            ))}
          </div>
        </section>
      )}

      {!isSkipped(cvData.skills) && (
        <section className="mb-6">
          <h2 className="text-lg font-bold border-b-2 border-slate-900 pb-1 mb-3 text-slate-900 uppercase tracking-wider">Skills</h2>
          <div className="pl-1 text-base leading-relaxed break-words">
            <p className="text-slate-700">{cvData.skills}</p>
          </div>
        </section>
      )}

      {!isSkipped(cvData.references) && (
        <section className="mb-6">
          <h2 className="text-lg font-bold border-b-2 border-slate-900 pb-1 mb-3 text-slate-900 uppercase tracking-wider">References</h2>
          <div className="pl-1 text-base leading-relaxed break-words">
            <p className="whitespace-pre-wrap text-slate-700">{cvData.references}</p>
          </div>
        </section>
      )}
    </main>
  </>
);
