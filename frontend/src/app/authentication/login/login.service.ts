import {Inject, Injectable} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie';
import { CurrentUserService } from '../current-user.service';

@Injectable()
export class LoginService {

  constructor(
    private http: HttpClient,
    private cookieService: CookieService,
    private router: Router,
    private currentUserService: CurrentUserService
  ) {}

  loginUrl = '/api/auth/login/';
  
  errors = false;

  login(email, password) {
    this.http
      .post(this.loginUrl,
        {
          'email': email,
          'password': password,
        }, 
       )
      .toPromise()
      .then(response => {
           this.currentUserService.setUserDataAndPermisions().then(response => {
             location.href = '/'
           });
        },
        errData => {
          console.log(errData);
          this.errors = true;
        }
      );
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
