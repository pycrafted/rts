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
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Atténuation le long de la fibre',
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Position (km)',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Atténuation (dB)',
        },
      },
    },
  };

  return (
    <div className="mt-6 p-4 bg-white rounded-lg shadow">
      <Line data={chartData} options={options} />
    </div>
  );
};

export default OptiqueAttenuationGraph; 