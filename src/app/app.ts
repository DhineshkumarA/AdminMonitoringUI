import {Component,AfterViewInit,ChangeDetectorRef} from '@angular/core';

import { Chart } from 'chart.js/auto';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App implements AfterViewInit {

  selectedUser: any = null;

  userDetailChart: Chart | null = null;

  constructor( private cdr: ChangeDetectorRef) {}

  users = [
    {
      id: 1,
      name: 'Dhinesh',
      percentage: 45,
      templates: 15,
      printJobs: 920,
      client: 'Tech Solutions Ltd'
    },
    {
      id: 2,
      name: 'Arun',
      percentage: 30,
      templates: 12,
      printJobs: 780,
      client: 'ABC Manufacturing'
    },
    {
      id: 3,
      name: 'John',
      percentage: 25,
      templates: 8,
      printJobs: 640,
      client: 'Global Logistics Corp'
    }
  ];


  ngAfterViewInit(): void {

    setTimeout(() => {

      this.createUserActivityChart();

      this.createCategoryChart();

      this.createWeeklyChart();

    }, 100);

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

          console.log('PIE CLICKED');

          if (!elements || elements.length === 0) {

            console.log('No slice selected');

            return;
          }

          const index = elements[0].index;

          console.log('Clicked index:', index);

          const user = this.users[index];

          console.log('Clicked user:', user);

          // Set selected user
          this.selectedUser = user;

          // Force Angular to update @if(selectedUser)
          this.cdr.detectChanges();

          console.log(
            'selectedUser:',
            this.selectedUser
          );

          // Wait until popup canvas exists
          setTimeout(() => {

            console.log(
              'Creating user detail chart'
            );

            this.createUserDetailChart();

          }, 100);

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


    this.userDetailChart =
      new Chart(canvas, {

        type: 'line',


        data: {

          labels: [
            '08:00',
            '09:00',
            '10:00',
            '11:00',
            '12:00',
            '13:00',
            '14:00'
          ],


          datasets: [

            {

              label: 'Activity',

              data: [
                1,
                3,
                5,
                2,
                8,
                6,
                4
              ],


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


    new Chart(canvas, {

      type: 'bar',


      data: {

        labels: [
          'Invoice',
          'Product',
          'Shipping',
          'Barcode',
          'Asset Tag'
        ],


        datasets: [

          {

            label: 'Templates',

            data: [
              35,
              22,
              18,
              12,
              8
            ],

            backgroundColor:
              '#2563eb',

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


    new Chart(canvas, {

      type: 'line',


      data: {

        labels: [
          'Mon',
          'Tue',
          'Wed',
          'Thu',
          'Fri',
          'Sat',
          'Sun'
        ],


        datasets: [

          {

            label: 'Print Spool',

            data: [
              620,
              880,
              1200,
              1450,
              980,
              420,
              300
            ],


            borderColor:
              '#4f46e5',

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