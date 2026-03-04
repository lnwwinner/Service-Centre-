import { NextResponse } from 'next/server';
import { GoogleGenAI } from "@google/genai";
import db from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { vehicleId, obdData, action } = await request.json();

    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    if (!apiKey) throw new Error("API Key not found");

    const ai = new GoogleGenAI({ apiKey });
    const model = ai.models.getGenerativeModel({ model: "gemini-3.1-pro-preview" });

    if (action === 'DIAGNOSTIC_ENGINE') {
      const prompt = `
        You are an advanced Machine Learning Diagnostic Engine for automotive service centers.
        Analyze the following OBD-II data and vehicle history to identify potential faults and provide a diagnostic report.
        
        Vehicle ID: ${vehicleId}
        Live OBD Data: ${JSON.stringify(obdData)}
        
        Provide:
        1. Predicted Faults (with probability)
        2. Root Cause Analysis
        3. Recommended Repair Procedure
        4. Severity Level (Critical, Warning, Info)
        
        Format as JSON.
      `;

      const result = await model.generateContent(prompt);
      const responseText = result.response.text;
      
      // Log the diagnostic report
      db.prepare(`
        INSERT INTO diagnostic_reports (vehicle_id, category, data, severity, recommendation)
        VALUES (?, ?, ?, ?, ?)
      `).run(vehicleId, 'AI_ML_DIAGNOSTIC', responseText, 'INFO', 'AI Generated Recommendation');

      // Log the action to immutable audit trail
      db.prepare(`
        INSERT INTO logs (action, user_id, details, ip_address)
        VALUES (?, ?, ?, ?)
      `).run('AI_DIAGNOSTIC_RUN', 1, `Ran ML diagnostic for vehicle ${vehicleId}`, 'SYSTEM');

      return NextResponse.json(JSON.parse(responseText));
    }

    if (action === 'PREDICTIVE_MAINTENANCE') {
      const history = db.prepare('SELECT * FROM service_history WHERE vehicle_id = ? ORDER BY date DESC').all(vehicleId);
      
      const prompt = `
        You are a Predictive Maintenance AI.
        Based on the service history and current mileage/usage, predict the next 3 required maintenance tasks.
        
        Service History: ${JSON.stringify(history)}
        
        Provide:
        1. Task Name
        2. Predicted Date/Mileage
        3. Reason for Prediction
        
        Format as JSON.
      `;

      const result = await model.generateContent(prompt);
      const responseText = result.response.text;
      
      // Log the action to immutable audit trail
      db.prepare(`
        INSERT INTO logs (action, user_id, details, ip_address)
        VALUES (?, ?, ?, ?)
      `).run('AI_PREDICTIVE_MAINTENANCE_RUN', 1, `Ran predictive maintenance for vehicle ${vehicleId}`, 'SYSTEM');

      return NextResponse.json(JSON.parse(responseText));
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error("AI Diagnostic Error:", error);
    return NextResponse.json({ error: 'AI Diagnostic failed' }, { status: 500 });
  }
}
