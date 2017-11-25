import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import "rxjs/add/operator/map";
import "rxjs/add/operator/toPromise"

@Injectable()
export class OrderMapService {

    constructor(private http: HttpClient) {}

    getAllOrders() {

      return this.http
        .get("http://127.0.0.1/api/orders/")
        .map(res => res)
        .toPromise();
    }
}
