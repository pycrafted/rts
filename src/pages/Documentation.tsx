/**
 * Page de documentation
 * 
 * Cette page fournit une documentation complète sur :
 * - La théorie des liaisons hertziennes
 * - Les méthodes de calcul
 * - Les bonnes pratiques
 * 
 * La page est organisée en sections avec :
 * - Une navigation par onglets
 * - Des explications détaillées
 * - Des exemples concrets
 * - Des recommandations pratiques
 * 
 * @component
 */
import React, { useState } from 'react';

const faqs = [
  {
    q: "Pourquoi mon bilan est négatif ?",
    a: "Vérifiez les pertes, la puissance d'émission et la présence d'obstacles. Un bilan négatif signifie que la puissance reçue est insuffisante."
  },
  {
    q: "Comment interpréter la marge ?",
    a: "Plus la marge est grande, plus la liaison est fiable. Prévoyez toujours une marge de sécurité adaptée à la technologie."
  },
  {
    q: "Que faire si la zone de Fresnel est obstruée ?",
    a: "Essayez de rehausser les antennes ou de déplacer le site pour dégager la zone de Fresnel."
  },
  {
    q: "Quelle marge prévoir en optique ?",
    a: "3 à 6 dB selon la criticité de la liaison et la qualité des composants."
  },
  {
    q: "Comment exporter mes résultats ?",
    a: "Utilisez le bouton Export PDF sur chaque page de simulation pour générer un rapport détaillé."
  }
];

