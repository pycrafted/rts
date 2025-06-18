# Composants de Visualisation GSM

Ce dossier contient les composants pour la simulation et visualisation GSM, incluant une nouvelle visualisation 3D de la couverture d'antenne.

## Composants

### GsmCoverageScene.tsx
Composant principal de visualisation 3D de la couverture GSM utilisant React Three Fiber.

**Fonctionnalités :**
- Antenne GSM stylisée (cylindre métallique avec panneau d'émission)
- Zone de couverture sphérique transparente
- Obstacle paramétrable qui affecte la couverture
- Simulation d'atténuation du signal derrière l'obstacle
- Contrôles de caméra (OrbitControls)
- Éclairage d'ambiance et directionnel
- Interface de contrôle pour ajuster le rayon de couverture

**Props :**
```typescript
interface GsmCoverageSceneProps {
  coverageRadius?: number;        // Rayon de la zone de couverture (défaut: 5)
  obstaclePosition?: [number, number, number];  // Position de l'obstacle (défaut: [2, 0, 3])
  obstacleSize?: [number, number, number];      // Taille de l'obstacle (défaut: [1, 2, 1])
  antennaHeight?: number;         // Hauteur de l'antenne (défaut: 3)
}
```

**Utilisation :**
```tsx
import GsmCoverageScene from './GsmCoverageScene';

<GsmCoverageScene 
  coverageRadius={6}
  obstaclePosition={[3, 0, 4]}
  obstacleSize={[1.5, 2.5, 1.5]}
  antennaHeight={4}
/>
```

### GSMCoverageDemo.tsx
Page de démonstration complète avec contrôles avancés pour tester la visualisation.

**Fonctionnalités :**
- Interface de contrôle complète pour tous les paramètres
- Panneau d'informations techniques
- Instructions de navigation 3D
- Explications pédagogiques

**Utilisation :**
```tsx
import GSMCoverageDemo from './GSMCoverageDemo';

<GSMCoverageDemo />
```

## Dépendances

Le composant utilise les bibliothèques suivantes :
- `@react-three/fiber` : Rendu 3D React
- `@react-three/drei` : Composants 3D utilitaires
- `three` : Moteur 3D sous-jacent
- `react` : Framework React

## Navigation 3D

- **Clic gauche + glisser** : Rotation de la caméra
- **Molette de souris** : Zoom avant/arrière
- **Clic droit + glisser** : Déplacement de la caméra

## Simulation Technique

### Couverture d'Antenne
- La zone de couverture est représentée par une sphère transparente
- Le rayon est paramétrable et simule la portée du signal
- L'antenne émet dans toutes les directions (modèle isotrope simplifié)

### Atténuation par Obstacles
- Les obstacles sont représentés par des boîtes rouges semi-transparentes
- L'atténuation est simulée visuellement par une réduction d'opacité
- L'effet d'ombre radio est modélisé derrière les obstacles

### Paramètres Physiques
- **Hauteur d'antenne** : Influence la portée et la qualité du signal
- **Position d'obstacle** : Détermine l'impact sur la couverture
- **Taille d'obstacle** : Plus l'obstacle est grand, plus l'atténuation est importante

## Intégration

Pour intégrer la visualisation dans une page existante :

```tsx
import GsmCoverageScene from './components/gsm/GsmCoverageScene';

function MyPage() {
  return (
    <div className="h-screen">
      <GsmCoverageScene 
        coverageRadius={5}
        obstaclePosition={[2, 0, 3]}
        obstacleSize={[1, 2, 1]}
        antennaHeight={3}
      />
    </div>
  );
}
```

## Améliorations Futures

- Ajout de multiples obstacles
- Simulation de réflexion et diffraction
- Modèles d'antenne plus réalistes
- Intégration avec les calculs de dimensionnement GSM existants
- Export de la visualisation en image/vidéo
- Mode de comparaison entre différents scénarios 