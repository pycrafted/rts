/**
 * Composant principal de l'application
 * 
 * Ce composant gère :
 * - La structure générale de l'application
 * - Le routage entre les différentes pages
 * - Le menu de navigation latéral
 * 
 * @component
 */
import React from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import Simulation from '@/pages/Simulation';
import Documentation from '@/pages/Documentation';
import GSMPage from './pages/GSMPage';
import UMTSPage from './pages/UMTSPage';
import HertzienForm from './components/hertzien/HertzienForm';
import Dashboard from './components/dashboard/Dashboard';
import OptiqueForm from './components/optique/OptiqueForm';
import OptiqueSimulation from './pages/OptiqueSimulation';
import HertzienSimulation from './pages/HertzienSimulation';
import GSMCoverageDemo from './components/gsm/GSMCoverageDemo';
import { UMTSSimulation } from './pages/UMTSSimulation';

const App: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        {/* En-tête de l'application */}
        <header className="bg-blue-600 text-white p-4 text-center">
          <h1 className="text-2xl font-bold">Outil de Dimensionnement Télécoms</h1>
        </header>

        <div className="flex flex-1 overflow-hidden">
          {/* Menu de navigation latéral */}
          <div className="w-1/6 bg-blue-800 text-white p-4">
            <ul className="space-y-2">
              <li>
                <NavLink
                  to="/dashboard"
                  className={({ isActive }) =>
                    `block p-2 hover:bg-blue-700 rounded flex items-center ${
                      isActive ? 'bg-blue-700' : ''
                    }`
                  }
                >
                  <span className="mr-2">📊</span> Dashboard
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/gsm"
                  className={({ isActive }) =>
                    `block p-2 hover:bg-blue-700 rounded flex items-center ${
                      isActive ? 'bg-blue-700' : ''
                    }`
                  }
                >
                  <span className="mr-2">📱</span> GSM
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/umts"
                  className={({ isActive }) =>
                    `block p-2 hover:bg-blue-700 rounded flex items-center ${
                      isActive ? 'bg-blue-700' : ''
                    }`
                  }
                >
                  <span className="mr-2">📡</span> UMTS
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/hertzien"
                  className={({ isActive }) =>
                    `block p-2 hover:bg-blue-700 rounded flex items-center ${
                      isActive ? 'bg-blue-700' : ''
                    }`
                  }
                >
                  <span className="mr-2">🔌</span> Hertzien
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/optique"
                  className={({ isActive }) =>
                    `block p-2 hover:bg-blue-700 rounded flex items-center ${
                      isActive ? 'bg-blue-700' : ''
                    }`
                  }
                >
                  <span className="mr-2">💡</span> Optique
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/simulation"
                  className={({ isActive }) =>
                    `block p-2 hover:bg-blue-700 rounded flex items-center ${
                      isActive ? 'bg-blue-700' : ''
                    }`
                  }
                >
                  <span className="mr-2">🖥️</span> Simulation
                </NavLink>
              </li>
            </ul>
          </div>

          {/* Contenu principal de l'application */}
          <div className="flex-1 overflow-y-auto">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/gsm" element={<GSMPage />} />
              <Route path="/umts" element={<UMTSPage />} />
              <Route path="/hertzien" element={<HertzienForm />} />
              <Route path="/optique" element={<OptiqueForm />} />
              <Route path="/simulation" element={<Simulation />} />
              <Route path="/simulation/optique" element={<OptiqueSimulation />} />
              <Route path="/simulation/hertzien" element={<HertzienSimulation />} />
              <Route path="/simulation/gsm" element={<GSMCoverageDemo />} />
              <Route path="/simulation/umts" element={<UMTSSimulation />} />
              <Route path="/documentation" element={<Documentation />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
};

export default App;
