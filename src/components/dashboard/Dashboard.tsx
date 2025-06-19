import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/Card';
import Button from '../ui/Button';
import MetricCard from '../data/MetricCard';
import { Link } from 'react-router-dom';

// Données fictives pour le dashboard
const stats = [
  { module: 'GSM', sites: 12, marge: 15, bilan: 10 },
  { module: 'Hertzien', sites: 4, marge: 8, bilan: 5 },
  { module: 'Optique', sites: 2, marge: 20, bilan: 18 },
  { module: 'UMTS', sites: 6, marge: 12, bilan: 9 },
];

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
  const [gsmHistory, setGsmHistory] = React.useState<any[]>([]);
  const [hertzienHistory, setHertzienHistory] = React.useState<any[]>([]);
  const [optiqueHistory, setOptiqueHistory] = React.useState<any[]>([]);
  const [umtsHistory, setUmtsHistory] = React.useState<any[]>([]);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    setGsmHistory(getGsmHistory());
    setHertzienHistory(getHertzienHistory());
    setOptiqueHistory(getOptiqueHistory());
    setUmtsHistory(getUmtsHistory());
  }, []);

  function exportAllHistories() {
    const data = {
      gsm: getGsmHistory(),
      hertzien: getHertzienHistory(),
      optique: getOptiqueHistory(),
      umts: getUmtsHistory(),
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
        if (data.gsm) localStorage.setItem('gsm_history', JSON.stringify(data.gsm));
        if (data.hertzien) localStorage.setItem('hertzien_history', JSON.stringify(data.hertzien));
        if (data.optique) localStorage.setItem('optique_history', JSON.stringify(data.optique));
        if (data.umts) localStorage.setItem('umts_history', JSON.stringify(data.umts));
        alert('Import réussi !');
        setGsmHistory(getGsmHistory());
        setHertzienHistory(getHertzienHistory());
        setOptiqueHistory(getOptiqueHistory());
        setUmtsHistory(getUmtsHistory());
      } catch {
        alert('Fichier invalide.');
      }
    };
    reader.readAsText(file);
  }

  function exportPDFReport() {
    const doc = new jsPDF();
    doc.text('Rapport de dimensionnement Télécoms', 14, 16);
    let y = 24;

    // GSM
    const gsm = getGsmHistory()[0];
    if (gsm) {
      doc.text('GSM', 14, y);
      autoTable(doc, {
        startY: y + 2,
        head: [['Abonnés', 'Sites', 'TRX', 'Trafic (Erlangs)']],
        body: [[
          gsm.nbAbonnes,
          gsm.nbSites,
          gsm.nbTRX,
          gsm.traficTotal
        ]],
      });
      y = (doc as any).lastAutoTable.finalY + 8;
    }

    // Hertzien
    const hertzien = getHertzienHistory()[0];
    if (hertzien) {
      doc.text('Hertzien', 14, y);
      autoTable(doc, {
        startY: y + 2,
        head: [['Affaiblissement (dB)', 'Bilan (dB)', 'Marge (dB)']],
        body: [[
          hertzien.affaiblissement,
          hertzien.bilan,
          hertzien.marge
        ]],
      });
      y = (doc as any).lastAutoTable.finalY + 8;
    }

    // Optique
    const optique = getOptiqueHistory()[0];
    if (optique) {
      doc.text('Optique', 14, y);
      autoTable(doc, {
        startY: y + 2,
        head: [['Att. fibre (dB)', 'Pertes totales (dB)', 'Bilan (dBm)']],
        body: [[
          optique.attFibre,
          optique.pertesTotales,
          optique.bilan
        ]],
      });
      y = (doc as any).lastAutoTable.finalY + 8;
    }

    // UMTS
    const umts = getUmtsHistory()[0];
    if (umts) {
      doc.text('UMTS', 14, y);
      autoTable(doc, {
        startY: y + 2,
        head: [['Débit total (kbps)', 'Cellules', 'NodeB']],
        body: [[
          umts.debitTotal,
          umts.nbCellules,
          umts.nbNodeB
        ]],
      });
      y = (doc as any).lastAutoTable.finalY + 8;
    }

    doc.save('rapport_dimensionnement_telecoms.pdf');
  }

  const totalSites = stats.reduce((sum, stat) => sum + stat.sites, 0);
  const totalCalculs = gsmHistory.length + hertzienHistory.length + optiqueHistory.length + umtsHistory.length;

  // Mémoriser les données des métriques
  const metrics = useMemo(() => [
    {
      title: "Simulations GSM",
      value: `${getGsmHistory().length}`,
      icon: "📱",
      variant: "default" as const,
      link: "/gsm"
    },
    {
      title: "Simulations UMTS",
      value: `${getUmtsHistory().length}`,
      icon: "📡",
      variant: "success" as const,
      link: "/umts"
    },
    {
      title: "Liaisons Hertziennes",
      value: `${getHertzienHistory().length}`,
      icon: "🛰️",
      variant: "warning" as const,
      link: "/hertzien"
    },
    {
      title: "Fibres Optiques",
      value: `${getOptiqueHistory().length}`,
      icon: "🔌",
      variant: "error" as const,
      link: "/optique"
    }
  ], []);

  // Mémoriser les sections rapides
  const quickActions = useMemo(() => [
    { title: "Simulation Générale", description: "Liaisons hertziennes avec obstacles", link: "/simulation", icon: "🌐" },
    { title: "Simulation GSM", description: "Couverture et dimensionnement", link: "/simulation/gsm", icon: "📱" },
    { title: "Simulation UMTS", description: "Facteur de charge et QoS", link: "/simulation/umts", icon: "📡" },
    { title: "Simulation Optique", description: "Bilan de liaison fibre", link: "/simulation/optique", icon: "🔌" }
  ], []);

  return (
    <div className="space-y-6">
      {/* En-tête du dashboard */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-2 text-gray-600">
            Vue d'ensemble de vos dimensionnements télécoms
          </p>
        </div>
        
        <div className="mt-4 sm:mt-0 flex flex-col sm:flex-row gap-3">
          <Button
            variant="outline"
            size="sm"
            icon="📊"
            onClick={exportPDFReport}
          >
            Exporter PDF
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            icon="📁"
            onClick={() => fileInputRef.current?.click()}
          >
            Importer
          </Button>
          
          <Button
            variant="primary"
            size="sm"
            icon="💾"
            onClick={exportAllHistories}
          >
            Exporter tout
          </Button>
        </div>
      </div>

      {/* Métriques principales */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Sites/NodeB"
          value={totalSites}
          description="Sites déployés"
          icon="📡"
          variant="default"
          trend={{ value: 12, isPositive: true }}
        />
        
        <MetricCard
          title="Calculs effectués"
          value={totalCalculs}
          description="Dimensionnements"
          icon="🧮"
          variant="success"
        />
        
        <MetricCard
          title="Moyenne marge"
          value="13.8 dB"
          description="Marge de sécurité"
          icon="📊"
          variant="warning"
        />
        
        <MetricCard
          title="Bilan moyen"
          value="10.5 dB"
          description="Bilan de liaison"
          icon="⚖️"
          variant="default"
        />
      </div>

      {/* Graphique comparatif */}
      <Card variant="elevated">
        <CardHeader>
          <CardTitle>Comparatif des modules</CardTitle>
          <CardDescription>
            Répartition des sites et NodeB par technologie
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
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
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
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

      {/* Historique récent */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Historique GSM</CardTitle>
            <CardDescription>Derniers calculs effectués</CardDescription>
          </CardHeader>
          <CardContent>
            {gsmHistory.length > 0 ? (
              <div className="space-y-3">
                {gsmHistory.slice(0, 3).map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">
                        {item.nbAbonnes?.toLocaleString()} abonnés
                      </p>
                      <p className="text-sm text-gray-500">
                        {new Date(item.date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-primary-600">
                        {item.nbSites} sites
                      </p>
                      <p className="text-sm text-gray-500">
                        {item.nbTRX} TRX
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">
                Aucun calcul GSM récent
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Historique UMTS</CardTitle>
            <CardDescription>Derniers calculs effectués</CardDescription>
          </CardHeader>
          <CardContent>
            {umtsHistory.length > 0 ? (
              <div className="space-y-3">
                {umtsHistory.slice(0, 3).map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">
                        {item.debitTotal?.toLocaleString()} kbps
                      </p>
                      <p className="text-sm text-gray-500">
                        {new Date(item.date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-primary-600">
                        {item.nbNodeB} NodeB
                      </p>
                      <p className="text-sm text-gray-500">
                        {item.nbCellules} cellules
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">
                Aucun calcul UMTS récent
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Historique Hertzien</CardTitle>
            <CardDescription>Derniers calculs effectués</CardDescription>
          </CardHeader>
          <CardContent>
            {hertzienHistory.length > 0 ? (
              <div className="space-y-3">
                {hertzienHistory.slice(0, 3).map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">
                        {item.affaiblissement?.toFixed(2)} dB
                      </p>
                      <p className="text-sm text-gray-500">
                        {new Date(item.date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-primary-600">
                        {item.bilan?.toFixed(2)} dB
                      </p>
                      <p className="text-sm text-gray-500">
                        Marge: {item.marge?.toFixed(2)} dB
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">
                Aucun calcul Hertzien récent
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Historique Optique</CardTitle>
            <CardDescription>Derniers calculs effectués</CardDescription>
          </CardHeader>
          <CardContent>
            {optiqueHistory.length > 0 ? (
              <div className="space-y-3">
                {optiqueHistory.slice(0, 3).map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">
                        {item.attFibre?.toFixed(2)} dB
                      </p>
                      <p className="text-sm text-gray-500">
                        {new Date(item.date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-primary-600">
                        {item.bilan?.toFixed(2)} dBm
                      </p>
                      <p className="text-sm text-gray-500">
                        Pertes: {item.pertesTotales?.toFixed(2)} dB
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">
                Aucun calcul Optique récent
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Lien vers l'Assistant IA */}
      <div className="mt-6">
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="text-4xl">🤖</div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Besoin d'aide technique ?</h3>
                  <p className="text-gray-600">Consultez notre assistant IA spécialisé en télécommunications</p>
                </div>
              </div>
              <Link to="/assistant-ia">
                <Button variant="primary" size="lg" className="flex items-center gap-2">
                  <span>💬</span>
                  Ouvrir l'Assistant IA
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Input file caché pour l'import */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={importAllHistories}
        className="hidden"
      />

      {/* Métriques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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

      {/* Actions rapides */}
      <DashboardCard title="Actions Rapides" className="mt-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {quickActions.map((action, index) => (
            <Link
              key={index}
              to={action.link}
              className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{action.icon}</span>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">{action.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{action.description}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </DashboardCard>

      {/* Documentation */}
      <DashboardCard title="Documentation" className="mt-8">
        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-400">
            Consultez la documentation complète pour maîtriser tous les aspects des télécommunications.
          </p>
          <Link
            to="/documentation"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            📚 Voir la documentation
          </Link>
        </div>
      </DashboardCard>
    </div>
  );
};

// Fonctions utilitaires mémorisées
const getGsmHistory = () => {
  try {
    return JSON.parse(localStorage.getItem('gsm_history') || '[]');
  } catch {
    return [];
  }
};

const getUmtsHistory = () => {
  try {
    return JSON.parse(localStorage.getItem('umts_history') || '[]');
  } catch {
    return [];
  }
};

const getHertzienHistory = () => {
  try {
    return JSON.parse(localStorage.getItem('hertzien_history') || '[]');
  } catch {
    return [];
  }
};

const getOptiqueHistory = () => {
  try {
    return JSON.parse(localStorage.getItem('optique_history') || '[]');
  } catch {
    return [];
  }
};

export default Dashboard; 