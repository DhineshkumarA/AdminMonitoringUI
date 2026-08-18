export interface HourlyActivity {
  hour: string;
  count: number;
}

export interface UsageEvent {
  time: string;
  action: string;
  eventDetails: string;
}

export interface UserActivity {
  id: string;
  name: string;
  percentage: number;
  templates: number;
  printJobs: number;
  client: string;
  hourlyActivity?: HourlyActivity[];
  usageEvents?: UsageEvent[];
}

export interface CompanyActivity {
  companyId: string;
  companyName: string;
  userCount: number;
  printJobs: number;
}

export interface TemplatesByCategory {
  category: string;
  count: number;
}

export interface WeeklyPrintActivity {
  day: string;
  printJobs: number;
}

export interface DashboardData {
  totalUsers: number;
  totalTemplates: number;
  printJobs: number;
  totalCategories: number;
  totalCompanies: number;
  companyActivity: CompanyActivity[];
  userActivity: UserActivity[];
  templatesByCategory: TemplatesByCategory[];
  weeklyPrintActivity: WeeklyPrintActivity[];
}

export interface CompanyUser {
  id: string;
  name: string;
  templates: number;
  printJobs: number;
  client: string;
}
