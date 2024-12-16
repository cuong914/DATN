import { Injectable } from "@angular/core";
import { environment } from "../environments/environments";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { ApiResponse } from "../responses/api.response";


@Injectable({
  providedIn: 'root', // Điều này đảm bảo dịch vụ có thể được sử dụng toàn cục
})
  export class CouponService {
    
  
    private apiBaseUrl = environment.apiBaseurl;
  
    constructor(private http: HttpClient) { }
    calculateCouponValue(couponCode: string, totalAmount: number): Observable<ApiResponse> {
        const token = localStorage.getItem('access_token'); // Hoặc dùng TokenService nếu bạn đang sử dụng
        const headers = new HttpHeaders({
          Authorization: `Bearer ${token}`,
        });
      const url = `${this.apiBaseUrl}/coupons/calculate`;
      const params = new HttpParams()
        .set('couponCode', couponCode)
        .set('totalAmount', totalAmount.toString());
  
      return this.http.get<ApiResponse>(url, { params , headers});
    }
    
  }