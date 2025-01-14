import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../service/user.service';
import { RegisterDTO } from '../../dtos/register.dto';
import Swal from 'sweetalert2';  // Import SweetAlert2

@Component({
  selector: 'app-register',
  standalone: true,
  imports : [NgIf, FormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  @ViewChild('registerForm') registerForm!: NgForm;
  
  phoneNumber: string = '';
  password: string = '';
  retypePassword: string = '';
  fullName: string = '';
  address: string = '';
  isAccepted: boolean = true;
  dateOfBirth: Date = new Date();

  constructor(private router: Router, private userService: UserService) {
    // Mặc định ngày sinh - 18 tuổi
    this.dateOfBirth.setFullYear(this.dateOfBirth.getFullYear() - 18);
  }

  onPhoneNumberChange() {
    console.log(`Phone typed: ${this.phoneNumber}`);
  }

  register() {
    if (!this.registerForm.valid) {
      Swal.fire({
        icon: 'error',
        title: 'Lỗi!',
        text: 'Vui lòng kiểm tra lại các trường thông tin!'
      });
      return;
    }

    if (this.password !== this.retypePassword) {
      Swal.fire({
        icon: 'warning',
        title: 'Mật khẩu không khớp!',
        text: 'Vui lòng nhập lại đúng mật khẩu.'
      });
      return;
    }

    const registerDTO: RegisterDTO = {
        "fullname": this.fullName,
        "phone_number": this.phoneNumber,
        "address": this.address,
        "password": this.password,
        "retype_password": this.retypePassword,
        "date_of_birth": this.dateOfBirth,
        "facebook_account_id": 0,
        "google_account_id": 0
    }

    this.userService.register(registerDTO).subscribe({
        next: (response: any) => {
          Swal.fire({
            icon: 'success',
            title: 'Đăng ký thành công!',
            text: 'Chúc mừng bạn đã tạo tài khoản thành công!'
          }).then(() => {
            this.router.navigate(['/login']);
          });        
        },
        error: (error: any) => {  
          let errorMessage = 'Có lỗi xảy ra, vui lòng thử lại!';
          if (error.status === 409) {
            errorMessage = 'Số điện thoại đã tồn tại, vui lòng thử lại!';
          } else if (error.status === 422) {
            errorMessage = 'Dữ liệu không hợp lệ. Vui lòng kiểm tra lại các trường thông tin.';
          } else {
            errorMessage = `Chi tiết lỗi: ${error.error?.message || 'Lỗi không xác định'}`;
          }
          Swal.fire({
            icon: 'error',
            title: 'Đăng ký thất bại!',
            text: errorMessage
          });
        }
    })   
  }

  checkPasswordsMatch() {    
    if (this.password !== this.retypePassword) {
      this.registerForm.form.controls['retypePassword']
            .setErrors({ 'passwordMismatch': true });
    } else {
      this.registerForm.form.controls['retypePassword'].setErrors(null);
    }
  }

  checkAge() {
    if (this.dateOfBirth) {
      const today = new Date();
      const birthDate = new Date(this.dateOfBirth);
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }

      if (age < 18) {
        this.registerForm.form.controls['dateOfBirth'].setErrors({ 'invalidAge': true });
      } else {
        this.registerForm.form.controls['dateOfBirth'].setErrors(null);
      }
    }
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }
}
