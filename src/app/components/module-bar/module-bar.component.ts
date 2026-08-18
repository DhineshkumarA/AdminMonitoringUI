import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-module-bar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './module-bar.component.html',
  styleUrls: ['./module-bar.component.css']
})
export class ModuleBarComponent {
  @Input() moduleTitle: string = 'LABEL DESIGNER MODULE COMPONENT';
  @Input() designersOnline: number = 41;
  @Input() spoolQueueStatus: string = 'HEALTHY';
}
