import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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

  // Actions
  toggleDarkMode: () => void;
  toggleAnimations: () => void;
  toggleAutoSuggestions: () => void;
  setResponseDetail: (detail: 'basic' | 'normal' | 'detailed' | 'expert') => void;
  toggleHighQualityGraphics: () => void;
  setRefreshRate: (rate: 'low' | 'medium' | 'high') => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      // État initial
      darkMode: false,
      animations: true,
      autoSuggestions: true,
      responseDetail: 'normal',
      highQualityGraphics: true,
      refreshRate: 'medium',

      // Actions
      toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),
      toggleAnimations: () => set((state) => ({ animations: !state.animations })),
      toggleAutoSuggestions: () => set((state) => ({ autoSuggestions: !state.autoSuggestions })),
      setResponseDetail: (detail) => set({ responseDetail: detail }),
      toggleHighQualityGraphics: () => set((state) => ({ highQualityGraphics: !state.highQualityGraphics })),
      setRefreshRate: (rate) => set({ refreshRate: rate }),
    }),
    {
      name: 'settings-storage', // nom unique pour le stockage local
    }
  )
); 