'use client';

import React, { useEffect, useState } from 'react';
import { Layout, FunnelChart } from '@/components';
import { useAuth } from '@/hooks';
import { analyticsApi } from '@/services/api';

interface AnalyticsData {
  funnel: {
    new: number;
    contacted: number;
    interview: number;
    offer: number;
    hired: number;
    rejected: number;
  };
  avgResponseTime: number;
  rejectionReasons: Array<{ reason: string; count: number }>;
  candidatesBySource: Array<{ source: string; count: number }>;
}

export default function AnalyticsPage() {
  const { user } = useAuth();
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      const response = await analyticsApi.getDashboard();
      setData(response.data);
    } catch (error) {
      console.error('Ошибка загрузки аналитики:', error);
      // Mock data for demo
      setData({
        funnel: {
          new: 15,
          contacted: 10,
          interview: 8,
          offer: 5,
          hired: 3,
          rejected: 7,
        },
        avgResponseTime: 4.5,
        rejectionReasons: [
          { reason: 'Не подошел опыт', count: 3 },
          { reason: 'Отказался от оффера', count: 2 },
          { reason: 'Не прошел собеседование', count: 2 },
        ],
        candidatesBySource: [
          { source: 'hh.ru', count: 18 },
          { source: 'Telegram', count: 5 },
          { source: 'Рефералы', count: 2 },
        ],
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) return null;

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Загрузка...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Аналитика</h1>

        {/* Key metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-sm text-gray-500">Среднее время ответа</div>
            <div className="text-3xl font-bold text-blue-600">{data?.avgResponseTime} ч.</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-sm text-gray-500">Конверсия в интервью</div>
            <div className="text-3xl font-bold text-purple-600">
              {data?.funnel && Math.round((data.funnel.interview / data.funnel.new) * 100)}%
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-sm text-gray-500">Конверсия в найм</div>
            <div className="text-3xl font-bold text-green-600">
              {data?.funnel && Math.round((data.funnel.hired / data.funnel.new) * 100)}%
            </div>
          </div>
        </div>

        {/* Funnel */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Воронка подбора</h2>
          {data?.funnel && <FunnelChart data={data.funnel} />}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Rejection reasons */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Причины отказов</h2>
            <div className="space-y-3">
              {data?.rejectionReasons.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{item.reason}</span>
                  <span className="font-medium text-gray-900">{item.count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Sources */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Источники кандидатов</h2>
            <div className="space-y-3">
              {data?.candidatesBySource.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{item.source}</span>
                  <span className="font-medium text-gray-900">{item.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
