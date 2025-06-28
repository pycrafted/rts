import React, { useState } from 'react';
import OptiqueResults from './OptiqueResults';
import InfoBulle from '../common/InfoBulle';
import Glossaire from '../common/Glossaire';

interface OptiqueFormValues {
  length: string;
  attenuation: string;
  splices: string;
  connectors: string;
  losses: string;
  power: string;
}

const initialValues: OptiqueFormValues = {
  length: '',
  attenuation: '',
  splices: '',
  connectors: '',
  losses: '',
  power: '',
};

const pedagogicHelp = {
  length: {
    short: "Longueur totale de la fibre optique (en km).",
    example: "Ex : 5 km (liaison locale), 100 km (liaison longue distance)",
    why: "La longueur influence directement l'atténuation totale du signal."
  },
  attenuation: {
    short: "Atténuation linéique de la fibre (en dB/km).",
    example: "Ex : 0.35 dB/km (monomode), 0.4 dB/km (multimode)",
    why: "Détermine la perte de signal par kilomètre de fibre."
  },
  splices: {
    short: "Nombre d'épissures sur la liaison.",
    example: "Ex : 2 (liaison courte), 20 (liaison longue)",
    why: "Chaque épissure ajoute environ 0.1 dB de perte."
  },
  connectors: {
    short: "Nombre de connecteurs sur la liaison.",
    example: "Ex : 2 (liaison simple), 6 (liaison complexe)",
    why: "Chaque connecteur ajoute environ 0.5 dB de perte."
  },
  losses: {
    short: "Pertes diverses non comptabilisées (en dB).",
    example: "Ex : 0.5 dB (pertes faibles), 2 dB (pertes élevées)",
    why: "Pertes additionnelles (courbures, vieillissement, etc.)."
  },
  power: {
    short: "Puissance d'émission de l'émetteur (en dBm).",
    example: "Ex : 0 dBm (standard), 3 dBm (haute puissance)",
    why: "Détermine la puissance initiale du signal optique."
  }
};

// Liste de termes pour le glossaire Optique
const termesOptique = [
  { id: 'fibre_monomode', terme: 'Fibre Monomode', definition: "Fibre optique permettant la propagation d'un seul mode de lumière.", exemple: 'Utilisée pour les longues distances (> 2 km).' },
  { id: 'fibre_multimode', terme: 'Fibre Multimode', definition: "Fibre optique permettant la propagation de plusieurs modes de lumière.", exemple: 'Utilisée pour les courtes distances (< 2 km).' },
  { id: 'atténuation', terme: 'Atténuation', definition: "Affaiblissement du signal optique lors de sa propagation.", unite: 'dB/km', exemple: '0.35 dB/km pour fibre monomode G.652.' },
  { id: 'épissure', terme: 'Épissure', definition: "Jonction permanente entre deux fibres optiques.", exemple: 'Perte typique de 0.1 dB par épissure.' },
  { id: 'connecteur', terme: 'Connecteur', definition: "Dispositif de connexion amovible entre fibres ou équipements.", exemple: 'Perte typique de 0.5 dB par connecteur.' },
  { id: 'dBm', terme: 'dBm', definition: "Décibel-milliwatt : unité de puissance optique exprimée en décibels par rapport à 1 mW.", unite: 'dBm', exemple: '0 dBm = 1 mW de puissance optique.' },
  { id: 'bilan_liaison', terme: 'Bilan de liaison', definition: "Calcul de la puissance reçue en tenant compte de toutes les pertes.", unite: 'dBm', exemple: 'Puissance émission - Atténuation totale = Puissance réception.' },
  { id: 'marge', terme: 'Marge', definition: "Différence entre la puissance reçue et le seuil de réception.", unite: 'dB', exemple: 'Marge positive = liaison fiable.' },
  { id: 'seuil_reception', terme: 'Seuil de réception', definition: "Puissance minimale nécessaire pour détecter le signal.", unite: 'dBm', exemple: '-30 dBm pour un récepteur standard.' },
  { id: 'fenetre_transmission', terme: 'Fenêtre de transmission', definition: "Longueurs d'onde où l'atténuation est minimale.", unite: 'nm', exemple: '1310 nm et 1550 nm pour fibre monomode.' },
  { id: 'dispersion', terme: 'Dispersion', definition: "Étalement temporel du signal lors de sa propagation.", exemple: 'Limite la bande passante sur les longues distances.' },
  { id: 'otdr', terme: 'OTDR', definition: "Optical Time Domain Reflectometer : instrument de mesure de la fibre.", exemple: 'Permet de localiser les défauts et mesurer l\'atténuation.' },
  { id: 'courbure', terme: 'Courbure', definition: "Déformation de la fibre causant des pertes supplémentaires.", exemple: 'Rayon minimum de courbure à respecter.' },
  { id: 'mode', terme: 'Mode', definition: "Chemin de propagation de la lumière dans la fibre.", exemple: 'Fibre monomode = 1 mode, multimode = plusieurs modes.' },
  { id: 'longueur_onde', terme: 'Longueur d\'onde', definition: "Distance entre deux crêtes consécutives de l'onde lumineuse.", unite: 'nm', exemple: '1310 nm et 1550 nm sont les plus utilisées.' }
];

