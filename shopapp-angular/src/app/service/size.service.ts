import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environments';
// import { Category } from '../models/category';
import { Size } from '../models/size';
// import { UpdateCategoryDTO } from '../dtos/update.category.dto';
// import { InsertCategoryDTO } from '../dtos/insert.category.dto';
import { ApiResponse } from '../responses/api.response';
import { UpdateSizeDTO } from '../dtos/update.size.dto';
import { InsertSizeDTO } from '../dtos/insert.size.dto';
@Injectable({
  providedIn: 'root'
})
// export class CategoryService {
//   private apiGetCategories  = `${environment.apiBaseurl}/categories`;

//   constructor(private http: HttpClient) { }
//   getCategories(page: number, limit: number):Observable<Category[]> {
//     const params = new HttpParams()
//       .set('page', page.toString())
//       .set('limit', limit.toString());     
//       return this.http.get<Category[]>(this.apiGetCategories, { params });           
//   }
  export class SizeService {

    private apiBaseUrl = environment.apiBaseurl;
  
    constructor(private http: HttpClient) { }
    getSizes(page: number, limit: number):Observable<Size[]> {
      const token = localStorage.getItem('access_token'); // Hoặc dùng TokenService nếu bạn đang sử dụng
        const headers = new HttpHeaders({
          Authorization: `Bearer ${token}`,
        });
      const params = new HttpParams()
        .set('page', page.toString())
        .set('limit', limit.toString());     
        return this.http.get<Size[]>(`${environment.apiBaseurl}/sizes`, { params,headers });           
    }
    getDetailSize(id: number): Observable<ApiResponse> {
      const token = localStorage.getItem('access_token'); // Hoặc dùng TokenService nếu bạn đang sử dụng
      const headers = new HttpHeaders({
        Authorization: `Bearer ${token}`,
      });
      return this.http.get<ApiResponse>(`${this.apiBaseUrl}/sizes/${id}`,{headers});
    }
    deleteSize(id: number): Observable<string> {
      const token = localStorage.getItem('access_token'); // Hoặc dùng TokenService nếu bạn đang sử dụng
      const headers = new HttpHeaders({
        Authorization: `Bearer ${token}`,
      });
      debugger
      return this.http.delete<string>(`${this.apiBaseUrl}/sizes/${id}`,{headers});
    }
    updateSize(id: number, updatedSize: UpdateSizeDTO): Observable<UpdateSizeDTO> {
      const token = localStorage.getItem('access_token'); // Hoặc dùng TokenService nếu bạn đang sử dụng
      const headers = new HttpHeaders({
        Authorization: `Bearer ${token}`,
      });
      return this.http.put<Size>(`${this.apiBaseUrl}/sizes/${id}`, updatedSize,{headers});
    }  
    insertSize(insertSizeDTO: InsertSizeDTO): Observable<any> {
      const token = localStorage.getItem('access_token'); // Hoặc dùng TokenService nếu bạn đang sử dụng
      const headers = new HttpHeaders({
        Authorization: `Bearer ${token}`,
      });
      // Add a new Size
      return this.http.post(`${this.apiBaseUrl}/sizes`, insertSizeDTO,{headers});
    }
  }
