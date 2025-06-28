import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import Button from '@/components/ui/Button';

interface TestResult {
  name: string;
  status: 'passed' | 'failed' | 'skipped';
  duration: number;
  suite: string;
  timestamp: string;
}

interface TestSuite {
  name: string;
  total: number;
  passed: number;
  failed: number;
  skipped: number;
  duration: number;
}

const TestResults: React.FC = () => {
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [testSuites, setTestSuites] = useState<TestSuite[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastRun, setLastRun] = useState<string>('');

  useEffect(() => {
    // Simuler des données de tests (en production, cela viendrait d'une API)
    const mockTestResults: TestResult[] = [
      {
        name: 'calculateLinkBudget - Calcul du bilan de liaison',
        status: 'passed',
        duration: 45,
        suite: 'Link Budget Service',
        timestamp: new Date().toISOString()
      },
      {
        name: 'calculateDiffractionLoss - Calcul des pertes par diffraction',
        status: 'passed',
        duration: 32,
        suite: 'Diffraction Service',
        timestamp: new Date().toISOString()
      },
      {
        name: 'GSMForm - Rendu du composant',
        status: 'passed',
        duration: 128,
        suite: 'GSM Form Component',
        timestamp: new Date().toISOString()
      },
      {
        name: 'Accessibilité des formulaires',
        status: 'passed',
        duration: 89,
        suite: 'GSM Form Component',
        timestamp: new Date().toISOString()
      },
      {
        name: 'Validation des entrées utilisateur',
        status: 'passed',
        duration: 67,
        suite: 'GSM Form Component',
        timestamp: new Date().toISOString()
      }
    ];

    const mockTestSuites: TestSuite[] = [
      {
        name: 'Link Budget Service',
        total: 11,
        passed: 11,
        failed: 0,
        skipped: 0,
        duration: 450
      },
      {
        name: 'Diffraction Service',
        total: 11,
        passed: 11,
        failed: 0,
        skipped: 0,
        duration: 320
      },
      {
        name: 'GSM Form Component',
        total: 16,
        passed: 16,
        failed: 0,
        skipped: 0,
        duration: 1280
      }
    ];

    setTestResults(mockTestResults);
    setTestSuites(mockTestSuites);
    setLastRun(new Date().toLocaleString());
    setIsLoading(false);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'passed':
        return 'text-green-600 bg-green-100 border-green-200';
      case 'failed':
        return 'text-red-600 bg-red-100 border-red-200';
      case 'skipped':
        return 'text-yellow-600 bg-yellow-100 border-yellow-200';
      default:
        return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'passed':
        return '✅';
      case 'failed':
        return '❌';
      case 'skipped':
        return '⏭️';
      default:
        return '❓';
    }
  };

  const totalTests = testSuites.reduce((sum, suite) => sum + suite.total, 0);
  const totalPassed = testSuites.reduce((sum, suite) => sum + suite.passed, 0);
  const totalFailed = testSuites.reduce((sum, suite) => sum + suite.failed, 0);
  const totalDuration = testSuites.reduce((sum, suite) => sum + suite.duration, 0);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-32 bg-gray-300 rounded-lg"></div>
              ))}
            </div>
            <div className="h-64 bg-gray-300 rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            📊 Résultats des Tests
          </h1>
          <p className="text-gray-600">
            Dernière exécution : {lastRun}
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Tests</p>
                <p className="text-2xl font-bold text-gray-900">{totalTests}</p>
              </div>
              <div className="text-3xl">🧪</div>
            </div>
          </Card>

          <Card className="bg-white p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Réussis</p>
                <p className="text-2xl font-bold text-green-600">{totalPassed}</p>
              </div>
              <div className="text-3xl">✅</div>
            </div>
          </Card>

          <Card className="bg-white p-6 border-l-4 border-red-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Échoués</p>
                <p className="text-2xl font-bold text-red-600">{totalFailed}</p>
              </div>
              <div className="text-3xl">❌</div>
            </div>
          </Card>

          <Card className="bg-white p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Durée</p>
                <p className="text-2xl font-bold text-blue-600">{(totalDuration / 1000).toFixed(1)}s</p>
              </div>
              <div className="text-3xl">⏱️</div>
            </div>
          </Card>
        </div>

        {/* Test Suites */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">📦 Suites de Tests</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testSuites.map((suite, index) => (
              <Card key={index} className="bg-white p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">{suite.name}</h3>
                  <span className="text-sm text-gray-500">{(suite.duration / 1000).toFixed(1)}s</span>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Total:</span>
                    <span className="font-medium">{suite.total}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-green-600">Réussis:</span>
                    <span className="font-medium text-green-600">{suite.passed}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-red-600">Échoués:</span>
                    <span className="font-medium text-red-600">{suite.failed}</span>
                  </div>
                  {suite.skipped > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-yellow-600">Ignorés:</span>
                      <span className="font-medium text-yellow-600">{suite.skipped}</span>
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 bg-gray-200 rounded-full h-2 mr-3">
                      <div 
                        className="bg-green-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(suite.passed / suite.total) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-500">
                      {Math.round((suite.passed / suite.total) * 100)}%
                    </span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Detailed Test Results */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">🔍 Détail des Tests</h2>
          <Card className="bg-white overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Test
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Suite
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Statut
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Durée
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {testResults.map((test, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{test.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{test.suite}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(test.status)}`}>
                          <span className="mr-1">{getStatusIcon(test.status)}</span>
                          {test.status === 'passed' ? 'Réussi' : test.status === 'failed' ? 'Échoué' : 'Ignoré'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {test.duration}ms
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* Actions */}
        <div className="flex justify-center space-x-4">
          <Button 
            onClick={() => window.location.reload()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            🔄 Actualiser
          </Button>
          <Button 
            onClick={() => window.history.back()}
            className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            ← Retour
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TestResults; 