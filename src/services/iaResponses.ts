/**
 * Base de connaissances pour l'assistant IA en télécommunications
 * Contient les réponses pré-définies pour différentes catégories de questions
 * Conçu pour être pédagogue, chaleureux et complet, avec des explications claires
 * et des exemples pratiques pour tous les niveaux d'utilisateurs.
 */

interface ResponseCategory {
  keywords: string[];
  response: string;
}

// Réponses pour les interactions de base
const basicInteractions: ResponseCategory[] = [
  {
    keywords: ['bonjour', 'salut', 'hello', 'hey'],
    response: `Salut ! 😊 Bienvenue dans l'univers des télécommunications ! Je suis ton assistant IA, ici pour rendre les choses simples et amusantes. Que veux-tu explorer aujourd'hui ? Voici quelques idées :

📱 **GSM** : Découvre comment dimensionner un réseau 2G.
📶 **UMTS** : Plonge dans les réseaux 3G et leurs subtilités.
📡 **Hertzien** : Analyse les liaisons radio point à point.
🔌 **Fibre optique** : Comprends les réseaux à très haut débit.
🌐 **Simulations 3D** : Visualise tout ça en action !

Pose-moi une question, je suis prêt à t'aider ! 🚀`
  },
  {
    keywords: ['merci', 'thanks', 'thx'],
    response: `De rien ! 😄 C'était un plaisir de t'aider. Si tu as d'autres questions ou si tu veux creuser un sujet, je suis là pour toi. Qu'est-ce qu'on explore ensuite ?`
  },
  {
    keywords: ['au revoir', 'bye', 'ciao', 'a plus'],
    response: `À bientôt ! 😊 Merci d'avoir exploré avec moi. Reviens quand tu veux pour continuer à apprendre sur les télécoms. Bonne journée ! 👋`
  },
  {
    keywords: ['qui es-tu', 'qui es tu', 'présentation'],
    response: `Je suis ton assistant IA pour l'application RTS ! 😄 Mon rôle, c'est de t'accompagner dans l'univers des télécommunications avec des explications claires et un brin de bonne humeur. Que tu sois étudiant, ingénieur ou simplement curieux, je suis là pour :

- Répondre à tes questions sur GSM, UMTS, hertzien, fibre optique, et plus.
- T'expliquer les concepts complexes de manière simple.
- Te guider dans les simulations 3D et les calculs.
- Te donner des astuces pour tirer le meilleur de l'application.

Alors, par où commence-t-on ? 😊`
  }
];

// Réponses pour les questions sur l'application
const appQuestions: ResponseCategory[] = [
  {
    keywords: ['application', 'outil', 'fonctionnalités', 'que peut faire'],
    response: `Super, tu veux en savoir plus sur l'application RTS ? 😊 C'est un outil génial pour apprendre et expérimenter avec les réseaux télécoms ! Voici ce qu'elle peut faire pour toi :

📱 **Module GSM** : Planifie des réseaux 2G, calcule le nombre de sites, et visualise la couverture en 3D.
📶 **Module UMTS** : Dimensionne des réseaux 3G, analyse la charge réseau, et optimise les performances.
📡 **Module Hertzien** : Étudie les liaisons radio, calcule les zones de Fresnel, et simule les obstacles.
🔌 **Module Optique** : Planifie des réseaux fibre, analyse les pertes, et simule les défauts.
🌐 **Simulations 3D** : Visualise en temps réel les réseaux avec des animations interactives.
📊 **Tableaux de bord** : Suis les métriques clés comme la couverture, la capacité, et les coûts.
📖 **Aide pédagogique** : Profite d'un glossaire, d'infobulles, et de scénarios guidés.

Tu veux découvrir un module en particulier ou voir comment utiliser un scénario ? Dis-moi tout ! 😄`
  },
  {
    keywords: ['scénarios', 'exemples', 'cas d\'usage'],
    response: `Les scénarios prédéfinis de l'application sont parfaits pour apprendre en s'amusant ! 😄 Voici un aperçu :

**Scénarios GSM** :
- **Urbain** : Couvre une ville dense avec beaucoup d'utilisateurs (ex. : 5000 hab/km², 30 mErlang).
- **Rural** : Planifie un réseau pour une grande zone avec peu d'habitants (ex. : 100 hab/km²).
- **Industriel** : Gère un trafic intense dans une usine (ex. : machines connectées).
- **Campus** : Optimise pour une université avec forte densité d'étudiants.
- **Autoroute** : Couvre une route linéaire avec des utilisateurs en mouvement.
- **Zone touristique** : Adapte la capacité pour des pics saisonniers.

**Scénarios UMTS** :
- **Voix + Données** : Combine appels et navigation internet (ex. : 12.2 kbps voix, 64 kbps data).
- **Vidéo** : Optimise pour le streaming (ex. : 384 kbps).
- **Zone dense** : Gère les interférences dans une ville.

**Scénarios Hertzien** :
- **Liaison longue** : Relie deux sites à 50 km (ex. : 6 GHz, obstacles naturels).
- **Liaison urbaine** : Évite les immeubles en zone dense.

**Scénarios Optique** :
- **Réseau métropolitain** : Relie des bâtiments sur 10 km.
- **Liaison longue distance** : Simule une fibre de 100 km avec épissures.

Chaque scénario vient avec des paramètres réalistes et des explications pour t'aider à comprendre. Veux-tu essayer un scénario spécifique ou en créer un personnalisé ? 😊`
  },
  {
    keywords: ['aide', 'comment utiliser', 'tutoriel'],
    response: `Pas de panique, je vais t'expliquer comment utiliser l'application comme un pro ! 😊 Voici les étapes pour te lancer :

1. **Choisis un module** : Va dans le menu pour sélectionner GSM, UMTS, Hertzien, ou Optique.
2. **Explore les scénarios** : Utilise un scénario prédéfini (urbain, rural, etc.) pour commencer facilement.
3. **Entre les paramètres** : Remplis les champs comme la zone de couverture ou le trafic. Les infobulles t'expliquent tout !
4. **Lance une simulation** : Clique sur "Calculer" pour voir les résultats (ex. : nombre de sites, couverture 3D).
5. **Analyse et joue** : Modifie les paramètres, observe les changements en temps réel, et utilise les graphiques pour comprendre.

**Astuces pour débuter** :
- Commence avec un scénario simple (ex. : GSM rural).
- Pose-moi des questions si un terme te semble flou.
- Consulte le glossaire dans l'application pour les définitions.
- Sauvegarde tes projets pour y revenir plus tard.

Tu veux un guide détaillé pour un module précis ou une démo d'une fonctionnalité ? 😄`
  },
  {
    keywords: ['interface', 'navigation', 'comment naviguer'],
    response: `L'interface de l'application est conçue pour être intuitive, et je vais t'aider à t'y retrouver ! 😊 Voici un petit tour d'horizon :

**Éléments principaux** :
- **Menu principal** : En haut ou sur le côté, il te donne accès aux modules (GSM, UMTS, etc.).
- **Tableau de bord** : Affiche les métriques globales (sites, couverture, coûts).
- **Panneaux flottants** : Contiennent les formulaires pour entrer les paramètres.
- **Simulations 3D** : Visualise les réseaux avec des contrôles interactifs (rotation, zoom).
- **Assistant IA** : C'est moi ! 😄 Accessible via Ctrl + / pour répondre à tes questions.

**Raccourcis utiles** :
- **Ctrl + ,** : Ouvre les paramètres.
- **Ctrl + B** : Montre/cache la barre latérale.
- **Ctrl + D** : Passe en mode sombre/clair.
- **Space** : Lance/pause une simulation 3D.

**Conseils de navigation** :
- Clique sur les infobulles pour des explications rapides.
- Utilise les flèches ou la souris pour explorer les visualisations 3D.
- Sauvegarde tes paramètres pour ne pas repartir de zéro.

Si tu te sens perdu dans un module ou une fonctionnalité, dis-le-moi, je te guide ! 😊`
  }
];

