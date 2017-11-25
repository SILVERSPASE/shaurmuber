import {Component, OnInit} from '@angular/core';
import {Order} from './order.model';
import {OrdersService} from './order.service';

@Component({
  selector: 'orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.less'],
  providers: [OrdersService]
})
export class OrdersComponent implements OnInit {


  constructor(private ordersService: OrdersService) {
  }

  currentOrders: Order[] = [];
  allOrders: Order[] = []; //for filtering backup
  currentOrder: Order;
  activeOrderType: string;
  isDataAvaible: Boolean = false;
  currentUser;
  price = 1;



  changeOrderList(value): void {
    this.activeOrderType = value;
    this.ordersService.getOrders(this.activeOrderType)
      .subscribe(
        currentOrders => {
          this.currentOrders = currentOrders;
          this.allOrders = currentOrders;
          this.isDataAvaible = true;
        },
        err => {
          alert('Error while getting orders');
        });
  }

  setCurrentOrder(order: any): void {
    this.currentOrder = order;
  }

  filterOrders(orders: any): void {
    this.currentOrders = orders;
  }

  updateOrders(orders: any): void {
    this.ordersService.getOrders(this.activeOrderType)
      .subscribe(
        currentOrders => {
          this.currentOrders = currentOrders;
        },
        err => {
          alert('Error while getting orders');
        });
  }


  ngOnInit() {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (this.currentUser) {
      this.changeOrderList('my_public_orders');
    } else {
      this.changeOrderList('all');
    }


  }

}

