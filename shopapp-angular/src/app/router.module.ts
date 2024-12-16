import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { HomeComponent } from "./components/home/home.component";
import { LoginComponent } from "./components/login/login.component";
import { RegisterComponent } from "./components/register/register.component";
import { ProductDetailComponent } from "./components/product-detail/product-detail.component";
import { OrderDetailComponent } from "./components/order-confirm/order.detail.component";
import { OrderComponent } from "./components/order/order.component";
import { AdminComponent } from "./components/admin/admin.component";
import { AdminGuardFn } from "./gruad/admin.graud";
import { UserProfileComponent } from "./components/user-profile/user-profile.component";
import { AuthGuardFn } from "./gruad/auth.gruad";
import { CommonModule } from "@angular/common";

// export const routes: Routes = [
//     { path: '', component: HomeComponent },
//     { path: 'login', component: LoginComponent },  
//     { path: 'register', component: RegisterComponent },
//     { path: 'products/:id', component: ProductDetailComponent },  
//     { path: 'orders', component: OrderComponent },
//     // { path: 'user-profile', component: UserProfileComponent, canActivate:[AuthGuardFn] },
//     { path: 'orders/:id', component: OrderDetailComponent },
    
//   ];
//   @NgModule({
//     imports:[RouterModule.forRoot(routes)],
//     exports: [RouterModule]
//   })
//   export class AppRoutingModule{ }
// const routes: Routes = [
//     { path: '', component: HomeComponent },
//     { path: 'login', component: LoginComponent },  
//     { path: 'register', component: RegisterComponent },
//     { path: 'products/:id', component: ProductDetailComponent },  
//     { path: 'orders', component: OrderComponent,canActivate:[AuthGuardFn] },
//     { path: 'user-profile', component: UserProfileComponent, canActivate:[AuthGuardFn] },
//     { path: 'orders/:id', component: OrderDetailComponent },
//     //Admin   
//     { 
//       path: 'admin', 
//       component: AdminComponent, 
//       canActivate:[AdminGuardFn] 
//     },      
//   ];
  
//   @NgModule({
//     imports: [
//       RouterModule.forRoot(routes),
//       CommonModule
//     ],
//     exports: [RouterModule]
//   })

//   export class AppRoutingModule { }