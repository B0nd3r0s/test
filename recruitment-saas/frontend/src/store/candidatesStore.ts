import { create } from 'zustand';
import { Candidate } from '@/types';
import { candidatesApi } from '@/services/api';

interface CandidatesState {
  candidates: Candidate[];
  selectedCandidate: Candidate | null;
  isLoading: boolean;
  error: string | null;
  fetchCandidates: (params?: { vacancyId?: string; status?: string }) => Promise<void>;
  fetchCandidate: (id: string) => Promise<void>;
  updateCandidateStatus: (id: string, status: string) => Promise<void>;
  scoreCandidate: (id: string) => Promise<void>;
  setSelectedCandidate: (candidate: Candidate | null) => void;
  clearError: () => void;
}

export const useCandidatesStore = create<CandidatesState>((set, get) => ({
  candidates: [],
  selectedCandidate: null,
  isLoading: false,
  error: null,

  fetchCandidates: async (params) => {
    set({ isLoading: true, error: null });
    try {
      const response = await candidatesApi.getAll(params);
      set({ candidates: response.data, isLoading: false });
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Ошибка загрузки кандидатов', 
        isLoading: false 
      });
    }
  },

  fetchCandidate: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await candidatesApi.getById(id);
      set({ selectedCandidate: response.data, isLoading: false });
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Ошибка загрузки кандидата', 
        isLoading: false 
      });
    }
  },

  updateCandidateStatus: async (id: string, status: string) => {
    try {
      await candidatesApi.updateStatus(id, status);
      const updatedCandidates = get().candidates.map((c) =>
        c.id === id ? { ...c, status } : c
      );
      set({ 
        candidates: updatedCandidates,
        selectedCandidate: get().selectedCandidate?.id === id 
          ? { ...get().selectedCandidate, status } 
          : get().selectedCandidate,
      });
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Ошибка обновления статуса' });
      throw error;
    }
  },

  scoreCandidate: async (id: string) => {
    try {
      const response = await candidatesApi.score(id);
      const { score, explanation } = response.data;
      const updatedCandidates = get().candidates.map((c) =>
        c.id === id ? { ...c, score, scoreExplanation: explanation } : c
      );
      set({ 
        candidates: updatedCandidates,
        selectedCandidate: get().selectedCandidate?.id === id 
          ? { ...get().selectedCandidate, score, scoreExplanation: explanation } 
          : get().selectedCandidate,
      });
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Ошибка скоринга' });
      throw error;
    }
  },

  setSelectedCandidate: (candidate: Candidate | null) => {
    set({ selectedCandidate: candidate });
  },

  clearError: () => set({ error: null }),
}));
