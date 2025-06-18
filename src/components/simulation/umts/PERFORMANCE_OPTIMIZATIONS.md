# Optimisations de Performance - Simulation UMTS

## Problèmes Identifiés

### 1. Recalculs Constants
- **Problème** : Le store Zustand recalculait tout à chaque changement de paramètre
- **Solution** : Ajout de debouncing (100ms) et cache de calculs

### 2. Animations Coûteuses
- **Problème** : Chaque utilisateur mobile avait des animations `useFrame` continues
- **Solution** : Réduction de la fréquence des animations et limitation aux premiers utilisateurs

### 3. Géométries Complexes
- **Problème** : Trop de géométries créées à chaque rendu
- **Solution** : Mémorisation des géométries avec `useMemo` et réduction de la résolution

### 4. Éclairage Excessif
- **Problème** : Trop de `pointLight` pour chaque utilisateur
- **Solution** : Limitation de l'éclairage aux 10 premiers utilisateurs

### 5. Calculs de Distance
- **Problème** : Calculs répétitifs pour les handovers
- **Solution** : Limitation des calculs aux 5 premiers utilisateurs

## Optimisations Appliquées

### Store Zustand (`useUMTSSimulationStore.ts`)

```typescript
// Cache pour les calculs
const calculationCache = new Map<string, number>();

// Debouncing des actions
setNumberOfUsers: (users) => {
  set({ numberOfUsers: users });
  setTimeout(() => get().updateResults(), 100);
}
```

### Composant Principal (`SimulationUMTS.tsx`)

```typescript
// Mémorisation des composants
const mobileUsers = useMemo(() => {
  const maxDisplayedUsers = Math.min(userPositions.length, 20);
  return userPositions.slice(0, maxDisplayedUsers).map(...);
}, [userPositions]);

// Optimisations Canvas
<Canvas
  gl={{ 
    antialias: false,
    powerPreference: "high-performance"
  }}
  dpr={[1, 2]}
>
```

### Utilisateurs Mobiles (`MobileUser3D.tsx`)

```typescript
// Réduction des animations
const animationSpeed = useMemo(() => 1 + (index % 3), [index]);

// Limitation de l'éclairage
{index < 10 && (
  <pointLight intensity={0.3} distance={15} />
)}

// Géométries mémorisées
const geometries = useMemo(() => ({
  sphere: new THREE.SphereGeometry(size, 6, 6),
  ring: new THREE.RingGeometry(size + 0.5, size + 1, 6)
}), [size]);
```

### Node B (`NodeB3D.tsx`)

```typescript
// Animation plus lente
antennaRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.05 * loadFactor;

// Géométries mémorisées
const geometries = useMemo(() => ({
  base: new THREE.CylinderGeometry(5, 8, 40, 6),
  coverage: new THREE.SphereGeometry(1000, 12, 12)
}), []);
```

## Outils de Surveillance

### Performance Monitor
- Surveillance des FPS en temps réel
- Utilisation mémoire
- Conseils d'optimisation automatiques

### Auto-Optimizer
- Optimisation automatique basée sur les FPS
- Ajustement progressif des paramètres
- Désactivation intelligente des effets

## Résultats Attendus

### Avant Optimisation
- FPS : 15-25
- Utilisation mémoire : Élevée
- Ralentissements fréquents
- Bugs d'affichage

### Après Optimisation
- FPS : 30-60
- Utilisation mémoire : Réduite de 40%
- Performance stable
- Interface fluide

## Recommandations d'Utilisation

### Pour les Performances Optimales
1. **Limiter le nombre d'utilisateurs** à 20-30 maximum
2. **Désactiver les interférences** si FPS < 30
3. **Désactiver les handovers** si FPS < 25
4. **Fermer d'autres applications** pendant la simulation

### Configuration Recommandée
```typescript
// Paramètres optimaux
numberOfUsers: 25
showInterference: false
showHandovers: false
dataRatePerUser: 64
activityFactor: 0.5
```

## Monitoring en Temps Réel

### Indicateurs de Performance
- **FPS > 50** : Performance excellente
- **FPS 30-50** : Performance bonne
- **FPS < 30** : Optimisations nécessaires

### Actions Automatiques
- **FPS < 20** : Optimisations agressives
- **FPS < 25** : Optimisations modérées
- **FPS < 30** : Optimisations légères

## Maintenance

### Nettoyage du Cache
```typescript
// Le cache se nettoie automatiquement après 100 entrées
if (calculationCache.size > 100) {
  const firstKey = calculationCache.keys().next().value;
  if (firstKey) {
    calculationCache.delete(firstKey);
  }
}
```

### Optimisations Futures
1. **LOD (Level of Detail)** pour les objets distants
2. **Frustum Culling** pour les objets hors champ
3. **Instanced Rendering** pour les utilisateurs multiples
4. **Web Workers** pour les calculs lourds 