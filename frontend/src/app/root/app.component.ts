import { Component, OnInit } from '@angular/core';
import { CurrentUserService } from "../authentication/current-user.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less'],
   providers: [ CurrentUserService ]
})
export class AppComponent implements OnInit {
  title = 'app';

  constructor(private currentUserService: CurrentUserService){};

  userIdentified : boolean;

  ngOnInit():void{
  	this.currentUserService.setUserDataAndPermisions()
  		.then(response => {
  			this.userIdentified = response;
  		});
  }
}
