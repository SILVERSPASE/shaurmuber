import {Injectable} from '@angular/core';
import {Comment} from './comments.model';
import {HttpClient} from '@angular/common/http';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import {Observable} from "rxjs/Observable";


@Injectable()
export class CommentsService {

  constructor(private http: HttpClient) {
  }

  createComment(comment: Comment) {
    return this.http.post('/api/comments/create/', comment, {responseType: 'text'})
      .subscribe(
        res => {
          console.log(res);
        },
      );
  }

  editComment(commentUuid: string, body: any) {
    return this.http.patch('/api/comments/edit/' + commentUuid + '/', body)
      .subscribe(
        res => {
          console.log(res);
        },
      );
  }

   getComments(uuid): Observable<Comment[]> {
    return this.http.get('/api/comments/get/' + uuid )
      .map((response: Response) => response)
      .catch((error: any) => Observable.throw(error.error || 'Err'));
  }
}