// Réponses pour les questions sur le GSM
const gsmResponses: ResponseCategory[] = [
  {
    keywords: ['c\'est quoi gsm', 'qu\'est-ce que gsm', 'définition gsm', 'gsm définition', 'gsm explication'],
    response: `Le GSM, c'est la 2ème génération de réseaux mobiles ! 😊 Laisse-moi t'expliquer simplement :

**Qu'est-ce que le GSM ?**
GSM = Global System for Mobile Communications, c'est la technologie 2G qui a démocratisé le téléphone mobile dans les années 1990.

**Caractéristiques principales** :
- **Bande passante** : 200 kHz par canal
- **Débits** : 9.6 kbps (voix) à 171.2 kbps (données)
- **Services** : Voix, SMS, données basiques
- **Architecture** : TDMA (Time Division Multiple Access)

**Avantages du GSM** :
1. **Couverture mondiale** : Standard international
2. **Fiabilité** : Technologie mature et stable
3. **Coût** : Infrastructure économique
4. **Batterie** : Consommation faible

**Composants du réseau** :
- **BTS** : Station de base (antenne)
- **TRX** : Module émetteur/récepteur
- **MSC** : Centre de commutation mobile
- **HLR** : Registre des abonnés

**Applications** :
- Appels voix
- SMS/MMS
- Navigation internet basique
- Services de localisation

Tu veux en savoir plus sur un aspect spécifique comme les TRX ou la planification ? 😄`
  },
  {
    keywords: ['trx', 'gsm', 'bts', 'transmitter', 'receiver', 'station base gsm', 'transmetteur', 'récepteur'],
    response: `Tu veux en savoir plus sur les TRX dans un réseau GSM ? Pas de souci, je t'explique tout de manière simple ! 😊

**Qu'est-ce qu'un TRX ?**
Un TRX (Transmitter/Receiver) est un module dans une BTS (station de base GSM) qui gère les communications radio. Chaque TRX peut gérer **8 canaux temporels** (timeslots), dont un est souvent réservé pour le contrôle (BCCH).

**Points clés** :
- **Capacité** : 7 canaux pour le trafic (voix ou données à 9.6 kbps) + 1 pour le BCCH.
- **Dimensionnement** : Dépend du trafic (en Erlangs) et du GoS (Grade of Service, généralement 1-2 %).
- **Facteur d'activité** : Typiquement 60-70 %, car tous les utilisateurs ne parlent pas en même temps.

**Formule pour calculer le nombre de TRX** :
Nombre de TRX = ⌈(Trafic total / 7) × (1 / 0.7)⌉
- Trafic total : en Erlangs.
- 7 : canaux de trafic par TRX.
- 0.7 : facteur d'activité.

**Exemple** :
Pour 1000 abonnés avec 25 mErlang chacun :
1. Trafic total = 1000 × 0.025 = 25 Erlangs.
2. Avec GoS 2 %, on trouve ~35 canaux nécessaires (via table Erlang B).
3. TRX = ⌈35 / 7⌉ = 5 TRX par site.

Envie d'essayer un calcul dans l'application ou de voir une simulation 3D d'une BTS ? 😄`
  },
  {
    keywords: ['erlang', 'trafic', 'gos'],
    response: `L'Erlang, c'est un concept clé pour comprendre le trafic dans les réseaux télécoms ! 😊 Laisse-moi t'expliquer ça clairement.

**Qu'est-ce qu'un Erlang ?**
Un Erlang mesure l'utilisation d'une ressource (comme un canal) pendant une heure. Par exemple, 1 Erlang = un canal utilisé à 100 % pendant 1 heure.

**Pourquoi c'est important ?**
On l'utilise pour dimensionner les réseaux (GSM, UMTS, etc.) en fonction du trafic prévu.

**Formules clés** :
1. **Trafic par abonné** : Trafic (Erlang) = Nombre d'abonnés × Trafic par abonné (mErlang).
   - Résidentiel : 20-50 mErlang.
   - Professionnel : 80-150 mErlang.
2. **Erlang B** : Calcule le nombre de canaux nécessaires pour un GoS donné :
   GoS = (A^N / N!) / Σ(A^k / k!)
   - A = trafic offert (Erlangs).
   - N = nombre de canaux.
   - GoS = probabilité de blocage (ex. : 2 %).

**Exemple pratique** :
Pour 200 utilisateurs à 30 mErlang chacun :
1. Trafic total = 200 × 0.03 = 6 Erlangs.
2. Avec GoS 1 %, il faut ~14 canaux (via table Erlang B).
3. Pour GSM, cela donne ~2 TRX (car 7 canaux par TRX).

Tu veux tester un calcul dans le module GSM ou comprendre mieux la table Erlang ? 😄`
  },
  {
    keywords: ['dimensionnement gsm', 'calcul trx', 'planification gsm'],
    response: `Dimensionner un réseau GSM, c'est tout un art, mais je vais te guider pas à pas ! 😊 Voici comment ça marche :

**Étapes du dimensionnement** :
1. **Analyse des besoins** :
   - **Superficie** : Quelle zone veux-tu couvrir (ex. : 10 km²) ?
   - **Densité** : Combien d'habitants par km² (ex. : 2000 hab/km²) ?
   - **Trafic** : Combien de temps chaque utilisateur passe en communication (ex. : 25 mErlang) ?
   - **Pénétration** : Pourcentage d'utilisateurs équipés (ex. : 80 %).

2. **Calcul du trafic total** :
   Trafic (Erlangs) = Population × Densité × Pénétration × Trafic par abonné / 1000.

3. **Nombre de canaux** :
   Utilise la formule Erlang B pour trouver le nombre de canaux nécessaires avec un GoS (ex. : 2 %).

4. **Nombre de TRX** :
   TRX = ⌈Canaux / 7⌉ (7 canaux de trafic par TRX, 1 pour BCCH).

5. **Planification géographique** :
   - Détermine le nombre de sites (BTS) selon la couverture.
   - Planifie les fréquences pour éviter les interférences.

**Exemple** :
Pour une ville de 5 km², 3000 hab/km², 25 mErlang, 70 % pénétration :
1. Population = 5 × 3000 = 15 000 habitants.
2. Trafic = 15 000 × 0.7 × 0.025 = 262.5 Erlangs.
3. Pour GoS 2 %, ~350 canaux nécessaires.
4. TRX = ⌈350 / 7⌉ = 50 TRX, soit ~17 BTS (3 TRX par site).

Tu veux essayer ce calcul dans l'application ou voir une simulation de couverture ? 😄`
  },
  {
    keywords: ['cellule gsm', 'secteur', 'couverture'],
    response: `Les cellules GSM, c'est le cœur du réseau mobile ! 😊 Voici tout ce qu'il faut savoir :

**Qu'est-ce qu'une cellule GSM ?**
Une cellule est la zone couverte par une BTS (station de base). Elle peut être divisée en secteurs pour optimiser la couverture.

**Types de cellules** :
1. **Omnidirectionnelle** :
   - Couvre 360°.
   - Rayon : 1-3 km en ville, jusqu'à 20 km en campagne.
   - Idéal pour zones peu denses.
2. **Sectorielle** :
   - Divisée en 3 secteurs (120° chacun).
   - Rayon : 2-5 km en ville.
   - Meilleure gestion des fréquences.
3. **Pico/Micro-cellules** :
   - Rayon : 100-500 m.
   - Utilisées dans les zones très denses (ex. : centres commerciaux).

**Facteurs de dimensionnement** :
- **Puissance d'émission** : Détermine la portée.
- **Hauteur d'antenne** : Plus haute = meilleure couverture.
- **Obstacles** : Bâtiments, collines réduisent la portée.
- **Interférences** : Fréquences voisines à éviter.

**Planification des fréquences** :
- Utilise des motifs de réutilisation (ex. : 4/12, 3/9) pour minimiser les interférences.
- Exemple : Dans un motif 4/12, 4 fréquences sont réutilisées sur 12 secteurs.

**Dans l'application** :
Tu peux visualiser les cellules en 3D et ajuster la puissance ou la hauteur pour voir l'impact sur la couverture.

Veux-tu explorer un type de cellule ou simuler une planification ? 😄`
  },
  {
    keywords: ['interférences gsm', 'co-canal', 'adjacent'],
    response: `Les interférences en GSM, c'est un défi à relever pour un réseau performant ! 😊 Je t'explique :

**Qu'est-ce qu'une interférence ?**
Une interférence se produit quand deux signaux radio se chevauchent et perturbent la communication.

**Types d'interférences** :
1. **Co-canal** : Deux cellules utilisent la même fréquence.
   - Solution : Planifier des fréquences avec un motif de réutilisation (ex. : 4/12).
2. **Canal adjacent** : Fréquences trop proches (ex. : 200 kHz d'écart).
   - Solution : Espacer les fréquences d'au moins 400 kHz.
3. **Intermodulation** : Signaux combinés créent de nouvelles fréquences.
   - Solution : Vérifier les équipements et filtres.

**Comment les réduire ?**
- **Planification des fréquences** : Utilise des motifs comme 4/12 ou 3/9.
- **Puissance d'émission** : Réduis-la dans les zones denses.
- **Tilt d'antenne** : Oriente les antennes pour limiter les chevauchements.
- **Simulations** : Teste différents scénarios dans l'application pour voir l'impact.

**Exemple** :
Dans une ville, deux BTS proches utilisent la même fréquence. Résultat : appels coupés. En changeant pour un motif 4/12, les interférences chutent.

Tu veux simuler une planification de fréquences ou en savoir plus sur un type d'interférence ? 😄`
  }
];

