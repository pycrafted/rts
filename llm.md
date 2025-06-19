🧠 Projet IA : RTS-Tutor — LLM pédagogique pour la simulation télécoms
🎯 Objectif général
Créer un modèle LLM spécialisé en télécoms pour l'application RTS, capable :

d’expliquer les concepts aux étudiants (mode étudiant),

et d’argumenter techniquement pour les professionnels (mode expert),

tout en s’intégrant via une API REST dans RTS Web et mobile.

🧩 Détails techniques
Élément	Choix proposé
🏗️ Type de modèle	Fine-tuning d’un LLM open-source
🧠 Base modèle	TinyLlama ou Phi-2 (selon ressources)
📚 Dataset	Corpus d'explications télécoms (GSM, UMTS, hertzien, fibre, calculs, QCM, cours)
🧪 Outil d'entraînement	Kaggle (avec GPU gratuit Tesla T4)
💾 Format exportable	.gguf (Ollama) ou .bin pour API Flask/Node
🧩 Intégration	API locale ou distante dans RTS React + Mobile

💡 Fonctions du modèle
Mode	Fonctions principales
🎓 Étudiant	Définitions simples, exemples, quiz courts, pas à pas, aide aux erreurs
👨‍💼 Pro	Explications techniques, justifications, recommandations réseau

📚 Structure du dataset (instruction/response)
json
Copier
Modifier
{
  "instruction": "Explique la différence entre GSM et UMTS en mode étudiant",
  "response": "Le GSM est une technologie 2G pour la voix, tandis que l’UMTS est une 3G qui permet la vidéo et Internet mobile. Par exemple..."
}
📈 Avantages
✅ Très léger → utilisable localement sans coûts

✅ Personnalisé aux besoins RTS

✅ Fiable même sans Internet

✅ Adaptable aux nouveaux modules (5G, IoT, etc.)

📆 Étapes à suivre (après examens) :
✅ Rassembler les contenus télécoms utiles (cours, explications, réponses types)

✅ Créer le dataset d’instructions

✅ Choisir le modèle de base et lancer le fine-tuning sur Kaggle

✅ Tester les réponses et affiner

✅ Intégrer l’API dans RTS (web & mobile)

🎓 Note de l’idée : 19/20
🌟 Un excellent projet : original, utile pédagogiquement, techniquement solide, économiquement viable.
Seul point à surveiller : bien gérer la qualité du dataset d'entraînement pour que l’IA reste pertinente.