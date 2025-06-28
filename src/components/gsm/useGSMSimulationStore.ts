import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

export interface CoverageSettings {
  coverageRadius: number;
  obstaclePosition: [number, number, number];
  obstacleSize: [number, number, number];
  antennaHeight: number;
  phonePosition: [number, number, number];
}

export interface SimulationResults {
  coverageArea: number;
  coverageVolume: number;
  obstacleImpact: number;
  signalStrength: number;
  attenuationBehindObstacle: number;
  effectiveCoverageRadius: number;
  phoneSignalQuality: 'excellent' | 'good' | 'poor' | 'none';
  phoneDistanceToAntenna: number;
  phoneDistanceToObstacle: number;
}

export interface GSMSimulationState {
  // Paramètres de simulation
  settings: CoverageSettings;
  
  // Résultats calculés
  results: SimulationResults;
  
  // Actions
  setCoverageRadius: (radius: number) => void;
  setObstaclePosition: (axis: 'x' | 'y' | 'z', value: number) => void;
  setObstacleSize: (axis: 'x' | 'y' | 'z', value: number) => void;
  setAntennaHeight: (height: number) => void;
  setPhonePosition: (axis: 'x' | 'y' | 'z', value: number) => void;
  updateResults: () => void;
  resetToDefaults: () => void;
  loadFromStorage: () => Promise<void>;
  saveToStorage: () => Promise<void>;
}

// État initial
const initialState: CoverageSettings = {
  coverageRadius: 5,
  obstaclePosition: [2, 0, 3],
  obstacleSize: [1, 2, 1],
  antennaHeight: 3,
  phonePosition: [1, 0, 1]
};

// Fonction de calcul des résultats
const calculateResults = (settings: CoverageSettings): SimulationResults => {
  const { coverageRadius, obstaclePosition, obstacleSize, antennaHeight, phonePosition } = settings;
  
  // Calcul de la zone de couverture (surface)
  const coverageArea = Math.PI * coverageRadius * coverageRadius;
  
  // Calcul du volume de couverture
  const coverageVolume = (4/3) * Math.PI * coverageRadius * coverageRadius * coverageRadius;
  
  // Calcul de l'impact de l'obstacle
  const distanceToObstacle = Math.sqrt(
    Math.pow(obstaclePosition[0], 2) + 
    Math.pow(obstaclePosition[1], 2) + 
    Math.pow(obstaclePosition[2], 2)
  );
  
  // Atténuation derrière l'obstacle (simulation simplifiée)
  const obstacleVolume = obstacleSize[0] * obstacleSize[1] * obstacleSize[2];
  const obstacleImpact = Math.min(100, (obstacleVolume / coverageVolume) * 100);
  
  // Force du signal (basée sur la hauteur d'antenne et la distance)
  const signalStrength = Math.max(0, 100 - (distanceToObstacle * 10) + (antennaHeight * 5));
  
  // Atténuation derrière l'obstacle
  const attenuationBehindObstacle = Math.min(90, obstacleImpact * 2);
  
  // Rayon de couverture effectif (considérant l'obstacle)
  const effectiveCoverageRadius = coverageRadius * (1 - obstacleImpact / 200);

  // Calculs pour le téléphone
  const antennaPosition: [number, number, number] = [0, antennaHeight, 0];
  const phoneDistanceToAntenna = Math.sqrt(
    Math.pow(phonePosition[0] - antennaPosition[0], 2) +
    Math.pow(phonePosition[1] - antennaPosition[1], 2) +
    Math.pow(phonePosition[2] - antennaPosition[2], 2)
  );

  const phoneDistanceToObstacle = Math.sqrt(
    Math.pow(phonePosition[0] - obstaclePosition[0], 2) +
    Math.pow(phonePosition[1] - obstaclePosition[1], 2) +
    Math.pow(phonePosition[2] - obstaclePosition[2], 2)
  );

  // Qualité du signal du téléphone
  let phoneSignalQuality: 'excellent' | 'good' | 'poor' | 'none' = 'none';
  
  if (phoneDistanceToAntenna <= coverageRadius) {
    const isBehindObstacle = 
      phonePosition[2] > obstaclePosition[2] && 
      Math.abs(phonePosition[0] - obstaclePosition[0]) < obstacleSize[0] / 2 &&
      Math.abs(phonePosition[1] - obstaclePosition[1]) < obstacleSize[1] / 2;

    if (isBehindObstacle) {
      const attenuation = Math.max(0.1, 1 - (phoneDistanceToObstacle / coverageRadius));
      if (attenuation < 0.3) phoneSignalQuality = 'none';
      else if (attenuation < 0.6) phoneSignalQuality = 'poor';
      else phoneSignalQuality = 'good';
    } else {
      const signalStrength = 1 - (phoneDistanceToAntenna / coverageRadius);
      if (signalStrength > 0.8) phoneSignalQuality = 'excellent';
      else if (signalStrength > 0.5) phoneSignalQuality = 'good';
      else if (signalStrength > 0.2) phoneSignalQuality = 'poor';
      else phoneSignalQuality = 'none';
    }
  }
  
  return {
    coverageArea,
    coverageVolume,
    obstacleImpact,
    signalStrength,
    attenuationBehindObstacle,
    effectiveCoverageRadius,
    phoneSignalQuality,
    phoneDistanceToAntenna,
    phoneDistanceToObstacle
  };
};

