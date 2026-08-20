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
import { MigrationDashboardData } from '../../models/migration-dashboard.model';

@Component({
  selector: 'app-migration-charts-grid',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './migration-charts-grid.component.html',
  styleUrls: ['./migration-charts-grid.component.css']
})
export class MigrationChartsGridComponent implements AfterViewInit, OnChanges, OnDestroy {
  @Input() dashboardData: MigrationDashboardData | null = null;
  @Output() statusClick = new EventEmitter<string>();
  @Output() companyClick = new EventEmitter<string>();

  @ViewChild('statusChartRef') statusChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('companyChartRef') companyChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('throughputChartRef') throughputChartRef!: ElementRef<HTMLCanvasElement>;

  private statusChart: Chart | null = null;
  private companyChart: Chart | null = null;
  private throughputChart: Chart | null = null;
  private isViewInitialized: boolean = false;

  private readonly statusColors: { [key: string]: string } = {
    'SUCCESS': '#10b981',
    'COMPLETED': '#10b981',
    'RUNNING': '#3b82f6',
    'IN PROGRESS': '#3b82f6',
    'PROCESSING': '#06b6d4',
    'FAILED': '#ef4444',
    'ERROR': '#dc2626',
    'WARNING': '#f59e0b',
    'PENDING': '#8b5cf6',
    'RETRYING': '#f97316',
    'READY': '#64748b',
    'UNKNOWN': '#94a3b8'
  };

  private readonly paletteColors = [
    '#9333ea',
    '#7c3aed',
    '#6366f1',
    '#3b82f6',
    '#06b6d4',
    '#10b981',
    '#f59e0b',
    '#ef4444',
    '#ec4899',
    '#d946ef'
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
    if (this.statusChart) {
      this.statusChart.destroy();
      this.statusChart = null;
    }
    if (this.companyChart) {
      this.companyChart.destroy();
      this.companyChart = null;
    }
    if (this.throughputChart) {
      this.throughputChart.destroy();
      this.throughputChart = null;
    }
  }

  private renderCharts(): void {
    if (!this.dashboardData) {
      return;
    }

    setTimeout(() => {
      this.createStatusChart();
      this.createCompanyChart();
      this.createThroughputChart();
    }, 50);
  }

  // =====================================================
  // STATUS DISTRIBUTION DOUGHNUT
  // =====================================================
  private createStatusChart(): void {
    const canvas = this.statusChartRef?.nativeElement || (document.getElementById('migrationStatusChart') as HTMLCanvasElement);
    if (!canvas) return;

    if (this.statusChart) {
      this.statusChart.destroy();
      this.statusChart = null;
    }

    const statuses = this.dashboardData?.statusDistribution;
    if (!statuses || statuses.length === 0) return;

    const colors = statuses.map(s => this.statusColors[s.status.toUpperCase()] || '#8b5cf6');

    this.statusChart = new Chart(canvas, {
      type: 'doughnut',
      data: {
        labels: statuses.map(s => s.status),
        datasets: [
          {
            data: statuses.map(s => s.count),
            backgroundColor: colors,
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
                return statuses.map((item, index) => ({
                  text: `${item.status} (${item.count})`,
                  fillStyle: colors[index % colors.length],
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
                const item = statuses[context.dataIndex];
                return `${item.status}: ${item.count} jobs (${item.percentage}%)`;
              }
            }
          }
        },
        onHover: (_event, elements) => {
          canvas.style.cursor = elements.length > 0 ? 'pointer' : 'default';
        },
        onClick: (_event, elements) => {
          if (!elements || elements.length === 0) return;
          const index = elements[0].index;
          const status = statuses[index]?.status;
          if (status) {
            this.zone.run(() => this.statusClick.emit(status));
          }
        }
      }
    });
  }

  // =====================================================
  // COMPANY VOLUME BAR CHART
  // =====================================================
  private createCompanyChart(): void {
    const canvas = this.companyChartRef?.nativeElement || (document.getElementById('migrationCompanyChart') as HTMLCanvasElement);
    if (!canvas) return;

    if (this.companyChart) {
      this.companyChart.destroy();
      this.companyChart = null;
    }

    const companies = this.dashboardData?.companyActivity;
    if (!companies || companies.length === 0) return;

    this.companyChart = new Chart(canvas, {
      type: 'bar',
      data: {
        labels: companies.map(c => c.companyName || 'Company'),
        datasets: [
          {
            label: 'Total Records',
            data: companies.map(c => c.totalRecords),
            backgroundColor: companies.map((_, i) => this.paletteColors[i % this.paletteColors.length]),
            hoverBackgroundColor: '#6b21a8',
            borderRadius: 5,
            minBarLength: 4
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
          legend: { display: false },
          tooltip: {
            enabled: true,
            callbacks: {
              label: (context) => ` ${(context.parsed.y ?? 0).toLocaleString()} records`
            }
          }
        },
        scales: {
          x: {
            ticks: {
              autoSkip: false,
              maxRotation: 45,
              minRotation: 35,
              font: { size: 9.5 },
              color: '#475569'
            },
            grid: { display: false }
          },
          y: {
            beginAtZero: true,
            ticks: { color: '#475569' },
            grid: { color: '#f1f5f9' }
          }
        },
        onHover: (_event, elements) => {
          canvas.style.cursor = elements.length > 0 ? 'pointer' : 'default';
        },
        onClick: (_event, elements) => {
          if (!elements || elements.length === 0) return;
          const index = elements[0].index;
          const comp = companies[index]?.companyId;
          if (comp) {
            this.zone.run(() => this.companyClick.emit(comp));
          }
        }
      }
    });
  }

  // =====================================================
  // WEEKLY THROUGHPUT LINE CHART
  // =====================================================
  private createThroughputChart(): void {
    const canvas = this.throughputChartRef?.nativeElement || (document.getElementById('migrationThroughputChart') as HTMLCanvasElement);
    if (!canvas) return;

    if (this.throughputChart) {
      this.throughputChart.destroy();
      this.throughputChart = null;
    }

    const weekly = this.dashboardData?.weeklyThroughput;
    if (!weekly || weekly.length === 0) return;

    const daysOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const dataMap = new Map<string, { total: number; error: number }>();
    weekly.forEach(item => {
      dataMap.set(item.day.toLowerCase(), { total: item.totalRecords, error: item.errorRecords });
    });

    const labels: string[] = [];
    const totalData: number[] = [];
    const errorData: number[] = [];

    daysOrder.forEach(day => {
      labels.push(day);
      const val = dataMap.get(day.toLowerCase()) || { total: 0, error: 0 };
      totalData.push(val.total);
      errorData.push(val.error);
    });

    this.throughputChart = new Chart(canvas, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Records Migrated',
            data: totalData,
            borderColor: '#9333ea',
            backgroundColor: 'rgba(147, 51, 234, 0.12)',
            tension: 0.4,
            fill: true,
            pointRadius: 4,
            pointHoverRadius: 7,
            pointBackgroundColor: '#ffffff',
            pointBorderColor: '#9333ea'
          },
          {
            label: 'Errors',
            data: errorData,
            borderColor: '#ef4444',
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            tension: 0.4,
            fill: false,
            pointRadius: 3,
            pointHoverRadius: 6,
            pointBackgroundColor: '#ffffff',
            pointBorderColor: '#ef4444'
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
            display: true,
            position: 'top',
            labels: { boxWidth: 12, font: { size: 10 } }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: { color: '#475569' },
            grid: { color: '#f1f5f9' }
          },
          x: {
            ticks: { color: '#475569' },
            grid: { display: false }
          }
        }
      }
    });
  }
}
