// User roles
export enum UserRole {
  EMPLOYEE = 'employee',
  COMPANY_ADMIN = 'company_admin',
  PLATFORM_ADMIN = 'platform_admin',
}

// User type
export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  companyId?: string;
  companyCode?: string;
  planId?: string;
  status: 'active' | 'inactive' | 'invited';
  createdAt: string;
}

// Plan tiers
export enum PlanTier {
  BRONZE = 'bronze',
  SILVER = 'silver',
  GOLD = 'gold',
  CLUB_PLUS = 'club_plus',
  DIGITAL = 'digital',
}

// Plan type
export interface Plan {
  id: string;
  tier: PlanTier;
  name: string;
  monthlyPrice: number;
  checkInsPerMonth: number;
  includedCategories: string[];
  notes?: string;
  description: string;
}

// Partner types
export enum PartnerType {
  GYM = 'gym',
  SPA = 'spa',
  CLUB = 'club',
  DIGITAL = 'digital',
}

// Partner status
export enum PartnerStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  SUSPENDED = 'suspended',
}

// Partner type
export interface Partner {
  id: string;
  name: string;
  type: PartnerType;
  city: string;
  address: string;
  latitude: number;
  longitude: number;
  rating: number;
  openHours?: string;
  imageUrl?: string;
  status: PartnerStatus;
  createdAt: string;
}

// Company type
export interface Company {
  id: string;
  name: string;
  code: string;
  adminEmail: string;
  billingDetails?: string;
  status: 'active' | 'inactive';
  createdAt: string;
}

// Employee type
export interface Employee {
  id: string;
  name: string;
  email: string;
  companyId: string;
  planId?: string;
  status: 'active' | 'inactive' | 'invited';
  lastCheckIn?: string;
  totalCheckIns: number;
  createdAt: string;
}

// Check-in type
export interface CheckIn {
  id: string;
  userId: string;
  partnerId: string;
  partnerName: string;
  timestamp: string;
  qrToken: string;
}

// QR Token type
export interface QRToken {
  token: string;
  userId: string;
  expiresAt: string;
  createdAt: string;
}

// Invoice type
export interface Invoice {
  id: string;
  companyId: string;
  invoiceNumber: string;
  date: string;
  amount: number;
  status: 'paid' | 'pending' | 'overdue';
  pdfUrl?: string;
}

// Analytics type
export interface Analytics {
  totalCheckIns: number;
  activeUsers: number;
  activeCompanies: number;
  checkInsOverTime: {
    date: string;
    count: number;
  }[];
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

// Auth types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  companyCode?: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponse {
  user: User;
  tokens: AuthTokens;
}
