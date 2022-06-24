import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '@environments/environment';
import { Lead } from '@app/_models';

@Injectable({ providedIn: 'root' })
export class LeadService {
    private leadSubject: BehaviorSubject<Lead>;
    public lead: Observable<Lead>;

    constructor(
        private router: Router,
        private http: HttpClient
    ) {
        this.leadSubject = new BehaviorSubject<Lead>(JSON.parse(localStorage.getItem('lead')));
        this.lead = this.leadSubject.asObservable();
    }

    public get leadValue(): Lead {
        return this.leadSubject.value;
    }

    // login(username, password) {
    //     return this.http.post<User>(`${environment.apiUrl}/leads/authenticate`, { username, password })
    //         .pipe(map(user => {
    //             // store user details and jwt token in local storage to keep user logged in between page refreshes
    //             localStorage.setItem('user', JSON.stringify(user));
    //             this.userSubject.next(user);
    //             return user;
    //         }));
    // }

    // logout() {
    //     // remove user from local storage and set current user to null
    //     localStorage.removeItem('user');
    //     this.userSubject.next(null);
    //     this.router.navigate(['/account/login']);
    // }

    create(lead: Lead) {
        return this.http.post(`${environment.apiUrl}/leads/create`, lead);
    }

    getAll() {
        return this.http.get<Lead[]>(`${environment.apiUrl}/leads`);
    }

    getAllByStatus(status: string) {
        return this.http.get<Lead[]>(`${environment.apiUrl}/leads/${status}`);
    }

    getById(id: string) {
        return this.http.get<Lead>(`${environment.apiUrl}/leads/${id}`);
    }

    update(id, params) {
        return this.http.put(`${environment.apiUrl}/leads/${id}`, params)
            .pipe(map(x => {
                // update stored lead if the logged in lead updated their own record
                if (id == this.leadValue.id) {
                    // update local storage
                    const lead = { ...this.leadValue, ...params };
                    localStorage.setItem('lead', JSON.stringify(lead));

                    // publish updated user to subscribers
                    this.leadSubject.next(lead);
                }
                return x;
            }));
    }

    acceptLead(id) {
        return this.http.put(`${environment.apiUrl}/leads/${id}/accept`, null)
            .pipe(map(x => {
                // update stored lead if the logged in lead updated their own record
                if (id == this.leadValue.id) {
                    // update local storage
                    const lead = { ...this.leadValue };
                    localStorage.setItem('lead', JSON.stringify(lead));

                    // publish updated user to subscribers
                    this.leadSubject.next(lead);
                }
                return x;
            }));
    }

    declineLead(id) {
        return this.http.put(`${environment.apiUrl}/leads/${id}/decline`, null)
            .pipe(map(x => {
                // update stored lead if the logged in lead updated their own record
                if (id == this.leadValue.id) {
                    // update local storage
                    const lead = { ...this.leadValue };
                    localStorage.setItem('lead', JSON.stringify(lead));

                    // publish updated user to subscribers
                    this.leadSubject.next(lead);
                }
                return x;
            }));
    }

    delete(id: string) {
        return this.http.delete(`${environment.apiUrl}/leads/${id}`)
            .pipe(map(x => {
                // auto logout if the logged in lead deleted their own record
                return x;
            }));
    }
}