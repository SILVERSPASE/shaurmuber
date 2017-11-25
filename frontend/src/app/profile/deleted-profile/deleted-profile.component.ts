import { Component, OnInit } from '@angular/core';
import { User } from '../user-profile.model';
import { UserService } from '../user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-deleted-profile',
  templateUrl: './deleted-profile.component.html',
  styleUrls: ['./deleted-profile.component.less'],
  providers: [UserService]
})
export class DeletedProfileComponent implements OnInit {

  constructor(
  	private userService: UserService,
  	private router: Router
  	) { };

  user: User;

  ngOnInit() {
  	var userData = JSON.parse(localStorage.getItem("currentUser"));
  	this.user = new User(userData);
    console.log(this.user);
  }

  restoreProfile() {
  	this.user.deleted = false;
  	this.userService.restoreProfile().then(response => {
  		location.href = '/profile'
  	});
  }

}
