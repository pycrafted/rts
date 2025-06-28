import React, { useState } from 'react';
import { usePDFExport } from '../../services/pdfExportService';

interface OptiqueResultsProps {
  length: number; // km
  attenuation: number; // dB/km
  splices: number;
  connectors: number;
  losses: number; // dB
  power: number; // dBm
}

const OptiqueResults: React.FC<OptiqueResultsProps> = ({ length, attenuation, splices, connectors, losses, power }) => {
  const { exportDashboardReport } = usePDFExport();

  // Calculs améliorés avec validations
  const attFibre = length * attenuation;
  const pertesEpissures = splices * 0.1;
  const pertesConnecteurs = connectors * 0.5;
  const pertesTotales = attFibre + pertesEpissures + pertesConnecteurs + losses;
  const bilan = power - pertesTotales;
  
  // Calculs supplémentaires pour l'analyse
  const puissanceReception = power - pertesTotales;
  const margeSecurite = bilan - (-30); // Seuil typique récepteur optique
  const qualiteLiaison = margeSecurite > 15 ? 'Excellente' : margeSecurite > 10 ? 'Bonne' : margeSecurite > 5 ? 'Moyenne' : 'Faible';
  const disponibilite = margeSecurite > 10 ? '99.99%' : margeSecurite > 5 ? '99.9%' : margeSecurite > 0 ? '99%' : 'Incertaine';

  // Indicateur couleur pour le bilan avec seuils plus précis
  let recommandation = 'La liaison optique est excellente avec une marge de sécurité confortable.';
  let bilanColor = 'bg-teal-50';
  let bilanTextColor = 'text-teal-700';
  
  if (bilan < -30) {
    recommandation = "CRITIQUE : Le bilan est en dessous du seuil de réception. La liaison ne peut pas fonctionner. Augmentez la puissance ou réduisez les pertes.";
    bilanColor = 'bg-red-50';
    bilanTextColor = 'text-red-600';
  } else if (bilan < -20) {
    recommandation = "DANGER : Le bilan est très faible. Risque de dysfonctionnement. Améliorez la puissance, réduisez les pertes ou la longueur.";
    bilanColor = 'bg-red-50';
    bilanTextColor = 'text-red-600';
  } else if (bilan < -10) {
    recommandation = "ATTENTION : Le bilan est faible. Marge de sécurité insuffisante. Un ajustement des paramètres est fortement conseillé.";
    bilanColor = 'bg-yellow-50';
    bilanTextColor = 'text-yellow-600';
  } else if (bilan < 0) {
    recommandation = "Le bilan est limite. Marge de sécurité faible. Un ajustement des paramètres est conseillé.";
    bilanColor = 'bg-yellow-50';
    bilanTextColor = 'text-yellow-600';
  } else if (bilan < 5) {
    recommandation = "Le bilan est correct mais la marge de sécurité est faible. Surveillance recommandée.";
    bilanColor = 'bg-green-50';
    bilanTextColor = 'text-green-600';
  } else if (bilan < 15) {
    recommandation = "La liaison optique est bonne avec une marge de sécurité correcte.";
    bilanColor = 'bg-teal-50';
    bilanTextColor = 'text-teal-700';
  }

  const handleSave = () => {
    const entry = {
      date: new Date().toISOString(),
      attFibre,
      pertesEpissures,
      pertesConnecteurs,
      pertesTotales,
      bilan,
      params: { length, attenuation, splices, connectors, losses, power },
    };
    const history = JSON.parse(localStorage.getItem('optique_history') || '[]');
    history.unshift(entry);
    localStorage.setItem('optique_history', JSON.stringify(history.slice(0, 10)));
    
    // Déclencher un événement personnalisé pour notifier la mise à jour
    window.dispatchEvent(new CustomEvent('optiqueHistoryUpdated'));
  };

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

      const totalGsmDistance = gsmHistory.reduce((sum: number, item: any) => sum + (item.distance || 0), 0);
      const totalUmtsDistance = umtsHistory.reduce((sum: number, item: any) => sum + (item.distance || 0), 0);
      const totalHertzienDistance = hertzienHistory.reduce((sum: number, item: any) => sum + (item.distance || 0), 0);
      const totalOptiqueDistance = optiqueHistory.reduce((sum: number, item: any) => sum + (item.params?.length || 0), 0);

      const totalGsmMarge = gsmHistory.reduce((sum: number, item: any) => sum + (item.marge || 0), 0);
      const totalUmtsMarge = umtsHistory.reduce((sum: number, item: any) => sum + (item.marge || 0), 0);
      const totalHertzienMarge = hertzienHistory.reduce((sum: number, item: any) => sum + (item.marge || 0), 0);
      const totalOptiqueMarge = optiqueHistory.reduce((sum: number, item: any) => sum + (item.bilan || 0), 0);

      const totalGsmBilan = gsmHistory.reduce((sum: number, item: any) => sum + (item.bilan || 0), 0);
      const totalUmtsBilan = umtsHistory.reduce((sum: number, item: any) => sum + (item.bilan || 0), 0);
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

  const [showFormula, setShowFormula] = useState(false);

  return (
    <div className="mt-8">
      <h3 className="text-xl font-bold mb-6 text-primary-dark">Résultats du bilan optique</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-blue-50 rounded-xl shadow p-5 flex flex-col items-center hover:shadow-lg transition-shadow">
          <span className="text-3xl font-bold text-primary mb-1">{attFibre.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
          <span className="text-gray-700 text-sm font-medium">Atténuation fibre totale (dB)</span>
        </div>
        <div className="bg-green-50 rounded-xl shadow p-5 flex flex-col items-center hover:shadow-lg transition-shadow">
          <span className="text-3xl font-bold text-green-700 mb-1">{pertesEpissures.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
          <span className="text-gray-700 text-sm font-medium">Pertes épissures (dB)</span>
        </div>
        <div className="bg-pink-50 rounded-xl shadow p-5 flex flex-col items-center hover:shadow-lg transition-shadow">
          <span className="text-3xl font-bold text-pink-700 mb-1">{pertesConnecteurs.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
          <span className="text-gray-700 text-sm font-medium">Pertes connecteurs (dB)</span>
        </div>
        <div className="bg-yellow-50 rounded-xl shadow p-5 flex flex-col items-center hover:shadow-lg transition-shadow">
          <span className="text-3xl font-bold text-yellow-600 mb-1">{losses.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
          <span className="text-gray-700 text-sm font-medium">Pertes diverses (dB)</span>
        </div>
        <div className="bg-purple-50 rounded-xl shadow p-5 flex flex-col items-center hover:shadow-lg transition-shadow">
          <span className="text-3xl font-bold text-purple-700 mb-1">{pertesTotales.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
          <span className="text-gray-700 text-sm font-medium">Pertes totales (dB)</span>
        </div>
        <div className={`rounded-xl shadow p-5 flex flex-col items-center hover:shadow-lg transition-shadow ${bilanColor}`}> 
          <span className={`text-3xl font-bold mb-1 ${bilanTextColor}`}>{bilan.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
          <span className="text-gray-700 text-sm font-medium">Bilan de puissance (dBm)</span>
        </div>
      </div>
      
      {/* Métriques secondaires */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-orange-50 rounded-xl shadow p-4 border border-orange-200">
          <div className="text-lg font-bold text-orange-700 mb-1">{puissanceReception.toFixed(2)} dBm</div>
          <div className="text-gray-700 text-sm">Puissance de réception</div>
        </div>
        <div className="bg-indigo-50 rounded-xl shadow p-4 border border-indigo-200">
          <div className="text-lg font-bold text-indigo-700 mb-1">{margeSecurite.toFixed(2)} dB</div>
          <div className="text-gray-700 text-sm">Marge de sécurité</div>
        </div>
        <div className="bg-cyan-50 rounded-xl shadow p-4 border border-cyan-200">
          <div className="text-lg font-bold text-cyan-700 mb-1">{qualiteLiaison}</div>
          <div className="text-gray-700 text-sm">Qualité de liaison</div>
        </div>
        <div className="bg-emerald-50 rounded-xl shadow p-4 border border-emerald-200">
          <div className="text-lg font-bold text-emerald-700 mb-1">{disponibilite}</div>
          <div className="text-gray-700 text-sm">Disponibilité estimée</div>
        </div>
      </div>

      {/* Graphiques - Affichage automatique */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Graphique des pertes */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
          <h4 className="text-lg font-bold text-gray-900 mb-4">Répartition des pertes</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Atténuation fibre</span>
              <div className="flex items-center gap-2">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full" 
                    style={{ width: `${(attFibre / pertesTotales) * 100}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium">{attFibre.toFixed(2)} dB</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Pertes épissures</span>
              <div className="flex items-center gap-2">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full" 
                    style={{ width: `${(pertesEpissures / pertesTotales) * 100}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium">{pertesEpissures.toFixed(2)} dB</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Pertes connecteurs</span>
              <div className="flex items-center gap-2">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-pink-500 h-2 rounded-full" 
                    style={{ width: `${(pertesConnecteurs / pertesTotales) * 100}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium">{pertesConnecteurs.toFixed(2)} dB</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Pertes diverses</span>
              <div className="flex items-center gap-2">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-yellow-500 h-2 rounded-full" 
                    style={{ width: `${(losses / pertesTotales) * 100}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium">{losses.toFixed(2)} dB</span>
              </div>
            </div>
          </div>
        </div>

        {/* Graphique du bilan de puissance */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
          <h4 className="text-lg font-bold text-gray-900 mb-4">Bilan de puissance</h4>
          <div className="flex flex-col items-center">
            <div className="relative w-32 h-32 mb-4">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="#e5e7eb"
                  strokeWidth="8"
                  fill="none"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke={bilan > 0 ? "#10b981" : bilan > -10 ? "#f59e0b" : "#ef4444"}
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray={`${Math.min(Math.abs(bilan) / 50 * 251.2, 251.2)} 251.2`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className={`text-2xl font-bold ${bilanTextColor}`}>{bilan.toFixed(1)}</div>
                  <div className="text-xs text-gray-600">dBm</div>
                </div>
              </div>
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-600">Puissance émission: {power} dBm</div>
              <div className="text-sm text-gray-600">Pertes totales: {pertesTotales.toFixed(1)} dB</div>
              <div className="text-sm text-gray-600">Marge: {margeSecurite.toFixed(1)} dB</div>
            </div>
          </div>
        </div>
      </div>

      {/* Formule */}
      <div className="mb-6">
        {showFormula && (
          <div className="mb-4 p-4 bg-blue-50 border-l-4 border-blue-400 rounded-xl shadow text-sm">
            <h5 className="font-bold text-blue-800 mb-2">Formules du bilan optique :</h5>
            <div className="space-y-3">
              <div>
                <b>1. Atténuation fibre :</b><br/>
                <span className="font-mono">A<sub>fibre</sub> = L × a</span><br/>
                où <b>L</b> = longueur (km), <b>a</b> = atténuation (dB/km)
              </div>
              <div>
                <b>2. Pertes épissures :</b><br/>
                <span className="font-mono">P<sub>épissures</sub> = N<sub>épissures</sub> × 0.1 dB</span><br/>
                Perte typique par épissure : 0.1 dB
              </div>
              <div>
                <b>3. Pertes connecteurs :</b><br/>
                <span className="font-mono">P<sub>connecteurs</sub> = N<sub>connecteurs</sub> × 0.5 dB</span><br/>
                Perte typique par connecteur : 0.5 dB
              </div>
              <div>
                <b>4. Pertes totales :</b><br/>
                <span className="font-mono">P<sub>totales</sub> = A<sub>fibre</sub> + P<sub>épissures</sub> + P<sub>connecteurs</sub> + P<sub>diverses</sub></span>
              </div>
              <div>
                <b>5. Bilan de puissance :</b><br/>
                <span className="font-mono">Bilan = P<sub>ém</sub> - P<sub>totales</sub></span><br/>
                où <b>P<sub>ém</sub></b> = puissance émetteur (dBm)
              </div>
              <div>
                <b>6. Marge de sécurité :</b><br/>
                <span className="font-mono">Marge = Bilan - Seuil<sub>récepteur</sub></span><br/>
                Seuil typique récepteur : -30 dBm
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-blue-200">
              <b>Seuils de bilan :</b>
              <ul className="mt-1 space-y-1 text-xs">
                <li>• &lt; -30 dBm : Liaison impossible</li>
                <li>• -30 à -20 dBm : Très faible (danger)</li>
                <li>• -20 à -10 dBm : Faible (attention)</li>
                <li>• -10 à 0 dBm : Limite</li>
                <li>• 0 à 5 dBm : Correct</li>
                <li>• 5 à 15 dBm : Bon</li>
                <li>• &gt; 15 dBm : Excellent</li>
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* Recommandation */}
      <div className="mb-6 p-4 rounded-xl bg-gray-100 shadow flex items-center gap-3">
        <span className="text-2xl">💡</span>
        <div className="text-sm text-gray-700"><strong>Recommandation :</strong> {recommandation}</div>
      </div>

      {/* Barre d'actions alignée */}
      <div className="flex gap-3 mb-4">
        <button
          onClick={() => setShowFormula((v) => !v)}
          className="bg-blue-100 text-blue-800 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-200 transition-colors flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-primary-light"
        >
          <span role="img" aria-label="Formule">🧮</span>
          {showFormula ? 'Masquer la formule' : 'Voir la formule'}
        </button>
        <button
          onClick={handleExportPDF}
          className="bg-green-100 text-green-800 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-green-200 transition-colors flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-green-400"
        >
          <span role="img" aria-label="PDF">📄</span>
          Export PDF
        </button>
      <button
        onClick={handleSave}
        className="bg-primary text-white px-4 py-2 rounded-lg font-semibold hover:bg-primary-dark transition-colors flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-primary-light"
      >
        <span role="img" aria-label="Sauvegarder">💾</span> Sauvegarder
      </button>
      </div>
    </div>
  );
};

export default OptiqueResults; 