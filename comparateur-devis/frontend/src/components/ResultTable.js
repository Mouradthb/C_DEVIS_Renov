import React from 'react';

const ResultTable = ({ result, isLoading }) => {
  if (isLoading) {
    return (
      <div className="my-8 text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary-500 border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
        <p className="mt-2 text-gray-600">Analyse en cours, veuillez patienter...</p>
        <p className="text-sm text-gray-500 mt-2">
          L'analyse de vos devis peut prendre jusqu'à une minute selon leur complexité.
        </p>
      </div>
    );
  }

  if (!result) {
    return null;
  }

  // Vérifier si une erreur est présente
  if (result.error) {
    return (
      <div className="my-8 p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
        <h3 className="font-medium">Une erreur est survenue</h3>
        <p>{result.error}</p>
      </div>
    );
  }

  return (
    <div className="my-8">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Résultat de l'analyse</h2>
      
      {/* Comparaison générale */}
      {result.comparaison_generale && (
        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Comparaison générale</h3>
          <p className="text-gray-700">{result.comparaison_generale}</p>
        </div>
      )}
      
      {/* Tableau comparatif */}
      {result.tableau_comparatif && result.tableau_comparatif.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Tableau comparatif</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aspect</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Devis 1</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Devis 2</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Commentaire</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {result.tableau_comparatif.map((item, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.aspect}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.devis1}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.devis2}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{item.commentaire}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      
      {/* Différences notables */}
      {result.differences_notables && result.differences_notables.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Différences notables</h3>
          <ul className="list-disc pl-5 space-y-1 text-gray-700">
            {result.differences_notables.map((diff, index) => (
              <li key={index}>{diff}</li>
            ))}
          </ul>
        </div>
      )}
      
      {/* Éléments manquants */}
      {result.elements_manquants && (
        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Éléments manquants</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-gray-700 mb-1">Devis 1</h4>
              {result.elements_manquants.devis1 && result.elements_manquants.devis1.length > 0 ? (
                <ul className="list-disc pl-5 space-y-1 text-gray-700">
                  {result.elements_manquants.devis1.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 italic">Aucun élément manquant</p>
              )}
            </div>
            <div>
              <h4 className="font-medium text-gray-700 mb-1">Devis 2</h4>
              {result.elements_manquants.devis2 && result.elements_manquants.devis2.length > 0 ? (
                <ul className="list-disc pl-5 space-y-1 text-gray-700">
                  {result.elements_manquants.devis2.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 italic">Aucun élément manquant</p>
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* Recommandation */}
      {result.recommandation && (
        <div className="p-4 bg-green-50 border-l-4 border-green-500">
          <h3 className="text-lg font-medium text-green-800 mb-2">Recommandation</h3>
          <p className="text-green-700">{result.recommandation}</p>
        </div>
      )}
    </div>
  );
};

export default ResultTable;