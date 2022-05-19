import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { AuthenticationService } from '@app/_services';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  loading = false;
  submitted = false;
  error = '';
  lat ;
  lon ;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService) {
      if (this.authenticationService.currentUserValue) { 
        this.router.navigate(['/']);
    }
     }

  ngOnInit(): void {
    this.registerForm = this.formBuilder.group({
      userType: ['', Validators.required],
      email: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      contactNo: ['', Validators.required],
      aadharNumber: ['', Validators.required],
      panNo: ['', Validators.required],
      gender: ['', Validators.required],
      birthDate: ['', Validators.required],
      address: ['', Validators.required],
      password: ['', Validators.required],
      confPass: ['', Validators.required],
      geo: this.formBuilder.group({
        lat: ['', Validators.required],
        lon: ['', Validators.required]
      })
    });
  }

  get f() { return this.registerForm.controls; }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.registerForm.invalid) {
        return;
    }

    this.loading = true;
    this.authenticationService.register(this.registerForm.value)
        .pipe(first())
        .subscribe({
            next: (data) => {
              var returnUrl = '/'
                if(data.status) {
                  if(data.userDetail.accountType == "buyer") {
                    returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
                    this.router.navigate([returnUrl]);
                  } else if(data.userDetail.accountType == "farmer") {
                    returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/farmerDashboard';
                    this.router.navigate([returnUrl]);
                  }
                } else {
                  this.error = data.message;
                  this.loading = false;
                }
                
            },
            error: error => {
                this.error = error;
                this.loading = false;
            }
        });
  }
  getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        if (position) {
          console.log("Latitude: " + position.coords.latitude +
            "Longitude: " + position.coords.longitude);
          this.lat = position.coords.latitude;
          this.lon = position.coords.longitude;
          console.log(this.lat);
          console.log(this.lat);
          this.registerForm.get(['geo', 'lat']).setValue(this.lat)
          this.registerForm.get(['geo', 'lon']).setValue(this.lon)
        }
      },
        (error) => console.log(error));
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  }

}
