/**
 * Configuration des variables d'environnement
 * 
 * Les variables sont chargées depuis le fichier .env à la racine du projet
 */

export const config = {
  // Clé API Hugging Face (depuis .env)
  HF_TOKEN: import.meta.env.VITE_HF_TOKEN,
  
  // URL de l'API Hugging Face - Modèle simple et fiable
  HF_API_URL: 'https://api-inference.huggingface.co/models/gpt2',
  
  // Configuration de l'IA
  AI_CONFIG: {
    max_new_tokens: 100,
    temperature: 0.8,
    top_p: 0.9,
    do_sample: true,
  }
};

// Vérification de la configuration
export const validateConfig = () => {
  if (!config.HF_TOKEN) {
    console.error('❌ Clé API Hugging Face manquante !');
    console.error('Vérifiez que votre fichier .env contient : VITE_HF_TOKEN=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');
    return false;
  }
  
  console.log('✅ Configuration IA chargée avec succès');
  console.log('🔑 Token API :', config.HF_TOKEN.substring(0, 10) + '...');
  console.log('🌐 URL API :', config.HF_API_URL);
  return true;
};

// Validation automatique au chargement
if (typeof window !== 'undefined') {
  validateConfig();
} 