// Réponses pour les questions sur l'UMTS
const umtsResponses: ResponseCategory[] = [
  {
    keywords: ['c\'est quoi umts', 'qu\'est-ce que umts', 'définition umts', 'umts définition'],
    response: `L'UMTS, c'est la 3ème génération de réseaux mobiles ! 😊 Laisse-moi t'expliquer simplement :

**Qu'est-ce que l'UMTS ?**
UMTS = Universal Mobile Telecommunications System, c'est la technologie 3G qui a révolutionné les télécoms dans les années 2000.

**Caractéristiques principales** :
- **Bande passante** : 3.84 MHz par porteuse
- **Débits** : Jusqu'à 384 kbps (vs 9.6 kbps en GSM)
- **Services** : Voix + données simultanées
- **Architecture** : WCDMA (Wideband Code Division Multiple Access)

**Avantages par rapport au GSM** :
1. **Débits plus élevés** : Navigation internet, vidéo
2. **Qualité de service** : Meilleure gestion des priorités
3. **Efficacité spectrale** : Plus d'utilisateurs par MHz
4. **Mobilité** : Handover fluide entre cellules

**Composants du réseau** :
- **NodeB** : Station de base (équivalent BTS en GSM)
- **RNC** : Contrôleur radio (gère plusieurs NodeB)
- **Core Network** : Cœur de réseau pour la commutation

**Applications** :
- Appels voix haute qualité
- Navigation internet mobile
- Streaming vidéo
- Services de données avancés

Tu veux en savoir plus sur un aspect spécifique comme les NodeB ou le facteur de charge ? 😄`
  },
  {
    keywords: ['nodeb', 'umts', '3g', 'node', 'node b', 'station base umts'],
    response: `Le NodeB, c'est le cœur du réseau UMTS (3G) ! 😊 Laisse-moi t'expliquer ça simplement.

**Qu'est-ce qu'un NodeB ?**
C'est la station de base UMTS, équivalent de la BTS en GSM, mais pour la 3G. Elle gère les communications radio avec les téléphones.

**Caractéristiques clés** :
- **Facteur de charge (η)** : Mesure la charge du réseau (limite : ~75 %).
- **Bande passante** : 3.84 MHz par porteuse.
- **Contrôle de puissance** : Ajuste la puissance 1500 fois par seconde pour réduire les interférences.
- **Handover** : Passe d'une cellule à une autre sans coupure.

**Formule du facteur de charge** :
η = Σ((Eb/N0) × (R/W) × (1 + i))
- Eb/N0 : Rapport signal/bruit requis.
- R : Débit du service (ex. : 12.2 kbps pour voix).
- W : Bande passante (3.84 MHz).
- i : Facteur d'interférence (0.5-1 typique).

**Exemple** :
Pour 50 utilisateurs voix (12.2 kbps, Eb/N0 = 5 dB, i = 0.6) :
1. Charge par utilisateur = (10^(5/10)) × (12.2 / 3840) × (1 + 0.6) ≈ 0.01.
2. Charge totale = 50 × 0.01 = 0.5 (50 %).

Tu veux dimensionner un NodeB ou voir une simulation 3D UMTS ? 😄`
  },
  {
    keywords: ['facteur de charge', 'load factor', 'capacité umts'],
    response: `Le facteur de charge en UMTS, c'est ce qui détermine si ton réseau 3G tient la route ! 😊 Voici les détails :

**Qu'est-ce que le facteur de charge ?**
C'est le pourcentage de la capacité radio utilisée. Trop élevé (ex. : >75 %), et le réseau devient instable.

**Formule** :
η = Σ(ηi) + ηother + ηadj
- ηi : Charge par utilisateur = (Eb/N0) × (R/W) × (1 + i).
- ηother : Interférences propres.
- ηadj : Interférences des cellules voisines.

**Paramètres** :
- **Eb/N0** : Rapport signal/bruit (ex. : 5 dB pour voix).
- **R** : Débit (ex. : 12.2 kbps voix, 384 kbps data).
- **W** : Bande passante (3.84 MHz).
- **i** : Facteur d'interférence (0.5-1).

**Exemple** :
Pour 20 utilisateurs data (64 kbps, Eb/N0 = 4 dB, i = 0.7) :
1. ηi = (10^(4/10)) × (64 / 3840) × (1 + 0.7) ≈ 0.045.
2. Charge totale = 20 × 0.045 = 0.9 (90 %, trop élevé !).

**Dans l'application** :
Tu peux ajuster Eb/N0 ou le débit et voir l'impact en 3D.

Veux-tu calculer une charge ou optimiser un scénario UMTS ? 😄`
  },
  {
    keywords: ['optimisation umts', 'paramètres umts', 'tilt'],
    response: `Optimiser un réseau UMTS, c'est comme accorder un instrument : il faut ajuster les bons paramètres ! 😊 Voici comment faire :

**Paramètres d'optimisation** :
1. **Tilt d'antenne** :
   - **Électrique** : 2-8° pour ajuster la couverture.
   - **Mécanique** : 0-15° pour réduire les interférences.
   - Exemple : Un tilt de 4° réduit les interférences en ville.
2. **Puissance pilote (CPICH)** :
   - 10-15 % de la puissance totale.
   - Trop fort = interférences, trop faible = mauvaise couverture.
3. **Handover** :
   - **1a** : Ajoute une cellule au set actif.
   - **1b** : Supprime une cellule.
   - **1c** : Remplace une cellule.
   - Ajuste les seuils pour fluidifier les transitions.
4. **Contrôle de puissance** :
   - Inner loop : 1500 Hz pour minimiser les interférences.
   - Outer loop : Ajuste Eb/N0 dynamiquement.

**Exemple** :
Dans une zone urbaine, un tilt de 6° et une puissance pilote de 12 % réduisent les interférences de 20 %.

**Dans l'application** :
Teste ces paramètres dans la simulation UMTS pour voir leur impact en temps réel.

Veux-tu optimiser un paramètre spécifique ou voir une démo ? 😄`
  },
  {
    keywords: ['handover', 'transition', 'mobilité umts'],
    response: `Le handover en UMTS, c'est ce qui permet à ton appel de ne pas couper quand tu te déplaces ! 😊 Voici l'essentiel :

**Qu'est-ce qu'un handover ?**
C'est le passage d'une cellule à une autre sans interruption de la connexion. En UMTS, il est "soft" (connexion à plusieurs cellules simultanément) ou "hard" (connexion unique).

**Types de handover** :
1. **Soft Handover** :
   - Le mobile est connecté à plusieurs NodeB.
   - Utilise 20-40 % de capacité supplémentaire.
   - Réduit les pertes d'appel.
2. **Hard Handover** :
   - Passage direct d'une cellule à une autre.
   - Utilisé entre fréquences différentes.
3. **Inter-système** :
   - Passage de 3G à 2G (ex. : UMTS à GSM).

**Paramètres clés** :
- **Seuil 1a** : Ajoute une cellule (ex. : -3 dB par rapport à la meilleure).
- **Seuil 1b** : Supprime une cellule (ex. : -6 dB).
- **Fenêtre temporelle** : Temps pour confirmer le handover.

**Exemple** :
Dans une ville, un seuil 1a de -3 dB permet un soft handover fluide pour 90 % des utilisateurs.

**Dans l'application** :
Simule un handover en 3D pour voir comment le mobile passe d'un NodeB à un autre.

Tu veux en savoir plus sur un type de handover ou tester une simulation ? 😄`
  }
];

// Réponses pour les liaisons hertziennes
const hertzienResponses: ResponseCategory[] = [
  {
    keywords: ['c\'est quoi hertzien', 'qu\'est-ce que hertzien', 'définition hertzien', 'hertzien définition', 'faisceaux hertziens'],
    response: `Les liaisons hertziennes, c'est la transmission radio point à point ! 😊 Laisse-moi t'expliquer simplement :

**Qu'est-ce qu'une liaison hertzienne ?**
C'est une connexion radio entre deux points fixes utilisant des ondes électromagnétiques pour transmettre des données, voix ou vidéo.

**Caractéristiques principales** :
- **Fréquences** : 2 GHz à 80 GHz (micro-ondes)
- **Portée** : 1 km à 50 km selon la fréquence
- **Débits** : 2 Mbps à 10 Gbps
- **Architecture** : Point à point ou point à multipoint

**Avantages des liaisons hertziennes** :
1. **Rapidité de déploiement** : Pas de câbles à tirer
2. **Flexibilité** : Facile à déplacer ou modifier
3. **Coût** : Économique pour distances moyennes
4. **Licence** : Fréquences attribuées par l'État

**Composants d'une liaison** :
- **Antennes paraboliques** : Émission et réception
- **Émetteur/récepteur** : Conversion signal électrique/radio
- **Câbles coaxiaux** : Connexion antenne/équipement
- **Système de protection** : Redondance et monitoring

**Applications** :
- Connexion entre sites d'entreprise
- Backhaul pour réseaux mobiles
- Télévision et radio
- Services internet haut débit

**Facteurs à considérer** :
- Zones de Fresnel (dégagement)
- Obstacles sur le trajet
- Conditions météorologiques
- Interférences radio

Tu veux en savoir plus sur les zones de Fresnel ou le bilan de liaison ? 😄`
  },
  {
    keywords: ['fresnel', 'hertzien', 'faisceaux'],
    response: `Les zones de Fresnel, c'est un concept clé pour les liaisons hertziennes ! 😊 Je t'explique simplement :

**Qu'est-ce qu'une zone de Fresnel ?**
C'est une zone ellipsoïdale autour de la ligne de vue directe entre deux antennes. La première zone (F1) doit être dégagée à 60 % minimum pour éviter les pertes.

**Formule** :
r₁ = √(λ × d₁ × d₂ / (d₁ + d₂))
- r₁ : Rayon de la première zone (m).
- λ : Longueur d'onde (m).
- d₁, d₂ : Distances depuis chaque antenne (m).

**Exemple** :
Pour une liaison de 10 km à 6 GHz (λ = 0.05 m) :
1. À mi-parcours (d₁ = d₂ = 5 km) :
2. r₁ = √(0.05 × 5000 × 5000 / 10000) ≈ 11.2 m.
3. Dégagement minimum = 60 % × 11.2 ≈ 6.7 m.

**Conseils** :
- Vérifie les obstacles (arbres, bâtiments).
- Prends en compte la courbure terrestre pour les longues distances.
- Simule dans l'application pour visualiser la zone en 3D.

Tu veux calculer une zone de Fresnel ou voir une simulation hertzienne ? 😄`
  },
  {
    keywords: ['bilan de liaison', 'link budget', 'puissance reçue'],
    response: `Le bilan de liaison, c'est comme un budget pour ton signal radio ! 😊 Voici comment ça fonctionne :

**Qu'est-ce qu'un bilan de liaison ?**
Il calcule la puissance reçue après avoir pris en compte tous les gains et pertes entre l'émetteur et le récepteur.

**Composants** :
1. **Émission** :
   - Puissance émise (ex. : 30 dBm).
   - Gain d'antenne (ex. : 20 dBi).
   - Pertes de câbles (ex. : -2 dB).
2. **Propagation** :
   - Pertes en espace libre : L = 20 log₁₀(4πd/λ).
   - Pertes atmosphériques (ex. : pluie, -1 dB).
3. **Réception** :
   - Gain d'antenne (ex. : 20 dBi).
   - Sensibilité du récepteur (ex. : -90 dBm).

**Formule** :
PRx = PTx + GaTx - Lprop + GaRx - Lsys

**Exemple** :
Liaison de 10 km à 6 GHz, PTx = 30 dBm, GaTx = 20 dBi, GaRx = 20 dBi, Lsys = 2 dB :
1. Lprop = 20 log₁₀(4π × 10000 / 0.05) ≈ 132 dB.
2. PRx = 30 + 20 - 132 + 20 - 2 = -64 dBm.
3. Si sensibilité = -90 dBm, marge = 26 dB (très bonne !).

Teste un bilan dans l'application ou pose-moi une question ! 😄`
  },
  {
    keywords: ['diffraction', 'obstacles', 'pertes diffraction'],
    response: `La diffraction, c'est quand les ondes radio contournent un obstacle, mais ça peut causer des pertes ! 😊 Voici l'essentiel :

**Qu'est-ce que la diffraction ?**
Quand une onde rencontre un obstacle (ex. : colline, bâtiment), elle se plie autour, mais perd de la puissance.

**Calcul des pertes** :
1. **Paramètre de diffraction (v)** :
   v = h × √(2/λ × (1/d₁ + 1/d₂))
   - h : Hauteur de l'obstacle (m).
   - λ : Longueur d'onde (m).
   - d₁, d₂ : Distances depuis les antennes (m).
2. **Pertes** :
   - v < -0.8 : Pertes négligeables.
   - -0.8 < v < 0 : Pertes modérées (~6-10 dB).
   - v > 0 : Pertes importantes (>10 dB).

**Exemple** :
Obstacle de 10 m sur une liaison de 5 km à 6 GHz (λ = 0.05 m) :
1. v = 10 × √(2/0.05 × (1/2500 + 1/2500)) ≈ 2.5.
2. Perte ≈ 20 dB (importante, il faut peut-être rehausser l'antenne !).

**Dans l'application** :
Simule un obstacle en 3D pour voir son impact sur la liaison.

Veux-tu calculer une perte ou visualiser une diffraction ? 😄`
  },
  {
    keywords: ['disponibilité', 'fiabilité', 'hertzien'],
    response: `La disponibilité d'une liaison hertzienne, c'est la garantie que ton réseau fonctionne presque tout le temps ! 😊 Voici ce qu'il faut savoir :

**Qu'est-ce que la disponibilité ?**
C'est le pourcentage de temps où la liaison est opérationnelle (ex. : 99.99 % = 52 min d'indisponibilité par an).

**Facteurs affectant la disponibilité** :
- **Pluie** : Atténue le signal, surtout à haute fréquence (>10 GHz).
- **Fading** : Variations dues à l'atmosphère.
- **Pannes matérielles** : Antennes, émetteurs, etc.
- **Obstacles** : Arbres, bâtiments temporaires.

**Comment l'améliorer ?**
- **Marge de liaison** : Vise >10 dB dans le bilan de liaison.
- **Fréquence** : Utilise des fréquences moins sensibles à la pluie (ex. : 6 GHz).
- **Redondance** : Ajoute des liaisons de secours.
- **Maintenance** : Vérifie régulièrement les équipements.

**Exemple** :
Pour une disponibilité de 99.99 % sur une liaison de 20 km à 11 GHz, ajoute une marge de 15 dB pour compenser la pluie.

**Dans l'application** :
Simule une liaison avec pluie pour voir l'impact sur la disponibilité.

Tu veux calculer une disponibilité ou tester un scénario ? 😄`
  }
];

