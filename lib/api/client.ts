import {
  ApiResponse,
  AuthResponse,
  LoginCredentials,
  RegisterData,
  User,
  Plan,
  Partner,
  Company,
  Employee,
  CheckIn,
  QRToken,
  Invoice,
  Analytics,
  PartnerStatus,
} from '../types';
import {
  mockUsers,
  mockPlans,
  mockPartners,
  mockCompanies,
  mockEmployees,
  mockCheckIns,
  mockInvoices,
  mockAnalytics,
  TEST_PASSWORD,
} from './mockData';
import { generateId } from '../utils';

const ENABLE_MOCK = process.env.NEXT_PUBLIC_ENABLE_MOCK === 'true';
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '';

// Token storage
let accessToken: string | null = null;
let refreshToken: string | null = null;
let currentUser: User | null = null;

export const setAuthTokens = (access: string, refresh: string) => {
  accessToken = access;
  refreshToken = refresh;
  if (typeof window !== 'undefined') {
    localStorage.setItem('accessToken', access);
    localStorage.setItem('refreshToken', refresh);
  }
};

export const getAuthTokens = () => {
  if (!accessToken && typeof window !== 'undefined') {
    accessToken = localStorage.getItem('accessToken');
    refreshToken = localStorage.getItem('refreshToken');
  }
  return { accessToken, refreshToken };
};

export const clearAuthTokens = () => {
  accessToken = null;
  refreshToken = null;
  currentUser = null;
  if (typeof window !== 'undefined') {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('currentUser');
  }
};

export const setCurrentUser = (user: User) => {
  currentUser = user;
  if (typeof window !== 'undefined') {
    localStorage.setItem('currentUser', JSON.stringify(user));
  }
};

export const getCurrentUser = (): User | null => {
  if (!currentUser && typeof window !== 'undefined') {
    const stored = localStorage.getItem('currentUser');
    if (stored) {
      currentUser = JSON.parse(stored);
    }
  }
  return currentUser;
};

// Simulate API delay
const delay = (ms: number = 500) => new Promise((resolve) => setTimeout(resolve, ms));

// Mock API implementation
class MockAPI {
  // Auth
  async login(credentials: LoginCredentials): Promise<ApiResponse<AuthResponse>> {
    await delay();
    const user = mockUsers.find((u) => u.email === credentials.email);
    
    if (!user || credentials.password !== TEST_PASSWORD) {
      return {
        success: false,
        error: 'Invalid credentials',
      };
    }

    const tokens = {
      accessToken: `mock-access-${user.id}-${Date.now()}`,
      refreshToken: `mock-refresh-${user.id}-${Date.now()}`,
    };

    setAuthTokens(tokens.accessToken, tokens.refreshToken);
    setCurrentUser(user);

    return {
      success: true,
      data: { user, tokens },
    };
  }

  async register(data: RegisterData): Promise<ApiResponse<AuthResponse>> {
    await delay();
    
    if (mockUsers.find((u) => u.email === data.email)) {
      return {
        success: false,
        error: 'Email already exists',
      };
    }

    const company = data.companyCode 
      ? mockCompanies.find((c) => c.code === data.companyCode)
      : undefined;

    const user: User = {
      id: generateId(),
      email: data.email,
      name: data.name,
      role: 'employee' as any,
      companyId: company?.id,
      companyCode: data.companyCode,
      status: 'active',
      createdAt: new Date().toISOString(),
    };

    mockUsers.push(user);

    const tokens = {
      accessToken: `mock-access-${user.id}-${Date.now()}`,
      refreshToken: `mock-refresh-${user.id}-${Date.now()}`,
    };

    setAuthTokens(tokens.accessToken, tokens.refreshToken);
    setCurrentUser(user);

    return {
      success: true,
      data: { user, tokens },
    };
  }

  async getMe(): Promise<ApiResponse<User>> {
    await delay(200);
    const user = getCurrentUser();
    
    if (!user) {
      return {
        success: false,
        error: 'Not authenticated',
      };
    }

    return {
      success: true,
      data: user,
    };
  }

  async logout(): Promise<ApiResponse> {
    await delay(200);
    clearAuthTokens();
    return {
      success: true,
      message: 'Logged out successfully',
    };
  }

  async forgotPassword(email: string): Promise<ApiResponse> {
    await delay();
    return {
      success: true,
      message: 'Password reset email sent',
    };
  }

  async resetPassword(token: string, password: string): Promise<ApiResponse> {
    await delay();
    return {
      success: true,
      message: 'Password reset successfully',
    };
  }

