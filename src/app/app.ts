import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardService } from './dashboard.service';
import {
  DashboardData,
  CompanyActivity,
  CompanyUser,
  UserActivity
} from './models/dashboard.model';

import { HeaderComponent } from './components/header/header.component';
import { ModuleBarComponent } from './components/module-bar/module-bar.component';
import { SummaryCardsComponent } from './components/summary-cards/summary-cards.component';
import { ChartsGridComponent } from './components/charts-grid/charts-grid.component';
import { CompanyUsersModalComponent } from './components/company-users-modal/company-users-modal.component';
import { UserDetailModalComponent } from './components/user-detail-modal/user-detail-modal.component';
import { FooterComponent } from './components/footer/footer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    ModuleBarComponent,
    SummaryCardsComponent,
    ChartsGridComponent,
    CompanyUsersModalComponent,
    UserDetailModalComponent,
    FooterComponent
  ],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App implements OnInit {
  dashboardData: DashboardData | null = null;
  selectedCompany: CompanyActivity | null = null;
  companyUsers: CompanyUser[] = [];
  isLoadingCompanyUsers = false;
  selectedUser: UserActivity | null = null;

  constructor(
    private dashboardService: DashboardService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.dashboardService.getDashboard().subscribe({
      next: (res) => {
        this.dashboardData = res?.data?.dashboard || null;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Dashboard API Error:', err)
    });
  }

  onCompanySelected(company: CompanyActivity): void {
    this.selectedCompany = company;
    this.isLoadingCompanyUsers = true;
    this.companyUsers = [];

    this.dashboardService.getCompanyUsers(company.companyId).subscribe({
      next: (res) => {
        this.companyUsers = res?.data?.companyUsers || [];
        this.isLoadingCompanyUsers = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.isLoadingCompanyUsers = false;
        this.cdr.detectChanges();
      }
    });
  }

  onCompanyUserSelected(user: CompanyUser): void {
    const fullUser = this.dashboardData?.userActivity?.find(
      (item) => String(item.id) === String(user.id) || item.name?.toLowerCase() === user.name?.toLowerCase()
    );

    this.selectedUser = fullUser
      ? { ...fullUser, templates: fullUser.templates ?? user.templates, printJobs: fullUser.printJobs ?? user.printJobs, client: fullUser.client || this.selectedCompany?.companyName || 'N/A' }
      : { id: String(user.id), name: user.name || 'Unknown', percentage: 0, templates: user.templates ?? 0, printJobs: user.printJobs ?? 0, client: user.client || this.selectedCompany?.companyName || 'N/A', hourlyActivity: [], usageEvents: [] };

    this.selectedCompany = null;
    this.cdr.detectChanges();
  }

  closeCompanyModal(): void {
    this.selectedCompany = null;
    this.companyUsers = [];
  }

  closeUserModal(): void {
    this.selectedUser = null;
  }
}