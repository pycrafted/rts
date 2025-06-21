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
import { OrbitControls, Environment } from '@react-three/drei';
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

const FloatingPanel = ({ title, children }: { title: string, children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="bg-slate-800/80 backdrop-blur-sm border border-slate-700 rounded-lg shadow-lg transition-all duration-300 hover:bg-slate-800/95">
      <button
        className="w-full text-left p-2 sm:p-3 font-bold text-cyan-400 flex justify-between items-center touch-manipulation"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-sm sm:text-base">{title}</span>
        <span className="text-lg sm:text-xl">{isOpen ? '−' : '+'}</span>
      </button>
      {isOpen && <div className="p-2 sm:p-4 pt-0">{children}</div>}
    </div>
  );
};

// Nouveau composant Modal pour mobile
const MobileModal = ({ 
  isOpen, 
  onClose, 
  title, 
  children 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  title: string; 
  children: React.ReactNode; 
}) => {
  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-50 sm:hidden"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-end sm:hidden">
        <div className="w-full bg-slate-800 rounded-t-xl shadow-2xl max-h-[80vh] overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-slate-700">
            <h3 className="text-lg font-semibold text-cyan-400">{title}</h3>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white touch-manipulation min-w-[32px] min-h-[32px] flex items-center justify-center"
            >
              ✕
            </button>
          </div>
          
          {/* Content */}
          <div className="p-4 overflow-y-auto max-h-[calc(80vh-80px)]">
            {children}
          </div>
        </div>
      </div>
    </>
  );
};

// Bouton flottant pour ouvrir les modales sur mobile
const MobileControlButton = ({ 
  icon, 
  onClick 
}: { 
  icon: string; 
  onClick: () => void; 
}) => {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-20 sm:hidden z-40 bg-cyan-600 hover:bg-cyan-500 text-white rounded-full w-12 h-12 shadow-lg flex items-center justify-center touch-manipulation transition-all duration-200"
      style={{ right: '1rem' }}
    >
      <span className="text-lg">{icon}</span>
    </button>
  );
};

const CollapsibleGraphPanel = ({ title, children }: { title: string, children: React.ReactNode }) => {
  const [isExpanded, setIsExpanded] = useState(false); // Démarrage en mode réduit

  return (
    <div className={`absolute bottom-0 left-0 right-0 z-20 transition-all duration-300 ease-in-out ${isExpanded ? 'h-[40%] sm:h-[35%]' : 'h-12'}`}>
      <div className="bg-slate-900/70 backdrop-blur-sm border-t border-slate-700 shadow-2xl h-full flex flex-col">
        <button
          className="w-full text-left px-3 sm:px-4 py-3 font-semibold text-cyan-400 flex justify-between items-center h-12 flex-shrink-0 hover:bg-slate-800/50 transition-colors touch-manipulation"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <span className="text-sm sm:text-base">{title}</span>
          <span className="text-xs font-mono bg-slate-700/50 px-2 py-1 rounded">{isExpanded ? 'Réduire ▼' : 'Agrandir ▲'}</span>
        </button>
        <div className={`flex-grow p-2 sm:p-4 pt-2 transition-opacity duration-300 ${isExpanded ? 'opacity-100 h-full' : 'opacity-0 h-0'}`}>
          {isExpanded && children}
        </div>
      </div>
    </div>
  );
};

