import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

export interface HertzienSettings {
  frequency: number;
  txPower: number;
  txGain: number;
  rxGain: number;
  txHeight: number;
  rxHeight: number;
  climate: 'temperate' | 'tropical' | 'arid';
  reliability: number;
  polarizationLoss: number;
  misalignmentLoss: number;
}

export interface HertzienResults {
  freeSpaceLoss: number;
  totalLoss: number;
  totalGain: number;
  receivedPower: number;
  systemMargin: number;
  availability: number;
  diffractionLoss: number;
  distance: number;
}

export interface HertzienState {
  // Paramètres de simulation
  settings: HertzienSettings;
  
  // Résultats calculés
  results: HertzienResults | null;
  
  // Actions
  setFrequency: (frequency: number) => void;
  setTxPower: (power: number) => void;
  setTxGain: (gain: number) => void;
  setRxGain: (gain: number) => void;
  setTxHeight: (height: number) => void;
  setRxHeight: (height: number) => void;
  setClimate: (climate: 'temperate' | 'tropical' | 'arid') => void;
  setReliability: (reliability: number) => void;
  setPolarizationLoss: (loss: number) => void;
  setMisalignmentLoss: (loss: number) => void;
  updateResults: (results: HertzienResults) => void;
  resetToDefaults: () => void;
  loadFromStorage: () => Promise<void>;
  saveToStorage: () => Promise<void>;
}

// État initial
const initialState: HertzienSettings = {
  frequency: 2400, // MHz
  txPower: 20, // dBm
  txGain: 15, // dBi
  rxGain: 15, // dBi
  txHeight: 30, // m
  rxHeight: 30, // m
  climate: 'temperate',
  reliability: 99.9, // %
  polarizationLoss: 0.5, // dB
  misalignmentLoss: 0.5 // dB
};

export const useHertzienStore = create<HertzienState>()(
  subscribeWithSelector((set, get) => ({
    // État initial
    settings: initialState,
    results: null,
    
    // Actions
    setFrequency: (frequency) => {
      set((state) => ({
        settings: { ...state.settings, frequency }
      }));
    },
    
    setTxPower: (txPower) => {
      set((state) => ({
        settings: { ...state.settings, txPower }
      }));
    },
    
    setTxGain: (txGain) => {
      set((state) => ({
        settings: { ...state.settings, txGain }
      }));
    },
    
    setRxGain: (rxGain) => {
      set((state) => ({
        settings: { ...state.settings, rxGain }
      }));
    },
    
    setTxHeight: (txHeight) => {
      set((state) => ({
        settings: { ...state.settings, txHeight }
      }));
    },
    
    setRxHeight: (rxHeight) => {
      set((state) => ({
        settings: { ...state.settings, rxHeight }
      }));
    },
    
    setClimate: (climate) => {
      set((state) => ({
        settings: { ...state.settings, climate }
      }));
    },
    
    setReliability: (reliability) => {
      set((state) => ({
        settings: { ...state.settings, reliability }
      }));
    },
    
    setPolarizationLoss: (polarizationLoss) => {
      set((state) => ({
        settings: { ...state.settings, polarizationLoss }
      }));
    },
    
    setMisalignmentLoss: (misalignmentLoss) => {
      set((state) => ({
        settings: { ...state.settings, misalignmentLoss }
      }));
    },
    
    updateResults: (results) => {
      set({ results });
    },
    
    resetToDefaults: () => {
      set({ settings: initialState, results: null });
    },
    
    // Méthodes de persistance
    loadFromStorage: async () => {
      try {
        const { ElectronService } = await import('@/services/electronService');
        const electronService = ElectronService.getInstance();
        
        if (electronService.isAvailable()) {
          const { DesktopStorage } = await import('@/services/desktopStorage');
          const storage = DesktopStorage.getInstance();
          const savedParams = await storage.getHertzienSimulationParams();
          if (savedParams) {
            const settings = {
              frequency: savedParams.frequency ?? initialState.frequency,
              txPower: savedParams.txPower ?? initialState.txPower,
              txGain: savedParams.txGain ?? initialState.txGain,
              rxGain: savedParams.rxGain ?? initialState.rxGain,
              txHeight: savedParams.txHeight ?? initialState.txHeight,
              rxHeight: savedParams.rxHeight ?? initialState.rxHeight,
              climate: savedParams.climate ?? initialState.climate,
              reliability: savedParams.reliability ?? initialState.reliability,
              polarizationLoss: savedParams.polarizationLoss ?? initialState.polarizationLoss,
              misalignmentLoss: savedParams.misalignmentLoss ?? initialState.misalignmentLoss
            };
            set({ settings });
          }
        } else {
          // Fallback vers localStorage en mode web
          const savedParams = localStorage.getItem('hertzien_simulation_params');
          if (savedParams) {
            const params = JSON.parse(savedParams);
            const settings = {
              frequency: params.frequency ?? initialState.frequency,
              txPower: params.txPower ?? initialState.txPower,
              txGain: params.txGain ?? initialState.txGain,
              rxGain: params.rxGain ?? initialState.rxGain,
              txHeight: params.txHeight ?? initialState.txHeight,
              rxHeight: params.rxHeight ?? initialState.rxHeight,
              climate: params.climate ?? initialState.climate,
              reliability: params.reliability ?? initialState.reliability,
              polarizationLoss: params.polarizationLoss ?? initialState.polarizationLoss,
              misalignmentLoss: params.misalignmentLoss ?? initialState.misalignmentLoss
            };
            set({ settings });
          }
        }
      } catch (error) {
        console.error('Erreur lors du chargement des paramètres Hertzien:', error);
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
          await storage.saveHertzienSimulationParams(currentState.settings);
        } else {
          // Fallback vers localStorage en mode web
          const currentState = get();
          localStorage.setItem('hertzien_simulation_params', JSON.stringify(currentState.settings));
        }
      } catch (error) {
        console.error('Erreur lors de la sauvegarde des paramètres Hertzien:', error);
      }
    }
  }))
);

// Auto-sauvegarde lors des changements
useHertzienStore.subscribe(
  (state) => state.settings,
  async (newSettings) => {
    // Éviter la sauvegarde lors du chargement initial
    if (newSettings.frequency > 0) {
      await useHertzienStore.getState().saveToStorage();
    }
  }
);

// Chargement automatique au démarrage
if (typeof window !== 'undefined') {
  useHertzienStore.getState().loadFromStorage();
} 