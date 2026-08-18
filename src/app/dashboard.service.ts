import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DashboardData, CompanyUser } from './models/dashboard.model';

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

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private graphqlUrl = 'http://localhost:5069/graphql';

  constructor(private http: HttpClient) {}

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
}