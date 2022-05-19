import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { AuthenticationService } from '@app/_services';

@Component({ templateUrl: 'login.component.html' , styleUrls: ['./login.component.css']})
export class LoginComponent implements OnInit {
    loginForm: FormGroup;
    loading = false;
    farmerLoading = false;
    submitted = false;
    error = '';

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private authenticationService: AuthenticationService
    ) { 
        // redirect to home if already logged in
        if (this.authenticationService.currentUserValue) { 
            this.router.navigate(['/']);
        }
    }

    ngOnInit() {
        this.loginForm = this.formBuilder.group({
            username: ['', Validators.required],
            password: ['', Validators.required]
        });
    }

    // convenience getter for easy access to form fields
    get f() { return this.loginForm.controls; }

    onSubmit(farmer) {
        this.submitted = true;

        // stop here if form is invalid
        if (this.loginForm.invalid) {
            return;
        }

        if(farmer) this.farmerLoading = true;
        else this.loading = true;

        this.authenticationService.login(this.f.username.value, this.f.password.value, farmer ? "farmer": "buyer")
            .pipe(first())
            .subscribe({
                next: (data) => {
                    if(data.status){
                        var returnUrl = '/'
                        if(data.userDetail.accountType == "buyer") {
                            returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
                            this.router.navigate([returnUrl]);
                          } else if(data.userDetail.accountType == "farmer") {
                            returnUrl = '/farmerDashboard';
                            this.router.navigate([returnUrl]);
                          }
                    } else {
                        this.error = data.message;
                        this.loading = false;
                        this.farmerLoading = false;
                    }
                   
                },
                error: error => {
                    this.error = error;
                    this.loading = false;
                    this.farmerLoading = false;
                }
            });
    }
}
