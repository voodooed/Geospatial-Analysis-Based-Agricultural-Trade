import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '@environments/environment';
import { User } from '@app/_models';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
    private currentUserSubject: BehaviorSubject<User>;
    public currentUser: Observable<User>;

    constructor(private http: HttpClient) {
        this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
        this.currentUser = this.currentUserSubject.asObservable();
    }

    public get currentUserValue(): User {
        return this.currentUserSubject.value;
    }

    register(registerData) {
        return this.http.post<any>(`${environment.apiUrl}/api/auth/register`, { ...registerData})
        .pipe(map(data => {
            // store user details and jwt token in local storage to keep user logged in between page refreshes
            if (data.status) {
                localStorage.setItem('currentUser', JSON.stringify(data));
                this.currentUserSubject.next(data);
            }
            return data;
        
            
        }));
    }

    login(email: string, password: string, userType: string) {
        return this.http.post<any>(`${environment.apiUrl}/api/auth/login`, { email, password , userType})
            .pipe(map(user => {
                // store user details and jwt token in local storage to keep user logged in between page refreshes
                if (user.status) {
                    localStorage.setItem('currentUser', JSON.stringify(user));
                    this.currentUserSubject.next(user);
                }
                return user;
            
                
            }));
    }

    logout() {
        // remove user from local storage to log user out
        return this.http.get<any>(`${environment.apiUrl}/api/auth/logout`).pipe(map(user => {
            if(user.message == 'Logout Succesfull') {
                localStorage.removeItem('currentUser');
                this.currentUserSubject.next(null);
            }
            return user;
        }))
        
    }
}