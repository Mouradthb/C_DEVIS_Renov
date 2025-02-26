import React from 'react';
// Modifiez ce chemin pour pointer vers l'emplacement réel de votre logo
import logo from '../logo.png'; 

function Header() {
  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex items-center">
        <img src={logo} alt="Logo Comparateur de Devis" className="h-10 mr-3" />
        <h1 className="text-3xl font-bold text-gray-900">COMPARATEUR DE DEVIS</h1>
      </div>
    </header>
  );
}

export default Header;
