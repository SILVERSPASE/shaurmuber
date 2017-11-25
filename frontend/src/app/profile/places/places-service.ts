import {Injectable} from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import { Place } from "./place";

@Injectable()
export class PlacesService {

  constructor(private httpClient: HttpClient) { }

  getUserPlaces(uuid: string): Promise<Place[]> {
    const PlacesUrl = '/api/users/' + uuid + '/profile/places/';
    return this.httpClient
      .get(PlacesUrl)
      .toPromise()
      .then((response: Place[]) => {
        return response;
      })
      .catch(this.handleError);
  }


  createPlace(uuid: string, type: string, user: number, title: string, coord: any): Promise<any> {
     let createPlaceUrl = '/api/users/' + uuid + '/profile/places/';
     const headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');
     return this.httpClient
       .post(createPlaceUrl, JSON.stringify({
         type: type,
         user: user,
         title: title,
         coordinates:coord,
       }), {headers: headers})
       .toPromise()
       .then(res => {return res})
       .catch(this.handleError);
  }

  delPlace(uuid: string, place: Place) {
    let delPlaceUrl = '/api/users/' + uuid + '/profile/place/' + place['id'] +'/';
    const headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');
    return this.httpClient
      .delete(delPlaceUrl)
      .toPromise()
      .then(res => {return res})
      .catch(this.handleError);
  }

  patchPlace(uuid: string, place:Place) {
    let patchPlaceUrl = '/api/users/' + uuid + '/profile/place/' + place['id'] +'/';
    const headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');
    return this.httpClient
      .patch(patchPlaceUrl, JSON.stringify(place), {headers:headers})
      .toPromise()
      .then(res => {return res})
      .catch(this.handleError);
  }


  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }

}
