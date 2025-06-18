/**
 * Page de dimensionnement GSM
 * 
 * Cette page permet de dimensionner les réseaux GSM avec :
 * - Un formulaire de saisie des paramètres
 * - Des calculs de couverture
 * - Des recommandations de dimensionnement
 * 
 * Le formulaire inclut :
 * - La zone de couverture
 * - Le nombre d'utilisateurs
 * - Les contraintes de qualité de service
 * 
 * @component
 */
import React from 'react';
import GSMForm from '../components/gsm/GSMForm';

const GSMPage: React.FC = () => {
  return (
    <div className="p-6 overflow-y-auto">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-bold mb-6 text-blue-800">Dimensionnement GSM</h2>
        <GSMForm />
      </div>
    </div>
  );
};

export default GSMPage;