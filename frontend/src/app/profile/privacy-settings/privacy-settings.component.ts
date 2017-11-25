import {Component, OnInit} from '@angular/core';
import {ProfileService} from '../profile.service';
import {User} from '../user-profile.model';


@Component({
  selector: 'app-privacy-settings',
  templateUrl: './privacy-settings.component.html',
  styleUrls: ['./privacy-settings.component.less'],
  providers: [ProfileService]
})
export class PrivacySettingsComponent implements OnInit {

  constructor(private profileService: ProfileService) {
  }

  privacy_settings: any[];
  user: User;
  template_privacy = [];

  transformToTemplateList(lst) {
    var output_list = [];
    for (let item in lst) {
      for (let i in lst[item]) {
        output_list.push({key: i, value: lst[item][i]})
      }
    }
    return output_list;
  }

  transformToUpdateList(lst) {
    var items = {};
    for (let i in lst) {
      items[lst[i]['key']] = lst[i]['value'];
    }
    return items;
  }

  ngOnInit() {
    var userData = JSON.parse(localStorage.getItem("currentUser"));
    this.user = new User(userData);
    this.profileService.getPrivacySettings(this.user.uuid).then(response => {
      this.template_privacy = this.transformToTemplateList(response);
    })

  }

  save() {
    console.log(this.template_privacy);
    var output = this.transformToUpdateList(this.template_privacy)
    console.log(output);
    this.profileService.updatePrivacySettings(this.user.uuid, {share_info: output}).then(response => {
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
