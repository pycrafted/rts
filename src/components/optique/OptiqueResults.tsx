import React, { useState } from 'react';

interface OptiqueResultsProps {
  length: number; // km
  attenuation: number; // dB/km
  splices: number;
  connectors: number;
  losses: number; // dB
  power: number; // dBm
}

const OptiqueResults: React.FC<OptiqueResultsProps> = ({ length, attenuation, splices, connectors, losses, power }) => {
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
    alert('Résultat optique sauvegardé !');
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
      <div className="mb-6">
        <button
          onClick={() => setShowFormula((v) => !v)}
          className="bg-blue-100 text-blue-800 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-200 transition-colors flex items-center gap-2 mb-3 focus:outline-none focus:ring-2 focus:ring-primary-light"
        >
          <span role="img" aria-label="Formule">🧮</span>
          {showFormula ? 'Masquer la formule' : 'Voir la formule'}
        </button>
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
      <div className="mb-6 p-4 rounded-xl bg-gray-100 shadow flex items-center gap-3">
        <span className="text-2xl">💡</span>
        <div className="text-sm text-gray-700"><strong>Recommandation :</strong> {recommandation}</div>
      </div>
      <button
        onClick={handleSave}
        className="bg-primary text-white px-4 py-2 rounded-lg font-semibold hover:bg-primary-dark transition-colors flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-primary-light"
      >
        <span role="img" aria-label="Sauvegarder">💾</span> Sauvegarder
      </button>
    </div>
  );
};

export default OptiqueResults; 