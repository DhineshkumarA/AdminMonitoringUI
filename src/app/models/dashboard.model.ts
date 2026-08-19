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
  designersOnline?: number;
  spoolQueueStatus?: string;
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

export interface CategoryTemplate {
  id: string;
  name: string;
  paperSize: string;
  orientation: string;
  version?: number;
  width?: number;
  height?: number;
  stable?: number;
  lockTemplate?: number;
  dateStamp?: string;
  printJobs: number;
  author: string;
}

export interface TemplateLabel {
  id: number;
  labelId: string;
  product: string;
  hostName: string;
  status?: number;
  remarks: string;
  priority?: number;
  dateStamp?: string;
  userId: string;
  userName: string;
  userEmail: string;
  companyName: string;
  companyEmail: string;
}
