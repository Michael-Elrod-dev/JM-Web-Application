// components/PieChart.tsx
"use client";

import React from 'react';
import { Pie } from 'react-chartjs-2';
import { TooltipItem, Color } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title, ChartOptions } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend, Title, ChartDataLabels);

interface PieChartProps {
  overdue: number;
  sevenDaysPlus: number;
  nextSevenDays: number;
}

const PieChart: React.FC<PieChartProps> = ({ overdue, sevenDaysPlus, nextSevenDays }) => {
  const totalItems = overdue + sevenDaysPlus + nextSevenDays;

  const data = {
    labels: ['>7 Days', 'Next 7 Days', 'Overdue'],
    datasets: [
      {
        data: [sevenDaysPlus, nextSevenDays, overdue],
        backgroundColor: ['#22C55E', '#F59E0B', '#EF4444'],
        hoverBackgroundColor: ['#36A2EB', '#FFCE56', '#FF6384'],
      },
    ],
  };

  const options: ChartOptions<'pie'> & {
    plugins: {
      datalabels: {
        color: string;
        font: { weight: number; size: number };
        formatter: (value: number) => string;
      };
    };
  } = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          boxWidth: 15,
          boxHeight: 15,
          padding: 15,
          color: (() => {
            const isDarkMode = document.documentElement.classList.contains('dark');
            return isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(107, 114, 128, 1)';
          })(),
          font: {
            size: 12,
          },
        },
      },
      tooltip: {
        callbacks: {
          label: function(context: TooltipItem<'pie'>) {
            const label = context.label || '';
            const value = context.parsed || 0;
            return `${label}: ${value}`;
          }
        }
      },
      datalabels: {
        color: '#fff',
        font: { weight: 700, size: 16 },
        formatter: (value: number) => {
          return value > 0 ? value.toString() : '';
        },
      },
    },
  };  

  return (
    <div className="w-full h-full">
      <Pie data={data} options={options as any} plugins={[ChartDataLabels as any]} />
    </div>
  );
};

export default PieChart;