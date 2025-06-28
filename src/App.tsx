/**
 * Composant principal de l'application - TEST AVEC LAYOUT
 * 
 * Ce composant gère :
 * - La structure générale de l'application avec le nouveau Layout
 * - Le routage entre les différentes pages
 * - L'intégration du design system moderne
 * - L'assistant IA flottant global
 * - L'optimisation mobile
 * - La migration des données vers electron-store
 * 
 * @component
 */
import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import './App.css';

// Composant de test minimaliste
const TestPage: React.FC = () => {
  const handleClick = () => {
    console.log('🔍 [TEST] Bouton cliqué !');
    alert('Clic détecté !');
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Test de Souris - Application Desktop</h1>
      <p>Cette page est un test minimaliste pour identifier le problème de souris.</p>
      
      <div style={{ margin: '20px 0' }}>
        <button 
          onClick={handleClick}
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Cliquez ici pour tester
        </button>
      </div>
      
      <div style={{ margin: '20px 0' }}>
        <input 
          type="text" 
          placeholder="Test input"
          style={{
            padding: '10px',
            fontSize: '16px',
            border: '1px solid #ccc',
            borderRadius: '5px',
            width: '200px'
          }}
        />
      </div>
      
      <div style={{ margin: '20px 0' }}>
        <a 
          href="#" 
          onClick={(e) => {
            e.preventDefault();
            console.log('🔍 [TEST] Lien cliqué !');
            alert('Lien cliqué !');
          }}
          style={{
            color: '#007bff',
            textDecoration: 'underline',
            cursor: 'pointer'
          }}
        >
          Test de lien
        </a>
      </div>
      
      <div style={{ margin: '20px 0', padding: '10px', backgroundColor: '#f8f9fa', borderRadius: '5px' }}>
        <p>Instructions de test :</p>
        <ul>
          <li>Cliquez sur le bouton plusieurs fois</li>
          <li>Cliquez sur le lien</li>
          <li>Cliquez dans l'input</li>
          <li>Attendez 30 secondes puis testez à nouveau</li>
        </ul>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  console.log('🔍 [REACT] App component monté - TEST AVEC LAYOUT');

  return (
    <div className="App">
      <Router>
        <Layout>
          <Routes>
            <Route path="*" element={<TestPage />} />
          </Routes>
        </Layout>
      </Router>
    </div>
  );
}

export default App; 