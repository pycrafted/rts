import React, { useState } from 'react';
import GSMResults from './GSMResults';
import InfoBulle from '../common/InfoBulle';
import Glossaire from '../common/Glossaire';

interface GSMFormValues {
  area: string;
  density: string;
  trafficPerUser: string;
  penetration: string;
  activity: string;
}

const initialValues: GSMFormValues = {
  area: '',
  density: '',
  trafficPerUser: '',
  penetration: '',
  activity: '',
};

const pedagogicHelp = {
  area: {
    short: "Superficie à couvrir. Plus elle est grande, plus il faudra de sites.",
    example: "Ex : 10 km² (petite ville), 100 km² (zone rurale)",
    why: "Permet de calculer la couverture nécessaire et le nombre de sites."
  },
  density: {
    short: "Nombre moyen d'habitants par km².",
    example: "Ex : 5000 (urbain), 100 (rural)",
    why: "Permet d'estimer le nombre total d'abonnés à desservir."
  },
  trafficPerUser: {
    short: "Trafic moyen généré par un abonné (en mErlang).",
    example: "Ex : 30 mErlang (usage modéré)",
    why: "Permet de dimensionner la capacité nécessaire."
  },
  penetration: {
    short: "Pourcentage de la population qui utilise le service.",
    example: "Ex : 80% (zone urbaine)",
    why: "Permet d'affiner le calcul du nombre d'abonnés réels."
  },
  activity: {
    short: "Facteur d'activité moyen des abonnés.",
    example: "Ex : 0.1 (10% du temps en communication)",
    why: "Affiner le calcul du trafic total."
  }
};

const exampleValues: GSMFormValues = {
  area: '10', // 10 km²
  density: '5000', // urbain
  trafficPerUser: '30', // mErlang
  penetration: '80', // %
  activity: '0.1', // 10%
};

const scenarioPresets: { [key: string]: { values: GSMFormValues; msg: string } } = {
  urbain: {
    values: { area: '10', density: '5000', trafficPerUser: '30', penetration: '80', activity: '0.1' },
    msg: "Scénario urbain : zone de 10 km², densité 5000 hab/km², trafic moyen 30 mErlang/abonné, taux de pénétration 80%, activité 10%. Nécessite de nombreux sites pour couvrir la forte densité."
  },
  rural: {
    values: { area: '100', density: '100', trafficPerUser: '20', penetration: '60', activity: '0.08' },
    msg: "Scénario rural : grande zone (100 km²), faible densité (100 hab/km²), trafic modéré 20 mErlang/abonné, taux de pénétration 60%, activité 8%. Moins de sites nécessaires, mais couverture plus difficile."
  },
  industriel: {
    values: { area: '5', density: '1000', trafficPerUser: '50', penetration: '90', activity: '0.15' },
    msg: "Scénario industriel : zone de 5 km², densité 1000 hab/km², trafic élevé 50 mErlang/abonné, taux de pénétration 90%, activité 15%. Forte sollicitation du réseau sur une petite zone."
  },
  campus: {
    values: { area: '2', density: '8000', trafficPerUser: '40', penetration: '95', activity: '0.12' },
    msg: "Scénario campus : petite zone (2 km²), très forte densité (8000 hab/km²), trafic élevé 40 mErlang/abonné, pénétration 95%, activité 12%. Cas typique d'université ou centre commercial."
  },
  autoroute: {
    values: { area: '50', density: '50', trafficPerUser: '25', penetration: '70', activity: '0.06' },
    msg: "Scénario autoroute : zone linéaire (50 km²), très faible densité (50 hab/km²), trafic modéré 25 mErlang/abonné, pénétration 70%, activité 6%. Couverture linéaire avec sites espacés."
  },
  aeroport: {
    values: { area: '8', density: '2000', trafficPerUser: '60', penetration: '85', activity: '0.18' },
    msg: "Scénario aéroport : zone de 8 km², densité 2000 hab/km², trafic très élevé 60 mErlang/abonné, pénétration 85%, activité 18%. Forte demande de capacité pour les voyageurs."
  },
  zone_touristique: {
    values: { area: '15', density: '300', trafficPerUser: '35', penetration: '75', activity: '0.14' },
    msg: "Scénario zone touristique : zone de 15 km², densité 300 hab/km², trafic moyen-élevé 35 mErlang/abonné, pénétration 75%, activité 14%. Variation saisonnière importante."
  },
  zone_residentielle: {
    values: { area: '20', density: '2500', trafficPerUser: '25', penetration: '85', activity: '0.09' },
    msg: "Scénario zone résidentielle : zone de 20 km², densité 2500 hab/km², trafic modéré 25 mErlang/abonné, pénétration 85%, activité 9%. Usage principalement en soirée."
  },
  centre_ville: {
    values: { area: '3', density: '12000', trafficPerUser: '45', penetration: '90', activity: '0.16' },
    msg: "Scénario centre-ville : zone très dense (3 km², 12000 hab/km²), trafic élevé 45 mErlang/abonné, pénétration 90%, activité 16%. Maximum de densité et de capacité."
  },
  zone_ruraux_avances: {
    values: { area: '200', density: '25', trafficPerUser: '15', penetration: '40', activity: '0.05' },
    msg: "Scénario zone rurale avancée : très grande zone (200 km²), densité très faible (25 hab/km²), trafic faible 15 mErlang/abonné, pénétration 40%, activité 5%. Défis de couverture."
  }
};

