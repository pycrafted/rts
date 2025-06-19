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
  subscribeWithSelector((set) => ({
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
  }))
);

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