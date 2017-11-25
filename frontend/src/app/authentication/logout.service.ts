import {Inject, Injectable} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie';
import { CurrentUserService } from './current-user.service';

@Injectable()
export class LogoutService {

  constructor(
    private http: HttpClient,
    private cookieService: CookieService,
    private router: Router,
    private currentUserService: CurrentUserService
  ) {}

  logoutUrl = '/api/auth/logout/';
  
  errors = false;

  logout() {
    this.http
      .post(this.logoutUrl, {})
      .toPromise()
      .then(response => {
        console.log("success");
        location.href = '/'
      })
      .catch(response => {
        console.log("huieta");
        location.href = '/'
      });
  }

  // changePassword(new_password1, new_password2, old_password) {
  //   this.http
  //     .post(this.changePasswordUrl,
  //       {
  //         'new_password1': new_password1,
  //         'new_password2': new_password2,
  //         'old_password': old_password
  //       })
  //     .subscribe(
  //       successData => {
  //             console.log(successData);
  //             alert('Password was changed');
  //             this.router.navigate(['/profile']);
  //       },
  //       errData => alert('Error of changing password')
  //     );
  // }

  // resetPassword() {
  //   this.http
  //     .post(this.resetPasswordUrl,
  //       {
  //         'email': 'west_aviator@ex.ua',
  //       })
  //     .subscribe(
  //       successData => {
  //         console.log(successData);
  //         alert(successData);
  //         this.router.navigate(['/profile']);
  //       },
  //       errData => {
  //         alert('Error');
  //         console.log(errData);
  //       }
  //     );
  // }


}
