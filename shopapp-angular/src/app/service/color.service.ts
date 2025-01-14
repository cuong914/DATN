import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environments';
// import { Category } from '../models/category';
// import { Size } from '../models/size';
// import { UpdateCategoryDTO } from '../dtos/update.category.dto';
// import { InsertCategoryDTO } from '../dtos/insert.category.dto';
import { Color } from '../models/color';
import { ApiResponse } from '../responses/api.response';
// import { UpdateSizeDTO } from '../dtos/update.size.dto';
import { UpdateColorDTO } from '../dtos/update.color.dto';
// import { InsertSizeDTO } from '../dtos/insert.size.dto';
import { InsertColorDTO } from '../dtos/insert.color.dto';
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
  export class ColorService {

    private apiBaseUrl = environment.apiBaseurl;
  
    constructor(private http: HttpClient) { }
    getColors(page: number, limit: number):Observable<Color[]> {
      const token = localStorage.getItem('access_token'); // Hoặc dùng TokenService nếu bạn đang sử dụng
        const headers = new HttpHeaders({
          Authorization: `Bearer ${token}`,
        });
      const params = new HttpParams()
        .set('page', page.toString())
        .set('limit', limit.toString());     
        return this.http.get<Color[]>(`${environment.apiBaseurl}/colors`, { params,headers });           
    }
    getDetailColor(id: number): Observable<ApiResponse> {
      const token = localStorage.getItem('access_token'); // Hoặc dùng TokenService nếu bạn đang sử dụng
      const headers = new HttpHeaders({
        Authorization: `Bearer ${token}`,
      });
      return this.http.get<ApiResponse>(`${this.apiBaseUrl}/colors/${id}`,{headers});
    }
    deleteColor(id: number): Observable<string> {
      const token = localStorage.getItem('access_token'); // Hoặc dùng TokenService nếu bạn đang sử dụng
      const headers = new HttpHeaders({
        Authorization: `Bearer ${token}`,
      });
      debugger
      return this.http.delete<string>(`${this.apiBaseUrl}/colors/${id}`,{headers});
    }
    updateColor(id: number, updatedColor: UpdateColorDTO): Observable<UpdateColorDTO> {
      const token = localStorage.getItem('access_token'); // Hoặc dùng TokenService nếu bạn đang sử dụng
      const headers = new HttpHeaders({
        Authorization: `Bearer ${token}`,
      });
      return this.http.put<Color>(`${this.apiBaseUrl}/colors/${id}`, updatedColor,{headers});
    }  
    insertColor(insertColorDTO: InsertColorDTO): Observable<any> {
      const token = localStorage.getItem('access_token'); // Hoặc dùng TokenService nếu bạn đang sử dụng
      const headers = new HttpHeaders({
        Authorization: `Bearer ${token}`,
      });
      // Add a new colors
      return this.http.post(`${this.apiBaseUrl}/colors`, insertColorDTO,{headers});
    }
  }
