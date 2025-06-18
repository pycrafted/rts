/**
 * Page d'accueil des simulations
 * 
 * Cette page présente les différentes options de simulation disponibles :
 * - Simulation Optique : pour les liaisons fibre optique
 * - Simulation Hertzien : pour les liaisons hertziennes
 * 
 * Chaque option est présentée sous forme de carte cliquable avec :
 * - Une icône représentative
 * - Un titre
 * - Une description des fonctionnalités
 * 
 * @component
 */
import React from 'react';
import { Link } from 'react-router-dom';

const Simulation: React.FC = () => {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8 text-center">Simulations</h1>
      
      {/* Grille des options de simulation */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Carte Simulation Optique */}
        <Link 
          to="/simulation/optique"
          className="block p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow"
        >
          <div className="text-center">
            <span className="text-4xl mb-4 block">💡</span>
            <h2 className="text-2xl font-semibold mb-4">Simulation Optique</h2>
            <p className="text-gray-600">
              Visualisez et simulez les liaisons optiques, les pertes par atténuation,
              et les effets des épissures et connecteurs.
            </p>
          </div>
        </Link>

        {/* Carte Simulation Hertzien */}
        <Link 
          to="/simulation/hertzien"
          className="block p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow"
        >
          <div className="text-center">
            <span className="text-4xl mb-4 block">📡</span>
            <h2 className="text-2xl font-semibold mb-4">Simulation Hertzien</h2>
            <p className="text-gray-600">
              Analysez les liaisons hertziennes, les zones de Fresnel,
              et les effets de la diffraction.
            </p>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Simulation;