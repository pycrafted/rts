/**
 * Page de dimensionnement Optique
 * 
 * Cette page permet de dimensionner les réseaux optiques avec :
 * - Un formulaire de saisie des paramètres
 * - Des calculs d'atténuation
 * - Des recommandations de dimensionnement
 * 
 * Le formulaire inclut :
 * - La longueur de fibre
 * - Le type de fibre
 * - Les pertes par épissure
 * - Les pertes par connecteur
 * 
 * @component
 */
import React from 'react';

const OptiquePage: React.FC = () => {
  return (
    <div className="p-6 overflow-y-auto">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-bold mb-6 text-blue-800">Dimensionnement Optique</h2>
        {/* Contenu du formulaire Optique à ajouter */}
        <p className="text-gray-600">Module en cours de développement</p>
      </div>
    </div>
  );
};

export default OptiquePage;