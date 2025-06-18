# 📶 Module de Simulation UMTS

## 🎯 Vue d'ensemble

Le module de simulation UMTS est un outil pédagogique interactif conçu pour aider les étudiants à comprendre les concepts fondamentaux du dimensionnement des réseaux UMTS (Universal Mobile Telecommunications System). Il permet de visualiser en temps réel l'impact des différents paramètres sur le facteur de charge et la qualité de service.

## 🚀 Fonctionnalités principales

### 📊 Calculs en temps réel
- **Facteur de charge** : Calcul automatique basé sur les paramètres utilisateur
- **Qualité de service (QoS)** : Évaluation de la qualité perçue par l'utilisateur
- **Dimensionnement Node B** : Estimation du nombre de stations de base nécessaires
- **Analyse de capacité** : Évaluation de la capacité réseau disponible

### 🎮 Contrôles interactifs
- **Nombre d'utilisateurs** : 1 à 200 utilisateurs simultanés
- **Débit par utilisateur** : 64 à 1024 kbps
- **Facteur d'activité** : 10% à 100%
- **Type de service** : Voix, données, vidéo
- **Puissance d'émission** : 30 à 50 dBm

### 🌐 Visualisation 3D
- **Node B stylisé** : Station de base avec indicateurs visuels
- **Utilisateurs mobiles** : Sphères colorées selon la QoS
- **Zone de couverture** : Sphère transparente autour du Node B
- **Indicateurs d'interférence** : Zones d'interférence optionnelles
- **Handovers** : Visualisation des transferts entre cellules

### 📚 Scénarios pédagogiques
- **Configuration de base** : Scénarios prédéfinis pour l'apprentissage
- **Cas d'usage réels** : Campus, quartier d'affaires, zone rurale
- **Types de trafic** : Voix, données, vidéo, services mixtes

## 🏗️ Architecture technique

### Structure des fichiers
```
src/components/simulation/umts/
├── SimulationUMTS.tsx          # Composant principal
├── NodeB3D.tsx                 # Visualisation 3D du Node B
├── MobileUser3D.tsx            # Visualisation 3D des utilisateurs
├── LoadFactorPanel.tsx         # Panneau de contrôle
├── ScenarioDropdown.tsx        # Sélection de scénarios
├── useUMTSSimulationStore.ts   # Gestion d'état Zustand
└── README.md                   # Documentation
```

### Technologies utilisées
- **React Three Fiber** : Rendu 3D
- **Zustand** : Gestion d'état
- **TypeScript** : Typage statique
- **Tailwind CSS** : Styling

## 📖 Utilisation pédagogique

### Objectifs d'apprentissage
1. **Comprendre le facteur de charge** : Impact du nombre d'utilisateurs et du trafic
2. **Analyser la QoS** : Relation entre charge réseau et qualité de service
3. **Dimensionner un réseau** : Estimation des ressources nécessaires
4. **Optimiser les paramètres** : Ajustement pour améliorer les performances

### Scénarios recommandés
1. **Débutant** : Commencer par "Voix - Configuration de base"
2. **Intermédiaire** : Explorer "Données - Charge modérée"
3. **Avancé** : Analyser "Vidéo - HD/4K" et "Campus universitaire"

### Exercices suggérés
1. **Exercice 1** : Déterminer le nombre maximum d'utilisateurs pour maintenir une QoS "excellent"
2. **Exercice 2** : Comparer l'impact du type de service sur le facteur de charge
3. **Exercice 3** : Optimiser la puissance d'émission pour une zone donnée
4. **Exercice 4** : Analyser l'effet du facteur d'activité sur les performances

## 🔧 Formules de calcul

### Facteur de charge
```
Load Factor = (Users × Data Rate × Activity Factor × Service Factor) / (WCDMA Chip Rate / Processing Gain)
```

Où :
- **WCDMA Chip Rate** : 3.84 MHz
- **Processing Gain** : 128 (pour la voix)
- **Service Factors** :
  - Voix : 0.67
  - Données : 0.8
  - Vidéo : 0.9

### Qualité de service
- **Excellent** : Load Factor < 30%
- **Good** : Load Factor < 60%
- **Fair** : Load Factor < 80%
- **Poor** : Load Factor ≥ 80%

### Nombre de Node Bs
- **1 Node B** : Load Factor ≤ 80%
- **Node Bs supplémentaires** : +1 pour chaque 20% de charge supplémentaire

## 🎨 Interface utilisateur

### Navigation 3D
- **Clic gauche + glisser** : Rotation de la caméra
- **Molette de souris** : Zoom avant/arrière
- **Clic droit + glisser** : Déplacement de la caméra

### Indicateurs visuels
- **Couleurs des utilisateurs** :
  - 🟢 Vert : QoS excellent
  - 🟡 Jaune : QoS bonne
  - 🟠 Orange : QoS moyenne
  - 🔴 Rouge : QoS mauvaise

- **Couleurs du Node B** :
  - Vert : Charge faible
  - Orange : Charge modérée
  - Rouge : Charge élevée

### Panneau de contrôle
- **Sliders interactifs** : Ajustement en temps réel
- **Résultats instantanés** : Mise à jour automatique
- **Scénarios prédéfinis** : Chargement rapide
- **Informations pédagogiques** : Aide contextuelle

## 🚀 Démarrage rapide

1. **Accéder à la simulation** : Menu → Simulation → Simulation UMTS
2. **Choisir un scénario** : Sélectionner un scénario prédéfinis
3. **Ajuster les paramètres** : Utiliser les sliders pour modifier les valeurs
4. **Observer les résultats** : Voir l'impact en temps réel
5. **Analyser la visualisation** : Explorer la scène 3D

## 🔍 Dépannage

### Problèmes courants
1. **Performance lente** : Réduire le nombre d'utilisateurs
2. **Affichage 3D flou** : Vérifier les pilotes graphiques
3. **Calculs incorrects** : Vérifier les paramètres d'entrée

### Optimisations
- **Mode développement** : Désactiver les statistiques de performance
- **Qualité graphique** : Ajuster selon les capacités de l'appareil
- **Nombre d'utilisateurs** : Limiter pour les appareils moins puissants

## 🔮 Évolutions futures

### Fonctionnalités prévues
- [ ] **Simulation multi-cellules** : Plusieurs Node Bs
- [ ] **Analyse d'interférence** : Calculs d'interférence inter-cellules
- [ ] **Handovers dynamiques** : Simulation des transferts
- [ ] **Export de données** : Sauvegarde des configurations
- [ ] **Comparaison de scénarios** : Analyse comparative

### Améliorations techniques
- [ ] **Performance** : Optimisation du rendu 3D
- [ ] **Accessibilité** : Support des lecteurs d'écran
- [ ] **Mobile** : Version adaptée aux tablettes
- [ ] **Offline** : Fonctionnement hors ligne

## 📞 Support

Pour toute question ou suggestion concernant le module de simulation UMTS :
- **Issues GitHub** : [Créer une issue](https://github.com/pycrafted/rts/issues)
- **Documentation** : Consulter le README principal
- **Contact** : support@rts-app.com

---

*Dernière mise à jour : Décembre 2024*

*Version : 1.0.0* 