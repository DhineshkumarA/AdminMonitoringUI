import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  selectedModule: string = 'label';

  onModuleChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.selectedModule = select.value;
  }
}
