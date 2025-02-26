import React, { useState } from 'react';

const PromptEditor = ({ defaultPrompt, onPromptChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [prompt, setPrompt] = useState(defaultPrompt);

  const handlePromptChange = (e) => {
    setPrompt(e.target.value);
    onPromptChange(e.target.value);
  };

  return (
    <div className="mb-6 border border-gray-200 rounded-md">
      <div className="flex justify-between items-center p-4 cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
        <h3 className="text-sm font-medium text-gray-700">Personnaliser le prompt (avancé)</h3>
        <button
          type="button"
          className="text-primary-600 text-sm hover:text-primary-800"
        >
          {isOpen ? 'Masquer' : 'Afficher'}
        </button>
      </div>
      
      {isOpen && (
        <div className="p-4 border-t border-gray-200">
          <textarea
            value={prompt}
            onChange={handlePromptChange}
            rows={8}
            className="w-full p-2 border border-gray-300 rounded-md text-sm font-mono"
            placeholder="Entrez votre prompt personnalisé ici..."
          />
          <p className="mt-2 text-xs text-gray-500">
            Ce prompt sera utilisé pour guider l'IA dans l'analyse des devis. 
            Vous pouvez le personnaliser selon vos besoins spécifiques.
          </p>
        </div>
      )}
    </div>
  );
};

export default PromptEditor;