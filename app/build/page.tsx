"use client";

import React, { useState, useEffect } from "react";
import { CVData } from "../types";
import { CVLoading } from "../components/CVLoading";
import { CVResult } from "../components/CVResult";
import { CVWizard } from "../components/CVWizard";

export default function CVMakerPage() {
  const [isFinished, setIsFinished] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  const [cvData, setCvData] = useState<CVData>({
    fullName: "", email: "", phone: "", location: "", summary: "", 
    jobs: [], education: [], projects: [], skills: "", references: ""
  });

  useEffect(() => {
    const cached = localStorage.getItem('ai_cv_data');
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (parsed.fullName !== undefined) {
          setCvData(parsed);
        }
      } catch(e) {}
    }
  }, []);

  useEffect(() => {
    if (cvData.fullName || cvData.email) {
       localStorage.setItem('ai_cv_data', JSON.stringify(cvData));
    }
  }, [cvData]);

  const finishWizard = () => {
    setIsGenerating(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => {
      setIsGenerating(false);
      setIsFinished(true);
      setIsEditing(false);
    }, 5000);
  };

  const resetSession = () => {
    setIsFinished(false);
    setIsEditing(false);
    setCvData({
        fullName: "", email: "", phone: "", location: "", summary: "", 
        jobs: [], education: [], projects: [], skills: "", references: ""
    });
    localStorage.removeItem('ai_cv_data');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const editSession = () => {
    setIsFinished(false);
    setIsEditing(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (isGenerating) {
    return <CVLoading />;
  }

  if (isFinished) {
    return <CVResult cvData={cvData} setCvData={setCvData} resetSession={resetSession} editSession={editSession} />;
  }

  return <CVWizard cvData={cvData} setCvData={setCvData} finishWizard={finishWizard} startAtLastStep={isEditing} />;
}
