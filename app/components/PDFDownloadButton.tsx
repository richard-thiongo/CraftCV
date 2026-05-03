"use client";

import React, { useState, useEffect } from 'react';
import { Download } from 'lucide-react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import CVDocument from './CVDocument';
import type { CVData } from '../types';

interface PDFDownloadButtonProps {
  cvData: CVData;
  iconOnly?: boolean;
}

export default function PDFDownloadButton({ cvData, iconOnly }: PDFDownloadButtonProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
     if (iconOnly) {
       return <button className="bg-slate-800 text-slate-500 p-3 rounded-full shadow-lg opacity-50 cursor-not-allowed border border-slate-700" disabled><Download size={20} /></button>;
     }
     return <button className="w-full bg-sky-500/50 text-slate-950 font-bold py-3 px-6 rounded-xl flex items-center justify-center gap-2 cursor-not-allowed" disabled><Download size={18} /> Preparing PDF...</button>;
  }

  const getFileName = () => {
    if (cvData.fullName && cvData.fullName.trim() !== '') {
       return `${cvData.fullName.trim().replace(/\s+/g, '_')}_CV.pdf`;
    }
    return "Professional_CV.pdf";
  };

  return (
    <PDFDownloadLink 
      document={<CVDocument cvData={cvData} />} 
      fileName={getFileName()} 
      className={
        iconOnly 
        ? "bg-slate-800 hover:bg-sky-500 text-sky-400 hover:text-slate-950 p-3 rounded-full shadow-lg transition-all duration-300 flex items-center justify-center border border-slate-700 opacity-70 hover:opacity-100 group"
        : "w-full bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold py-3 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg transform hover:-translate-y-0.5"
      }
      style={{ textDecoration: 'none' }}
      title={iconOnly ? "Download PDF" : undefined}
    >
      {({ loading }) => (
        <>
          {iconOnly ? (
            <Download size={20} className={loading ? "animate-pulse" : ""} />
          ) : (
            <><Download size={18} /> {loading ? 'Generating PDF...' : 'Download PDF'}</>
          )}
        </>
      )}
    </PDFDownloadLink>
  );
}
