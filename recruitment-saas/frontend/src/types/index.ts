export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'recruiter';
  createdAt: string;
}

export interface Vacancy {
  id: string;
  title: string;
  description: string;
  requirements: string[];
  salary?: number;
  status: 'active' | 'closed' | 'draft';
  createdAt: string;
  updatedAt: string;
}

export interface Candidate {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  telegramId?: string;
  whatsappId?: string;
  resumeId?: string;
  vacancyId: string;
  source: 'hh' | 'telegram' | 'whatsapp' | 'manual';
  status: 'new' | 'contacted' | 'interview' | 'offer' | 'rejected' | 'hired';
  score?: number;
  scoreExplanation?: string;
  lastContactAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Resume {
  id: string;
  candidateId: string;
  text: string;
  skills: string[];
  experience: string;
  education: string;
  hhResumeId?: string;
  createdAt: string;
}

export interface Message {
  id: string;
  candidateId: string;
  sender: 'user' | 'candidate' | 'system';
  channel: 'hh' | 'telegram' | 'whatsapp';
  content: string;
  isRead: boolean;
  createdAt: string;
}

export interface CommunicationLog {
  id: string;
  candidateId: string;
  type: 'message_sent' | 'message_received' | 'score_updated' | 'status_changed';
  channel?: 'hh' | 'telegram' | 'whatsapp';
  content: string;
  metadata?: Record<string, any>;
  createdAt: string;
}

export interface Integration {
  id: string;
  type: 'hh' | 'telegram' | 'whatsapp';
  name: string;
  isActive: boolean;
  config: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface AnalyticsData {
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

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}
