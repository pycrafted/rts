/**
 * Page dédiée à l'export PDF - Version Clean
 * Cette page est conçue spécifiquement pour être convertie en PDF via Puppeteer
 * Elle affiche un rapport complet avec une mise en page professionnelle, sans graphiques
 */

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

interface PDFReportData {
  type: string;
  title: string;
  subtitle?: string;
  data: any;
  metadata?: {
    generatedAt: string;
    user: string;
    company: string;
    version?: string;
  };
}

const PDFReport: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [reportData, setReportData] = useState<PDFReportData | null>(null);
  const [isReady, setIsReady] = useState(false);

  const getDefaultData = (): PDFReportData => ({
    type: 'complete',
    title: 'Rapport RTS',
    subtitle: 'Analyse des réseaux télécoms',
    data: {},
    metadata: {
      generatedAt: new Date().toISOString(),
      user: 'Ingénieur Télécoms',
      company: 'RTS'
    }
  });

  useEffect(() => {
    // Masquer la navbar et autres éléments de l'interface
    const hideInterfaceElements = () => {
      // Sélecteurs ciblés pour masquer uniquement le sidebar et le header
      const targetSelectors = [
        // Sidebar desktop
        '.hidden.lg\\:fixed.lg\\:inset-y-0.lg\\:z-50.lg\\:flex.lg\\:w-72.lg\\:flex-col',
        // Sidebar mobile
        '.fixed.inset-y-0.left-0.z-50.w-72.transform.shadow-xl',
        // Header
        'header.shadow-sm.border-b',
        '.flex.h-14.sm\\:h-16.items-center.justify-between',
        // Navigation
        'nav.flex.flex-1.flex-col.px-3.sm\\:px-4.py-4.sm\\:py-6',
        '.flex.h-full.flex-col.bg-white.shadow-xl',
        // Overlay mobile
        '.fixed.inset-0.z-40.bg-gray-600.bg-opacity-75',
        // Boutons de navigation mobile
        'button[type="button"].rounded-md.p-2.hover\\:bg-opacity-10.lg\\:hidden',
        // Éléments de navigation génériques
        'nav', '.navbar', 'header', '.header', '.sidebar',
        '[class*="nav"]', '[class*="Navbar"]', '[class*="Header"]', '[class*="Sidebar"]',
        '[data-testid*="nav"]', '[data-testid*="Nav"]',
        '[role="navigation"]', '[role="banner"]', '[role="complementary"]'
      ];

      // Masquer les éléments ciblés
      targetSelectors.forEach(selector => {
        try {
          const elements = document.querySelectorAll(selector);
          elements.forEach(element => {
            const el = element as HTMLElement;
            el.style.display = 'none';
          });
        } catch (error) {
          // Ignorer les erreurs de sélecteurs invalides
        }
      });

      // Réinitialiser le padding du contenu principal
      const paddingSelectors = [
        '.lg\\:pl-72',
        '.transition-all.duration-300.ease-in-out.lg\\:pl-72'
      ];
      
      paddingSelectors.forEach(selector => {
        try {
          const elements = document.querySelectorAll(`[class*="${selector.replace(/\\/g, '')}"]`);
          elements.forEach(element => {
            const el = element as HTMLElement;
            el.style.paddingLeft = '0';
          });
        } catch (error) {
          // Ignorer les erreurs
        }
      });

      // Réinitialiser le padding du layout principal
      try {
        const layoutElements = document.querySelectorAll('.min-h-screen.pt-safe-top.pb-safe-bottom');
        layoutElements.forEach(element => {
          const el = element as HTMLElement;
          el.style.paddingTop = '0';
          el.style.paddingBottom = '0';
        });
      } catch (error) {
        // Ignorer les erreurs
      }
    };

    // Récupérer les données depuis les paramètres URL ou localStorage
    const dataParam = searchParams.get('data');
    let data: PDFReportData;

    if (dataParam) {
      try {
        data = JSON.parse(decodeURIComponent(dataParam));
      } catch (error) {
        console.error('Erreur parsing data:', error);
        data = getDefaultData();
      }
    } else {
      // Fallback vers localStorage ou données par défaut
      const storedData = localStorage.getItem('pdf-report-data');
      if (storedData) {
        try {
          data = JSON.parse(storedData);
        } catch (error) {
          data = getDefaultData();
        }
      } else {
        data = getDefaultData();
      }
    }

    setReportData(data);
    
    // Attendre que tous les éléments soient chargés
    const loadComplete = async () => {
      // Masquer les éléments de l'interface immédiatement
      hideInterfaceElements();
      
      // Attendre que React soit prêt
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Masquer à nouveau au cas où de nouveaux éléments seraient apparus
      hideInterfaceElements();
      
      // Attendre encore un peu pour s'assurer que tout est bien rendu
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Masquer une dernière fois
      hideInterfaceElements();
      
      setIsReady(true);
      
      // Signal pour Puppeteer que la page est prête
      window.dispatchEvent(new CustomEvent('pdf-ready'));
      
      // Signal alternatif avec un élément visible
      const indicator = document.getElementById('pdf-ready-indicator');
      if (indicator) {
        indicator.style.display = 'block';
      }
    };
    
    loadComplete();
  }, [searchParams]);

  if (!reportData) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement du rapport...</p>
        </div>
      </div>
    );
  }

  const { title, subtitle, data, metadata } = reportData;

  // Fonction pour formater les valeurs
  const formatValue = (value: any): string => {
    // Gérer les valeurs undefined, null ou vides
    if (value === undefined || value === null || value === '') {
      return 'N/A';
    }
    
    if (typeof value === 'number') {
      // Vérifier si c'est un nombre valide
      if (isNaN(value) || !isFinite(value)) {
        return 'N/A';
      }
      return value.toLocaleString('fr-FR', { 
        minimumFractionDigits: 0, 
        maximumFractionDigits: 2 
      });
    }
    
    return String(value);
  };

  // Fonction pour obtenir la couleur de qualité
  const getQualityColor = (quality: string): string => {
    switch (quality?.toLowerCase()) {
      case 'excellente': return 'text-green-600';
      case 'très bonne': return 'text-blue-600';
      case 'bonne': return 'text-yellow-600';
      case 'moyenne': return 'text-orange-600';
      case 'faible': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-white p-8 pdf-content" style={{ fontFamily: 'Inter, sans-serif' }}>
      {/* Styles spécifiques pour l'impression PDF */}
      <style>
        {`
          @media print {
            body { margin: 0; padding: 0; }
            .page-break { page-break-before: always; }
            .no-break { page-break-inside: avoid; }
            .section-break { page-break-inside: avoid; }
          }
          
          /* Masquer UNIQUEMENT le sidebar et le header - APPROCHE CIBLÉE */
          
          /* Masquer le sidebar desktop */
          .hidden.lg\\:fixed.lg\\:inset-y-0.lg\\:z-50.lg\\:flex.lg\\:w-72.lg\\:flex-col {
            display: none !important;
          }
          
          /* Masquer le sidebar mobile */
          .fixed.inset-y-0.left-0.z-50.w-72.transform.shadow-xl {
            display: none !important;
          }
          
          /* Masquer le header */
          header.shadow-sm.border-b {
            display: none !important;
          }
          
          /* Masquer les boutons de navigation mobile */
          button[type="button"].rounded-md.p-2.hover\\:bg-opacity-10.lg\\:hidden {
            display: none !important;
          }
          
          /* Masquer l'overlay mobile */
          .fixed.inset-0.z-40.bg-gray-600.bg-opacity-75 {
            display: none !important;
          }
          
          /* Réinitialiser le padding du contenu principal */
          .lg\\:pl-72,
          .transition-all.duration-300.ease-in-out.lg\\:pl-72 {
            padding-left: 0 !important;
          }
          
          /* Masquer les éléments de navigation spécifiques */
          nav.flex.flex-1.flex-col.px-3.sm\\:px-4.py-4.sm\\:py-6 {
            display: none !important;
          }
          
          /* Masquer le conteneur du sidebar */
          .flex.h-full.flex-col.bg-white.shadow-xl {
            display: none !important;
          }
          
          /* Masquer les éléments de header spécifiques */
          .flex.h-14.sm\\:h-16.items-center.justify-between {
            display: none !important;
          }
          
          /* Réinitialiser le padding du layout principal */
          .min-h-screen.pt-safe-top.pb-safe-bottom {
            padding-top: 0 !important;
            padding-bottom: 0 !important;
          }
          
          /* Masquer les éléments de navigation génériques */
          nav, .navbar, header, .header, .sidebar, .footer {
            display: none !important;
          }
          
          /* Masquer les éléments avec des classes contenant "nav" */
          [class*="nav"], [class*="Navbar"], [class*="Header"], [class*="Sidebar"] {
            display: none !important;
          }
          
          /* Masquer les éléments de navigation React Router */
          [data-testid*="nav"], [data-testid*="Nav"],
          [role="navigation"], [role="banner"], [role="complementary"] {
            display: none !important;
          }
          
          /* Styles optimisés pour Puppeteer */
          .pdf-optimized {
            -webkit-print-color-adjust: exact;
            color-adjust: exact;
          }
          
          /* Amélioration de la lisibilité */
          .pdf-text {
            font-size: 12px;
            line-height: 1.4;
          }
          
          .pdf-title {
            font-size: 28px;
            font-weight: bold;
            margin-bottom: 8px;
            color: white !important;
          }
          
          .pdf-subtitle {
            font-size: 18px;
            color: rgba(255, 255, 255, 0.9) !important;
            margin-bottom: 20px;
          }
          
          .pdf-section {
            margin-bottom: 24px;
            page-break-inside: avoid;
          }
          
          .pdf-card {
            background: #ffffff;
            border: 1px solid #e5e7eb;
            border-radius: 8px;
            padding: 20px;
            margin-bottom: 16px;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          }
          
          .pdf-card-title {
            font-size: 16px;
            font-weight: 600;
            color: #374151;
            margin-bottom: 12px;
            border-bottom: 2px solid #3b82f6;
            padding-bottom: 8px;
          }
          
          .pdf-metric {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 8px 0;
            border-bottom: 1px solid #f3f4f6;
          }
          
          .pdf-metric:last-child {
            border-bottom: none;
          }
          
          .pdf-metric-label {
            font-weight: 500;
            color: #4b5563;
          }
          
          .pdf-metric-value {
            font-weight: 600;
            color: #1f2937;
          }
          
          .pdf-header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            border-radius: 12px;
            margin-bottom: 30px;
            text-align: center;
          }
          
          .pdf-footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 2px solid #e5e7eb;
            text-align: center;
            color: #6b7280;
            font-size: 11px;
          }
        `}
      </style>

      {/* En-tête du rapport */}
      <div className="pdf-header pdf-section">
        <h1 className="pdf-title">{title}</h1>
        {subtitle && <p className="pdf-subtitle">{subtitle}</p>}
        <div className="flex justify-center items-center gap-8 text-sm opacity-90 mt-4">
          <span>Généré le: {new Date(metadata?.generatedAt || Date.now()).toLocaleDateString('fr-FR')}</span>
          <span>Par: {metadata?.user || 'Système'}</span>
          <span>{metadata?.company || 'RTS'}</span>
        </div>
      </div>

      {/* Résumé exécutif */}
      <div className="pdf-section">
        <div className="pdf-card">
          <h2 className="pdf-card-title">📋 Résumé Exécutif</h2>
          <p className="pdf-text text-gray-700 leading-relaxed">
            Ce rapport présente une analyse complète des performances des réseaux télécoms, 
            incluant les technologies GSM, UMTS, Hertzien et Optique. Les résultats démontrent 
            une qualité de service optimale et une couverture réseau satisfaisante pour tous 
            les paramètres évalués.
          </p>
        </div>
      </div>

      {/* Données GSM */}
      {data.gsm && Object.keys(data.gsm).length > 0 && (
        <div className="pdf-section">
          <div className="pdf-card">
            <h2 className="pdf-card-title">📱 Analyse GSM</h2>
            <div className="grid grid-cols-2 gap-4">
              {data.gsm.area !== undefined && (
                <div className="pdf-metric">
                  <span className="pdf-metric-label">Zone de couverture</span>
                  <span className="pdf-metric-value">{formatValue(data.gsm.area)} km²</span>
                </div>
              )}
              {data.gsm.density !== undefined && (
                <div className="pdf-metric">
                  <span className="pdf-metric-label">Densité d'abonnés</span>
                  <span className="pdf-metric-value">{formatValue(data.gsm.density)} ab/km²</span>
                </div>
              )}
              {data.gsm.nbAbonnes !== undefined && (
                <div className="pdf-metric">
                  <span className="pdf-metric-label">Nombre d'abonnés</span>
                  <span className="pdf-metric-value">{formatValue(data.gsm.nbAbonnes)}</span>
                </div>
              )}
              {data.gsm.traficTotal !== undefined && (
                <div className="pdf-metric">
                  <span className="pdf-metric-label">Trafic total</span>
                  <span className="pdf-metric-value">{formatValue(data.gsm.traficTotal)} Erlang</span>
                </div>
              )}
              {data.gsm.nbSites !== undefined && (
                <div className="pdf-metric">
                  <span className="pdf-metric-label">Nombre de sites</span>
                  <span className="pdf-metric-value">{formatValue(data.gsm.nbSites)}</span>
                </div>
              )}
              {data.gsm.gos !== undefined && (
                <div className="pdf-metric">
                  <span className="pdf-metric-label">Grade de service (GOS)</span>
                  <span className="pdf-metric-value">{formatValue(data.gsm.gos)}%</span>
                </div>
              )}
              {data.gsm.couverture !== undefined && (
                <div className="pdf-metric">
                  <span className="pdf-metric-label">Couverture</span>
                  <span className="pdf-metric-value">{formatValue(data.gsm.couverture)}%</span>
                </div>
              )}
              {data.gsm.qualite && (
                <div className="pdf-metric">
                  <span className="pdf-metric-label">Qualité</span>
                  <span className={`pdf-metric-value ${getQualityColor(data.gsm.qualite)}`}>
                    {data.gsm.qualite}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Données UMTS */}
      {data.umts && Object.keys(data.umts).length > 0 && (
        <div className="pdf-section">
          <div className="pdf-card">
            <h2 className="pdf-card-title">📶 Analyse UMTS</h2>
            <div className="grid grid-cols-2 gap-4">
              {data.umts.area !== undefined && (
                <div className="pdf-metric">
                  <span className="pdf-metric-label">Zone de couverture</span>
                  <span className="pdf-metric-value">{formatValue(data.umts.area)} km²</span>
                </div>
              )}
              {data.umts.users !== undefined && (
                <div className="pdf-metric">
                  <span className="pdf-metric-label">Utilisateurs</span>
                  <span className="pdf-metric-value">{formatValue(data.umts.users)}</span>
                </div>
              )}
              {data.umts.debitTotal !== undefined && (
                <div className="pdf-metric">
                  <span className="pdf-metric-label">Débit total</span>
                  <span className="pdf-metric-value">{formatValue(data.umts.debitTotal)} kbps</span>
                </div>
              )}
              {data.umts.nbCellules !== undefined && (
                <div className="pdf-metric">
                  <span className="pdf-metric-label">Nombre de cellules</span>
                  <span className="pdf-metric-value">{formatValue(data.umts.nbCellules)}</span>
                </div>
              )}
              {data.umts.gos !== undefined && (
                <div className="pdf-metric">
                  <span className="pdf-metric-label">Grade de service (GOS)</span>
                  <span className="pdf-metric-value">{formatValue(data.umts.gos)}%</span>
                </div>
              )}
              {data.umts.couverture !== undefined && (
                <div className="pdf-metric">
                  <span className="pdf-metric-label">Couverture</span>
                  <span className="pdf-metric-value">{formatValue(data.umts.couverture)}%</span>
                </div>
              )}
              {data.umts.qualite && (
                <div className="pdf-metric">
                  <span className="pdf-metric-label">Qualité</span>
                  <span className={`pdf-metric-value ${getQualityColor(data.umts.qualite)}`}>
                    {data.umts.qualite}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Données Hertzien */}
      {data.hertzien && Object.keys(data.hertzien).length > 0 && (
        <div className="pdf-section">
          <div className="pdf-card">
            <h2 className="pdf-card-title">📡 Analyse Hertzien</h2>
            <div className="grid grid-cols-2 gap-4">
              {data.hertzien.frequency !== undefined && (
                <div className="pdf-metric">
                  <span className="pdf-metric-label">Fréquence</span>
                  <span className="pdf-metric-value">{formatValue(data.hertzien.frequency)} GHz</span>
                </div>
              )}
              {data.hertzien.distance !== undefined && (
                <div className="pdf-metric">
                  <span className="pdf-metric-label">Distance</span>
                  <span className="pdf-metric-value">{formatValue(data.hertzien.distance)} km</span>
                </div>
              )}
              {data.hertzien.marge !== undefined && (
                <div className="pdf-metric">
                  <span className="pdf-metric-label">Marge de sécurité</span>
                  <span className="pdf-metric-value">{formatValue(data.hertzien.marge)} dB</span>
                </div>
              )}
              {data.hertzien.qualiteLiaison && (
                <div className="pdf-metric">
                  <span className="pdf-metric-label">Qualité de liaison</span>
                  <span className={`pdf-metric-value ${getQualityColor(data.hertzien.qualiteLiaison)}`}>
                    {data.hertzien.qualiteLiaison}
                  </span>
                </div>
              )}
              {data.hertzien.attenuation !== undefined && (
                <div className="pdf-metric">
                  <span className="pdf-metric-label">Atténuation</span>
                  <span className="pdf-metric-value">{formatValue(data.hertzien.attenuation)} dB</span>
                </div>
              )}
              {data.hertzien.puissance !== undefined && (
                <div className="pdf-metric">
                  <span className="pdf-metric-label">Puissance</span>
                  <span className="pdf-metric-value">{formatValue(data.hertzien.puissance)} dBm</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Données Optique */}
      {data.optique && Object.keys(data.optique).length > 0 && (
        <div className="pdf-section">
          <div className="pdf-card">
            <h2 className="pdf-card-title">🔌 Analyse Optique</h2>
            <div className="grid grid-cols-2 gap-4">
              {data.optique.length !== undefined && (
                <div className="pdf-metric">
                  <span className="pdf-metric-label">Longueur de fibre</span>
                  <span className="pdf-metric-value">{formatValue(data.optique.length)} km</span>
                </div>
              )}
              {data.optique.pertesTotales !== undefined && (
                <div className="pdf-metric">
                  <span className="pdf-metric-label">Pertes totales</span>
                  <span className="pdf-metric-value">{formatValue(data.optique.pertesTotales)} dB</span>
                </div>
              )}
              {data.optique.margeSecurite !== undefined && (
                <div className="pdf-metric">
                  <span className="pdf-metric-label">Marge de sécurité</span>
                  <span className="pdf-metric-value">{formatValue(data.optique.margeSecurite)} dB</span>
                </div>
              )}
              {data.optique.qualiteLiaison && (
                <div className="pdf-metric">
                  <span className="pdf-metric-label">Qualité de liaison</span>
                  <span className={`pdf-metric-value ${getQualityColor(data.optique.qualiteLiaison)}`}>
                    {data.optique.qualiteLiaison}
                  </span>
                </div>
              )}
              {data.optique.attenuation !== undefined && (
                <div className="pdf-metric">
                  <span className="pdf-metric-label">Atténuation</span>
                  <span className="pdf-metric-value">{formatValue(data.optique.attenuation)} dB/km</span>
                </div>
              )}
              {data.optique.dispersion !== undefined && (
                <div className="pdf-metric">
                  <span className="pdf-metric-label">Dispersion</span>
                  <span className="pdf-metric-value">{formatValue(data.optique.dispersion)} ps/nm/km</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Conclusions */}
      <div className="pdf-section">
        <div className="pdf-card">
          <h2 className="pdf-card-title">📝 Conclusions</h2>
          <div className="space-y-4">
            <p className="pdf-text text-gray-700 leading-relaxed">
              L'analyse des différents réseaux télécoms révèle des performances globalement 
              satisfaisantes avec des marges de sécurité appropriées pour assurer une qualité 
              de service optimale.
            </p>
            <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
              <p className="pdf-text text-blue-800">
                <strong>Recommandations :</strong> Maintenir les paramètres actuels et 
                surveiller régulièrement les performances pour anticiper les besoins futurs.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Pied de page */}
      <div className="pdf-footer">
        <p>Rapport généré automatiquement par RTS - Radio Transmission System</p>
        <p>Version {metadata?.version || '1.0.0'} | {new Date().toLocaleDateString('fr-FR')}</p>
      </div>

      {/* Indicateur de prêt pour Puppeteer */}
      {isReady && (
        <div 
          id="pdf-ready-indicator" 
          className="fixed top-0 left-0 w-4 h-4 bg-green-500 z-50"
          style={{ 
            display: 'block',
            backgroundColor: '#10B981',
            width: '4px',
            height: '4px',
            position: 'fixed',
            top: '0',
            left: '0',
            zIndex: 9999
          }}
          title="Rapport prêt pour l'export PDF"
        >
          ✓
        </div>
      )}
    </div>
  );
};

export default PDFReport;
