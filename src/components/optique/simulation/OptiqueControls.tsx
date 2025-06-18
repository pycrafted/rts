import React from 'react';

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
  const handleAddSplice = () => {
    const position = Math.random() * fiberLength;
    onSplicesChange([...splices, { position }]);
  };

  const handleAddConnector = () => {
    const position = Math.random() * fiberLength;
    onConnectorsChange([...connectors, { position }]);
  };

  const handleRemoveSplice = (index: number) => {
    const newSplices = splices.filter((_, i) => i !== index);
    onSplicesChange(newSplices);
  };

  const handleRemoveConnector = (index: number) => {
    const newConnectors = connectors.filter((_, i) => i !== index);
    onConnectorsChange(newConnectors);
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Longueur de la fibre (m)
        </label>
        <input
          type="number"
          value={fiberLength}
          onChange={(e) => onFiberLengthChange(Number(e.target.value))}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          min="1"
          max="100"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Atténuation (dB/km)
        </label>
        <input
          type="number"
          value={attenuation}
          onChange={(e) => onAttenuationChange(Number(e.target.value))}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          min="0"
          max="1"
          step="0.01"
        />
      </div>

      <div>
        <h3 className="text-lg font-medium text-gray-900">Épissures</h3>
        <button
          onClick={handleAddSplice}
          className="mt-2 inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Ajouter une épissure
        </button>
        <ul className="mt-2 space-y-2">
          {splices.map((splice, index) => (
            <li key={index} className="flex items-center justify-between">
              <span>Position: {splice.position.toFixed(2)}m</span>
              <button
                onClick={() => handleRemoveSplice(index)}
                className="text-red-600 hover:text-red-800"
              >
                Supprimer
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="text-lg font-medium text-gray-900">Connecteurs</h3>
        <button
          onClick={handleAddConnector}
          className="mt-2 inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Ajouter un connecteur
        </button>
        <ul className="mt-2 space-y-2">
          {connectors.map((connector, index) => (
            <li key={index} className="flex items-center justify-between">
              <span>Position: {connector.position.toFixed(2)}m</span>
              <button
                onClick={() => handleRemoveConnector(index)}
                className="text-red-600 hover:text-red-800"
              >
                Supprimer
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default OptiqueControls; 