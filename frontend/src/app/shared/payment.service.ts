import {Injectable, Input} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs/Observable";
import {Response} from "@angular/http";
import "rxjs/add/operator/map";


@Injectable()
export class PaymentService {
  private dataUrl = '/api/payments/payout/';
  constructor(private http: HttpClient) { }

  getPayment(orderID): Observable<any> {
    return this.http.post(this.dataUrl, {"order": orderID}).map((payment: Response) => payment);

  }

}
