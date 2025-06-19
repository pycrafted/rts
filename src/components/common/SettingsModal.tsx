import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import Button from '../ui/Button';
import { useSettingsStore } from '../../stores/settingsStore';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const {
    darkMode,
    animations,
    autoSuggestions,
    responseDetail,
    highQualityGraphics,
    refreshRate,
    toggleDarkMode,
    toggleAnimations,
    toggleAutoSuggestions,
    setResponseDetail,
    toggleHighQualityGraphics,
    setRefreshRate,
  } = useSettingsStore();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <Card className="w-full max-w-lg">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-xl">
            <span className="mr-2">⚙️</span>
            Paramètres
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Section Apparence */}
          <div>
            <h3 className="font-semibold mb-4">🎨 Apparence</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Thème sombre</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer" 
                    checked={darkMode}
                    onChange={toggleDarkMode}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
              <div className="flex items-center justify-between">
                <span>Animations</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer" 
                    checked={animations}
                    onChange={toggleAnimations}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Section Assistant IA */}
          <div>
            <h3 className="font-semibold mb-4">🤖 Assistant IA</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Suggestions automatiques</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer" 
                    checked={autoSuggestions}
                    onChange={toggleAutoSuggestions}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Niveau de détail des réponses
                </label>
                <select 
                  className="w-full rounded-md border border-gray-300 p-2"
                  value={responseDetail}
                  onChange={(e) => setResponseDetail(e.target.value as any)}
                >
                  <option value="basic">Basique</option>
                  <option value="normal">Normal</option>
                  <option value="detailed">Détaillé</option>
                  <option value="expert">Expert</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section Simulations */}
          <div>
            <h3 className="font-semibold mb-4">🎮 Simulations</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Haute qualité graphique</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer" 
                    checked={highQualityGraphics}
                    onChange={toggleHighQualityGraphics}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fréquence de rafraîchissement
                </label>
                <select 
                  className="w-full rounded-md border border-gray-300 p-2"
                  value={refreshRate}
                  onChange={(e) => setRefreshRate(e.target.value as any)}
                >
                  <option value="low">Basse (30 FPS)</option>
                  <option value="medium">Moyenne (60 FPS)</option>
                  <option value="high">Haute (120 FPS)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Boutons d'action */}
          <div className="flex justify-end space-x-4 pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Fermer
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsModal; 