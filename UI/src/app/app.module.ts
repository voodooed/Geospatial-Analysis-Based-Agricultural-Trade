import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

// used to create fake backend

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { JwtInterceptor, ErrorInterceptor } from './_helpers';
import { HomeComponent } from './home';
import { LoginComponent } from './login';
import { RegisterComponent } from './register/register.component';
import { FarmerHomeComponent } from './farmer-home/farmer-home.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CropComponent } from './crop/crop.component';
import { UpdateCropComponent } from './update-crop/update-crop.component';
import { BuyersListComponent } from './buyers-list/buyers-list.component';
import { AgmCoreModule } from '@agm/core';
import { CartComponent } from './cart/cart.component';;
import { MyOrdersComponent } from './orders/orders.component'
@NgModule({
    imports: [
        BrowserModule,
        ReactiveFormsModule,
        HttpClientModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        AgmCoreModule.forRoot({
            apiKey: 'AIzaSyD6RHWui2GK6WEF3NyMo-NEedRvugUuCqQ'
        })
    ],
    declarations: [
        AppComponent,
        HomeComponent,
        LoginComponent,
        RegisterComponent,
        FarmerHomeComponent,
        CropComponent,
        UpdateCropComponent,
        BuyersListComponent ,
        CartComponent,
        MyOrdersComponent
        
    ],
        
    providers: [
        { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },

        // provider used to create fake backend
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }