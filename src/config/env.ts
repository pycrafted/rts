/**
 * Configuration de l'application
 */

export const config = {
  // Configuration de l'IA
  AI_CONFIG: {
    max_new_tokens: 100,
    temperature: 0.8,
    top_p: 0.9,
    do_sample: true,
  }
};

// Pas besoin de validation car nous utilisons des réponses pré-définies
export const validateConfig = async (): Promise<boolean> => {
    return true;
};