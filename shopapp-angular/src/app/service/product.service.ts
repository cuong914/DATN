import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environments';
import { Product } from '../models/product';
import { ApiResponse } from '../responses/api.response';
import { UpdateProductDTO } from '../dtos/update.product.dto';
import { InsertProductDTO } from '../dtos/insert.product.dto';

@Injectable({
  providedIn: 'root'
})

export class ProductService {
  private apiBaseUrl = environment.apiBaseurl;
  private apiGetProducts = `${environment.apiBaseurl}/products`;

  constructor(private http: HttpClient) { }

  getProducts(keyword:string, categoryId:number, 
              page: number, limit: number
    ): Observable<ApiResponse> {
      debugger
    const params = new HttpParams()
      .set('keyword', keyword)
      .set('category_id', categoryId)
      .set('page', page.toString())
      .set('limit', limit.toString());            
    return this.http.get<ApiResponse>(this.apiGetProducts, { params });
  }

  getDetailProductsssss(productId: number): Observable<ApiResponse> {
    debugger
    return this.http.get<ApiResponse>(`${environment.apiBaseurl}/products/prs/${productId}`);// đoạn này lấy ra product và truền id vào 
  }
  getDetailProduct(productId: number) {
    return this.http.get(`${environment.apiBaseurl}/products/${productId}`);// đoạn này lấy ra product và truền id vào 
  }
  getProductsByIds(productIds: number[]): Observable<Product[]> {
    // Chuyển danh sách ID thành một chuỗi và truyền vào params
    debugger
    const params = new HttpParams().set('ids', productIds.join(',')); 
    return this.http.get<Product[]>(`${this.apiGetProducts}/by-ids`, { params });
  }
  getAll(){
    return this.http.get(`${environment.apiBaseurl}/products/getAll`); // Gọi API lấy tất cả sản phẩm
  }

  deleteProduct(productId: number): Observable<ApiResponse> {

    const token = localStorage.getItem('access_token'); // Hoặc dùng TokenService nếu bạn đang sử dụng
   const headers = new HttpHeaders({
     Authorization: `Bearer ${token}`,
   });

    debugger
  return this.http.delete<ApiResponse>(`${this.apiBaseUrl}/products/${productId}`,{headers});
  }
  updateProduct(productId: number, updatedProduct: UpdateProductDTO): Observable<ApiResponse> {
    const token = localStorage.getItem('access_token'); // Hoặc dùng TokenService nếu bạn đang sử dụng
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.put<ApiResponse>(`${this.apiBaseUrl}/products/${productId}`, updatedProduct,{headers});
  }  
  insertProduct(insertProductDTO: InsertProductDTO): Observable<ApiResponse> {
    const token = localStorage.getItem('access_token'); // Hoặc dùng TokenService nếu bạn đang sử dụng
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    // Add a new product
    debugger
    return this.http.post<ApiResponse>(`${this.apiBaseUrl}/products`, insertProductDTO,{headers});
  }
  uploadImages(productId: number, files: File[]): Observable<ApiResponse> {
    const token = localStorage.getItem('access_token'); // Hoặc dùng TokenService nếu bạn đang sử dụng
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('files', files[i]);
    }
    // Upload images for the specified product id
    return this.http.post<ApiResponse>(`${this.apiBaseUrl}/products/uploads/${productId}`, formData,{headers});
  }
  deleteProductImage(id: number): Observable<any> {
    debugger
    return this.http.delete<string>(`${this.apiBaseUrl}/product_images/${id}`);
  }
}