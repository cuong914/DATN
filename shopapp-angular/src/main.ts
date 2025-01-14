import { bootstrapApplication } from '@angular/platform-browser';
// import { appConfig } from './app/app.config';
// import { AppComponent } from './app/app.component';

 import { enableProdMode, importProvidersFrom, NgModule } from '@angular/core';
 import { HomeComponent } from './app/components/home/home.component';
import { OrderComponent } from './app/components/order/order.component';
import { AppModule } from './app/app.module';
import { RegisterComponent } from './app/components/register/register.component';
import { provideHttpClient, withInterceptors, HttpClientModule } from '@angular/common/http';
import { LoginComponent } from './app/components/login/login.component';
import { ProductDetailComponent } from './app/components/product-detail/product-detail.component';

import { BanhangComponent } from './app/banhang/banhang.component';
import { TokenInterceptor } from './app/Interceptors/token.interceptors';
import { OrderDetailComponent } from './app/components/order-confirm/order.detail.component';
import { AppComponent } from './app/app/app.component';
import { provideRouter, RouterModule, Routes } from '@angular/router';
import { HeaderComponent } from './app/components/header/header.component';
import { UserProfileComponent } from './app/components/user-profile/user-profile.component';
import { AuthGuardFn } from './app/gruad/auth.gruad';
import { AdminComponent } from './app/components/admin/admin.component';
import { AdminGuardFn } from './app/gruad/admin.graud';
import { CommonModule } from '@angular/common';
import { OrderAdminComponent } from './app/components/admin/order/order.admin.component';
import { DetailOrderAdminComponent } from './app/components/admin/detail-order/detail.order.admin.component';
import { ProductAdminComponent } from './app/components/admin/product/product.admin.component';
import { CategoryAdminComponent } from './app/components/admin/category/category.admin.component';
import { InsertProductAdminComponent } from './app/components/admin/product/insert-product/insert.product.admin.component';
import { UpdateProductAdminComponent } from './app/components/admin/product/update-product/update.product.admin.component';
import { InsertCategoryAdminComponent } from './app/components/admin/category/insert-category/insert.category.admin.component';
import { UpdateCategoryAdminComponent } from './app/components/admin/category/update-category/update.category.admin.component';
import { StatisticalAdminComponent } from './app/components/admin/statistical/statistical.admin.component';
import { SizeAdminComponent } from './app/components/admin/size/size.admin.component';
import { InsertSizeAdminComponent } from './app/components/admin/size/insert-size/insert.size.admin.component';
import { UpdateSizeAdminComponent } from './app/components/admin/size/update-size/update.size.admin.component';
import { ColorAdminComponent } from './app/components/admin/color/color.admin.component';
import { InsertColorAdminComponent } from './app/components/admin/color/insert-color/insert.color.admin.component';
import { UpdateColorAdminComponent } from './app/components/admin/color/update-color/update.color.admin.component';

 // if(environment.product){
//     enableProdMode();
// }
//  bootstrapApplication(AppM)
//   .catch((err) => console.error(err));

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },  

  { path: 'register', component: RegisterComponent },
  { path: 'products/:id', component: ProductDetailComponent },  
  { path: 'orders', component: OrderComponent,canActivate:[AuthGuardFn] },
  { path: 'user-profile', component: UserProfileComponent, canActivate:[AuthGuardFn] },
  { path: 'order/detail/:id', component: OrderDetailComponent },

  //Admin   
  { 
    path: 'admin', 
    component: AdminComponent, 
    canActivate:[AdminGuardFn] ,
    children: [
      { path: 'orders', component: OrderAdminComponent },
      { path: 'orders/:id', component: DetailOrderAdminComponent },
      { path: 'products', component: ProductAdminComponent },
      { path: 'categories', component: CategoryAdminComponent },
      { path: 'sizes', component: SizeAdminComponent },
      { path: 'sizes/insert', component: InsertSizeAdminComponent },
      { path: 'sizes/update/:id', component: UpdateSizeAdminComponent },
      { path: 'colors', component: ColorAdminComponent },
      { path: 'colors/insert', component: InsertColorAdminComponent },
      { path: 'colors/update/:id', component: UpdateColorAdminComponent },
      { path: 'categories/insert', component: InsertCategoryAdminComponent },
      { path: 'categories/update/:id', component: UpdateCategoryAdminComponent },
      { path: 'products/insert', component: InsertProductAdminComponent },
      { path: 'products/update/:id', component: UpdateProductAdminComponent },
      { path: 'statistical', component: StatisticalAdminComponent },
      { path: 'banhang', component: BanhangComponent },
      // /admin/products/insert

    ]
  },      
];


bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    importProvidersFrom(HttpClientModule),
  ],
});