import {Component, OnInit, Input, SimpleChanges, Output, EventEmitter}  from '@angular/core';
import {OrdersService} from '../order.service';
import {HttpParams} from "@angular/common/http";
import {DatePipe} from "@angular/common";

@Component({
  selector: 'orders-filter',
  templateUrl: './orders-filter.html',
  styleUrls: ['./orders-filter.less'],
  providers: [DatePipe]
})
export class OrdersFilter implements OnInit{

  constructor(
    private ordersService: OrdersService,
    private datePipe: DatePipe,
  ){}

  @Input() orders;
  @Output() filteredOrders = new EventEmitter<any>();

  filterIsReady = false; //flag which starts html generating to get actual filters range

  filters = {
    order_price: {
      title: 'Order Price',
      type: 'range',
      range: [0, 1],
      min: 0,
      max: 1,
    },
    delivery_price: {
      title: 'Delivery Price',
      type: 'range',
      range: [0, 1],
      min: 0,
      max: 1,
    },
    distance: {
      title: 'Distance',
      type: 'range',
      range: [0, 1],
      min: 0,
      max: 1
    },
    datetime: {
      title: 'Date and Time',
      type: 'datetime',
      dateTimeFrom: new Date,
      dateTimeTo: new Date(new Date().getTime() + 7 *  24 * 60 * 60 * 1000) // 7 days ahead
    },
  };

  ngOnInit() {

    this.ordersService.getFilterData().subscribe(
        res => {
          this.filters.order_price.max = res.max_order_price;
          this.filters.order_price.range[1] = res.max_order_price;
          this.filters.delivery_price.max = res.max_delivery_price;
          this.filters.delivery_price.range[1] = res.max_delivery_price;
          this.filters.distance.max = +res.max_distance;
          this.filters.distance.range[1] = +res.max_distance;
          this.filterIsReady = true;
        },
        err => {
          alert('Error while getting filter data');
          console.log(err);
        });
  }

  // now works only with min max range

  filterOrders(filters) {
    let params = new HttpParams();
    if(filters.order_price.range[0] > filters.order_price.min) {
      params = params.append('order_price__gte', filters.order_price.range[0]);
    }
    if(filters.order_price.range[1] < filters.order_price.max){
      params = params.append('order_price__lte', filters.order_price.range[1]);
    }
    if(filters.delivery_price.range[0] > filters.delivery_price.min) {
      params = params.append('delivery_price__gte', filters.delivery_price.range[0]);
    }
    if(filters.delivery_price.range[1] < filters.delivery_price.max) {
       params = params.append('delivery_price__lte', filters.delivery_price.range[1]);
    }
    if(filters.distance.range[0] > filters.distance.min) {
      params = params.append('distance__gte', filters.distance.range[0]);
    }
    if(filters.distance.range[1] < filters.distance.max) {
      params = params.append('distance__lte', filters.distance.range[1]);
    }

    let dateTimeFrom = this.datePipe.transform(filters.datetime.dateTimeFrom._d.getTime(), "yyyy-MM-dd hh:mm");
    let dateTimeTo = this.datePipe.transform(filters.datetime.dateTimeTo._d.getTime(), "yyyy-MM-dd hh:mm");
    params = params.append('from_time__gte', dateTimeFrom);
    params = params.append('to_time__lte', dateTimeTo);

    console.log(params);

    this.ordersService.filterOrders(params).subscribe(
        res => {
          console.log(res);
          this.filteredOrders.emit(res);
        },
        err => {
          alert('Error while filtering orders');
          console.log(err);
        });

  }


  // filterOrders(filters) {
  //   let filtered = this.orders.filter(function (order) {
  //     for (let f in filters) {
  //       if(filters[f].type=='range') {
  //         if(!(order[f] >= filters[f].range[0] && order[f] <= filters[f].range[1])){
  //           return false;
  //         }
  //       }
  //       if(filters[f].type=='datetime'){
  //         let filetrDateTimeFrom = filters[f].dateTimeFrom._d.getTime();
  //         let filterDateTimeTo = filters[f].dateTimeTo._d.getTime();
  //         let orderDateTimeFrom = Date.parse(order.from_time);
  //         let orderDateTimeTo = Date.parse(order.to_time);
  //         console.log(filetrDateTimeFrom > orderDateTimeFrom && filterDateTimeTo < orderDateTimeTo);
  //         if(!(filetrDateTimeFrom < orderDateTimeFrom && filterDateTimeTo > orderDateTimeTo)) {
  //           return false;
  //         }
  //       }
  //     }
  //     return true
  //   });
  //   this.filteredOrders.emit(filtered);
  // }


}