// Scénarios prédéfinis pour différents types de liaisons optiques
const scenarioPresets: { [key: string]: { values: OptiqueFormValues; msg: string } } = {
  liaison_courte: {
    values: { length: '5', attenuation: '0.35', splices: '2', connectors: '2', losses: '0.5', power: '0' },
    msg: "Liaison courte : 5 km, fibre monomode G.652 (0.35 dB/km), 2 épissures (0.1 dB chacune), 2 connecteurs (0.5 dB chacun), pertes diverses 0.5 dB, puissance 0 dBm. Cas typique de liaison locale."
  },
  liaison_metropolitaine: {
    values: { length: '20', attenuation: '0.35', splices: '8', connectors: '2', losses: '1', power: '0' },
    msg: "Liaison métropolitaine : 20 km, fibre monomode G.652, 8 épissures (1 épissure tous les 2.5 km), 2 connecteurs, pertes diverses 1 dB, puissance 0 dBm. Cas typique de réseau métropolitain."
  },
  liaison_longue_distance: {
    values: { length: '80', attenuation: '0.22', splices: '20', connectors: '4', losses: '2', power: '3' },
    msg: "Liaison longue distance : 80 km, fibre monomode G.655 (0.22 dB/km), 20 épissures (1 tous les 4 km), 4 connecteurs, pertes diverses 2 dB, puissance 3 dBm. Cas typique de liaison inter-villes."
  },
  liaison_datacenter: {
    values: { length: '2', attenuation: '0.4', splices: '0', connectors: '4', losses: '0.2', power: '-5' },
    msg: "Liaison datacenter : 2 km, fibre multimode OM4 (0.4 dB/km), pas d'épissures, 4 connecteurs (0.5 dB chacun), pertes diverses 0.2 dB, puissance -5 dBm. Cas typique de connexion interne."
  },
  liaison_maritime: {
    values: { length: '100', attenuation: '0.15', splices: '20', connectors: '4', losses: '2', power: '5' },
    msg: "Liaison maritime : 100 km, fibre monomode G.654 sous-marine (0.15 dB/km), 20 épissures (1 tous les 5 km), 4 connecteurs, pertes diverses 2 dB, puissance 5 dBm. Segment typique de câble sous-marin avec répéteurs."
  },
  liaison_rurale: {
    values: { length: '50', attenuation: '0.35', splices: '15', connectors: '3', losses: '1.5', power: '1' },
    msg: "Liaison rurale : 50 km, fibre monomode G.652, 15 épissures (1 tous les 3.3 km), 3 connecteurs, pertes diverses 1.5 dB, puissance 1 dBm. Cas typique de desserte rurale."
  },
  liaison_urbaine_dense: {
    values: { length: '10', attenuation: '0.35', splices: '5', connectors: '3', losses: '0.8', power: '0' },
    msg: "Liaison urbaine dense : 10 km, fibre monomode G.652, 5 épissures (1 tous les 2 km), 3 connecteurs, pertes diverses 0.8 dB, puissance 0 dBm. Cas typique de réseau urbain dense."
  },
  liaison_industrielle: {
    values: { length: '15', attenuation: '0.35', splices: '10', connectors: '4', losses: '1.2', power: '2' },
    msg: "Liaison industrielle : 15 km, fibre monomode G.652 robuste, 10 épissures (1 tous les 1.5 km), 4 connecteurs, pertes diverses 1.2 dB, puissance 2 dBm. Cas typique d'environnement industriel."
  },
  liaison_campus: {
    values: { length: '3', attenuation: '0.4', splices: '1', connectors: '6', losses: '0.3', power: '-3' },
    msg: "Liaison campus : 3 km, fibre multimode OM4, 1 épissure, 6 connecteurs (0.5 dB chacun), pertes diverses 0.3 dB, puissance -3 dBm. Cas typique de réseau universitaire."
  },
  liaison_backbone: {
    values: { length: '100', attenuation: '0.22', splices: '25', connectors: '5', losses: '2.5', power: '4' },
    msg: "Liaison backbone : 100 km, fibre monomode G.655 haute performance, 25 épissures (1 tous les 4 km), 5 connecteurs, pertes diverses 2.5 dB, puissance 4 dBm. Cas typique de réseau principal."
  }
};

