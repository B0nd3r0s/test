'use client';

import React, { useEffect, useState } from 'react';
import { Layout, FunnelChart } from '@/components';
import { useAuth } from '@/hooks';
import { analyticsApi, candidatesApi } from '@/services/api';
import { useCandidatesStore } from '@/store';

interface DashboardData {
  totalCandidates: number;
  newCandidates: number;
  interviewsToday: number;
  avgScore: number;
  funnel: {
    new: number;
    contacted: number;
    interview: number;
    offer: number;
    hired: number;
    rejected: number;
  };
}

export default function DashboardPage() {
  const { user } = useAuth();
  const { fetchCandidates, candidates } = useCandidatesStore();
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const [analyticsRes, candidatesRes] = await Promise.all([
          analyticsApi.getDashboard(),
          candidatesApi.getAll(),
        ]);

        setData({
          totalCandidates: candidatesRes.data.length,
          newCandidates: candidatesRes.data.filter((c: any) => c.status === 'new').length,
          interviewsToday: 0, // Можно реализовать подсчет на бэкенде
          avgScore: candidatesRes.data.reduce((sum: number, c: any) => sum + (c.score || 0), 0) / candidatesRes.data.length || 0,
          funnel: analyticsRes.data.funnel,
        });
      } catch (error) {
        console.error('Ошибка загрузки дашборда:', error);
        // Mock data for demo
        setData({
          totalCandidates: 24,
          newCandidates: 8,
          interviewsToday: 3,
          avgScore: 72,
          funnel: {
            new: 8,
            contacted: 6,
            interview: 5,
            offer: 3,
            hired: 2,
            rejected: 4,
          },
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboard();
  }, []);

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
        <h1 className="text-2xl font-bold text-gray-900">Дашборд</h1>

        {/* Stats cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-sm text-gray-500">Всего кандидатов</div>
            <div className="text-3xl font-bold text-gray-900">{data?.totalCandidates}</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-sm text-gray-500">Новые отклики</div>
            <div className="text-3xl font-bold text-blue-600">{data?.newCandidates}</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-sm text-gray-500">Интервью сегодня</div>
            <div className="text-3xl font-bold text-purple-600">{data?.interviewsToday}</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-sm text-gray-500">Средний скоринг</div>
            <div className="text-3xl font-bold text-green-600">{Math.round(data?.avgScore || 0)}%</div>
          </div>
        </div>

        {/* Funnel chart */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Воронка подбора</h2>
          {data?.funnel && <FunnelChart data={data.funnel} />}
        </div>

        {/* Recent candidates */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Последние кандидаты</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 px-4 text-sm font-medium text-gray-500">Имя</th>
                  <th className="text-left py-2 px-4 text-sm font-medium text-gray-500">Статус</th>
                  <th className="text-left py-2 px-4 text-sm font-medium text-gray-500">Скоринг</th>
                  <th className="text-left py-2 px-4 text-sm font-medium text-gray-500">Источник</th>
                </tr>
              </thead>
              <tbody>
                {candidates.slice(0, 5).map((candidate) => (
                  <tr key={candidate.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">
                      {candidate.firstName} {candidate.lastName}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        candidate.status === 'new' ? 'bg-blue-100 text-blue-800' :
                        candidate.status === 'contacted' ? 'bg-purple-100 text-purple-800' :
                        candidate.status === 'interview' ? 'bg-yellow-100 text-yellow-800' :
                        candidate.status === 'offer' ? 'bg-indigo-100 text-indigo-800' :
                        candidate.status === 'rejected' ? 'bg-red-100 text-red-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {candidate.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {candidate.score ? (
                        <span className={`font-medium ${
                          candidate.score >= 80 ? 'text-green-600' :
                          candidate.score >= 60 ? 'text-yellow-600' :
                          'text-red-600'
                        }`}>
                          {candidate.score}%
                        </span>
                      ) : '-'}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-500">{candidate.source}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
}
