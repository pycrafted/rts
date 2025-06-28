/**
 * Page d'accueil des simulations
 * 
 * Cette page présente les différentes options de simulation disponibles :
 * - Simulation Optique : pour les liaisons fibre optique
 * - Simulation Hertzien : pour les liaisons hertziennes
 * - Simulation GSM : pour la visualisation 3D de la couverture d'antenne
 * - Simulation UMTS : pour l'analyse du facteur de charge et de la qualité de service
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
      <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">🖥️ Simulations</h1>
      
      <div className="mb-8 text-center">
        <p className="text-gray-600 max-w-2xl mx-auto">
          Explorez nos simulations interactives pour visualiser et analyser les réseaux télécoms en 3D.
          Chaque simulation vous permet de comprendre les concepts de dimensionnement de manière visuelle.
        </p>
      </div>
      
      {/* Grille des options de simulation */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
        {/* Carte Simulation Optique */}
        <div className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow border">
          <div className="p-6">
            <div className="text-center">
              <span className="text-4xl mb-4 block">💡</span>
              <h2 className="text-2xl font-semibold mb-4 text-gray-800">Simulation Optique</h2>
              <p className="text-gray-600 mb-6">
                Visualisez et simulez les liaisons optiques, les pertes par atténuation,
                et les effets des épissures et connecteurs.
              </p>
              <Link 
                to="/simulation/optique"
                className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Accéder à la simulation
              </Link>
            </div>
          </div>
        </div>

        {/* Carte Simulation Hertzien */}
        <div className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow border">
          <div className="p-6">
            <div className="text-center">
              <span className="text-4xl mb-4 block">📡</span>
              <h2 className="text-2xl font-semibold mb-4 text-gray-800">Simulation Hertzien</h2>
              <p className="text-gray-600 mb-6">
                Analysez les liaisons hertziennes, les zones de Fresnel,
                et les effets de la diffraction.
              </p>
              <Link 
                to="/simulation/hertzien"
                className="inline-block bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
              >
                Accéder à la simulation
              </Link>
            </div>
          </div>
        </div>

        {/* Carte Simulation GSM */}
        <div className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow border">
          <div className="p-6">
            <div className="text-center">
              <span className="text-4xl mb-4 block">📱</span>
              <h2 className="text-2xl font-semibold mb-4 text-gray-800">Simulation GSM</h2>
              <p className="text-gray-600 mb-6">
                Visualisez en 3D la couverture d'antenne GSM et l'impact des obstacles
                sur la propagation du signal radio.
              </p>
              <Link 
                to="/simulation/gsm"
                className="inline-block bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors"
              >
                Accéder à la simulation
              </Link>
            </div>
          </div>
        </div>

        {/* Carte Simulation UMTS */}
        <div className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow border">
          <div className="p-6">
            <div className="text-center">
              <span className="text-4xl mb-4 block">📶</span>
              <h2 className="text-2xl font-semibold mb-4 text-gray-800">Simulation UMTS</h2>
              <p className="text-gray-600 mb-6">
                Analysez le facteur de charge, la qualité de service et le dimensionnement
                des réseaux UMTS avec visualisation 3D interactive.
              </p>
              <Link 
                to="/simulation/umts"
                className="inline-block bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-700 transition-colors"
              >
                Accéder à la simulation
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Section d'information */}
      <div className="mt-12 bg-gray-50 rounded-lg p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">ℹ️ À propos des simulations</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-gray-600">
          <div>
            <h4 className="font-semibold text-gray-800 mb-2">🎯 Objectif</h4>
            <p>Comprendre visuellement les concepts de dimensionnement télécoms à travers des simulations interactives.</p>
          </div>
          <div>
            <h4 className="font-semibold text-gray-800 mb-2">🔧 Fonctionnalités</h4>
            <p>Calculs en temps réel, visualisation 3D, analyse des paramètres et recommandations techniques.</p>
          </div>
          <div>
            <h4 className="font-semibold text-gray-800 mb-2">📱 Compatibilité</h4>
            <p>Optimisé pour desktop et mobile, fonctionne hors ligne grâce au cache de l'application.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Simulation;