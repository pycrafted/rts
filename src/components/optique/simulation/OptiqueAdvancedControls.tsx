import React from 'react';

interface OptiqueAdvancedControlsProps {
  fiberType: 'monomode' | 'multimode';
  onFiberTypeChange: (type: 'monomode' | 'multimode') => void;
  wavelength: number;
  onWavelengthChange: (wavelength: number) => void;
  showCrossSection: boolean;
  onShowCrossSectionChange: (show: boolean) => void;
  temperature: number;
  onTemperatureChange: (temp: number) => void;
  dispersion: number;
  onDispersionChange: (disp: number) => void;
}

const OptiqueAdvancedControls: React.FC<OptiqueAdvancedControlsProps> = ({
  fiberType,
  onFiberTypeChange,
  wavelength,
  onWavelengthChange,
  showCrossSection,
  onShowCrossSectionChange,
  temperature,
  onTemperatureChange,
  dispersion,
  onDispersionChange,
}) => {
  return (
    <div className="space-y-6 p-4 bg-white rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">Paramètres Avancés</h3>

      {/* Type de fibre */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Type de Fibre
        </label>
        <select
          value={fiberType}
          onChange={(e) => onFiberTypeChange(e.target.value as 'monomode' | 'multimode')}
          className="w-full p-2 border rounded-md"
        >
          <option value="monomode">Monomode</option>
          <option value="multimode">Multimode</option>
        </select>
        <p className="text-sm text-gray-500 mt-1">
          {fiberType === 'monomode' 
            ? 'Fibre monomode : un seul mode de propagation, idéale pour les longues distances'
            : 'Fibre multimode : plusieurs modes de propagation, pour les courtes distances'}
        </p>
      </div>

      {/* Longueur d'onde */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Longueur d'onde (nm)
        </label>
        <input
          type="range"
          min="800"
          max="1600"
          step="10"
          value={wavelength}
          onChange={(e) => onWavelengthChange(Number(e.target.value))}
          className="w-full"
        />
        <div className="flex justify-between text-sm text-gray-500">
          <span>800 nm</span>
          <span>{wavelength} nm</span>
          <span>1600 nm</span>
        </div>
      </div>

      {/* Température */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Température (°C)
        </label>
        <input
          type="range"
          min="-40"
          max="85"
          step="1"
          value={temperature}
          onChange={(e) => onTemperatureChange(Number(e.target.value))}
          className="w-full"
        />
        <div className="flex justify-between text-sm text-gray-500">
          <span>-40°C</span>
          <span>{temperature}°C</span>
          <span>85°C</span>
        </div>
      </div>

      {/* Dispersion */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Dispersion (ps/nm/km)
        </label>
        <input
          type="range"
          min="-20"
          max="20"
          step="0.1"
          value={dispersion}
          onChange={(e) => onDispersionChange(Number(e.target.value))}
          className="w-full"
        />
        <div className="flex justify-between text-sm text-gray-500">
          <span>-20</span>
          <span>{dispersion}</span>
          <span>20</span>
        </div>
      </div>

      {/* Option de coupe transversale */}
      <div className="flex items-center">
        <input
          type="checkbox"
          id="showCrossSection"
          checked={showCrossSection}
          onChange={(e) => onShowCrossSectionChange(e.target.checked)}
          className="h-4 w-4 text-blue-600"
        />
        <label htmlFor="showCrossSection" className="ml-2 text-sm text-gray-700">
          Afficher la coupe transversale
        </label>
      </div>

      {/* Informations techniques */}
      <div className="mt-4 p-3 bg-blue-50 rounded-md">
        <h4 className="font-medium text-blue-800 mb-2">Informations Techniques</h4>
        <div className="text-sm text-blue-700 space-y-1">
          <p>• Atténuation : {calculateAttenuation(wavelength, temperature)} dB/km</p>
          <p>• Bande passante : {calculateBandwidth(fiberType, wavelength)} GHz</p>
          <p>• Perte de retour : {calculateReturnLoss(fiberType)} dB</p>
        </div>
      </div>
    </div>
  );
};

// Fonctions de calcul des paramètres techniques
const calculateAttenuation = (wavelength: number, temperature: number): number => {
  // Simulation simplifiée de l'atténuation
  const baseAttenuation = wavelength < 1310 ? 0.35 : 0.2;
  const tempFactor = 1 + (temperature - 20) * 0.001;
  return Number((baseAttenuation * tempFactor).toFixed(3));
};

const calculateBandwidth = (fiberType: string, wavelength: number): number => {
  // Simulation simplifiée de la bande passante
  if (fiberType === 'monomode') {
    return wavelength < 1310 ? 100 : 200;
  }
  return wavelength < 1310 ? 500 : 1000;
};

const calculateReturnLoss = (fiberType: string): number => {
  // Simulation simplifiée de la perte de retour
  return fiberType === 'monomode' ? -50 : -40;
};

export default OptiqueAdvancedControls; 