import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoryTemplate, TemplateLabel, UserActivity } from '../../models/dashboard.model';

@Component({
  selector: 'app-template-labels-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './template-labels-modal.component.html',
  styleUrls: ['./template-labels-modal.component.css']
})
export class TemplateLabelsModalComponent {
  @Input() template: CategoryTemplate | null = null;
  @Input() labels: TemplateLabel[] = [];
  @Input() isLoading: boolean = false;
  @Output() close = new EventEmitter<void>();
  @Output() userSelect = new EventEmitter<UserActivity>();

  onClose(): void {
    this.close.emit();
  }

  onSelectUser(lbl: TemplateLabel): void {
    const userActivity: UserActivity = {
      id: lbl.userId || String(lbl.id),
      name: lbl.userName || 'Unknown User',
      percentage: 0,
      templates: 0,
      printJobs: 1,
      client: lbl.companyName || 'General',
      hourlyActivity: [],
      usageEvents: [
        {
          time: lbl.dateStamp ? new Date(lbl.dateStamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'N/A',
          action: 'PRINT_JOB',
          eventDetails: `Label: ${lbl.labelId}, Product: ${lbl.product}, Host: ${lbl.hostName}`
        }
      ]
    };
    this.userSelect.emit(userActivity);
  }

  formatDate(dateStr?: string): string {
    if (!dateStr) return '—';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString() + ' ' + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return dateStr;
    }
  }
}
