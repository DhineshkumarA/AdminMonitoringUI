import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MigrationJobSummary } from '../../models/migration-dashboard.model';

@Component({
  selector: 'app-migration-jobs-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './migration-jobs-table.component.html',
  styleUrls: ['./migration-jobs-table.component.css']
})
export class MigrationJobsTableComponent {
  @Input() jobs: MigrationJobSummary[] = [];
  @Output() jobSelect = new EventEmitter<MigrationJobSummary>();

  searchTerm: string = '';
  selectedFilterStatus: string = 'ALL';

  get filteredJobs(): MigrationJobSummary[] {
    return this.jobs.filter(job => {
      const matchesSearch = !this.searchTerm ||
        job.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        job.companyId.toLowerCase().includes(this.searchTerm.toLowerCase());

      const matchesStatus = this.selectedFilterStatus === 'ALL' ||
        job.status.toUpperCase() === this.selectedFilterStatus.toUpperCase();

      return matchesSearch && matchesStatus;
    });
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