export const useGSMSimulationStore = create<GSMSimulationState>()(
  subscribeWithSelector((set, get) => ({
    // État initial
    settings: initialState,
    results: calculateResults(initialState),
    
    // Actions
    setCoverageRadius: (radius) => {
      set((state) => {
        const newSettings = { ...state.settings, coverageRadius: radius };
        return {
          settings: newSettings,
          results: calculateResults(newSettings)
        };
      });
    },
    
    setObstaclePosition: (axis, value) => {
      set((state) => {
        const newSettings = {
          ...state.settings,
          obstaclePosition: [
            axis === 'x' ? value : state.settings.obstaclePosition[0],
            axis === 'y' ? value : state.settings.obstaclePosition[1],
            axis === 'z' ? value : state.settings.obstaclePosition[2]
          ]
        };
        return {
          settings: newSettings,
          results: calculateResults(newSettings)
        };
      });
    },
    
    setObstacleSize: (axis, value) => {
      set((state) => {
        const newSettings = {
          ...state.settings,
          obstacleSize: [
            axis === 'x' ? value : state.settings.obstacleSize[0],
            axis === 'y' ? value : state.settings.obstacleSize[1],
            axis === 'z' ? value : state.settings.obstacleSize[2]
          ]
        };
        return {
          settings: newSettings,
          results: calculateResults(newSettings)
        };
      });
    },
    
    setAntennaHeight: (height) => {
      set((state) => {
        const newSettings = { ...state.settings, antennaHeight: height };
        return {
          settings: newSettings,
          results: calculateResults(newSettings)
        };
      });
    },
    
    setPhonePosition: (axis, value) => {
      set((state) => {
        const newSettings = {
          ...state.settings,
          phonePosition: [
            axis === 'x' ? value : state.settings.phonePosition[0],
            axis === 'y' ? value : state.settings.phonePosition[1],
            axis === 'z' ? value : state.settings.phonePosition[2]
          ]
        };
        return {
          settings: newSettings,
          results: calculateResults(newSettings)
        };
      });
    },
    
    updateResults: () => {
      const { settings } = get();
      const results = calculateResults(settings);
      set({ results });
    },
    
    resetToDefaults: () => {
      const results = calculateResults(initialState);
      set({ settings: initialState, results });
    },
    
    // Méthodes de persistance
    loadFromStorage: async () => {
      try {
        const { ElectronService } = await import('@/services/electronService');
        const electronService = ElectronService.getInstance();
        
        if (electronService.isAvailable()) {
          const { DesktopStorage } = await import('@/services/desktopStorage');
          const storage = DesktopStorage.getInstance();
          const savedParams = await storage.getGsmSimulationParams();
          if (savedParams) {
            const settings = {
              coverageRadius: savedParams.coverageRadius ?? initialState.coverageRadius,
              obstaclePosition: savedParams.obstaclePosition ?? initialState.obstaclePosition,
              obstacleSize: savedParams.obstacleSize ?? initialState.obstacleSize,
              antennaHeight: savedParams.antennaHeight ?? initialState.antennaHeight,
              phonePosition: savedParams.phonePosition ?? initialState.phonePosition
            };
            const results = calculateResults(settings);
            set({ settings, results });
          }
        } else {
          // Fallback vers localStorage en mode web
          const savedParams = localStorage.getItem('gsm_simulation_params');
          if (savedParams) {
            const params = JSON.parse(savedParams);
            const settings = {
              coverageRadius: params.coverageRadius ?? initialState.coverageRadius,
              obstaclePosition: params.obstaclePosition ?? initialState.obstaclePosition,
              obstacleSize: params.obstacleSize ?? initialState.obstacleSize,
              antennaHeight: params.antennaHeight ?? initialState.antennaHeight,
              phonePosition: params.phonePosition ?? initialState.phonePosition
            };
            const results = calculateResults(settings);
            set({ settings, results });
          }
        }
      } catch (error) {
        console.error('Erreur lors du chargement des paramètres GSM:', error);
      }
    },
    
    saveToStorage: async () => {
      try {
        const { ElectronService } = await import('@/services/electronService');
        const electronService = ElectronService.getInstance();
        
        if (electronService.isAvailable()) {
          const { DesktopStorage } = await import('@/services/desktopStorage');
          const storage = DesktopStorage.getInstance();
          const currentState = get();
          await storage.saveGsmSimulationParams(currentState.settings);
        } else {
          // Fallback vers localStorage en mode web
          const currentState = get();
          localStorage.setItem('gsm_simulation_params', JSON.stringify(currentState.settings));
        }
      } catch (error) {
        console.error('Erreur lors de la sauvegarde des paramètres GSM:', error);
      }
    }
  }))
);

// Auto-sauvegarde lors des changements
useGSMSimulationStore.subscribe(
  (state) => state.settings,
  async (newSettings) => {
    // Éviter la sauvegarde lors du chargement initial
    if (newSettings.coverageRadius > 0) {
      await useGSMSimulationStore.getState().saveToStorage();
    }
  }
);

// Chargement automatique au démarrage
if (typeof window !== 'undefined') {
  useGSMSimulationStore.getState().loadFromStorage();
} 