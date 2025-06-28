import React, { useState } from 'react';
import UMTSResults from './UMTSResults';
import InfoBulle from '../common/InfoBulle';
import Glossaire from '../common/Glossaire';

interface UMTSFormValues {
  area: string;
  users: string;
  voice: string;
  data: string;
  video: string;
  load: string;
}

const initialValues: UMTSFormValues = {
  area: '',
  users: '',
  voice: '',
  data: '',
  video: '',
  load: '',
};

const pedagogicHelp = {
  area: {
    short: "Zone totale à couvrir (en km²).",
    example: "Ex : 2 km² (quartier), 50 km² (ville)",
    why: "La taille de la zone influence le nombre de cellules nécessaires."
  },
  users: {
    short: "Nombre total d'utilisateurs à desservir.",
    example: "Ex : 500 (petite zone), 10000 (grande ville)",
    why: "Permet de dimensionner la capacité du réseau."
  },
  voice: {
    short: "Débit voix par utilisateur (en kbps).",
    example: "Ex : 12.2 kbps (AMR), 8 kbps (codec bas débit)",
    why: "Le débit voix impacte la bande passante nécessaire."
  },
  data: {
    short: "Débit data par utilisateur (en kbps).",
    example: "Ex : 64 kbps (browsing), 384 kbps (3G max)",
    why: "Le débit data détermine la capacité requise pour l'accès Internet."
  },
  video: {
    short: "Débit vidéo par utilisateur (en kbps).",
    example: "Ex : 128 kbps (basse qualité), 512 kbps (bonne qualité)",
    why: "Le débit vidéo est important pour les services multimédias."
  },
  load: {
    short: "Facteur de charge du réseau (en %).",
    example: "Ex : 60% (valeur courante)",
    why: "Permet de ne pas saturer le réseau et d'assurer la qualité de service."
  }
};

const exampleValues: UMTSFormValues = {
  area: '10', // 10 km²
  users: '2000',
  voice: '12.2', // kbps (AMR)
  data: '128', // kbps
  video: '256', // kbps
  load: '60', // %
};

const scenarioPresets: { [key: string]: { values: UMTSFormValues; msg: string } } = {
  urbain: {
    values: { area: '10', users: '2000', voice: '12.2', data: '128', video: '256', load: '60' },
    msg: "Scénario urbain : 10 km², 2000 utilisateurs, débits standards (voix 12.2 kbps, data 128 kbps, vidéo 256 kbps, facteur de charge 60%). Cas typique de planification 3G en ville."
  },
  rural: {
    values: { area: '50', users: '500', voice: '8', data: '64', video: '128', load: '50' },
    msg: "Scénario rural : 50 km², 500 utilisateurs, débits plus faibles (voix 8 kbps, data 64 kbps, vidéo 128 kbps), facteur de charge 50%. Moins de cellules nécessaires, mais couverture plus difficile."
  },
  campus: {
    values: { area: '2', users: '1000', voice: '12.2', data: '384', video: '512', load: '70' },
    msg: "Scénario campus : 2 km², 1000 utilisateurs, débits élevés (data 384 kbps, vidéo 512 kbps), facteur de charge 70%. Forte sollicitation sur une petite zone."
  },
  centre_ville: {
    values: { area: '5', users: '3000', voice: '12.2', data: '256', video: '384', load: '75' },
    msg: "Scénario centre-ville : 5 km², 3000 utilisateurs, débits élevés, facteur de charge 75%. Densité très élevée, forte demande de capacité."
  },
  zone_residentielle: {
    values: { area: '15', users: '1500', voice: '12.2', data: '96', video: '192', load: '55' },
    msg: "Scénario zone résidentielle : 15 km², 1500 utilisateurs, débits modérés, facteur de charge 55%. Usage principalement en soirée."
  },
  zone_industrielle: {
    values: { area: '8', users: '800', voice: '12.2', data: '192', video: '256', load: '65' },
    msg: "Scénario zone industrielle : 8 km², 800 utilisateurs, débits moyens-élevés, facteur de charge 65%. Usage professionnel et industriel."
  },
  aeroport: {
    values: { area: '3', users: '2000', voice: '12.2', data: '256', video: '384', load: '80' },
    msg: "Scénario aéroport : 3 km², 2000 utilisateurs, débits élevés, facteur de charge 80%. Forte demande de capacité pour les voyageurs."
  },
  zone_touristique: {
    values: { area: '20', users: '1200', voice: '12.2', data: '192', video: '256', load: '70' },
    msg: "Scénario zone touristique : 20 km², 1200 utilisateurs, débits moyens-élevés, facteur de charge 70%. Variation saisonnière importante."
  },
  autoroute: {
    values: { area: '30', users: '600', voice: '12.2', data: '128', video: '192', load: '45' },
    msg: "Scénario autoroute : 30 km², 600 utilisateurs, débits modérés, facteur de charge 45%. Couverture linéaire avec sites espacés."
  },
  zone_ruraux_avances: {
    values: { area: '100', users: '300', voice: '8', data: '32', video: '64', load: '40' },
    msg: "Scénario zone rurale avancée : 100 km², 300 utilisateurs, débits faibles, facteur de charge 40%. Défis de couverture et de rentabilité."
  }
};

