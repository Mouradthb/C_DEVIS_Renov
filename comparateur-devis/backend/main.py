import os
import json
import uuid
from fastapi import FastAPI, File, UploadFile, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from typing import List
import base64
from io import BytesIO

from config import API_PREFIX, DEFAULT_PROMPT, OPENAI_API_KEY, OPENAI_MODEL

app = FastAPI(title="Comparateur de Devis API")

# Configuration CORS pour permettre les requêtes depuis le frontend
app.add_middleware(
    CORSMiddleware,
    # Sur Vercel, remplacez par l'URL réelle de votre frontend
    allow_origins=["*"],  # Pour le développement, à restreindre en production
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
    
    # Lire les fichiers en mémoire
    pdf_contents = []
    for file in files:
        content = await file.read()
        pdf_contents.append(content)
    
    # Analyser les PDF avec l'API OpenAI
    try:
        from openai import OpenAI
        client = OpenAI(api_key=OPENAI_API_KEY)
        
        # Encoder les PDF en base64
        pdf_base64 = []
        for content in pdf_contents:
            encoded = base64.b64encode(content).decode('utf-8')
            pdf_base64.append(encoded)
        
        # Créer les messages avec les fichiers PDF
        messages = [
            {
                "role": "user",
                "content": [
                    {"type": "text", "text": prompt},
                    {
                        "type": "image_url",
                        "image_url": {
                            "url": f"data:application/pdf;base64,{pdf_base64[0]}",
                            "detail": "high"
                        }
                    },
                    {
                        "type": "image_url",
                        "image_url": {
                            "url": f"data:application/pdf;base64,{pdf_base64[1]}",
                            "detail": "high"
                        }
                    }
                ]
            }
        ]
        
        # Appeler l'API ChatGPT
        response = client.chat.completions.create(
            model=OPENAI_MODEL,
            messages=messages,
            response_format={"type": "json_object"},
            max_tokens=4000
        )
        
        # Extraire et parser la réponse JSON
        result = response.choices[0].message.content
        return JSONResponse(content={
            "comparison_id": comparison_id,
            "result": json.loads(result)
        })
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur lors de l'analyse: {str(e)}")

# Ne pas inclure cette partie sur Vercel
# if __name__ == "__main__":
#     import uvicorn
#     uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)