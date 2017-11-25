import {Component, OnInit} from '@angular/core';
import {PaymentService} from "../shared/payment.service";
import {Payment} from "../shared/payment";
import {ActivatedRoute} from "@angular/router";
import {OrdersService} from "../orders/order.service";
import {Order} from "../orders/order.model";

@Component({
  selector: 'app-payments',
  templateUrl: './payments.component.html',
  styleUrls: ['./payments.component.less'],
  providers: [PaymentService, OrdersService]
})

export class PaymentsComponent implements OnInit{
  payment: Payment;
  order: Order = new Order;

  constructor (private paymentService: PaymentService,
               private ordersService: OrdersService,
               private route: ActivatedRoute) {}
  sub;
  orderId;

  ngOnInit(){
    this.payment = {
      data: "",
      signature: ""
    };
    this.sub = this.route
        .queryParams
        .subscribe(params => {
        this.orderId = params['orderId'];
    });

    this.paymentService.getPayment(this.orderId).subscribe(payment => this.payment = payment);
    this.ordersService.getOneOrder(this.orderId).subscribe(order => this.order = order);

  }
}
