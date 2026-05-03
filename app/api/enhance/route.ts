import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import { CVData } from '../../types';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(request: Request) {
  try {
    const { cvData, prompt } = await request.json();

    if (!cvData || !prompt) {
      return NextResponse.json({ error: 'Missing cvData or prompt' }, { status: 400 });
    }

    const systemInstruction = `You are an expert CV editor and career advisor. 
You are given the current state of a user's CV in JSON format.
The user will provide a prompt describing how they want their CV changed.
Apply the requested changes to the CV data.
Return the updated CV as a JSON object. Ensure you only return valid JSON. Do not include markdown code blocks. 
The JSON keys should exactly match the provided CV data keys: 
fullName, email, phone, location, summary, jobs, education, projects, skills, references.`;

    const message = `Current CV Data:\n${JSON.stringify(cvData, null, 2)}\n\nUser Request:\n${prompt}`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: message,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: 'application/json',
      }
    });

    const responseText = response.text;
    if (!responseText) {
       return NextResponse.json({ error: 'No response from AI' }, { status: 500 });
    }
    
    let updatedCvData;
    try {
      updatedCvData = JSON.parse(responseText);
    } catch (parseError) {
      console.error('Failed to parse AI response:', responseText);
      return NextResponse.json({ error: 'Invalid JSON returned from AI' }, { status: 500 });
    }

    return NextResponse.json({ cvData: updatedCvData });
  } catch (error) {
    console.error('Error enhancing CV:', error);
    return NextResponse.json({ error: 'Failed to enhance CV' }, { status: 500 });
  }
}
