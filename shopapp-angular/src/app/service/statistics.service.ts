import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {  HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../environments/environments';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StatisticsService {
  
  private apiBaseUrl = `${environment.apiBaseurl}/statistics`;

  constructor(private http: HttpClient) { }

  // Gọi API thống kê đơn hàng
  getOrderStatistic(startDate: string, endDate: string): Observable<any> {
    const params = new HttpParams()
    .set('startDate', startDate)
    .set('endDate', endDate) 
    return this.http.get(`${this.apiBaseUrl}/orders`, { params });
  }
  
  getOrderStatisticsss(): Observable<any> {
    debugger
    const params = new HttpParams()
    return this.http.get(`${this.apiBaseUrl}/orders`, { params });
  }

  // Gọi API thống kê sản phẩm bán chạy
  getTopSellingProducts(): Observable<any> {
    return this.http.get(`${this.apiBaseUrl}/top-products`);
  }
}
