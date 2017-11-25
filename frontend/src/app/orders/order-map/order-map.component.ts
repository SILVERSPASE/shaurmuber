import {Component, OnInit, EventEmitter, ViewChild, Input, Output, SimpleChanges, OnChanges, AfterViewChecked} from '@angular/core';


import { AgmCoreModule, MapsAPILoader, GoogleMapsAPIWrapper } from '@agm/core';
import { DirectionsMapDirective } from './order-map.directive';

import {MapStyles} from './map_styles';
import {Order} from '../order.model';
import {OrdersService} from '../order.service';

declare var google: any;

@Component({
  selector: 'app-order-map',
  templateUrl: './order-map.component.html',
  styleUrls: ['./order-map.component.less'],
  providers: [OrdersService, GoogleMapsAPIWrapper, ]
})

export class OrderMapComponent implements OnInit, AfterViewChecked, OnChanges {
  userData: any;
  // google maps zoom level
  zoom = 12;
  lat: number;
  lng: number;
  styles: any[];
  newOrder = new Order;
  @Input() order: Order;
  @Input() orders: Order[];
  @Input() show: boolean;
  @Input() addNewOrder: boolean;
  @Output() getFromChild = new EventEmitter<Order>();

  @ViewChild(DirectionsMapDirective) vc: DirectionsMapDirective;

  passToParent(order) {
    this.getFromChild.emit(order);
  }

  click(order: Order): void {
    if (!this.order && this.order !== order) {
      this.order = order;
      // this.zoom = 11;
      this.lat = this.order.cordinate_to['lat'];
      this.lng = this.order.cordinate_to['lng'];

      // is used for render route of current order-START
      this.vc.order = this.order;
      this.vc.origin = { latitude: this.order.cordinate_from['lat'],
                         longitude: this.order.cordinate_from['lng'] };
      this.vc.destination = { latitude: this.order.cordinate_to['lat'],
                              longitude: this.order.cordinate_to['lng'] };
      this.vc.showDirections();
      // is used for render route of current order-END

    } else {
      this.order = undefined;
    }
  }


  mapClicked($event: any) : void {
    if (this.addNewOrder) {
      if (!this.newOrder.cordinate_from) {
        this.newOrder.cordinate_from = $event.coords;
        this.orders.push(
          this.newOrder
          );
      } else if (!this.newOrder.cordinate_to) {
        this.newOrder.cordinate_to = $event.coords;
        this.order = this.newOrder;
        this.orders = [];
        this.orders.push(this.order);
        this.passToParent(this.order);
      }
    }
  }


  // is used to pass marker's coordinate changes to parent form
  markerDragEnd(m: any, $event: any, markerFrom: boolean) : void {
    if (markerFrom) {
      this.order.cordinate_from = $event.coords;
    } else {
      this.order.cordinate_to = $event.coords;
    }

    // is used for render route of new order-START
      if (this.order.cordinate_from !== undefined && this.order.cordinate_to !== undefined) {
        this.vc.order = this.order;
        this.vc.origin = {
          latitude: this.order.cordinate_from['lat'],
          longitude: this.order.cordinate_from['lng']
        };
        this.vc.destination = {
          latitude: this.order.cordinate_to['lat'],
          longitude: this.order.cordinate_to['lng']
        };
        this.vc.showDirections();
        // is used for render route of new order-END
      }

    this.passToParent(this.order);
  }


  // is used for render route of current order-START
  ngOnChanges(changes: SimpleChanges) {
    if (this.order && changes['order'].currentValue) {
      this.newOrder = changes['order'].currentValue;
    }
    if (this.order && this.order.cordinate_from && this.order.cordinate_to ) {
      if (changes['order'] && changes['order'].currentValue !== undefined) {
        this.lat =  this.order.cordinate_from['lat'];
        this.lng = this.order.cordinate_from['lng'];
        this.vc.order = this.order;
        this.vc.origin = {
          latitude: this.order.cordinate_from['lat'],
          longitude: this.order.cordinate_from['lng']
        };
        this.vc.destination = {
          latitude: this.order.cordinate_to['lat'],
          longitude: this.order.cordinate_to['lng']
        };
        this.vc.showDirections();
      }
    }
  }
  // is used for render route of current order-END

  ngOnInit() {
    this.userData = JSON.parse(localStorage.getItem("currentUser"));
    // initial center position for the map according to user`s city
    if(this.userData){
      this.lat = +this.userData.lat;
      this.lng = +this.userData.lng;
    } else {
      // Kiev for default
      this.lat = 50.401699;
      this.lng = 30.4951864;
    }
    this.styles = MapStyles;
  }

  ngAfterViewChecked() {
    if (this.order && this.order.cordinate_from !== undefined && this.order.cordinate_to !== undefined && !this.vc.order) {
        this.vc.order = this.order;
        this.vc.origin = {
          latitude: this.order.cordinate_from['lat'],
          longitude: this.order.cordinate_from['lng']
        };
        this.vc.destination = {
          latitude: this.order.cordinate_to['lat'],
          longitude: this.order.cordinate_to['lng']
        };
        this.vc.showDirections();
      }
  }

}
