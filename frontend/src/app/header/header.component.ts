import {Component, OnInit} from '@angular/core';
import {LogoutService} from "../authentication/logout.service";
import {CurrentUserService} from "../authentication/current-user.service";
import { WebSocketBridge } from 'django-channels';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { Notification } from './notification.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.less'],
  providers: [LogoutService, CurrentUserService]
})
export class HeaderComponent implements OnInit {
  currentUser: boolean;
  closeResult: string;
  webSocketBridge: any;
  notifications: Notification[];

  private isAuthenticated: boolean;
  private currentUserUUID: string;



  constructor(private logoutService: LogoutService,
              private currentUserService: CurrentUserService,
              private modalService: NgbModal,
              private router: Router) {
  }

  ngOnInit() {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.isAuthenticated = JSON.parse(localStorage.getItem("isAuthorized"));
    this.currentUserUUID = JSON.parse(localStorage.getItem('currentUser'));
    console.log(this.isAuthenticated);
    this.notifications = [];
    this.connectToWs()

  }


  open(content) {
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
      return  `with: ${reason}`;
    }
  }

  logout(): void {
    this.logoutService.logout();
  }

  connectToWs(): void {
    var ws_path = 'ws://localhost:9000/async/';
    this.webSocketBridge = new WebSocketBridge();
    this.webSocketBridge.connect(ws_path);
    this.webSocketBridge.socket.addEventListener('open', () => {
      this.addEventListener();
    });
  }

  addEventListener(): void {
    this.webSocketBridge.listen((action) => {
      console.log(action);
      var a = JSON.parse(action);
      this.notifications.push(new Notification({'action':a['action'], 'text':a['text']})); 
      console.log(this.notifications);
    });
  }

  disable_not(id): void{
    var url = this.notifications[id].action;
    this.notifications.splice(id, 1);
    this.router.navigateByUrl(url);
  }
}
