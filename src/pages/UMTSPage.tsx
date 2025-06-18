/**
 * Page de dimensionnement UMTS
 * 
 * Cette page permet de dimensionner les réseaux UMTS (3G) avec :
 * - Un formulaire de saisie des paramètres
 * - Des calculs de capacité
 * - Des recommandations de dimensionnement
 * 
 * Le formulaire inclut :
 * - La zone de couverture
 * - Le trafic attendu
 * - Les contraintes de qualité de service
 * - Les services supportés
 * 
 * @component
 */
import React from 'react';
import UMTSForm from '../components/umts/UMTSForm';

const UMTSPage: React.FC = () => {
  return (
    <div className="p-6 overflow-y-auto">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-bold mb-6 text-blue-800">Dimensionnement UMTS</h2>
        <UMTSForm />
      </div>
    </div>
  );
};

export default UMTSPage;