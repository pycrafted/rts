/**
 * Page de dimensionnement Hertzien
 * 
 * Cette page permet de dimensionner les liaisons hertziennes avec :
 * - Un formulaire de saisie des paramètres
 * - Des calculs de bilan de liaison
 * - Des recommandations de dimensionnement
 * 
 * Le formulaire inclut :
 * - La distance de liaison
 * - La fréquence
 * - Les gains d'antenne
 * - Les pertes de propagation
 * 
 * @component
 */
import React from 'react';
import HertzienForm from '../components/hertzien/HertzienForm';

const HertzienPage: React.FC = () => {
  return (
    <div className="p-6 overflow-y-auto">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-bold mb-6 text-blue-800">Dimensionnement Hertzien</h2>
        <HertzienForm />
      </div>
    </div>
  );
};

export default HertzienPage;