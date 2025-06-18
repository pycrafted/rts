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
    <div className="space-y-6">
      {/* Contrôle de la longueur de la fibre */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Longueur de la fibre (km)
        </label>
        <input
          type="range"
          min="1"
          max="100"
          value={fiberLength}
          onChange={(e) => onFiberLengthChange(Number(e.target.value))}
          className="w-full mt-1"
        />
        <span className="text-sm text-gray-500">{fiberLength} km</span>
      </div>

      {/* Contrôle de l'atténuation */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Atténuation (dB/km)
        </label>
        <input
          type="range"
          min="0.1"
          max="1"
          step="0.01"
          value={attenuation}
          onChange={(e) => onAttenuationChange(Number(e.target.value))}
          className="w-full mt-1"
        />
        <span className="text-sm text-gray-500">{attenuation} dB/km</span>
      </div>

      {/* Gestion des épissures */}
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-2">Épissures</h3>
        <div className="space-y-2">
          {splices.map((splice, index) => (
            <div key={index} className="flex items-center space-x-2">
              <span className="text-sm">{splice.position}%</span>
              <button
                onClick={() => handleRemoveSplice(index)}
                className="text-red-600 hover:text-red-800"
              >
                Supprimer
              </button>
            </div>
          ))}
          <div className="flex items-center space-x-2">
            <input
              type="range"
              min="0"
              max="100"
              value={newSplicePosition}
              onChange={(e) => setNewSplicePosition(Number(e.target.value))}
              className="w-full"
            />
            <span className="text-sm text-gray-500">{newSplicePosition}%</span>
            <button
              onClick={handleAddSplice}
              className="text-blue-600 hover:text-blue-800"
            >
              + Ajouter
            </button>
          </div>
        </div>
      </div>

      {/* Gestion des connecteurs */}
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-2">Connecteurs</h3>
        <div className="space-y-2">
          {connectors.map((connector, index) => (
            <div key={index} className="flex items-center space-x-2">
              <span className="text-sm">{connector.position}%</span>
              <button
                onClick={() => handleRemoveConnector(index)}
                className="text-red-600 hover:text-red-800"
              >
                Supprimer
              </button>
            </div>
          ))}
          <div className="flex items-center space-x-2">
            <input
              type="range"
              min="0"
              max="100"
              value={newConnectorPosition}
              onChange={(e) => setNewConnectorPosition(Number(e.target.value))}
              className="w-full"
            />
            <span className="text-sm text-gray-500">{newConnectorPosition}%</span>
            <button
              onClick={handleAddConnector}
              className="text-blue-600 hover:text-blue-800"
            >
              + Ajouter
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OptiqueControls; 