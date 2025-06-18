/**
 * Composant principal de la simulation optique
 * 
 * Ce composant gère :
 * - La visualisation 3D de la fibre optique
 * - Le calcul du bilan de liaison
 * - L'affichage des contrôles et du graphique d'atténuation
 * 
 * @component
 */
import React, { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import OptiqueFiber from '@/components/optique/simulation/OptiqueFiber';
import OptiqueSplice from '@/components/optique/simulation/OptiqueSplice';
import OptiqueConnector from '@/components/optique/simulation/OptiqueConnector';
import OptiqueAttenuationGraph from '@/components/optique/simulation/OptiqueAttenuationGraph';
import OptiqueControls from '@/components/optique/simulation/OptiqueControls';
import OptiqueAdvancedControls from '@/components/optique/simulation/OptiqueAdvancedControls';
import OptiqueDefects from '@/components/optique/simulation/OptiqueDefects';
import OptiqueMaintenance from '@/components/optique/simulation/OptiqueMaintenance';

/**
 * Interface définissant la structure des résultats du bilan de liaison
 */
interface LinkBudgetResult {
  totalLoss: number;    // Perte totale en dB
  fiberLoss: number;    // Perte dans la fibre en dB
  spliceLoss: number;   // Perte due aux épissures en dB
  connectorLoss: number;// Perte due aux connecteurs en dB
  margin: number;       // Marge disponible en dB
  dispersionLoss: number;
  temperatureLoss: number;
  defectLoss: number;
}

interface Defect {
  id: string;
  type: 'bend' | 'break' | 'dirty' | 'wet';
  position: number;
  severity: number;
}

const OptiqueSimulationView: React.FC = () => {
  // États de base
  const [fiberLength, setFiberLength] = useState(20);  // Longueur de la fibre en km
  const [splices, setSplices] = useState<Array<{position: number}>>([]);  // Liste des épissures
  const [connectors, setConnectors] = useState<Array<{position: number}>>([]);  // Liste des connecteurs
  const [attenuation, setAttenuation] = useState(0.35);  // Atténuation en dB/km

  // Nouveaux états pour les paramètres avancés
  const [fiberType, setFiberType] = useState<'monomode' | 'multimode'>('monomode');
  const [wavelength, setWavelength] = useState(1550);
  const [temperature, setTemperature] = useState(20);
  const [dispersion, setDispersion] = useState(0);
  const [showCrossSection, setShowCrossSection] = useState(false);

  // État pour les défauts
  const [defects, setDefects] = useState<Defect[]>([]);

  // État pour les résultats du bilan de liaison
  const [linkBudget, setLinkBudget] = useState<LinkBudgetResult>({
    totalLoss: 0,
    fiberLoss: 0,
    spliceLoss: 0,
    connectorLoss: 0,
    margin: 0,
    dispersionLoss: 0,
    temperatureLoss: 0,
    defectLoss: 0
  });

  // Constantes pour les pertes
  const SPLICE_LOSS = 0.1;     // Perte par épissure en dB
  const CONNECTOR_LOSS = 0.5;  // Perte par connecteur en dB
  const POWER_BUDGET = 20;     // Budget de puissance typique en dB

  /**
   * Calcule le bilan de liaison à chaque modification des paramètres
   */
  useEffect(() => {
    // Calcul des pertes de base
    const fiberLoss = fiberLength * attenuation;
    const spliceLoss = splices.length * SPLICE_LOSS;
    const connectorLoss = connectors.length * CONNECTOR_LOSS;

    // Calcul des pertes avancées
    const dispersionLoss = Math.abs(dispersion) * fiberLength * 0.01;
    const temperatureLoss = Math.abs(temperature - 20) * fiberLength * 0.001;

    // Calcul des pertes dues aux défauts
    const defectLoss = defects.reduce((total, defect) => {
      const defectLoss = defect.severity * (defect.type === 'break' ? 10 : 2);
      return total + defectLoss;
    }, 0);

    // Calcul des pertes totales
    const totalLoss = fiberLoss + spliceLoss + connectorLoss + dispersionLoss + temperatureLoss + defectLoss;
    const margin = POWER_BUDGET - totalLoss;

    setLinkBudget({
      totalLoss,
      fiberLoss,
      spliceLoss,
      connectorLoss,
      margin,
      dispersionLoss,
      temperatureLoss,
      defectLoss
    });
  }, [fiberLength, splices, connectors, attenuation, dispersion, temperature, defects]);

  // Gestion des scénarios de maintenance
  const handleScenarioSelect = (scenario: any) => {
    // Réinitialiser les défauts existants
    setDefects([]);
    // Ajouter les nouveaux défauts du scénario
    scenario.defects.forEach((defect: any) => {
      setDefects(prev => [...prev, { ...defect, id: Math.random().toString() }]);
    });
  };

  // Gestion des défauts
  const handleDefectAdd = (defect: { type: 'bend' | 'break' | 'dirty' | 'wet'; position: number; severity: number }) => {
    setDefects(prev => [...prev, { ...defect, id: Math.random().toString() }]);
  };

  return (
    <div className="flex h-screen">
      {/* Panneau de contrôle et résultats */}
      <div className="w-1/4 p-4 bg-gray-100 overflow-y-auto">
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

        <OptiqueAdvancedControls
          fiberType={fiberType}
          onFiberTypeChange={setFiberType}
          wavelength={wavelength}
          onWavelengthChange={setWavelength}
          showCrossSection={showCrossSection}
          onShowCrossSectionChange={setShowCrossSection}
          temperature={temperature}
          onTemperatureChange={setTemperature}
          dispersion={dispersion}
          onDispersionChange={setDispersion}
        />

        <OptiqueMaintenance
          onScenarioSelect={handleScenarioSelect}
          onDefectAdd={handleDefectAdd}
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
            <div className="flex justify-between">
              <span>Perte dispersion:</span>
              <span className="font-medium">{linkBudget.dispersionLoss.toFixed(2)} dB</span>
            </div>
            <div className="flex justify-between">
              <span>Perte température:</span>
              <span className="font-medium">{linkBudget.temperatureLoss.toFixed(2)} dB</span>
            </div>
            <div className="flex justify-between">
              <span>Perte défauts:</span>
              <span className="font-medium">{linkBudget.defectLoss.toFixed(2)} dB</span>
            </div>
            <div className="border-t pt-2 mt-2">
              <div className="flex justify-between font-semibold">
                <span>Perte totale:</span>
                <span>{linkBudget.totalLoss.toFixed(2)} dB</span>
              </div>
            </div>
            <div className="flex justify-between font-semibold">
              <span>Marge:</span>
              <span className={linkBudget.margin >= 0 ? 'text-green-600' : 'text-red-600'}>
                {linkBudget.margin.toFixed(2)} dB
              </span>
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

      {/* Visualisation 3D */}
      <div className="w-3/4 bg-gray-800">
        <Canvas camera={{ position: [0, 5, 10], fov: 75 }}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={1} />
          
          <OptiqueFiber 
            length={fiberLength}
            type={fiberType}
            wavelength={wavelength}
            showCrossSection={showCrossSection}
          />
          
          {splices.map((splice, index) => (
            <OptiqueSplice
              key={`splice-${index}`}
              position={splice.position}
              fiberLength={fiberLength}
            />
          ))}
          
          {connectors.map((connector, index) => (
            <OptiqueConnector
              key={`connector-${index}`}
              position={connector.position}
              fiberLength={fiberLength}
            />
          ))}

          {defects.map((defect) => (
            <OptiqueDefects
              key={defect.id}
              position={defect.position}
              fiberLength={fiberLength}
              type={defect.type}
              severity={defect.severity}
            />
          ))}
          
          <OrbitControls />
        </Canvas>
      </div>
    </div>
  );
};

export default OptiqueSimulationView; 