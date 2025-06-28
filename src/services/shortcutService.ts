import { useEffect } from 'react';

export interface ShortcutConfig {
  key: string;
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  action: () => void;
  description: string;
}

export class ShortcutService {
  private static shortcuts: Map<string, ShortcutConfig> = new Map();

  static registerShortcut(config: ShortcutConfig): void {
    const key = this.getShortcutKey(config);
    this.shortcuts.set(key, config);
  }

  static unregisterShortcut(config: ShortcutConfig): void {
    const key = this.getShortcutKey(config);
    this.shortcuts.delete(key);
  }

  private static getShortcutKey(config: ShortcutConfig): string {
    const parts = [];
    if (config.ctrl) parts.push('Ctrl');
    if (config.shift) parts.push('Shift');
    if (config.alt) parts.push('Alt');
    parts.push(config.key.toUpperCase());
    return parts.join('+');
  }

  static handleKeyDown(event: KeyboardEvent): void {
    const key = event.key.toUpperCase();
    const ctrl = event.ctrlKey;
    const shift = event.shiftKey;
    const alt = event.altKey;

    // Ignorer les raccourcis dans les champs de saisie
    if (event.target instanceof HTMLInputElement || 
        event.target instanceof HTMLTextAreaElement ||
        event.target instanceof HTMLSelectElement) {
      return;
    }

    // Construire la clé de raccourci
    const parts = [];
    if (ctrl) parts.push('Ctrl');
    if (shift) parts.push('Shift');
    if (alt) parts.push('Alt');
    parts.push(key);
    const shortcutKey = parts.join('+');
    
    const shortcut = this.shortcuts.get(shortcutKey);

    if (shortcut) {
      event.preventDefault();
      shortcut.action();
    }
  }

  static getRegisteredShortcuts(): ShortcutConfig[] {
    return Array.from(this.shortcuts.values());
  }

  static clearAllShortcuts(): void {
    this.shortcuts.clear();
  }
}

// Hook React pour utiliser les raccourcis
export const useShortcuts = (shortcuts: ShortcutConfig[]) => {
  useEffect(() => {
    // Enregistrer les raccourcis
    shortcuts.forEach(shortcut => {
      ShortcutService.registerShortcut(shortcut);
    });

    // Gestionnaire d'événements
    const handleKeyDown = (event: KeyboardEvent) => {
      ShortcutService.handleKeyDown(event);
    };

    // Ajouter l'écouteur d'événements
    document.addEventListener('keydown', handleKeyDown);

    // Nettoyer lors du démontage
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      shortcuts.forEach(shortcut => {
        ShortcutService.unregisterShortcut(shortcut);
      });
    };
  }, [shortcuts]);
};

// Raccourcis par défaut pour l'application
export const defaultShortcuts: ShortcutConfig[] = [
  {
    key: 's',
    ctrl: true,
    action: () => {
      // Sauvegarder la simulation actuelle
      console.log('Ctrl+S: Sauvegarder la simulation');
      // TODO: Implémenter la sauvegarde
    },
    description: 'Sauvegarder la simulation'
  },
  {
    key: 'o',
    ctrl: true,
    action: () => {
      // Ouvrir un fichier de simulation
      console.log('Ctrl+O: Ouvrir un fichier');
      // TODO: Implémenter l'ouverture
    },
    description: 'Ouvrir un fichier de simulation'
  },
  {
    key: 'p',
    ctrl: true,
    action: () => {
      // Exporter en PDF
      console.log('Ctrl+P: Exporter en PDF');
      // TODO: Implémenter l'export PDF
    },
    description: 'Exporter en PDF'
  },
  {
    key: 'r',
    ctrl: true,
    action: () => {
      // Relancer la simulation
      console.log('Ctrl+R: Relancer la simulation');
      // TODO: Implémenter le relancement
    },
    description: 'Relancer la simulation'
  },
  {
    key: 'n',
    ctrl: true,
    action: () => {
      // Nouvelle simulation
      console.log('Ctrl+N: Nouvelle simulation');
      // TODO: Implémenter la nouvelle simulation
    },
    description: 'Nouvelle simulation'
  },
  {
    key: 'z',
    ctrl: true,
    action: () => {
      // Annuler
      console.log('Ctrl+Z: Annuler');
      // TODO: Implémenter l'annulation
    },
    description: 'Annuler'
  },
  {
    key: 'y',
    ctrl: true,
    action: () => {
      // Rétablir
      console.log('Ctrl+Y: Rétablir');
      // TODO: Implémenter le rétablissement
    },
    description: 'Rétablir'
  }
]; 