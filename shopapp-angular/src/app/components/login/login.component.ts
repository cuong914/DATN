import { Component, OnInit, ViewChild } from '@angular/core';
import { FooterComponent } from '../footer/footer.component';
import { HeaderComponent } from '../header/header.component';
import { Router } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { NgIf } from '@angular/common';
import { LoginDTO } from '../../dtos/user/login.dto';
import { UserService } from '../../service/user.service';
import { TokenService } from '../../service/token.service';
import { LoginResponse } from '../../responses/user/LoginResponse';
import { UserResponse } from '../../responses/user/user.reponse';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [HeaderComponent, FooterComponent, NgIf, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  @ViewChild('loginForm') loginForm!: NgForm;
  phoneNumber: string = '';
  password: string = '';
  rememberMe: boolean = true;
  userResponse?: UserResponse;

  constructor(
    private router: Router,
    private userService: UserService,
    private tokenService: TokenService
  ) {}

  ngOnInit() {
    // NgOnInit hiện tại không cần thiết gọi API lấy roles
  }

  createAccount() {
    this.router.navigate(['/register']);
  }

  login() {
    const loginDTO: LoginDTO = {
      phone_number: this.phoneNumber,
      password: this.password,
    };

    this.userService.login(loginDTO).subscribe({
      next: (response: LoginResponse) => {
        const { token } = response;
        if (this.rememberMe) {
          this.tokenService.setToken(token);
          console.log('Token:', token);
          this.fetchUserDetails(token);
        }
      },
      error: (error: any) => {
        console.error('Login error:', error);
        alert(error.error?.message || 'Đăng nhập thất bại.');
      },
    });
  }

  private fetchUserDetails(token: string) {
    this.userService.getUserDetail(token).subscribe({
      next: (response: any) => {
        this.userResponse = {
          ...response,
          date_of_birth: new Date(response.date_of_birth),
        };
        this.userService.saveUserResponseToLocalStorage(this.userResponse);
        
        // Điều hướng theo role
        if (this.userResponse?.role?.name === 'admin') {
          this.router.navigate(['/admin']);
      } else {
          this.router.navigate(['/']);
      }      
      },
      error: (error: any) => {
        console.error('Error fetching user details:', error);
        alert('Không thể lấy thông tin người dùng.');
      },
    });
  }
}
