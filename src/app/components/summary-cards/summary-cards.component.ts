import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardData } from '../../models/dashboard.model';

@Component({
  selector: 'app-summary-cards',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './summary-cards.component.html',
  styleUrls: ['./summary-cards.component.css']
})
export class SummaryCardsComponent {
  @Input() dashboardData: DashboardData | null = null;
}
