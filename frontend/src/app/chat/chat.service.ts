import {Injectable} from '@angular/core';
// import {Headers, Http} from '@angular/http';

import { HttpClient } from '@angular/common/http';

import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import { Message } from './message/message.model';
import { Dialog } from './dialog/dialog.model';


@Injectable()
export class ChatService {

  constructor(private httpClient: HttpClient) { }

  getMessages(dialog_id: number): Promise<Message[]> {
    const messagesUrl = '/api/dialogs/' + dialog_id + '/messages/';
    return this.httpClient
      .get(messagesUrl)
      .toPromise()
      .then((response: Message[]) => {
        return response;
      })
      .catch(this.handleError);
  }

  getDialog(id: number): Promise<Dialog> {
    const dialogUrl = '/api/dialogs/' + id;
    return this.httpClient
      .get(dialogUrl)
      .toPromise()
      .then((response: Dialog) => {
        return response;
      })
      .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }

}
