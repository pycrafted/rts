/**
 * Page principale de simulation hertzienne
 * 
 * Cette page gère la simulation des liaisons hertziennes avec :
 * - Un en-tête avec le titre
 * - Des boutons pour basculer entre le bilan de liaison et l'analyse des obstacles
 * - La vue principale de simulation (SimulationView)
 * 
 * @component
 */
import React, { useState } from 'react';
import SimulationView from '@/components/simulation/SimulationView';
import { usePDFExport } from '@/services/pdfExportService';

const HertzienSimulation: React.FC = () => {
  // État pour suivre le mode actif (bilan de liaison ou obstacles)
  const [isActive, setIsActive] = useState<boolean>(false);
  
  const { exportDashboardReport } = usePDFExport();

  // Fonction d'export PDF
  const handleExportPDF = async () => {
    try {
      console.log('📊 Export PDF complet en cours...');
      
      // Récupérer toutes les données du dashboard
      const gsmHistory = JSON.parse(localStorage.getItem('gsm_history') || '[]');
      const umtsHistory = JSON.parse(localStorage.getItem('umts_history') || '[]');
      const hertzienHistory = JSON.parse(localStorage.getItem('hertzien_history') || '[]');
      const optiqueHistory = JSON.parse(localStorage.getItem('optique_history') || '[]');

      // Calculer les métriques globales
      const totalGsmCalculs = gsmHistory.length;
      const totalUmtsCalculs = umtsHistory.length;
      const totalHertzienCalculs = hertzienHistory.length;
      const totalOptiqueCalculs = optiqueHistory.length;

      const totalGsmDistance = gsmHistory.reduce((sum: number, item: any) => sum + (item.area || 0), 0);
      const totalUmtsDistance = umtsHistory.reduce((sum: number, item: any) => sum + (item.area || 0), 0);
      const totalHertzienDistance = hertzienHistory.reduce((sum: number, item: any) => sum + (item.distance || 0), 0);
      const totalOptiqueDistance = optiqueHistory.reduce((sum: number, item: any) => sum + (item.params?.length || 0), 0);

      const totalGsmMarge = gsmHistory.reduce((sum: number, item: any) => sum + (item.gos || 0), 0);
      const totalUmtsMarge = umtsHistory.reduce((sum: number, item: any) => sum + (item.gos || 0), 0);
      const totalHertzienMarge = hertzienHistory.reduce((sum: number, item: any) => sum + (item.marge || 0), 0);
      const totalOptiqueMarge = optiqueHistory.reduce((sum: number, item: any) => sum + (item.bilan || 0), 0);

      const totalGsmBilan = gsmHistory.reduce((sum: number, item: any) => sum + (item.nbSites || 0), 0);
      const totalUmtsBilan = umtsHistory.reduce((sum: number, item: any) => sum + (item.nbNodeB || 0), 0);
      const totalHertzienBilan = hertzienHistory.reduce((sum: number, item: any) => sum + (item.bilan || 0), 0);
      const totalOptiqueBilan = optiqueHistory.reduce((sum: number, item: any) => sum + (item.bilan || 0), 0);

      const allData = {
        gsm: {
          history: gsmHistory,
          metrics: {
            totalCalculs: totalGsmCalculs,
            totalDistance: totalGsmDistance,
            totalMarge: totalGsmMarge,
            totalBilan: totalGsmBilan,
            moyenneDistance: totalGsmCalculs > 0 ? totalGsmDistance / totalGsmCalculs : 0,
            moyenneMarge: totalGsmCalculs > 0 ? totalGsmMarge / totalGsmCalculs : 0,
            moyenneBilan: totalGsmCalculs > 0 ? totalGsmBilan / totalGsmCalculs : 0
          }
        },
        umts: {
          history: umtsHistory,
          metrics: {
            totalCalculs: totalUmtsCalculs,
            totalDistance: totalUmtsDistance,
            totalMarge: totalUmtsMarge,
            totalBilan: totalUmtsBilan,
            moyenneDistance: totalUmtsCalculs > 0 ? totalUmtsDistance / totalUmtsCalculs : 0,
            moyenneMarge: totalUmtsCalculs > 0 ? totalUmtsMarge / totalUmtsCalculs : 0,
            moyenneBilan: totalUmtsCalculs > 0 ? totalUmtsBilan / totalUmtsCalculs : 0
          }
        },
        hertzien: {
          history: hertzienHistory,
          metrics: {
            totalCalculs: totalHertzienCalculs,
            totalDistance: totalHertzienDistance,
            totalMarge: totalHertzienMarge,
            totalBilan: totalHertzienBilan,
            moyenneDistance: totalHertzienCalculs > 0 ? totalHertzienDistance / totalHertzienCalculs : 0,
            moyenneMarge: totalHertzienCalculs > 0 ? totalHertzienMarge / totalHertzienCalculs : 0,
            moyenneBilan: totalHertzienCalculs > 0 ? totalHertzienBilan / totalHertzienCalculs : 0
          }
        },
        optique: {
          history: optiqueHistory,
          metrics: {
            totalCalculs: totalOptiqueCalculs,
            totalDistance: totalOptiqueDistance,
            totalMarge: totalOptiqueMarge,
            totalBilan: totalOptiqueBilan,
            moyenneDistance: totalOptiqueCalculs > 0 ? totalOptiqueDistance / totalOptiqueCalculs : 0,
            moyenneMarge: totalOptiqueCalculs > 0 ? totalOptiqueMarge / totalOptiqueCalculs : 0,
            moyenneBilan: totalOptiqueCalculs > 0 ? totalOptiqueBilan / totalOptiqueCalculs : 0
          }
        },
        global: {
          totalCalculs: totalGsmCalculs + totalUmtsCalculs + totalHertzienCalculs + totalOptiqueCalculs,
          totalDistance: totalGsmDistance + totalUmtsDistance + totalHertzienDistance + totalOptiqueDistance,
          totalMarge: totalGsmMarge + totalUmtsMarge + totalHertzienMarge + totalOptiqueMarge,
          totalBilan: totalGsmBilan + totalUmtsBilan + totalHertzienBilan + totalOptiqueBilan
        }
      };

      const result = await exportDashboardReport(allData);
      
      if (result.success) {
        console.log('✅ Export PDF réussi:', result.filePath);
        alert(`PDF exporté avec succès !\nFichier: ${result.filePath}`);
      } else {
        console.error('❌ Échec de l\'export PDF:', result.error);
        alert(`Erreur lors de l'export PDF: ${result.error}`);
      }
    } catch (error) {
      console.error('❌ Erreur lors de l\'export PDF:', error);
      alert('Erreur lors de l\'export PDF. Vérifiez la console pour plus de détails.');
    }
  };

  return (
    <div className="h-screen bg-gray-100">
      <div className="h-full flex flex-col">
        {/* En-tête */}
        <div className="bg-white shadow-sm p-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold text-blue-800">Simulation Hertzien</h2>
              <p className="text-gray-600 mt-1">Simulation des liaisons hertziennes et analyse des obstacles</p>
            </div>
            <button
              onClick={handleExportPDF}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
              title="Exporter le rapport PDF"
            >
              📊 Export PDF
            </button>
          </div>
          
          {/* Contrôles de navigation */}
          <div className="mt-4">
            <div className="flex space-x-4">
              <button 
                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                  !isActive 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
                onClick={() => setIsActive(false)}
              >
                📊 Bilan de Liaison
              </button>
              <button 
                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                  isActive 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
                onClick={() => setIsActive(true)}
              >
                🏔️ Obstacles & Diffraction
              </button>
            </div>
          </div>
        </div>

        {/* Vue de simulation - utilise tout l'espace restant */}
        <div className="flex-1 overflow-hidden">
          <SimulationView isActive={isActive} />
        </div>
      </div>
    </div>
  );
};

export default HertzienSimulation; 