/**
 * Base de connaissances pour l'assistant IA en télécommunications
 * Contient les réponses pré-définies pour différentes catégories de questions
 */

interface ResponseCategory {
  keywords: string[];
  response: string;
}

// Réponses pour les interactions de base
const basicInteractions: ResponseCategory[] = [
  {
    keywords: ['bonjour', 'salut', 'hello', 'hey'],
    response: `Bonjour ! 👋 Je suis ravi de vous aider aujourd'hui.

Je suis votre assistant spécialisé en télécommunications. Je peux vous aider sur plusieurs sujets :

📱 **GSM** : Dimensionnement, TRX, trafic Erlang
📡 **UMTS** : NodeB, facteur de charge, couverture
🛰️ **Liaisons Hertziennes** : Zones de Fresnel, bilans de liaison
🔌 **Fibre Optique** : Atténuation, épissures, connectique

Comment puis-je vous aider aujourd'hui ?`
  },
  {
    keywords: ['merci', 'thanks', 'thx'],
    response: `Je vous en prie ! N'hésitez pas si vous avez d'autres questions sur les télécommunications. Je suis là pour vous aider ! 😊`
  },
  {
    keywords: ['au revoir', 'bye', 'ciao', 'a plus'],
    response: `Au revoir ! J'ai été ravi de vous aider. N'hésitez pas à revenir si vous avez d'autres questions sur les télécommunications ! 👋`
  }
];

// Réponses pour les concepts de base
const basicConcepts: ResponseCategory[] = [
  {
    keywords: ['c\'est quoi', 'qu\'est-ce qu\'', 'définition', 'expliquer'],
    response: `Je peux vous expliquer plusieurs concepts en télécommunications :

📡 **Concepts Radio** :
- TRX : Émetteur-récepteur GSM (8 canaux)
- NodeB : Station de base UMTS
- Zone de Fresnel : Volume de propagation
- Erlang : Unité de trafic

🔌 **Concepts Fibre** :
- Connecteur : Interface démontable
- Épissure : Jonction permanente
- Atténuation : Perte de signal

Quel concept souhaitez-vous que je vous explique ?`
  }
];

// Réponses pour les questions sur le GSM
const gsmResponses: ResponseCategory[] = [
  {
    keywords: ['trx', 'gsm', 'bts'],
    response: `Le TRX (Transmitter/Receiver) est l'élément de base d'une BTS GSM :

📱 **Définition** : Module émetteur-récepteur gérant 8 canaux GSM

**Caractéristiques** :
1. **Capacité**
   - 8 timeslots par TRX
   - 1 timeslot = 1 canal voix ou 9.6 kbps data
   - 1er timeslot = BCCH (contrôle)

2. **Dimensionnement**
   - Basé sur le trafic Erlang
   - GoS typique : 1-2%
   - Facteur d'activité : 60-70%

**Formule de calcul** :
Nombre de TRX = ⌈(Trafic total / 7) × (1/0.7)⌉
- 7 canaux traffic par TRX
- 0.7 = facteur d'activité

**Exemple pratique** :
Pour 1000 abonnés à 25mE :
1. Trafic = 1000 × 0.025 = 25 Erlangs
2. Pour GoS 2% → 35 canaux
3. Nombre de TRX = ⌈35/7⌉ = 5 TRX`
  },
  {
    keywords: ['erlang', 'trafic', 'gos'],
    response: `L'Erlang est l'unité de mesure du trafic en télécommunications :

📞 **Définition** : 1 Erlang = utilisation d'une ressource pendant 1 heure

**Formules importantes** :
1. **Erlang B** : Calcul du nombre de canaux
   GoS = (A^N/N!) / Σ(A^k/k!)
   - A = Trafic offert
   - N = Nombre de canaux
   - GoS = Probabilité de blocage

2. **Trafic par abonné**
   - Résidentiel : 20-50 mE
   - Professionnel : 80-150 mE
   - Heure chargée : 12-15% du trafic journalier

**Applications pratiques** :
- Dimensionnement TRX GSM
- Calcul capacité UMTS
- Planification E1/T1

**Exemple** :
Pour 100 utilisateurs à 30mE :
- Trafic total = 100 × 0.03 = 3 Erlangs
- Pour GoS 1% → 8 canaux nécessaires`
  }
];

