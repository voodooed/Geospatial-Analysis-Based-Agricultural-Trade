import { Component, OnInit } from '@angular/core';
import { BuyerService } from '@app/_services/buyer.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthenticationService } from '@app/_services';

@Component({
  selector: 'app-buyers-list',
  templateUrl: './buyers-list.component.html',
  styleUrls: ['./buyers-list.component.css']
})
export class BuyersListComponent implements OnInit {

  cropName:string;
  private sub: any;
  cropList = []
  private buyerGeoLocation;
  latitude = 60.678418;
  longitude = 19.809007;
  locationChosen = false;
  markers: any = []
  buyerLat;
  buyerLon;

  constructor(
    private buyerService : BuyerService, 
    private router: Router,
    private route: ActivatedRoute,
    private authenticationService: AuthenticationService
  ) { }

  ngOnInit(): void {
    this.sub = this.route.params.subscribe(params => {
      this.cropName = params['crop']
      this.getSuppliersOfCrop(this.cropName)
    })
  }

  

  onChoseLocation(event) {
    this.latitude = event.coords.lat;
    this.longitude = event.coords.lng;
    this.locationChosen = true;
  }

  getSuppliersOfCrop(cropName: string){
    this.buyerService.getBuyerList(cropName).subscribe({
      next: data => {
        if(data.status){
          this.cropList = data.cropList;
          this.buyerGeoLocation = data.buyerGeolocation;
          this.buyerLat = this.buyerGeoLocation.lat;
          this.buyerLon = this.buyerGeoLocation.lon;
          this.getMarker()
        } else {
          alert('something went wrong!!')
        }
      },
      error: error => console.log(error)
    })
  }

  getMarker() {
    for(var crop of this.cropList) {
      var geoLocation = crop.farmerId.geoLocation;
      this.markers.push(geoLocation);
    }
    this.markers.push(this.buyerGeoLocation)
    console.log(this.markers)
  }

  addToCart(cropId: string, quantity: number) {
    this.buyerService.addToCart({cropId, quantity}).subscribe({
      next: data => {
        if(data.status) {
          alert('Successfully added to cart')
          var returnUrl = '/cart';
          this.router.navigate([returnUrl]);
        } else {
          alert('Something went Wrong !!!')
        }
      }
    })
  }

}
