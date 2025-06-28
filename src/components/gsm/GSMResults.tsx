import React, { useState } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell } from 'recharts';
import { usePDFExport } from '../../services/pdfExportService';

interface GSMResultsProps {
  area: number;
  density: number;
  trafficPerUser: number;
  penetration: number;
  activity: number;
  onSave?: () => void;
}

// Paramètres techniques GSM plus précis
const CAPACITE_TRX = 2.2; // Erlangs (avec facteur de sécurité)
const COUVERTURE_PAR_SITE_URBAIN = 2; // km² (zone urbaine dense)
const COUVERTURE_PAR_SITE_RURAL = 15; // km² (zone rurale)
const COUVERTURE_PAR_SITE_INDUSTRIEL = 1.5; // km² (zone industrielle)
const EFFICIENCE_SPECTRALE = 0.8; // Efficacité spectrale (80%)
const FACTEUR_DE_SECURITE = 1.2; // 20% de marge
const NOMBRE_CANAUX_PAR_TRX = 8; // Canaux par TRX

const GSMResults: React.FC<GSMResultsProps> = ({ area, density, trafficPerUser, penetration, activity, onSave }) => {
  const { exportDashboardReport } = usePDFExport();

  // Calculs améliorés avec formules techniques GSM
  const nbAbonnes = area * density * (penetration / 100);
  const traficTotal = nbAbonnes * (trafficPerUser / 1000) * activity; // Conversion mErlang -> Erlang
  const traficAvecSecurite = traficTotal * FACTEUR_DE_SECURITE;
  
  // Calcul du nombre de TRX avec formule d'Erlang-B
  const nbTRX = Math.ceil(traficAvecSecurite / CAPACITE_TRX);
  
  // Calcul de la couverture selon le type de zone
  const getCouvertureParSite = () => {
    if (density > 3000) return COUVERTURE_PAR_SITE_URBAIN;
    if (density < 500) return COUVERTURE_PAR_SITE_RURAL;
    return COUVERTURE_PAR_SITE_INDUSTRIEL;
  };
  
  const couvertureParSite = getCouvertureParSite();
  const nbSites = Math.ceil(area / couvertureParSite);
  
  // Calculs supplémentaires
  const nbCanaux = nbTRX * NOMBRE_CANAUX_PAR_TRX;
  const capaciteSpectrale = nbCanaux * EFFICIENCE_SPECTRALE;
  const densiteTrafic = traficTotal / area; // Erlangs/km²
  const chargeParSite = traficTotal / nbSites; // Erlangs par site
  
  // Calcul de la qualité de service (GoS)
  const calculerGoS = (trafic: number, canaux: number) => {
    // Formule simplifiée d'Erlang-B
    let numerateur = Math.pow(trafic, canaux) / factorial(canaux);
    let denominateur = 0;
    for (let i = 0; i <= canaux; i++) {
      denominateur += Math.pow(trafic, i) / factorial(i);
    }
    return numerateur / denominateur;
  };
  
  const gos = calculerGoS(traficTotal, nbCanaux);
  
  // Fonction factorielle pour Erlang-B
  function factorial(n: number): number {
    if (n <= 1) return 1;
    return n * factorial(n - 1);
  }

  const chartData = [
    { name: 'Zone (km²)', value: area },
    { name: 'Sites BTS', value: nbSites },
    { name: 'TRX', value: nbTRX },
  ];

  const pieData = [
    { name: 'Trafic par abonné', value: trafficPerUser },
    { name: 'Activité', value: activity * 100 },
    { name: 'Pénétration', value: penetration },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

  const [showFormula, setShowFormula] = useState(false);

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

  const handleSave = () => {
    const history = JSON.parse(localStorage.getItem('gsm_history') || '[]');
    history.unshift({
      date: new Date().toISOString(),
      nbAbonnes,
      traficTotal,
      traficAvecSecurite,
      nbTRX,
      nbSites,
      nbCanaux,
      capaciteSpectrale,
      densiteTrafic,
      chargeParSite,
      gos,
      couvertureParSite,
      params: { area, density, trafficPerUser, penetration, activity },
    });
    localStorage.setItem('gsm_history', JSON.stringify(history.slice(0, 10)));
    
    // Déclencher un événement personnalisé pour notifier la mise à jour
    window.dispatchEvent(new CustomEvent('gsmHistoryUpdated'));
    
    if (onSave) {
      onSave();
    }
  };

  return (
    <div className="mt-8 w-full">
      <h3 className="text-xl font-bold mb-6 text-primary-dark">Résultats du dimensionnement GSM</h3>
      
      {/* Métriques principales */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-blue-50 rounded-xl shadow p-5 flex flex-col items-center hover:shadow-lg transition-shadow border border-blue-200">
          <span className="text-2xl font-bold text-primary mb-1">{nbAbonnes.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
          <span className="text-gray-700 text-sm font-medium text-center">Nombre d'abonnés</span>
        </div>
        <div className="bg-green-50 rounded-xl shadow p-5 flex flex-col items-center hover:shadow-lg transition-shadow border border-green-200">
          <span className="text-2xl font-bold text-green-700 mb-1">{nbSites}</span>
          <span className="text-gray-700 text-sm font-medium text-center">Nombre de sites BTS</span>
        </div>
        <div className="bg-yellow-50 rounded-xl shadow p-5 flex flex-col items-center hover:shadow-lg transition-shadow border border-yellow-200">
          <span className="text-2xl font-bold text-yellow-600 mb-1">{nbTRX}</span>
          <span className="text-gray-700 text-sm font-medium text-center">Nombre de TRX</span>
        </div>
        <div className="bg-purple-50 rounded-xl shadow p-5 flex flex-col items-center hover:shadow-lg transition-shadow border border-purple-200">
          <span className="text-2xl font-bold text-purple-700 mb-1">{traficTotal.toFixed(2)}</span>
          <span className="text-gray-700 text-sm font-medium text-center">Trafic total (Erlang)</span>
        </div>
      </div>
      
      {/* Métriques secondaires */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
        <div className="bg-orange-50 rounded-xl shadow p-4 border border-orange-200">
          <div className="text-lg font-bold text-orange-700 mb-1">{nbCanaux}</div>
          <div className="text-gray-700 text-sm">Canaux totaux</div>
        </div>
        <div className="bg-indigo-50 rounded-xl shadow p-4 border border-indigo-200">
          <div className="text-lg font-bold text-indigo-700 mb-1">{capaciteSpectrale.toFixed(1)}</div>
          <div className="text-gray-700 text-sm">Capacité spectrale</div>
        </div>
        <div className="bg-red-50 rounded-xl shadow p-4 border border-red-200">
          <div className="text-lg font-bold text-red-700 mb-1">{densiteTrafic.toFixed(3)}</div>
          <div className="text-gray-700 text-sm">Densité trafic (E/km²)</div>
        </div>
        <div className="bg-teal-50 rounded-xl shadow p-4 border border-teal-200">
          <div className="text-lg font-bold text-teal-700 mb-1">{chargeParSite.toFixed(2)}</div>
          <div className="text-gray-700 text-sm">Charge/site (Erlang)</div>
        </div>
        <div className="bg-pink-50 rounded-xl shadow p-4 border border-pink-200">
          <div className="text-lg font-bold text-pink-700 mb-1">{(gos * 100).toFixed(2)}%</div>
          <div className="text-gray-700 text-sm">GoS (Grade of Service)</div>
        </div>
        <div className="bg-cyan-50 rounded-xl shadow p-4 border border-cyan-200">
          <div className="text-lg font-bold text-cyan-700 mb-1">{couvertureParSite} km²</div>
          <div className="text-gray-700 text-sm">Couverture/site</div>
        </div>
      </div>

      {/* Graphiques */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow p-6 border border-blue-100">
          <h4 className="font-semibold mb-4 text-primary-dark">Paramètres de dimensionnement</h4>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#2563eb" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        <div className="bg-white rounded-xl shadow p-6 border border-blue-100">
          <h4 className="font-semibold mb-4 text-primary-dark">Répartition des services</h4>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 mb-4">
        <button
          onClick={() => setShowFormula((v) => !v)}
          className="bg-blue-100 text-blue-800 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-200 transition-colors flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-primary-light"
        >
          <span role="img" aria-label="Formule">🧮</span>
          {showFormula ? 'Masquer les formules' : 'Voir les formules'}
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

      {/* Formules détaillées */}
      {showFormula && (
        <div className="mb-4 p-6 bg-blue-50 border-l-4 border-blue-400 rounded-xl shadow text-sm space-y-4 border border-blue-200">
          <div>
            <h5 className="font-bold text-blue-800 mb-2">Formules de dimensionnement GSM :</h5>
            <div className="space-y-2">
              <div><b>Nombre d'abonnés :</b> <span className="font-mono">N<sub>abonnés</sub> = Zone × Densité × (Pénétration / 100)</span></div>
              <div><b>Trafic total :</b> <span className="font-mono">T<sub>total</sub> = N<sub>abonnés</sub> × (Trafic<sub>utilisateur</sub> / 1000) × Activité</span></div>
              <div><b>Trafic avec sécurité :</b> <span className="font-mono">T&apos; = T<sub>total</sub> × F<sub>s</sub></span></div>
              <div><b>Nombre de TRX :</b> <span className="font-mono">N<sub>TRX</sub> = ⌈T&apos; / C<sub>TRX</sub>⌉</span></div>
              <div><b>Nombre de sites :</b> <span className="font-mono">N<sub>sites</sub> = ⌈Zone / Couverture<sub>site</sub>⌉</span></div>
              <div><b>Grade of Service :</b> <span className="font-mono">GoS = (T<sub>total</sub> / (C<sub>TRX</sub> × N<sub>TRX</sub>)) × 100</span></div>
            </div>
          </div>
          
          <div>
            <h5 className="font-bold text-blue-800 mb-2">Paramètres techniques :</h5>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>C<sub>TRX</sub> = {CAPACITE_TRX} Erlangs</div>
              <div>F<sub>s</sub> = {FACTEUR_DE_SECURITE}</div>
              <div>Efficacité spectrale = {EFFICIENCE_SPECTRALE * 100}%</div>
              <div>Canaux/TRX = {NOMBRE_CANAUX_PAR_TRX}</div>
              <div>Couverture urbain = {COUVERTURE_PAR_SITE_URBAIN} km²</div>
              <div>Couverture rural = {COUVERTURE_PAR_SITE_RURAL} km²</div>
            </div>
          </div>
          
          <div>
            <h5 className="font-bold text-blue-800 mb-2">Type de zone détecté :</h5>
            <div className="text-xs space-y-1">
              <div>• <b>{density > 3000 ? 'URBAIN' : density < 500 ? 'RURAL' : 'INDUSTRIEL'}</b> : {density} abonnés/km²</div>
              <div>• Couverture par site : {couvertureParSite} km²</div>
              <div>• Capacité par TRX : {CAPACITE_TRX} Erlangs</div>
            </div>
          </div>
        </div>
      )}

      {/* Recommandation */}
      <div className="mb-6 p-4 rounded-xl bg-gray-100 shadow flex items-center gap-3">
        <span className="text-2xl">💡</span>
        <div className="text-sm text-gray-700">
          <strong>Recommandation :</strong> 
          {gos < 0.02 ? 'Excellent GoS, la qualité de service est optimale.' :
           gos < 0.05 ? 'Bon GoS, la qualité de service est satisfaisante.' :
           gos < 0.1 ? 'GoS acceptable, surveiller l\'évolution du trafic.' :
           'GoS élevé, considérer l\'ajout de TRX ou de sites pour améliorer la qualité.'}
        </div>
      </div>

      {/* Informations techniques */}
      <div className="text-xs text-gray-500 mt-2 bg-gray-50 rounded-xl shadow p-4 border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <div>Type de zone : {density > 3000 ? 'Urbain' : density < 500 ? 'Rural' : 'Industriel'}</div>
          <div>Capacité par TRX : {CAPACITE_TRX} Erlangs</div>
          <div>Facteur de sécurité : {FACTEUR_DE_SECURITE}</div>
          <div>Efficacité spectrale : {EFFICIENCE_SPECTRALE * 100}%</div>
          <div>Couverture par site : {couvertureParSite} km²</div>
          <div>Densité abonnés : {density} ab/km²</div>
        </div>
      </div>
    </div>
  );
};

export default GSMResults; 