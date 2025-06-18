import React from 'react';
import { Line } from 'react-chartjs-2';
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
  const calculateAttenuation = (position: number) => {
    let totalAttenuation = (position / 1000) * attenuation; // dB/km to dB/m

    // Ajouter les pertes des épissures
    splices.forEach((splice) => {
      if (splice.position <= position) {
        totalAttenuation += 0.1; // 0.1 dB perte par épissure
      }
    });

    // Ajouter les pertes des connecteurs
    connectors.forEach((connector) => {
      if (connector.position <= position) {
        totalAttenuation += 0.3; // 0.3 dB perte par connecteur
      }
    });

    return totalAttenuation;
  };

  const data = {
    labels: Array.from({ length: 11 }, (_, i) => (i * fiberLength / 10).toFixed(1)),
    datasets: [
      {
        label: 'Atténuation (dB)',
        data: Array.from({ length: 11 }, (_, i) => 
          calculateAttenuation(i * fiberLength / 10)
        ),
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
          text: 'Position (m)',
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
    <div className="mt-8 p-4 bg-white rounded-lg shadow">
      <Line data={data} options={options} />
    </div>
  );
};

export default OptiqueAttenuationGraph; 