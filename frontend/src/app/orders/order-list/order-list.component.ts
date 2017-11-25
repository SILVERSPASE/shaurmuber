import { Component, OnInit, Input, SimpleChange, EventEmitter, Output } from '@angular/core';
import { Order } from '../order.model';


@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.less']
})
export class OrderListComponent implements OnInit {

  constructor() { };

  @Input() orders: Order[];
  @Input() allOrders: Order[]; // for filter in this component
  @Input() activeOrderType: string;
  @Output() current_order = new EventEmitter<Order>();
  @Output() currentOrders = new EventEmitter<any>();
  @Output() filteredOrders = new EventEmitter<Order[]>();

  @Input() currentUser;


  setCurrentOrder(order: any): void{
      this.current_order.emit(order);
  };


  updateOrders(orders: any): void{
      this.currentOrders.emit(orders);
  };

  filterOrders(orders: any): void{
      this.filteredOrders.emit(orders);
  };


  ngOnChanges(changes: {[propName: string]: SimpleChange}){
      for(let field in changes){
          if(field == "orders"){
              this.orders = changes[field].currentValue;
          }
      }
  };


  ngOnInit() {};

}
