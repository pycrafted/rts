Je souhaite intégrer un assistant IA dans mon application RTS (React + TypeScript) en utilisant l'API Hugging Face avec le modèle `mistralai/Mistral-7B-Instruct-v0.2`.

Voici les tâches à réaliser :

---

### 1. Composant React : `AssistantIA.tsx`
- Crée un composant React nommé `AssistantIA`.
- Il doit contenir :
  - Une `textarea` pour saisir une question.
  - Un bouton **"Envoyer"**.
  - Un affichage de la réponse de l'IA (sous forme de bloc de texte ou `card`).
  - Un indicateur de chargement (`spinner` ou `loading...`) pendant l'appel API.

---

### 2. Service API : `src/services/iaService.ts`
- Crée un fichier `iaService.ts` dans le dossier `services`.
- Il doit :
  - Envoyer une requête POST à l'API Hugging Face :
    `https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2`
  - Utiliser une clé API Hugging Face stockée dans `.env` :
    ```
    VITE_HF_TOKEN=ton_token_ici
    ```
  - Configurer correctement les headers `Authorization` et `Content-Type`.
  - Retourner uniquement le `generated_text` de la réponse.

---

### 3. Variables d’environnement
- Ajoute dans `.env` :

VITE_HF_TOKEN=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

- Ajoute aussi `VITE_HF_TOKEN` dans `.env.example`.

---

### 4. Intégration UI
- Affiche le composant `AssistantIA` sur une page existante (`dashboard`, `simulation`, etc.).
- Utilise Tailwind CSS pour un rendu propre :
- `card` responsive
- Bouton stylé
- Scroll vertical si la réponse est longue

---

### 5. Bonnes pratiques
- Utilise TypeScript avec typage explicite pour les réponses API.
- Gère les erreurs API proprement (ex : message d’erreur si l’IA ne répond pas).
- Ne jamais exposer directement la clé en production.
- Commente clairement chaque fonction pour faciliter la maintenance.

---

🎯 Objectif final : Permettre à l’utilisateur de poser des questions techniques sur les réseaux télécoms (GSM, UMTS, optique, hertzien…) et d’obtenir une réponse pédagogique générée par l’IA directement dans l’interface RTS.
