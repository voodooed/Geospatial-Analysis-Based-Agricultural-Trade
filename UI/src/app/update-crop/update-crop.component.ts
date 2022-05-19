import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { FarmerService } from '@app/_services/farmer.service';

@Component({
  selector: 'app-update-crop',
  templateUrl: './update-crop.component.html',
  styleUrls: ['./update-crop.component.less']
})
export class UpdateCropComponent implements OnInit, OnDestroy {

  updateCropForm: FormGroup;
  loading = false;
  submitted = false;
  error = '';
  _id: string;
  private sub: any;
  private cropData ;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private farmerService: FarmerService
  ) { }

  ngOnInit(): void {
    this.updateCropForm = this.formBuilder.group({
      cropName: ['', Validators.required],
      price: ['', Validators.required],
      quality: ['', Validators.required],
      quantity: ['', Validators.required],
      imageUrl: ['', Validators.required],
      description: ['', Validators.required],
    });

    this.sub = this.route.params.subscribe(params => {
      this._id = params['_id']
      this.loadCropDetail(this._id)
    })

  }

  loadCropDetail(id) {
    console.log(id)
    this.farmerService.getAllCrops(id).subscribe({
      next: data => {
        if(data.status) {
          this.cropData =  data.crop[0];
          console.log(this.cropData)
          this.updateCropForm.setValue({
            cropName: this.cropData.cropName,
            price: this.cropData.price,
            quality: this.cropData.quality,
            quantity: this.cropData.quantity,
            imageUrl: this.cropData.imageUrl || '',
            description: this.cropData.description || '',

          })
        }
      },
      error: error => console.log(error)
    })
  }

  ngOnDestroy() {
    this.sub.unsubscribe()
  }

  get f() { return this.updateCropForm.controls; }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.updateCropForm.invalid) {
        return;
    }

    this.loading = true;
    this.farmerService.updateCrop({...this.updateCropForm.value, cropId: this._id})
    .subscribe({
        next: (data) => {
            if(data.status){
                
              const returnUrl = '/farmerDashboard';
              this.router.navigate([returnUrl]);
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

}