const OptiqueSimulationView: React.FC = () => {
  // États de base
  const [fiberLength, setFiberLength] = useState(20);  // Longueur de la fibre en km
  const [splices, setSplices] = useState<Array<{position: number}>>([]);  // Liste des épissures
  const [connectors, setConnectors] = useState<Array<{position: number}>>([{ position: 0 }, { position: 100 }]);  // Liste des connecteurs
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

  // États pour les modales mobile
  const [activeModal, setActiveModal] = useState<'controls' | 'advanced' | 'maintenance' | 'budget' | null>(null);

  // Constantes pour les pertes
  const SPLICE_LOSS = 0.1;     // Perte par épissure en dB
  const CONNECTOR_LOSS = 0.5;  // Perte par connecteur en dB
  const POWER_BUDGET = 20;     // Budget de puissance typique en dB

  /**
   * Calcule le bilan de liaison à chaque modification des paramètres
   */
  useEffect(() => {
    const fiberLoss = fiberLength * attenuation;
    const spliceLoss = splices.length * SPLICE_LOSS;
    const connectorLoss = connectors.length * CONNECTOR_LOSS;
    const dispersionLoss = Math.abs(dispersion) * fiberLength * 0.01;
    const temperatureLoss = Math.abs(temperature - 20) * fiberLength * 0.001;
    const defectLoss = defects.reduce((total, defect) => total + (defect.severity * (defect.type === 'break' ? 10 : 2)), 0);
    const totalLoss = fiberLoss + spliceLoss + connectorLoss + dispersionLoss + temperatureLoss + defectLoss;
    const margin = POWER_BUDGET - totalLoss;
    setLinkBudget({ totalLoss, fiberLoss, spliceLoss, connectorLoss, margin, dispersionLoss, temperatureLoss, defectLoss });
  }, [fiberLength, splices, connectors, attenuation, dispersion, temperature, defects]);

  const handleScenarioSelect = (scenario: any) => {
    setDefects([]);
    scenario.defects.forEach((defect: any) => setDefects(prev => [...prev, { ...defect, id: Math.random().toString() }]));
  };

  return (
    <div className="relative h-full bg-slate-900 text-white rounded-lg overflow-hidden">
      {/* Panneau de contrôle gauche - Desktop seulement */}
      <div className="hidden sm:block absolute top-2 sm:top-4 left-2 sm:left-4 bottom-16 w-72 sm:w-80 z-10 flex flex-col gap-2 sm:gap-4 overflow-y-auto pr-2">
        <FloatingPanel title="Pilotage de la Simulation">
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
        </FloatingPanel>
        <FloatingPanel title="Paramètres Avancés">
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
        </FloatingPanel>
        <FloatingPanel title="Maintenance & Défauts">
          <OptiqueMaintenance onScenarioSelect={handleScenarioSelect} />
        </FloatingPanel>
      </div>
      
      {/* Panneau de bilan de liaison - Desktop seulement */}
      <div className="hidden sm:block absolute top-2 sm:top-4 right-2 sm:right-4 w-72 sm:w-80 z-10">
        <div className="bg-slate-800/80 backdrop-blur-sm border border-slate-700 rounded-lg shadow-lg p-3 sm:p-4 transition-all duration-300 opacity-50 hover:opacity-100">
          <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-cyan-400">📊 Bilan de Liaison</h3>
          <div className="space-y-2 sm:space-y-3 text-xs sm:text-sm">
            <div className="flex justify-between items-center">
              <span className="text-slate-300">📉 Perte totale:</span>
              <span className="font-mono font-bold text-base sm:text-lg">{linkBudget.totalLoss.toFixed(2)} dB</span>
            </div>
            <div className="border-t border-slate-700 my-2"></div>
            <div className="flex justify-between">
              <span className="text-slate-400">Marge de puissance:</span>
              <span className={`font-mono font-bold text-base sm:text-lg ${linkBudget.margin >= 3 ? 'text-green-400' : linkBudget.margin >= 0 ? 'text-yellow-400' : 'text-red-500'}`}>
                {linkBudget.margin.toFixed(2)} dB
              </span>
            </div>
            <div className="border-t border-slate-700 my-2"></div>
            <div className="text-xs space-y-1 sm:space-y-2 text-slate-400">
              <div className="flex justify-between"><span>Perte fibre:</span><span className="font-mono">{linkBudget.fiberLoss.toFixed(2)} dB</span></div>
              <div className="flex justify-between"><span>Perte épissures:</span><span className="font-mono">{linkBudget.spliceLoss.toFixed(2)} dB</span></div>
              <div className="flex justify-between"><span>Perte connecteurs:</span><span className="font-mono">{linkBudget.connectorLoss.toFixed(2)} dB</span></div>
              <div className="flex justify-between"><span>Perte dispersion:</span><span className="font-mono">{linkBudget.dispersionLoss.toFixed(2)} dB</span></div>
              <div className="flex justify-between"><span>Perte température:</span><span className="font-mono">{linkBudget.temperatureLoss.toFixed(2)} dB</span></div>
              <div className="flex justify-between text-yellow-500"><span>Perte défauts:</span><span className="font-mono">{linkBudget.defectLoss.toFixed(2)} dB</span></div>
            </div>
          </div>
        </div>
      </div>

      {/* Boutons de contrôle mobile */}
      <div className="sm:hidden">
        <MobileControlButton 
          icon="⚙️" 
          onClick={() => setActiveModal('controls')} 
        />
        <MobileControlButton 
          icon="🔧" 
          onClick={() => setActiveModal('advanced')} 
        />
        <MobileControlButton 
          icon="🔧" 
          onClick={() => setActiveModal('maintenance')} 
        />
        <MobileControlButton 
          icon="📊" 
          onClick={() => setActiveModal('budget')} 
        />
      </div>

      {/* Modales mobile */}
      <MobileModal 
        isOpen={activeModal === 'controls'} 
        onClose={() => setActiveModal(null)} 
        title="Pilotage de la Simulation"
      >
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
      </MobileModal>

      <MobileModal 
        isOpen={activeModal === 'advanced'} 
        onClose={() => setActiveModal(null)} 
        title="Paramètres Avancés"
      >
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
      </MobileModal>

      <MobileModal 
        isOpen={activeModal === 'maintenance'} 
        onClose={() => setActiveModal(null)} 
        title="Maintenance & Défauts"
      >
        <OptiqueMaintenance onScenarioSelect={handleScenarioSelect} />
      </MobileModal>

      <MobileModal 
        isOpen={activeModal === 'budget'} 
        onClose={() => setActiveModal(null)} 
        title="📊 Bilan de Liaison"
      >
        <div className="space-y-3 text-sm">
          <div className="flex justify-between items-center">
            <span className="text-slate-300">📉 Perte totale:</span>
            <span className="font-mono font-bold text-lg">{linkBudget.totalLoss.toFixed(2)} dB</span>
          </div>
          <div className="border-t border-slate-700 my-2"></div>
          <div className="flex justify-between">
            <span className="text-slate-400">Marge de puissance:</span>
            <span className={`font-mono font-bold text-lg ${linkBudget.margin >= 3 ? 'text-green-400' : linkBudget.margin >= 0 ? 'text-yellow-400' : 'text-red-500'}`}>
              {linkBudget.margin.toFixed(2)} dB
            </span>
          </div>
          <div className="border-t border-slate-700 my-2"></div>
          <div className="text-sm space-y-2 text-slate-400">
            <div className="flex justify-between"><span>Perte fibre:</span><span className="font-mono">{linkBudget.fiberLoss.toFixed(2)} dB</span></div>
            <div className="flex justify-between"><span>Perte épissures:</span><span className="font-mono">{linkBudget.spliceLoss.toFixed(2)} dB</span></div>
            <div className="flex justify-between"><span>Perte connecteurs:</span><span className="font-mono">{linkBudget.connectorLoss.toFixed(2)} dB</span></div>
            <div className="flex justify-between"><span>Perte dispersion:</span><span className="font-mono">{linkBudget.dispersionLoss.toFixed(2)} dB</span></div>
            <div className="flex justify-between"><span>Perte température:</span><span className="font-mono">{linkBudget.temperatureLoss.toFixed(2)} dB</span></div>
            <div className="flex justify-between text-yellow-500"><span>Perte défauts:</span><span className="font-mono">{linkBudget.defectLoss.toFixed(2)} dB</span></div>
          </div>
        </div>
      </MobileModal>

      {/* Panneau de graphique - Responsive */}
      <CollapsibleGraphPanel title="📈 Évolution de l'atténuation le long de la fibre">
        <OptiqueAttenuationGraph
            fiberLength={fiberLength} splices={splices}
            connectors={connectors} attenuation={attenuation}
        />
      </CollapsibleGraphPanel>
      
      {/* Canvas 3D - Responsive */}
      <Canvas 
        camera={{ position: [0, 2.5, fiberLength / 1.5], fov: 60 }} 
        className="rounded-lg simulation-3d-mobile"
      >
        <color attach="background" args={['#0f172a']} />
        <Environment preset="city" />
        <ambientLight intensity={0.5} />
        <pointLight position={[0, 10, fiberLength / 2]} intensity={1} color="#ffffff" />
        
        <OptiqueFiber length={fiberLength} showCrossSection={showCrossSection} />
        {splices.map((s, i) => <OptiqueSplice key={i} position={s.position} fiberLength={fiberLength} />)}
        {connectors.map((c, i) => <OptiqueConnector key={i} position={c.position} fiberLength={fiberLength} />)}
        {defects.map(d => <OptiqueDefects key={d.id} {...d} fiberLength={fiberLength} />)}
        
        <OrbitControls 
          minDistance={5} 
          maxDistance={150}
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
        />
      </Canvas>
    </div>
  );
};

export default OptiqueSimulationView; 