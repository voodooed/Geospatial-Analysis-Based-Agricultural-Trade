import { Component, OnInit } from '@angular/core';
import { BuyerService } from '@app/_services/buyer.service';
import { FarmerService } from '@app/_services/farmer.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthenticationService } from '@app/_services';
import { User } from '@app/_models';

@Component({
  selector: 'app-my-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.less']
})
export class MyOrdersComponent implements OnInit {

  currentUser;
  orderList;
  noOrder:boolean = true;
  isFarmer: boolean = true;

  constructor(
    private buyerService : BuyerService, 
    private router: Router,
    private route: ActivatedRoute,
    private authenticationService: AuthenticationService,
    private farmerService: FarmerService
  ) { }

  ngOnInit(): void {
    this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
    console.log(this.currentUser)
    if(this.currentUser.userDetail.accountType == 'buyer') {
      this.isFarmer = false;
    }
    this.myOrders()
  }

  myOrders(){
    if(!this.isFarmer) {
      this.buyerService.myOrders().subscribe({
        next: data => {
          console.log(data)
          if(data.status) {
            this.orderList = data.orderList;
            if(data.length > 0) {
              this.noOrder = false
            }
          } else {
            alert('something went wrong !!!')
          }
        },
        error: error => {
          console.log(error)
        }
      })
    } else if(this.isFarmer) {
      this.farmerService.myOrders().subscribe({
        next: data => {
          console.log(data)
          if(data.status) {
            this.orderList = data.orderList;
            if(data.length > 0) {
              this.noOrder = false
            }
          } else {
            alert('something went wrong !!!')
          }
        },
        error: error => {
          console.log(error)
        }
      })
    }
  }

}
