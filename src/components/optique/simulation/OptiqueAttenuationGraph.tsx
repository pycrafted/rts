/**
 * Composant de graphique d'atténuation pour la simulation optique
 * 
 * Ce composant affiche un graphique montrant :
 * - L'atténuation totale le long de la fibre
 * - Les points d'épissure et leurs pertes
 * - Les points de connecteur et leurs pertes
 * 
 * @component
 */
import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

// Enregistrement des composants Chart.js nécessaires
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface OptiqueAttenuationGraphProps {
  fiberLength: number;
  splices: Array<{position: number}>;
  connectors: Array<{position: number}>;
  attenuation: number;
}

const OptiqueAttenuationGraph: React.FC<OptiqueAttenuationGraphProps> = ({
  fiberLength,
  splices,
  connectors,
  attenuation,
}) => {
  // Génération des points de données pour le graphique
  const generateData = () => {
    const points = 100; // Nombre de points sur le graphique
    const data = [];
    const labels = [];

    // Constantes pour les pertes
    const SPLICE_LOSS = 0.1; // dB par épissure
    const CONNECTOR_LOSS = 0.5; // dB par connecteur

    let totalLoss = 0;

    for (let i = 0; i <= points; i++) {
      const position = (i / points) * fiberLength;
      labels.push(position.toFixed(1));

      // Calcul de la perte de base due à la fibre
      totalLoss = position * attenuation;

      // Ajout des pertes d'épissure
      splices.forEach(splice => {
        if (splice.position <= position) {
          totalLoss += SPLICE_LOSS;
        }
      });

      // Ajout des pertes de connecteur
      connectors.forEach(connector => {
        if (connector.position <= position) {
          totalLoss += CONNECTOR_LOSS;
        }
      });

      data.push(totalLoss);
    }

    return { labels, data };
  };

  const { labels, data } = generateData();

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Atténuation (dB)',
        data: data,
        borderColor: '#00ffff', // Cyan néon
        backgroundColor: 'rgba(0, 255, 255, 0.1)',
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#00ffff',
        pointBorderColor: '#ffffff',
        pointHoverBackgroundColor: '#ffffff',
        pointHoverBorderColor: '#00ffff',
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: "Évolution de l'atténuation le long de la fibre",
        color: '#e2e8f0', // slate-200
        font: {
          size: 14,
        },
      },
    },
    scales: {
      x: {
        title: { display: true, text: 'Position (km)', color: '#94a3b8' }, // slate-400
        ticks: { color: '#94a3b8' },
        grid: { color: 'rgba(255, 255, 255, 0.1)' },
      },
      y: {
        title: { display: true, text: 'Pertes (dB)', color: '#94a3b8' },
        ticks: { color: '#94a3b8' },
        grid: { color: 'rgba(255, 255, 255, 0.1)' },
      },
    },
  };

  return (
    <div className="h-full w-full">
      <Line data={chartData} options={options} />
    </div>
  );
};

export default OptiqueAttenuationGraph; 