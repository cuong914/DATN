import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { TokenService } from '../service/token.service';
@Injectable() // đoạn này  TokenInterceptor thực thi HttpInterceptor để có thể sd ta phải đăng ký interceptor trong mudules
export class TokenInterceptor implements HttpInterceptor {
  constructor(private tokenService: TokenService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    debugger
    console.log('Request URL:', req.url);
    console.log('Request Method:', req.method);
    console.log('Request Headers:', req.headers);
    // Lấy token từ TokenService
    
    const token = this.tokenService.getToken();

    // Kiểm tra nếu có token, thêm nó vào headers
    if (token) {
      const authReq = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${token}`)
      });
      return next.handle(authReq);
    }

    // Nếu không có token, gửi request như bình thường
    return next.handle(req);
  }

}
