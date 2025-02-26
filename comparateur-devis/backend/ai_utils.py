import base64
import json
import os
from openai import OpenAI
from config import OPENAI_API_KEY, OPENAI_MODEL

# Initialiser le client OpenAI
client = OpenAI(api_key=OPENAI_API_KEY)

def encode_pdf_to_base64(file_path):
    """Encode un fichier PDF en base64"""
    with open(file_path, "rb") as pdf_file:
        return base64.b64encode(pdf_file.read()).decode('utf-8')

def analyze_pdfs(pdf_paths, prompt):
    """
    Analyse deux fichiers PDF en les envoyant directement à l'API ChatGPT
    avec un prompt spécifique
    """
    if len(pdf_paths) != 2:
        raise ValueError("Exactement deux fichiers PDF sont requis pour la comparaison")
    
    # Préparer les messages avec les fichiers PDF
    messages = [
        {
            "role": "user",
            "content": [
                {"type": "text", "text": prompt},
                {
                    "type": "image_url",
                    "image_url": {
                        "url": f"data:application/pdf;base64,{encode_pdf_to_base64(pdf_paths[0])}",
                        "detail": "high"
                    }
                },
                {
                    "type": "image_url",
                    "image_url": {
                        "url": f"data:application/pdf;base64,{encode_pdf_to_base64(pdf_paths[1])}",
                        "detail": "high"
                    }
                }
            ]
        }
    ]
    
    # Appeler l'API ChatGPT
    try:
        response = client.chat.completions.create(
            model=OPENAI_MODEL,
            messages=messages,
            response_format={"type": "json_object"},
            max_tokens=4000
        )
        
        # Extraire et parser la réponse JSON
        result = response.choices[0].message.content
        return json.loads(result)
    
    except Exception as e:
        print(f"Erreur lors de l'appel à l'API ChatGPT: {str(e)}")
        return {"error": str(e)}