const OptiqueForm: React.FC = () => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState<Partial<OptiqueFormValues>>({});
  const [showResults, setShowResults] = useState(false);
  const [exampleMsg, setExampleMsg] = useState<string | null>(null);
  const [scenario, setScenario] = useState('');
  const [showGlossaire, setShowGlossaire] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const newErrors: Partial<OptiqueFormValues> = {};
    if (!values.length || isNaN(Number(values.length))) newErrors.length = 'Longueur invalide';
    if (!values.attenuation || isNaN(Number(values.attenuation))) newErrors.attenuation = 'Atténuation invalide';
    if (!values.splices || isNaN(Number(values.splices))) newErrors.splices = 'Nombre d\'épissures invalide';
    if (!values.connectors || isNaN(Number(values.connectors))) newErrors.connectors = 'Nombre de connecteurs invalide';
    if (!values.losses || isNaN(Number(values.losses))) newErrors.losses = 'Pertes invalides';
    if (!values.power || isNaN(Number(values.power))) newErrors.power = 'Puissance invalide';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      setShowResults(true);
    }
  };

  const handleFillExample = (e: React.MouseEvent) => {
    e.preventDefault();
    setValues({
      length: '20',
      attenuation: '0.35',
      splices: '8',
      connectors: '2',
      losses: '1',
      power: '0'
    });
    setExampleMsg("Exemple : fibre de 20 km, atténuation 0.35 dB/km, 8 épissures, 2 connecteurs, pertes diverses 1 dB, puissance émetteur 0 dBm.");
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
      <Glossaire open={showGlossaire} onClose={() => setShowGlossaire(false)} termes={termesOptique} />
      <div className="w-full bg-white p-6 rounded-lg shadow-lg">
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex justify-end mb-2">
            <button type="button" onClick={() => setShowGlossaire(true)} className="flex items-center gap-2 text-blue-700 bg-blue-100 hover:bg-blue-200 px-4 py-2 rounded-lg text-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400">
              <span role="img" aria-label="Glossaire">📖</span> Glossaire
            </button>
          </div>
          
          {/* Sélecteur de scénario */}
          <div>
            <label className="block text-sm font-semibold mb-1 text-gray-700 flex items-center gap-1 group cursor-pointer">
              Scénario prédéfini
              <InfoBulle content={"Choisissez un scénario pour pré-remplir les champs avec des valeurs types."} className="group-hover:underline group-hover:text-primary-dark" />
            </label>
            <select 
              value={scenario} 
              onChange={handleScenarioChange} 
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            >
              <option value="">Choisir un scénario</option>
              <option value="liaison_courte">Liaison courte</option>
              <option value="liaison_metropolitaine">Liaison métropolitaine</option>
              <option value="liaison_longue_distance">Liaison longue distance</option>
              <option value="liaison_datacenter">Liaison datacenter</option>
              <option value="liaison_maritime">Liaison maritime</option>
              <option value="liaison_rurale">Liaison rurale</option>
              <option value="liaison_urbaine_dense">Liaison urbaine dense</option>
              <option value="liaison_industrielle">Liaison industrielle</option>
              <option value="liaison_campus">Liaison campus</option>
              <option value="liaison_backbone">Liaison backbone</option>
            </select>
          </div>

          <button 
            onClick={handleFillExample} 
            className="w-full bg-green-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-600 transition-colors mb-4"
          >
            ✨ Remplir avec un exemple
          </button>
          
          {exampleMsg && (
            <div className="mb-4 text-sm text-green-700 bg-green-100 rounded px-3 py-2">
              {exampleMsg}
            </div>
          )}

          {/* Grille de champs de saisie */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Longueur de la liaison */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1 group cursor-pointer">
                Longueur de la liaison (km)
                <InfoBulle content={pedagogicHelp.length.why + ' ' + pedagogicHelp.length.example} className="group-hover:underline group-hover:text-primary-dark" />
              </label>
              <input
                type="number"
                name="length"
                value={values.length}
                onChange={handleChange}
                className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none ${
                  errors.length ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
              />
              {errors.length && <span className="text-red-600 text-xs">⚠️ {errors.length}</span>}
            </div>

            {/* Atténuation fibre */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1 group cursor-pointer">
                Atténuation fibre (dB/km)
                <InfoBulle content={pedagogicHelp.attenuation.why + ' ' + pedagogicHelp.attenuation.example} className="group-hover:underline group-hover:text-primary-dark" />
              </label>
              <input
                type="number"
                name="attenuation"
                value={values.attenuation}
                onChange={handleChange}
                className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none ${
                  errors.attenuation ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
              />
              {errors.attenuation && <span className="text-red-600 text-xs">⚠️ {errors.attenuation}</span>}
            </div>

            {/* Nombre d'épissures */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1 group cursor-pointer">
                Nombre d'épissures
                <InfoBulle content={pedagogicHelp.splices.why + ' ' + pedagogicHelp.splices.example} className="group-hover:underline group-hover:text-primary-dark" />
              </label>
              <input
                type="number"
                name="splices"
                value={values.splices}
                onChange={handleChange}
                className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none ${
                  errors.splices ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
              />
              {errors.splices && <span className="text-red-600 text-xs">⚠️ {errors.splices}</span>}
            </div>

            {/* Nombre de connecteurs */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1 group cursor-pointer">
                Nombre de connecteurs
                <InfoBulle content={pedagogicHelp.connectors.why + ' ' + pedagogicHelp.connectors.example} className="group-hover:underline group-hover:text-primary-dark" />
              </label>
              <input
                type="number"
                name="connectors"
                value={values.connectors}
                onChange={handleChange}
                className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none ${
                  errors.connectors ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
              />
              {errors.connectors && <span className="text-red-600 text-xs">⚠️ {errors.connectors}</span>}
            </div>

            {/* Pertes diverses */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1 group cursor-pointer">
                Pertes diverses (dB)
                <InfoBulle content={pedagogicHelp.losses.why + ' ' + pedagogicHelp.losses.example} className="group-hover:underline group-hover:text-primary-dark" />
              </label>
              <input
                type="number"
                name="losses"
                value={values.losses}
                onChange={handleChange}
                className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none ${
                  errors.losses ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
              />
              {errors.losses && <span className="text-red-600 text-xs">⚠️ {errors.losses}</span>}
            </div>

            {/* Puissance émetteur */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1 group cursor-pointer">
                Puissance émetteur (dBm)
                <InfoBulle content={pedagogicHelp.power.why + ' ' + pedagogicHelp.power.example} className="group-hover:underline group-hover:text-primary-dark" />
              </label>
              <input
                type="number"
                name="power"
                value={values.power}
                onChange={handleChange}
                className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none ${
                  errors.power ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
              />
              {errors.power && <span className="text-red-600 text-xs">⚠️ {errors.power}</span>}
            </div>
          </div>

          <button 
            type="submit" 
            className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold text-lg hover:bg-blue-700 transition-colors shadow"
          >
            🧮 Calculer
          </button>
        </form>

        {showResults && (
          <div className="mt-8">
            <OptiqueResults
              length={Number(values.length)}
              attenuation={Number(values.attenuation)}
              splices={Number(values.splices)}
              connectors={Number(values.connectors)}
              losses={Number(values.losses)}
              power={Number(values.power)}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default OptiqueForm; 