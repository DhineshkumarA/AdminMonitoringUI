import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MigrationDashboardData } from '../../models/migration-dashboard.model';

@Component({
  selector: 'app-migration-summary-cards',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './migration-summary-cards.component.html',
  styleUrls: ['./migration-summary-cards.component.css']
})
export class MigrationSummaryCardsComponent {
  @Input() dashboardData: MigrationDashboardData | null = null;
}
