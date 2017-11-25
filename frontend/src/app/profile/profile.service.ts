import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import 'rxjs/add/operator/map';
import {User, PublicUser, Profile} from './user-profile.model';

@Injectable()
export class ProfileService {

  constructor(private http: HttpClient) {
  }

  getUserProfile(uuid: string): Promise<any> {
    return this.http.get('/api/users/' + uuid + '/profile')
      .toPromise()
      .then((res: Profile) => {
        return res;
      });
  }

  updateUserProfile(uuid: string, profile: Profile): Promise<any> {
    return this.http.put('/api/users/' + uuid + '/profile/', profile)
      .toPromise()
      .then(response => {
        return true;
      },
      err => {
        return false;
      });
  }

  uploadImage(uuid: string, formData: any): Promise<any> {
    return this.http.put('/api/users/' + uuid + '/profile/', formData)
      .toPromise()
      .then(response => {
        return true;
      },
      err => {
        return false;
      });
  }

  getNotifications(uuid: string): Promise<any> {
    return this.http.get('/api/users/' + uuid + '/profile/notifications/')
      .toPromise()
      .then(response => {
        return response;
      })
  }

  updateNotifications(uuid: string, notifications: any): Promise<any> {
    return this.http.put('/api/users/' + uuid + '/profile/notifications/', notifications)
      .toPromise()
      .then(response => {
        return true;
      },
      err => {
        return false;
      });
  }

  getPrivacySettings(uuid: string): Promise<any> {
    return this.http.get('/api/users/' + uuid + '/profile/privacy_settings/')
      .toPromise()
      .then(response => {
        return response;
      })
  }

  updatePrivacySettings(uuid: string, privacy_settings: any): Promise<any> {
    return this.http.put('/api/users/' + uuid + '/profile/privacy_settings/', privacy_settings)
      .toPromise()
      .then(response => {
        return true;
      },
      err => {
        return false;
      });
  }

  getUser(uuid: string): Promise<any> {
    return this.http.get('/api/users/' + uuid)
      .toPromise()
      .then((res: User) => {
        return res;
      });
  }

  getPublicUser(uuid: string): Promise<any> {
    return this.http.get('/api/users/' + uuid)
      .toPromise()
      .then((res: PublicUser) => {
        return res;
      });
  }

  updateUserRating(uuid: string, profile: Profile): Promise<any> {
    return this.http.patch('/api/users/' + uuid + '/profile/rating/', profile)
      .toPromise()
      .then(response => {
        return response;
      });
  }

}
