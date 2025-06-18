import React, { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import OptiqueFiber from '@/components/optique/simulation/OptiqueFiber';
import OptiqueSplice from '@/components/optique/simulation/OptiqueSplice';
import OptiqueConnector from '@/components/optique/simulation/OptiqueConnector';
import OptiqueAttenuationGraph from '@/components/optique/simulation/OptiqueAttenuationGraph';
import OptiqueControls from '@/components/optique/simulation/OptiqueControls';

interface LinkBudgetResult {
  totalLoss: number;
  fiberLoss: number;
  spliceLoss: number;
  connectorLoss: number;
  margin: number;
}

const OptiqueSimulationView: React.FC = () => {
  const [fiberLength, setFiberLength] = useState(20);
  const [splices, setSplices] = useState<Array<{position: number}>>([]);
  const [connectors, setConnectors] = useState<Array<{position: number}>>([]);
  const [attenuation, setAttenuation] = useState(0.35);
  const [linkBudget, setLinkBudget] = useState<LinkBudgetResult>({
    totalLoss: 0,
    fiberLoss: 0,
    spliceLoss: 0,
    connectorLoss: 0,
    margin: 0
  });

  // Constantes pour les pertes
  const SPLICE_LOSS = 0.1; // dB par épissure
  const CONNECTOR_LOSS = 0.5; // dB par connecteur
  const POWER_BUDGET = 20; // dB (budget de puissance typique)

  useEffect(() => {
    // Calcul des pertes
    const fiberLoss = fiberLength * attenuation;
    const spliceLoss = splices.length * SPLICE_LOSS;
    const connectorLoss = connectors.length * CONNECTOR_LOSS;
    const totalLoss = fiberLoss + spliceLoss + connectorLoss;
    const margin = POWER_BUDGET - totalLoss;

    setLinkBudget({
      totalLoss,
      fiberLoss,
      spliceLoss,
      connectorLoss,
      margin
    });
  }, [fiberLength, splices, connectors, attenuation]);

  return (
    <div className="flex h-screen">
      <div className="w-1/4 p-4 bg-gray-100">
        <OptiqueControls
          fiberLength={fiberLength}
          onFiberLengthChange={setFiberLength}
          splices={splices}
          onSplicesChange={setSplices}
          connectors={connectors}
          onConnectorsChange={setConnectors}
          attenuation={attenuation}
          onAttenuationChange={setAttenuation}
        />
        
        {/* Affichage du bilan de liaison */}
        <div className="mt-6 p-4 bg-white rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Bilan de Liaison</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Perte fibre:</span>
              <span className="font-medium">{linkBudget.fiberLoss.toFixed(2)} dB</span>
            </div>
            <div className="flex justify-between">
              <span>Perte épissures:</span>
              <span className="font-medium">{linkBudget.spliceLoss.toFixed(2)} dB</span>
            </div>
            <div className="flex justify-between">
              <span>Perte connecteurs:</span>
              <span className="font-medium">{linkBudget.connectorLoss.toFixed(2)} dB</span>
            </div>
            <div className="border-t pt-2 mt-2">
              <div className="flex justify-between font-semibold">
                <span>Perte totale:</span>
                <span>{linkBudget.totalLoss.toFixed(2)} dB</span>
              </div>
            </div>
            <div className="border-t pt-2 mt-2">
              <div className="flex justify-between font-semibold">
                <span>Marge:</span>
                <span className={linkBudget.margin >= 0 ? 'text-green-600' : 'text-red-600'}>
                  {linkBudget.margin.toFixed(2)} dB
                </span>
              </div>
            </div>
          </div>
        </div>

        <OptiqueAttenuationGraph
          fiberLength={fiberLength}
          splices={splices}
          connectors={connectors}
          attenuation={attenuation}
        />
      </div>
      <div className="w-3/4">
        <Canvas camera={{ position: [0, 5, 10], fov: 75 }}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={1} />
          
          <OptiqueFiber length={fiberLength} />
          
          {splices.map((splice, index) => (
            <OptiqueSplice
              key={`splice-${index}`}
              position={splice.position}
            />
          ))}
          
          {connectors.map((connector, index) => (
            <OptiqueConnector
              key={`connector-${index}`}
              position={connector.position}
            />
          ))}
          
          <OrbitControls />
        </Canvas>
      </div>
    </div>
  );
};

export default OptiqueSimulationView; 