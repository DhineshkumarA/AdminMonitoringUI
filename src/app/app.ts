import {Component,OnInit,AfterViewInit,NgZone,ChangeDetectorRef} from '@angular/core';

import { Chart } from 'chart.js/auto';
import { DashboardService } from './dashboard.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App implements OnInit, AfterViewInit {

  selectedUser: any = null;

  dashboardData: any = null;

  userDetailChart: Chart | null = null;

  constructor(
    private zone: NgZone,
    private dashboardService: DashboardService,
    private cdr: ChangeDetectorRef
  ) {}

  // Your existing users array
  users: any[] = [];

  ngOnInit(): void {

    console.log('App initialized');

    this.dashboardService.getDashboard().subscribe({

      next: (response) => {

        console.log('GraphQL Response:', response);

        this.dashboardData = response.data.dashboard;

        this.users = this.dashboardData.userActivity;

        console.log('Dashboard Data:', this.dashboardData);
        console.log('Total Users:', this.dashboardData.totalUsers);
        console.log('Users from API:', this.users);

        // Force Angular template update
        this.cdr.detectChanges();

        setTimeout(() => {

          this.createUserActivityChart();

          this.createCategoryChart();

          this.createWeeklyChart();

        }, 100);

      },

      error: (error) => {

        console.error('GraphQL Error:', error);

      }

    });

  }

  ngAfterViewInit(): void {

    // Don't call API here.
    // Don't create charts here immediately.

  }


  // =====================================================
  // USER ACTIVITY DOUGHNUT
  // =====================================================

  createUserActivityChart(): void {

    const canvas = document.getElementById(
      'userActivityChart'
    ) as HTMLCanvasElement | null;

    if (!canvas) {
      console.error('userActivityChart canvas not found');
      return;
    }

    if (!this.users || this.users.length === 0) {
      console.log('No user activity data available');
      return;
    }

    console.log('Creating User Activity Chart:', this.users);

    const userColors: string[] = [
      '#2563eb',
      '#6366f1',
      '#0d9488'
    ];

    new Chart(canvas, {

      type: 'doughnut',

      data: {

        labels: this.users.map(
          user => user.name
        ),

        datasets: [
          {
            data: this.users.map(
              user => user.percentage
            ),

            backgroundColor: userColors,

            borderColor: '#ffffff',

            borderWidth: 2,

            hoverOffset: 15
          }
        ]
      },

      options: {

        responsive: true,

        maintainAspectRatio: false,

        interaction: {
          mode: 'nearest',
          intersect: true
        },

        plugins: {

          legend: {

            position: 'right',

            labels: {

              generateLabels: () => {

                return this.users.map(
                  (user, index) => {

                    return {
                      text:
                        `${user.name} (${user.percentage}%)`,

                      fillStyle:
                        userColors[index],

                      strokeStyle:
                        '#ffffff',

                      lineWidth: 1,

                      hidden: false,

                      index: index
                    };

                  }
                );

              }
            }
          },

          tooltip: {

            enabled: true,

            callbacks: {

              label: (context) => {

                const user =
                  this.users[context.dataIndex];

                return `${user.name}: ${user.percentage}%`;
              }
            }
          }
        },

        onHover: (_event, elements) => {

          canvas.style.cursor =
            elements.length > 0
              ? 'pointer'
              : 'default';

        },

        onClick: (_event, elements) => {

          if (!elements || elements.length === 0) {
            return;
          }

          const index = elements[0].index;

          const user = this.users[index];

          console.log('Clicked User:', user);

          this.zone.run(() => {

            this.selectedUser = user;

            console.log(
              'selectedUser:',
              this.selectedUser
            );

            this.cdr.detectChanges();

            // Wait for popup HTML/canvas to be created
            setTimeout(() => {

              console.log(
                'Creating user detail chart'
              );

              this.createUserDetailChart();

            }, 100);

          });

        }

      }

    });

  }


  // =====================================================
  // USER DETAIL CHART
  // =====================================================

  createUserDetailChart(): void {

    const canvas =
      document.getElementById(
        'userDetailChart'
      ) as HTMLCanvasElement | null;

    if (!canvas) {

      console.error(
        'userDetailChart canvas not found'
      );

      return;
    }

    // Destroy previous chart
    if (this.userDetailChart) {

      this.userDetailChart.destroy();

      this.userDetailChart = null;
    }

    // Get hourly activity from API
    const activity =
      this.selectedUser?.hourlyActivity;

    if (!activity || activity.length === 0) {

      console.log(
        'No hourly activity data for selected user'
      );

      return;
    }

    console.log(
      'Hourly Activity:',
      activity
    );

    this.userDetailChart =
      new Chart(canvas, {

        type: 'line',

        data: {

          labels: activity.map(
            (item: any) => item.hour
          ),

          datasets: [

            {

              label: 'Activity',

              data: activity.map(
                (item: any) => item.count
              ),

              borderColor:
                '#2563eb',

              backgroundColor:
                'rgba(37, 99, 235, 0.12)',

              borderWidth: 3,

              tension: 0.4,

              fill: true,

              pointRadius: 4,

              pointHoverRadius: 7,

              pointBackgroundColor:
                '#ffffff',

              pointBorderColor:
                '#2563eb',

              pointBorderWidth: 2

            }

          ]

        },

        options: {

          responsive: true,

          maintainAspectRatio: false,

          interaction: {

            mode: 'index',

            intersect: false

          },

          plugins: {

            legend: {

              display: false

            },

            tooltip: {

              enabled: true

            }

          },

          scales: {

            x: {

              grid: {

                color:
                  '#dbe3ef'

              },

              ticks: {

                color:
                  '#475569'

              }

            },

            y: {

              beginAtZero: true,

              suggestedMax: 8,

              ticks: {

                stepSize: 1,

                color:
                  '#475569'

              },

              grid: {

                color:
                  '#dbe3ef'

              }

            }

          }

        }

      });
  }

  // =====================================================
  // CATEGORY CHART
  // =====================================================

  createCategoryChart(): void {

    const canvas =
      document.getElementById(
        'categoryChart'
      ) as HTMLCanvasElement | null;


    if (!canvas) {
      return;
    }

    const categories =
      this.dashboardData?.templatesByCategory;

    if (!categories || categories.length === 0) {
      console.log('No category data');
      return;
    }


    new Chart(canvas, {

      type: 'bar',


      data: {

        labels: categories.map(
          (item: any) => item.category
        ),



        datasets: [
          {
            label: 'Templates',

            data: categories.map(
              (item: any) => item.count
            ),

            backgroundColor: '#2563eb',

            borderRadius: 5
          }
        ]

      },


      options: {

        responsive: true,

        maintainAspectRatio: false,

        plugins: {
          legend: {
            display: false
          }
        },

        scales: {
          y: {
            beginAtZero: true
          }
        }

      }


    });

  }


  // =====================================================
  // WEEKLY CHART
  // =====================================================

  createWeeklyChart(): void {

    const canvas =
      document.getElementById(
        'weeklyChart'
      ) as HTMLCanvasElement | null;


    if (!canvas) {
      return;
    }

    const weeklyData =
      this.dashboardData?.weeklyPrintActivity;

    if (!weeklyData || weeklyData.length === 0) {
      console.log('No weekly print data');
      return;
    }


    new Chart(canvas, {

      type: 'line',


      data: {

        labels: weeklyData.map(
        (item: any) => item.day
        ),


        
        datasets: [

          {
            label: 'Print Spool',

            data: weeklyData.map(
              (item: any) => item.printJobs
            ),

            borderColor: '#4f46e5',

            backgroundColor:
              'rgba(79, 70, 229, 0.12)',

            tension: 0.4,

            fill: true,

            pointRadius: 4,

            pointHoverRadius: 8
          }

        ]

      },


      options: {

        responsive: true,

        maintainAspectRatio: false,

        plugins: {

          legend: {
            display: false
          }

        },

        scales: {

          y: {
            beginAtZero: true
          }

        }

      }

    });

  }


  // =====================================================
  // CLOSE USER POPUP
  // =====================================================

  closeUserDashboard(): void {

    if (this.userDetailChart) {

      this.userDetailChart.destroy();

      this.userDetailChart = null;

    }


    this.selectedUser = null;

  }


  // =====================================================
  // EXPORT CSV
  // =====================================================

  exportCSV(): void {

    if (!this.selectedUser) {
      return;
    }


    const user =
      this.selectedUser;


    const csv =
      `User,Client,Templates,Print Jobs,Activity Share\n` +
      `${user.name},${user.client},${user.templates},${user.printJobs},${user.percentage}%`;


    const blob =
      new Blob(
        [csv],
        {
          type: 'text/csv'
        }
      );


    const url =
      window.URL.createObjectURL(blob);


    const link =
      document.createElement('a');


    link.href = url;

    link.download =
      `${user.name}-activity.csv`;


    link.click();


    window.URL.revokeObjectURL(url);

  }


  // =====================================================
  // EXPORT EXCEL
  // =====================================================

  exportExcel(): void {

    if (!this.selectedUser) {
      return;
    }


    /*
     * Simple CSV-compatible Excel export.
     * Excel opens this file correctly.
     */

    const user =
      this.selectedUser;


    const csv =
      `User,Client,Templates,Print Jobs,Activity Share\n` +
      `${user.name},${user.client},${user.templates},${user.printJobs},${user.percentage}%`;


    const blob =
      new Blob(
        [csv],
        {
          type:
            'application/vnd.ms-excel'
        }
      );


    const url =
      window.URL.createObjectURL(blob);


    const link =
      document.createElement('a');


    link.href = url;

    link.download =
      `${user.name}-activity.xls`;


    link.click();


    window.URL.revokeObjectURL(url);

  }

}