// Réponses pour la fibre optique
const fibreResponses: ResponseCategory[] = [
  {
    keywords: ['c\'est quoi optique', 'qu\'est-ce que optique', 'définition optique', 'optique définition', 'fibre optique', 'c\'est quoi fibre', 'qu\'est-ce que fibre'],
    response: `La fibre optique, c'est la transmission de données par la lumière ! 😊 Laisse-moi t'expliquer simplement :

**Qu'est-ce que la fibre optique ?**
C'est un câble en verre ou plastique qui transmet des informations sous forme de signaux lumineux. C'est la technologie la plus rapide pour transmettre des données.

**Caractéristiques principales** :
- **Débits** : Jusqu'à 100 Gbps par fibre
- **Portée** : 10 km à 1000 km sans amplification
- **Longueurs d'onde** : 850 nm, 1310 nm, 1550 nm
- **Architecture** : Monomode ou multimode

**Avantages de la fibre optique** :
1. **Débits ultra-élevés** : Plus rapide que le cuivre
2. **Immunité aux interférences** : Pas d'électromagnétisme
3. **Sécurité** : Difficile à intercepter
4. **Distance** : Très longue portée
5. **Fiabilité** : Peu de pannes

**Composants d'un réseau fibre** :
- **Fibre optique** : Câble de transmission
- **Connecteurs** : Jonctions démontables (SC, LC, FC)
- **Épissures** : Jonctions permanentes
- **Émetteurs/récepteurs** : Conversion électrique/optique
- **Amplificateurs** : Régénération du signal

**Types de fibres** :
- **Monomode** : Un seul mode de propagation (longues distances)
- **Multimode** : Plusieurs modes (courtes distances, data centers)

**Applications** :
- Internet haut débit (FTTH)
- Réseaux d'entreprise
- Télécommunications longue distance
- Data centers
- Télévision par câble

**Facteurs à considérer** :
- Atténuation (pertes de signal)
- Dispersion (étalement du signal)
- Courbures (rayon minimum)
- Connectique (pertes d'insertion)

Tu veux en savoir plus sur les connecteurs, épissures ou l'atténuation ? 😄`
  },
  {
    keywords: ['connecteur', 'connexion', 'raccordement'],
    response: `Les connecteurs en fibre optique, c'est ce qui permet de brancher et débrancher les fibres facilement ! 😊 Voici les détails :

**Rôle d'un connecteur** :
Relier deux fibres de manière précise pour minimiser les pertes de signal.

**Types de connecteurs** :
- **SC** : Push-pull, robuste, utilisé en télécoms.
- **LC** : Compact, idéal pour les data centers.
- **FC** : Vissé, très précis, pour tests.
- **ST** : Baïonnette, plus ancien mais fiable.

**Caractéristiques** :
- **Pertes d'insertion** : 0.2-0.5 dB (idéal <0.3 dB).
- **Réflectance** : <-40 dB (UPC), <-60 dB (APC).
- **Durabilité** : Supporte >500 connexions.

**Bonnes pratiques** :
- Nettoie toujours les extrémités avec un stylo optique.
- Protège les connecteurs avec des capuchons.
- Vérifie l'alignement des clés.

**Dans l'application** :
Simule un connecteur en 3D pour voir l'impact d'un mauvais alignement.

Tu veux en savoir plus sur un connecteur ou tester une simulation ? 😄`
  },
  {
    keywords: ['épissure', 'soudure', 'jonction'],
    response: `Une épissure, c'est la colle permanente des fibres optiques ! 😊 Voici ce que tu dois savoir :

**Qu'est-ce qu'une épissure ?**
C'est une connexion permanente entre deux fibres, soit par fusion, soit mécaniquement.

**Types d'épissures** :
1. **Fusion** :
   - Utilise une soudeuse pour fondre les fibres.
   - Pertes : 0.05-0.1 dB.
   - Idéal pour les longues distances.
2. **Mécanique** :
   - Utilise un gel d'indice pour aligner les fibres.
   - Pertes : 0.2-0.3 dB.
   - Pratique pour des réparations rapides.

**Étapes d'une épissure par fusion** :
1. Dénude la fibre.
2. Clive l'extrémité pour un angle précis.
3. Soude avec la machine.
4. Protège avec une gaine thermorétractable.

**Exemple** :
Une épissure mal alignée peut ajouter 0.5 dB de perte, réduisant la portée de 2 km.

**Dans l'application** :
Simule une épissure pour voir son impact sur l'atténuation.

Veux-tu explorer une épissure ou calculer des pertes ? 😄`
  },
  {
    keywords: ['atténuation', 'perte', 'affaiblissement'],
    response: `L'atténuation, c'est la perte de puissance du signal dans une fibre optique. Pas d'inquiétude, je t'explique tout ! 😊

**Qu'est-ce que l'atténuation ?**
C'est la diminution de l'intensité du signal lumineux lorsqu'il voyage dans la fibre.

**Sources d'atténuation** :
- **Absorption** : Énergie absorbée par le matériau (0.1-0.2 dB/km).
- **Diffusion** : Lumière dispersée (ex. : Rayleigh, 0.1 dB/km).
- **Courbures** : Rayon trop faible (<10 mm, jusqu'à 1 dB).
- **Connecteurs/épissures** : 0.2-0.5 dB par élément.

**Formule** :
A (dB) = α × L + Σ(pertes ponctuelles)
- α : Coefficient d'atténuation (ex. : 0.2 dB/km à 1550 nm).
- L : Longueur de la fibre (km).
- Pertes ponctuelles : Connecteurs, épissures.

**Exemple** :
Pour 20 km de fibre (0.2 dB/km) avec 2 épissures (0.1 dB chacune) et 1 connecteur (0.3 dB) :
A = (0.2 × 20) + (2 × 0.1) + 0.3 = 4.5 dB.

**Dans l'application** :
Simule une fibre avec des défauts pour voir l'impact en 3D.

Veux-tu calculer une atténuation ou voir une simulation ? 😄`
  },
  {
    keywords: ['défauts fibre', 'pertes fibre', 'problèmes fibre'],
    response: `Les défauts dans une fibre optique peuvent compliquer les choses, mais je vais t'aider à les comprendre ! 😊

**Types de défauts** :
1. **Micro-courbures** :
   - Cause : Fibre pliée trop fort (<10 mm).
   - Pertes : 0.1-1 dB.
   - Prévention : Respecte le rayon de courbure.
2. **Mauvais connecteurs** :
   - Cause : Désalignement ou saleté.
   - Pertes : 0.5-2 dB.
   - Prévention : Nettoyage et alignement précis.
3. **Épissures défectueuses** :
   - Cause : Mauvais alignement ou bulles.
   - Pertes : 0.2-1 dB.
   - Prévention : Utilise une soudeuse calibrée.
4. **Défauts de fabrication** :
   - Cause : Impuretés dans la fibre.
   - Pertes : Variables.

**Détection** :
- **OTDR** : Localise les défauts (épissures, cassures).
- **Test de puissance** : Mesure l'atténuation totale.
- **Inspection visuelle** : Vérifie les connecteurs.

**Exemple** :
Une micro-courbure sur 1 m peut ajouter 0.5 dB, réduisant la portée de 2.5 km.

**Dans l'application** :
Simule un défaut en 3D pour voir son effet sur le signal.

Veux-tu analyser un défaut spécifique ou tester une simulation ? 😄`
  },
  {
    keywords: ['otdr', 'réflectométrie', 'test fibre'],
    response: `L'OTDR, c'est l'outil magique pour diagnostiquer une fibre optique ! 😊 Voici ce que tu dois savoir :

**Qu'est-ce qu'un OTDR ?**
Un OTDR (Optical Time-Domain Reflectometer) envoie des impulsions lumineuses dans la fibre et analyse les réflexions pour détecter les défauts.

**Ce qu'il mesure** :
- **Atténuation** : Pertes totales (dB/km).
- **Épissures/connecteurs** : Localise et mesure leurs pertes.
- **Cassures** : Identifie les ruptures complètes.
- **Longueur** : Mesure la distance de la fibre.

**Comment ça marche ?**
1. Envoie une impulsion lumineuse.
2. Analyse les réflexions (Rayleigh, Fresnel).
3. Affiche un graphique (trace) avec les pertes en fonction de la distance.

**Exemple** :
Un OTDR détecte une épissure à 5 km avec 0.3 dB de perte et une cassure à 10 km.

**Dans l'application** :
Simule une mesure OTDR pour voir une trace et identifier des défauts.

Veux-tu en savoir plus sur l'OTDR ou simuler un test ? 😄`
  }
];

