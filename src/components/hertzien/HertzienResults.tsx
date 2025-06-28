import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { usePDFExport } from '@/services/pdfExportService';

interface HertzienResultsProps {
  frequency: number; // GHz
  distance: number; // km
  power: number; // dBm
  gainTx: number; // dBi
  gainRx: number; // dBi
  losses: number; // dB
  threshold: number; // dBm
  onSave?: () => void;
}

const HertzienResults: React.FC<HertzienResultsProps> = ({ frequency, distance, power, gainTx, gainRx, losses, threshold, onSave }) => {
  const [showFormula, setShowFormula] = useState(false);
  const { exportDashboardReport } = usePDFExport();

  // Calculs du bilan de liaison
  const affaiblissement = 32.4 + 20 * Math.log10(frequency * 1000) + 20 * Math.log10(distance);
  const bilan = power + gainTx + gainRx - affaiblissement - losses;
  const puissanceReception = power + gainTx - affaiblissement - losses + gainRx;
  const marge = puissanceReception - threshold;
  const rapportSignalBruit = puissanceReception - threshold;

  // Détermination de la qualité de liaison
  let qualiteLiaison = '';
  let margeColor = '';
  let margeLabel = '';
  let recommandation = '';

  if (marge < 0) {
    qualiteLiaison = 'Impossible';
    margeColor = 'bg-red-500';
    margeLabel = 'Liaison impossible';
    recommandation = 'Augmentez la puissance d\'émission ou réduisez la distance.';
  } else if (marge < 3) {
    qualiteLiaison = 'Dangereuse';
    margeColor = 'bg-red-400';
    margeLabel = 'Marge insuffisante';
    recommandation = 'La liaison est à la limite. Considérez des améliorations.';
  } else if (marge < 10) {
    qualiteLiaison = 'Limite';
    margeColor = 'bg-yellow-500';
    margeLabel = 'Marge limite';
    recommandation = 'La liaison fonctionne mais la marge est faible. Surveillez les conditions.';
  } else if (marge < 20) {
    qualiteLiaison = 'Bonne';
    margeColor = 'bg-green-500';
    margeLabel = 'Bonne marge';
    recommandation = 'La liaison est fiable avec une marge de sécurité correcte.';
  } else {
    qualiteLiaison = 'Excellente';
    margeColor = 'bg-teal-500';
    margeLabel = 'Excellente marge';
    recommandation = 'La liaison est excellente avec une marge de sécurité importante.';
  }

  // Générer des points pour le profil de liaison (distance de 1 à la distance saisie)
  const profileData = Array.from({ length: Math.max(2, Math.ceil(distance)) }, (_, i) => {
    const d = (i + 1) * (distance / Math.max(2, Math.ceil(distance)));
    const aff = 32.4 + 20 * Math.log10(frequency * 1000) + 20 * Math.log10(d);
    const bilanLocal = power + gainTx + gainRx - aff - losses;
    const margeLocal = bilanLocal - threshold;
    return { 
      d: d.toFixed(2), 
      aff: Number(aff.toFixed(2)),
      bilan: Number(bilanLocal.toFixed(2)),
      marge: Number(margeLocal.toFixed(2))
    };
  });

  const handleSave = () => {
    const entry = {
      date: new Date().toISOString(),
      distance: distance,
      affaiblissement,
      bilan,
      marge,
      puissanceReception,
      rapportSignalBruit,
      qualiteLiaison,
      params: { frequency, distance, power, gainTx, gainRx, losses, threshold },
    };
    const history = JSON.parse(localStorage.getItem('hertzien_history') || '[]');
    history.unshift(entry);
    localStorage.setItem('hertzien_history', JSON.stringify(history.slice(0, 10)));
    alert('Résultat hertzien sauvegardé !');
    if (onSave) {
      onSave();
    }
  };

  // Données pour les graphiques
  const chartData = [
    { name: 'Distance', value: distance },
    { name: 'Fréquence', value: frequency },
    { name: 'Puissance', value: power },
    { name: 'Gain Tx', value: gainTx },
    { name: 'Gain Rx', value: gainRx },
    { name: 'Pertes', value: losses }
  ];

  const pieData = [
    { name: 'Affaiblissement', value: affaiblissement },
    { name: 'Gains totaux', value: gainTx + gainRx },
    { name: 'Pertes diverses', value: losses },
    { name: 'Puissance émission', value: power },
  ];

  const COLORS = ['#10B981', '#3B82F6', '#F59E0B', '#EF4444'];

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
      const totalOptiqueDistance = optiqueHistory.reduce((sum: number, item: any) => sum + (item.distance || 0), 0);

      const totalGsmMarge = gsmHistory.reduce((sum: number, item: any) => sum + (item.marge || 0), 0);
      const totalUmtsMarge = umtsHistory.reduce((sum: number, item: any) => sum + (item.marge || 0), 0);
      const totalHertzienMarge = hertzienHistory.reduce((sum: number, item: any) => sum + (item.marge || 0), 0);
      const totalOptiqueMarge = optiqueHistory.reduce((sum: number, item: any) => sum + (item.marge || 0), 0);

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

  return (
    <div className="mt-8">
      <h3 className="text-xl font-bold mb-6 text-primary-dark">Résultats du bilan hertzien</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-blue-50 rounded-xl shadow p-5 flex flex-col items-center hover:shadow-lg transition-shadow">
          <span className="text-3xl font-bold text-primary mb-1">{affaiblissement.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
          <span className="text-gray-700 text-sm font-medium">Affaiblissement espace libre (dB)</span>
        </div>
        <div className="bg-green-50 rounded-xl shadow p-5 flex flex-col items-center hover:shadow-lg transition-shadow">
          <span className="text-3xl font-bold text-green-700 mb-1">{bilan.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
          <span className="text-gray-700 text-sm font-medium">Bilan de liaison (dB)</span>
        </div>
        <div className="bg-purple-50 rounded-xl shadow p-5 flex flex-col items-center hover:shadow-lg transition-shadow">
          <span className="text-3xl font-bold text-purple-700 mb-1">{puissanceReception.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
          <span className="text-gray-700 text-sm font-medium">Puissance de réception (dBm)</span>
        </div>
        <div className={`rounded-xl shadow p-5 flex flex-col items-center hover:shadow-lg transition-shadow ${marge < 0 ? 'bg-red-50' : marge < 3 ? 'bg-red-50' : marge < 10 ? 'bg-yellow-50' : marge < 20 ? 'bg-green-50' : 'bg-teal-50'}`}> 
          <span className={`text-3xl font-bold mb-1 ${marge < 0 ? 'text-red-600' : marge < 3 ? 'text-red-600' : marge < 10 ? 'text-yellow-600' : marge < 20 ? 'text-green-600' : 'text-teal-700'}`}>{marge.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
          <span className="text-gray-700 text-sm font-medium flex items-center gap-2">
            Marge de liaison (dB)
            <span className={`inline-block w-3 h-3 rounded-full ${margeColor}`} title={margeLabel}></span>
            <span className="text-xs text-gray-600">{margeLabel}</span>
          </span>
        </div>
      </div>
      
      {/* Métriques secondaires */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <div className="bg-orange-50 rounded-xl shadow p-4 border border-orange-200">
          <div className="text-lg font-bold text-orange-700 mb-1">{rapportSignalBruit.toFixed(2)} dB</div>
          <div className="text-gray-700 text-sm">Rapport Signal/Bruit</div>
        </div>
        <div className="bg-indigo-50 rounded-xl shadow p-4 border border-indigo-200">
          <div className="text-lg font-bold text-indigo-700 mb-1">{qualiteLiaison}</div>
          <div className="text-gray-700 text-sm">Qualité de liaison</div>
        </div>
        <div className="bg-cyan-50 rounded-xl shadow p-4 border border-cyan-200">
          <div className="text-lg font-bold text-cyan-700 mb-1">{frequency} GHz</div>
          <div className="text-gray-700 text-sm">Fréquence utilisée</div>
        </div>
      </div>
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
            <h5 className="font-bold text-blue-800 mb-2">Formules du bilan de liaison hertzien :</h5>
            <div className="space-y-3">
              <div>
                <b>1. Affaiblissement en espace libre :</b><br/>
                <span className="font-mono">A = 32.4 + 20·log₁₀(F) + 20·log₁₀(D)</span><br/>
                où <b>A</b> = affaiblissement (dB), <b>F</b> = fréquence (MHz), <b>D</b> = distance (km)
              </div>
              <div>
                <b>2. Bilan de liaison :</b><br/>
                <span className="font-mono">Bilan = P<sub>ém</sub> + G<sub>Tx</sub> + G<sub>Rx</sub> - A - Pertes</span><br/>
                où <b>P<sub>ém</sub></b> = puissance émission (dBm), <b>G<sub>Tx</sub></b> = gain antenne émission (dBi), <b>G<sub>Rx</sub></b> = gain antenne réception (dBi), <b>Pertes</b> = pertes diverses (dB)
              </div>
              <div>
                <b>3. Puissance de réception :</b><br/>
                <span className="font-mono">P<sub>Rx</sub> = P<sub>ém</sub> + G<sub>Tx</sub> - A - Pertes + G<sub>Rx</sub></span><br/>
                Puissance reçue par l'antenne de réception
              </div>
              <div>
                <b>4. Marge de liaison :</b><br/>
                <span className="font-mono">Marge = P<sub>Rx</sub> - Seuil</span><br/>
                où <b>Seuil</b> = sensibilité du récepteur (dBm)
              </div>
              <div>
                <b>5. Rapport Signal/Bruit :</b><br/>
                <span className="font-mono">S/B = P<sub>Rx</sub> - Seuil</span><br/>
                Indicateur de qualité de la liaison
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-blue-200">
              <b>Seuils de marge :</b>
              <ul className="mt-1 space-y-1 text-xs">
                <li>• &lt; 0 dB : Liaison impossible</li>
                <li>• 0-3 dB : Marge insuffisante (danger)</li>
                <li>• 3-10 dB : Marge limite (attention)</li>
                <li>• 10-20 dB : Bonne marge</li>
                <li>• &gt; 20 dB : Excellente marge</li>
              </ul>
            </div>
          </div>
        )}
      </div>
      <div className="mb-6 p-4 rounded-xl bg-gray-100 shadow flex items-center gap-3">
        <span className="text-2xl">💡</span>
        <div className="text-sm text-gray-700"><strong>Recommandation :</strong> {recommandation}</div>
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow p-6 border border-blue-100">
          <h4 className="font-semibold mb-4 text-primary-dark">Paramètres de la liaison</h4>
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
          <h4 className="font-semibold mb-4 text-primary-dark">Répartition des gains et pertes</h4>
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
      <div className="mb-8 bg-white rounded-xl shadow p-6">
        <h4 className="font-semibold mb-4 text-primary-dark">Profil de liaison : Affaiblissement et marge en fonction de la distance</h4>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={profileData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="d" label={{ value: 'Distance (km)', position: 'insideBottomRight', offset: -5 }} />
            <YAxis yAxisId="left" label={{ value: 'Affaiblissement (dB)', angle: -90, position: 'insideLeft' }} />
            <YAxis yAxisId="right" orientation="right" label={{ value: 'Marge (dB)', angle: 90, position: 'insideRight' }} />
            <Tooltip />
            <Line yAxisId="left" type="monotone" dataKey="aff" stroke="#2563eb" strokeWidth={2} dot={false} name="Affaiblissement" />
            <Line yAxisId="right" type="monotone" dataKey="marge" stroke="#dc2626" strokeWidth={2} dot={false} name="Marge" />
          </LineChart>
        </ResponsiveContainer>
        <div className="mt-4 text-xs text-gray-600">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded"></div>
              <span>Affaiblissement en espace libre</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded"></div>
              <span>Marge de liaison</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HertzienResults; 