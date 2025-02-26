import os
import json
import uuid
from fastapi import FastAPI, File, UploadFile, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from typing import List
import shutil

from config import API_PREFIX, UPLOAD_FOLDER, OUTPUT_FOLDER, DEFAULT_PROMPT
from ai_utils import analyze_pdfs

app = FastAPI(title="Comparateur de Devis API")

# Configuration CORS pour permettre les requêtes depuis le frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # À remplacer par l'URL du frontend en production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Bienvenue sur l'API du Comparateur de Devis"}

@app.post(f"{API_PREFIX}/compare")
async def compare_quotes(
    files: List[UploadFile] = File(...),
    prompt: str = Form(DEFAULT_PROMPT)
):
    """
    Compare deux fichiers PDF de devis en utilisant ChatGPT.
    Retourne une analyse détaillée sous format JSON.
    """
    if len(files) != 2:
        raise HTTPException(status_code=400, detail="Exactement deux fichiers PDF sont requis")
    
    # Vérifier que les fichiers sont des PDFs
    for file in files:
        if not file.filename.lower().endswith('.pdf'):
            raise HTTPException(status_code=400, detail=f"Le fichier {file.filename} n'est pas un PDF")
    
    # Créer un ID unique pour cette comparaison
    comparison_id = str(uuid.uuid4())
    comparison_folder = os.path.join(UPLOAD_FOLDER, comparison_id)
    os.makedirs(comparison_folder, exist_ok=True)
    
    # Sauvegarder les fichiers PDF
    pdf_paths = []
    for i, file in enumerate(files):
        file_path = os.path.join(comparison_folder, f"devis_{i+1}.pdf")
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        pdf_paths.append(file_path)
    
    # Analyser les PDF avec ChatGPT
    try:
        analysis_result = analyze_pdfs(pdf_paths, prompt)
        
        # Sauvegarder le résultat
        output_path = os.path.join(OUTPUT_FOLDER, f"{comparison_id}.json")
        with open(output_path, "w", encoding="utf-8") as f:
            json.dump(analysis_result, f, ensure_ascii=False, indent=2)
        
        return JSONResponse(content={
            "comparison_id": comparison_id,
            "result": analysis_result
        })
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur lors de l'analyse: {str(e)}")

@app.get(f"{API_PREFIX}/results/{{comparison_id}}")
async def get_result(comparison_id: str):
    """Récupère le résultat d'une comparaison précédente"""
    result_path = os.path.join(OUTPUT_FOLDER, f"{comparison_id}.json")
    
    if not os.path.exists(result_path):
        raise HTTPException(status_code=404, detail="Résultat non trouvé")
    
    with open(result_path, "r", encoding="utf-8") as f:
        result = json.load(f)
    
    return JSONResponse(content=result)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)