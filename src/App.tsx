/**
 * Composant principal de l'application
 * 
 * Ce composant gère :
 * - La structure générale de l'application avec le nouveau Layout
 * - Le routage entre les différentes pages
 * - L'intégration du design system moderne
 * - L'assistant IA flottant global
 * 
 * @component
 */
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
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
import FloatingAssistant from './components/ai/FloatingAssistant';
import AssistantIAPage from './pages/AssistantIAPage';

const App: React.FC = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/assistant-ia" element={<AssistantIAPage />} />
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
        
        {/* Assistant IA flottant global */}
        <FloatingAssistant />
      </Layout>
    </Router>
  );
};

export default App;