// Liste de termes pour le glossaire UMTS
const termesUMTS = [
  { id: 'nodeb', terme: 'NodeB', definition: "Station de base 3G (UMTS), équivalent du BTS en GSM.", exemple: 'Un NodeB dessert plusieurs secteurs/cellules.' },
  { id: 'cellule', terme: 'Cellule', definition: "Zone géographique couverte par une antenne ou un site radio.", unite: 'km²', exemple: 'Une cellule urbaine fait typiquement 1 km².' },
  { id: 'secteur', terme: 'Secteur', definition: "Subdivision d'une cellule, généralement couverte par une antenne orientée.", exemple: 'Un site tri-secteur couvre 3 directions.' },
  { id: 'erlang', terme: 'Erlang', definition: "Unité de trafic télécoms correspondant à une communication continue sur une heure.", unite: 'Erlang', exemple: '10 abonnés parlant 6 minutes chacun = 1 Erlang.' },
  { id: 'wcdma', terme: 'WCDMA', definition: "Wideband Code Division Multiple Access : technologie d'accès radio utilisée par l'UMTS.", exemple: 'La 3G utilise la modulation WCDMA.' },
  { id: 'gos', terme: 'GoS (Grade of Service)', definition: "Probabilité de blocage d'un appel en raison de la congestion du réseau.", unite: '%', exemple: 'Un GoS de 2% signifie 2% d\'appels bloqués.' },
  { id: 'facteur_charge', terme: 'Facteur de charge', definition: "Pourcentage de la capacité maximale utilisée par le réseau.", unite: '%', exemple: 'Un facteur de charge de 60% est typique en UMTS.' },
  { id: 'efficacite_spectrale', terme: 'Efficacité spectrale', definition: "Nombre de bits transmis par seconde par Hz de bande passante.", unite: 'bits/s/Hz', exemple: 'L\'efficacité spectrale WCDMA est d\'environ 0.75 bits/s/Hz.' },
  { id: 'facteur_securite', terme: 'Facteur de sécurité', definition: "Marge ajoutée au trafic calculé pour tenir compte des variations et pics de charge.", exemple: 'Un facteur de 1.3 ajoute 30% de marge au trafic.' },
  { id: 'densite_utilisateurs', terme: 'Densité d\'utilisateurs', definition: "Nombre d'utilisateurs par unité de surface.", unite: 'utilisateurs/km²', exemple: 'Une densité de 200 util/km² indique une zone urbaine.' },
  { id: 'charge_cellule', terme: 'Charge par cellule', definition: "Trafic moyen supporté par chaque cellule.", unite: 'kbps/cellule', exemple: 'Une charge de 1500 kbps/cellule est typique en zone urbaine.' },
  { id: 'couverture_cellule', terme: 'Couverture par cellule', definition: "Surface géographique couverte par une cellule selon le type de zone.", unite: 'km²', exemple: '1 km² en urbain, 5 km² en rural.' },
  { id: 'capacite_cellule', terme: 'Capacité par cellule', definition: "Débit maximal supporté par une cellule selon le type de zone.", unite: 'kbps', exemple: '2048 kbps en urbain, 5120 kbps en rural.' },
  { id: 'amr', terme: 'AMR (Adaptive Multi-Rate)', definition: "Codec voix adaptatif utilisé en UMTS pour optimiser la qualité selon les conditions radio.", exemple: 'AMR 12.2 kbps pour une qualité voix optimale.' },
  { id: 'hsdpa', terme: 'HSDPA', definition: "High Speed Downlink Packet Access : évolution UMTS pour augmenter les débits data.", exemple: 'HSDPA permet des débits jusqu\'à 14.4 Mbps.' },
  { id: 'hsupa', terme: 'HSUPA', definition: "High Speed Uplink Packet Access : évolution UMTS pour augmenter les débits montants.", exemple: 'HSUPA permet des débits montants jusqu\'à 5.76 Mbps.' },
  { id: 'soft_handover', terme: 'Soft Handover', definition: "Transfert progressif d'une communication entre cellules en UMTS.", exemple: 'Permet une meilleure continuité de service qu\'en GSM.' },
  { id: 'puissance_emission', terme: 'Puissance d\'émission', definition: "Puissance radio émise par l'antenne NodeB pour assurer la couverture.", unite: 'W', exemple: 'Typiquement 20-40W par secteur.' },
  { id: 'interference', terme: 'Interférences', definition: "Perturbations radio qui dégradent la qualité du signal UMTS.", exemple: 'Les interférences limitent la capacité du réseau.' },
  { id: 'planification_frequence', terme: 'Planification de fréquences', definition: "Répartition des canaux radio pour éviter les interférences entre cellules adjacentes.", exemple: 'Utilise des motifs de réutilisation de fréquences.' }
];