// Réponses pour les calculs et formules
const calculResponses: ResponseCategory[] = [
  {
    keywords: ['formule', 'calcul', 'mathématique'],
    response: `Les formules en télécoms, c'est la clé pour tout comprendre ! 😊 Voici les plus importantes, expliquées simplement :

**1. Perte en espace libre (Hertzien)** :
L = 20 log₁₀(4πd/λ)
- d : Distance (m).
- λ : Longueur d'onde (m).
- Exemple : À 10 km et 6 GHz, L ≈ 132 dB.

**2. Zone de Fresnel** :
r₁ = √(λ × d₁ × d₂ / (d₁ + d₂))
- r₁ : Rayon de la première zone (m).
- Exemple : À 5 km, 6 GHz, r₁ ≈ 7.9 m.

**3. Erlang B (GSM)** :
GoS = (A^N / N!) / Σ(A^k / k!)
- A : Trafic offert (Erlangs).
- N : Nombre de canaux.
- Exemple : 10 Erlangs, GoS 2 % → ~18 canaux.

**4. Facteur de charge UMTS** :
η = Σ((Eb/N0) × (R/W) × (1 + i))
- Exemple : Voix 12.2 kbps, ηi ≈ 0.01.

**5. Atténuation fibre** :
A = α × L + Σ(pertes ponctuelles)
- α : 0.2 dB/km à 1550 nm.
- Exemple : 20 km + 2 épissures = 4.2 dB.

**Conseils** :
- Vérifie toujours les unités (m, km, dB, dBm).
- Ajoute des marges pour la fiabilité.
- Utilise l'application pour tester ces formules.

Veux-tu explorer une formule ou faire un calcul ? 😄`
  },
  {
    keywords: ['unités', 'conversion', 'db', 'dbm'],
    response: `Les unités en télécoms peuvent sembler compliquées, mais je vais t'aider à y voir clair ! 😊

**Unités principales** :
1. **Puissance** :
   - **dBm** : Puissance relative à 1 mW (ex. : 0 dBm = 1 mW, 30 dBm = 1 W).
   - **dBW** : Relative à 1 W (dBm = dBW + 30).
   - Conversion : dBm = 10 log₁₀(P / 1mW).
2. **Gain/Perte** :
   - **dB** : Rapport logarithmique (3 dB = doublement, -3 dB = division par 2).
   - **dBi** : Gain d'antenne par rapport à une antenne isotrope.
   - **dBd** : Par rapport à un dipôle (dBi = dBd + 2.15).
3. **Fréquence** :
   - Hz, kHz, MHz, GHz.
   - Longueur d'onde : λ = c / f (c = 3×10⁸ m/s).
4. **Trafic** :
   - **Erlang** : Mesure du trafic (1 Erlang = 1 canal occupé 1 heure).
   - **mErlang** : 1/1000 Erlang.

**Exemple** :
Une puissance de 100 mW = 10 log₁₀(100 / 1) = 20 dBm.

**Dans l'application** :
Utilise le convertisseur d'unités pour tester ces conversions.

Veux-tu convertir une valeur ou en savoir plus sur une unité ? 😄`
  },
  {
    keywords: ['marge', 'sécurité', 'budget'],
    response: `La marge, c'est ton coussin de sécurité pour un réseau fiable ! 😊 Voici ce qu'il faut savoir :

**Qu'est-ce qu'une marge ?**
C'est la différence entre la puissance reçue et la sensibilité minimale du récepteur, dans un bilan de liaison.

**Pourquoi c'est important ?**
- Compense les imprévus (pluie, fading, vieillissement).
- Assure une disponibilité élevée (ex. : 99.99 %).

**Types de marges** :
- **Marge de fading** : 5-10 dB pour les variations atmosphériques.
- **Marge de pluie** : 5-15 dB pour les hautes fréquences (>10 GHz).
- **Marge système** : 2-5 dB pour câbles, connecteurs.

**Exemple** :
Dans un bilan de liaison hertzienne :
- Puissance reçue = -60 dBm.
- Sensibilité = -80 dBm.
- Marge = 20 dB (très confortable !).

**Dans l'application** :
Ajuste les marges dans une simulation pour voir leur impact.

Veux-tu calculer une marge ou simuler un scénario ? 😄`
  }
];

// Réponses pour les simulations
const simulationResponses: ResponseCategory[] = [
  {
    keywords: ['simulation', 'modélisation', 'scénario'],
    response: `Les simulations dans l'application, c'est comme un bac à sable pour tester tes idées télécoms ! 😊 Voici ce que tu peux faire :

**Types de simulations** :
1. **GSM** :
   - Visualise la couverture d'une BTS en 3D.
   - Ajuste la puissance ou la hauteur d'antenne.
   - Teste des scénarios (urbain, rural).
2. **UMTS** :
   - Simule un NodeB avec des utilisateurs mobiles.
   - Analyse le facteur de charge en temps réel.
   - Optimise les handovers.
3. **Hertzien** :
   - Visualise les zones de Fresnel.
   - Ajoute des obstacles et vois leur impact.
   - Calcule le bilan de liaison.
4. **Fibre optique** :
   - Simule une liaison avec épissures/connecteurs.
   - Analyse les pertes en 3D.
   - Détecte les défauts.

**Pourquoi utiliser les simulations ?**
- Teste sans risque.
- Visualise des concepts complexes (ex. : interférences).
- Apprend en jouant avec les paramètres.

**Conseils** :
- Commence avec un scénario prédéfini.
- Modifie un paramètre à la fois pour comprendre son effet.
- Utilise les contrôles 3D (Space pour pause, +/- pour zoom).

Veux-tu lancer une simulation ou en savoir plus sur une ? 😄`
  },
  {
    keywords: ['visualisation', 'graphique', '3d'],
    response: `Les visualisations 3D et graphiques, c'est ce qui rend les télécoms vivants ! 😊 Voici ce que l'application propose :

**Types de visualisations** :
1. **Graphiques 2D** :
   - Courbes d'atténuation (fibre, hertzien).
   - Diagrammes de couverture (GSM, UMTS).
   - Bilans de liaison.
2. **Scènes 3D** :
   - Antennes GSM/UMTS avec zones de couverture.
   - Liaisons hertziennes avec zones de Fresnel.
   - Fibres optiques avec défauts visibles.
3. **Interactivité** :
   - Rotation : Clic gauche + glisser.
   - Zoom : Molette ou +/-.
   - Paramètres en temps réel : Modifie et vois l'impact instantly.

**Exemple** :
Dans la simulation GSM, tu vois une antenne 3D avec une sphère de couverture qui change de couleur selon la qualité du signal.

**Conseils** :
- Utilise les légendes pour comprendre les couleurs.
- Exporte les graphiques pour tes rapports.
- Teste différents scénarios pour comparer.

Veux-tu explorer une visualisation ou apprendre à utiliser les contrôles 3D ? 😄`
  },
  {
    keywords: ['contrôles 3d', 'navigation 3d', 'interactif'],
    response: `Les contrôles 3D dans l'application, c'est super intuitif pour explorer les simulations ! 😊 Voici comment les maîtriser :

**Contrôles de base** :
- **Rotation** : Clic gauche + glisser pour tourner autour de la scène.
- **Zoom** : Molette de souris ou touches +/-.
- **Déplacement** : Clic droit + glisser pour déplacer la caméra.
- **Pause/Reprise** : Touche Espace pour figer la simulation.
- **Vues prédéfinies** : Touches 1-4 pour des angles rapides.

**Exemple** :
Dans la simulation hertzienne, tu peux zoomer sur une zone de Fresnel et tourner pour voir un obstacle sous tous les angles.

**Conseils** :
- Ajuste la qualité graphique dans les paramètres si ça rame (30/60 FPS).
- Utilise les flèches pour des rotations précises.
- Sauvegarde tes vues préférées pour y revenir.

**Dans l'application** :
Teste les contrôles dans une simulation GSM pour voir une BTS en action.

Veux-tu apprendre un contrôle spécifique ou lancer une simulation 3D ? 😄`
  }
];

