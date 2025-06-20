/**
 * Service pour l'assistant IA spécialisé en télécommunications
 * Utilise des réponses pré-définies pour une performance optimale
 */

import { responses } from './iaResponses';

// Type pour les réponses de l'IA
interface IAResponse {
  success: boolean;
  data?: string;
  error?: string;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

/**
 * Simule un délai de réflexion de l'IA
 * Le temps varie selon la complexité de la question et le nombre de mots-clés trouvés
 */
const simulateThinkingTime = async (question: string): Promise<void> => {
  const lowerQuestion = question.toLowerCase();
  
  // Détermine la complexité de la question
  let complexity = 1; // Base: 1 seconde
  
  // Questions simples (salutations, remerciements)
  if (lowerQuestion.includes('bonjour') || lowerQuestion.includes('salut') || 
      lowerQuestion.includes('merci') || lowerQuestion.includes('bye')) {
    complexity = 0.5; // 500ms
  }
  // Questions techniques complexes
  else if (lowerQuestion.includes('formule') || lowerQuestion.includes('calcul') ||
           lowerQuestion.includes('optimisation') || lowerQuestion.includes('simulation')) {
    complexity = 2; // 2 secondes
  }
  // Questions très complexes (explications détaillées)
  else if (lowerQuestion.includes('comment') && (lowerQuestion.includes('dimensionner') || 
           lowerQuestion.includes('analyser') || lowerQuestion.includes('diagnostiquer'))) {
    complexity = 2.5; // 2.5 secondes
  }
  // Questions de définition ou d'explication
  else if (lowerQuestion.includes('c\'est quoi') || lowerQuestion.includes('qu\'est-ce') ||
           lowerQuestion.includes('définition') || lowerQuestion.includes('explique')) {
    complexity = 1.5; // 1.5 secondes
  }
  
  // Calculer le nombre de mots-clés potentiels dans la question
  let keywordCount = 0;
  for (const response of responses) {
    for (const keyword of response.keywords) {
      if (lowerQuestion.includes(keyword.toLowerCase())) {
        keywordCount++;
      }
    }
  }
  
  // Ajuster la complexité selon le nombre de mots-clés trouvés
  if (keywordCount > 3) {
    complexity += 0.5; // Plus de mots-clés = plus de temps pour "analyser"
  } else if (keywordCount === 0) {
    complexity += 0.3; // Aucun mot-clé = temps pour "chercher"
  }
  
  // Ajoute un peu d'aléatoire pour plus de naturel
  const randomFactor = 0.8 + Math.random() * 0.4; // Entre 0.8 et 1.2
  const delay = Math.floor(complexity * randomFactor * 1000);
  
  await new Promise(resolve => setTimeout(resolve, delay));
};

/**
 * Trouve la meilleure réponse correspondant à la question de l'utilisateur
 * Utilise un système de score pour sélectionner la réponse la plus pertinente
 */
const findBestResponse = (question: string): string => {
  const lowerQuestion = question.toLowerCase();
  
  let bestResponse = '';
  let bestScore = 0;
  
  // Parcourir toutes les réponses pour trouver la meilleure correspondance
  for (const response of responses) {
    let score = 0;
    let matchedKeywords = 0;
    
    // Calculer le score pour cette réponse
    for (const keyword of response.keywords) {
      const lowerKeyword = keyword.toLowerCase();
      
      // Correspondance exacte
      if (lowerQuestion.includes(lowerKeyword)) {
        score += 1;
        matchedKeywords += 1;
        
        // Bonus pour les mots-clés plus longs (plus spécifiques)
        if (keyword.length > 3) {
          score += 0.5;
        }
        
        // Bonus pour les phrases complètes
        if (keyword.includes(' ') || keyword.includes('\'')) {
          score += 1;
        }
        
        // Bonus spécial pour les mots courts mais spécifiques
        if (keyword.length <= 4 && (keyword === 'node' || keyword === 'trx' || keyword === 'bts')) {
          score += 1.5; // Bonus pour les acronymes techniques courts
        }
      }
      // Correspondance partielle pour les mots courts
      else if (keyword.length <= 4 && lowerQuestion.includes(lowerKeyword)) {
        score += 0.5;
        matchedKeywords += 0.5;
      }
    }
    
    // Bonus pour les questions qui commencent par des mots-clés spécifiques
    if (lowerQuestion.startsWith('c\'est quoi') || lowerQuestion.startsWith('qu\'est-ce')) {
      for (const keyword of response.keywords) {
        if (keyword.includes('définition') || keyword.includes('c\'est quoi') || keyword.includes('qu\'est-ce')) {
          score += 2;
        }
      }
    }
    
    // Bonus pour les questions "comment"
    if (lowerQuestion.startsWith('comment')) {
      for (const keyword of response.keywords) {
        if (keyword.includes('comment') || keyword.includes('calcul') || keyword.includes('dimensionner')) {
          score += 2;
        }
      }
    }
    
    // Bonus pour les questions techniques
    if (lowerQuestion.includes('formule') || lowerQuestion.includes('calcul')) {
      for (const keyword of response.keywords) {
        if (keyword.includes('formule') || keyword.includes('calcul') || keyword.includes('mathématique')) {
          score += 1.5;
        }
      }
    }
    
    // Bonus pour les questions sur les simulations
    if (lowerQuestion.includes('simulation') || lowerQuestion.includes('3d') || lowerQuestion.includes('visualisation')) {
      for (const keyword of response.keywords) {
        if (keyword.includes('simulation') || keyword.includes('3d') || keyword.includes('visualisation')) {
          score += 1.5;
        }
      }
    }
    
    // Bonus pour les questions sur les composants réseau
    if (lowerQuestion.includes('node') || lowerQuestion.includes('trx') || lowerQuestion.includes('bts')) {
      for (const keyword of response.keywords) {
        if (keyword.includes('node') || keyword.includes('trx') || keyword.includes('bts')) {
          score += 1;
        }
      }
    }
    
    // Pénalité si aucun mot-clé ne correspond
    if (matchedKeywords === 0) {
      score = 0;
    }
    
    // Mettre à jour la meilleure réponse si le score est plus élevé
    if (score > bestScore) {
      bestScore = score;
      bestResponse = response.response;
    }
  }

  // Si aucune réponse pertinente n'est trouvée, retourner la réponse par défaut
  if (bestScore === 0) {
    return `Salut ! 😊 Je suis ton assistant IA pour l'application RTS ! 

Je peux t'aider sur de nombreux sujets en télécommunications :

📱 **GSM** : Dimensionnement, TRX, trafic Erlang, planification cellulaire
📶 **UMTS** : NodeB, facteur de charge, handover, optimisation
📡 **Hertzien** : Zones de Fresnel, bilan de liaison, diffraction
🔌 **Fibre optique** : Atténuation, connecteurs, épissures, OTDR
🌐 **Simulations** : Visualisations 3D, contrôles interactifs
📊 **Calculs** : Formules, unités, marges de sécurité

Pose-moi une question spécifique sur l'un de ces domaines, et je te donnerai une réponse détaillée avec des exemples pratiques ! 😄`;
  }

  return bestResponse;
};

/**
 * Fonction principale pour obtenir une réponse de l'IA
 * @param question - La question de l'utilisateur
 * @returns Promise<IAResponse> - Réponse de l'IA ou erreur
 */
export const askIA = async (question: string): Promise<IAResponse> => {
  try {
    // Simule le temps de réflexion de l'IA
    await simulateThinkingTime(question);
    
    const response = findBestResponse(question);
    return {
      success: true,
      data: response
    };
  } catch (error) {
    console.error('❌ Erreur lors de la génération de la réponse:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erreur inconnue'
    };
  }
};

/**
 * Génère un contexte basé sur la page actuelle
 * @param currentPage - Page actuelle de l'application
 * @returns string - Contexte pour l'IA
 */
export const getContextForPage = (currentPage: string): string => {
  const contexts: { [key: string]: string } = {
    '/gsm': 'L\'utilisateur est sur la page de dimensionnement GSM. Questions sur les BTS, TRX, Erlangs, couverture cellulaire.',
    '/umts': 'L\'utilisateur est sur la page de dimensionnement UMTS. Questions sur NodeB, facteur de charge, qualité de service.',
    '/hertzien': 'L\'utilisateur est sur la page de liaisons hertziennes. Questions sur zones de Fresnel, affaiblissement, bilan de liaison.',
    '/optique': 'L\'utilisateur est sur la page de fibre optique. Questions sur atténuation, connecteurs, épissures.',
    '/': 'L\'utilisateur est sur la page d\'accueil.'
  };

  return contexts[currentPage] || 'Page inconnue';
};

/**
 * Traite un message de l'utilisateur et retourne une réponse appropriée
 */
export const processUserMessage = async (message: string): Promise<Message> => {
  // Simule le temps de réflexion de l'IA
  await simulateThinkingTime(message);
  
  const response = findBestResponse(message);
  
  return {
    role: 'assistant',
    content: response
  };
};

/**
 * Initialise le service IA
 */
export const initializeIA = async (): Promise<void> => {
  // Pas besoin d'initialisation particulière car nous utilisons des réponses pré-définies
  return;
}; 