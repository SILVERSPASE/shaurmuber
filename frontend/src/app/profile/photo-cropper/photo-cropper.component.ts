import {Component, NgModule, ViewChild, OnInit} from '@angular/core'
import {BrowserModule} from '@angular/platform-browser'
import {ImageCropperComponent, CropperSettings, Bounds} from 'ng2-img-cropper';

import { UserService } from '../user.service';
import { ProfileService } from '../profile.service';
import { User, Profile } from '../user-profile.model';

@Component({
  selector: 'app-photo-cropper',
  templateUrl: './photo-cropper.component.html',
  styleUrls: ['./photo-cropper.component.less'],
  providers: [ UserService, ProfileService]
})
export class PhotoCropperComponent implements OnInit {

  user: User;
  profile: Profile;

  image: any;
  file: File;
  data:any;
  myReader:FileReader;
  cropperSettings:CropperSettings;
  croppedWidth:number;
  croppedHeight:number;

  @ViewChild('cropper', undefined) cropper:ImageCropperComponent;

  constructor(private userService: UserService,
    private profileService: ProfileService) {

    this.cropperSettings = new CropperSettings();
    this.cropperSettings.width = 200;
    this.cropperSettings.height = 200;

    // this.cropperSettings.croppedWidth = 200;
    // this.cropperSettings.croppedHeight = 200;

    this.cropperSettings.canvasWidth = 560;
    this.cropperSettings.canvasHeight = 300;

    this.cropperSettings.minWidth = 100;
    this.cropperSettings.minHeight = 100;

    this.cropperSettings.rounded = true;
    this.cropperSettings.keepAspect = true;

    this.cropperSettings.preserveSize = true;

    this.cropperSettings.cropperDrawSettings.strokeColor = '#03a87c';
    this.cropperSettings.cropperDrawSettings.strokeWidth = 2;

    this.data = {};
  }

  ngOnInit() {
    var userData = JSON.parse(localStorage.getItem("currentUser"));
    this.user = new User(userData);

    this.profileService.getUserProfile(this.user.uuid).then(profile=>{
      this.profile = profile;
    });

  }
  
  cropped(bounds:Bounds) {
    this.croppedHeight = bounds.bottom - bounds.top;
    this.croppedWidth = bounds.right - bounds.left;
  }
  
  fileChangeListener($event) {
    this.image = new Image();
    this.file = $event.target.files[0];
    this.myReader = new FileReader();
    this.myReader.onloadend = (loadEvent:any) => {
      this.image.src = loadEvent.target.result;
      this.cropper.setImage(this.image);

    };

    this.myReader.readAsDataURL(this.file);
  }

  uploadPhoto(){
   if(this.data.image.length > 1000000){
      var tooBigImage = document.getElementById('tooBigImage');

      tooBigImage.style.display = 'block';
      setTimeout(() =>{tooBigImage.style.display = 'none'}, 5000);

      this.data.image.length = 0;
    }

    var formData = new FormData;
    formData.append('image', this.data.image);

    this.profileService.uploadImage(this.user.uuid, formData).then(response => {
      console.log(response);
      document.getElementById('btnCloseCropper').click();
      this.showResultModal(response);
      setTimeout(location.reload(), 3000);
    })
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
