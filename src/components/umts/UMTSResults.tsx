import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { usePDFExport } from '../../services/pdfExportService';

interface UMTSResultsProps {
  area: number;
  users: number;
  voice: number;
  data: number;
  video: number;
  load: number;
  onSave?: () => void;
}

// Paramètres techniques UMTS plus précis
const CAPACITE_CELLULE_URBAIN = 2048; // kbps (zone urbaine)
const CAPACITE_CELLULE_RURAL = 5120; // kbps (zone rurale)
const CAPACITE_CELLULE_INDOOR = 1024; // kbps (zone indoor)
const SECTEURS_PAR_NODEB = 3; // Tri-secteur standard
const EFFICIENCE_SPECTRALE = 0.75; // Efficacité spectrale WCDMA
const FACTEUR_DE_SECURITE = 1.3; // 30% de marge
const COUVERTURE_CELLULE_URBAIN = 1; // km²
const COUVERTURE_CELLULE_RURAL = 5; // km²
const COUVERTURE_CELLULE_INDOOR = 0.5; // km²

const UMTSResults: React.FC<UMTSResultsProps> = ({ area, users, voice, data, video, load, onSave }) => {
  const { exportDashboardReport } = usePDFExport();
  
  // Calculs améliorés avec formules techniques UMTS
  const debitVoix = users * voice;
  const debitData = users * data;
  const debitVideo = users * video;
  const debitTotal = debitVoix + debitData + debitVideo;
  const facteurCharge = load / 100;
  
  // Détermination du type de zone et de la capacité
  const getTypeZone = () => {
    if (users / area > 1000) return 'urbain';
    if (users / area < 100) return 'rural';
    return 'indoor';
  };
  
  const typeZone = getTypeZone();
  
  const getCapaciteCellule = () => {
    switch (typeZone) {
      case 'urbain': return CAPACITE_CELLULE_URBAIN;
      case 'rural': return CAPACITE_CELLULE_RURAL;
      default: return CAPACITE_CELLULE_INDOOR;
    }
  };
  
  const getCouvertureCellule = () => {
    switch (typeZone) {
      case 'urbain': return COUVERTURE_CELLULE_URBAIN;
      case 'rural': return COUVERTURE_CELLULE_RURAL;
      default: return COUVERTURE_CELLULE_INDOOR;
    }
  };
  
  const capaciteCellule = getCapaciteCellule();
  const couvertureCellule = getCouvertureCellule();
  
  // Calculs avec facteurs techniques
  const capaciteUtileCellule = capaciteCellule * facteurCharge * EFFICIENCE_SPECTRALE;
  const debitAvecSecurite = debitTotal * FACTEUR_DE_SECURITE;
  const nbCellules = Math.ceil(debitAvecSecurite / capaciteUtileCellule);
  const nbNodeB = Math.ceil(nbCellules / SECTEURS_PAR_NODEB);
  
  // Calculs supplémentaires
  const densiteUtilisateurs = users / area; // utilisateurs/km²
  const chargeParCellule = debitTotal / nbCellules; // kbps par cellule
  const couvertureParNodeB = couvertureCellule * SECTEURS_PAR_NODEB; // km² par NodeB
  
  // Calcul de la qualité de service (GoS)
  const calculerGoS = (trafic: number, capacite: number) => {
    // Formule simplifiée pour UMTS
    const utilisation = trafic / capacite;
    return Math.min(utilisation, 1) * 100;
  };
  
  const gos = calculerGoS(debitTotal, capaciteUtileCellule * nbCellules);

  const chartData = [
    { name: 'Voix', value: debitVoix },
    { name: 'Data', value: debitData },
    { name: 'Vidéo', value: debitVideo },
  ];

  const pieData = [
    { name: 'Débit voix', value: debitVoix },
    { name: 'Débit data', value: debitData },
    { name: 'Débit vidéo', value: debitVideo },
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

  const handleSave = () => {
    const history = JSON.parse(localStorage.getItem('umts_history') || '[]');
    history.unshift({
      date: new Date().toISOString(),
      nbUtilisateurs: users,
      debitVoix,
      debitData,
      debitVideo,
      debitTotal,
      debitAvecSecurite,
      capaciteCellule,
      capaciteUtileCellule,
      nbCellules,
      nbNodeB,
      densiteUtilisateurs,
      chargeParCellule,
      couvertureParNodeB,
      typeZone,
      gos,
      params: { area, users, voice, data, video, load },
    });
    localStorage.setItem('umts_history', JSON.stringify(history.slice(0, 10)));
    
    // Déclencher un événement personnalisé pour notifier la mise à jour
    window.dispatchEvent(new CustomEvent('umtsHistoryUpdated'));
    
    if (onSave) {
      onSave();
    }
  };

  // Recommandations améliorées
  let recommandation = 'Dimensionnement UMTS correct.';
  let niveauRecommandation = 'success';
  
  if (gos > 80) {
    recommandation = "Attention : Qualité de service dégradée (>80%). Considérez augmenter le nombre de cellules ou réduire le facteur de charge.";
    niveauRecommandation = 'error';
  } else if (gos > 60) {
    recommandation = "Qualité de service acceptable mais proche de la limite. Surveillez les performances.";
    niveauRecommandation = 'warning';
  } else if (nbNodeB > area * 2) {
    recommandation = "Nombre de NodeB élevé par rapport à la zone. Vérifiez les paramètres de couverture.";
    niveauRecommandation = 'warning';
  } else if (chargeParCellule > capaciteUtileCellule * 0.8) {
    recommandation = "Charge par cellule élevée. Risque de congestion lors des pics de trafic.";
    niveauRecommandation = 'warning';
  }

  return (
    <div className="mt-8">
      <h3 className="text-xl font-bold mb-6 text-primary-dark">Résultats du dimensionnement UMTS</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-blue-50 rounded-xl shadow p-5 flex flex-col items-center hover:shadow-lg transition-shadow">
          <span className="text-3xl font-bold text-primary mb-1">{nbCellules}</span>
          <span className="text-gray-700 text-sm font-medium">Nombre de cellules</span>
        </div>
        <div className="bg-green-50 rounded-xl shadow p-5 flex flex-col items-center hover:shadow-lg transition-shadow">
          <span className="text-3xl font-bold text-green-700 mb-1">{nbNodeB}</span>
          <span className="text-gray-700 text-sm font-medium">Nombre de NodeB</span>
        </div>
        <div className="bg-purple-50 rounded-xl shadow p-5 flex flex-col items-center hover:shadow-lg transition-shadow">
          <span className="text-3xl font-bold text-purple-700 mb-1">{capaciteCellule}</span>
          <span className="text-gray-700 text-sm font-medium">Capacité cellule (kbps)</span>
        </div>
        <div className="bg-yellow-50 rounded-xl shadow p-5 flex flex-col items-center hover:shadow-lg transition-shadow">
          <span className="text-3xl font-bold text-yellow-600 mb-1">{capaciteUtileCellule.toFixed(0)}</span>
          <span className="text-gray-700 text-sm font-medium">Capacité utile (kbps)</span>
        </div>
        <div className="bg-indigo-50 rounded-xl shadow p-5 flex flex-col items-center hover:shadow-lg transition-shadow">
          <span className="text-3xl font-bold text-indigo-700 mb-1">{debitTotal.toFixed(0)}</span>
          <span className="text-gray-700 text-sm font-medium">Débit total (kbps)</span>
        </div>
        <div className="bg-pink-50 rounded-xl shadow p-5 flex flex-col items-center hover:shadow-lg transition-shadow">
          <span className="text-3xl font-bold text-pink-700 mb-1">{gos.toFixed(1)}</span>
          <span className="text-gray-700 text-sm font-medium">Grade de service (%)</span>
        </div>
      </div>
      
      {/* Métriques secondaires */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-orange-50 rounded-xl shadow p-4 border border-orange-200">
          <div className="text-lg font-bold text-orange-700 mb-1">{densiteUtilisateurs.toFixed(1)}</div>
          <div className="text-gray-700 text-sm">Densité utilisateurs (u/km²)</div>
        </div>
        <div className="bg-teal-50 rounded-xl shadow p-4 border border-teal-200">
          <div className="text-lg font-bold text-teal-700 mb-1">{chargeParCellule.toFixed(0)}</div>
          <div className="text-gray-700 text-sm">Charge par cellule (kbps)</div>
        </div>
        <div className="bg-cyan-50 rounded-xl shadow p-4 border border-cyan-200">
          <div className="text-lg font-bold text-cyan-700 mb-1">{couvertureParNodeB.toFixed(1)}</div>
          <div className="text-gray-700 text-sm">Couverture par NodeB (km²)</div>
        </div>
        <div className="bg-emerald-50 rounded-xl shadow p-4 border border-emerald-200">
          <div className="text-lg font-bold text-emerald-700 mb-1">{typeZone}</div>
          <div className="text-gray-700 text-sm">Type de zone</div>
        </div>
      </div>

      {/* Graphiques */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow p-6 border border-blue-100">
          <h4 className="font-semibold mb-4 text-primary-dark">Répartition des débits</h4>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={true} />
              <Tooltip />
              <Bar dataKey="value" fill="#10B981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        <div className="bg-white rounded-xl shadow p-6 border border-blue-100">
          <h4 className="font-semibold mb-4 text-primary-dark">Répartition des débits</h4>
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
                {pieData.map((_entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Formule */}
      <div className="mb-6">
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
        {showFormula && (
          <div className="mb-4 p-4 bg-blue-50 border-l-4 border-blue-400 rounded-xl shadow text-sm">
            <h5 className="font-bold text-blue-800 mb-2">Formules du dimensionnement UMTS :</h5>
            <div className="space-y-3">
              <div>
                <b>1. Débit total :</b><br/>
                <span className="font-mono">D<sub>total</sub> = N<sub>users</sub> × (D<sub>voice</sub> + D<sub>data</sub> + D<sub>video</sub>)</span><br/>
                où <b>N<sub>users</sub></b> = nombre d'utilisateurs, <b>D<sub>voice</sub></b> = débit voix, <b>D<sub>data</sub></b> = débit data, <b>D<sub>video</sub></b> = débit vidéo
              </div>
              <div>
                <b>2. Capacité utile cellule :</b><br/>
                <span className="font-mono">C<sub>utile</sub> = C<sub>cellule</sub> × facteur<sub>charge</sub> × efficacité<sub>spectrale</sub></span><br/>
                où <b>C<sub>cellule</sub></b> = capacité théorique, <b>facteur<sub>charge</sub></b> = charge/100, <b>efficacité<sub>spectrale</sub></b> = 0.75
              </div>
              <div>
                <b>3. Nombre de cellules :</b><br/>
                <span className="font-mono">N<sub>cellules</sub> = ⌈(D<sub>total</sub> × facteur<sub>sécurité</sub>) / C<sub>utile</sub>⌉</span><br/>
                où <b>facteur<sub>sécurité</sub></b> = 1.3 (30% de marge)
              </div>
              <div>
                <b>4. Nombre de NodeB :</b><br/>
                <span className="font-mono">N<sub>NodeB</sub> = ⌈N<sub>cellules</sub> / secteurs<sub>par</sub><sub>NodeB</sub>⌉</span><br/>
                où <b>secteurs<sub>par</sub><sub>NodeB</sub></b> = 3 (tri-secteur standard)
              </div>
              <div>
                <b>5. Grade de service (GoS) :</b><br/>
                <span className="font-mono">GoS = min(trafic / capacité, 1) × 100</span><br/>
                Indicateur de qualité de service en pourcentage
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-blue-200">
              <b>Capacités par type de zone :</b>
              <ul className="mt-1 space-y-1 text-xs">
                <li>• Urbain : 2048 kbps (densité élevée)</li>
                <li>• Rural : 5120 kbps (densité faible)</li>
                <li>• Indoor : 1024 kbps (environnement fermé)</li>
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* Recommandation */}
      <div className={`mb-6 p-4 rounded-xl shadow flex items-center gap-3 ${
        niveauRecommandation === 'error' ? 'bg-red-100 border border-red-200' :
        niveauRecommandation === 'warning' ? 'bg-yellow-100 border border-yellow-200' :
        'bg-green-100 border border-green-200'
      }`}>
        <span className="text-2xl">
          {niveauRecommandation === 'error' ? '⚠️' : 
           niveauRecommandation === 'warning' ? '⚡' : '✅'}
        </span>
        <div className="text-sm text-gray-700"><strong>Recommandation :</strong> {recommandation}</div>
      </div>
    </div>
  );
};

export default UMTSResults; 