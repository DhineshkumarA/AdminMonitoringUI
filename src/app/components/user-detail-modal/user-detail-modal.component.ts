import {
  Component,
  Input,
  Output,
  EventEmitter,
  AfterViewInit,
  OnChanges,
  OnDestroy,
  SimpleChanges,
  ElementRef,
  ViewChild
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart } from 'chart.js/auto';
import { UserActivity, HourlyActivity } from '../../models/dashboard.model';

@Component({
  selector: 'app-user-detail-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-detail-modal.component.html',
  styleUrls: ['./user-detail-modal.component.css']
})
export class UserDetailModalComponent implements AfterViewInit, OnChanges, OnDestroy {
  @Input() user: UserActivity | null = null;
  @Output() close = new EventEmitter<void>();

  @ViewChild('userDetailChartRef') userDetailChartRef!: ElementRef<HTMLCanvasElement>;

  private userDetailChart: Chart | null = null;
  private isViewInitialized: boolean = false;

  private readonly defaultTimelineHours: string[] = [
    '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'
  ];

  ngAfterViewInit(): void {
    this.isViewInitialized = true;
    this.renderChart();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['user'] && this.isViewInitialized) {
      this.renderChart();
    }
  }

  ngOnDestroy(): void {
    this.destroyChart();
  }

  onClose(): void {
    this.destroyChart();
    this.close.emit();
  }

  private destroyChart(): void {
    if (this.userDetailChart) {
      this.userDetailChart.destroy();
      this.userDetailChart = null;
    }
  }

  private renderChart(): void {
    setTimeout(() => {
      this.createUserDetailChart();
    }, 50);
  }

  private createUserDetailChart(): void {
    const canvas = this.userDetailChartRef?.nativeElement || (document.getElementById('userDetailChart') as HTMLCanvasElement);
    if (!canvas) {
      return;
    }

    this.destroyChart();

    const activity: HourlyActivity[] =
      this.user?.hourlyActivity && this.user.hourlyActivity.length > 0
        ? this.user.hourlyActivity
        : this.defaultTimelineHours.map((hour) => ({ hour, count: 0 }));

    this.userDetailChart = new Chart(canvas, {
      type: 'line',
      data: {
        labels: activity.map((item) => item.hour),
        datasets: [
          {
            label: 'Activity',
            data: activity.map((item) => item.count),
            borderColor: '#be185d',
            backgroundColor: 'rgba(190, 24, 93, 0.12)',
            borderWidth: 3,
            tension: 0.4,
            fill: true,
            pointRadius: 4,
            pointHoverRadius: 7,
            pointBackgroundColor: '#ffffff',
            pointBorderColor: '#be185d',
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
              color: '#dbe3ef'
            },
            ticks: {
              color: '#475569'
            }
          },
          y: {
            beginAtZero: true,
            suggestedMax: 5,
            ticks: {
              stepSize: 1,
              color: '#475569'
            },
            grid: {
              color: '#dbe3ef'
            }
          }
        }
      }
    });
  }

  // =====================================================
  // EXPORT CSV
  // =====================================================
  exportCSV(): void {
    if (!this.user) {
      return;
    }

    const user = this.user;
    const csv =
      `User,Client,Templates,Print Jobs,Activity Share\n` +
      `${user.name},${user.client},${user.templates ?? 0},${user.printJobs ?? 0},${user.percentage ?? 0}%`;

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${user.name}-activity.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
  }

  // =====================================================
  // EXPORT EXCEL
  // =====================================================
  exportExcel(): void {
    if (!this.user) {
      return;
    }

    const user = this.user;
    const csv =
      `User,Client,Templates,Print Jobs,Activity Share\n` +
      `${user.name},${user.client},${user.templates ?? 0},${user.printJobs ?? 0},${user.percentage ?? 0}%`;

    const blob = new Blob([csv], { type: 'application/vnd.ms-excel' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${user.name}-activity.xls`;
    link.click();
    window.URL.revokeObjectURL(url);
  }
}
