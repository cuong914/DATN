import { Component, OnInit, ViewChild } from '@angular/core';
import { FooterComponent } from '../footer/footer.component';

import { HeaderComponent } from '../header/header.component';
import {  Router } from '@angular/router';
import { NgFor } from '@angular/common';
import { FormsModule, NgForm, NgModel } from '@angular/forms';
import { NgIf } from '@angular/common';
import { LoginDTO } from '../../dtos/user/login.dto';
import { UserService } from '../../service/user.service';
import { TokenService } from '../../service/token.service';
import { LoginResponse } from '../../responses/user/LoginResponse';
import { CommonModule } from '@angular/common';
import { RoleService } from '../../service/role.service';
import { Role } from '../../models/role';
import { UserResponse } from '../../responses/user/user.reponse';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [HeaderComponent,FooterComponent,NgIf,NgFor,FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  @ViewChild('loginForm') loginForm!: NgForm;
  // admin
  phoneNumber : string = '1234567980';
  password : string  = '123456'; 

// user test
  // phoneNumber : string = '987654321';
  // password : string  = '123456'; 

  // /test 1 
  //   phoneNumber : string = '9876543211';
  // password : string  = '123456'; 

//   roles: Role[] = []; // Mảng roles
//   rememberMe: boolean = true;
//   selectedRole: Role | undefined; // Biến để lưu giá trị được chọn từ dropdown

//   onPhoneNumberChange(){
//     console.log(`Phone typed: ${this.phoneNumber}`)
//     //how to validate ? phone must be at least 6 characters
//   }
//   constructor(private router: Router
//     ,private userService: UserService
//   , private tokenService : TokenService
//   ,private roleService : RoleService
// ){}

// ngOnInit(){
//   // gọi api lấy dsach roles và lưu và biến roles 
//   debugger
//   this.roleService.getRoles().subscribe({
//     next: (roles : Role[]) =>{ // sử dụng kiểu Role[]
//     debugger
//     this.roles = roles;
//     this.selectedRole = roles.length > 0 ? roles[0] : undefined;
//     },
//     complete: () => {
//       debugger
//     },  
//     error: (error: any) => {
//       debugger
//       console.error('Error getting roles:', error);
//     }
//   })
// }

//   login() {
//     const message = `phone: ${this.phoneNumber}`+
//                     `password: ${this.password}`;
                   
//     //alert(message);
//     debugger
    
//     const loginDTO:LoginDTO = {
      
//         "phone_number": this.phoneNumber,
      
//         "password": this.password,

//         role_id: this.selectedRole?.id ?? 1
      
//     };
//     this.userService.login(loginDTO).subscribe({
//         next: (response: LoginResponse) => {
//           // muốn sd token trong các yêu cầu API  thì ta cần gắn token vào heaader thì vc đó gọi xen ngang  là : 

          
//           debugger;
//           const {token} = response ; // đây gọi là distructring : trích xuât thuộc tính token từ thằng response ra 
//             this.tokenService.setToken(token);
//           //this.router.navigate(['/login']);          
//         },
//         complete: () => {
//           debugger
//         },
//         error: (error: any) => {          
//           alert(`Cannot register, error: ${error.error}`)          
//         }
//     });
//   }
// }



roles: Role[] = []; // Mảng roles
  rememberMe: boolean = true;
  selectedRole: Role | undefined; // Biến để lưu giá trị được chọn từ dropdown
  userResponse?: UserResponse

  onPhoneNumberChange() {
    console.log(`Phone typed: ${this.phoneNumber}`);
    //how to validate ? phone must be at least 6 characters
  }
  constructor(
    private router: Router,
    private userService: UserService,
    private tokenService: TokenService,
    private roleService: RoleService
  ) { }

  ngOnInit() {
    // Gọi API lấy danh sách roles và lưu vào biến roles
    debugger
    this.roleService.getRoles().subscribe({      
      next: (roles: Role[]) => { // Sử dụng kiểu Role[]
        debugger
        this.roles = roles;
        this.selectedRole = roles.length > 0 ? roles[0] : undefined;
      },
      complete: () => {
        debugger
      },  
      error: (error: any) => {
        debugger
        console.error('Error getting roles:', error);
      }
    });
  }

  createAccount() {
    debugger
    // Chuyển hướng người dùng đến trang đăng ký (hoặc trang tạo tài khoản)
    this.router.navigate(['/register']); 
  }


  // login() {
  //   const message = `phone: ${this.phoneNumber}` +
  //     `password: ${this.password}`;
  //   //alert(message);
  //   debugger

  //   const loginDTO: LoginDTO = {
  //     phone_number: this.phoneNumber,
  //     password: this.password,
  //     role_id: this.selectedRole?.id ?? 1
  //   };
  //   debugger
  //   this.userService.login(loginDTO).subscribe({
  //     next: (response: LoginResponse) => {
  //       debugger;
  //       const { token } = response;
  //       if (this.rememberMe) {
  //         this.tokenService.setToken(token);
  //         debugger;
  //         this.userService.getUserDetail(token).subscribe({
  //           next: (response: any) => {
  //             debugger
  //             this.userResponse = {
  //               ...response,
  //               date_of_birth: new Date(response.date_of_birth),
  //             };    
  //             this.userService.saveUserResponseToLocalStorage(this.userResponse); 
  //             //this.router.navigate(['/']);                      
  //           },
  //           complete: () => {
  //             debugger;
  //           },
  //           error: (error: any) => {
  //             debugger;
  //             alert(error.error.message);
  //           }
  //         })
  //       }               
  //       this.router.navigate(['/']);
  //     },
  //     complete: () => {
  //       debugger;
  //     },
  //     error: (error: any) => {
  //       debugger;
  //       alert(error?.error?.message);
  //     }
  //   });
  // }
  login() {
    const message = `phone: ${this.phoneNumber},
     password: ${this.password}`;
    const loginDTO: LoginDTO = {
      phone_number: this.phoneNumber,
      password: this.password,
      role_id: this.selectedRole?.id ?? 1,
    };
  
    this.userService.login(loginDTO).subscribe({
      next: (response: LoginResponse) => {
        const { token } = response;
        if (this.rememberMe) {
          this.tokenService.setToken(token);
          console.log("Token:", token); // Kiểm tra token
          debugger
          this.userService.getUserDetail(token).subscribe({
            
            next: (response: any) => {
              debugger
              this.userResponse = {
                ...response,
                date_of_birth: new Date(response.date_of_birth),
              };
              debugger
              this.userService.saveUserResponseToLocalStorage(this.userResponse);
              if(this.userResponse?.role.name == 'admin'){
                this.router.navigate(['/admin']);
              }else if(this.userResponse?.role.name == 'user'){
                this.router.navigate(['/']);
              }
             
            },
            error: (error: any) => {
              console.error("Error fetching user details:", error);
              alert(error.error?.message || "An error occurred while fetching user details.");
            },
          });
        }
      },
      error: (error: any) => {
        console.error("Login error:", error);
        alert(error.error?.message || "Login failed.");
      },
    });
  }
}