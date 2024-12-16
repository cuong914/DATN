import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environments';
import { Category } from '../models/category';
import { UpdateCategoryDTO } from '../dtos/update.category.dto';
import { InsertCategoryDTO } from '../dtos/insert.category.dto';
import { ApiResponse } from '../responses/api.response';
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
  export class CategoryService {

    private apiBaseUrl = environment.apiBaseurl;
  
    constructor(private http: HttpClient) { }
    getCategories(page: number, limit: number):Observable<Category[]> {
      const token = localStorage.getItem('access_token'); // Hoặc dùng TokenService nếu bạn đang sử dụng
        const headers = new HttpHeaders({
          Authorization: `Bearer ${token}`,
        });
      const params = new HttpParams()
        .set('page', page.toString())
        .set('limit', limit.toString());     
        return this.http.get<Category[]>(`${environment.apiBaseurl}/categories`, { params,headers });           
    }
    getDetailCategory(id: number): Observable<ApiResponse> {
      const token = localStorage.getItem('access_token'); // Hoặc dùng TokenService nếu bạn đang sử dụng
      const headers = new HttpHeaders({
        Authorization: `Bearer ${token}`,
      });
      return this.http.get<ApiResponse>(`${this.apiBaseUrl}/categories/${id}`,{headers});
    }
    deleteCategory(id: number): Observable<string> {
      const token = localStorage.getItem('access_token'); // Hoặc dùng TokenService nếu bạn đang sử dụng
      const headers = new HttpHeaders({
        Authorization: `Bearer ${token}`,
      });
      debugger
      return this.http.delete<string>(`${this.apiBaseUrl}/categories/${id}`,{headers});
    }
    updateCategory(id: number, updatedCategory: UpdateCategoryDTO): Observable<UpdateCategoryDTO> {
      const token = localStorage.getItem('access_token'); // Hoặc dùng TokenService nếu bạn đang sử dụng
      const headers = new HttpHeaders({
        Authorization: `Bearer ${token}`,
      });
      return this.http.put<Category>(`${this.apiBaseUrl}/categories/${id}`, updatedCategory,{headers});
    }  
    insertCategory(insertCategoryDTO: InsertCategoryDTO): Observable<any> {
      const token = localStorage.getItem('access_token'); // Hoặc dùng TokenService nếu bạn đang sử dụng
      const headers = new HttpHeaders({
        Authorization: `Bearer ${token}`,
      });
      // Add a new category
      return this.http.post(`${this.apiBaseUrl}/categories`, insertCategoryDTO,{headers});
    }
  }
