import React, { useMemo, useEffect, useState, useRef } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Link } from 'react-router-dom';
import { usePDFExport } from '../../services/pdfExportService';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/Card';
import Button from '../ui/Button';
import MetricCard from '../data/MetricCard';

// Composant optimisé avec React.memo
const DashboardCard = React.memo<{ title: string; children: React.ReactNode; className?: string }>(({ title, children, className }) => (
  <Card className={className}>
    <CardHeader>
      <CardTitle>{title}</CardTitle>
    </CardHeader>
    <CardContent>
      {children}
    </CardContent>
  </Card>
));

DashboardCard.displayName = 'DashboardCard';

// Composant optimisé pour les métriques
const MetricCardOptimized = React.memo<{ title: string; value: string; icon: string; variant: 'default' | 'success' | 'warning' | 'error'; link: string }>(({ title, value, icon, variant, link }) => (
  <Link to={link} className="block">
    <MetricCard title={title} value={value} icon={icon} variant={variant} />
  </Link>
));

MetricCardOptimized.displayName = 'MetricCardOptimized';

const Dashboard: React.FC = () => {
  const { exportDashboardReport } = usePDFExport();
  const [gsmHistory, setGsmHistory] = useState<any[]>([]);
  const [hertzienHistory, setHertzienHistory] = useState<any[]>([]);
  const [optiqueHistory, setOptiqueHistory] = useState<any[]>([]);
  const [umtsHistory, setUmtsHistory] = useState<any[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fonction pour charger toutes les données
  const loadAllData = () => {
    try {
      // Utiliser localStorage directement avec gestion d'erreurs
      const gsm = JSON.parse(localStorage.getItem('gsm_history') || '[]');
      const umts = JSON.parse(localStorage.getItem('umts_history') || '[]');
      const hertzien = JSON.parse(localStorage.getItem('hertzien_history') || '[]');
      const optique = JSON.parse(localStorage.getItem('optique_history') || '[]');
      
      setGsmHistory(Array.isArray(gsm) ? gsm : []);
      setUmtsHistory(Array.isArray(umts) ? umts : []);
      setHertzienHistory(Array.isArray(hertzien) ? hertzien : []);
      setOptiqueHistory(Array.isArray(optique) ? optique : []);
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
      // Fallback vers des tableaux vides
      setGsmHistory([]);
      setUmtsHistory([]);
      setHertzienHistory([]);
      setOptiqueHistory([]);
    }
  };

  useEffect(() => {
    loadAllData();

    // Écouter les événements de mise à jour
    const handleStorageUpdate = () => {
      loadAllData();
    };

    // Écouter les événements personnalisés pour chaque type
    window.addEventListener('gsmHistoryUpdated', handleStorageUpdate);
    window.addEventListener('umtsHistoryUpdated', handleStorageUpdate);
    window.addEventListener('hertzienHistoryUpdated', handleStorageUpdate);
    window.addEventListener('optiqueHistoryUpdated', handleStorageUpdate);

    // Écouter les changements du localStorage (fallback)
    const handleStorageChange = (e: StorageEvent) => {
      if (['gsm_history', 'umts_history', 'hertzien_history', 'optique_history'].includes(e.key || '')) {
        loadAllData();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('gsmHistoryUpdated', handleStorageUpdate);
      window.removeEventListener('umtsHistoryUpdated', handleStorageUpdate);
      window.removeEventListener('hertzienHistoryUpdated', handleStorageUpdate);
      window.removeEventListener('optiqueHistoryUpdated', handleStorageUpdate);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  function exportAllHistories() {
    const data = {
      gsm: gsmHistory,
      hertzien: hertzienHistory,
      optique: optiqueHistory,
      umts: umtsHistory,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dimensionnement_telecoms_${new Date().toISOString().slice(0,19).replace(/[:T]/g,'-')}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  function importAllHistories(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        
        // Sauvegarder dans localStorage
        if (data.gsm) localStorage.setItem('gsm_history', JSON.stringify(data.gsm));
        if (data.hertzien) localStorage.setItem('hertzien_history', JSON.stringify(data.hertzien));
        if (data.optique) localStorage.setItem('optique_history', JSON.stringify(data.optique));
        if (data.umts) localStorage.setItem('umts_history', JSON.stringify(data.umts));
        
        alert('Import réussi !');
        loadAllData();
      } catch {
        alert('Fichier invalide.');
      }
    };
    reader.readAsText(file);
  }

  async function exportPDFReport() {
    try {
      console.log('📊 Export PDF complet en cours...');
      
      // Calculer les métriques globales
      const totalGsmCalculs = gsmHistory.length;
      const totalUmtsCalculs = umtsHistory.length;
      const totalHertzienCalculs = hertzienHistory.length;
      const totalOptiqueCalculs = optiqueHistory.length;

      const totalGsmDistance = gsmHistory.reduce((sum: number, item: any) => sum + (item.area || 0), 0);
      const totalUmtsDistance = umtsHistory.reduce((sum: number, item: any) => sum + (item.area || 0), 0);
      const totalHertzienDistance = hertzienHistory.reduce((sum: number, item: any) => sum + (item.distance || 0), 0);
      const totalOptiqueDistance = optiqueHistory.reduce((sum: number, item: any) => sum + (item.params?.length || 0), 0);

      const totalGsmMarge = gsmHistory.reduce((sum: number, item: any) => sum + (item.gos || 0), 0);
      const totalUmtsMarge = umtsHistory.reduce((sum: number, item: any) => sum + (item.gos || 0), 0);
      const totalHertzienMarge = hertzienHistory.reduce((sum: number, item: any) => sum + (item.marge || 0), 0);
      const totalOptiqueMarge = optiqueHistory.reduce((sum: number, item: any) => sum + (item.bilan || 0), 0);

      const totalGsmBilan = gsmHistory.reduce((sum: number, item: any) => sum + (item.nbSites || 0), 0);
      const totalUmtsBilan = umtsHistory.reduce((sum: number, item: any) => sum + (item.nbNodeB || 0), 0);
      const totalHertzienBilan = hertzienHistory.reduce((sum: number, item: any) => sum + (item.bilan || 0), 0);
      const totalOptiqueBilan = optiqueHistory.reduce((sum: number, item: any) => sum + (item.bilan || 0), 0);

      const allData = {
        gsm: {
          history: gsmHistory,
          metrics: {
            totalCalculs: totalGsmCalculs,
            totalDistance: totalGsmDistance,
            totalMarge: totalGsmMarge,
            totalBilan: totalGsmBilan,
            moyenneDistance: totalGsmCalculs > 0 ? totalGsmDistance / totalGsmCalculs : 0,
            moyenneMarge: totalGsmCalculs > 0 ? totalGsmMarge / totalGsmCalculs : 0,
            moyenneBilan: totalGsmCalculs > 0 ? totalGsmBilan / totalGsmCalculs : 0
          }
        },
        umts: {
          history: umtsHistory,
          metrics: {
            totalCalculs: totalUmtsCalculs,
            totalDistance: totalUmtsDistance,
            totalMarge: totalUmtsMarge,
            totalBilan: totalUmtsBilan,
            moyenneDistance: totalUmtsCalculs > 0 ? totalUmtsDistance / totalUmtsCalculs : 0,
            moyenneMarge: totalUmtsCalculs > 0 ? totalUmtsMarge / totalUmtsCalculs : 0,
            moyenneBilan: totalUmtsCalculs > 0 ? totalUmtsBilan / totalUmtsCalculs : 0
          }
        },
        hertzien: {
          history: hertzienHistory,
          metrics: {
            totalCalculs: totalHertzienCalculs,
            totalDistance: totalHertzienDistance,
            totalMarge: totalHertzienMarge,
            totalBilan: totalHertzienBilan,
            moyenneDistance: totalHertzienCalculs > 0 ? totalHertzienDistance / totalHertzienCalculs : 0,
            moyenneMarge: totalHertzienCalculs > 0 ? totalHertzienMarge / totalHertzienCalculs : 0,
            moyenneBilan: totalHertzienCalculs > 0 ? totalHertzienBilan / totalHertzienCalculs : 0
          }
        },
        optique: {
          history: optiqueHistory,
          metrics: {
            totalCalculs: totalOptiqueCalculs,
            totalDistance: totalOptiqueDistance,
            totalMarge: totalOptiqueMarge,
            totalBilan: totalOptiqueBilan,
            moyenneDistance: totalOptiqueCalculs > 0 ? totalOptiqueDistance / totalOptiqueCalculs : 0,
            moyenneMarge: totalOptiqueCalculs > 0 ? totalOptiqueMarge / totalOptiqueCalculs : 0,
            moyenneBilan: totalOptiqueCalculs > 0 ? totalOptiqueBilan / totalOptiqueCalculs : 0
          }
        },
        global: {
          totalCalculs: totalGsmCalculs + totalUmtsCalculs + totalHertzienCalculs + totalOptiqueCalculs,
          totalDistance: totalGsmDistance + totalUmtsDistance + totalHertzienDistance + totalOptiqueDistance,
          totalMarge: totalGsmMarge + totalUmtsMarge + totalHertzienMarge + totalOptiqueMarge,
          totalBilan: totalGsmBilan + totalUmtsBilan + totalHertzienBilan + totalOptiqueBilan
        }
      };

      const result = await exportDashboardReport(allData);
      
      if (result.success) {
        console.log('✅ Export PDF réussi:', result.filePath);
        alert(`PDF exporté avec succès !\nFichier: ${result.filePath}`);
      } else {
        console.error('❌ Échec de l\'export PDF:', result.error);
        alert(`Erreur lors de l'export PDF: ${result.error}`);
      }
    } catch (error) {
      console.error('❌ Erreur lors de l\'export PDF:', error);
      alert('Erreur lors de l\'export PDF. Vérifiez la console pour plus de détails.');
    }
  }

  // Calculs basés sur les vraies données
  const totalSites = useMemo(() => {
    const gsmSites = gsmHistory.reduce((sum, item) => sum + (item.nbSites || 0), 0);
    const umtsNodeB = umtsHistory.reduce((sum, item) => sum + (item.nbNodeB || 0), 0);
    return gsmSites + umtsNodeB;
  }, [gsmHistory, umtsHistory]);

  const totalCalculs = gsmHistory.length + hertzienHistory.length + optiqueHistory.length + umtsHistory.length;

  // Calcul de la marge moyenne
  const margeMoyenne = useMemo(() => {
    const marges = [
      ...hertzienHistory.map(item => item.marge || 0),
      ...optiqueHistory.map(item => item.marge || 0)
    ];
    return marges.length > 0 ? (marges.reduce((sum, marge) => sum + marge, 0) / marges.length).toFixed(1) : '0.0';
  }, [hertzienHistory, optiqueHistory]);

  // Calcul du bilan moyen
  const bilanMoyen = useMemo(() => {
    const bilans = [
      ...hertzienHistory.map(item => item.bilan || 0),
      ...optiqueHistory.map(item => item.bilan || 0)
    ];
    return bilans.length > 0 ? (bilans.reduce((sum, bilan) => sum + bilan, 0) / bilans.length).toFixed(1) : '0.0';
  }, [hertzienHistory, optiqueHistory]);

  // Données pour le graphique basées sur les vraies données
  const chartData = useMemo(() => {
    const gsmSites = gsmHistory.reduce((sum, item) => sum + (item.nbSites || 0), 0);
    const umtsNodeB = umtsHistory.reduce((sum, item) => sum + (item.nbNodeB || 0), 0);
    
    return [
      { module: 'GSM', sites: gsmSites, calculs: gsmHistory.length },
      { module: 'UMTS', sites: umtsNodeB, calculs: umtsHistory.length },
      { module: 'Hertzien', sites: hertzienHistory.length, calculs: hertzienHistory.length },
      { module: 'Optique', sites: optiqueHistory.length, calculs: optiqueHistory.length },
    ];
  }, [gsmHistory, umtsHistory, hertzienHistory, optiqueHistory]);

  // Mémoriser les données des métriques
  const metrics = useMemo(() => [
    {
      title: "Simulations GSM",
      value: `${gsmHistory.length}`,
      icon: "📱",
      variant: "default" as const,
      link: "/gsm"
    },
    {
      title: "Simulations UMTS",
      value: `${umtsHistory.length}`,
      icon: "📡",
      variant: "success" as const,
      link: "/umts"
    },
    {
      title: "Liaisons Hertziennes",
      value: `${hertzienHistory.length}`,
      icon: "🛰️",
      variant: "warning" as const,
      link: "/hertzien"
    },
    {
      title: "Fibres Optiques",
      value: `${optiqueHistory.length}`,
      icon: "🔌",
      variant: "error" as const,
      link: "/optique"
    }
  ], [gsmHistory.length, umtsHistory.length, hertzienHistory.length, optiqueHistory.length]);

  // Mémoriser les sections rapides
  const quickActions = useMemo(() => [
    { title: "Simulation Hertzien", description: "Liaisons hertziennes avec obstacles", link: "/simulation/hertzien", icon: "🛰️" },
    { title: "Simulation GSM", description: "Couverture et dimensionnement", link: "/simulation/gsm", icon: "📱" },
    { title: "Simulation UMTS", description: "Facteur de charge et QoS", link: "/simulation/umts", icon: "📡" },
    { title: "Simulation Optique", description: "Bilan de liaison fibre", link: "/simulation/optique", icon: "🔌" }
  ], []);

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* En-tête du dashboard - Mobile First */}
      <div className="space-y-4">
        <div className="text-center sm:text-left">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-1 sm:mt-2 text-sm sm:text-base text-gray-600">
            Vue d'ensemble de vos dimensionnements télécoms
          </p>
        </div>
        
        {/* Boutons d'action - Mobile: menu hamburger, Desktop: boutons */}
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
          <Button
            variant="outline"
            size="sm"
            icon="📊"
            onClick={exportPDFReport}
            className="w-full sm:w-auto"
          >
            <span className="hidden sm:inline">Exporter PDF</span>
            <span className="sm:hidden">PDF</span>
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            icon="📁"
            onClick={() => fileInputRef.current?.click()}
            className="w-full sm:w-auto"
          >
            <span className="hidden sm:inline">Importer</span>
            <span className="sm:hidden">Import</span>
          </Button>
          
          <Button
            variant="primary"
            size="sm"
            icon="💾"
            onClick={exportAllHistories}
            className="w-full sm:w-auto"
          >
            <span className="hidden sm:inline">Exporter tout</span>
            <span className="sm:hidden">Export</span>
          </Button>
        </div>
      </div>

      {/* Métriques principales - Mobile: 2 colonnes, Desktop: 4 colonnes */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
        <MetricCard
          title="Total Sites"
          value={totalSites.toString()}
          description="Sites déployés"
          icon="📡"
          variant="default"
        />
        
        <MetricCard
          title="Calculs"
          value={totalCalculs.toString()}
          description="Dimensionnements"
          icon="🧮"
          variant="success"
        />
        
        <MetricCard
          title="Marge moy."
          value={`${margeMoyenne} dB`}
          description="Marge de sécurité"
          icon="📊"
          variant="warning"
        />
        
        <MetricCard
          title="Bilan moy."
          value={`${bilanMoyen} dB`}
          description="Bilan de liaison"
          icon="⚖️"
          variant="default"
        />
      </div>

      {/* Actions rapides - PRIORITÉ MOBILE */}
      <Card className="card-mobile">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg sm:text-xl">🚀 Actions Rapides</CardTitle>
          <CardDescription className="text-sm">
            Accédez rapidement aux simulations principales
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {quickActions.map((action, index) => (
              <Link
                key={index}
                to={action.link}
                className="nav-item-mobile p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <span className="text-xl sm:text-2xl flex-shrink-0">{action.icon}</span>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 text-sm sm:text-base truncate">{action.title}</h3>
                    <p className="text-xs sm:text-sm text-gray-600 mt-1 line-clamp-2">{action.description}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Modules de simulation - PRIORITÉ MOBILE */}
      <Card className="card-mobile">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg sm:text-xl">📱 Modules de Simulation</CardTitle>
          <CardDescription className="text-sm">
            Vos simulations par technologie
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            {metrics.map((metric, index) => (
              <MetricCardOptimized
                key={index}
                title={metric.title}
                value={metric.value}
                icon={metric.icon}
                variant={metric.variant}
                link={metric.link}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Graphique comparatif - Mobile: hauteur réduite */}
      <Card className="card-mobile">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg sm:text-xl">📊 Comparatif des modules</CardTitle>
          <CardDescription className="text-sm">
            Répartition des sites et NodeB par technologie
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-48 sm:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis 
                  dataKey="module" 
                  tick={{ fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis 
                  allowDecimals={false}
                  tick={{ fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                    fontSize: '12px'
                  }}
                />
                <Legend />
                <Bar 
                  dataKey="sites" 
                  fill="#3b82f6" 
                  radius={[4, 4, 0, 0]}
                  name="Sites/NodeB"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Historique récent - Mobile: accordéon, Desktop: grille */}
      <div className="space-y-4 sm:grid sm:grid-cols-2 lg:grid-cols-4 sm:gap-6 sm:space-y-0">
        <Card className="card-mobile">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg sm:text-xl">📱 Historique GSM</CardTitle>
            <CardDescription className="text-sm">Derniers calculs effectués</CardDescription>
          </CardHeader>
          <CardContent>
            {gsmHistory.length > 0 ? (
              <div className="space-y-2 sm:space-y-3">
                {gsmHistory.slice(0, 3).map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-2 sm:p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1 min-w-0 mr-2">
                      <p className="font-medium text-gray-900 text-sm truncate">
                        {item.nbAbonnes?.toLocaleString()} abonnés
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {new Date(item.date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="font-medium text-primary-600 text-sm truncate">
                        {item.nbSites} sites
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {item.nbTRX} TRX
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4 text-sm">
                Aucun calcul GSM récent
              </p>
            )}
          </CardContent>
        </Card>

        <Card className="card-mobile">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg sm:text-xl">📡 Historique UMTS</CardTitle>
            <CardDescription className="text-sm">Derniers calculs effectués</CardDescription>
          </CardHeader>
          <CardContent>
            {umtsHistory.length > 0 ? (
              <div className="space-y-2 sm:space-y-3">
                {umtsHistory.slice(0, 3).map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-2 sm:p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1 min-w-0 mr-2">
                      <p className="font-medium text-gray-900 text-sm truncate">
                        {item.debitTotal?.toLocaleString()} kbps
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {new Date(item.date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="font-medium text-primary-600 text-sm truncate">
                        {item.nbNodeB} NodeB
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {item.nbCellules} cellules
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4 text-sm">
                Aucun calcul UMTS récent
              </p>
            )}
          </CardContent>
        </Card>

        <Card className="card-mobile">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg sm:text-xl">🛰️ Historique Hertzien</CardTitle>
            <CardDescription className="text-sm">Derniers calculs effectués</CardDescription>
          </CardHeader>
          <CardContent>
            {hertzienHistory.length > 0 ? (
              <div className="space-y-2 sm:space-y-3">
                {hertzienHistory.slice(0, 3).map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-2 sm:p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1 min-w-0 mr-2">
                      <p className="font-medium text-gray-900 text-sm truncate">
                        {item.distance} km
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {new Date(item.date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="font-medium text-primary-600 text-sm truncate">
                        {item.bilan?.toFixed(1)} dB
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {item.marge?.toFixed(1)} dB marge
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4 text-sm">
                Aucun calcul Hertzien récent
              </p>
            )}
          </CardContent>
        </Card>

        <Card className="card-mobile">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg sm:text-xl">🔌 Historique Optique</CardTitle>
            <CardDescription className="text-sm">Derniers calculs effectués</CardDescription>
          </CardHeader>
          <CardContent>
            {optiqueHistory.length > 0 ? (
              <div className="space-y-2 sm:space-y-3">
                {optiqueHistory.slice(0, 3).map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-2 sm:p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1 min-w-0 mr-2">
                      <p className="font-medium text-gray-900 text-sm truncate">
                        {item.params?.length} km
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {new Date(item.date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="font-medium text-primary-600 text-sm truncate">
                        {item.bilan?.toFixed(1)} dBm
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {item.pertesTotales?.toFixed(1)} dB pertes
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4 text-sm">
                Aucun calcul Optique récent
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Assistant IA - Mobile: bouton flottant, Desktop: carte */}
      <div className="sm:mt-6">
        <Card className="card-mobile bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
              <div className="flex items-center space-x-3 sm:space-x-4">
                <div className="text-2xl sm:text-4xl flex-shrink-0">🤖</div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 truncate">Besoin d'aide technique ?</h3>
                  <p className="text-xs sm:text-sm text-gray-600 line-clamp-2">Consultez notre assistant IA spécialisé</p>
                </div>
              </div>
              <Link to="/assistant-ia" className="w-full sm:w-auto flex-shrink-0">
                <Button variant="primary" size="sm" className="w-full sm:w-auto form-button-mobile">
                  <span>💬</span>
                  <span className="ml-2 truncate">Assistant IA</span>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Documentation - Mobile: en bas, Desktop: visible */}
      <Card className="card-mobile">
        <CardContent className="p-4 sm:p-6">
          <div className="text-center sm:text-left space-y-3">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900">📚 Documentation</h3>
            <p className="text-sm text-gray-600 line-clamp-3">
              Consultez la documentation complète pour maîtriser tous les aspects des télécommunications.
            </p>
            <Link
              to="/documentation"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors form-button-mobile"
            >
              📚 Voir la documentation
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Input file caché pour l'import */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={importAllHistories}
        className="hidden"
      />
    </div>
  );
};

export default Dashboard; 