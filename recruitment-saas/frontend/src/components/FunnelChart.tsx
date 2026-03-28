'use client';

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface FunnelData {
  stage: string;
  count: number;
}

interface FunnelChartProps {
  data: {
    new: number;
    contacted: number;
    interview: number;
    offer: number;
    hired: number;
    rejected: number;
  };
}

export default function FunnelChart({ data }: FunnelChartProps) {
  const chartData: FunnelData[] = [
    { stage: 'Новые', count: data.new },
    { stage: 'Контакт', count: data.contacted },
    { stage: 'Интервью', count: data.interview },
    { stage: 'Оффер', count: data.offer },
    { stage: 'Наняты', count: data.hired },
  ];

  const colors = ['#3b82f6', '#8b5cf6', '#eab308', '#6366f1', '#22c55e'];

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          layout="vertical"
          margin={{ top: 5, right: 30, left: 60, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" />
          <YAxis dataKey="stage" type="category" width={80} />
          <Tooltip 
            formatter={(value: number) => [`${value} канд.`, 'Количество']}
          />
          <Bar dataKey="count" radius={[0, 4, 4, 0]}>
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
