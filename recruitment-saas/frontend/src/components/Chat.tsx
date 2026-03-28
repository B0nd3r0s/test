'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Message } from '@/types';
import { messagesApi } from '@/services/api';
import { formatDateTime } from '@/utils';
import { cn } from '@/utils';

interface ChatProps {
  candidateId: string;
  candidateName: string;
}

export default function Chat({ candidateId, candidateName }: ChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedChannel, setSelectedChannel] = useState<'hh' | 'telegram' | 'whatsapp'>('hh');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const fetchMessages = async () => {
    try {
      const response = await messagesApi.getByCandidate(candidateId);
      setMessages(response.data);
    } catch (error) {
      console.error('Ошибка загрузки сообщений:', error);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [candidateId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    setIsLoading(true);
    try {
      const response = await messagesApi.send(candidateId, newMessage.trim(), selectedChannel);
      setMessages([...messages, response.data]);
      setNewMessage('');
    } catch (error) {
      console.error('Ошибка отправки сообщения:', error);
      alert('Не удалось отправить сообщение');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-lg border">
      {/* Header */}
      <div className="p-4 border-b">
        <h3 className="font-semibold text-gray-900">{candidateName}</h3>
        <div className="flex items-center space-x-2 mt-2">
          <span className="text-sm text-gray-500">Канал:</span>
          <select
            value={selectedChannel}
            onChange={(e) => setSelectedChannel(e.target.value as 'hh' | 'telegram' | 'whatsapp')}
            className="text-sm border rounded px-2 py-1"
          >
            <option value="hh">hh.ru</option>
            <option value="telegram">Telegram</option>
            <option value="whatsapp">WhatsApp</option>
          </select>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center text-gray-400 py-8">
            Нет сообщений. Начните диалог с кандидатом.
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                'flex',
                message.sender === 'user' ? 'justify-end' : 'justify-start'
              )}
            >
              <div
                className={cn(
                  'max-w-xs lg:max-w-md px-4 py-2 rounded-lg',
                  message.sender === 'user'
                    ? 'bg-blue-600 text-white'
                    : message.sender === 'system'
                    ? 'bg-gray-100 text-gray-600'
                    : 'bg-gray-200 text-gray-900'
                )}
              >
                <p className="text-sm">{message.content}</p>
                <div className="flex items-center justify-between mt-1 space-x-2">
                  <span className="text-xs opacity-75">
                    {message.channel === 'hh' ? 'hh.ru' : message.channel === 'telegram' ? 'Telegram' : 'WhatsApp'}
                  </span>
                  <span className="text-xs opacity-75">
                    {formatDateTime(message.createdAt)}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="p-4 border-t">
        <div className="flex space-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Введите сообщение..."
            className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !newMessage.trim()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? '...' : 'Отправить'}
          </button>
        </div>
      </form>
    </div>
  );
}
