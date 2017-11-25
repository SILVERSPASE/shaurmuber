import { Injectable } from '@angular/core';
import { HttpClient,  } from '@angular/common/http';
import { Router } from '@angular/router';

import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/toPromise';
import {Observable} from 'rxjs';

import { User, Profile } from '../profile/user-profile.model';


@Injectable()
export class CurrentUserService {
  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  getCurrentUserUrl = '/api/current_user/';

  setUserDataAndPermisions(): Promise<any> {
    return this.http.get(this.getCurrentUserUrl)
         .toPromise()
         .then(response => {
           localStorage.setItem('currentUser', JSON.stringify(response));
           localStorage.setItem('isAuthorized', JSON.stringify(true));

           if(response['deleted']){
               this.router.navigateByUrl("/deleted_profile");
           };
           return true
         })
         .catch(response => {
           localStorage.setItem('currentUser', JSON.stringify(null));
           localStorage.setItem('isAuthorized', JSON.stringify(false));
           return true
         });
  }

}
