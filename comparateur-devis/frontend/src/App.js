import React, { useState } from 'react';
import axios from 'axios';
import FileUpload from './components/FileUpload';
import PromptEditor from './components/PromptEditor';
import ResultTable from './components/ResultTable';
import logo from './logo.png'; // Import du logo

// Configuration de l'API backend
const API_URL = 'http://localhost:8000/api/v1';

// Prompt par défaut
const DEFAULT_PROMPT = `
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
`;

function App() {
  const [files, setFiles] = useState([]);
  const [prompt, setPrompt] = useState(DEFAULT_PROMPT);
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFilesChange = (newFiles) => {
    setFiles(newFiles);
    setError(null);
  };

  const handlePromptChange = (newPrompt) => {
    setPrompt(newPrompt);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (files.length !== 2) {
      setError("Veuillez sélectionner exactement deux fichiers PDF.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);

    // Créer un FormData pour envoyer les fichiers
    const formData = new FormData();
    files.forEach(file => {
      formData.append('files', file);
    });
    formData.append('prompt', prompt);

    try {
      const response = await axios.post(`${API_URL}/compare`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setResult(response.data.result);
    } catch (err) {
      console.error('Erreur lors de la comparaison des devis:', err);
      setError(err.response?.data?.detail || 'Une erreur est survenue lors de la comparaison.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex items-center">
          <img src={logo} alt="Logo Comparateur de Devis" className="h-10 mr-4" />
          <h1 className="text-3xl font-bold text-gray-900">COMPARATEUR DE DEVIS RENOV</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white shadow rounded-lg p-6">
            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">
                  Téléchargez vos devis PDF
                </h2>
                <FileUpload onFilesChange={handleFilesChange} />
                
                {error && (
                  <div className="mt-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-700">
                    {error}
                  </div>
                )}
              </div>

              <PromptEditor 
                defaultPrompt={DEFAULT_PROMPT} 
                onPromptChange={handlePromptChange} 
              />

              <div className="flex justify-center">
                <button
                  type="submit"
                  disabled={files.length !== 2 || isLoading}
                  className={`px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 
                    ${files.length !== 2 || isLoading 
                      ? 'opacity-50 cursor-not-allowed' 
                      : 'hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500'
                    }`}
                >
                  {isLoading ? 'Analyse en cours...' : 'Comparer les devis'}
                </button>
              </div>
            </form>

            <ResultTable result={result} isLoading={isLoading} />
          </div>
        </div>
      </main>

      <footer className="bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-500">
            © {new Date().getFullYear()} by mouradthb - Tous droits réservés
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;