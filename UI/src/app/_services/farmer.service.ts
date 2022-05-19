import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FarmerService {

  constructor(private http: HttpClient) { }

  getAllCrops(cropId){
    return this.http.post<any>(`${environment.apiUrl}/api/farmer/getCrop`, {cropId})
        .pipe(map(data => {
            // store user details and jwt token in local storage to keep user logged in between page refreshes
            return data; 
        }));
  }

  addCrops(cropDetail) {
    return this.http.post<any>(`${environment.apiUrl}/api/farmer/addCrops`, {...cropDetail})
    .pipe(map(data => {
        // store user details and jwt token in local storage to keep user logged in between page refreshes
        return data; 
    }));
  }

  updateCrop(cropDetail) {
    return this.http.post<any>(`${environment.apiUrl}/api/farmer/updateCrop`, {...cropDetail})
      .pipe(map(data => {
        return data;
      }))
  }

  deleteCrop(cropId) {
    return this.http.post<any>(`${environment.apiUrl}/api/farmer/deleteCrop`, {cropId})
      .pipe(map(data => {
        return data;
      }))
  }

  myOrders() {
    return this.http.post<any>(`${environment.apiUrl}/api/farmer/myOrders`, {})
        .pipe(map(data => {
            // store user details and jwt token in local storage to keep user logged in between page refreshes
            return data; 
        }));
  }

}
