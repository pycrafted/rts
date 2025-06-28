/**
 * Composant principal de l'application
 * 
 * Ce composant gère :
 * - La structure générale de l'application avec le nouveau Layout
 * - Le routage entre les différentes pages
 * - L'intégration du design system moderne
 * - L'assistant IA flottant global
 * - L'optimisation mobile
 * 
 * @component
 */
import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import FloatingAssistant from './components/ai/FloatingAssistant';
import MobileOptimizer from './components/common/MobileOptimizer';

// Lazy loading des pages pour optimiser les performances
const Simulation = lazy(() => import('@/pages/Simulation'));
const Documentation = lazy(() => import('@/pages/Documentation'));
const GSMPage = lazy(() => import('./pages/GSMPage'));
const UMTSPage = lazy(() => import('./pages/UMTSPage'));
const HertzienForm = lazy(() => import('./components/hertzien/HertzienForm'));
const Dashboard = lazy(() => import('./components/dashboard/Dashboard'));
const OptiqueForm = lazy(() => import('./components/optique/OptiqueForm'));
const OptiqueSimulation = lazy(() => import('./pages/OptiqueSimulation'));
const HertzienSimulation = lazy(() => import('./pages/HertzienSimulation'));
const GSMCoverageDemo = lazy(() => import('./components/gsm/GSMCoverageDemo'));
const UMTSSimulation = lazy(() => import('./pages/UMTSSimulation'));
const AssistantIAPage = lazy(() => import('./pages/AssistantIAPage'));
const TestResults = lazy(() => import('./pages/TestResults'));

// Composant de chargement optimisé
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
  </div>
);

const App: React.FC = () => {
  return (
    <MobileOptimizer>
      <Router>
        <Layout>
          <Suspense fallback={<LoadingSpinner />}>
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
              <Route path="/tests" element={<TestResults />} />
            </Routes>
          </Suspense>
          
          {/* Assistant IA flottant global */}
          <FloatingAssistant />
        </Layout>
      </Router>
    </MobileOptimizer>
  );
};

export default App;
