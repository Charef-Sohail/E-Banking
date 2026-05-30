import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { DashboardService } from '../services/dashboard.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class DashboardComponent implements OnInit {

  // Accounts Pie Chart
  public pieChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'top',
      }
    }
  };
  public pieChartData: ChartData<'pie', number[], string | string[]> = {
    labels: [ 'Current Accounts', 'Saving Accounts' ],
    datasets: [ { data: [ 0, 0 ] } ]
  };
  public pieChartType: ChartType = 'pie';

  // Monthly Operations Bar Chart
  public barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
  };
  public barChartType: ChartType = 'bar';
  public barChartData: ChartData<'bar'> = {
    labels: [],
    datasets: [
      { data: [], label: 'Credits' },
      { data: [], label: 'Debits' }
    ]
  };

  accountsStats: any;
  chartReady = false;

  constructor(private dashboardService: DashboardService) { }

  ngOnInit(): void {
    this.dashboardService.getAccountsStats().subscribe({
      next: (data) => {
        this.accountsStats = data;
        this.pieChartData.datasets[0].data = [data.currentAccountsCount, data.savingAccountsCount];
        // trigger change detection by re-assigning the whole object
        this.pieChartData = { ...this.pieChartData };
      },
      error: err => {
        console.error(err);
      }
    });

    this.dashboardService.getMonthlyOperationsStats().subscribe({
      next: (data) => {
        const labels: string[] = [];
        const credits: number[] = [];
        const debits: number[] = [];
        data.forEach(item => {
          labels.push(item.month);
          credits.push(item.totalCredit);
          debits.push(item.totalDebit);
        });
        
        this.barChartData.labels = labels;
        this.barChartData.datasets[0].data = credits;
        this.barChartData.datasets[1].data = debits;
        this.barChartData = { ...this.barChartData };
        this.chartReady = true;
      },
      error: err => {
        console.error(err);
      }
    });
  }
}
