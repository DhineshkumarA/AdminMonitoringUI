import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CompanyActivity, CompanyUser } from '../../models/dashboard.model';

@Component({
  selector: 'app-company-users-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './company-users-modal.component.html',
  styleUrls: ['./company-users-modal.component.css']
})
export class CompanyUsersModalComponent {
  @Input() company: CompanyActivity | null = null;
  @Input() users: CompanyUser[] = [];
  @Input() isLoading: boolean = false;

  @Output() close = new EventEmitter<void>();
  @Output() userSelect = new EventEmitter<CompanyUser>();

  onClose(): void {
    this.close.emit();
  }

  onSelectUser(user: CompanyUser): void {
    this.userSelect.emit(user);
  }
}
