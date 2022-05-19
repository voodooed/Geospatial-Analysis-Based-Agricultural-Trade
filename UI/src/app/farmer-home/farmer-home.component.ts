import { Component, OnInit } from '@angular/core';
import { FarmerService } from '@app/_services/farmer.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthenticationService } from '@app/_services';
import { Crop } from '../_models/crop';

@Component({
  selector: 'app-farmer-home',
  templateUrl: './farmer-home.component.html',
  styleUrls: ['./farmer-home.component.css']
})
export class FarmerHomeComponent implements OnInit {

   cropList : Array<Crop> = []


  constructor(
    private farmerService : FarmerService, 
    private router: Router,
    private route: ActivatedRoute,
    private authenticationService: AuthenticationService) { 
     
    }

  ngOnInit(): void {

    this.getCrops()

  }

  getCrops() {

    this.farmerService.getAllCrops(null).subscribe({
      next: data => {
        if(data.status) {
          this.cropList =  data.crop;
          console.log(this.cropList)
        }
      },
      error: error => console.log(error)
    })

  }

  deleteCrop(id: string) {
    console.log(id)
    this.farmerService.deleteCrop(id).subscribe({
      next: data => {
        if(data.status){
          alert('Crop delete successfully')
          this.getCrops();
        } else {
          alert('Something went wrong!!')
        }
      },
      error: error => console.log(error)
    })
  }

}
