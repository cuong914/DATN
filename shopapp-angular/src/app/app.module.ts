import {NgModule} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HomeComponent } from './components/home/home.component';
import { FooterComponent } from './components/footer/footer.component';
import { OrderComponent } from './components/order/order.component';
import { HeaderComponent } from './components/header/header.component';
import { LoginComponent } from './components/login/login.component';

import { ProductDetailComponent } from './components/product-detail/product-detail.component';
import { RegisterComponent } from './components/register/register.component';
import { FormsModule, NgForm, ReactiveFormsModule } from '@angular/forms';
import { NgIf } from '@angular/common'; 
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { TokenInterceptor } from './Interceptors/token.interceptors';
import { OrderDetailComponent } from './components/order-confirm/order.detail.component';
// import { AppRoutingModule } from './router.module';
import { AppComponent } from './app/app.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { RouterModule } from '@angular/router';
import { OrderAdminComponent } from './components/admin/order/order.admin.component';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// import { AppRoutingModule } from './router.module';
// import { AdminModule } from './components/admin/admin.moudles';

@NgModule( {
    declarations : [
        
        // HomeComponent,
        
   
    ],
    imports: [
        OrderAdminComponent,
        RouterModule,
        BrowserModule,
        BrowserAnimationsModule, // Cần thiết cho Toastr
        FooterComponent,
        OrderComponent,
        HeaderComponent,
        LoginComponent,
        OrderDetailComponent,
        ProductDetailComponent,
        RegisterComponent,
        
        FormsModule,
        NgIf,
        CommonModule,
        ReactiveFormsModule,
        HttpClientModule,
        // AppRoutingModule,
        AppComponent,
        UserProfileComponent,
        BrowserAnimationsModule ,
        ToastrModule.forRoot(),
        ToastrModule.forRoot({
            positionClass: 'toast-top-right', // vị trí hiển thị (có thể thay đổi)
            timeOut: 3000, // thời gian hiển thị (ms)
          }),
        // AppRoutingModule,
        // AdminModule,
        
        

        
    ],
    providers: [
       {
        provide:HTTP_INTERCEPTORS,
        useClass: TokenInterceptor,
        multi: true,
       }

    ],
     bootstrap: [
        
     ]

} )
 export class AppModule{ }