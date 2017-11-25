import {Component, OnInit, VERSION} from '@angular/core';
import {CommentsService} from './comments.service';
import {Comment} from './comments.model';
import {DatePipe} from '@angular/common';
import {ProfileService} from '../profile/profile.service';
import {document} from 'ngx-bootstrap/utils/facade/browser';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import {ActivatedRoute, Router} from '@angular/router';
import {forEach} from "@angular/router/src/utils/collection";
import {Profile} from "../profile/user-profile.model";

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.less'],
  providers: [CommentsService, DatePipe, ProfileService],
})

export class CommentsComponent implements OnInit {
  currentUser: boolean;
  closeResult: string;
  comments: Comment[];
  currentComment: any;
  key: any;
  profile_sender: Profile = new Profile();
  current_user = JSON.parse(localStorage.getItem('currentUser'));
  p: any = 1;
  private uuid: string;
  version = VERSION.full;
  index_of_comment_to_delete: number;
  array_photos: string[];

  constructor(private CommentService: CommentsService,
              private modalService: NgbModal,
              private route: ActivatedRoute,
              private serviceProfile: ProfileService) {
  }

  ngOnInit() {
    this.uuid = this.route.snapshot.paramMap.get('uuid');
    this.CommentService.getComments(this.uuid)
      .subscribe(
        comments => {
          this.comments = comments;
          this.comments.forEach(function (comment) {
          })
        });
  }

  delete() {
    this.currentComment.status = 'deleted';
    this.CommentService.editComment(this.currentComment.uuid, this.currentComment);
    if (this.index_of_comment_to_delete !== -1) {
      this.comments.splice(this.index_of_comment_to_delete, 1);
    }
  }

  edit(index) {
    if (this.current_user.email === this.comments[index].sender) {
      document.getElementsByClassName('editMode')[index].style.display = 'block';
      document.getElementsByClassName('comment-text')[index].style.display = 'none';
    }
    console.log(this.comments[index].sender);
    console.log(this.current_user.email);
  }

  save(comment, index) {
    this.CommentService.editComment(comment.uuid, comment);
    document.getElementsByClassName('editMode')[index].style.display = 'none';
    document.getElementsByClassName('comment-text')[index].style.display = 'block';
  }

  cancel(index) {
    document.getElementsByClassName('editMode')[index].style.display = 'none';
    document.getElementsByClassName('comment-text')[index].style.display = 'block';
  }

  open(content, comment, index) {
    this.currentComment = comment;
    this.index_of_comment_to_delete = index;
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
}
