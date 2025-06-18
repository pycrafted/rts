import { create } from 'zustand';

export interface UMTSSimulationState {
  // Paramètres utilisateur
  numberOfUsers: number;
  dataRatePerUser: number; // kbps
  activityFactor: number;
  serviceType: 'voice' | 'data' | 'video';
  nodeBTransmitPower: number; // dBm
  
  // Paramètres d'affichage
  showInterference: boolean;
  showHandovers: boolean;
  
  // Résultats calculés
  loadFactor: number;
  qosLevel: 'excellent' | 'good' | 'fair' | 'poor';
  numberOfNodeBsRequired: number;
  
  // Positions des utilisateurs (pour la visualisation 3D)
  userPositions: Array<{ x: number; y: number; z: number; qos: number }>;
  
  // Actions
  setNumberOfUsers: (users: number) => void;
  setDataRatePerUser: (rate: number) => void;
  setActivityFactor: (factor: number) => void;
  setServiceType: (type: 'voice' | 'data' | 'video') => void;
  setNodeBTransmitPower: (power: number) => void;
  setShowInterference: (show: boolean) => void;
  setShowHandovers: (show: boolean) => void;
  updateResults: () => void;
  generateUserPositions: () => void;
  resetToDefaults: () => void;
}

const calculateLoadFactor = (
  numberOfUsers: number,
  dataRatePerUser: number,
  activityFactor: number,
  serviceType: 'voice' | 'data' | 'video'
): number => {
  // Facteurs de charge selon le type de service
  const serviceFactors = {
    voice: 0.67,
    data: 0.8,
    video: 0.9
  };
  
  const serviceFactor = serviceFactors[serviceType];
  
  // Calcul du facteur de charge (formule simplifiée pour l'éducation)
  // Load Factor = (Users × Data Rate × Activity Factor × Service Factor) / (WCDMA Chip Rate × Processing Gain)
  const wcdmaChipRate = 3.84e6; // 3.84 MHz
  const processingGain = 128; // Pour la voix
  
  const loadFactor = (numberOfUsers * dataRatePerUser * activityFactor * serviceFactor) / 
                    (wcdmaChipRate / processingGain);
  
  return Math.min(loadFactor, 1.0); // Limite à 100%
};

const calculateQoS = (loadFactor: number): 'excellent' | 'good' | 'fair' | 'poor' => {
  if (loadFactor < 0.3) return 'excellent';
  if (loadFactor < 0.6) return 'good';
  if (loadFactor < 0.8) return 'fair';
  return 'poor';
};

const calculateNodeBsRequired = (loadFactor: number): number => {
  if (loadFactor <= 0.8) return 1;
  
  // Si le facteur de charge dépasse 80%, on a besoin de plus de Node Bs
  const additionalNodeBs = Math.ceil((loadFactor - 0.8) / 0.2);
  return 1 + additionalNodeBs;
};

const generateRandomPositions = (count: number, loadFactor: number) => {
  const positions = [];
  const coverageRadius = 1000; // 1km de rayon
  
  for (let i = 0; i < count; i++) {
    // Position aléatoire dans un cercle
    const angle = Math.random() * 2 * Math.PI;
    const distance = Math.random() * coverageRadius;
    
    const x = Math.cos(angle) * distance;
    const z = Math.sin(angle) * distance;
    const y = Math.random() * 50; // Hauteur variable
    
    // QoS basée sur la distance et le facteur de charge
    const distanceFactor = 1 - (distance / coverageRadius);
    const qos = Math.max(0, Math.min(1, distanceFactor * (1 - loadFactor)));
    
    positions.push({ x, y, z, qos });
  }
  
  return positions;
};

export const useUMTSSimulationStore = create<UMTSSimulationState>((set, get) => ({
  // État initial
  numberOfUsers: 50,
  dataRatePerUser: 64,
  activityFactor: 0.5,
  serviceType: 'voice',
  nodeBTransmitPower: 43,
  showInterference: false,
  showHandovers: false,
  loadFactor: 0,
  qosLevel: 'excellent',
  numberOfNodeBsRequired: 1,
  userPositions: [],
  
  // Actions
  setNumberOfUsers: (users) => {
    set({ numberOfUsers: users });
    get().updateResults();
  },
  
  setDataRatePerUser: (rate) => {
    set({ dataRatePerUser: rate });
    get().updateResults();
  },
  
  setActivityFactor: (factor) => {
    set({ activityFactor: factor });
    get().updateResults();
  },
  
  setServiceType: (type) => {
    set({ serviceType: type });
    get().updateResults();
  },
  
  setNodeBTransmitPower: (power) => {
    set({ nodeBTransmitPower: power });
    get().updateResults();
  },
  
  setShowInterference: (show) => {
    set({ showInterference: show });
  },
  
  setShowHandovers: (show) => {
    set({ showHandovers: show });
  },
  
  updateResults: () => {
    const { numberOfUsers, dataRatePerUser, activityFactor, serviceType } = get();
    
    const loadFactor = calculateLoadFactor(numberOfUsers, dataRatePerUser, activityFactor, serviceType);
    const qosLevel = calculateQoS(loadFactor);
    const numberOfNodeBsRequired = calculateNodeBsRequired(loadFactor);
    
    set({ 
      loadFactor, 
      qosLevel, 
      numberOfNodeBsRequired 
    });
    
    get().generateUserPositions();
  },
  
  generateUserPositions: () => {
    const { numberOfUsers, loadFactor } = get();
    const positions = generateRandomPositions(numberOfUsers, loadFactor);
    set({ userPositions: positions });
  },
  
  resetToDefaults: () => {
    set({
      numberOfUsers: 50,
      dataRatePerUser: 64,
      activityFactor: 0.5,
      serviceType: 'voice',
      nodeBTransmitPower: 43,
      showInterference: false,
      showHandovers: false,
      loadFactor: 0,
      qosLevel: 'excellent',
      numberOfNodeBsRequired: 1,
      userPositions: []
    });
    get().updateResults();
  }
})); 