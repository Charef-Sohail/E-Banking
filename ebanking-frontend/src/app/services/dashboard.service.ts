import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private backendHost = 'http://localhost:8085'; // Should match other services

  constructor(private http: HttpClient) { }

  getAccountsStats(): Observable<any> {
    return this.http.get(`${this.backendHost}/accounts/stats`);
  }

  getMonthlyOperationsStats(): Observable<any[]> {
    return this.http.get<any[]>(`${this.backendHost}/operations/stats/monthly`);
  }
}
