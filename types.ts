
export enum ModelCategory {
  NLP = 'Natural Language Processing',
  CV = 'Computer Vision',
  AUDIO = 'Audio Processing',
  RL = 'Reinforcement Learning',
  MULTIMODAL = 'Multimodal',
}

export enum ModelArchitecture {
  TRANSFORMER = 'Transformer',
  LLAMA = 'LLaMA',
  FALCON = 'Falcon',
  CNN = 'Convolutional Neural Network',
  RNN = 'Recurrent Neural Network',
  GAN = 'Generative Adversarial Network',
}

export enum LicenseType {
  MIT = 'MIT',
  APACHE2 = 'Apache 2.0',
  GPL3 = 'GPL 3.0',
  OPENRAIL = 'OpenRAIL',
  PROPRIETARY = 'Proprietary',
  COMMERCIAL = 'Commercial Use Allowed',
}

export interface PerformanceBenchmark {
  metric: string;
  value: string;
}

export interface PricingTier {
  name: string;
  price: string; // e.g., "$0.002 / 1k tokens", "Free", "$49/month"
  features: string[];
}

export interface VersionInfo {
  version: string;
  date: string;
  changelog: string;
}

export interface CodeSnippet {
  language: 'javascript' | 'python' | 'curl';
  label: string;
  code: string;
}

export interface Model {
  id: string;
  name: string;
  creator: string;
  creatorUrl?: string;
  description: string;
  longDescription?: string;
  category: ModelCategory;
  architecture?: ModelArchitecture;
  license: LicenseType;
  benchmarks: PerformanceBenchmark[];
  costIndicator: string; // e.g., "$0.002/1k tokens", "Free", "Usage-based"
  tags: string[];
  averageRating: number;
  totalReviews: number;
  imageUrl?: string;
  playgroundEnabled?: boolean;
  codeSnippets?: CodeSnippet[];
  versions?: VersionInfo[];
  pricingTiers?: PricingTier[];
  fineTuneOptions?: string[];
  modelFileUrl?: string; // For download/upload simulation
  githubUrl?: string;
}

export interface User {
  id: string;
  username: string;
  email?: string; // Optional for simplicity
  accountType: 'consumer' | 'creator' | 'guest';
  avatarUrl?: string;
}

export interface Review {
  id:string;
  modelId: string;
  userId: string;
  username: string;
  avatarUrl?: string;
  rating: number;
  comment: string;
  date: string;
}

export interface ApiKey {
  id: string;
  key: string;
  createdAt: string;
  lastUsed?: string;
  scopes: string[];
}

export interface UsageStat {
  date: string;
  requests: number;
  cost?: number;
}

export type Theme = 'light' | 'dark';

export interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

export interface AuthContextType {
  currentUser: User | null;
  login: (userType: 'consumer' | 'creator') => void;
  logout: () => void;
  isLoading: boolean;
}

export interface FilterOptions {
  category?: ModelCategory;
  license?: LicenseType;
  architecture?: ModelArchitecture;
  pricing?: 'free' | 'paid' | 'open-source';
}