// Réponses pour les questions pédagogiques
const pedagogicResponses: ResponseCategory[] = [
  {
    keywords: ['apprendre', 'étude', 'formation', 'cours'],
    response: `Tu veux apprendre les télécoms avec l'application ? Super idée ! 😊 Voici un plan pour progresser :

**Méthode d'apprentissage** :
1. **Commence doucement** :
   - Choisis un module simple (ex. : GSM).
   - Utilise un scénario prédéfini (ex. : rural).
   - Lis les infobulles et le glossaire.
2. **Expérimente** :
   - Modifie un paramètre (ex. : puissance d'antenne).
   - Observe les changements dans les graphiques/3D.
   - Pose-moi des questions si ça coince !
3. **Approfondis** :
   - Teste des scénarios complexes (ex. : UMTS urbain).
   - Compare tes calculs avec les résultats de l'application.
   - Note ce que tu apprends.
4. **Valide tes connaissances** :
   - Fais les exercices proposés dans l'application.
   - Simule des cas limites (ex. : forte charge UMTS).

**Progression recommandée** :
1. **GSM** : Bases des réseaux mobiles.
2. **Hertzien** : Propagation et obstacles.
3. **Fibre** : Transmission optique.
4. **UMTS** : Concepts avancés (handover, charge).

**Ressources** :
- Glossaire : Explications des termes techniques.
- Scénarios guidés : Étapes détaillées.
- Moi ! 😄 Pose-moi toutes tes questions.

Veux-tu un plan d'étude personnalisé ou commencer avec un module ? 😊`
  },
  {
    keywords: ['exercice', 'problème', 'cas pratique'],
    response: `Rien de mieux qu'un bon exercice pour maîtriser les télécoms ! 😊 Voici quelques cas pratiques pour t'entraîner :

**GSM** :
1. Calcule les TRX pour 10 km², 2000 hab/km², 30 mErlang, GoS 2 %.
2. Simule une couverture rurale avec 1 BTS et analyse la portée.

**UMTS** :
1. Calcule le facteur de charge pour 30 utilisateurs voix (12.2 kbps) + 10 data (64 kbps).
2. Optimise le tilt d'antenne pour réduire les interférences.

**Hertzien** :
1. Calcule le bilan de liaison pour 20 km à 8 GHz, avec un obstacle à 10 m.
2. Détermine le rayon de Fresnel à mi-parcours.

**Fibre optique** :
1. Calcule l'atténuation pour 15 km, 3 épissures, 2 connecteurs.
2. Simule une cassure à 5 km et analyse l'OTDR.

**Méthode** :
1. Rassemble les données (ex. : distances, fréquences).
2. Applique les formules (voir glossaire).
3. Vérifie avec l'application.
4. Note les résultats pour comparer.

Veux-tu que je te guide sur un exercice ou que je te propose un autre ? 😄`
  },
  {
    keywords: ['glossaire', 'termes', 'définitions'],
    response: `Le glossaire de l'application, c'est ton meilleur ami pour comprendre les termes techniques ! 😊 Voici quelques définitions clés :

**GSM** :
- **BTS** : Station de base qui communique avec les mobiles.
- **TRX** : Module émetteur/récepteur (8 canaux).
- **Erlang** : Unité de trafic (1 heure d'utilisation).

**UMTS** :
- **NodeB** : Station de base 3G.
- **Facteur de charge** : Pourcentage de capacité utilisée.
- **Handover** : Transition entre cellules.

**Hertzien** :
- **Zone de Fresnel** : Volume autour de la ligne de vue.
- **Bilan de liaison** : Calcul des gains/pertes.
- **Diffraction** : Déviation des ondes par un obstacle.

**Fibre optique** :
- **Atténuation** : Perte de puissance (dB/km).
- **Épissure** : Connexion permanente entre fibres.
- **OTDR** : Outil pour détecter les défauts.

**Astuce** :
Le glossaire est accessible dans l'application (menu Aide). Tu peux aussi me demander n'importe quel terme !

Veux-tu la définition d'un mot précis ou explorer le glossaire ? 😄`
  }
];

// Réponses pour les questions avancées
const advancedResponses: ResponseCategory[] = [
  {
    keywords: ['optimisation', 'performance', 'efficacité'],
    response: `Optimiser un réseau télécom, c'est tout un art, mais je vais te donner des astuces de pro ! 😊

**Stratégies par technologie** :
1. **GSM** :
   - Planifie les fréquences pour éviter les interférences (motif 4/12).
   - Ajuste la puissance des BTS pour équilibrer la couverture.
   - Utilise des micro-cellules en zones denses.
2. **UMTS** :
   - Optimise le tilt d'antenne (4-8°) pour réduire les interférences.
   - Ajuste la puissance pilote (10-15 %).
   - Contrôle les handovers pour fluidité.
3. **Hertzien** :
   - Choisis des fréquences adaptées (ex. : 6 GHz pour longue distance).
   - Ajoute des marges pour pluie/fading (10-15 dB).
   - Simule les obstacles pour un dégagement parfait.
4. **Fibre** :
   - Minimise les épissures (0.1 dB max).
   - Utilise des connecteurs APC pour faible réflectance.
   - Teste régulièrement avec un OTDR.

**Exemple** :
Dans un réseau UMTS urbain, réduire le tilt de 2° peut diminuer les interférences de 15 %.

**Dans l'application** :
Teste ces optimisations dans une simulation pour voir l'impact.

Veux-tu optimiser un réseau spécifique ou en savoir plus ? 😄`
  },
  {
    keywords: ['maintenance', 'surveillance', 'monitoring'],
    response: `La maintenance et la surveillance, c'est ce qui garde un réseau en pleine forme ! 😊 Voici comment ça marche :

**Maintenance préventive** :
- **Inspections** : Vérifie les antennes, câbles, et connecteurs tous les 6 mois.
- **Nettoyage** : Enlève la poussière des équipements optiques.
- **Tests** : Mesure l'atténuation (fibre) ou la puissance (hertzien).

**Maintenance corrective** :
- **Diagnostic** : Utilise un OTDR pour les fibres ou un analyseur de spectre pour le hertzien.
- **Réparation** : Remplace les connecteurs défectueux ou ajuste les antennes.
- **Validation** : Teste après réparation pour confirmer.

**Surveillance** :
- **Monitoring** : Suis les KPI (disponibilité, qualité, capacité).
- **Alertes** : Configure des seuils pour détecter les pannes.
- **Rapports** : Analyse les tendances pour anticiper les problèmes.

**Exemple** :
Un OTDR détecte une épissure défectueuse à 3 km, réparée en 1h, restaurant 100 % de la capacité.

**Dans l'application** :
Simule une panne pour voir comment la diagnostiquer.

Veux-tu explorer la maintenance ou simuler un scénario ? 😄`
  },
  {
    keywords: ['5g', 'réseaux 5g', 'nouvelles technologies'],
    response: `La 5G, c'est la nouvelle star des télécoms ! 😊 Voici une introduction simple :

**Qu'est-ce que la 5G ?**
La 5G est la 5e génération de réseaux mobiles, offrant des débits ultra-élevés (jusqu'à 10 Gbps), une latence faible (<1 ms), et une capacité massive pour les objets connectés (IoT).

**Caractéristiques** :
- **Bandes de fréquences** :
  - Basses (<1 GHz) : Grande couverture.
  - Moyennes (3.5 GHz) : Équilibre débit/portée.
  - Hautes (mmWave, 26-28 GHz) : Très haut débit, courte portée.
- **Technologies** :
  - **Massive MIMO** : Multiples antennes pour plus de capacité.
  - **Beamforming** : Oriente le signal vers l'utilisateur.
  - **Network Slicing** : Crée des réseaux virtuels pour différents usages.
- **Cas d'usage** :
  - Villes intelligentes, voitures autonomes, réalité augmentée.

**Dans l'application** :
La 5G n'est pas encore implémentée, mais tu peux simuler des concepts similaires (ex. : couverture UMTS) en attendant la version 2.0 (Q2 2024).

Veux-tu en savoir plus sur un aspect de la 5G ou simuler un concept proche ? 😄`
  }
];

// Réponses pour les normes et réglementations
const regulatoryResponses: ResponseCategory[] = [
  {
    keywords: ['norme', 'réglementation', 'compliance'],
    response: `Les normes et réglementations, c'est ce qui assure que les réseaux sont sûrs et fiables ! 😊 Voici l'essentiel :

**Normes techniques** :
- **ETSI (Europe)** : Définit les standards GSM/UMTS.
- **ITU (International)** : Gère les fréquences mondiales.
- **IEEE** : Standards pour Wi-Fi, Ethernet.
- **3GPP** : Spécifications pour 3G, 4G, 5G.

**Réglementations fréquences** :
- **Allocation** : Chaque pays attribue des bandes (ex. : 900 MHz pour GSM).
- **Puissance** : Limites pour éviter les interférences (ex. : 43 dBm max pour BTS).
- **Licences** : Opérateurs doivent acheter des droits d'utilisation.

**Qualité et sécurité** :
- **QoS** : Garantit une bonne expérience utilisateur (ex. : faible taux de coupure).
- **Sécurité** : Protège contre les interférences et piratages.
- **Conformité** : Tests réguliers pour respecter les normes.

**Exemple** :
En Europe, une BTS GSM à 900 MHz doit respecter une puissance max de 43 dBm (ETSI).

**Dans l'application** :
Simule une configuration pour vérifier si elle respecte les normes.

Veux-tu en savoir plus sur une norme ou tester une conformité ? 😄`
  },
  {
    keywords: ['sécurité', 'protection', 'cybersecurité'],
    response: `La sécurité dans les réseaux télécoms, c'est crucial pour protéger les données et les utilisateurs ! 😊 Voici les bases :

**Aspects de la sécurité** :
1. **Physique** :
   - Protège les équipements (BTS, NodeB) contre le vandalisme.
   - Sécurise les sites avec des clôtures/alarme.
2. **Radio** :
   - Chiffre les communications (ex. : A5/3 pour GSM).
   - Contrôle les interférences pour éviter les perturbations.
3. **Réseau** :
   - Utilise des pare-feu pour protéger le cœur de réseau.
   - Authentifie les utilisateurs (ex. : carte SIM).
4. **Données** :
   - Chiffre les données utilisateur (ex. : HTTPS pour 3G/4G).
   - Surveille les intrusions.

**Exemple** :
Un réseau UMTS utilise l'algorithme UEA1 pour chiffrer les appels, garantissant la confidentialité.

**Dans l'application** :
Simule une attaque (ex. : interférence) pour voir l'impact sur la QoS.

Veux-tu explorer un aspect de la sécurité ou simuler un scénario ? 😄`
  }
];

