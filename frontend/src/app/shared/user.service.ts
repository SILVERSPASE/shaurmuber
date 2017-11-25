import { User } from './user';

import "rxjs/add/operator/catch";
import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";



@Injectable()
export class UserRegistrationService{

  constructor (private http: HttpClient) { }

  // send POST request to server, add new user to database
  public registerUser(user: User){
    return this.http.post("/api/auth/registration/", user, {responseType: "text" })
      .subscribe(
      res => {console.log(res);
      },

    );
  }
}
