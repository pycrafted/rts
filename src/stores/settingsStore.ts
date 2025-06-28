import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

interface SettingsState {
  // Apparence
  darkMode: boolean;
  animations: boolean;

  // Assistant IA
  autoSuggestions: boolean;
  responseDetail: 'basic' | 'normal' | 'detailed' | 'expert';

  // Simulations
  highQualityGraphics: boolean;
  refreshRate: 'low' | 'medium' | 'high';

  // Additional settings
  language: string;
  notifications: boolean;
  autoSave: boolean;
  performanceMode: boolean;
}

interface SettingsActions {
  toggleDarkMode: () => void;
  toggleAnimations: () => void;
  toggleAutoSuggestions: () => void;
  setResponseDetail: (detail: 'basic' | 'normal' | 'detailed' | 'expert') => void;
  toggleHighQualityGraphics: () => void;
  setRefreshRate: (rate: 'low' | 'medium' | 'high') => void;
  setLanguage: (language: string) => void;
  toggleNotifications: () => void;
  toggleAutoSave: () => void;
  togglePerformanceMode: () => void;
  resetSettings: () => void;
  loadFromStorage: () => Promise<void>;
  saveToStorage: () => Promise<void>;
}

type SettingsStore = SettingsState & SettingsActions;

// État initial optimisé
const initialState: SettingsState = {
  darkMode: false,
  animations: true,
  autoSuggestions: true,
  responseDetail: 'normal',
  highQualityGraphics: true,
  refreshRate: 'medium',
  language: 'fr',
  notifications: true,
  autoSave: true,
  performanceMode: false,
};

export const useSettingsStore = create<SettingsStore>()(
  subscribeWithSelector((set, get) => ({
    ...initialState,

    // Actions optimisées avec des mises à jour atomiques
    toggleDarkMode: () => set((state) => ({ 
      darkMode: !state.darkMode 
    })),

    toggleAnimations: () => set((state) => ({ animations: !state.animations })),

    toggleAutoSuggestions: () => set((state) => ({ autoSuggestions: !state.autoSuggestions })),

    setResponseDetail: (detail) => set({ responseDetail: detail }),

    toggleHighQualityGraphics: () => set((state) => ({ highQualityGraphics: !state.highQualityGraphics })),

    setRefreshRate: (rate) => set({ refreshRate: rate }),

    setLanguage: (language: string) => set({ language }),

    toggleNotifications: () => set((state) => ({ 
      notifications: !state.notifications 
    })),

    toggleAutoSave: () => set((state) => ({ 
      autoSave: !state.autoSave 
    })),

    togglePerformanceMode: () => set((state) => ({ 
      performanceMode: !state.performanceMode 
    })),

    resetSettings: () => set(initialState),

    // Méthodes de persistance
    loadFromStorage: async () => {
      try {
        const { ElectronService } = await import('@/services/electronService');
        const electronService = ElectronService.getInstance();
        
        if (electronService.isAvailable()) {
          const { DesktopStorage } = await import('@/services/desktopStorage');
          const storage = DesktopStorage.getInstance();
          const savedSettings = await storage.getSettings();
          if (savedSettings) {
            set({ ...initialState, ...savedSettings });
          }
        } else {
          // Fallback vers localStorage en mode web
          const savedSettings = localStorage.getItem('settings');
          if (savedSettings) {
            set({ ...initialState, ...JSON.parse(savedSettings) });
          }
        }
      } catch (error) {
        console.error('Erreur lors du chargement des paramètres:', error);
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
          await storage.saveSettings(currentState);
        } else {
          // Fallback vers localStorage en mode web
          const currentState = get();
          localStorage.setItem('settings', JSON.stringify(currentState));
        }
      } catch (error) {
        console.error('Erreur lors de la sauvegarde des paramètres:', error);
      }
    },
  }))
);

// Auto-sauvegarde lors des changements
useSettingsStore.subscribe(
  (state) => state,
  async (newState) => {
    // Éviter la sauvegarde lors du chargement initial
    if (newState.autoSave !== undefined) {
      await useSettingsStore.getState().saveToStorage();
    }
  }
);

// Chargement automatique au démarrage
if (typeof window !== 'undefined') {
  useSettingsStore.getState().loadFromStorage();
}

// Sélecteurs optimisés pour éviter les re-renders inutiles
export const useDarkMode = () => useSettingsStore((state) => state.darkMode);
export const useLanguage = () => useSettingsStore((state) => state.language);
export const useNotifications = () => useSettingsStore((state) => state.notifications);
export const useAutoSave = () => useSettingsStore((state) => state.autoSave);
export const usePerformanceMode = () => useSettingsStore((state) => state.performanceMode);

// Sélecteur pour les actions
export const useSettingsActions = () => useSettingsStore((state) => ({
  toggleDarkMode: state.toggleDarkMode,
  setLanguage: state.setLanguage,
  toggleNotifications: state.toggleNotifications,
  toggleAutoSave: state.toggleAutoSave,
  togglePerformanceMode: state.togglePerformanceMode,
  resetSettings: state.resetSettings,
})); 