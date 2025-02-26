import os
from dotenv import load_dotenv

# Charger les variables d'environnement
load_dotenv()

# Configuration de l'API
API_VERSION = "v1"
API_PREFIX = f"/api/{API_VERSION}"

# Dossiers
UPLOAD_FOLDER = "uploads"
OUTPUT_FOLDER = "outputs"

# Créer les dossiers s'ils n'existent pas
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(OUTPUT_FOLDER, exist_ok=True)

# Configuration OpenAI
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
OPENAI_MODEL = "gpt-4o"  # ou "gpt-4-turbo" selon les besoins

# Prompts personnalisables
DEFAULT_PROMPT = """
Analyse les deux devis suivants et fournis une comparaison détaillée :
1. Compare les prix totaux et le détail des prestations
2. Identifie les différences majeures entre les devis
3. Signale les éléments manquants dans l'un ou l'autre
4. Recommande l'option la plus avantageuse en termes de rapport qualité-prix
5. Présente le résultat sous forme de tableau comparatif

Réponds au format JSON avec les sections suivantes :
{
  "comparaison_generale": "description générale",
  "tableau_comparatif": [
    {"aspect": "Prix total", "devis1": "valeur", "devis2": "valeur", "commentaire": "..."},
    ...
  ],
  "differences_notables": ["différence 1", "différence 2", ...],
  "elements_manquants": {"devis1": ["élément 1", ...], "devis2": ["élément 1", ...]},
  "recommandation": "recommandation finale"
}
"""