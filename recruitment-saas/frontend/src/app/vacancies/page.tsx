'use client';

import React, { useEffect, useState } from 'react';
import { Layout } from '@/components';
import { useAuth } from '@/hooks';
import { vacanciesApi } from '@/services/api';
import { Vacancy } from '@/types';
import { formatDate } from '@/utils';

export default function VacanciesPage() {
  const { user } = useAuth();
  const [vacancies, setVacancies] = useState<Vacancy[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    requirements: '',
    salary: '',
  });

  useEffect(() => {
    loadVacancies();
  }, []);

  const loadVacancies = async () => {
    try {
      const response = await vacanciesApi.getAll();
      setVacancies(response.data);
    } catch (error) {
      console.error('Ошибка загрузки вакансий:', error);
      // Mock data for demo
      setVacancies([
        {
          id: '1',
          title: 'Frontend разработчик',
          description: 'Разработка веб-интерфейсов на React',
          requirements: ['React', 'TypeScript', 'CSS'],
          salary: 200000,
          status: 'active',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: '2',
          title: 'Backend разработчик',
          description: 'Разработка API и микросервисов',
          requirements: ['Node.js', 'PostgreSQL', 'Docker'],
          salary: 250000,
          status: 'active',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await vacanciesApi.create({
        ...formData,
        requirements: formData.requirements.split(',').map(r => r.trim()),
        salary: Number(formData.salary),
      });
      setShowForm(false);
      setFormData({ title: '', description: '', requirements: '', salary: '' });
      loadVacancies();
    } catch (error) {
      alert('Ошибка при создании вакансии');
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
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Вакансии</h1>
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            {showForm ? 'Отмена' : '+ Новая вакансия'}
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Название</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                className="mt-1 block w-full border rounded-lg px-3 py-2"
                placeholder="Например: Frontend разработчик"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Описание</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
                rows={3}
                className="mt-1 block w-full border rounded-lg px-3 py-2"
                placeholder="Описание вакансии..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Требования (через запятую)</label>
              <input
                type="text"
                value={formData.requirements}
                onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                required
                className="mt-1 block w-full border rounded-lg px-3 py-2"
                placeholder="React, TypeScript, CSS"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Зарплата</label>
              <input
                type="number"
                value={formData.salary}
                onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                className="mt-1 block w-full border rounded-lg px-3 py-2"
                placeholder="200000"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Создать вакансию
            </button>
          </form>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vacancies.map((vacancy) => (
            <div key={vacancy.id} className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-start justify-between mb-4">
                <h3 className="font-semibold text-gray-900">{vacancy.title}</h3>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  vacancy.status === 'active' ? 'bg-green-100 text-green-800' :
                  vacancy.status === 'closed' ? 'bg-red-100 text-red-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {vacancy.status === 'active' ? 'Активна' : vacancy.status === 'closed' ? 'Закрыта' : 'Черновик'}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-4 line-clamp-2">{vacancy.description}</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {vacancy.requirements.slice(0, 3).map((req, i) => (
                  <span key={i} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                    {req}
                  </span>
                ))}
              </div>
              {vacancy.salary && (
                <div className="text-lg font-semibold text-gray-900">
                  от {vacancy.salary.toLocaleString('ru-RU')} ₽
                </div>
              )}
              <div className="mt-4 pt-4 border-t text-xs text-gray-400">
                Создана: {formatDate(vacancy.createdAt)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
