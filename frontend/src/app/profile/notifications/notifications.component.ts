import { Component, OnInit } from '@angular/core';
import { ProfileService } from '../profile.service';
import { User } from '../user-profile.model';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.less'],
  providers: [ ProfileService ]
})
export class NotificationsComponent implements OnInit {

  constructor(private profileService: ProfileService) { }

  notifications : any[];
  user : User;
  template_notifications = []

  transformToTemplateList(lst){
  	var output_list = [];
  	for(let item in lst){
  		for(let i in lst[item]){
  			output_list.push({key: i, value:lst[item][i]})
  		}
  	}
  	return output_list;
  }

  transformToUpdateList(lst){
  	var items = {};
    for(let i in lst){
      items[lst[i]['key']] = lst[i]['value'];
    }
    return items;
  }

  ngOnInit() {
    var userData = JSON.parse(localStorage.getItem("currentUser"));
    this.user = new User(userData);
    this.profileService.getNotifications(this.user.uuid).then(response => {
      this.template_notifications = this.transformToTemplateList(response);  
    })
  	
  }

  save() {
  	console.log(this.template_notifications);
  	var output = this.transformToUpdateList(this.template_notifications)
  	this.profileService.updateNotifications(this.user.uuid, {notification_info: output}).then(response => {
      this.showResultModal(response);
      console.log(response);
    });
  }

    showResultModal(flag){

    var resErr = document.getElementById('resultError');
    var resSuc = document.getElementById('resultSuccess');

    if(flag){
      resSuc.style.display = 'block';
      setTimeout(() =>{resSuc.style.display = 'none'}, 5000);
    } else {
      resErr.style.display = 'block';
      setTimeout(() =>{resErr.style.display = 'none'}, 5000);
    }
  }

}
