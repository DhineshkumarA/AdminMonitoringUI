import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MigrationJobSummary } from '../../models/migration-dashboard.model';

@Component({
  selector: 'app-company-migrations-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './company-migrations-modal.component.html',
  styleUrls: ['./company-migrations-modal.component.css']
})
export class CompanyMigrationsModalComponent {
  @Input() companyName: string = '';
  @Input() jobs: MigrationJobSummary[] = [];
  @Input() isLoading: boolean = false;
  @Output() close = new EventEmitter<void>();
  @Output() jobSelect = new EventEmitter<MigrationJobSummary>();

  get totalRecords(): number {
    return this.jobs.reduce((acc, j) => acc + (j.totalRecords || 0), 0);
  }

  get totalSuccess(): number {
    return this.jobs.reduce((acc, j) => acc + (j.successCount || 0), 0);
  }

  get totalErrors(): number {
    return this.jobs.reduce((acc, j) => acc + (j.errorCount || 0), 0);
  }

  onClose(): void {
    this.close.emit();
  }

  onSelectJob(job: MigrationJobSummary): void {
    this.jobSelect.emit(job);
  }

  formatDate(dateStr?: string): string {
    if (!dateStr) return 'Never';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString() + ' ' + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return dateStr;
    }
  }

  getStatusClass(status: string): string {
    const s = status.toUpperCase();
    if (s.includes('SUCCESS') || s.includes('COMPLETED')) return 'badge-success';
    if (s.includes('RUN') || s.includes('PROGRESS')) return 'badge-running';
    if (s.includes('FAIL') || s.includes('ERR')) return 'badge-error';
    if (s.includes('WARN') || s.includes('RETRY')) return 'badge-warning';
    return 'badge-neutral';
  }
}
