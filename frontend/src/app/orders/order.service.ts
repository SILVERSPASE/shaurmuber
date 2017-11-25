import {Injectable} from '@angular/core';
import {Order} from './order.model';
import {Response} from '@angular/http';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';


@Injectable()
export class OrdersService {

  constructor(private http: HttpClient) {
  };


  createOrder(order: Order) {
    return this.http.post('/api/orders/', order, {responseType: 'text'})
      .subscribe(
        res => {
          console.log(res)
        },
      );
  }

  getOneOrder(orderId): Observable<Order> {
    let url = '/api/orders/' + orderId;
    return this.http.get(url)
      .map((response: Response) => response)
      .catch((error: any) => Observable.throw(error.error || 'Err'));
  };

  getOrders(listType: string): Observable<Order[]> {
    let url;
    if (listType == 'all') {
      url = '/api/orders/public/';
    } else {
      url = '/api/orders/?type=' + listType;
    }
    return this.http.get(url)
      .map((response: Response) => response)
      .catch((error: any) => Observable.throw(error.error || 'Err'));
  }

  fromDraftToPublic(orderId) {
      let body = {
      'status': 'public',
    };
    return this.http.patch('/api/orders/' + orderId + '/', body)
      .map((response: Response) => response)
      .catch((error: any) => Observable.throw(error.error || 'Err'));
  }

  takeOrder(orderId, userId) {
    let body = {
      'order': orderId,
      'candidate': userId,
    };
    return this.http.post('/api/orders/' + orderId + '/candidates/', body)
      .map((response: Response) => response)
      .catch((error: any) => Observable.throw(error.error || 'Err'));
  }

  getCandidates(orderId) {
    let candidatesUrl = 'api/orders/' + orderId + '/candidates/'
    return this.http.get(candidatesUrl)
      .map((response: Response) => response)
      .catch((error: any) => Observable.throw(error.error || 'Err'));
  }

  chooseCandidate(candidateId, orderId) {
    let body = {
      'status': 'waiting_for_payment',
      'curier': candidateId
    };
    return this.http.patch('/api/orders/' + orderId + '/assign-courier/', body)
      .map((response: Response) => response)
      .catch((error: any) => Observable.throw(error.error || 'Err'));
  }

  paymentIsDone(orderId) {
    let body = {
      'status': 'active',
    };
    return this.http.patch('/api/orders/' + orderId + '/', body)
      .map((response: Response) => response)
      .catch((error: any) => Observable.throw(error.error || 'Err'));
  }



  updateOrder(orderUuid: string, body: any) {
    return this.http.patch('/api/orders/' + orderUuid + '/', body)
      .subscribe(
        res => {
          console.log(res);

        },
      );
  }

  cancelOrder(order, currentUser) {
    let body;
    if (order.customer.uuid == currentUser.uuid) {
      body = {
        'status': 'canceled_by_customer',
      };
    } else {
      body = {
        'status': 'canceled_by_courier',
      };
    }
    return this.http.patch('/api/orders/' + order.uuid + '/', body)
      .map((response: Response) => response)
      .catch((error: any) => Observable.throw(error.error || 'Err'));
  }

  finishOrder(order, currentUser) {
    let body;
    if (order.customer.uuid == currentUser.uuid) {
      body = {
        'status': 'done',
      };
    } else {
      body = {
        'status': 'delivered',
      };
    }
    return this.http.patch('/api/orders/' + order.uuid + '/', body)
      .map((response: Response) => response)
      .catch((error: any) => Observable.throw(error.error || 'Err'));
  }

    getFilterData(): Observable<any> {
    return this.http.get('/api/orders/filter-data/')
      .map((response: Response) => response)
      .catch((error: any) => Observable.throw(error.error || 'Err'));
  }

  filterOrders(params): Observable<any> {
    return this.http.get('/api/orders/public/', {params: params})
      .map((response: Response) => response)
      .catch((error: any) => Observable.throw(error.error || 'Err'));
  }
}