const Documentation: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>('overview');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const sections = {
    overview: {
      title: "Vue d'ensemble",
      icon: '📚',
      content: (
        <div className="prose max-w-none">
          <h3 className="text-2xl font-bold mb-2 text-blue-700 border-l-4 border-blue-400 pl-4">Bienvenue sur l'application de dimensionnement télécoms</h3>
          <p>
            Cette application vous permet de simuler, dimensionner et analyser des réseaux <b>GSM</b>, <b>UMTS</b>, <b>Hertzien</b> et <b>Optique</b>.
            Elle s'adresse aux ingénieurs, étudiants, enseignants et passionnés de télécommunications.
          </p>
          <ul className="list-disc ml-6">
            <li>Calculs automatiques et visualisation des résultats</li>
            <li>Export PDF et sauvegarde des scénarios</li>
            <li>Interface moderne et pédagogique</li>
          </ul>
          <div className="flex flex-wrap gap-4 my-6">
            <span className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">📱 GSM</span>
            <span className="inline-flex items-center gap-2 bg-violet-100 text-violet-800 px-3 py-1 rounded-full text-sm font-semibold">📡 UMTS</span>
            <span className="inline-flex items-center gap-2 bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-semibold">🛰️ Hertzien</span>
            <span className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">🔌 Optique</span>
          </div>
          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-xl my-6">
            <b>Astuce :</b> Naviguez dans les onglets pour découvrir la théorie, les méthodes de calcul, des exemples concrets et des ressources utiles pour chaque technologie.
          </div>
        </div>
      )
    },
    gsm: {
      title: 'GSM (2G) - Réseaux cellulaires',
      icon: '📱',
      content: (
        <div className="prose max-w-none">
          <h3 className="text-xl font-bold mb-2 text-blue-700 border-l-4 border-blue-400 pl-4">Principe</h3>
          <p>Le GSM (Global System for Mobile Communications) est la technologie de base des réseaux mobiles 2G. Il repose sur la division du territoire en cellules, chacune desservie par une station de base (BTS).</p>
          <ul>
            <li><b>Fréquences :</b> 900/1800 MHz</li>
            <li><b>TRX :</b> Transceiver, unité radio de la BTS</li>
            <li><b>GoS :</b> Grade of Service, taux de blocage acceptable</li>
          </ul>
          <h4 className="mt-4 font-semibold text-blue-700">Paramètres à saisir</h4>
          <ul>
            <li>Nombre d'abonnés</li>
            <li>Densité de trafic</li>
            <li>Zone à couvrir</li>
            <li>GoS cible</li>
          </ul>
          <h4 className="mt-4 font-semibold text-blue-700">Résultats</h4>
          <ul>
            <li>Nombre de sites nécessaires</li>
            <li>Nombre de TRX par site</li>
            <li>Capacité totale</li>
          </ul>
          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-xl my-6">
            <b>Conseil :</b> Prévoyez une marge de sécurité sur le trafic et optimisez la répartition des sites pour éviter les zones d'ombre.
          </div>
        </div>
      )
    },
    umts: {
      title: 'UMTS (3G) - Réseaux haut débit',
      icon: '📡',
      content: (
        <div className="prose max-w-none">
          <h3 className="text-xl font-bold mb-2 text-violet-700 border-l-4 border-violet-400 pl-4">Principe</h3>
          <p>L'UMTS (Universal Mobile Telecommunications System) est la technologie 3G. Elle permet des débits plus élevés et une meilleure gestion de la QoS grâce à la notion de facteur de charge.</p>
          <ul>
            <li><b>Fréquence :</b> 2100 MHz</li>
            <li><b>NodeB :</b> Station de base 3G</li>
            <li><b>Cellules :</b> Zones de couverture d'un NodeB</li>
          </ul>
          <h4 className="mt-4 font-semibold text-violet-700">Paramètres à saisir</h4>
          <ul>
            <li>Nombre d'utilisateurs</li>
            <li>Débit voix, data, vidéo</li>
            <li>Zone à couvrir</li>
            <li>Facteur de charge cible</li>
          </ul>
          <h4 className="mt-4 font-semibold text-violet-700">Résultats</h4>
          <ul>
            <li>Nombre de NodeB nécessaires</li>
            <li>Capacité utile par cellule</li>
            <li>Débit total supporté</li>
          </ul>
          <div className="bg-violet-50 border-l-4 border-violet-400 p-4 rounded-xl my-6">
            <b>Conseil :</b> Maintenez le facteur de charge sous 0.7 pour garantir la QoS.
          </div>
        </div>
      )
    },
    hertzien: {
      title: 'Liaisons Hertziennes',
      icon: '🛰️',
      content: (
        <div className="prose max-w-none">
          <h3 className="text-xl font-bold mb-2 text-orange-700 border-l-4 border-orange-400 pl-4">Principe</h3>
          <p>Une liaison hertzienne est un lien point à point utilisant des ondes radio. Elle nécessite une ligne de visée dégagée et un bilan de liaison positif.</p>
          <ul>
            <li><b>Fréquence :</b> 2 à 40 GHz</li>
            <li><b>Zone de Fresnel :</b> À dégager pour limiter les pertes</li>
            <li><b>Obstacles :</b> À éviter sur le trajet</li>
          </ul>
          <h4 className="mt-4 font-semibold text-orange-700">Méthodes de calcul</h4>
          <ul>
            <li>Bilan de liaison (Friis)</li>
            <li>Calcul de la zone de Fresnel</li>
            <li>Pertes par diffraction (Deygout)</li>
          </ul>
          <h4 className="mt-4 font-semibold text-orange-700">Résultats</h4>
          <ul>
            <li>Bilan de liaison (dB)</li>
            <li>Marge de sécurité</li>
            <li>Qualité de la liaison</li>
          </ul>
          <div className="bg-orange-50 border-l-4 border-orange-400 p-4 rounded-xl my-6">
            <b>Conseil :</b> Dégagez la première zone de Fresnel et prévoyez une marge de fade de 20-30 dB.
          </div>
        </div>
      )
    },
    optique: {
      title: 'Liaisons Optiques',
      icon: '🔌',
      content: (
        <div className="prose max-w-none">
          <h3 className="text-xl font-bold mb-2 text-green-700 border-l-4 border-green-400 pl-4">Principe</h3>
          <p>La fibre optique permet des transmissions à très haut débit sur de longues distances avec une faible atténuation.</p>
          <ul>
            <li><b>Atténuation :</b> 0.2 à 0.5 dB/km</li>
            <li><b>Connecteurs/épissures :</b> Sources de pertes supplémentaires</li>
            <li><b>Bilan optique :</b> Puissance reçue à l'extrémité</li>
          </ul>
          <h4 className="mt-4 font-semibold text-green-700">Méthodes de calcul</h4>
          <ul>
            <li>Calcul des pertes totales (fibre + connecteurs + épissures)</li>
            <li>Bilan optique = Puissance émission - pertes totales</li>
          </ul>
          <h4 className="mt-4 font-semibold text-green-700">Résultats</h4>
          <ul>
            <li>Bilan optique (dBm)</li>
            <li>Pertes totales (dB)</li>
            <li>Marge de sécurité</li>
            </ul>
          <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded-xl my-6">
            <b>Conseil :</b> Minimisez le nombre de connecteurs/épissures et prévoyez une marge de sécurité de 3 à 6 dB.
          </div>
        </div>
      )
    },
    calculs: {
      title: 'Méthodes de calcul',
      icon: '🧮',
      content: (
        <div className="prose max-w-none">
          <h3 className="text-xl font-bold mb-2 text-blue-700 border-l-4 border-blue-400 pl-4">Formules principales</h3>
          <ul>
            <li><b>Bilan hertzien :</b> Pr = Pt + Gt + Gr - Lfs - Lcâbles - Ldivers</li>
            <li><b>Perte en espace libre :</b> Lfs = 32.4 + 20log(f) + 20log(d)</li>
            <li><b>Zone de Fresnel :</b> r = 17.3 * sqrt(d1*d2/(f*d))</li>
            <li><b>Bilan optique :</b> Pr = Pt - (Lfib + Lconn + Lépissures)</li>
            <li><b>Capacité GSM :</b> C = N * TRX * canaux/TRX</li>
            <li><b>Facteur de charge UMTS :</b> η = trafic total / capacité cellule</li>
              </ul>
          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-xl my-6">
            <b>Explications :</b> Les bilans sont exprimés en dB ou dBm. Les marges de sécurité sont essentielles pour la fiabilité. Les pertes s'additionnent (câbles, connecteurs, obstacles…).
          </div>
        </div>
      )
    },
    pratiques: {
      title: 'Bonnes pratiques',
      icon: '✅',
      content: (
        <div className="prose max-w-none">
          <h3 className="text-xl font-bold mb-2 text-green-700 border-l-4 border-green-400 pl-4">Conseils pour chaque technologie</h3>
          <ul>
            <li><b>GSM :</b> Prévoyez une marge sur le trafic, surveillez le GoS</li>
            <li><b>UMTS :</b> Maintenez le facteur de charge sous 0.7</li>
            <li><b>Hertzien :</b> Dégagez la zone de Fresnel, marge de fade ≥ 20 dB</li>
            <li><b>Optique :</b> Minimisez les pertes, marge ≥ 3 dB</li>
            <li>Respectez les normes et réglementations locales</li>
            <li>Documentez chaque étape du dimensionnement</li>
          </ul>
                </div>
      )
    },
    exemples: {
      title: 'Exemples concrets',
      icon: '📝',
      content: (
        <div className="prose max-w-none">
          <h3 className="text-xl font-bold mb-2 text-blue-700 border-l-4 border-blue-400 pl-4">Scénarios types</h3>
          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-xl my-6">
            <b>GSM :</b> Dimensionner un réseau pour 10 000 abonnés sur 100 km², GoS 2%<br/>
            <b>UMTS :</b> Calculer le nombre de NodeB pour 8 000 utilisateurs avec 1 Mbps moyen<br/>
            <b>Hertzien :</b> Évaluer la faisabilité d'un lien 20 km à 5 GHz avec obstacles<br/>
            <b>Optique :</b> Calculer le bilan d'une liaison fibre de 30 km avec 4 connecteurs
                </div>
          <h4 className="mt-4 font-semibold text-blue-700">Résultats attendus</h4>
          <ul>
            <li>Nombre de sites, TRX, NodeB, bilan, marge, pertes…</li>
            <li>Interprétation des résultats et recommandations</li>
          </ul>
                </div>
      )
    },
    faq: {
      title: 'FAQ',
      icon: '❓',
      content: (
        <div className="prose max-w-none">
          <h3 className="text-xl font-bold mb-2 text-blue-700 border-l-4 border-blue-400 pl-4">Questions fréquentes</h3>
          <div className="divide-y divide-gray-200">
            {faqs.map((faq, idx) => (
              <div key={idx} className="py-3">
                <button
                  className="flex items-center w-full text-left focus:outline-none"
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                >
                  <span className="mr-2 text-lg">{openFaq === idx ? '▼' : '▶'}</span>
                  <span className="font-semibold text-gray-800">{faq.q}</span>
                </button>
                {openFaq === idx && (
                  <div className="mt-2 text-gray-700 pl-7 animate-fade-in">
                    {faq.a}
                </div>
                )}
                </div>
            ))}
          </div>
        </div>
      )
    },
    ressources: {
      title: 'Ressources externes',
      icon: '🌐',
      content: (
        <div className="prose max-w-none">
          <h3 className="text-xl font-bold mb-2 text-blue-700 border-l-4 border-blue-400 pl-4">Liens utiles et références</h3>
          <ul>
            <li><a href="https://fr.wikipedia.org/wiki/GSM" target="_blank" rel="noopener noreferrer">Wikipedia GSM</a></li>
            <li><a href="https://fr.wikipedia.org/wiki/UMTS" target="_blank" rel="noopener noreferrer">Wikipedia UMTS</a></li>
            <li><a href="https://fr.wikipedia.org/wiki/Liaison_hertzienne" target="_blank" rel="noopener noreferrer">Wikipedia Liaison hertzienne</a></li>
            <li><a href="https://fr.wikipedia.org/wiki/Fibre_optique" target="_blank" rel="noopener noreferrer">Wikipedia Fibre optique</a></li>
            <li><a href="https://www.itu.int/en/ITU-R/Pages/default.aspx" target="_blank" rel="noopener noreferrer">Normes ITU-R</a></li>
            <li><a href="https://www.arcep.fr/" target="_blank" rel="noopener noreferrer">ARCEP (régulation FR)</a></li>
            <li><a href="https://www.cisco.com/c/en/us/solutions/service-provider/5g-solutions/what-is-5g.html" target="_blank" rel="noopener noreferrer">Cisco - Qu'est-ce que la 5G ?</a></li>
            <li><a href="https://www.rfwireless-world.com/calculators.html" target="_blank" rel="noopener noreferrer">RF Wireless World - Outils de calcul</a></li>
          </ul>
        </div>
      )
    }
  };

  // Cast explicite pour éviter l'erreur TS
  const sectionKeys = Object.keys(sections) as Array<keyof typeof sections>;
  const currentSection = sections[activeSection as keyof typeof sections];

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <header className="sticky top-0 z-20 bg-white/80 backdrop-blur shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
          <h1 className="text-4xl font-extrabold flex items-center gap-3">
            <span>📚</span> Documentation
      </h1>
          <span className="text-lg text-gray-500 hidden md:inline">Votre guide complet pour le dimensionnement télécoms</span>
        </div>
        <nav className="flex gap-2 px-6 pb-2 border-b border-gray-100 overflow-x-auto">
          {sectionKeys.map((key) => (
          <button
            key={key}
            onClick={() => setActiveSection(key)}
              className={`px-5 py-2 rounded-full font-semibold transition-all whitespace-nowrap
                ${activeSection === key
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-white/70 text-blue-700 hover:bg-blue-100'}`}
            >
              <span className="mr-2">{sections[key].icon}</span>
              {sections[key].title}
          </button>
        ))}
        </nav>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-10">
        <section className="bg-white rounded-3xl shadow-xl p-8 mb-8 border border-gray-100">
        <div className="flex items-center mb-6">
            <span className="text-3xl mr-4">{currentSection.icon}</span>
            <h2 className="text-2xl font-bold text-gray-800">{currentSection.title}</h2>
        </div>
          {currentSection.content}
        </section>
        <footer className="text-center text-gray-500 py-8">
          <div className="inline-flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-full shadow">
            <span>💬</span>
            <span>Besoin d'aide ? Consultez l'assistant IA ou contactez le support.</span>
      </div>
        </footer>
      </main>
    </div>
  );
};

export default Documentation; 