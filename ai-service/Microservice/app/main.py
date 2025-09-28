from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any
import os
import json
from datetime import datetime

from app.services.file_processor import FileProcessor
from app.services.ai_analyzer import AIAnalyzer
from app.services.openai_service import OpenAIService
from app.models.schemas import AnalysisRequest, QuestionRequest, AnalysisResponse
from app.config import settings

app = FastAPI(
    title="Report Agent AI Service",
    description="AI-powered report analysis service",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5000", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Service instances
file_processor = FileProcessor()
ai_analyzer = AIAnalyzer()
openai_service = OpenAIService()

@app.get("/")
async def root():
    return {"message": "Report Agent AI Service is running!", "timestamp": datetime.now()}

@app.post("/analyze", response_model=AnalysisResponse)
async def analyze_report(request: AnalysisRequest):
    """
    Raporu analiz et ve özet, KPI, trend ve action items çıkar
    """
    try:
        # Dosyayı işle ve veriyi çıkar
        file_data = file_processor.process_file(request.file_path, request.file_type)
        
        if not file_data:
            raise HTTPException(status_code=400, detail="File could not be processed")
        
        # AI analizi yap
        analysis_result = await ai_analyzer.analyze_data(file_data)
        
        return analysis_result
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")

@app.post("/ask")
async def ask_question(request: QuestionRequest):
    """
    Rapor hakkında doğal dilde soru sor
    """
    try:
        # Dosyayı işle
        file_data = file_processor.process_file(request.file_path)
        
        # OpenAI ile soru-cevap
        answer = await openai_service.ask_question(file_data, request.question)
        
        return {"answer": answer}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Question answering failed: {str(e)}")

@app.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.now()}


