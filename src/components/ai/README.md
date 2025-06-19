# Assistant IA Télécoms 🤖

## Vue d'ensemble

L'assistant IA intégré utilise le modèle **Mistral-7B-Instruct-v0.2** d'Hugging Face pour fournir des réponses expertes sur les télécommunications.

## Fonctionnalités

### 🎯 **Expertise Spécialisée**
- **GSM** : BTS, TRX, Erlangs, couverture cellulaire
- **UMTS** : NodeB, facteur de charge, qualité de service
- **Hertzien** : Zones de Fresnel, affaiblissement, bilan de liaison
- **Optique** : Atténuation fibre, connecteurs, épissures
- **Simulation** : Visualisation 3D, paramètres de simulation

### 🚀 **Interface Moderne**
- **Chat en temps réel** avec historique des conversations
- **Contexte adaptatif** selon la page actuelle
- **Interface responsive** et accessible
- **Indicateurs de chargement** et gestion d'erreurs

### 📱 **Deux Modes d'Utilisation**
1. **Dashboard intégré** : Assistant fixe dans le dashboard
2. **Assistant flottant** : Bouton flottant sur toutes les pages

## Configuration

### 1. Variables d'Environnement
Créez un fichier `.env` à la racine du projet :
```env
VITE_HF_TOKEN=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
```

### 2. Configuration API
Le service utilise la configuration dans `src/config/env.ts` :
- **URL API** : `https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2`
- **Paramètres** : Temperature 0.7, Top-p 0.9, Max tokens 512

## Utilisation

### Exemples de Questions

#### 📱 **GSM**
- "Comment calculer le nombre de TRX nécessaires ?"
- "Qu'est-ce que la formule d'Erlang-B ?"
- "Comment optimiser la couverture cellulaire ?"

#### 📡 **UMTS**
- "Comment calculer le facteur de charge ?"
- "Qu'est-ce que la qualité de service UMTS ?"
- "Comment dimensionner un NodeB ?"

#### 🔌 **Hertzien**
- "Comment calculer les zones de Fresnel ?"
- "Qu'est-ce que l'affaiblissement en espace libre ?"
- "Comment optimiser un bilan de liaison ?"

#### 💡 **Optique**
- "Comment calculer l'atténuation fibre ?"
- "Quelles sont les pertes par connecteur ?"
- "Comment optimiser une liaison optique ?"

## Architecture

### Composants
- `AssistantIA.tsx` : Composant principal du chat
- `FloatingAssistant.tsx` : Version flottante
- `iaService.ts` : Service API Hugging Face
- `env.ts` : Configuration centralisée

### Flux de Données
1. **Saisie utilisateur** → `AssistantIA`
2. **Contexte page** → `getContextForPage()`
3. **Requête API** → `askIA()`
4. **Réponse IA** → Affichage dans le chat

## Bonnes Pratiques

### 🔒 **Sécurité**
- ✅ Clé API dans les variables d'environnement
- ✅ Validation des réponses API
- ✅ Gestion d'erreurs robuste

### 🎨 **UX/UI**
- ✅ Interface responsive
- ✅ Indicateurs de chargement
- ✅ Auto-scroll vers les nouveaux messages
- ✅ Formatage markdown des réponses

### 📊 **Performance**
- ✅ Limitation des tokens (512 max)
- ✅ Cache des contextes par page
- ✅ Gestion des timeouts API

## Dépannage

### Erreurs Courantes

#### "Clé API manquante"
```bash
# Vérifiez votre fichier .env
VITE_HF_TOKEN=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
```

#### "Erreur API (503)"
- Le modèle peut être en cours de chargement
- Réessayez dans quelques secondes

#### "Format de réponse invalide"
- Problème temporaire avec l'API Hugging Face
- Vérifiez votre connexion internet

## Développement

### Ajouter un Nouveau Contexte
```typescript
// Dans iaService.ts
const contexts = {
  '/nouvelle-page': 'Description du contexte pour la nouvelle page'
};
```

### Personnaliser le Prompt Système
```typescript
// Dans iaService.ts
const systemPrompt = `Ton nouveau prompt système ici...`;
```

### Modifier les Paramètres IA
```typescript
// Dans config/env.ts
AI_CONFIG: {
  max_new_tokens: 1024, // Plus de tokens
  temperature: 0.5,     // Moins créatif
  top_p: 0.8,          // Plus focalisé
}
```

---

**Note** : L'assistant IA est optimisé pour les questions techniques sur les télécommunications. Pour les questions générales, il peut fournir des réponses moins précises. 