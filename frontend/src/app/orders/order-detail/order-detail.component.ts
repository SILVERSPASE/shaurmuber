import {Component, EventEmitter, OnInit, Input, Output} from '@angular/core';
import {Order} from '../order.model';
import {OrdersService} from '../order.service';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import {DatePipe} from '@angular/common';
import {FormControl, Validators} from '@angular/forms';
import {NgbRatingConfig} from '@ng-bootstrap/ng-bootstrap';
import {CommentsService} from '../../comments/comments.service';
import {Comment} from '../../comments/comments.model';
import {Profile, User} from '../../profile/user-profile.model';
import {ProfileService} from '../../profile/profile.service';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.less'],
  providers: [OrdersService, DatePipe, NgbRatingConfig, CommentsService, ProfileService],
})


export class OrderDetailComponent implements OnInit {

  comment: Comment = new Comment();
  profile_first: Profile = new Profile();
  profile_second: Profile = new Profile();
  user_first_uuid: any;
  user_second_uuid: any;
  user_rating: number;
  commentValue: string;
  closeResult: string;
  currentOrderValue: Order;
  candidatesList: any = [];
  ctrl = new FormControl(null, Validators.required);
  current_user = JSON.parse(localStorage.getItem('currentUser'));
  private uuid: string;


  @Output() currentOrder = new EventEmitter<any>();
  @Output() currentOrders = new EventEmitter<any>();
  @Input() order: Order;
  @Input() currentUser;
  @Input() orders: Order[];

  constructor(private ordersService: OrdersService,
              private router: Router,
              private modalService: NgbModal,
              private datePipe: DatePipe,
              config: NgbRatingConfig,
              private route: ActivatedRoute,
              private CommentService: CommentsService,
              private ProfilService: ProfileService) {
    config.max = 5;
  }

  ngOnInit() {
    this.ProfilService.getUserProfile(this.order.customer.uuid)
      .then(
        profile => {
          this.profile_first = profile;
        },
        err => {
          alert(err);
          console.log(err);
        });

   if (this.order.curier) {
      this.ProfilService.getUserProfile(this.order.curier.uuid)
        .then(
          profile => {
            this.profile_second = profile;
            console.log(this.profile_second);
          },
          err => {
            alert(err);
            console.log(err);
          });
      this.ProfilService.getUser(this.order.curier.uuid)
        .then(
          user => {
            this.user_second_uuid = user.uuid;
          });
    }
    this.ProfilService.getUser(this.order.customer.uuid)
      .then(
        user => {
          this.user_second_uuid = user.uuid;
        });
  }

  updateOrder(orderId) {
    this.router.navigate(['/update-order'], {queryParams: {orderId: orderId}});
  }

  open(content, id, canduuid) {
    // console.log(id);
    // console.log(canduuid);
    this.order.curier = canduuid;
    this.modalService.open(content).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  takeOrder(orderId: number) {
    if (this.currentUser) {
      this.ordersService.takeOrder(orderId, this.currentUser.uuid).subscribe(
        success => {
        },
        err => {

        });

    }
  }

  chooseCandidate(candidateId, orderId) {
    // redirecting to payment page
    this.ordersService.chooseCandidate(candidateId, orderId).subscribe(
      success => {
        this.router.navigate(['/payments'], {queryParams: {orderId: orderId}});
      },
      err => {
        alert(err);
        console.log(err);
      });
  }

  fromDraftToPublic(orderId) {
    this.ordersService.fromDraftToPublic(orderId).subscribe(
      success => {
        this.currentOrders.emit([]);
      },
      err => {
        alert(err);
        console.log(err);
      });
  }


  courierConfirm(order, content) {
    this.ordersService.finishOrder(order, this.currentUser).subscribe(
      success => {
        console.log(success);
        this.modalService.open(content).result.then((result) => {
          this.closeResult = `Closed with: ${result}`;
        }, (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        });
      },

      err => {
        alert(err);
        console.log(err);
      });
  }

  Accept(order) {
    this.modalService.open(order).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  acceptCustomer(order, content) {
    this.ordersService.finishOrder(order, this.currentUser).subscribe(
      success => {
        this.currentOrders.emit([]);
      },
      err => {
        alert(err);
        console.log(err);
      });
    this.modalService.open(content).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  cancelOrder(order) {
    this.ordersService.cancelOrder(order, this.currentUser).subscribe(
      success => {
        this.currentOrder.emit(undefined);
        this.currentOrderValue = undefined;
        this.currentOrders.emit([]);
      },
      err => {
        console.log(err);
      });
  }

  changeCurrentOrder(order: Order): void {
    if (this.candidatesList.length == 0) {
      this.ordersService.getCandidates(order.uuid)
        .subscribe(
          candidates => {
            this.candidatesList = candidates;
            this.order.from_time = this.datePipe.transform(new Date(), 'MMMM dd, yyyy hh:mm a');
            this.order.to_time = this.datePipe.transform(new Date(), 'MMMM dd, yyyy hh:mm a');
          },
          err => {
            alert(err);
            console.log(err);
          });
    }

    if (!this.currentOrderValue && this.currentOrderValue !== order) {
      this.currentOrder.emit(order);
      this.currentOrderValue = order;
    } else {
      this.currentOrder.emit(undefined);
      this.currentOrderValue = undefined;
    }
  }

  addRaiting() {
    if (this.current_user.uuid === this.user_first_uuid) {
      this.profile_second.number_of_people_who_vote += 1;
      this.profile_second.sum_of_rating += this.ctrl.value;
      this.profile_second.rating = this.profile_second.sum_of_rating / this.profile_second.number_of_people_who_vote;
      this.profile_second.rating = Math.round(this.profile_second.rating * 100) / 100;
      this.ProfilService.updateUserRating(this.user_second_uuid, this.profile_second);
    } else if (this.current_user.uuid === this.user_second_uuid) {
      this.profile_first.number_of_people_who_vote += 1;
      this.profile_first.sum_of_rating += this.ctrl.value;
      this.profile_first.rating = this.profile_first.sum_of_rating / this.profile_first.number_of_people_who_vote;
      this.profile_first.rating = Math.round(this.profile_first.rating * 100) / 100;
      this.ProfilService.updateUserRating(this.user_first_uuid, this.profile_first);
    }
  }

  sendCommentAndRating(customerUuid, courierUuid) {
    this.comment.content = this.commentValue;
    this.comment.status = 'public';
    if (this.current_user.uuid === customerUuid) {
      this.comment.sender = customerUuid;
      this.comment.recipient = courierUuid;
    }
    if (this.current_user.uuid === courierUuid) {
      this.comment.sender = courierUuid;
      this.comment.recipient = customerUuid;
    }
    this.addRaiting();
    if (this.commentValue != null) {
      this.CommentService.createComment(this.comment);
    }
  }
}
