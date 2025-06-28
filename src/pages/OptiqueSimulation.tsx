/**
 * Page principale de simulation optique
 * 
 * Cette page sert de conteneur pour la simulation optique et inclut :
 * - Un en-tête avec le titre
 * - La vue principale de simulation (OptiqueSimulationView)
 * - Fonctionnalités d'export PDF
 * 
 * @component
 */
import React from 'react';
import OptiqueSimulationView from '@/components/optique/simulation/OptiqueSimulationView';
import { usePDFExport } from '@/services/pdfExportService';

const OptiqueSimulation: React.FC = () => {
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
    <div className="simulation-container flex flex-col h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header responsive - hauteur fixe */}
      <div className="flex-shrink-0 p-2 sm:p-4 lg:p-6">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2 sm:mb-3">
          🌐 Simulation Optique
        </h1>
        <p className="text-slate-300 text-sm sm:text-base lg:text-lg max-w-4xl">
          Visualisez et analysez les performances de votre réseau fibre optique en temps réel. 
          Simulez différents scénarios de déploiement et identifiez les points d'amélioration.
        </p>
      </div>

      {/* Conteneur principal - utilise flex pour occuper l'espace restant */}
      <div className="flex-1 bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl shadow-2xl overflow-hidden mx-2 sm:mx-4 lg:mx-6 mb-2 sm:mb-4 lg:mb-6">
        {/* Barre d'outils responsive - hauteur fixe */}
        <div className="flex-shrink-0 bg-slate-800/80 border-b border-slate-700 p-3 sm:p-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
            <div className="flex items-center gap-2 sm:gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm sm:text-base text-green-400 font-medium">Simulation Active</span>
              </div>
              <div className="hidden sm:block w-px h-6 bg-slate-600"></div>
              <div className="text-xs sm:text-sm text-slate-400">
                Mode: <span className="text-cyan-400 font-medium">Temps Réel</span>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2 sm:gap-3">
              <button className="px-3 py-1.5 sm:px-4 sm:py-2 bg-cyan-600 hover:bg-cyan-500 text-white text-xs sm:text-sm rounded-lg transition-colors touch-manipulation">
                🔄 Actualiser
              </button>
              <button 
                onClick={handleExportPDF}
                className="px-3 py-1.5 sm:px-4 sm:py-2 bg-slate-700 hover:bg-slate-600 text-white text-xs sm:text-sm rounded-lg transition-colors touch-manipulation"
              >
                📊 Exporter
              </button>
              <button className="px-3 py-1.5 sm:px-4 sm:py-2 bg-slate-700 hover:bg-slate-600 text-white text-xs sm:text-sm rounded-lg transition-colors touch-manipulation">
                ⚙️ Paramètres
              </button>
            </div>
          </div>
        </div>

        {/* Zone de simulation - utilise flex pour occuper l'espace restant */}
        <div className="flex-1 min-h-0">
          <OptiqueSimulationView />
        </div>
      </div>

      {/* Footer informatif - hauteur fixe */}
      <div className="flex-shrink-0 text-center pb-2 sm:pb-4">
        <p className="text-xs sm:text-sm text-slate-500">
          💡 <span className="text-cyan-400">Astuce:</span> Utilisez les contrôles flottants sur mobile pour accéder aux paramètres
        </p>
      </div>
    </div>
  );
};

export default OptiqueSimulation; 