// Réponses pour le dépannage
const troubleshootingResponses: ResponseCategory[] = [
  {
    keywords: ['problème', 'erreur', 'bug', 'panne'],
    response: `Oh non, un problème ? Pas de panique, je vais t'aider à le résoudre ! 😊 Décris-moi ce qui se passe, et voici quelques pistes courantes :

**Problèmes fréquents** :
1. **GSM** :
   - **Appels coupés** : Vérifie les interférences co-canal ou la couverture.
   - **Mauvaise qualité** : Ajuste la puissance ou le GoS.
2. **UMTS** :
   - **Surcharge** : Facteur de charge >75 %, réduis le nombre d'utilisateurs.
   - **Handover échoue** : Ajuste les seuils 1a/1b.
3. **Hertzien** :
   - **Signal faible** : Vérifie le bilan de liaison ou les obstacles.
   - **Pertes élevées** : Recalcule les zones de Fresnel.
4. **Fibre** :
   - **Pertes élevées** : Teste avec un OTDR pour localiser épissures/connecteurs défectueux.
   - **Cassure** : Vérifie la continuité de la fibre.

**Étapes pour résoudre** :
1. Identifie le symptôme (ex. : faible signal).
2. Vérifie les paramètres dans l'application.
3. Simule le scénario pour confirmer.
4. Applique une correction (ex. : augmenter la puissance).

Dis-moi ce qui ne va pas, et je te guide ! 😄`
  },
  {
    keywords: ['simulation bloque', '3d lent', 'application lente'],
    response: `Si l'application ou une simulation 3D semble lente, pas d'inquiétude, on va arranger ça ! 😊 Voici quoi faire :

**Problèmes possibles** :
1. **Simulation 3D lente** :
   - Cause : Qualité graphique trop élevée.
   - Solution : Réduis la qualité dans Paramètres > Simulations (ex. : 30 FPS).
2. **Application qui rame** :
   - Cause : Trop de calculs en temps réel.
   - Solution : Pause la simulation (touche Espace) ou simplifie le scénario.
3. **Erreur de calcul** :
   - Cause : Paramètres incorrects (ex. : distance négative).
   - Solution : Vérifie les champs dans le formulaire.

**Astuces générales** :
- Ferme les autres onglets/programmes pour libérer des ressources.
- Vérifie ta connexion internet si tu utilises l'API.
- Redémarre l'application (Ctrl + F5).
- Consulte les logs dans Paramètres > Debug.

**Dans l'application** :
Teste une simulation simple (ex. : GSM rural) pour voir si le problème persiste.

Dis-moi ce qui bloque, et je t'aide à débloquer ! 😄`
  }
];

