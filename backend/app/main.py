from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, Any, List, Optional
from app.models.prediction_model import DisasterPredictor
from app.models.damage_model import DamageAssessmentModel
from app.models.optimization_model import ResourceOptimizer

app = FastAPI(
    title="AapdaNet AI - Maharashtra Disaster Decision Support Backend",
    description="Multi-hazard AI forecasting, satellite damage assessment, and resource optimization API for Maharashtra",
    version="1.0.0"
)

# Enable CORS for local React development & preview
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Model instances
predictor = DisasterPredictor()
damage_model = DamageAssessmentModel()
optimizer = ResourceOptimizer()

class PredictionRequest(BaseModel):
    rainfall: float = 85.0
    river_level: float = 3.4
    wind_speed: float = 65.0
    slope_angle: float = 28.0
    soil_saturation: float = 75.0
    tremor_magnitude: float = 2.5

class OptimizationRequest(BaseModel):
    inventory: Dict[str, int]
    sectors: List[Dict[str, Any]]

class SOSReportRequest(BaseModel):
    name: str
    phone: str
    district: str
    location_name: str
    category: str
    victims_count: int
    has_disabled_or_elderly: bool
    description: str
    coordinates: Optional[List[float]] = None

@app.get("/api/health")
def health_check():
    return {
        "status": "online",
        "system": "AapdaNet AI Multi-Hazard Decision Support Network",
        "division": "National Emergency Management & Geoinformatics",
        "models_loaded": ["Model 1: Hydrologic LSTM", "Model 2: Satellite CNN", "Model 3: Resource MILP"]
    }

@app.post("/api/predict/disaster")
def predict_disaster(req: PredictionRequest):
    return predictor.predict_hazard(req.model_dump())

@app.get("/api/damage/analyze/{sector_id}")
def analyze_damage(sector_id: str):
    return damage_model.evaluate_sector(sector_id)

@app.post("/api/optimize/resources")
def optimize_resources(req: OptimizationRequest):
    return optimizer.optimize_dispatch(req.inventory, req.sectors)

@app.post("/api/sos/submit")
def submit_sos(req: SOSReportRequest):
    ticket_id = f"SOS-MH-{hash(req.phone + req.name) % 10000:04d}"
    urgency = "P1 - CRITICAL" if req.has_disabled_or_elderly or req.victims_count >= 5 else "P2 - HIGH"
    return {
        "ticket_id": ticket_id,
        "status": "ACKNOWLEDGED_AND_DISPATCHED",
        "urgency": urgency,
        "assigned_unit": "NDRF 5th Battalion / Maharashtra SDRF Rapid Unit",
        "data": req.model_dump()
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