// Réponses pour les questions sur l'UMTS
const umtsResponses: ResponseCategory[] = [
  {
    keywords: ['nodeb', 'umts', '3g'],
    response: `Le NodeB est la station de base du réseau UMTS (3G) :

📡 **Définition** : Station de base gérant les communications radio UMTS

**Paramètres clés** :
1. **Facteur de charge (η)**
   η = (Eb/N0) × (R/W) × (1 + i)
   - Eb/N0 = Rapport signal/bruit
   - R = Débit utilisateur
   - W = Bande passante (3.84 MHz)
   - i = Facteur d'interférence

2. **Capacité**
   - Limitée par le bruit
   - Facteur de charge max ≈ 75%
   - Contrôle de puissance rapide

**Dimensionnement** :
1. Calcul charge par service
2. Somme des contributions
3. Vérification seuil max
4. Ajout marges sécurité

**Optimisation** :
- Tilt antennes
- Puissance pilote
- Paramètres soft handover
- Seuils admission/congestion`
  }
];

// Réponses pour les questions sur les liaisons hertziennes
const hertzienResponses: ResponseCategory[] = [
  {
    keywords: ['fresnel', 'hertzien', 'faisceaux'],
    response: `Les zones de Fresnel sont cruciales en liaisons hertziennes :

🛰️ **Définition** : Volumes ellipsoïdes autour de la ligne de vue directe

**Caractéristiques** :
1. **Première zone de Fresnel**
   r₁ = √(λ × d₁ × d₂ / d)
   - λ = longueur d'onde
   - d₁, d₂ = distances partielles
   - d = distance totale

2. **Règles pratiques**
   - 60% de la 1ère zone dégagée minimum
   - Rayon maximal à mi-parcours
   - Tenir compte de la courbure terrestre

**Facteurs à considérer** :
- Fréquence d'émission
- Distance de la liaison
- Obstacles sur le trajet
- Conditions météorologiques

**Exemple concret** :
Liaison 10 km à 6 GHz :
- λ = 0.05 m
- r₁ = 11.2 m au milieu
- Dégagement min = 6.7 m`
  }
];

// Réponses pour les questions sur la fibre optique
const fibreResponses: ResponseCategory[] = [
  {
    keywords: ['connecteur', 'connexion', 'raccordement'],
    response: `Un connecteur en fibre optique est un composant mécanique qui permet de :

🔌 **Fonction** : Relier deux fibres optiques de manière démontable

**Types courants** :
- SC (Subscriber Connector) : Verrouillage push-pull
- LC (Lucent Connector) : Format compact, très utilisé
- FC (Ferrule Connector) : Connexion vissée
- ST (Straight Tip) : Connexion baïonnette

**Caractéristiques clés** :
- Pertes d'insertion : 0.3-0.5 dB typiquement
- Réflectance : < -40 dB (UPC), < -60 dB (APC)
- Durabilité : > 500 cycles connexion/déconnexion

**Conseils d'utilisation** :
- Toujours nettoyer avant connexion
- Protéger avec un capuchon quand non utilisé
- Éviter de toucher l'extrémité
- Vérifier l'alignement des clés de positionnement`
  },
  {
    keywords: ['épissure', 'soudure', 'fusion'],
    response: `Une épissure en fibre optique est une connexion permanente entre deux fibres :

🔗 **Définition** : Fusion ou collage permanent de deux fibres

**Types d'épissures** :
1. **Épissure par fusion**
   - Réalisée avec une soudeuse
   - Pertes très faibles (0.1 dB)
   - Meilleure solution pour du permanent

2. **Épissure mécanique**
   - Assemblage avec gel d'indice
   - Pertes moyennes (0.2-0.3 dB)
   - Solution rapide sur le terrain

**Points clés** :
- Préparation minutieuse requise
- Dénudage et clivage précis
- Protection après épissure
- Test de traction recommandé`
  },
  {
    keywords: ['atténuation', 'perte', 'affaiblissement'],
    response: `L'atténuation en télécommunications représente la perte de puissance du signal :

📉 **Définition** : Diminution de la puissance du signal lors de sa propagation

**Sources d'atténuation** :
1. **Fibre optique**
   - Absorption du matériau
   - Diffusion de Rayleigh
   - Courbures et micro-courbures
   - Typiquement 0.2-0.4 dB/km

2. **Liaisons hertziennes**
   - Absorption atmosphérique
   - Pluie et conditions météo
   - Obstacles sur le trajet
   - Distance de propagation

**Formule générale** :
A(dB) = α × L + Σ(pertes ponctuelles)
où α = coefficient d'atténuation, L = longueur

**Impact sur le système** :
- Limite la portée maximale
- Affecte le débit de données
- Influence la qualité de service`
  }
];

