'use client';

import React, { useEffect, useState } from 'react';
import { Layout, CandidateCard, Chat } from '@/components';
import { useAuth } from '@/hooks';
import { useCandidatesStore } from '@/store';
import { candidatesApi } from '@/services/api';
import { Candidate } from '@/types';

export default function CandidatesPage() {
  const { user } = useAuth();
  const { candidates, fetchCandidates, selectedCandidate, setSelectedCandidate, scoreCandidate, updateCandidateStatus } = useCandidatesStore();
  const [isLoading, setIsLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [showChat, setShowChat] = useState(false);

  useEffect(() => {
    const loadCandidates = async () => {
      try {
        await fetchCandidates();
      } catch (error) {
        console.error('Ошибка загрузки кандидатов:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadCandidates();
  }, [fetchCandidates]);

  const handleScore = async (candidateId: string) => {
    try {
      await scoreCandidate(candidateId);
    } catch (error) {
      alert('Ошибка при скоринге кандидата');
    }
  };

  const handleStatusChange = async (candidateId: string, status: string) => {
    try {
      await updateCandidateStatus(candidateId, status);
    } catch (error) {
      alert('Ошибка при обновлении статуса');
    }
  };

  const filteredCandidates = filterStatus === 'all' 
    ? candidates 
    : candidates.filter(c => c.status === filterStatus);

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
          <h1 className="text-2xl font-bold text-gray-900">Кандидаты</h1>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="border rounded-lg px-4 py-2"
          >
            <option value="all">Все статусы</option>
            <option value="new">Новые</option>
            <option value="contacted">Контакт установлен</option>
            <option value="interview">Интервью</option>
            <option value="offer">Оффер</option>
            <option value="rejected">Отказ</option>
            <option value="hired">Нанят</option>
          </select>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Candidates list */}
          <div className="lg:col-span-2 space-y-4">
            {filteredCandidates.length === 0 ? (
              <div className="bg-white p-8 rounded-lg shadow text-center text-gray-500">
                Нет кандидатов с выбранным фильтром
              </div>
            ) : (
              filteredCandidates.map((candidate) => (
                <div key={candidate.id} className="relative">
                  <CandidateCard
                    candidate={candidate}
                    isSelected={selectedCandidate?.id === candidate.id}
                    onClick={() => {
                      setSelectedCandidate(candidate);
                      setShowChat(false);
                    }}
                  />
                  <div className="absolute top-4 right-4 flex space-x-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleScore(candidate.id);
                      }}
                      className="px-3 py-1 text-xs bg-purple-100 text-purple-700 rounded hover:bg-purple-200"
                    >
                      Скоринг
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowChat(true);
                        setSelectedCandidate(candidate);
                      }}
                      className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                    >
                      Чат
                    </button>
                    <select
                      onClick={(e) => e.stopPropagation()}
                      value={candidate.status}
                      onChange={(e) => handleStatusChange(candidate.id, e.target.value)}
                      className="text-xs border rounded px-2 py-1"
                    >
                      <option value="new">Новый</option>
                      <option value="contacted">Контакт</option>
                      <option value="interview">Интервью</option>
                      <option value="offer">Оффер</option>
                      <option value="rejected">Отказ</option>
                      <option value="hired">Нанят</option>
                    </select>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Chat panel */}
          <div className={`lg:col-span-1 ${showChat ? 'block' : 'hidden lg:block'}`}>
            {selectedCandidate ? (
              <Chat
                candidateId={selectedCandidate.id}
                candidateName={`${selectedCandidate.firstName} ${selectedCandidate.lastName}`}
              />
            ) : (
              <div className="bg-white p-8 rounded-lg shadow text-center text-gray-500">
                Выберите кандидата для просмотра деталей и чата
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
