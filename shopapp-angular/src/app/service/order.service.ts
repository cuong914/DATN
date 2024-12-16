import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { environment } from "../environments/environments";
import { OrderDTO } from "../dtos/order/order_dto";
import { Observable } from "rxjs";
import { Injectable } from "@angular/core";
import { OrderResponse } from "../responses/order/order.response";

@Injectable({
  providedIn: 'root'
})


export class OrderService{
  
  private apiUrl = `${environment.apiBaseurl}/orders`;
  private apiGetAllOrders = `${environment.apiBaseurl}/orders/get-orders-by-keyword`;

  constructor(private http: HttpClient) {}

 
  // placeOrder(orderData: any) {
  //   console.log('Calling API with:', orderData);
  //   return this.http.post(this.apiUrl, orderData); // kiểm tra kỹ đường dẫn API và dữ liệu orderData
  // }
  placeOrder(orderData: OrderDTO): Observable<any> {    
   // Thêm console.log để kiểm tra request và headers trước khi gửi đi
   const token = localStorage.getItem('access_token'); // Hoặc dùng TokenService nếu bạn đang sử dụng
   const headers = new HttpHeaders({
     Authorization: `Bearer ${token}`,
   });

   console.log('Đang gửi yêu cầu với headers:', headers);
   console.log('Dữ liệu đơn hàng:', orderData);

   return this.http.post(this.apiUrl, orderData, { headers });
 
  }
  getOrderById(orderId: number): Observable<any> {
    const token = localStorage.getItem('access_token'); // Hoặc dùng TokenService nếu bạn đang sử dụng
   const headers = new HttpHeaders({
     Authorization: `Bearer ${token}`,
   });
    const url = `${environment.apiBaseurl}/orders/${orderId}`;
    return this.http.get(url,{headers});
  }

  getAllOrders(keyword:string,
    page: number, limit: number
  ): Observable<OrderResponse[]> {
    const token = localStorage.getItem('access_token'); // Hoặc dùng TokenService nếu bạn đang sử dụng
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

      const params = new HttpParams()
      .set('keyword', keyword)      
      .set('page', page.toString())
      .set('limit', limit.toString());            
      return this.http.get<any>(this.apiGetAllOrders, { params,headers });
  
    }

    updateOrder(orderId: number, orderData: OrderDTO): Observable<any> {
     debugger
      const token = localStorage.getItem('access_token'); // Hoặc dùng TokenService nếu bạn đang sử dụng
   const headers = new HttpHeaders({
     Authorization: `Bearer ${token}`,
   });
   debugger
      const url = `${environment.apiBaseurl}/orders/${orderId}`;
      return this.http.put(url, orderData,{headers});
    }
    deleteOrder(orderId: number): Observable<any> {
      const token = localStorage.getItem('access_token'); // Hoặc dùng TokenService nếu bạn đang sử dụng
   const headers = new HttpHeaders({
     Authorization: `Bearer ${token}`,
   });
      const url = `${environment.apiBaseurl}/orders/${orderId}`;
      return this.http.delete(url, { responseType: 'text' ,headers});

    }

}