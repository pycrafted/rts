/**
 * Composant de contrôle pour la simulation optique
 * 
 * Ce composant permet de :
 * - Ajuster la longueur de la fibre
 * - Modifier l'atténuation
 * - Ajouter/supprimer des épissures
 * - Ajouter/supprimer des connecteurs
 * 
 * @component
 */
import React, { useState } from 'react';
import InfoBulle from '@/components/common/InfoBulle';

interface OptiqueControlsProps {
  fiberLength: number;
  onFiberLengthChange: (length: number) => void;
  splices: Array<{position: number}>;
  onSplicesChange: (splices: Array<{position: number}>) => void;
  connectors: Array<{position: number}>;
  onConnectorsChange: (connectors: Array<{position: number}>) => void;
  attenuation: number;
  onAttenuationChange: (attenuation: number) => void;
}

const OptiqueControls: React.FC<OptiqueControlsProps> = ({
  fiberLength,
  onFiberLengthChange,
  splices,
  onSplicesChange,
  connectors,
  onConnectorsChange,
  attenuation,
  onAttenuationChange,
}) => {
  // États pour les positions des nouveaux éléments
  const [newSplicePosition, setNewSplicePosition] = useState(50);
  const [newConnectorPosition, setNewConnectorPosition] = useState(50);

  /**
   * Vérifie si une position est déjà occupée
   * @param position Position à vérifier
   * @returns true si la position est occupée
   */
  const isPositionOccupied = (position: number): boolean => {
    const tolerance = 5; // Tolérance de 5% pour éviter les superpositions
    return [...splices, ...connectors].some(
      item => Math.abs(item.position - position) < tolerance
    );
  };

  /**
   * Ajoute une épissure à la position spécifiée
   */
  const handleAddSplice = () => {
    if (!isPositionOccupied(newSplicePosition)) {
      onSplicesChange([...splices, { position: newSplicePosition }]);
      setNewSplicePosition(50); // Réinitialiser la position
    } else {
      alert('Cette position est déjà occupée. Veuillez choisir une autre position.');
    }
  };

  /**
   * Supprime une épissure à l'index spécifié
   */
  const handleRemoveSplice = (index: number) => {
    const newSplices = splices.filter((_, i) => i !== index);
    onSplicesChange(newSplices);
  };

  /**
   * Ajoute un connecteur à la position spécifiée
   */
  const handleAddConnector = () => {
    if (!isPositionOccupied(newConnectorPosition)) {
      onConnectorsChange([...connectors, { position: newConnectorPosition }]);
      setNewConnectorPosition(50); // Réinitialiser la position
    } else {
      alert('Cette position est déjà occupée. Veuillez choisir une autre position.');
    }
  };

  /**
   * Supprime un connecteur à l'index spécifié
   */
  const handleRemoveConnector = (index: number) => {
    const newConnectors = connectors.filter((_, i) => i !== index);
    onConnectorsChange(newConnectors);
  };

  return (
    <div className="space-y-3 sm:space-y-4">
      {/* Contrôles principaux */}
      <div className="space-y-2 sm:space-y-3">
        <div>
          <label className="block text-xs sm:text-sm font-medium text-slate-300 mb-1 sm:mb-2">
            Longueur : <span className="font-bold text-cyan-400">{fiberLength} km</span>
          </label>
          <input 
            type="range" 
            min="1" 
            max="100" 
            value={fiberLength} 
            onChange={(e) => onFiberLengthChange(Number(e.target.value))}
            className="w-full h-2 sm:h-3 bg-slate-600 rounded-lg appearance-none cursor-pointer slider-thumb touch-manipulation" 
          />
        </div>
        <div>
          <label className="flex items-center text-xs sm:text-sm font-medium text-slate-300 mb-1 sm:mb-2">
            Atténuation Linéique : <span className="font-bold text-cyan-400 ml-1">{attenuation} dB/km</span>
            <InfoBulle content="Perte de signal intrinsèque à la fibre, par kilomètre." />
          </label>
          <input 
            type="range" 
            min="0.1" 
            max="1" 
            step="0.01" 
            value={attenuation} 
            onChange={(e) => onAttenuationChange(Number(e.target.value))}
            className="w-full h-2 sm:h-3 bg-slate-600 rounded-lg appearance-none cursor-pointer slider-thumb touch-manipulation" 
          />
        </div>
      </div>

      <div className="border-t border-slate-700 my-2"></div>

      {/* Gestion des épissures et connecteurs */}
      {['épissures', 'connecteurs'].map(type => (
        <div key={type}>
          <h4 className="text-sm sm:text-md font-semibold text-slate-200 mb-2 capitalize">{type}</h4>
          <div className="space-y-1 sm:space-y-2 max-h-20 sm:max-h-24 overflow-y-auto pr-2">
            {(type === 'épissures' ? splices : connectors).map((item, index) => (
              <div key={index} className="flex items-center justify-between text-xs sm:text-sm bg-slate-700/50 p-1.5 rounded-md">
                <span>Position: <span className="font-mono text-cyan-400">{item.position}%</span></span>
                <button 
                  onClick={() => type === 'épissures' ? handleRemoveSplice(index) : handleRemoveConnector(index)}
                  className="text-red-400 hover:text-red-300 text-xs font-semibold touch-manipulation min-w-[24px] min-h-[24px] flex items-center justify-center"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
          <div className="pt-2">
            <div className="flex items-center space-x-2">
              <input 
                type="range" 
                min="0" 
                max="100"
                value={type === 'épissures' ? newSplicePosition : newConnectorPosition}
                onChange={(e) => type === 'épissures' ? setNewSplicePosition(Number(e.target.value)) : setNewConnectorPosition(Number(e.target.value))}
                className="flex-1 h-2 sm:h-3 bg-slate-600 rounded-lg appearance-none cursor-pointer slider-thumb touch-manipulation" 
              />
              <button 
                onClick={type === 'épissures' ? handleAddSplice : handleAddConnector}
                className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-1.5 px-3 rounded-md text-sm transition-colors touch-manipulation min-w-[32px] min-h-[32px] flex items-center justify-center"
              >
                +
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default OptiqueControls; 