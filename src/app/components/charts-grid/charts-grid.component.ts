import {
  Component,
  Input,
  Output,
  EventEmitter,
  AfterViewInit,
  OnChanges,
  OnDestroy,
  SimpleChanges,
  NgZone,
  ElementRef,
  ViewChild
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart } from 'chart.js/auto';
import { CompanyActivity, DashboardData } from '../../models/dashboard.model';

@Component({
  selector: 'app-charts-grid',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './charts-grid.component.html',
  styleUrls: ['./charts-grid.component.css']
})
export class ChartsGridComponent implements AfterViewInit, OnChanges, OnDestroy {
  @Input() dashboardData: DashboardData | null = null;
  @Output() companyClick = new EventEmitter<CompanyActivity>();

  @ViewChild('userActivityChartRef') userActivityChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('categoryChartRef') categoryChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('weeklyChartRef') weeklyChartRef!: ElementRef<HTMLCanvasElement>;

  private companyChart: Chart | null = null;
  private categoryChart: Chart | null = null;
  private weeklyChart: Chart | null = null;

  private isViewInitialized: boolean = false;

  private readonly companyColors: string[] = [
    '#2563eb',
    '#6366f1',
    '#0d9488',
    '#94a3b8',
    '#f59e0b',
    '#ef4444'
  ];

  constructor(private zone: NgZone) {}

  ngAfterViewInit(): void {
    this.isViewInitialized = true;
    this.renderCharts();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['dashboardData'] && this.isViewInitialized) {
      this.renderCharts();
    }
  }

  ngOnDestroy(): void {
    this.destroyAllCharts();
  }

  private destroyAllCharts(): void {
    if (this.companyChart) {
      this.companyChart.destroy();
      this.companyChart = null;
    }
    if (this.categoryChart) {
      this.categoryChart.destroy();
      this.categoryChart = null;
    }
    if (this.weeklyChart) {
      this.weeklyChart.destroy();
      this.weeklyChart = null;
    }
  }

  private renderCharts(): void {
    if (!this.dashboardData) {
      return;
    }

    setTimeout(() => {
      this.createCompanyActivityChart();
      this.createCategoryChart();
      this.createWeeklyChart();
    }, 50);
  }

  // =====================================================
  // COMPANY ACTIVITY DOUGHNUT
  // =====================================================
  private createCompanyActivityChart(): void {
    const canvas = this.userActivityChartRef?.nativeElement || (document.getElementById('userActivityChart') as HTMLCanvasElement);
    if (!canvas) {
      return;
    }

    if (this.companyChart) {
      this.companyChart.destroy();
      this.companyChart = null;
    }

    const companies = this.dashboardData?.companyActivity;
    if (!companies || companies.length === 0) {
      return;
    }

    this.companyChart = new Chart(canvas, {
      type: 'doughnut',
      data: {
        labels: companies.map((c) => c.companyName),
        datasets: [
          {
            data: companies.map((c) => c.printJobs),
            backgroundColor: this.companyColors,
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
                return companies.map((company, index) => ({
                  text: `${company.companyName} (${company.printJobs})`,
                  fillStyle: this.companyColors[index % this.companyColors.length],
                  strokeStyle: '#ffffff',
                  lineWidth: 1,
                  hidden: false,
                  index: index
                }));
              }
            }
          },
          tooltip: {
            enabled: true,
            callbacks: {
              label: (context) => {
                const company = companies[context.dataIndex];
                return `${company.companyName}: ${company.printJobs} print jobs`;
              }
            }
          }
        },
        onHover: (_event, elements) => {
          canvas.style.cursor = elements.length > 0 ? 'pointer' : 'default';
        },
        onClick: (_event, elements) => {
          if (!elements || elements.length === 0) {
            return;
          }
          const index = elements[0].index;
          const company = companies[index];
          this.zone.run(() => {
            this.companyClick.emit(company);
          });
        }
      }
    });
  }

  // =====================================================
  // CATEGORY BAR CHART
  // =====================================================
  private createCategoryChart(): void {
    const canvas = this.categoryChartRef?.nativeElement || (document.getElementById('categoryChart') as HTMLCanvasElement);
    if (!canvas) {
      return;
    }

    if (this.categoryChart) {
      this.categoryChart.destroy();
      this.categoryChart = null;
    }

    const categories = this.dashboardData?.templatesByCategory;
    if (!categories || categories.length === 0) {
      return;
    }

    this.categoryChart = new Chart(canvas, {
      type: 'bar',
      data: {
        labels: categories.map((item) => item.category),
        datasets: [
          {
            label: 'Templates',
            data: categories.map((item) => item.count),
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
  // WEEKLY PRINT CHART
  // =====================================================
  private createWeeklyChart(): void {
    const canvas = this.weeklyChartRef?.nativeElement || (document.getElementById('weeklyChart') as HTMLCanvasElement);
    if (!canvas) {
      return;
    }

    if (this.weeklyChart) {
      this.weeklyChart.destroy();
      this.weeklyChart = null;
    }

    const weeklyData = this.dashboardData?.weeklyPrintActivity;
    if (!weeklyData || weeklyData.length === 0) {
      return;
    }

    this.weeklyChart = new Chart(canvas, {
      type: 'line',
      data: {
        labels: weeklyData.map((item) => item.day),
        datasets: [
          {
            label: 'Print Spool',
            data: weeklyData.map((item) => item.printJobs),
            borderColor: '#4f46e5',
            backgroundColor: 'rgba(79, 70, 229, 0.12)',
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
}