// Réponses pour les questions sur les bilans de liaison
const bilanResponses: ResponseCategory[] = [
  {
    keywords: ['bilan', 'liaison', 'budget'],
    response: `Le bilan de liaison est un calcul fondamental en télécommunications :

📊 **Définition** : Somme des gains et pertes entre émetteur et récepteur

**Composants du bilan** :
1. **Émission**
   - Puissance émise (dBm)
   - Gain d'antenne émission
   - Pertes câbles/connecteurs

2. **Propagation**
   - Pertes en espace libre
   - Atténuation atmosphérique
   - Marges (pluie, fading)

3. **Réception**
   - Gain d'antenne réception
   - Sensibilité récepteur
   - Pertes câbles/connecteurs

**Formule simplifiée** :
PRx = PTx + GaTx - Lprop + GaRx - Lsys
où:
- PRx = Puissance reçue
- PTx = Puissance émise
- GaTx/Rx = Gains d'antennes
- Lprop = Pertes propagation
- Lsys = Pertes système

**Critères de qualité** :
- Marge de liaison > 10 dB
- Disponibilité > 99.99%
- Respect des normes`
  }
];

// Réponses pour les questions sur l'aide générale
const helpResponses: ResponseCategory[] = [
  {
    keywords: ['aide', 'help', 'que sais', 'que peux'],
    response: `Je suis là pour vous aider ! 🤖 Voici les sujets sur lesquels je peux vous conseiller :

📱 **Réseaux GSM**
- Dimensionnement des TRX
- Calculs de trafic Erlang
- Planification cellulaire

📡 **Réseaux UMTS**
- Configuration des NodeB
- Facteur de charge
- Qualité de service

🛰️ **Liaisons Hertziennes**
- Zones de Fresnel
- Bilans de liaison
- Calculs d'affaiblissement

🔌 **Fibre Optique**
- Calculs d'atténuation
- Épissures et connecteurs
- Bilans de liaison

💡 **Concepts de base**
- Types de connecteurs
- Techniques d'épissure
- Bilans de liaison
- Calculs d'atténuation

Posez-moi une question sur n'importe lequel de ces sujets !`
  }
];

// Réponse par défaut
const defaultResponse = `Je suis votre assistant spécialisé en télécommunications. 

Je peux vous aider sur plusieurs sujets :

📱 **GSM** : "Comment calculer les TRX nécessaires ?"
📡 **UMTS** : "Comment dimensionner un NodeB ?"
🛰️ **Hertzien** : "Comment calculer les zones de Fresnel ?"
🔌 **Fibre** : "Comment calculer l'atténuation ?"

Vous pouvez aussi me poser des questions sur :
- Les types de connecteurs
- Les techniques d'épissure
- Les bilans de liaison
- Les calculs d'atténuation

N'hésitez pas à me poser une question ! 😊`;

// Export toutes les catégories de réponses
export const responses = {
  basic: basicInteractions,
  concepts: basicConcepts,
  gsm: gsmResponses,
  umts: umtsResponses,
  hertzien: hertzienResponses,
  fibre: fibreResponses,
  bilan: bilanResponses,
  help: helpResponses,
  default: defaultResponse
}; 