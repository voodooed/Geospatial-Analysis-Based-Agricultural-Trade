import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BuyersListComponent } from './buyers-list/buyers-list.component';
import { CartComponent } from './cart/cart.component';
import { CropComponent } from './crop/crop.component';
import { FarmerHomeComponent } from './farmer-home/farmer-home.component';

import { HomeComponent } from './home';
import { LoginComponent } from './login';
import { MyOrdersComponent } from './orders/orders.component';
import { RegisterComponent } from './register/register.component';
import { UpdateCropComponent } from './update-crop/update-crop.component';
import { AuthGuard } from './_helpers';
import { BuyerGuard } from './_helpers/buyer.guard';
import { FarmerGuard } from './_helpers/farmer.guard';
import { HomeGuard } from './_helpers/home.guard';


const routes: Routes = [
    { path: '', component: HomeComponent, canActivate: [AuthGuard, HomeGuard] },
    { path: 'farmerDashboard', component: FarmerHomeComponent, canActivate: [AuthGuard, FarmerGuard ] },
    { path: 'addCrop', component: CropComponent, canActivate: [AuthGuard, FarmerGuard] },
    { path: 'updateCrop/:_id', component: UpdateCropComponent, canActivate: [AuthGuard, FarmerGuard] },
    { path: 'buyerList/:crop', component: BuyersListComponent, canActivate: [AuthGuard, BuyerGuard] },
    { path: 'cart', component: CartComponent, canActivate: [AuthGuard, BuyerGuard] },
    { path: 'myOrder', component: MyOrdersComponent, canActivate: [AuthGuard] },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },

    // otherwise redirect to home
    { path: '**', redirectTo: '' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
