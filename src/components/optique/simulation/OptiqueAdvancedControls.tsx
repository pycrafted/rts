import React from 'react';
import InfoBulle from '@/components/common/InfoBulle';

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
    <div className="space-y-3 text-sm">
      {/* Type de fibre */}
      <div>
        <label className="flex items-center font-medium text-slate-300">
          Type de Fibre
          <InfoBulle content="Monomode: signal unique, longues distances. Multimode: signaux multiples, courtes distances." />
        </label>
        <select
          value={fiberType}
          onChange={(e) => onFiberTypeChange(e.target.value as any)}
          className="w-full p-2 bg-slate-700 border border-slate-600 rounded-md mt-1 text-white"
        >
          <option value="monomode">Monomode</option>
          <option value="multimode">Multimode</option>
        </select>
      </div>

      {/* Longueur d'onde */}
      <div>
        <label className="flex items-center font-medium text-slate-300">
          Longueur d'onde : <span className="font-bold text-cyan-400 ml-1">{wavelength} nm</span>
          <InfoBulle content="Fenêtre de transmission du signal. Affecte l'atténuation." />
        </label>
        <input
          type="range"
          min="850"
          max="1550"
          step="10"
          value={wavelength}
          onChange={(e) => onWavelengthChange(Number(e.target.value))}
          className="w-full h-2 bg-slate-600 rounded-lg appearance-none cursor-pointer slider-thumb"
        />
      </div>

      {/* Température */}
      <div>
        <label className="flex items-center font-medium text-slate-300">
          Température : <span className="font-bold text-cyan-400 ml-1">{temperature}°C</span>
          <InfoBulle content="La température peut altérer les propriétés physiques de la fibre et augmenter les pertes." />
        </label>
        <input
          type="range"
          min="-40"
          max="85"
          step="1"
          value={temperature}
          onChange={(e) => onTemperatureChange(Number(e.target.value))}
          className="w-full h-2 bg-slate-600 rounded-lg appearance-none cursor-pointer slider-thumb"
        />
      </div>

      {/* Dispersion */}
      <div>
        <label className="flex items-center font-medium text-slate-300">
          Dispersion : <span className="font-bold text-cyan-400 ml-1">{dispersion.toFixed(1)} ps/nm/km</span>
          <InfoBulle content="Étalement du signal qui peut limiter la bande passante. Idéalement proche de zéro." />
        </label>
        <input
          type="range"
          min="-20"
          max="20"
          step="0.1"
          value={dispersion}
          onChange={(e) => onDispersionChange(Number(e.target.value))}
          className="w-full h-2 bg-slate-600 rounded-lg appearance-none cursor-pointer slider-thumb"
        />
      </div>

      {/* Option de coupe transversale */}
      <div className="flex items-center pt-2">
        <input
          type="checkbox"
          id="showCrossSection"
          checked={showCrossSection}
          onChange={(e) => onShowCrossSectionChange(e.target.checked)}
          className="h-4 w-4 rounded bg-slate-700 border-slate-600 text-cyan-500 focus:ring-cyan-600"
        />
        <label htmlFor="showCrossSection" className="ml-2 text-slate-300">
          Voir la coupe transversale
        </label>
      </div>
    </div>
  );
};

export default OptiqueAdvancedControls; 