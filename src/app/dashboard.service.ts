import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private graphqlUrl = 'http://localhost:5069/graphql';

  constructor(private http: HttpClient) {}

  getDashboard(): Observable<any> {

    const query = {
      query: `
        query {
          dashboard {
            totalUsers
            totalTemplates
            printJobs
            dataImports
            failedImports

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

    return this.http.post<any>(
      this.graphqlUrl,
      query
    );
  }
}