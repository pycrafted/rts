import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

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

// Cache pour les calculs
const calculationCache = new Map<string, number>();

const calculateLoadFactor = (
  numberOfUsers: number,
  dataRatePerUser: number,
  activityFactor: number,
  serviceType: 'voice' | 'data' | 'video'
): number => {
  // Créer une clé de cache
  const cacheKey = `${numberOfUsers}-${dataRatePerUser}-${activityFactor}-${serviceType}`;
  
  // Vérifier le cache
  if (calculationCache.has(cacheKey)) {
    return calculationCache.get(cacheKey)!;
  }
  
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
  
  const result = Math.min(loadFactor, 1.0); // Limite à 100%
  
  // Mettre en cache le résultat
  calculationCache.set(cacheKey, result);
  
  // Limiter la taille du cache
  if (calculationCache.size > 100) {
    const firstKey = calculationCache.keys().next().value;
    if (firstKey) {
      calculationCache.delete(firstKey);
    }
  }
  
  return result;
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

// Optimisation : Générer des positions avec moins de calculs
const generateRandomPositions = (count: number, loadFactor: number) => {
  const positions = [];
  const coverageRadius = 1000; // 1km de rayon
  
  // Pré-calculer les valeurs communes
  const loadFactorInverse = 1 - loadFactor;
  
  for (let i = 0; i < count; i++) {
    // Position aléatoire dans un cercle
    const angle = Math.random() * 2 * Math.PI;
    const distance = Math.random() * coverageRadius;
    
    const x = Math.cos(angle) * distance;
    const z = Math.sin(angle) * distance;
    const y = Math.random() * 50; // Hauteur variable
    
    // QoS basée sur la distance et le facteur de charge - optimisé
    const distanceFactor = 1 - (distance / coverageRadius);
    const qos = Math.max(0, Math.min(1, distanceFactor * loadFactorInverse));
    
    positions.push({ x, y, z, qos });
  }
  
  return positions;
};

export const useUMTSSimulationStore = create<UMTSSimulationState>()(
  subscribeWithSelector((set, get) => ({
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
    
    // Actions optimisées avec debouncing
    setNumberOfUsers: (users) => {
      set({ numberOfUsers: users });
      // Délai pour éviter les recalculs constants
      setTimeout(() => get().updateResults(), 100);
    },
    
    setDataRatePerUser: (rate) => {
      set({ dataRatePerUser: rate });
      setTimeout(() => get().updateResults(), 100);
    },
    
    setActivityFactor: (factor) => {
      set({ activityFactor: factor });
      setTimeout(() => get().updateResults(), 100);
    },
    
    setServiceType: (type) => {
      set({ serviceType: type });
      setTimeout(() => get().updateResults(), 100);
    },
    
    setNodeBTransmitPower: (power) => {
      set({ nodeBTransmitPower: power });
      // Pas besoin de recalculer pour la puissance d'émission
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
      
      // Générer les positions seulement si nécessaire
      const currentPositions = get().userPositions;
      if (currentPositions.length !== numberOfUsers) {
        get().generateUserPositions();
      }
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
      // Vider le cache lors du reset
      calculationCache.clear();
      get().updateResults();
    }
  }))
); 