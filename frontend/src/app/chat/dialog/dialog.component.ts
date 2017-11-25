import {AfterViewChecked, Component, OnInit} from '@angular/core';
import {ViewChild, ElementRef} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import { WebSocketBridge } from 'django-channels';

import 'rxjs/add/operator/toPromise';

import { ChatService } from '../chat.service';
import { CurrentUserService } from '../../authentication/current-user.service';
import { Dialog } from './dialog.model';
import { Message } from '../message/message.model';



@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.less'],
  providers: [
    ChatService,
    CurrentUserService,
  ],
})
export class DialogComponent implements OnInit, AfterViewChecked {
  messages: Message[];
  dialog: Dialog;
  orderId: number;
  currentUser: any;
  ws_path: any;
  webSocketBridge: any;
  onlineStatus: string;
  isDataAvailable: boolean = false;
  @ViewChild('scrolling') private myScrollContainer: ElementRef;

  constructor(private messageService: ChatService,
              private route: ActivatedRoute,
              private router: Router,) {
    this.onlineStatus = 'offline';
  }

  ngOnInit(): void {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.route.paramMap
      .subscribe(params => {
        this.orderId = +params.get('id');
        this.getDialog();
      });
     this.scrollToBottom();
    }

  getDialog(): void {
    this.messageService
      .getDialog(this.orderId)
      .then(dialog => {
        this.dialog = dialog;
        this.isDataAvailable = true;
        this.getMessages();
      })
      .catch(
        error => {
          return this.router.navigate(['404']);
      });
  }

  getMessages(): void {
    this.messageService
      .getMessages(this.dialog.id)
      .then(messages => {
        this.messages = messages;
        this.connectToWS();
      });
  }

  getDate(date: string): any {
    const new_date = new Date(date);
    return new_date.toUTCString();
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  scrollToBottom(): void {
    try {
      this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    } catch (err) { }
  }

  appendMessage(data: any): void {
    const msg = new Message(
      data.message_id,
      data.message,
      data.date,
      data.user_id,
      data.first_name,
      data.last_name,
      data.dialog,
      data.image);
    this.messages.push(msg);
    this.scrollToBottom();
  }

  // Establish WebSocket connection and add event listener
  connectToWS(): void {
    this.ws_path = 'ws://localhost:8000/chat/stream';
    this.webSocketBridge = new WebSocketBridge();
    this.webSocketBridge.connect(this.ws_path);
    this.webSocketBridge.socket.addEventListener('open', () => {
      this.connectToChannel();
      this.addEventListener();
    });
  }

  // Connect/join a channel
  connectToChannel(): void {
    this.webSocketBridge.send({
        'command': 'join',
        'dialog': this.dialog.id,
    });
  }

  sendWSMessage(text: string) {
    if (text.trim() !== '') {
      this.webSocketBridge.send({
        'command': 'send',
        'dialog': this.dialog.id,
        'message': text
      });
      }
    if (this.onlineStatus === 'offline') {
      this.webSocketBridge.send({
        'command': 'notification',
        'dialog': this.dialog.id,
      })
    }
  }

  addEventListener(): void {
    this.webSocketBridge.listen((action) => {
      if (action.message) {
        if (action.msg_type === 4) {
          // Handle when User enters a channel and online status
          if (action.user_id !== this.currentUser.id) {
            // Send message that user entered a channel
            this.webSocketBridge.send({
              'command': 'in_dialog',
              'dialog': this.dialog.id,
            });
            // Change status to Online
            this.onlineStatus = 'online';
          }
        } else if (action.msg_type === 0) {
          // Handle chat message and refresh dialog
            this.appendMessage(action);
        } else if (action.msg_type === 5) {
          // Handle when User leaves a channel
            if (action.user_id !== this.currentUser.id) {
              this.onlineStatus = 'offline';
            }
        } else if (action.msg_type === 6) {
          // Handle chat opponent's online status
            if (action.user_id !== this.currentUser.id) {
              this.onlineStatus = 'online';
            }
        }
      // Handle online status when leaving a channel
      } else if (action.leave) {
          this.onlineStatus = 'offline';
      }
    });
  }

}