  // Partners
  async getPartners(filters?: { city?: string; type?: string }): Promise<ApiResponse<Partner[]>> {
    await delay(300);
    let partners = [...mockPartners].filter(p => p.status === PartnerStatus.APPROVED);

    if (filters?.city && filters.city !== 'all') {
      partners = partners.filter((p) => p.city === filters.city);
    }

    if (filters?.type && filters.type !== 'all') {
      partners = partners.filter((p) => p.type === filters.type);
    }

    return {
      success: true,
      data: partners,
    };
  }

  async getPartner(id: string): Promise<ApiResponse<Partner>> {
    await delay(200);
    const partner = mockPartners.find((p) => p.id === id);

    if (!partner) {
      return {
        success: false,
        error: 'Partner not found',
      };
    }

    return {
      success: true,
      data: partner,
    };
  }

  // Plans
  async getPlans(): Promise<ApiResponse<Plan[]>> {
    await delay(200);
    return {
      success: true,
      data: mockPlans,
    };
  }

  async getPlan(id: string): Promise<ApiResponse<Plan>> {
    await delay(200);
    const plan = mockPlans.find((p) => p.id === id);

    if (!plan) {
      return {
        success: false,
        error: 'Plan not found',
      };
    }

    return {
      success: true,
      data: plan,
    };
  }

  // Check-ins
  async getMyCheckIns(): Promise<ApiResponse<CheckIn[]>> {
    await delay(300);
    const user = getCurrentUser();
    
    if (!user) {
      return {
        success: false,
        error: 'Not authenticated',
      };
    }

    const checkIns = mockCheckIns.filter((c) => c.userId === user.id);

    return {
      success: true,
      data: checkIns,
    };
  }

  async generateQRToken(): Promise<ApiResponse<QRToken>> {
    await delay(200);
    const user = getCurrentUser();
    
    if (!user) {
      return {
        success: false,
        error: 'Not authenticated',
      };
    }

    const token: QRToken = {
      token: `QR-${generateId()}`,
      userId: user.id,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 5 * 60 * 1000).toISOString(), // 5 minutes
    };

