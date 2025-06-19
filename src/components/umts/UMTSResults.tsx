import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface UMTSResultsProps {
  area: number;
  users: number;
  voice: number;
  data: number;
  video: number;
  load: number;
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

const UMTSResults: React.FC<UMTSResultsProps> = ({ area, users, voice, data, video, load }) => {
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

  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.text('Résultats du dimensionnement UMTS', 14, 16);
    autoTable(doc, {
      startY: 24,
      head: [['Paramètre', 'Valeur', 'Unité']],
      body: [
        ['Débit total voix', debitVoix.toLocaleString(), 'kbps'],
        ['Débit total data', debitData.toLocaleString(), 'kbps'],
        ['Débit total vidéo', debitVideo.toLocaleString(), 'kbps'],
        ['Débit total', debitTotal.toLocaleString(), 'kbps'],
        ['Débit avec sécurité', debitAvecSecurite.toLocaleString(), 'kbps'],
        ['Capacité par cellule', capaciteCellule.toLocaleString(), 'kbps'],
        ['Capacité utile par cellule', capaciteUtileCellule.toLocaleString(undefined, { maximumFractionDigits: 2 }), 'kbps'],
        ['Nombre de cellules', nbCellules.toString(), 'cellules'],
        ['Nombre de NodeB', nbNodeB.toString(), 'NodeB'],
        ['Densité utilisateurs', densiteUtilisateurs.toLocaleString(undefined, { maximumFractionDigits: 1 }), 'utilisateurs/km²'],
        ['Charge par cellule', chargeParCellule.toLocaleString(undefined, { maximumFractionDigits: 2 }), 'kbps/cellule'],
        ['Couverture par NodeB', couvertureParNodeB.toLocaleString(undefined, { maximumFractionDigits: 1 }), 'km²'],
        ['Type de zone', typeZone, ''],
        ['Qualité de service (GoS)', gos.toLocaleString(undefined, { maximumFractionDigits: 2 }), '%'],
      ],
    });
    doc.save('resultats_umts.pdf');
  };

  const handleSave = () => {
    const history = JSON.parse(localStorage.getItem('umts_history') || '[]');
    history.unshift({
      date: new Date().toISOString(),
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
    alert('Résultat UMTS sauvegardé !');
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
    <div className="mt-8 w-full">
      <h3 className="text-xl font-bold mb-6 text-primary-dark">Résultats du dimensionnement UMTS</h3>
      
      {/* Métriques principales */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-blue-50 rounded-xl shadow p-5 flex flex-col items-center hover:shadow-lg transition-shadow border border-blue-200">
          <span className="text-2xl font-bold text-primary mb-1">{debitTotal.toLocaleString()}</span>
          <span className="text-gray-700 text-sm font-medium text-center">Débit total (kbps)</span>
        </div>
        <div className="bg-green-50 rounded-xl shadow p-5 flex flex-col items-center hover:shadow-lg transition-shadow border border-green-200">
          <span className="text-2xl font-bold text-green-700 mb-1">{nbCellules}</span>
          <span className="text-gray-700 text-sm font-medium text-center">Nombre de cellules</span>
        </div>
        <div className="bg-yellow-50 rounded-xl shadow p-5 flex flex-col items-center hover:shadow-lg transition-shadow border border-yellow-200">
          <span className="text-2xl font-bold text-yellow-600 mb-1">{nbNodeB}</span>
          <span className="text-gray-700 text-sm font-medium text-center">Nombre de NodeB</span>
        </div>
        <div className="bg-purple-50 rounded-xl shadow p-5 flex flex-col items-center hover:shadow-lg transition-shadow border border-purple-200">
          <span className="text-2xl font-bold text-purple-700 mb-1">{capaciteUtileCellule.toFixed(0)}</span>
          <span className="text-gray-700 text-sm font-medium text-center">Capacité utile/cellule (kbps)</span>
        </div>
      </div>

      {/* Métriques secondaires */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
        <div className="bg-orange-50 rounded-xl shadow p-4 border border-orange-200">
          <div className="text-lg font-bold text-orange-700 mb-1">{debitVoix.toLocaleString()}</div>
          <div className="text-gray-700 text-sm">Débit voix (kbps)</div>
        </div>
        <div className="bg-indigo-50 rounded-xl shadow p-4 border border-indigo-200">
          <div className="text-lg font-bold text-indigo-700 mb-1">{debitData.toLocaleString()}</div>
          <div className="text-gray-700 text-sm">Débit data (kbps)</div>
        </div>
        <div className="bg-red-50 rounded-xl shadow p-4 border border-red-200">
          <div className="text-lg font-bold text-red-700 mb-1">{debitVideo.toLocaleString()}</div>
          <div className="text-gray-700 text-sm">Débit vidéo (kbps)</div>
        </div>
        <div className="bg-teal-50 rounded-xl shadow p-4 border border-teal-200">
          <div className="text-lg font-bold text-teal-700 mb-1">{densiteUtilisateurs.toFixed(1)}</div>
          <div className="text-gray-700 text-sm">Densité (util/km²)</div>
        </div>
        <div className="bg-pink-50 rounded-xl shadow p-4 border border-pink-200">
          <div className="text-lg font-bold text-pink-700 mb-1">{chargeParCellule.toFixed(0)}</div>
          <div className="text-gray-700 text-sm">Charge/cellule (kbps)</div>
        </div>
        <div className="bg-cyan-50 rounded-xl shadow p-4 border border-cyan-200">
          <div className="text-lg font-bold text-cyan-700 mb-1">{gos.toFixed(1)}%</div>
          <div className="text-gray-700 text-sm">GoS (Grade of Service)</div>
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
      <div className="flex flex-wrap gap-3 mb-6">
        <button
          onClick={() => setShowFormula((v) => !v)}
          className="bg-blue-100 text-blue-800 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-200 transition-colors flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-primary-light"
        >
          <span role="img" aria-label="Formule">🧮</span>
          {showFormula ? 'Masquer les formules' : 'Voir les formules'}
        </button>
        <button
          onClick={handleExportPDF}
          className="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-green-400"
        >
          <span role="img" aria-label="PDF">📄</span> Exporter en PDF
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
            <h5 className="font-bold text-blue-800 mb-2">Formules de dimensionnement UMTS :</h5>
            <div className="space-y-2">
              <div><b>Débit total :</b> <span className="font-mono">D<sub>total</sub> = N × (D<sub>voix</sub> + D<sub>data</sub> + D<sub>vidéo</sub>)</span></div>
              <div><b>Débit avec sécurité :</b> <span className="font-mono">D&apos; = D<sub>total</sub> × F<sub>s</sub></span></div>
              <div><b>Capacité utile par cellule :</b> <span className="font-mono">C<sub>utile</sub> = C<sub>cellule</sub> × F<sub>charge</sub> × E<sub>spectrale</sub></span></div>
              <div><b>Nombre de cellules :</b> <span className="font-mono">N<sub>cellules</sub> = ⌈D&apos; / C<sub>utile</sub>⌉</span></div>
              <div><b>Nombre de NodeB :</b> <span className="font-mono">N<sub>NodeB</sub> = ⌈N<sub>cellules</sub> / 3⌉</span></div>
              <div><b>Grade of Service :</b> <span className="font-mono">GoS = (D<sub>total</sub> / (C<sub>utile</sub> × N<sub>cellules</sub>)) × 100</span></div>
            </div>
          </div>
          
          <div>
            <h5 className="font-bold text-blue-800 mb-2">Paramètres techniques :</h5>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>C<sub>urbain</sub> = {CAPACITE_CELLULE_URBAIN} kbps</div>
              <div>C<sub>rural</sub> = {CAPACITE_CELLULE_RURAL} kbps</div>
              <div>C<sub>indoor</sub> = {CAPACITE_CELLULE_INDOOR} kbps</div>
              <div>F<sub>s</sub> = {FACTEUR_DE_SECURITE}</div>
              <div>E<sub>spectrale</sub> = {EFFICIENCE_SPECTRALE * 100}%</div>
              <div>Secteurs/NodeB = {SECTEURS_PAR_NODEB}</div>
            </div>
          </div>
          
          <div>
            <h5 className="font-bold text-blue-800 mb-2">Type de zone détecté :</h5>
            <div className="text-xs space-y-1">
              <div>• <b>{typeZone.toUpperCase()}</b> : {densiteUtilisateurs.toFixed(1)} utilisateurs/km²</div>
              <div>• Capacité par cellule : {capaciteCellule.toLocaleString()} kbps</div>
              <div>• Couverture par cellule : {couvertureCellule} km²</div>
            </div>
          </div>
        </div>
      )}

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

      {/* Informations techniques */}
      <div className="text-xs text-gray-500 mt-2 bg-gray-50 rounded-xl shadow p-4 border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <div>Type de zone : {typeZone}</div>
          <div>Capacité par cellule : {capaciteCellule.toLocaleString()} kbps</div>
          <div>Facteur de sécurité : {FACTEUR_DE_SECURITE}</div>
          <div>Efficacité spectrale : {EFFICIENCE_SPECTRALE * 100}%</div>
          <div>Couverture par cellule : {couvertureCellule} km²</div>
          <div>Densité utilisateurs : {densiteUtilisateurs.toFixed(1)} util/km²</div>
        </div>
      </div>
    </div>
  );
};

export default UMTSResults; 