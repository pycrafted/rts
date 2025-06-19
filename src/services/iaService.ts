/**
 * Service pour l'API Hugging Face
 * Gère les requêtes vers le modèle GPT-2
 */

import { config } from '../config/env';

// Types pour les réponses de l'API
interface HuggingFaceResponse {
  generated_text: string;
}

interface IAResponse {
  success: boolean;
  data?: string;
  error?: string;
}

// Mode test pour développement
const TEST_MODE = true; // Mettre à false pour utiliser l'API réelle

/**
 * Réponses simulées pour le mode test
 */
const getTestResponse = (question: string): string => {
  const lowerQuestion = question.toLowerCase();
  
  if (lowerQuestion.includes('trx') || lowerQuestion.includes('gsm')) {
    return `Pour calculer le nombre de TRX nécessaires en GSM :

1. **Déterminez le trafic total** : Nombre d'abonnés × Trafic par abonné × Facteur d'activité
2. **Appliquez la formule d'Erlang-B** : GoS = (A^N / N!) / Σ(A^i / i!) pour i=0 à N
3. **Calculez les TRX** : TRX = ⌈Trafic total / Capacité par TRX⌉

**Exemple** : Pour 1000 abonnés avec 25 mErlangs chacun :
- Trafic total = 1000 × 0.025 × 0.6 = 15 Erlangs
- Avec GoS = 2%, il faut environ 22 canaux
- Soit 3 TRX (8 canaux par TRX)`;
  }
  
  if (lowerQuestion.includes('umts') || lowerQuestion.includes('nodeb')) {
    return `Pour dimensionner un NodeB en UMTS :

1. **Calculez le facteur de charge** : η = (Eb/N0) × (R/W) × (1 + i)
2. **Déterminez la capacité** : Nombre d'utilisateurs = Capacité / Trafic par utilisateur
3. **Optimisez la couverture** : Puissance = Pmax × (1 - η)

**Paramètres clés** :
- Eb/N0 : Rapport signal/bruit (typiquement 7 dB)
- R : Débit utilisateur (kbps)
- W : Bande passante (3.84 MHz)
- i : Facteur d'interférence (0.65 en urbain)`;
  }
  
  if (lowerQuestion.includes('fresnel') || lowerQuestion.includes('hertzien')) {
    return `Les zones de Fresnel en liaisons hertziennes :

**Rayon de la 1ère zone de Fresnel** :
r₁ = √(λ × d₁ × d₂ / d)
où λ = c/f, d₁ et d₂ sont les distances partielles, d = d₁ + d₂

**Règle pratique** : La 1ère zone doit être dégagée à 60% minimum

**Exemple** : Pour une liaison de 10 km à 6 GHz :
- λ = 0.05 m
- r₁ = √(0.05 × 5000 × 5000 / 10000) = 11.2 m
- Zone de dégagement = 6.7 m minimum`;
  }
  
  if (lowerQuestion.includes('optique') || lowerQuestion.includes('fibre')) {
    return `L'atténuation en fibre optique :

**Atténuation totale** : A = α × L + ΣAᵢ
où α = coefficient d'atténuation (dB/km), L = longueur (km), Aᵢ = pertes ponctuelles

**Pertes typiques** :
- Fibre monomode : 0.2-0.4 dB/km
- Connecteurs : 0.3-0.5 dB par connecteur
- Épissures : 0.1-0.3 dB par épissure

**Exemple** : Liaison de 50 km avec 2 connecteurs :
A = 0.3 × 50 + 2 × 0.4 = 15.8 dB`;
  }
  
  return `Je suis votre assistant IA spécialisé en télécommunications. 

Pour des questions spécifiques, essayez :
- "Comment calculer les TRX en GSM ?"
- "Comment dimensionner un NodeB UMTS ?"
- "Comment calculer les zones de Fresnel ?"
- "Comment calculer l'atténuation fibre ?"`;
};

/**
 * Envoie une requête à l'API Hugging Face
 * @param question - La question de l'utilisateur
 * @returns Promise<IAResponse> - Réponse de l'IA ou erreur
 */
export const askIA = async (question: string): Promise<IAResponse> => {
  try {
    // Mode test pour développement
    if (TEST_MODE) {
      console.log('🧪 Mode test activé - Réponse simulée');
      
      // Simulation d'un délai réseau
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const testResponse = getTestResponse(question);
      
      return {
        success: true,
        data: testResponse
      };
    }

    // Vérification de la clé API
    if (!config.HF_TOKEN) {
      throw new Error('Clé API Hugging Face manquante. Vérifiez votre fichier .env et redémarrez l\'application.');
    }

    // Construction du prompt simple
    const prompt = `Question sur les télécommunications: ${question}`;

    console.log('🤖 Envoi de la requête à l\'API Hugging Face...');

    // Configuration de la requête pour GPT-2
    const response = await fetch(config.HF_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${config.HF_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: {
          max_new_tokens: 100,
          temperature: 0.8,
          top_p: 0.9,
          do_sample: true,
          return_full_text: false
        }
      }),
    });

    // Vérification de la réponse HTTP
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Erreur API:', response.status, errorText);
      
      if (response.status === 503) {
        throw new Error('Le modèle IA est en cours de chargement. Réessayez dans quelques secondes.');
      } else if (response.status === 401) {
        throw new Error('Clé API invalide. Vérifiez votre fichier .env.');
      } else if (response.status === 404) {
        throw new Error('Modèle IA non trouvé. Le service est temporairement indisponible.');
      } else {
        throw new Error(`Erreur API (${response.status}): ${errorText}`);
      }
    }

    // Parsing de la réponse
    const data: HuggingFaceResponse[] = await response.json();
    
    if (!data || !data[0] || !data[0].generated_text) {
      throw new Error('Format de réponse invalide de l\'API');
    }

    // Extraction du texte généré
    const generatedText = data[0].generated_text;
    
    // Nettoyage de la réponse (suppression du prompt original)
    const cleanResponse = generatedText.replace(prompt, '').trim();

    console.log('✅ Réponse IA reçue avec succès');

    return {
      success: true,
      data: cleanResponse || 'Aucune réponse générée'
    };

  } catch (error) {
    console.error('❌ Erreur lors de l\'appel à l\'API IA:', error);
    
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
    '/optique': 'L\'utilisateur est sur la page de liaisons optiques. Questions sur atténuation fibre, connecteurs, épissures.',
    '/simulation': 'L\'utilisateur est sur la page de simulation. Questions sur visualisation 3D, paramètres de simulation.',
    '/dashboard': 'L\'utilisateur est sur le dashboard. Questions générales sur le dimensionnement télécoms.'
  };

  return contexts[currentPage] || 'Questions générales sur les télécommunications et le dimensionnement de réseaux.';
}; 