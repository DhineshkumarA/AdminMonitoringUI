import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoryTemplate } from '../../models/dashboard.model';

@Component({
  selector: 'app-category-templates-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './category-templates-modal.component.html',
  styleUrls: ['./category-templates-modal.component.css']
})
export class CategoryTemplatesModalComponent {
  @Input() categoryName: string = '';
  @Input() templates: CategoryTemplate[] = [];
  @Input() isLoading: boolean = false;
  @Output() close = new EventEmitter<void>();
  @Output() templateSelect = new EventEmitter<CategoryTemplate>();

  get totalPrints(): number {
    return this.templates.reduce((acc, t) => acc + (t.printJobs || 0), 0);
  }

  onClose(): void {
    this.close.emit();
  }

  onSelectTemplate(template: CategoryTemplate): void {
    this.templateSelect.emit(template);
  }
}
