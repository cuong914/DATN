import { Component, OnInit } from '@angular/core';
import { UserService } from '../../service/user.service';
import { Router, RouterModule } from '@angular/router';
import { TokenService } from '../../service/token.service';
import { UserResponse } from '../../responses/user/user.reponse';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss'
})
export class AdminComponent implements OnInit {
  userResponse?: UserResponse | null;
  isSidebarCollapsed = false; // Điều khiển trạng thái của sidebar (thu gọn hay không)

  constructor(
    private userService: UserService,       
    private tokenService: TokenService,    
    private router: Router,
  ) {}

  ngOnInit() {
    this.userResponse = this.userService.getUserResponseFromLocalStorage();
    this.router.navigate(['/admin/orders']); // default router
  }

  logout() {
    this.userService.removeUserFromLocalStorage();
    this.tokenService.removeToken();
    this.userResponse = this.userService.getUserResponseFromLocalStorage();
    this.router.navigate(['/']);
  }

  showAdminComponent(componentName: string): void {
    if (componentName === 'orders') {
      this.router.navigate(['/admin/orders']);
    } else if (componentName === 'categories') {
      this.router.navigate(['/admin/categories']);
    } else if (componentName === 'sizes') {
      this.router.navigate(['/admin/sizes']);
    } else if (componentName === 'products') {
      this.router.navigate(['/admin/products']);
    }else if (componentName === 'colors') {
      this.router.navigate(['/admin/colors']);
    } else if (componentName === 'statistical') {
      this.router.navigate(['/admin/statistical']);
    } else if (componentName === 'banhang') {
      this.router.navigate(['/admin/banhang']);
    }
  }

  toggleSidebar() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed; // Thay đổi trạng thái sidebar
  }
  
}