// Liste de termes pour le glossaire GSM
const termesGSM = [
  { id: 'trx', terme: 'TRX', definition: "Transceiver : unité radio permettant de gérer un certain nombre de communications simultanées.", unite: 'Erlangs', exemple: 'Un TRX GSM gère typiquement 2.2 Erlangs.' },
  { id: 'bts', terme: 'BTS', definition: "Base Transceiver Station : station de base GSM.", exemple: 'Un site BTS couvre une zone de quelques km².' },
  { id: 'cellule', terme: 'Cellule', definition: "Zone géographique couverte par une antenne ou un site radio.", unite: 'km²', exemple: 'Une cellule urbaine fait typiquement 2 km².' },
  { id: 'secteur', terme: 'Secteur', definition: "Subdivision d'une cellule, généralement couverte par une antenne orientée.", exemple: 'Un site tri-secteur couvre 3 directions.' },
  { id: 'erlang', terme: 'Erlang', definition: "Unité de trafic télécoms correspondant à une communication continue sur une heure.", unite: 'Erlang', exemple: '10 abonnés parlant 6 minutes chacun = 1 Erlang.' },
  { id: 'penet', terme: 'Taux de pénétration', definition: "Pourcentage d'utilisateurs équipés d'un service ou d'une technologie.", unite: '%', exemple: '80% de pénétration mobile en France.' },
  { id: 'gos', terme: 'GoS (Grade of Service)', definition: "Probabilité de blocage d'un appel en raison de la congestion du réseau.", unite: '%', exemple: 'Un GoS de 2% signifie 2% d\'appels bloqués.' },
  { id: 'erlang_b', terme: 'Formule d\'Erlang-B', definition: "Formule mathématique pour calculer la probabilité de blocage en fonction du trafic et du nombre de canaux.", exemple: 'Utilisée pour dimensionner les TRX selon la qualité de service souhaitée.' },
  { id: 'canal', terme: 'Canal', definition: "Ressource radio permettant une communication simultanée.", unite: 'canaux', exemple: 'Un TRX GSM gère 8 canaux simultanés.' },
  { id: 'efficacite_spectrale', terme: 'Efficacité spectrale', definition: "Nombre de bits transmis par seconde par Hz de bande passante.", unite: 'bits/s/Hz', exemple: 'L\'efficacité spectrale GSM est d\'environ 0.8 bits/s/Hz.' },
  { id: 'facteur_securite', terme: 'Facteur de sécurité', definition: "Marge ajoutée au trafic calculé pour tenir compte des variations et pics de charge.", exemple: 'Un facteur de 1.2 ajoute 20% de marge au trafic.' },
  { id: 'densite_trafic', terme: 'Densité de trafic', definition: "Trafic total divisé par la surface de la zone de couverture.", unite: 'Erlangs/km²', exemple: 'Une densité de 0.5 E/km² indique un trafic modéré.' },
  { id: 'charge_site', terme: 'Charge par site', definition: "Trafic moyen supporté par chaque site BTS.", unite: 'Erlangs/site', exemple: 'Une charge de 3 E/site est typique en zone urbaine.' },
  { id: 'marginal', terme: 'mErlang', definition: "Milli-Erlang : unité de trafic égale à 1/1000 d'Erlang.", unite: 'mErlang', exemple: '30 mErlang = 0.03 Erlang.' },
  { id: 'activite', terme: 'Facteur d\'activité', definition: "Pourcentage du temps où un abonné est en communication.", unite: 'sans unité', exemple: '0.1 signifie 10% du temps en communication.' },
  { id: 'couverture_site', terme: 'Couverture par site', definition: "Surface géographique couverte par un site BTS selon le type de zone.", unite: 'km²', exemple: '2 km² en urbain, 15 km² en rural.' },
  { id: 'capacite_spectrale', terme: 'Capacité spectrale', definition: "Nombre de canaux effectifs après application de l'efficacité spectrale.", unite: 'canaux', exemple: 'Capacité réelle disponible pour les communications.' },
  { id: 'planification_frequence', terme: 'Planification de fréquences', definition: "Répartition des canaux radio pour éviter les interférences entre cellules adjacentes.", exemple: 'Utilise des motifs de réutilisation de fréquences.' },
  { id: 'handover', terme: 'Handover', definition: "Transfert d'une communication d'une cellule à une autre lors du déplacement de l'utilisateur.", exemple: 'Permet la continuité de service en mobilité.' },
  { id: 'puissance_emission', terme: 'Puissance d\'émission', definition: "Puissance radio émise par l'antenne BTS pour assurer la couverture.", unite: 'W', exemple: 'Typiquement 20-40W par secteur.' }
];

