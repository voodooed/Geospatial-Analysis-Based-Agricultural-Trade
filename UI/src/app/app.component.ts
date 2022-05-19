import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthenticationService } from './_services';
import { User } from './_models';

@Component({ selector: 'app', templateUrl: 'app.component.html' })
export class AppComponent implements OnInit{
    currentUser;
    cartOption: boolean = true;
    constructor(
        private router: Router,
        private authenticationService: AuthenticationService
    ) {
        this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
    }
    ngOnInit(): void {
        if(this.currentUser.userDetail.accountType == 'buyer') {
            this.cartOption = true;
        } else {
            this.cartOption = false;
        }
    }

    

    logout() {

        this.authenticationService.logout().subscribe({
            next: data => {
                if(data.message == 'Logout Succesfull') {
                    this.router.navigate(['/login']);
                }
            },
            error: error => console.log(error)
        });
    }
}