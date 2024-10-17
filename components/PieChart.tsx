// components/PieChart.tsx
"use client";

import React from 'react';
import { Pie } from 'react-chartjs-2';
import { TooltipItem } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend, Title, ChartDataLabels);

interface PieChartProps {
  overdue: number;
  sevenDaysPlus: number;
  nextSevenDays: number;
}

const PieChart: React.FC<PieChartProps> = ({ overdue, sevenDaysPlus, nextSevenDays }) => {
  const totalItems = overdue + sevenDaysPlus + nextSevenDays;

  const data = {
    labels: ['Overdue', '>7 Days', 'Next 7 Days'],
    datasets: [
      {
        data: [overdue, sevenDaysPlus, nextSevenDays],
        backgroundColor: ['#FF6384', '#FFCE56', '#36A2EB'],
        hoverBackgroundColor: ['#FF6384', '#FFCE56', '#36A2EB'],
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          boxWidth: 15,
          boxHeight: 15,
          padding: 15,
          color: (context: any) => {
            const isDarkMode = document.documentElement.classList.contains('dark');
            return isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(107, 114, 128, 1)'; // White in dark mode, zinc in light mode
          },
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
      <Pie data={data} options={options} plugins={[ChartDataLabels]} />
    </div>
  );
};

export default PieChart;