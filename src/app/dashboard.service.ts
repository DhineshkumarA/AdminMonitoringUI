import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  DashboardData,
  CompanyUser,
  CategoryTemplate,
  TemplateLabel
} from './models/dashboard.model';
import {
  MigrationDashboardData,
  MigrationHistoryItem,
  MigrationScheduleItem
} from './models/migration-dashboard.model';

export interface GraphQLDashboardResponse {
  data: {
    dashboard: DashboardData;
  };
}

export interface GraphQLCompanyUsersResponse {
  data: {
    companyUsers: CompanyUser[];
  };
}

export interface GraphQLCategoryTemplatesResponse {
  data: {
    categoryTemplates: CategoryTemplate[];
  };
}

export interface GraphQLTemplateLabelsResponse {
  data: {
    templateLabels: TemplateLabel[];
  };
}

export interface GraphQLMigrationDashboardResponse {
  data: {
    migrationDashboard: MigrationDashboardData;
  };
}

export interface GraphQLMigrationHistoriesResponse {
  data: {
    migrationHistories: MigrationHistoryItem[];
  };
}

export interface GraphQLMigrationSchedulesResponse {
  data: {
    migrationSchedules: MigrationScheduleItem[];
  };
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private graphqlUrl = 'http://localhost:5069/graphql';

  constructor(private http: HttpClient) {}

  // ==========================================
  // LABEL DESIGNER QUERIES (ORIGINAL)
  // ==========================================
  getDashboard(): Observable<GraphQLDashboardResponse> {
    const query = {
      query: `
        query {
          dashboard {
            totalUsers
            totalTemplates
            printJobs
            totalCategories
            totalCompanies
            designersOnline
            spoolQueueStatus

            companyActivity {
              companyId
              companyName
              userCount
              printJobs
            }

            userActivity {
              id
              name
              percentage
              templates
              printJobs
              client

              hourlyActivity {
                hour
                count
              }

              usageEvents {
                time
                action
                eventDetails
              }
            }

            templatesByCategory {
              category
              count
            }

            weeklyPrintActivity {
              day
              printJobs
            }
          }
        }
      `
    };

    return this.http.post<GraphQLDashboardResponse>(
      this.graphqlUrl,
      query
    );
  }

  getCompanyUsers(companyId: string): Observable<GraphQLCompanyUsersResponse> {
    const query = {
      query: `
        query($companyId: String!) {
          companyUsers(companyId: $companyId) {
            id
            name
            templates
            printJobs
            client
          }
        }
      `,
      variables: {
        companyId: companyId
      }
    };

    return this.http.post<GraphQLCompanyUsersResponse>(
      this.graphqlUrl,
      query
    );
  }

  getCategoryTemplates(categoryName: string): Observable<GraphQLCategoryTemplatesResponse> {
    const query = {
      query: `
        query($categoryName: String!) {
          categoryTemplates(categoryName: $categoryName) {
            id
            name
            paperSize
            orientation
            version
            width
            height
            stable
            lockTemplate
            dateStamp
            printJobs
            author
          }
        }
      `,
      variables: {
        categoryName: categoryName
      }
    };

    return this.http.post<GraphQLCategoryTemplatesResponse>(
      this.graphqlUrl,
      query
    );
  }

  getTemplateLabels(templateId: string): Observable<GraphQLTemplateLabelsResponse> {
    const query = {
      query: `
        query($templateId: String!) {
          templateLabels(templateId: $templateId) {
            id
            labelId
            product
            hostName
            status
            remarks
            priority
            dateStamp
            userId
            userName
            userEmail
            companyName
            companyEmail
          }
        }
      `,
      variables: {
        templateId: templateId
      }
    };

    return this.http.post<GraphQLTemplateLabelsResponse>(
      this.graphqlUrl,
      query
    );
  }

  // ==========================================
  // DATA MIGRATION QUERIES (NEW)
  // ==========================================
  getMigrationDashboard(): Observable<GraphQLMigrationDashboardResponse> {
    const query = {
      query: `
        query {
          migrationDashboard {
            totalMigrations
            activePipelines
            totalRecordsProcessed
            totalSuccessRecords
            totalErrorRecords
            totalWarningRecords
            successRate
            failedMigrations
            totalSchedules
            queueStatus

            statusDistribution {
              status
              count
              percentage
            }

            companyActivity {
              companyId
              companyName
              migrationCount
              totalRecords
              successCount
              errorCount
            }

            weeklyThroughput {
              day
              totalRecords
              successRecords
              errorRecords
            }

            migrations {
              id
              name
              status
              lastRunTime
              retryCount
              lastError
              priority
              companyId
              jsonConfig
              totalRuns
              totalRecords
              successCount
              errorCount
              warningCount
              lastDurationSeconds
            }

            recentHistories {
              id
              migrationId
              migrationName
              startTime
              endTime
              durationSeconds
              totalRecords
              successCount
              errorCount
              warningCount
              status
              companyId
              logFileName
            }
          }
        }
      `
    };

    return this.http.post<GraphQLMigrationDashboardResponse>(
      this.graphqlUrl,
      query
    );
  }

  getMigrationHistories(migrationId: string): Observable<GraphQLMigrationHistoriesResponse> {
    const query = {
      query: `
        query($migrationId: String!) {
          migrationHistories(migrationId: $migrationId) {
            id
            migrationId
            migrationName
            startTime
            endTime
            durationSeconds
            totalRecords
            successCount
            errorCount
            warningCount
            status
            companyId
            logFileName
          }
        }
      `,
      variables: {
        migrationId: migrationId
      }
    };

    return this.http.post<GraphQLMigrationHistoriesResponse>(
      this.graphqlUrl,
      query
    );
  }

  getMigrationSchedules(): Observable<GraphQLMigrationSchedulesResponse> {
    const query = {
      query: `
        query {
          migrationSchedules {
            id
            name
            json
            companyId
            dateStamp
          }
        }
      `
    };

    return this.http.post<GraphQLMigrationSchedulesResponse>(
      this.graphqlUrl,
      query
    );
  }
}