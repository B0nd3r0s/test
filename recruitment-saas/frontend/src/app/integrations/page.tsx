'use client';

import React, { useEffect, useState } from 'react';
import { Layout } from '@/components';
import { useAuth } from '@/hooks';
import { integrationsApi } from '@/services/api';
import { Integration } from '@/types';

export default function IntegrationsPage() {
  const { user } = useAuth();
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadIntegrations();
  }, []);

  const loadIntegrations = async () => {
    try {
      const response = await integrationsApi.getAll();
      setIntegrations(response.data);
    } catch (error) {
      console.error('Ошибка загрузки интеграций:', error);
      // Mock data for demo
      setIntegrations([
        {
          id: '1',
          type: 'hh',
          name: 'hh.ru',
          isActive: false,
          config: {},
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: '2',
          type: 'telegram',
          name: 'Telegram Bot',
          isActive: false,
          config: {},
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: '3',
          type: 'whatsapp',
          name: 'WhatsApp API',
          isActive: false,
          config: {},
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConnectHH = () => {
    // Redirect to hh.ru OAuth
    window.open('https://hh.ru/oauth/authorize?response_type=code&client_id=YOUR_CLIENT_ID&redirect_uri=http://localhost:3000/integrations/hh/callback', '_blank');
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
        <h1 className="text-2xl font-bold text-gray-900">Интеграции</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* HH.ru */}
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center text-red-600 font-bold">
                hh
              </div>
              <div className="ml-4">
                <h3 className="font-semibold text-gray-900">hh.ru</h3>
                <p className="text-sm text-gray-500">Получение откликов и резюме</p>
              </div>
            </div>
            <div className="mb-4">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                integrations.find(i => i.type === 'hh')?.isActive 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {integrations.find(i => i.type === 'hh')?.isActive ? 'Подключено' : 'Не подключено'}
              </span>
            </div>
            <button
              onClick={handleConnectHH}
              className="w-full py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Подключить hh.ru
            </button>
          </div>

          {/* Telegram */}
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 font-bold">
                TG
              </div>
              <div className="ml-4">
                <h3 className="font-semibold text-gray-900">Telegram Bot</h3>
                <p className="text-sm text-gray-500">Коммуникация с кандидатами</p>
              </div>
            </div>
            <div className="mb-4">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                integrations.find(i => i.type === 'telegram')?.isActive 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {integrations.find(i => i.type === 'telegram')?.isActive ? 'Подключено' : 'Не подключено'}
              </span>
            </div>
            <button
              disabled
              className="w-full py-2 bg-gray-300 text-gray-500 rounded-lg cursor-not-allowed"
            >
              Настройка (скоро)
            </button>
          </div>

          {/* WhatsApp */}
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center text-green-600 font-bold">
                WA
              </div>
              <div className="ml-4">
                <h3 className="font-semibold text-gray-900">WhatsApp API</h3>
                <p className="text-sm text-gray-500">Коммуникация с кандидатами</p>
              </div>
            </div>
            <div className="mb-4">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                integrations.find(i => i.type === 'whatsapp')?.isActive 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {integrations.find(i => i.type === 'whatsapp')?.isActive ? 'Подключено' : 'Не подключено'}
              </span>
            </div>
            <button
              disabled
              className="w-full py-2 bg-gray-300 text-gray-500 rounded-lg cursor-not-allowed"
            >
              Настройка (скоро)
            </button>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Инструкция по подключению</h2>
          <div className="space-y-4 text-sm text-gray-600">
            <div>
              <h3 className="font-medium text-gray-900">hh.ru</h3>
              <ol className="list-decimal list-inside mt-2 space-y-1">
                <li>Зарегистрируйте приложение в кабинете работодателя hh.ru</li>
                <li>Получите Client ID и Client Secret</li>
                <li>Нажмите кнопку "Подключить hh.ru"</li>
                <li>Авторизуйтесь и предоставьте доступ к API</li>
              </ol>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Telegram</h3>
              <ol className="list-decimal list-inside mt-2 space-y-1">
                <li>Создайте бота через @BotFather</li>
                <li>Получите токен бота</li>
                <li>Добавьте токен в настройки интеграции</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