    return {
      success: true,
      data: token,
    };
  }

  // Company/HR endpoints
  async getCompanyEmployees(): Promise<ApiResponse<Employee[]>> {
    await delay(300);
    const user = getCurrentUser();
    
    if (!user || !user.companyId) {
      return {
        success: false,
        error: 'Not authorized',
      };
    }

    const employees = mockEmployees.filter((e) => e.companyId === user.companyId);

    return {
      success: true,
      data: employees,
    };
  }

  async inviteEmployee(data: { name: string; email: string }): Promise<ApiResponse<Employee>> {
    await delay();
    const user = getCurrentUser();
    
    if (!user || !user.companyId) {
      return {
        success: false,
        error: 'Not authorized',
      };
    }

    const employee: Employee = {
      id: generateId(),
      name: data.name,
      email: data.email,
      companyId: user.companyId,
      status: 'invited',
      totalCheckIns: 0,
      createdAt: new Date().toISOString(),
    };

    mockEmployees.push(employee);

    return {
      success: true,
      data: employee,
    };
  }

  async assignPlan(employeeId: string, planId: string): Promise<ApiResponse> {
    await delay();
    const employee = mockEmployees.find((e) => e.id === employeeId);

    if (!employee) {
      return {
        success: false,
        error: 'Employee not found',
      };
    }

    employee.planId = planId;
    employee.status = 'active';

    return {
      success: true,
      message: 'Plan assigned successfully',
    };
  }

  async deactivateEmployee(employeeId: string): Promise<ApiResponse> {
    await delay();
    const employee = mockEmployees.find((e) => e.id === employeeId);

    if (!employee) {
      return {
        success: false,
        error: 'Employee not found',
      };
    }

    employee.status = 'inactive';

    return {
      success: true,
      message: 'Employee deactivated',
    };
  }

  async getCompanyUsage(dateRange?: string): Promise<ApiResponse<any>> {
    await delay(300);
    const user = getCurrentUser();
    
    if (!user || !user.companyId) {
      return {
        success: false,
        error: 'Not authorized',
      };
    }

    const employees = mockEmployees.filter((e) => e.companyId === user.companyId);

    return {
      success: true,
      data: employees.map((e) => ({
        employeeId: e.id,
        employeeName: e.name,
        checkIns: e.totalCheckIns,
        lastCheckIn: e.lastCheckIn || null,
        plan: mockPlans.find((p) => p.id === e.planId)?.name || 'No Plan',
      })),
    };
  }

  async getCompanyInvoices(): Promise<ApiResponse<Invoice[]>> {
    await delay(300);
    const user = getCurrentUser();
    
    if (!user || !user.companyId) {
      return {
        success: false,
        error: 'Not authorized',
      };
    }

    const invoices = mockInvoices.filter((i) => i.companyId === user.companyId);

    return {
      success: true,
      data: invoices,
    };
  }

  // Admin endpoints
  async getAllPartners(): Promise<ApiResponse<Partner[]>> {
    await delay(300);
    return {
      success: true,
      data: mockPartners,
    };
  }

  async createPartner(data: Partial<Partner>): Promise<ApiResponse<Partner>> {
    await delay();
    const partner: Partner = {
      id: generateId(),
      name: data.name!,
      type: data.type!,
      city: data.city!,
      address: data.address!,
      latitude: data.latitude!,
      longitude: data.longitude!,
      rating: 0,
      status: PartnerStatus.PENDING,
      createdAt: new Date().toISOString(),
    };

    mockPartners.push(partner);

    return {
      success: true,
      data: partner,
    };
  }

  async updatePartnerStatus(id: string, status: PartnerStatus): Promise<ApiResponse> {
    await delay();
    const partner = mockPartners.find((p) => p.id === id);

    if (!partner) {
      return {
        success: false,
        error: 'Partner not found',
      };
    }

    partner.status = status;

    return {
      success: true,
      message: 'Partner status updated',
    };
  }

  async getAllPlans(): Promise<ApiResponse<Plan[]>> {
    await delay(200);
    return {
      success: true,
      data: mockPlans,
    };
  }

  async createPlan(data: Partial<Plan>): Promise<ApiResponse<Plan>> {
    await delay();
    const plan: Plan = {
      id: generateId(),
      tier: data.tier!,
      name: data.name!,
      monthlyPrice: data.monthlyPrice!,
      checkInsPerMonth: data.checkInsPerMonth!,
      includedCategories: data.includedCategories || [],
      notes: data.notes,
      description: data.description || '',
    };

    mockPlans.push(plan);

    return {
      success: true,
      data: plan,
    };
  }

  async updatePlan(id: string, data: Partial<Plan>): Promise<ApiResponse<Plan>> {
    await delay();
    const planIndex = mockPlans.findIndex((p) => p.id === id);

    if (planIndex === -1) {
      return {
        success: false,
        error: 'Plan not found',
      };
    }

    mockPlans[planIndex] = { ...mockPlans[planIndex], ...data };

    return {
      success: true,
      data: mockPlans[planIndex],
    };
  }

  async deletePlan(id: string): Promise<ApiResponse> {
    await delay();
    const planIndex = mockPlans.findIndex((p) => p.id === id);

    if (planIndex === -1) {
      return {
        success: false,
        error: 'Plan not found',
      };
    }

    mockPlans.splice(planIndex, 1);

    return {
      success: true,
      message: 'Plan deleted',
    };
  }

  async getAllCompanies(): Promise<ApiResponse<Company[]>> {
    await delay(300);
    return {
      success: true,
      data: mockCompanies,
    };
  }

  async createCompany(data: Partial<Company>): Promise<ApiResponse<Company>> {
    await delay();
    const company: Company = {
      id: generateId(),
      name: data.name!,
      code: data.code!,
      adminEmail: data.adminEmail!,
      billingDetails: data.billingDetails,
      status: 'active',
      createdAt: new Date().toISOString(),
    };

    mockCompanies.push(company);

    return {
      success: true,
      data: company,
    };
  }

  async getAnalytics(): Promise<ApiResponse<Analytics>> {
    await delay(300);
    return {
      success: true,
      data: mockAnalytics,
    };
  }
}

// Real API implementation (placeholder)
class RealAPI {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const { accessToken } = getAuthTokens();

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...((options.headers as Record<string, string>) || {}),
    };

    if (accessToken) {
      headers['Authorization'] = `Bearer ${accessToken}`;
    }

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.error || 'Request failed',
        };
      }

      return {
        success: true,
        data: data.data || data,
      };
    } catch (error) {
      return {
        success: false,
        error: 'Network error',
      };
    }
  }

  // Implement all methods using this.request()
  async login(credentials: LoginCredentials): Promise<ApiResponse<AuthResponse>> {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  // ... implement other methods
}

// Export the appropriate API instance
const api = ENABLE_MOCK ? new MockAPI() : new RealAPI();

export default api;
export { getCurrentUser as getUser, clearAuthTokens as logout };
