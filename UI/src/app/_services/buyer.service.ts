import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class BuyerService {

  constructor(private http: HttpClient) { }

  getCropTypes(){
    return this.http.get<any>(`${environment.apiUrl}/api/buyer/cropTypes`)
        .pipe(map(data => {
            // store user details and jwt token in local storage to keep user logged in between page refreshes
            return data; 
        }));
  }

  getBuyerList(cropName: string) {
    return this.http.post<any>(`${environment.apiUrl}/api/buyer/getCropBuyers`, {cropName})
        .pipe(map(data => {
            // store user details and jwt token in local storage to keep user logged in between page refreshes
            return data; 
        }));
  }

  removeCartItems(cropDetail) {
    return this.http.post<any>(`${environment.apiUrl}/api/buyer/removeCartItems`, {...cropDetail})
        .pipe(map(data => {
            // store user details and jwt token in local storage to keep user logged in between page refreshes
            return data; 
        }));
  }

  getCartItems() {
    return this.http.post<any>(`${environment.apiUrl}/api/buyer/getCartItems`,{})
        .pipe(map(data => {
            // store user details and jwt token in local storage to keep user logged in between page refreshes
            return data; 
        }));
  }

  placeOrder() {
    return this.http.post<any>(`${environment.apiUrl}/api/buyer/placeOrder`, {})
        .pipe(map(data => {
            // store user details and jwt token in local storage to keep user logged in between page refreshes
            return data; 
        }));
  }

  myOrders() {
    return this.http.post<any>(`${environment.apiUrl}/api/buyer/myOrders`, {})
        .pipe(map(data => {
            // store user details and jwt token in local storage to keep user logged in between page refreshes
            return data; 
        }));
  }

  addToCart(cropDetail) {
    return this.http.post<any>(`${environment.apiUrl}/api/buyer/addItemToCart`, {...cropDetail})
        .pipe(map(data => {
            // store user details and jwt token in local storage to keep user logged in between page refreshes
            return data; 
        }));
  }

}
