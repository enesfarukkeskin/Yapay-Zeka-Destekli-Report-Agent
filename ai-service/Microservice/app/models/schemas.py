from pydantic import BaseModel
from typing import List, Optional, Dict, Any

class AnalysisRequest(BaseModel):
    file_path: str
    file_type: str

class QuestionRequest(BaseModel):
    file_path: str
    question: str

class KPIModel(BaseModel):
    name: str
    value: float
    unit: str
    category: str

class TrendModel(BaseModel):
    metric_name: str
    direction: str  # Up, Down, Stable
    change_percentage: float
    time_frame: str

class ActionItemModel(BaseModel):
    title: str
    description: str
    priority: str  # High, Medium, Low
    category: str

class AnalysisResponse(BaseModel):
    summary: str
    kpis: List[KPIModel]
    trends: List[TrendModel]
    action_items: List[ActionItemModel]