const GSMForm: React.FC<{ onSubmit?: (values: GSMFormValues) => void }> = ({ onSubmit }) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState<Partial<GSMFormValues>>({});
  const [showResults, setShowResults] = useState(false);
  const [exampleMsg, setExampleMsg] = useState<string | null>(null);
  const [scenario, setScenario] = useState('');
  const [showGlossaire, setShowGlossaire] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const getDynamicComment = (field: keyof GSMFormValues) => {
    const v = values[field];
    if (!v) return pedagogicHelp[field].short + ' ' + pedagogicHelp[field].example;
    const num = Number(v);
    if (isNaN(num)) return "Veuillez entrer une valeur numérique.";
    
    // Exemples de feedback pédagogique amélioré
    if (field === 'density') {
      if (num < 100) return "Zone rurale ou très peu dense. Couverture par site : ~15 km².";
      if (num < 500) return "Zone périurbaine ou rurale avancée. Couverture par site : ~10 km².";
      if (num < 2000) return "Zone suburbaine. Couverture par site : ~5 km².";
      if (num < 5000) return "Zone urbaine. Couverture par site : ~3 km².";
      if (num < 10000) return "Zone urbaine dense. Couverture par site : ~2 km².";
      return "Zone très dense (centre-ville). Couverture par site : ~1.5 km².";
    }
    
    if (field === 'area') {
      if (num < 2) return "Très petite zone (campus, site industriel).";
      if (num < 10) return "Petite zone (quartier, village).";
      if (num < 50) return "Zone moyenne (ville moyenne).";
      if (num < 200) return "Grande zone (agglomération).";
      return "Très grande zone (région, département).";
    }
    
    if (field === 'penetration') {
      if (num < 30) return "Pénétration faible (zone peu équipée ou en développement).";
      if (num < 60) return "Pénétration modérée (zone en développement).";
      if (num < 80) return "Pénétration bonne (zone mature).";
      if (num < 95) return "Pénétration élevée (zone très équipée).";
      return "Pénétration très élevée (zone saturée).";
    }
    
    if (field === 'trafficPerUser') {
      if (num < 15) return "Trafic faible par abonné (usage basique).";
      if (num < 30) return "Trafic modéré par abonné (usage standard).";
      if (num < 50) return "Trafic élevé par abonné (usage intensif).";
      return "Trafic très élevé par abonné (usage professionnel).";
    }
    
    if (field === 'activity') {
      if (num < 0.05) return "Activité très faible (zone résidentielle calme).";
      if (num < 0.1) return "Activité faible (zone résidentielle).";
      if (num < 0.15) return "Activité modérée (zone mixte).";
      if (num < 0.2) return "Activité élevée (zone commerciale/industrielle).";
      return "Activité très élevée (zone très active).";
    }
    
    return '';
  };

  const validate = () => {
    const newErrors: Partial<GSMFormValues> = {};
    
    // Validation de la zone
    if (!values.area || isNaN(Number(values.area))) {
      newErrors.area = 'Zone invalide';
    } else if (Number(values.area) <= 0) {
      newErrors.area = 'La zone doit être positive';
    } else if (Number(values.area) > 1000) {
      newErrors.area = 'Zone trop importante (> 1000 km²)';
    }
    
    // Validation de la densité
    if (!values.density || isNaN(Number(values.density))) {
      newErrors.density = 'Densité invalide';
    } else if (Number(values.density) <= 0) {
      newErrors.density = 'La densité doit être positive';
    } else if (Number(values.density) > 20000) {
      newErrors.density = 'Densité trop élevée (> 20000 hab/km²)';
    }
    
    // Validation du trafic par abonné
    if (!values.trafficPerUser || isNaN(Number(values.trafficPerUser))) {
      newErrors.trafficPerUser = 'Trafic invalide';
    } else if (Number(values.trafficPerUser) <= 0) {
      newErrors.trafficPerUser = 'Le trafic doit être positif';
    } else if (Number(values.trafficPerUser) > 100) {
      newErrors.trafficPerUser = 'Trafic trop élevé (> 100 mErlang)';
    }
    
    // Validation du taux de pénétration
    if (!values.penetration || isNaN(Number(values.penetration))) {
      newErrors.penetration = 'Pénétration invalide';
    } else if (Number(values.penetration) <= 0) {
      newErrors.penetration = 'La pénétration doit être positive';
    } else if (Number(values.penetration) > 100) {
      newErrors.penetration = 'La pénétration ne peut dépasser 100%';
    }
    
    // Validation du facteur d'activité
    if (!values.activity || isNaN(Number(values.activity))) {
      newErrors.activity = 'Activité invalide';
    } else if (Number(values.activity) <= 0) {
      newErrors.activity = 'L\'activité doit être positive';
    } else if (Number(values.activity) > 1) {
      newErrors.activity = 'L\'activité ne peut dépasser 1 (100%)';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      setShowResults(true);
      onSubmit?.(values);
    }
  };

  const handleFillExample = (e: React.MouseEvent) => {
    e.preventDefault();
    setValues(exampleValues);
    setExampleMsg("Exemple : zone urbaine de 10 km², densité 5000 hab/km², trafic moyen 30 mErlang/abonné, taux de pénétration 80%, activité 10%. Cas typique de planification GSM en ville.");
    setShowResults(false);
  };

  const handleScenarioChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setScenario(val);
    if (scenarioPresets[val]) {
      setValues(scenarioPresets[val].values);
      setExampleMsg(scenarioPresets[val].msg);
      setShowResults(false);
    }
  };

  return (
    <>
      <Glossaire open={showGlossaire} onClose={() => setShowGlossaire(false)} focusId={undefined} termes={termesGSM} />
      <form onSubmit={handleSubmit} className="max-w-6xl mx-auto bg-white p-8 rounded-2xl shadow-lg space-y-6 mt-8 border border-blue-100">
        <div className="flex justify-end mb-2">
          <button type="button" onClick={() => setShowGlossaire(true)} className="flex items-center gap-2 text-blue-700 bg-blue-100 hover:bg-blue-200 px-4 py-2 rounded-lg text-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-primary-light">
            <span role="img" aria-label="Glossaire">📖</span> Glossaire
          </button>
        </div>
        <h2 className="text-2xl font-bold text-primary-dark mb-2">Dimensionnement GSM</h2>
        <div className="mb-4">
          <label htmlFor="scenario" className="block text-sm font-semibold mb-1 text-gray-700 flex items-center gap-1 group cursor-pointer">
            Scénario prédéfini
            <InfoBulle content={"Choisissez un scénario pour pré-remplir les champs avec des valeurs types."} className="group-hover:underline group-hover:text-primary-dark" />
          </label>
          <select id="scenario" value={scenario} onChange={handleScenarioChange} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-light focus:border-primary outline-none">
            <option value="">Choisir un scénario</option>
            <option value="urbain">Zone urbaine</option>
            <option value="rural">Zone rurale</option>
            <option value="industriel">Zone industrielle</option>
            <option value="campus">Zone campus</option>
            <option value="autoroute">Zone autoroute</option>
            <option value="aeroport">Zone aéroport</option>
            <option value="zone_touristique">Zone touristique</option>
            <option value="zone_residentielle">Zone résidentielle</option>
            <option value="centre_ville">Centre-ville</option>
            <option value="zone_ruraux_avances">Zone rurale avancée</option>
          </select>
        </div>
        <button onClick={handleFillExample} className="mb-2 bg-success-light text-success-dark px-4 py-2 rounded-lg text-sm font-semibold hover:bg-success transition-colors w-full focus:outline-none focus:ring-2 focus:ring-success-light flex items-center gap-2">
          <span role="img" aria-label="Exemple">✨</span> Remplir avec un exemple
        </button>
        {exampleMsg && <div className="mb-2 text-xs text-success-dark bg-success-light/40 rounded px-3 py-2">{exampleMsg}</div>}
        
        {/* Grille de champs de saisie */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Zone de couverture */}
          <div className="space-y-1">
            <label htmlFor="area" className="block text-sm font-medium text-gray-700 flex items-center gap-1 group cursor-pointer">
              Zone de couverture (km²)
              <InfoBulle content={pedagogicHelp.area.why + ' ' + pedagogicHelp.area.example} className="group-hover:underline group-hover:text-primary-dark" />
            </label>
            <input
              id="area"
              type="number"
              name="area"
              value={values.area}
              onChange={handleChange}
              aria-invalid={!!errors.area}
              className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-colors ${errors.area ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
              placeholder="Ex : 10"
            />
            {errors.area && <span className="text-red-600 text-xs flex items-center gap-1"><span role="img" aria-label="Erreur">⚠️</span>{errors.area}</span>}
            <div className="text-xs text-gray-500">{getDynamicComment('area')}</div>
          </div>
          
          {/* Densité de population */}
          <div className="space-y-1">
            <label htmlFor="density" className="block text-sm font-medium text-gray-700 flex items-center gap-1 group cursor-pointer">
              Densité de population (hab/km²)
              <InfoBulle content={pedagogicHelp.density.why + ' ' + pedagogicHelp.density.example} className="group-hover:underline group-hover:text-primary-dark" />
            </label>
            <input
              id="density"
              type="number"
              name="density"
              value={values.density}
              onChange={handleChange}
              aria-invalid={!!errors.density}
              className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-colors ${errors.density ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
              placeholder="Ex : 5000"
            />
            {errors.density && <span className="text-red-600 text-xs flex items-center gap-1"><span role="img" aria-label="Erreur">⚠️</span>{errors.density}</span>}
            <div className="text-xs text-gray-500">{getDynamicComment('density')}</div>
          </div>
          
          {/* Trafic par abonné */}
          <div className="space-y-1">
            <label htmlFor="trafficPerUser" className="block text-sm font-medium text-gray-700 flex items-center gap-1 group cursor-pointer">
              Trafic par abonné (mErlang)
              <InfoBulle content={pedagogicHelp.trafficPerUser.why + ' ' + pedagogicHelp.trafficPerUser.example} className="group-hover:underline group-hover:text-primary-dark" />
            </label>
            <input
              id="trafficPerUser"
              type="number"
              name="trafficPerUser"
              value={values.trafficPerUser}
              onChange={handleChange}
              aria-invalid={!!errors.trafficPerUser}
              className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-colors ${errors.trafficPerUser ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
              placeholder="Ex : 30"
            />
            {errors.trafficPerUser && <span className="text-red-600 text-xs flex items-center gap-1"><span role="img" aria-label="Erreur">⚠️</span>{errors.trafficPerUser}</span>}
            <div className="text-xs text-gray-500">{getDynamicComment('trafficPerUser')}</div>
          </div>
          
          {/* Taux de pénétration */}
          <div className="space-y-1">
            <label htmlFor="penetration" className="block text-sm font-medium text-gray-700 flex items-center gap-1 group cursor-pointer">
              Taux de pénétration (%)
              <InfoBulle content={pedagogicHelp.penetration.why + ' ' + pedagogicHelp.penetration.example} className="group-hover:underline group-hover:text-primary-dark" />
            </label>
            <input
              id="penetration"
              type="number"
              name="penetration"
              value={values.penetration}
              onChange={handleChange}
              aria-invalid={!!errors.penetration}
              className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-colors ${errors.penetration ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
              placeholder="Ex : 80"
            />
            {errors.penetration && <span className="text-red-600 text-xs flex items-center gap-1"><span role="img" aria-label="Erreur">⚠️</span>{errors.penetration}</span>}
            <div className="text-xs text-gray-500">{getDynamicComment('penetration')}</div>
          </div>
          
          {/* Facteur d'activité */}
          <div className="space-y-1 md:col-span-2">
            <label htmlFor="activity" className="block text-sm font-medium text-gray-700 flex items-center gap-1 group cursor-pointer">
              Facteur d'activité
              <InfoBulle content={pedagogicHelp.activity.why + ' ' + pedagogicHelp.activity.example} className="group-hover:underline group-hover:text-primary-dark" />
            </label>
            <input
              id="activity"
              type="number"
              name="activity"
              value={values.activity}
              onChange={handleChange}
              aria-invalid={!!errors.activity}
              className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-colors ${errors.activity ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
              placeholder="Ex : 0.1"
            />
            {errors.activity && <span className="text-red-600 text-xs flex items-center gap-1"><span role="img" aria-label="Erreur">⚠️</span>{errors.activity}</span>}
            <div className="text-xs text-gray-500">{getDynamicComment('activity')}</div>
          </div>
        </div>
        
        <button type="submit" className="w-full bg-primary text-white px-4 py-2 rounded-lg font-semibold text-lg mt-4 hover:bg-primary-dark transition-colors shadow focus:outline-none focus:ring-2 focus:ring-primary-light flex items-center gap-2">
          <span role="img" aria-label="Calculer">🧮</span> Calculer
        </button>
        {showResults && (
          <div className="mt-8">
            <GSMResults
              area={Number(values.area)}
              density={Number(values.density)}
              trafficPerUser={Number(values.trafficPerUser)}
              penetration={Number(values.penetration)}
              activity={Number(values.activity)}
            />
          </div>
        )}
      </form>
    </>
  );
};

export default GSMForm; 