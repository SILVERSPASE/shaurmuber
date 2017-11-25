import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import 'rxjs/add/operator/map';
import { User, Profile } from './user-profile.model';
import { Router } from '@angular/router';

@Injectable()
export class UserService {

  constructor(private http: HttpClient,
    private router: Router
    ) {}

  updateUser(user: User): Promise<any> {
    return this.http.put('/api/current_user/', user)
    .toPromise()
    .then(response => {
      return true;
    },
    err => {
      return false;
    });
  }

  deleteProfile(): Promise<any> {
    return this.http.patch('/api/current_user/', {deleted: true})
    .toPromise()
    .then(response => {
      console.log(response);
      return true;
    });
  }

  restoreProfile(): Promise<any> {
    return this.http.patch('/api/current_user/', {deleted: false})
    .toPromise()
    .then(response => {
      console.log(response);
      return true;
    });
  }


  changePassword(password_data: any){
    return this.http.put('/api/current_user/change_password/', password_data, {responseType: "text"})
    .map(response => {
      console.log(response);
    })
    .toPromise()
    .then(
      res => {
      return res;
    })
    .catch(
      err => {
      return err;
    });
}



  changeEmail(email_data: string) {
    return this.http.put('/api/current_user/change_email/', email_data)
    .toPromise()
    .then(response => {
      return response;
    });
  }

}
