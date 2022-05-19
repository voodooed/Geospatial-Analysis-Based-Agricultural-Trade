import { Component, OnInit } from '@angular/core';
import { BuyerService } from '@app/_services/buyer.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthenticationService } from '@app/_services';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.less']
})
export class CartComponent implements OnInit {

  cartItems;
  subTotal: number = 0;
  quantityCount:number;
  emptyCart: boolean = true;

  constructor(
    private buyerService : BuyerService, 
    private router: Router,
    private route: ActivatedRoute,
    private authenticationService: AuthenticationService
  ) { }

  ngOnInit(): void {
    this.myCart()
  }

  myCart() {
    this.buyerService.getCartItems().subscribe({
      next: data => {
        console.log(data)
        this.subTotal = data.cart.subTotal;
        
        this.cartItems = data.cart.items;
        if(this.cartItems.length > 0) {
          this.emptyCart = false
        }
        console.log(this.cartItems)
      },
      error: error => console.log(error)
    })
  }

  addToCart(cropId: string, quantity: number){
    this.buyerService.addToCart({cropId, quantity}).subscribe({
      next: data => {
        if(data.status) {
          if(quantity == -1) {
            alert('Successfully removed from cart')
          } else {
            alert('Successfully added to cart')
          }
          this.myCart()
        } else {
          alert('Something went Wrong !!!')
        }
      }
    })
  }
  

  placeOrder() {
    this.buyerService.placeOrder().subscribe({
      next: data => {
        if(data.status) {
          alert('Order placed successfully!!!')
          var returnUrl = '/';
          this.router.navigate([returnUrl]);
        } else {
          alert('Something went Wrong !!!')
        }
      }
    })
  }

 

}
