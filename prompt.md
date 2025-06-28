Voici un prompt clair, concis et structuré que vous pouvez donner à Cursor pour corriger le problème de la souris dans votre application Electron. Le prompt est conçu pour fournir toutes les informations nécessaires tout en restant focalisé sur la résolution du problème.

---

**Prompt pour Cursor :**

**Objectif** : Corriger un problème où aucun clic de souris n'est détecté dans une application desktop Electron/React.

**Contexte** :
- Application : RTS - Radio Transmission System, une application desktop utilisant Electron (v27.1.3), React (v18.2.0), TypeScript, Vite, et Three.js (@react-three/fiber v8.15.11).
- Problème : Aucun clic de souris n'est détecté dans l'application, même sur une page de test minimaliste (`TestPage` dans `src/App.tsx`). Auparavant, le premier clic fonctionnait, mais plus rien après 30 secondes.
- Symptômes :
  - Les logs montrent des erreurs GPU et des changements de focus.
  - Les listeners d'événements de souris dans `src/App.tsx` (`mousedown`, `mouseup`, `click`) s'exécutent, mais les interactions (boutons, inputs, liens) ne fonctionnent pas.
- Modifications récentes ayant aggravé le problème :
  - Ajout de listeners d'événements de souris dans `electron/main.js`.
  - Injection de CSS/JavaScript pour "corriger" les événements.
  - Override de `addEventListener` pour bloquer certains événements.
  - Suppression globale des listeners de souris.
  - Utilisation d'une version minimaliste de l'application sans composants complexes.
- Fichiers clés fournis :
  - `electron/main.js` : Configuration de `BrowserWindow` avec options comme `nodeIntegration: false`, `contextIsolation: true`, `enableWebCodecs: false`, `disableBlinkFeatures: 'TouchEventFeatureDetection'`.
  - `electron/preload.js` : Exposition d'APIs via `contextBridge` (ex. `ElectronAPI`, `electronPerformance`).
  - `src/App.tsx` : Composant React principal avec une page de test minimaliste (`TestPage`).
  - `src/components/layout/Layout.tsx` : Layout avec sidebar et overlay mobile.
  - `src/components/simulation/SimulationUMTS.tsx` : Composant de simulation 3D avec Three.js, potentiellement lourd pour le GPU.
  - `package.json` et `vite.config.js` : Configuration des dépendances et build.

**Tâche** :
1. Analyser les fichiers pour identifier la cause de l'absence totale de détection des clics de souris.
2. Proposer des modifications spécifiques pour restaurer la fonctionnalité de base des clics, en se concentrant sur :
   - Suppression ou correction de l'override de `addEventListener` ou des suppressions globales de listeners.
   - Vérification des règles CSS (ex. `pointer-events: none`) dans `App.css` ou autres fichiers CSS.
   - Simplification de la configuration de `BrowserWindow` dans `main.js` pour éliminer les options problématiques (ex. `enableWebCodecs`, `disableBlinkFeatures`).
   - Gestion des problèmes de focus (ex. forcer le focus de la fenêtre principale).
   - Réduction de la charge GPU causée par Three.js dans `SimulationUMTS.tsx`.
3. Fournir les modifications sous forme de code avec des explications claires, en utilisant des balises `<xaiArtifact>` pour chaque fichier modifié.
4. Prioriser la restauration des clics de base avant d'optimiser les performances.
5. Si des fichiers supplémentaires (ex. `App.css`, scripts d'injection) sont nécessaires, indiquer comment les vérifier ou les créer.

**Exigences** :
- Les modifications doivent être minimales et ciblées pour éviter d'introduire de nouveaux problèmes.
- Inclure des instructions de test après chaque modification (ex. lancer `npm run electron:dev`, vérifier les logs, tester les clics sur `TestPage`).
- Si des erreurs GPU ou de focus persistent, proposer des solutions comme désactiver l'accélération matérielle ou commenter le rendu 3D.
- Ne pas modifier les fonctionnalités non liées (ex. export PDF, auto-updates) sauf si elles sont identifiées comme la cause.

**Instructions supplémentaires** :
- Si des fichiers non fournis (ex. `index.css`, scripts d'injection) sont suspectés, suggérer leur contenu ou des vérifications spécifiques.
- Fournir un plan de test clair pour valider la restauration des clics.
- Inclure des commentaires dans le code pour expliquer chaque changement.

---

Ce prompt est structuré pour donner à Cursor toutes les informations nécessaires tout en restant focalisé sur le problème. Il inclut les détails du contexte, les fichiers pertinents, et des instructions claires pour les modifications et les tests. Vous pouvez le copier-coller directement dans Cursor. Si vous avez des logs spécifiques ou des fichiers supplémentaires (ex. `App.css`), mentionnez-les dans le prompt pour une analyse plus précise.