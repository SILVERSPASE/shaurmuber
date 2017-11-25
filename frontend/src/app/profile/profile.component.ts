import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { ProfileService } from './profile.service';
import { User, Profile } from './user-profile.model';
import { UserService } from './user.service';
import { HttpClient } from '@angular/common/http';
import { CurrentUserService } from '../authentication/current-user.service';
import { LoginService } from '../authentication/login/login.service';
import { LogoutService } from '../authentication/logout.service';
import { Router } from '@angular/router';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.less'],
  providers: [ UserService, LogoutService, ProfileService ]
})
export class ProfileComponent implements OnInit {

  user: User;
  profile: Profile;
  imageToDisplay: String;
  closeResult: string;


  constructor(private logoutService: LogoutService,
              private router: Router,
              private userService: UserService,
              private profileService: ProfileService,
              private modalService: NgbModal) {
  }

  ngOnInit() {
    const userData = JSON.parse(localStorage.getItem("currentUser"));

    if (!userData){
      this.router.navigateByUrl('/login');
    }
    this.user = new User(userData);

    this.profileService.getUserProfile(this.user.uuid).then(profile => {
      this.profile = profile;
      this.imageToDisplay = profile.image || `assets/img/profile.png`;
    });
  }

  logout() {
    this.logoutService.logout();
  }

  deleteProfile() {
    this.userService.deleteProfile().then(response => {
      this.router.navigateByUrl('/profile/deleted/');
    });
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
      return `with: ${reason}`;
    }
  }

}
