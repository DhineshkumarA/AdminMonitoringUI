import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  DashboardData,
  CompanyUser,
  CategoryTemplate,
  TemplateLabel
} from './models/dashboard.model';

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
}