import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { FarmerService } from '@app/_services/farmer.service';

@Component({
  selector: 'app-crop',
  templateUrl: './crop.component.html',
  styleUrls: ['./crop.component.less']
})
export class CropComponent implements OnInit {

  addCropForm: FormGroup;
  loading = false;
  submitted = false;
  error = '';

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private farmerService: FarmerService
  ) { }

  ngOnInit(): void {
    this.addCropForm = this.formBuilder.group({
      cropName: ['', Validators.required],
      price: ['', Validators.required],
      quality: ['', Validators.required],
      quantity: ['', Validators.required],
      imageUrl: ['', Validators.required],
      description: ['', Validators.required],
    });
  }

  get f() { return this.addCropForm.controls; }


  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.addCropForm.invalid) {
        return;
    }

    this.loading = true;
    this.farmerService.addCrops(this.addCropForm.value)
    .subscribe({
        next: (data) => {
            if(data.status){
                
              const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/farmerDashboard';
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
