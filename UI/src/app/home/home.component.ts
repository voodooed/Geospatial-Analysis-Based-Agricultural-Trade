import { Component } from '@angular/core';
import { BuyerService } from '@app/_services/buyer.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthenticationService } from '@app/_services';
@Component({ templateUrl: 'home.component.html' })
export class HomeComponent {
    loading = false;
    cropTypes;
    cropCount: number;
    constructor(
        private buyerService : BuyerService, 
        private router: Router,
        private route: ActivatedRoute,
        private authenticationService: AuthenticationService
    ) { }

    ngOnInit() {
        this.getCropTypes();
    }

    getCropTypes() {
        this.buyerService.getCropTypes().subscribe({
            next: data => {
                if(data.status) {
                    this.cropCount = data.length
                    this.cropTypes = data.crops;
                } else {
                    alert('Something went wrong!!!!')
                }
            }
        })
    }
}