import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import { City } from '../model/city';
import {forEach} from "@angular/router/src/utils/collection";

@Injectable()
export class CityService {

  private apiUrl = 'api/common/cities/';

  constructor(private http: HttpClient) { }

  getCity(city_id: any): Promise<any> {
    return this.http.get(this.apiUrl + '?city_id=' + city_id)
      .toPromise()
      .then((res: City) => {
        return res;
      });
  }

  getCities(): Observable<City[]> {
    return this.http
      .get(this.apiUrl)
      .map((response: Response) => response)
      .catch((error: any) => Observable.throw(error.error || 'Server error'));
  }

  getCitiesByRegion(regionName: string): Observable<City[]> {
    return this.http
      .get(this.apiUrl + '?region_name=' + regionName)
      .map((response: Response) => response)
      .catch((error: any) => Observable.throw(error.error || 'Server error'));
  }

}