// Réponses pour les termes techniques courants
const technicalTermsResponses: ResponseCategory[] = [
  {
    keywords: ['c\'est quoi bts', 'qu\'est-ce que bts', 'définition bts', 'bts explication'],
    response: `La BTS, c'est la station de base GSM ! 😊 Laisse-moi t'expliquer simplement :

**Qu'est-ce qu'une BTS ?**
BTS = Base Transceiver Station (Station de base émettrice-réceptrice). C'est l'antenne qui communique directement avec ton téléphone mobile.

**Rôle de la BTS** :
- **Émission** : Envoie les signaux radio vers les mobiles
- **Réception** : Reçoit les signaux des mobiles
- **Contrôle** : Gère les appels et la mobilité
- **Interface** : Connecte les mobiles au réseau

**Composants d'une BTS** :
- **Antennes** : Émettent et reçoivent les ondes radio
- **TRX** : Modules émetteur/récepteur (gèrent les canaux)
- **Contrôleur** : Gère les communications
- **Alimentation** : Fournit l'électricité
- **Refroidissement** : Maintient la température

**Types de BTS** :
- **Omnidirectionnelle** : Couvre 360° (zone rurale)
- **Sectorielle** : 3 secteurs de 120° (zone urbaine)
- **Micro-cellule** : Petite zone (centres commerciaux)

**Dans l'application** :
Tu peux voir les BTS en 3D et ajuster leur puissance pour optimiser la couverture !

Tu veux en savoir plus sur les TRX ou la planification des BTS ? 😄`
  },
  {
    keywords: ['c\'est quoi trx', 'qu\'est-ce que trx', 'définition trx', 'trx explication'],
    response: `Le TRX, c'est le cœur de la BTS ! 😊 Voici l'explication simple :

**Qu'est-ce qu'un TRX ?**
TRX = Transmitter/Receiver (Émetteur/Récepteur). C'est un module dans la BTS qui gère les communications radio.

**Fonction du TRX** :
- **Émetteur** : Envoie les signaux vers les mobiles
- **Récepteur** : Reçoit les signaux des mobiles
- **Gestion des canaux** : 8 canaux par TRX
- **Contrôle de puissance** : Ajuste la puissance d'émission

**Capacité d'un TRX** :
- **8 timeslots** (canaux temporels)
- **7 canaux de trafic** (voix/données)
- **1 canal de contrôle** (BCCH - Broadcast Control Channel)

**Dimensionnement** :
- Dépend du trafic (Erlangs)
- GoS (Grade of Service) : 1-2%
- Facteur d'activité : 60-70%

**Exemple** :
Pour 1000 utilisateurs à 25 mErlang :
- Trafic total = 25 Erlangs
- Avec GoS 2% → ~35 canaux
- Nombre de TRX = ⌈35/7⌉ = 5 TRX

Tu veux calculer le nombre de TRX ou voir une simulation ? 😄`
  },
  {
    keywords: ['c\'est quoi erlang', 'qu\'est-ce que erlang', 'définition erlang', 'erlang explication'],
    response: `L'Erlang, c'est l'unité de mesure du trafic télécom ! 😊 Voici l'explication :

**Qu'est-ce qu'un Erlang ?**
Un Erlang mesure l'utilisation d'une ressource pendant une heure. 1 Erlang = 1 canal utilisé à 100% pendant 1 heure.

**Exemples concrets** :
- **1 Erlang** = 1 appel qui dure 1 heure
- **1 Erlang** = 2 appels qui durent 30 minutes chacun
- **1 Erlang** = 60 appels qui durent 1 minute chacun

**Trafic par utilisateur** :
- **Résidentiel** : 20-50 mErlang (0.02-0.05 Erlang)
- **Professionnel** : 80-150 mErlang (0.08-0.15 Erlang)
- **Heure chargée** : 12-15% du trafic journalier

**Formule importante** :
Trafic total = Nombre d'utilisateurs × Trafic par utilisateur

**Exemple** :
100 utilisateurs à 30 mErlang chacun :
- Trafic total = 100 × 0.03 = 3 Erlangs

**Utilisation** :
- Dimensionnement des TRX
- Calcul de la capacité réseau
- Planification des équipements

Tu veux calculer un trafic ou comprendre la table Erlang B ? 😄`
  },
  {
    keywords: ['c\'est quoi gos', 'qu\'est-ce que gos', 'définition gos', 'gos explication', 'grade of service'],
    response: `Le GoS, c'est la qualité de service ! 😊 Voici l'explication simple :

**Qu'est-ce que le GoS ?**
GoS = Grade of Service (Grade de Service). C'est le pourcentage d'appels qui sont rejetés faute de ressources disponibles.

**Exemples de GoS** :
- **GoS 1%** = 1 appel sur 100 est rejeté
- **GoS 2%** = 2 appels sur 100 sont rejetés
- **GoS 5%** = 5 appels sur 100 sont rejetés

**Impact du GoS** :
- **GoS faible** (1-2%) : Meilleure qualité, plus de ressources
- **GoS élevé** (5-10%) : Qualité acceptable, moins de ressources

**Valeurs typiques** :
- **Réseaux GSM** : 1-2%
- **Réseaux UMTS** : 1-5%
- **Réseaux d'urgence** : 0.1%

**Calcul avec Erlang B** :
Le GoS détermine le nombre de canaux nécessaires pour un trafic donné.

**Exemple** :
- Trafic = 10 Erlangs
- GoS = 2%
- → 18 canaux nécessaires

**Dans l'application** :
Tu peux ajuster le GoS pour voir son impact sur le dimensionnement !

Tu veux calculer avec différents GoS ou comprendre Erlang B ? 😄`
  },
  {
    keywords: ['c\'est quoi nodeb', 'qu\'est-ce que nodeb', 'définition nodeb', 'nodeb explication', 'node b'],
    response: `Le NodeB, c'est la station de base UMTS ! 😊 Voici l'explication simple :

**Qu'est-ce qu'un NodeB ?**
NodeB = Node Base (Nœud de base). C'est l'équivalent de la BTS en GSM, mais pour les réseaux 3G UMTS.

**Rôle du NodeB** :
- **Communications radio** : Gère les appels 3G
- **Contrôle de puissance** : Ajuste la puissance 1500 fois/seconde
- **Handover** : Gère les transitions entre cellules
- **Gestion des ressources** : Alloue les canaux aux utilisateurs

**Caractéristiques techniques** :
- **Bande passante** : 3.84 MHz par porteuse
- **Débits** : Jusqu'à 384 kbps
- **Facteur de charge** : Limite à ~75%
- **Services** : Voix + données simultanées

**Différences avec BTS GSM** :
- **Technologie** : WCDMA vs TDMA
- **Débits** : Plus élevés (384 kbps vs 9.6 kbps)
- **Contrôle de puissance** : Plus sophistiqué
- **Handover** : Soft handover possible

**Dans l'application** :
Tu peux simuler un NodeB et voir le facteur de charge en temps réel !

Tu veux en savoir plus sur le facteur de charge ou les handovers ? 😄`
  },
  {
    keywords: ['c\'est quoi fresnel', 'qu\'est-ce que fresnel', 'définition fresnel', 'fresnel explication', 'zone fresnel'],
    response: `Les zones de Fresnel, c'est crucial pour les liaisons hertziennes ! 😊 Voici l'explication :

**Qu'est-ce qu'une zone de Fresnel ?**
C'est une zone ellipsoïdale autour de la ligne de vue directe entre deux antennes. La première zone doit être dégagée pour éviter les pertes.

**Pourquoi c'est important ?**
- **Propagation** : Les ondes radio utilisent cette zone
- **Obstacles** : Bloquent la propagation
- **Pertes** : Augmentent si la zone est obstruée

**Formule de calcul** :
r₁ = √(λ × d₁ × d₂ / (d₁ + d₂))
- r₁ : Rayon de la première zone (mètres)
- λ : Longueur d'onde (mètres)
- d₁, d₂ : Distances depuis chaque antenne

**Règle pratique** :
- **60% de dégagement** minimum pour la première zone
- **Rayon maximal** à mi-parcours
- **Tenir compte** de la courbure terrestre

**Exemple concret** :
Liaison 10 km à 6 GHz :
- λ = 0.05 m
- À mi-parcours : r₁ ≈ 11.2 m
- Dégagement minimum = 6.7 m

**Facteurs à vérifier** :
- Arbres et végétation
- Bâtiments
- Relief du terrain
- Croissance future

Tu veux calculer une zone de Fresnel ou voir une simulation ? 😄`
  },
  {
    keywords: ['c\'est quoi bilan', 'qu\'est-ce que bilan', 'définition bilan', 'bilan explication', 'bilan liaison', 'link budget'],
    response: `Le bilan de liaison, c'est le "budget" de ton signal radio ! 😊 Voici l'explication :

**Qu'est-ce qu'un bilan de liaison ?**
C'est un calcul qui fait la somme de tous les gains et pertes entre l'émetteur et le récepteur pour vérifier si la liaison fonctionne.

**Composants du bilan** :
1. **Émission** :
   - Puissance émise (ex. : 30 dBm)
   - Gain d'antenne émission (ex. : 20 dBi)
   - Pertes câbles (ex. : -2 dB)

2. **Propagation** :
   - Pertes en espace libre
   - Pertes atmosphériques (pluie, brouillard)
   - Pertes par obstacles

3. **Réception** :
   - Gain d'antenne réception (ex. : 20 dBi)
   - Sensibilité du récepteur (ex. : -90 dBm)

**Formule simplifiée** :
PRx = PTx + GaTx - Lprop + GaRx - Lsys

**Exemple** :
Liaison 10 km à 6 GHz :
- PTx = 30 dBm, GaTx = 20 dBi
- Lprop = 132 dB (pertes propagation)
- GaRx = 20 dBi, Lsys = 2 dB
- PRx = 30 + 20 - 132 + 20 - 2 = -64 dBm

**Critères de qualité** :
- **Marge** > 10 dB (pour la fiabilité)
- **Disponibilité** > 99.99%
- **Respect des normes**

Tu veux calculer un bilan ou voir un exemple détaillé ? 😄`
  },
  {
    keywords: ['c\'est quoi atténuation', 'qu\'est-ce que atténuation', 'définition atténuation', 'atténuation explication', 'perte signal'],
    response: `L'atténuation, c'est la perte de puissance du signal ! 😊 Voici l'explication simple :

**Qu'est-ce que l'atténuation ?**
C'est la diminution de l'intensité du signal lors de sa propagation. Plus le signal voyage, plus il s'affaiblit.

**Types d'atténuation** :

**1. Fibre optique** :
- **Absorption** : Énergie absorbée par le matériau (0.1-0.2 dB/km)
- **Diffusion Rayleigh** : Lumière dispersée (0.1 dB/km)
- **Courbures** : Rayon trop faible (<10 mm, jusqu'à 1 dB)
- **Connecteurs/épissures** : 0.2-0.5 dB par élément

**2. Liaisons hertziennes** :
- **Espace libre** : L = 20 log₁₀(4πd/λ)
- **Absorption atmosphérique** : Pluie, brouillard
- **Obstacles** : Bâtiments, collines
- **Diffraction** : Contournement d'obstacles

**Formule générale** :
A (dB) = α × L + Σ(pertes ponctuelles)
- α : Coefficient d'atténuation
- L : Longueur (km)
- Pertes ponctuelles : Connecteurs, épissures

**Exemple fibre** :
20 km de fibre (0.2 dB/km) + 2 épissures (0.1 dB) + 1 connecteur (0.3 dB) :
A = (0.2 × 20) + (2 × 0.1) + 0.3 = 4.5 dB

**Impact sur le système** :
- Limite la portée maximale
- Affecte le débit de données
- Influence la qualité de service

Tu veux calculer une atténuation ou voir une simulation ? 😄`
  },
  {
    keywords: ['c\'est quoi connecteur', 'qu\'est-ce que connecteur', 'définition connecteur', 'connecteur explication', 'raccordement fibre'],
    response: `Les connecteurs, c'est ce qui permet de brancher les fibres ! 😊 Voici l'explication :

**Qu'est-ce qu'un connecteur ?**
C'est un composant mécanique qui permet de relier deux fibres optiques de manière démontable (on peut débrancher).

**Rôle du connecteur** :
- **Alignement précis** : Les fibres doivent être parfaitement alignées
- **Connexion/déconnexion** : Permet de modifier facilement
- **Protection** : Protège les extrémités de fibre
- **Standardisation** : Formats normalisés

**Types de connecteurs** :
- **SC** : Push-pull, robuste, utilisé en télécoms
- **LC** : Compact, idéal pour les data centers
- **FC** : Vissé, très précis, pour tests
- **ST** : Baïonnette, plus ancien mais fiable

**Caractéristiques techniques** :
- **Pertes d'insertion** : 0.2-0.5 dB (idéal <0.3 dB)
- **Réflectance** : <-40 dB (UPC), <-60 dB (APC)
- **Durabilité** : Supporte >500 connexions

**Bonnes pratiques** :
- **Nettoyage** : Toujours nettoyer avant connexion
- **Protection** : Capuchons quand non utilisé
- **Manipulation** : Éviter de toucher l'extrémité
- **Alignement** : Vérifier les clés de positionnement

**Problèmes courants** :
- **Désalignement** : Pertes élevées
- **Saleté** : Pertes et dommages
- **Usure** : Après nombreuses connexions

Tu veux en savoir plus sur un type de connecteur ou les bonnes pratiques ? 😄`
  },
  {
    keywords: ['c\'est quoi épissure', 'qu\'est-ce que épissure', 'définition épissure', 'épissure explication', 'soudure fibre'],
    response: `Une épissure, c'est la "colle" permanente des fibres ! 😊 Voici l'explication :

**Qu'est-ce qu'une épissure ?**
C'est une connexion permanente entre deux fibres optiques, soit par fusion, soit mécaniquement.

**Types d'épissures** :

**1. Épissure par fusion** :
- **Méthode** : Soudeuse qui fond les fibres
- **Pertes** : 0.05-0.1 dB (très faibles)
- **Avantages** : Meilleure qualité, permanente
- **Utilisation** : Longues distances, installations définitives

**2. Épissure mécanique** :
- **Méthode** : Gel d'indice pour aligner les fibres
- **Pertes** : 0.2-0.3 dB (moyennes)
- **Avantages** : Rapide, réversible
- **Utilisation** : Réparations, installations temporaires

**Étapes d'une épissure par fusion** :
1. **Dénudage** : Enlever la gaine de protection
2. **Clivage** : Couper l'extrémité pour un angle précis
3. **Soudage** : Fusion avec la machine
4. **Protection** : Gaine thermorétractable

**Qualité d'une épissure** :
- **Alignement** : Fibres parfaitement centrées
- **Pertes** : Mesurées avec un OTDR
- **Résistance** : Test de traction
- **Visuel** : Inspection au microscope

**Exemple d'impact** :
Une épissure mal alignée peut ajouter 0.5 dB de perte, réduisant la portée de 2 km.

Tu veux en savoir plus sur les techniques d'épissure ou l'OTDR ? 😄`
  },
  {
    keywords: ['c\'est quoi otdr', 'qu\'est-ce que otdr', 'définition otdr', 'otdr explication', 'réflectométrie'],
    response: `L'OTDR, c'est l'outil magique pour diagnostiquer les fibres ! 😊 Voici l'explication :

**Qu'est-ce qu'un OTDR ?**
OTDR = Optical Time-Domain Reflectometer (Réflectomètre optique temporel). C'est un instrument qui envoie des impulsions lumineuses et analyse les réflexions.

**Principe de fonctionnement** :
1. **Émission** : Envoie des impulsions lumineuses
2. **Propagation** : Les impulsions voyagent dans la fibre
3. **Réflexions** : Analyse les échos (Rayleigh, Fresnel)
4. **Affichage** : Graphique avec pertes en fonction de la distance

**Ce qu'il mesure** :
- **Atténuation** : Pertes totales (dB/km)
- **Épissures/connecteurs** : Localise et mesure leurs pertes
- **Cassures** : Identifie les ruptures complètes
- **Longueur** : Mesure la distance de la fibre

**Lecture d'une trace OTDR** :
- **Pente** : Atténuation de la fibre
- **Pics** : Épissures ou connecteurs
- **Chutes** : Cassures ou défauts
- **Bruit** : Qualité de la mesure

**Exemple d'analyse** :
Une trace montre :
- Épissure à 5 km avec 0.3 dB de perte
- Cassure à 10 km (réflexion importante)
- Atténuation moyenne : 0.2 dB/km

**Utilisations** :
- **Installation** : Vérifier la qualité
- **Maintenance** : Diagnostiquer les pannes
- **Acceptation** : Valider les travaux
- **Documentation** : Cartographier le réseau

Tu veux en savoir plus sur l'interprétation des traces ou simuler un test ? 😄`
  }
];

// Combinaison de toutes les réponses
export const responses: ResponseCategory[] = [
  ...basicInteractions,
  ...appQuestions,
  ...gsmResponses,
  ...umtsResponses,
  ...hertzienResponses,
  ...fibreResponses,
  ...calculResponses,
  ...simulationResponses,
  ...pedagogicResponses,
  ...advancedResponses,
  ...regulatoryResponses,
  ...troubleshootingResponses,
  ...technicalTermsResponses
];