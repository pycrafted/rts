import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

interface Antenna {
  id: string;
  position: [number, number, number];
  gain: number;
  type: 'tx' | 'rx' | 'parabolic';
  frequency: number;
  power: number;
}

interface Terrain {
  points: Array<[number, number, number]>;
  type: string;
}

interface SimulationState {
  antennas: Antenna[];
  terrain: Terrain;
  frequency: number;
  addAntenna: (antenna: Omit<Antenna, 'id'>) => void;
  updateAntenna: (index: number, antenna: Partial<Antenna>) => void;
  removeAntenna: (id: string) => void;
  updateTerrain: (terrain: Partial<Terrain>) => void;
  setFrequency: (frequency: number) => void;
  loadFromStorage: () => Promise<void>;
  saveToStorage: () => Promise<void>;
}

// État initial
const initialState = {
  antennas: [],
  terrain: {
    points: [],
    type: 'flat'
  },
  frequency: 2400, // MHz par défaut
};

export const useSimulationStore = create<SimulationState>()(
  subscribeWithSelector((set, get) => ({
    ...initialState,

    addAntenna: (antenna) => set((state) => ({
      antennas: [...state.antennas, { ...antenna, id: Math.random().toString(36).substr(2, 9) }]
    })),

    updateAntenna: (index, antenna) =>
      set((state) => ({
        antennas: state.antennas.map((a, i) =>
          i === index ? { ...a, ...antenna } : a
        )
      })),

    removeAntenna: (id) => set((state) => ({
      antennas: state.antennas.filter((antenna) => antenna.id !== id)
    })),

    updateTerrain: (terrain) =>
      set((state) => ({
        terrain: { ...state.terrain, ...terrain }
      })),

    setFrequency: (frequency) => set({ frequency }),

    // Méthodes de persistance
    loadFromStorage: async () => {
      try {
        // Import dynamique pour éviter les erreurs en mode web
        const { ElectronService } = await import('@/services/electronService');
        const electronService = ElectronService.getInstance();
        
        if (electronService.isAvailable()) {
          const { DesktopStorage } = await import('@/services/desktopStorage');
          const storage = DesktopStorage.getInstance();
          const savedData = await storage.getSimulationData();
          if (savedData) {
            set(savedData);
          }
        } else {
          // Fallback vers localStorage en mode web
          const savedData = localStorage.getItem('simulation_data');
          if (savedData) {
            set(JSON.parse(savedData));
          }
        }
      } catch (error) {
        console.error('Erreur lors du chargement des données de simulation:', error);
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
          await storage.saveSimulationData(currentState);
        } else {
          // Fallback vers localStorage en mode web
          const currentState = get();
          localStorage.setItem('simulation_data', JSON.stringify(currentState));
        }
      } catch (error) {
        console.error('Erreur lors de la sauvegarde des données de simulation:', error);
      }
    },
  }))
);

// Auto-sauvegarde lors des changements
useSimulationStore.subscribe(
  (state) => ({ antennas: state.antennas, terrain: state.terrain, frequency: state.frequency }),
  async (newState) => {
    // Éviter la sauvegarde lors du chargement initial
    if (newState.antennas.length > 0 || newState.terrain.points.length > 0) {
      await useSimulationStore.getState().saveToStorage();
    }
  }
);

// Chargement automatique au démarrage
if (typeof window !== 'undefined') {
  useSimulationStore.getState().loadFromStorage();
} 