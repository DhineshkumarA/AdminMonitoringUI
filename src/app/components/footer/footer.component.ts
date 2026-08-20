import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardData } from '../../models/dashboard.model';
import { MigrationDashboardData } from '../../models/migration-dashboard.model';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent {
  @Input() currentModule: string = 'label';
  @Input() dashboardData: DashboardData | null = null;
  @Input() migrationDashboardData: MigrationDashboardData | null = null;

  // =====================================================
  // LABEL DESIGNER CSV AUDIT CONTENT
  // =====================================================
  private generateLabelAuditCSVContent(): string {
    if (!this.dashboardData) {
      return 'No data available for audit report';
    }

    const data = this.dashboardData;
    const timestamp = new Date().toLocaleString();

    let content = `LABEL DESIGNER MONITORING SYSTEM - FULL AUDIT REPORT\n`;
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
  // DATA MIGRATION CSV AUDIT CONTENT
  // =====================================================
  private generateMigrationAuditCSVContent(): string {
    if (!this.migrationDashboardData) {
      return 'No migration data available for audit report';
    }

    const data = this.migrationDashboardData;
    const timestamp = new Date().toLocaleString();

    let content = `DATA MIGRATION MONITORING SYSTEM - FULL AUDIT REPORT\n`;
    content += `Export Date,${timestamp}\n\n`;

    // 1. Executive Summary
    content += `=== EXECUTIVE SUMMARY ===\n`;
    content += `Metric,Value\n`;
    content += `Total Configured Migrations,${data.totalMigrations ?? 0}\n`;
    content += `Active Pipelines (In-Flight),${data.activePipelines ?? 0}\n`;
    content += `Total Records Migrated,${data.totalRecordsProcessed ?? 0}\n`;
    content += `Successful Records,${data.totalSuccessRecords ?? 0}\n`;
    content += `Failed / Error Records,${data.totalErrorRecords ?? 0}\n`;
    content += `Warning Records,${data.totalWarningRecords ?? 0}\n`;
    content += `Success Rate (%),${data.successRate ?? 0}%\n`;
    content += `Failed Migrations,${data.failedMigrations ?? 0}\n`;
    content += `Active Schedules,${data.totalSchedules ?? 0}\n`;
    content += `Pipeline Queue Health,${data.queueStatus || 'HEALTHY'}\n\n`;

    // 2. Status Distribution
    content += `=== PIPELINE STATUS DISTRIBUTION ===\n`;
    content += `Status,Job Count,Share (%)\n`;
    if (data.statusDistribution && data.statusDistribution.length > 0) {
      data.statusDistribution.forEach((s) => {
        content += `"${s.status}",${s.count ?? 0},${s.percentage ?? 0}%\n`;
      });
    } else {
      content += `No status records\n`;
    }
    content += `\n`;

    // 3. Company Data Volume
    content += `=== COMPANY DATA VOLUME BREAKDOWN ===\n`;
    content += `Company ID,Company Name,Migration Pipelines,Total Records,Success Records,Error Records\n`;
    if (data.companyActivity && data.companyActivity.length > 0) {
      data.companyActivity.forEach((c) => {
        content += `"${c.companyId}","${c.companyName}",${c.migrationCount ?? 0},${c.totalRecords ?? 0},${c.successCount ?? 0},${c.errorCount ?? 0}\n`;
      });
    } else {
      content += `No company activity records\n`;
    }
    content += `\n`;

    // 4. Weekly Migration Throughput
    content += `=== WEEKLY THROUGHPUT & ERROR RATE ===\n`;
    content += `Day,Total Records Migrated,Success Records,Error Records\n`;
    if (data.weeklyThroughput && data.weeklyThroughput.length > 0) {
      data.weeklyThroughput.forEach((w) => {
        content += `"${w.day}",${w.totalRecords ?? 0},${w.successRecords ?? 0},${w.errorRecords ?? 0}\n`;
      });
    } else {
      content += `No weekly throughput records\n`;
    }
    content += `\n`;

    // 5. Configured Migration Pipelines
    content += `=== MIGRATION PIPELINES & BATCH JOBS ===\n`;
    content += `Pipeline ID,Pipeline Name,Company,Status,Priority,Total Runs,Total Records,Success,Errors,Warnings,Retry Count,Last Run,Last Duration (s),Last Error\n`;
    if (data.migrations && data.migrations.length > 0) {
      data.migrations.forEach((m) => {
        content += `"${m.id}","${m.name}","${m.companyId}","${m.status}",${m.priority},${m.totalRuns},${m.totalRecords},${m.successCount},${m.errorCount},${m.warningCount},${m.retryCount},"${m.lastRunTime || 'Never'}",${m.lastDurationSeconds ?? 0},"${(m.lastError || '').replace(/"/g, '""')}"\n`;
      });
    } else {
      content += `No migration pipelines configured\n`;
    }
    content += `\n`;

    // 6. Recent Execution Audit Logs
    content += `=== RECENT EXECUTION AUDIT TELEMETRY ===\n`;
    content += `Run ID,Pipeline ID,Pipeline Name,Company,Status,Start Time,End Time,Duration (s),Total Records,Success,Errors,Warnings,Log File Name\n`;
    if (data.recentHistories && data.recentHistories.length > 0) {
      data.recentHistories.forEach((h) => {
        content += `${h.id},"${h.migrationId}","${h.migrationName}","${h.companyId}","${h.status}","${h.startTime || ''}","${h.endTime || ''}",${h.durationSeconds ?? 0},${h.totalRecords},${h.successCount},${h.errorCount},${h.warningCount},"${h.logFileName || ''}"\n`;
      });
    } else {
      content += `No execution audit history recorded\n`;
    }

    return content;
  }

  // =====================================================
  // EXPORT AUDIT CSV
  // =====================================================
  exportAuditCSV(): void {
    const isMigration = this.currentModule === 'migration';
    const csv = isMigration ? this.generateMigrationAuditCSVContent() : this.generateLabelAuditCSVContent();
    const prefix = isMigration ? 'data-migration-audit' : 'label-designer-audit';

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    const dateStr = new Date().toISOString().split('T')[0];

    link.href = url;
    link.download = `${prefix}-${dateStr}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
  }

  // =====================================================
  // EXPORT AUDIT EXCEL
  // =====================================================
  exportAuditExcel(): void {
    const isMigration = this.currentModule === 'migration';
    const csv = isMigration ? this.generateMigrationAuditCSVContent() : this.generateLabelAuditCSVContent();
    const prefix = isMigration ? 'data-migration-audit' : 'label-designer-audit';

    const blob = new Blob([csv], {
      type: 'application/vnd.ms-excel;charset=utf-8;'
    });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    const dateStr = new Date().toISOString().split('T')[0];

    link.href = url;
    link.download = `${prefix}-${dateStr}.xls`;
    link.click();
    window.URL.revokeObjectURL(url);
  }
}
