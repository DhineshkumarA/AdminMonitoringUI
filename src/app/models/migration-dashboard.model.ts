export interface MigrationStatusDistribution {
  status: string;
  count: number;
  percentage: number;
}

export interface MigrationCompanyActivity {
  companyId: string;
  companyName: string;
  migrationCount: number;
  totalRecords: number;
  successCount: number;
  errorCount: number;
}

export interface MigrationWeeklyThroughput {
  day: string;
  totalRecords: number;
  successRecords: number;
  errorRecords: number;
}

export interface MigrationJobSummary {
  id: string;
  name: string;
  status: string;
  lastRunTime?: string;
  retryCount: number;
  lastError?: string;
  priority: number;
  companyId: string;
  jsonConfig?: string;
  totalRuns: number;
  totalRecords: number;
  successCount: number;
  errorCount: number;
  warningCount: number;
  lastDurationSeconds?: number;
}

export interface MigrationHistoryItem {
  id: number;
  migrationId: string;
  migrationName: string;
  startTime?: string;
  endTime?: string;
  durationSeconds?: number;
  totalRecords: number;
  successCount: number;
  errorCount: number;
  warningCount: number;
  status: string;
  companyId: string;
  logFileName?: string;
}

export interface MigrationScheduleItem {
  id: string;
  name: string;
  json: string;
  companyId: string;
  dateStamp?: string;
}

export interface MigrationDashboardData {
  totalMigrations: number;
  activePipelines: number;
  totalRecordsProcessed: number;
  totalSuccessRecords: number;
  totalErrorRecords: number;
  totalWarningRecords: number;
  successRate: number;
  failedMigrations: number;
  totalSchedules: number;
  queueStatus: string;
  statusDistribution: MigrationStatusDistribution[];
  companyActivity: MigrationCompanyActivity[];
  weeklyThroughput: MigrationWeeklyThroughput[];
  migrations: MigrationJobSummary[];
  recentHistories: MigrationHistoryItem[];
}
