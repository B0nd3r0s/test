'use client';

import React from 'react';
import { Candidate } from '@/types';
import { cn, getScoreColor, getStatusColor, getStatusLabel, getSourceLabel, formatRelativeTime } from '@/utils';

interface CandidateCardProps {
  candidate: Candidate;
  isSelected?: boolean;
  onClick?: () => void;
}

export default function CandidateCard({ candidate, isSelected = false, onClick }: CandidateCardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        'p-4 bg-white rounded-lg border cursor-pointer transition-all hover:shadow-md',
        isSelected ? 'border-blue-500 shadow-md ring-2 ring-blue-200' : 'border-gray-200'
      )}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900">
            {candidate.firstName} {candidate.lastName}
          </h3>
          <p className="text-sm text-gray-500">{getSourceLabel(candidate.source)}</p>
        </div>
        {candidate.score !== undefined && (
          <span className={cn('px-2 py-1 rounded-full text-xs font-medium', getScoreColor(candidate.score))}>
            {candidate.score}%
          </span>
        )}
      </div>

      <div className="flex items-center justify-between mb-3">
        <span className={cn('px-2 py-1 rounded-full text-xs font-medium', getStatusColor(candidate.status))}>
          {getStatusLabel(candidate.status)}
        </span>
        <span className="text-xs text-gray-400">
          {formatRelativeTime(candidate.createdAt)}
        </span>
      </div>

      {(candidate.email || candidate.phone) && (
        <div className="text-sm text-gray-600 space-y-1">
          {candidate.email && <p>✉️ {candidate.email}</p>}
          {candidate.phone && <p>📱 {candidate.phone}</p>}
        </div>
      )}

      {candidate.lastContactAt && (
        <div className="mt-3 pt-3 border-t text-xs text-gray-400">
          Последний контакт: {formatRelativeTime(candidate.lastContactAt)}
        </div>
      )}
    </div>
  );
}
