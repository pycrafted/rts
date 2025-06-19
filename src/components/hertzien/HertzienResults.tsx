import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface HertzienResultsProps {
  frequency: number; // GHz
  distance: number; // km
  power: number; // dBm
  gainTx: number; // dBi
  gainRx: number; // dBi
  losses: number; // dB
  threshold: number; // dBm
}

const HertzienResults: React.FC<HertzienResultsProps> = ({ frequency, distance, power, gainTx, gainRx, losses, threshold }) => {
  // Conversion de la fréquence en MHz pour la formule
  const freqMHz = frequency * 1000;
  
  // Calculs améliorés avec validations
  const affaiblissement = 32.4 + 20 * Math.log10(freqMHz) + 20 * Math.log10(distance);
  const bilan = power + gainTx + gainRx - affaiblissement - losses;
  const marge = bilan - threshold;
  
  // Calculs supplémentaires pour l'analyse
  const puissanceReception = power + gainTx - affaiblissement - losses + gainRx;
  const rapportSignalBruit = puissanceReception - threshold;
  const qualiteLiaison = rapportSignalBruit > 20 ? 'Excellente' : rapportSignalBruit > 10 ? 'Bonne' : rapportSignalBruit > 5 ? 'Moyenne' : 'Faible';

  // Indicateur couleur pour la marge avec seuils plus précis
  let margeColor = 'bg-green-500';
  let margeLabel = 'Excellente marge';
  let recommandation = "La liaison est très fiable avec une excellente marge de sécurité.";
  
  if (marge < 0) {
    margeColor = 'bg-red-500';
    margeLabel = 'Liaison impossible';
    recommandation = "CRITIQUE : La liaison ne peut pas fonctionner. Augmentez la puissance, les gains ou réduisez la distance/fréquence.";
  } else if (marge < 3) {
    margeColor = 'bg-red-400';
    margeLabel = 'Marge insuffisante';
    recommandation = "DANGER : La marge de liaison est insuffisante. Améliorez le gain, réduisez les pertes ou la distance.";
  } else if (marge < 10) {
    margeColor = 'bg-yellow-400';
    margeLabel = 'Marge limite';
    recommandation = "ATTENTION : La marge est limite. Un ajustement des paramètres est fortement conseillé.";
  } else if (marge < 20) {
    margeColor = 'bg-green-400';
    margeLabel = 'Bonne marge';
    recommandation = "La liaison est fiable avec une marge de sécurité correcte.";
  }

  // Générer des points pour le profil de liaison (distance de 1 à la distance saisie)
  const profileData = Array.from({ length: Math.max(2, Math.ceil(distance)) }, (_, i) => {
    const d = (i + 1) * (distance / Math.max(2, Math.ceil(distance)));
    const aff = 32.4 + 20 * Math.log10(freqMHz) + 20 * Math.log10(d);
    const bilanLocal = power + gainTx + gainRx - aff - losses;
    const margeLocal = bilanLocal - threshold;
    return { 
      d: d.toFixed(2), 
      aff: Number(aff.toFixed(2)),
      bilan: Number(bilanLocal.toFixed(2)),
      marge: Number(margeLocal.toFixed(2))
    };
  });

  const [showFormula, setShowFormula] = useState(false);

  const handleSave = () => {
    const entry = {
      date: new Date().toISOString(),
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
        <button
          onClick={() => setShowFormula((v) => !v)}
          className="bg-blue-100 text-blue-800 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-200 transition-colors flex items-center gap-2 mb-3 focus:outline-none focus:ring-2 focus:ring-primary-light"
        >
          <span role="img" aria-label="Formule">🧮</span>
          {showFormula ? 'Masquer la formule' : 'Voir la formule'}
        </button>
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
      <div className="mb-8 bg-white rounded-xl shadow p-6">
        <h4 className="font-semibold mb-2 text-primary-dark">Profil de liaison : Affaiblissement et marge en fonction de la distance</h4>
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
      <button
        onClick={handleSave}
        className="bg-primary text-white px-4 py-2 rounded-lg font-semibold hover:bg-primary-dark transition-colors flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-primary-light"
      >
        <span role="img" aria-label="Sauvegarder">💾</span> Sauvegarder
      </button>
    </div>
  );
};

export default HertzienResults; 