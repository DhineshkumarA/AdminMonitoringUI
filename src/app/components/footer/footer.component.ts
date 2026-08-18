import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardData } from '../../models/dashboard.model';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent {
  @Input() dashboardData: DashboardData | null = null;

  private generateAuditCSVContent(): string {
    if (!this.dashboardData) {
      return 'No data available for audit report';
    }

    const data = this.dashboardData;
    const timestamp = new Date().toLocaleString();

    let content = `PRODUCTION MONITORING SYSTEM - FULL MODULE AUDIT REPORT\n`;
    content += `Export Date,${timestamp}\n\n`;

    // 1. Executive Summary
    content += `=== EXECUTIVE SUMMARY ===\n`;
    content += `Metric,Count\n`;
    content += `Total Active Users,${data.totalUsers ?? 0}\n`;
    content += `Total Templates,${data.totalTemplates ?? 0}\n`;
    content += `Total Print Jobs,${data.printJobs ?? 0}\n`;
    content += `Total Categories,${data.totalCategories ?? 0}\n`;
    content += `Total Registered Companies,${data.totalCompanies ?? 0}\n\n`;

    // 2. Company Activity Breakdown
    content += `=== COMPANY ACTIVITY BREAKDOWN ===\n`;
    content += `Company ID,Company Name,User Count,Print Jobs\n`;
    if (data.companyActivity && data.companyActivity.length > 0) {
      data.companyActivity.forEach((c) => {
        content += `"${c.companyId}","${c.companyName}",${c.userCount ?? 0},${c.printJobs ?? 0}\n`;
      });
    } else {
      content += `No company activity records\n`;
    }
    content += `\n`;

    // 3. User Activity Breakdown
    content += `=== USER ACTIVITY BREAKDOWN ===\n`;
    content += `User ID,User Name,Client,Templates Authored,Print Jobs Triggered,Activity Share (%)\n`;
    if (data.userActivity && data.userActivity.length > 0) {
      data.userActivity.forEach((u) => {
        content += `"${u.id}","${u.name}","${u.client}",${u.templates ?? 0},${u.printJobs ?? 0},${u.percentage ?? 0}%\n`;
      });
    } else {
      content += `No user activity records\n`;
    }
    content += `\n`;

    // 4. Templates by Category
    content += `=== TEMPLATES BY CATEGORY ===\n`;
    content += `Category,Template Count\n`;
    if (data.templatesByCategory && data.templatesByCategory.length > 0) {
      data.templatesByCategory.forEach((t) => {
        content += `"${t.category}",${t.count ?? 0}\n`;
      });
    } else {
      content += `No category records\n`;
    }
    content += `\n`;

    // 5. Weekly Print Spool Activity
    content += `=== WEEKLY PRINT ACTIVITY ===\n`;
    content += `Day,Print Jobs\n`;
    if (data.weeklyPrintActivity && data.weeklyPrintActivity.length > 0) {
      data.weeklyPrintActivity.forEach((w) => {
        content += `"${w.day}",${w.printJobs ?? 0}\n`;
      });
    } else {
      content += `No weekly print records\n`;
    }

    return content;
  }

  // =====================================================
  // EXPORT AUDIT CSV
  // =====================================================
  exportAuditCSV(): void {
    if (!this.dashboardData) {
      return;
    }

    const csv = this.generateAuditCSVContent();
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    const dateStr = new Date().toISOString().split('T')[0];

    link.href = url;
    link.download = `full-module-audit-${dateStr}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
  }

  // =====================================================
  // EXPORT AUDIT EXCEL
  // =====================================================
  exportAuditExcel(): void {
    if (!this.dashboardData) {
      return;
    }

    const csv = this.generateAuditCSVContent();
    const blob = new Blob([csv], {
      type: 'application/vnd.ms-excel;charset=utf-8;'
    });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    const dateStr = new Date().toISOString().split('T')[0];

    link.href = url;
    link.download = `full-module-audit-${dateStr}.xls`;
    link.click();
    window.URL.revokeObjectURL(url);
  }
}
