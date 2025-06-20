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

# 📡 Simulation UMTS - Guide d'utilisation

## 🎯 Objectif du TP

Cette simulation vous permet d'étudier le **facteur de charge** d'un réseau UMTS (Universal Mobile Telecommunications System) et de comprendre comment différents paramètres affectent la capacité et la qualité de service.

## 🔗 Concepts clés

### UMTS (Universal Mobile Telecommunications System)
- Système de téléphonie mobile 3G
- Utilise la technologie **WCDMA** (Wideband Code Division Multiple Access)
- Permet à plusieurs utilisateurs de partager la même bande de fréquence

### WCDMA (Wideband Code Division Multiple Access)
- Technique d'accès multiple
- Chaque utilisateur a un code unique
- Plusieurs utilisateurs peuvent transmettre simultanément
- La capacité est limitée par l'interférence entre utilisateurs

### Facteur de charge
- Mesure l'utilisation de la capacité du réseau (0% à 100%)
- **< 30%** : Excellent - réseau sous-utilisé
- **30-60%** : Bon - utilisation normale
- **60-80%** : Moyen - attention requise
- **> 80%** : Critique - congestion probable

## 🎮 Comment utiliser la simulation

### 1. Navigation 3D
- **Souris** : Faire tourner la caméra
- **Molette** : Zoom avant/arrière
- **Clic droit + glisser** : Déplacer la vue

### 2. Éléments visuels
- **📡 Node B** : Station de base (centre de la scène)
- **🔵 Utilisateurs mobiles** : Sphères colorées selon la QoS
- **🎯 Cercles colorés** : Marqueurs de distance (500m à 4000m)
- **🔴 Zones d'interférence** : Sphères rouges (optionnel)
- **🔵 Handovers** : Cylindres bleus (optionnel)

### 3. Paramètres à ajuster

#### 👥 Nombre d'utilisateurs (1-200)
- **Impact** : Plus d'utilisateurs = facteur de charge plus élevé
- **Conseil** : Commencez avec 30-50 utilisateurs

#### 📶 Débit par utilisateur (64-1024 kbps)
- **Impact** : Débit plus élevé = charge réseau plus importante
- **Types** :
  - 64 kbps : Voix basique
  - 128-256 kbps : Données web
  - 384-512 kbps : Vidéo streaming
  - 1024 kbps : Vidéo HD

#### ⚡ Facteur d'activité (10%-100%)
- **Impact** : Pourcentage de temps où l'utilisateur transmet
- **Exemples** :
  - 10-30% : Navigation web
  - 40-60% : Streaming audio
  - 70-90% : Streaming vidéo
  - 100% : Téléchargement continu

#### 🎯 Type de service
- **📞 Voix** : 12.2 kbps (téléphonie)
- **📱 Données** : 64-384 kbps (web, email)
- **🎥 Vidéo** : 128-512 kbps (streaming)

#### 📡 Puissance Node B (30-50 dBm)
- **Impact** : Puissance d'émission de la station de base
- **Typique** : 43-47 dBm

## 🎯 Scénarios prédéfinis

### Scénarios de base
1. **📞 Voix - Configuration de base** : 30 utilisateurs, charge modérée
2. **📞 Voix - Réseau saturé** : 150 utilisateurs, heures de pointe
3. **📱 Données - Charge modérée** : Navigation web typique
4. **📱 Données - Charge élevée** : Utilisation intensive

### Scénarios avancés
5. **🎥 Vidéo - Streaming** : Vidéo qualité standard
6. **🎥 Vidéo - HD/4K** : Vidéo haute définition
7. **🔄 Services mixtes** : Mélange réaliste
8. **🎓 Campus universitaire** : Forte densité d'utilisateurs
9. **🏢 Quartier d'affaires** : Trafic professionnel
10. **🌾 Zone rurale** : Faible densité, couverture étendue

## 📊 Interprétation des résultats

### Facteur de charge
- **🟢 < 30%** : Le réseau peut accepter plus d'utilisateurs
- **🟡 30-60%** : Utilisation normale, bonne QoS
- **🟠 60-80%** : Attention, QoS peut se dégrader
- **🔴 > 80%** : Congestion probable, ajouter des Node Bs

### Qualité de service (QoS)
- **🟢 Excellent** : Expérience utilisateur optimale
- **🟡 Bon** : Performance acceptable
- **🟠 Moyen** : Dégradation perceptible
- **🔴 Pauvre** : Service inutilisable

### Node Bs requis
- Indique le nombre de stations de base nécessaires
- Augmente avec le facteur de charge
- Considérer la couverture géographique

## 💡 Conseils pour le TP

### Démarrage
1. Commencez par un scénario simple (voix basique)
2. Observez le facteur de charge initial
3. Augmentez progressivement le nombre d'utilisateurs
4. Notez quand la QoS se dégrade

### Expérimentation
1. **Testez différents services** : Comparez voix, données, vidéo
2. **Varyez le facteur d'activité** : Observez l'impact sur la charge
3. **Explorez les scénarios** : Utilisez les configurations prédéfinies
4. **Activez les options visuelles** : Interférences et handovers

### Analyse
1. **Identifiez les seuils** : Quand le facteur de charge devient critique
2. **Calculez la capacité** : Nombre max d'utilisateurs pour une QoS donnée
3. **Planifiez l'extension** : Combien de Node Bs pour supporter plus d'utilisateurs
4. **Comparez les services** : Quel service consomme le plus de ressources

## 🔧 Options d'affichage

### Zones d'interférence
- Affiche les zones où les signaux interfèrent
- Rouge : Interférence élevée
- Utile pour comprendre la limitation de capacité

### Handovers
- Montre les transferts entre cellules
- Bleu : Connexions de handover
- Important pour la continuité de service

## 📚 Pour aller plus loin

### Concepts avancés
- **Soft handover** : Connexion simultanée à plusieurs Node Bs
- **Power control** : Ajustement automatique de la puissance
- **Spreading factor** : Facteur d'étalement du code WCDMA
- **Ec/Io** : Rapport signal/interférence

### Optimisations
- **Dimensionnement** : Calculer le nombre optimal de Node Bs
- **Fréquences** : Planification des canaux
- **Antennes** : Orientation et gain
- **Trafic** : Modélisation des pics d'utilisation

---

**🎓 Bon travail !** Cette simulation vous aide à comprendre les principes fondamentaux de la planification de réseaux UMTS. 