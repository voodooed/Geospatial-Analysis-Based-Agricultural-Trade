import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { AuthenticationService } from '../_services';

@Injectable({ providedIn: 'root' })
export class HomeGuard implements CanActivate {
    constructor(
        private router: Router,
        private authenticationService: AuthenticationService
    ) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const currentUser = this.authenticationService.currentUserValue;
        if (currentUser) {
            if(currentUser.userDetail.accountType == 'farmer') {
                this.router.navigate(['/farmerDashboard']);
                
            }
            return true
        }

        // not logged in so redirect to login page with the return url
        
        localStorage.removeItem('currentUser');
        this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
        return false;
    }
}