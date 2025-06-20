import React, { useState } from 'react';
import InfoBulle from '../common/InfoBulle';


interface VisualizationFormValues {
  terrainType: string;
  obstacleCount: string;
  viewMode: string;
}

const initialValues: VisualizationFormValues = {
  terrainType: 'flat',
  obstacleCount: '5',
  viewMode: '3d'
};

const pedagogicHelp = {
  terrainType: {
    short: "Type de terrain pour la simulation.",
    example: "Ex : plat, montagneux, urbain",
    why: "Le type de terrain influence la propagation des ondes."
  },
  obstacleCount: {
    short: "Nombre d'obstacles à générer.",
    example: "Ex : 5 (peu d'obstacles), 20 (nombreux obstacles)",
    why: "Les obstacles créent des phénomènes de diffraction et d'atténuation."
  },
  viewMode: {
    short: "Mode de visualisation.",
    example: "Ex : 3D, 2D, carte de couverture",
    why: "Différentes vues permettent d'analyser différents aspects de la propagation."
  }
};

  

const SimulationVisualization: React.FC<{setObstacles: (obstacles: any) => void}> = ({setObstacles}) => {
  const [values, setValues] = useState(initialValues);
  const [showWhy, setShowWhy] = useState<{ [k: string]: boolean }>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleShowWhy = (field: string) => {
    setShowWhy((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleOpenGlossaire = () => {
    // Fonction pour ouvrir le glossaire si nécessaire
  };

  const generateRandomObstacles = () => {
    const count = parseInt(values.obstacleCount) || 5;
    const newObstacles = [];
    
    const obstacleTypes = ['building', 'mountain', 'forest'];
    
    for (let i = 0; i < count; i++) {
      const type = obstacleTypes[Math.floor(Math.random() * obstacleTypes.length)] as 'building' | 'mountain' | 'forest';
      newObstacles.push({
        id: `obstacle-${i}`,
        position: [
          (Math.random() - 0.5) * 50,
          Math.random() * 5,
          (Math.random() - 0.5) * 50
        ] as [number, number, number],
        dimensions: [
          Math.random() * 5 + 1,
          Math.random() * 10 + 1,
          Math.random() * 5 + 1
        ] as [number, number, number],
        type
      });
    }
    
    setObstacles(newObstacles);
  };

  return (
    <>
          <h3 className="text-lg font-semibold mb-4">Paramètres de visualisation</h3>
          
          <div className="space-y-4">
            {/* Type de terrain */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Type de terrain
                <InfoBulle 
                  content={<div>
                    <p>{pedagogicHelp.terrainType.short}</p>
                    <p className="text-gray-500 mt-1">{pedagogicHelp.terrainType.example}</p>
                    {showWhy.terrainType && <p className="text-gray-600 mt-1">{pedagogicHelp.terrainType.why}</p>}
                    <button 
                      type="button" 
                      onClick={() => handleShowWhy('terrainType')}
                      className="text-blue-600 hover:underline mt-1 text-xs"
                    >
                      {showWhy.terrainType ? "Masquer l'explication" : "Pourquoi ce paramètre ?"}
                    </button>
                  </div>}
                  glossaireId="terrain"
                  onOpenGlossaire={handleOpenGlossaire}
                />
              </label>
              <select
                name="terrainType"
                value={values.terrainType}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="flat">Plat</option>
                <option value="hilly">Vallonné</option>
                <option value="mountainous">Montagneux</option>
                <option value="urban">Urbain</option>
              </select>
            </div>
            
            {/* Nombre d'obstacles */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre d'obstacles
                <InfoBulle 
                  content={<div>
                    <p>{pedagogicHelp.obstacleCount.short}</p>
                    <p className="text-gray-500 mt-1">{pedagogicHelp.obstacleCount.example}</p>
                    {showWhy.obstacleCount && <p className="text-gray-600 mt-1">{pedagogicHelp.obstacleCount.why}</p>}
                    <button 
                      type="button" 
                      onClick={() => handleShowWhy('obstacleCount')}
                      className="text-blue-600 hover:underline mt-1 text-xs"
                    >
                      {showWhy.obstacleCount ? "Masquer l'explication" : "Pourquoi ce paramètre ?"}
                    </button>
                  </div>}
                  glossaireId="obstacle"
                  onOpenGlossaire={handleOpenGlossaire}
                />
              </label>
              <input
                type="number"
                name="obstacleCount"
                value={values.obstacleCount}
                onChange={handleChange}
                min="0"
                max="50"
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            {/* Mode de visualisation */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mode de visualisation
                <InfoBulle 
                  content={<div>
                    <p>{pedagogicHelp.viewMode.short}</p>
                    <p className="text-gray-500 mt-1">{pedagogicHelp.viewMode.example}</p>
                    {showWhy.viewMode && <p className="text-gray-600 mt-1">{pedagogicHelp.viewMode.why}</p>}
                    <button 
                      type="button" 
                      onClick={() => handleShowWhy('viewMode')}
                      className="text-blue-600 hover:underline mt-1 text-xs"
                    >
                      {showWhy.viewMode ? "Masquer l'explication" : "Pourquoi ce paramètre ?"}
                    </button>
                  </div>}
                  glossaireId="viewMode"
                  onOpenGlossaire={handleOpenGlossaire}
                />
              </label>
              <select
                name="viewMode"
                value={values.viewMode}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="3d">Vue 3D</option>
                <option value="2d">Vue 2D</option>
                <option value="coverage">Carte de couverture</option>
              </select>
            </div>
            
            <button
              onClick={generateRandomObstacles}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Générer des obstacles aléatoires
            </button>
          </div>
          
          {/* Bouton Glossaire */}
          <div className="mt-4 text-right">
            <button
              type="button"
              onClick={() => handleOpenGlossaire()}
              className="inline-flex items-center text-blue-600 hover:text-blue-800"
            >
              <span className="mr-1">📖</span> Glossaire
            </button>
          </div>
      </>
  );
};

export default SimulationVisualization;