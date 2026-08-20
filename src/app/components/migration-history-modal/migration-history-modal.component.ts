import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MigrationJobSummary, MigrationHistoryItem } from '../../models/migration-dashboard.model';

@Component({
  selector: 'app-migration-history-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './migration-history-modal.component.html',
  styleUrls: ['./migration-history-modal.component.css']
})
export class MigrationHistoryModalComponent {
  @Input() job: MigrationJobSummary | null = null;
  @Input() histories: MigrationHistoryItem[] = [];
  @Input() isLoading: boolean = false;
  @Output() close = new EventEmitter<void>();

  showJsonConfig: boolean = false;

  onClose(): void {
    this.close.emit();
  }

  toggleConfig(): void {
    this.showJsonConfig = !this.showJsonConfig;
  }

  formatDate(dateStr?: string): string {
    if (!dateStr) return '—';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString() + ' ' + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
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

  exportCSV(): void {
    if (!this.job || !this.histories.length) return;

    let csv = 'Run ID,Migration Name,Start Time,End Time,Duration (s),Total Records,Success,Errors,Warnings,Status,Log File\n';
    this.histories.forEach(h => {
      csv += `${h.id},"${h.migrationName}",${h.startTime || ''},${h.endTime || ''},${h.durationSeconds || 0},${h.totalRecords},${h.successCount},${h.errorCount},${h.warningCount},${h.status},"${h.logFileName || ''}"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${this.job.name.replace(/\s+/g, '_')}_history.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
  }
}
