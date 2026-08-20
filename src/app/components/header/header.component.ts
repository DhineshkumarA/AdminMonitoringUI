import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  @Input() selectedModule: string = 'label';
  @Output() moduleChange = new EventEmitter<string>();

  onModuleChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.selectedModule = select.value;
    this.moduleChange.emit(this.selectedModule);
  }
}
