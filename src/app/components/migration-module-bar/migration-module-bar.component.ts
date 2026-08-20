import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-migration-module-bar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './migration-module-bar.component.html',
  styleUrls: ['./migration-module-bar.component.css']
})
export class MigrationModuleBarComponent {
  @Input() activePipelines: number = 0;
  @Input() queueStatus: string = 'HEALTHY';
  @Input() successRate: number = 100;
  moduleTitle: string = 'DATA MIGRATION MONITORING';
}