const UMTSForm: React.FC<{ onSubmit?: (values: UMTSFormValues) => void; onSave?: () => void }> = ({ onSubmit, onSave }) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState<Partial<UMTSFormValues>>({});
  const [showResults, setShowResults] = useState(false);
  const [exampleMsg, setExampleMsg] = useState<string | null>(null);
  const [scenario, setScenario] = useState('');
  const [showGlossaire, setShowGlossaire] = useState(false);
  const [glossaireFocus] = useState<string | undefined>(undefined);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const newErrors: Partial<UMTSFormValues> = {};
    
    // Validation de la zone
    if (!values.area || isNaN(Number(values.area))) {
      newErrors.area = 'Zone invalide';
    } else if (Number(values.area) <= 0) {
      newErrors.area = 'La zone doit être positive';
    } else if (Number(values.area) > 500) {
      newErrors.area = 'Zone trop importante (> 500 km²)';
    }
    
    // Validation du nombre d'utilisateurs
    if (!values.users || isNaN(Number(values.users))) {
      newErrors.users = 'Nombre d\'utilisateurs invalide';
    } else if (Number(values.users) <= 0) {
      newErrors.users = 'Le nombre d\'utilisateurs doit être positif';
    } else if (Number(values.users) > 50000) {
      newErrors.users = 'Nombre d\'utilisateurs trop élevé (> 50000)';
    }
    
    // Validation du débit voix
    if (!values.voice || isNaN(Number(values.voice))) {
      newErrors.voice = 'Débit voix invalide';
    } else if (Number(values.voice) <= 0) {
      newErrors.voice = 'Le débit voix doit être positif';
    } else if (Number(values.voice) > 20) {
      newErrors.voice = 'Débit voix trop élevé (> 20 kbps)';
    }
    
    // Validation du débit data
    if (!values.data || isNaN(Number(values.data))) {
      newErrors.data = 'Débit data invalide';
    } else if (Number(values.data) <= 0) {
      newErrors.data = 'Le débit data doit être positif';
    } else if (Number(values.data) > 2000) {
      newErrors.data = 'Débit data trop élevé (> 2000 kbps)';
    }
    
    // Validation du débit vidéo
    if (!values.video || isNaN(Number(values.video))) {
      newErrors.video = 'Débit vidéo invalide';
    } else if (Number(values.video) <= 0) {
      newErrors.video = 'Le débit vidéo doit être positif';
    } else if (Number(values.video) > 2000) {
      newErrors.video = 'Débit vidéo trop élevé (> 2000 kbps)';
    }
    
    // Validation du facteur de charge
    if (!values.load || isNaN(Number(values.load))) {
      newErrors.load = 'Facteur de charge invalide';
    } else if (Number(values.load) <= 0) {
      newErrors.load = 'Le facteur de charge doit être positif';
    } else if (Number(values.load) > 100) {
      newErrors.load = 'Le facteur de charge ne peut dépasser 100%';
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
    setExampleMsg("Exemple : zone urbaine de 10 km², 2000 utilisateurs, débits standards (voix 12.2 kbps, data 128 kbps, vidéo 256 kbps, facteur de charge 60%). Permet de simuler un cas courant de planification 3G.");
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
      <Glossaire open={showGlossaire} onClose={() => setShowGlossaire(false)} focusId={glossaireFocus} termes={termesUMTS} />
      <form onSubmit={handleSubmit} className="w-full bg-white p-8 rounded-2xl shadow-lg space-y-6">
        <div className="flex justify-end mb-2">
          <button type="button" onClick={() => setShowGlossaire(true)} className="flex items-center gap-2 text-blue-700 bg-blue-100 hover:bg-blue-200 px-4 py-2 rounded-lg text-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400">
            <span role="img" aria-label="Glossaire">📖</span> Glossaire
          </button>
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-semibold mb-1 text-gray-700 flex items-center gap-1 group cursor-pointer">
            Scénario prédéfini
            <InfoBulle content={"Choisissez un scénario pour pré-remplir les champs avec des valeurs types."} className="group-hover:underline group-hover:text-primary-dark" />
          </label>
          <select value={scenario} onChange={handleScenarioChange} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-light focus:border-primary outline-none">
            <option value="">Choisir un scénario</option>
            <option value="urbain">Zone urbaine</option>
            <option value="rural">Zone rurale</option>
            <option value="campus">Campus</option>
            <option value="centre_ville">Centre-ville</option>
            <option value="zone_residentielle">Zone résidentielle</option>
            <option value="zone_industrielle">Zone industrielle</option>
            <option value="aeroport">Aéroport</option>
            <option value="zone_touristique">Zone touristique</option>
            <option value="autoroute">Autoroute</option>
            <option value="zone_ruraux_avances">Zone rurale avancée</option>
          </select>
        </div>
        <button onClick={handleFillExample} className="w-full bg-green-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-600 transition-colors mb-4">
          ✨ Remplir avec un exemple
        </button>
        {exampleMsg && <div className="mb-4 text-sm text-green-700 bg-green-100 rounded px-3 py-2">{exampleMsg}</div>}
        
        {/* Grille de champs de saisie */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Zone à couvrir */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700 flex items-center gap-1 group cursor-pointer">
              Zone à couvrir (km²)
              <InfoBulle content={pedagogicHelp.area.why + ' ' + pedagogicHelp.area.example} className="group-hover:underline group-hover:text-primary-dark" />
            </label>
            <input
              type="number"
              name="area"
              value={values.area}
              onChange={handleChange}
              aria-invalid={!!errors.area}
              className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-colors ${errors.area ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
            />
            {errors.area && <span className="text-red-600 text-xs flex items-center gap-1"><span role="img" aria-label="Erreur">⚠️</span>{errors.area}</span>}
          </div>
          
          {/* Nombre d'utilisateurs */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700 flex items-center gap-1 group cursor-pointer">
              Nombre d'utilisateurs
              <InfoBulle content={pedagogicHelp.users.why + ' ' + pedagogicHelp.users.example} className="group-hover:underline group-hover:text-primary-dark" />
            </label>
            <input
              type="number"
              name="users"
              value={values.users}
              onChange={handleChange}
              aria-invalid={!!errors.users}
              className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-colors ${errors.users ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
            />
            {errors.users && <span className="text-red-600 text-xs flex items-center gap-1"><span role="img" aria-label="Erreur">⚠️</span>{errors.users}</span>}
          </div>
          
          {/* Débit voix */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700 flex items-center gap-1 group cursor-pointer">
              Débit voix par utilisateur (kbps)
              <InfoBulle content={pedagogicHelp.voice.why + ' ' + pedagogicHelp.voice.example} className="group-hover:underline group-hover:text-primary-dark" />
            </label>
            <input
              type="number"
              name="voice"
              value={values.voice}
              onChange={handleChange}
              aria-invalid={!!errors.voice}
              className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-colors ${errors.voice ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
            />
            {errors.voice && <span className="text-red-600 text-xs flex items-center gap-1"><span role="img" aria-label="Erreur">⚠️</span>{errors.voice}</span>}
          </div>
          
          {/* Débit data */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700 flex items-center gap-1 group cursor-pointer">
              Débit data par utilisateur (kbps)
              <InfoBulle content={pedagogicHelp.data.why + ' ' + pedagogicHelp.data.example} className="group-hover:underline group-hover:text-primary-dark" />
            </label>
            <input
              type="number"
              name="data"
              value={values.data}
              onChange={handleChange}
              aria-invalid={!!errors.data}
              className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-colors ${errors.data ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
            />
            {errors.data && <span className="text-red-600 text-xs flex items-center gap-1"><span role="img" aria-label="Erreur">⚠️</span>{errors.data}</span>}
          </div>
          
          {/* Débit vidéo */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700 flex items-center gap-1 group cursor-pointer">
              Débit vidéo par utilisateur (kbps)
              <InfoBulle content={pedagogicHelp.video.why + ' ' + pedagogicHelp.video.example} className="group-hover:underline group-hover:text-primary-dark" />
            </label>
            <input
              type="number"
              name="video"
              value={values.video}
              onChange={handleChange}
              aria-invalid={!!errors.video}
              className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-colors ${errors.video ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
            />
            {errors.video && <span className="text-red-600 text-xs flex items-center gap-1"><span role="img" aria-label="Erreur">⚠️</span>{errors.video}</span>}
          </div>
          
          {/* Facteur de charge */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700 flex items-center gap-1 group cursor-pointer">
              Facteur de charge (%)
              <InfoBulle content={pedagogicHelp.load.why + ' ' + pedagogicHelp.load.example} className="group-hover:underline group-hover:text-primary-dark" />
            </label>
            <input
              type="number"
              name="load"
              value={values.load}
              onChange={handleChange}
              aria-invalid={!!errors.load}
              className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-colors ${errors.load ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
            />
            {errors.load && <span className="text-red-600 text-xs flex items-center gap-1"><span role="img" aria-label="Erreur">⚠️</span>{errors.load}</span>}
          </div>
        </div>
        
        <button type="submit" className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold text-lg hover:bg-blue-700 transition-colors shadow">
          🧮 Calculer
        </button>
        {showResults && (
          <div className="mt-8">
            <UMTSResults
              area={Number(values.area)}
              users={Number(values.users)}
              voice={Number(values.voice)}
              data={Number(values.data)}
              video={Number(values.video)}
              load={Number(values.load)}
              onSave={onSave}
            />
          </div>
        )}
      </form>
    </>
  );
};

export default UMTSForm; 