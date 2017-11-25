import { Component, OnInit, ViewChild } from '@angular/core';
import { User, Profile } from '../user-profile.model'
import { ProfileService } from '../profile.service';
import { UserService } from '../user.service';
import { City } from '../../cities/model/city';
import { CityService } from '../../cities/service/city.service';

import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LogoutService } from '../../authentication/logout.service';

@Component({
  selector: 'app-basics',
  templateUrl: './basics.component.html',
  styleUrls: ['./basics.component.less'],
  providers: [ProfileService, UserService]
})
export class BasicsComponent implements OnInit {

  regions: String[];
  cities: City[];

  basicsForm: FormGroup;
  passwordChangeForm: FormGroup;
  emailChangeForm: FormGroup;

  flag = true;
  minDate = new Date(1930, 1, 1);
  maxDate = new Date();

  model: any = {};
  loading = false;

  REGIONS = [
  'Kyiv',
  'Republic of Crimea',
  'Vinnyts\'ka',
  'Volyn',
  'Donetsk',
  'Dnipro',
  'Zhytomyr',
  'Transcarpathia',
  'Zaporizhia',
  'Ivano-Frankivsk',
  'Kropyvnytskyi',
  'Luhansk',
  'Lviv',
  'Mykolaiv',
  'Odessa',
  'Poltava',
  'Rivne',
  'Sumy',
  'Ternopil',
  'Kharkiv',
  'Kherson',
  'Khmelnytskyi',
  'Cherkasy',
  'Chernivtsi',
  'Chernihiv',
  // 'Kyiv City',
  'Gorod Sevastopol',
  ];


  user: User;
  profile: Profile;

  userForm: FormGroup;
  emailForm: FormGroup;
  passwordForm: FormGroup;
  otherInfoForm: FormGroup;

  phone_mask: any[] = ['+', ' ', '(', '3', '8', '0', ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/];
  card_mask: any[] = [/\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
  emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  nameRegex = /^([^0-9]*)$/;




  formErrors = {
    "first_name": "",
    "last_name": "",
    "email": "",
    "phone_number": "",
    "birth_date": "",
    "old_password": "",
    "new_password": "",
    "confirm_new_password": "",
    "card_number": ""
  };


  validationMessages = {
    'first_name': {
      'required': 'First name is required!',
      'minlength': 'First name must consist of at least 2 characters',
      'maxlength': 'Maximum length of first name is 30 characters',
      'pattern': 'Numbers are not allowed in this field!'
    },
    'last_name': {
      'required': 'Last name name is required!',
      'minlength': 'Last name must consist of at least 2 characters',
      'maxlength': 'Maximum length of last name is 30 characters',
      'pattern': 'Numbers are not allowed in this field!'
    },
    'email': {
      'required': 'Email is required!',
      'pattern': 'Email is invalid!'
    },
    'phone_number': {
      'required': 'Phone number is required!',
      'pattern': 'Phone number is invalid!'
    },
    'old_password': {
      'required': 'Old password is required!',
      'minlength': 'Your password is too short! Enter at least 8 characters!'
    },
    'new_password': {
      'required': 'New password is required!',
      'minlength': 'Your password is too short! Enter at least 8 characters!'
    },
    'confirm_new_password': {
      'required': 'Retype new password!',
      'minlength': 'Your password is too short! Enter at least 8 characters!'
    },
    'card_number': {
      'pattern': 'Please, enter exactly 16 digits!'
    },
  };



  constructor(
    private profileService: ProfileService,
    private userService: UserService,
    private cityService: CityService,
    private fb: FormBuilder,
    private logoutService: LogoutService
    ) {
    this.createUserForm();
    this.createEmailForm();
    this.createPasswordForm();
    this.createOtherInfoForm();

    this.regions = this.REGIONS.sort();
  }

  ngOnInit() {
  	var userData = JSON.parse(localStorage.getItem("currentUser"));
  	this.user = new User(userData);

    this.profileService.getUserProfile(this.user.uuid).then(profile=>{
      this.profile = profile;

      this.cityService.getCities()
      .subscribe(
        cities => {
          this.cities = cities;
        },
        err => {
          console.log(err);
        }
        );

      this.userForm.setValue({
        first_name:   this.user.first_name,
        last_name:    this.user.last_name
      });

      this.emailForm.setValue({
        email:        this.user.email
      });

      this.otherInfoForm.setValue({
        city:         this.profile.city              || '',
        phone_number: this.profile.phone_number      || '',
        about_me:     this.profile.about_me          || '',
        birth_date:   this.profile.birth_date        || '',
        card_number:  this.profile.card_number       || ''
      });

    });

  }

  changeBasicks() {
    console.log('sss');
    if (this.userForm.invalid) {
      this.showResultModal(false);
      return;
    }
    this.userService.updateUser(this.userForm.value).then(response => {
      this.showResultModal(response);
      console.log(response);
    })
  }

  changeEmail(){
    if (this.emailForm.invalid) return;
    this.userService.changeEmail(this.emailForm.value)
  }

  changePassword(){
    if (this.passwordForm.invalid) return;
    if (this.passwordForm.get('new_password').value != this.passwordForm.get('confirm_new_password').value ){
      this.formErrors['confirm_new_password'] += this.validationMessages['confirm_new_password']['required'] + " ";
      return;
    }
    this.userService.changePassword(this.passwordForm.value)
    .then(response => {
      if(response == undefined){
        this.showResultModal(true);
        setTimeout(this.logoutService.logout(), 5000);
      }
      else {
        this.showResultModal(false);
      }
     });

  }

  updateProfile() {
    if (this.otherInfoForm.invalid){
      this.showResultModal(false);
      return;
    }
    if (this.otherInfoForm.invalid) return;

    this.otherInfoForm.patchValue({
    card_number: this.otherInfoForm.get('card_number').value.replace(/-/g, "")
  });
    this.profileService.updateUserProfile(this.user.uuid, this.otherInfoForm.value).then(response => {
      this.showResultModal(response);
      console.log(response)})
  }


  createUserForm() {
    this.userForm = this.fb.group({
      'first_name': ['', [
      Validators.required,
      Validators.minLength(2),
      Validators.maxLength(30),
      Validators.pattern(this.nameRegex)
      ]],
      'last_name': ['', [
      Validators.required,
      Validators.minLength(2),
      Validators.maxLength(30),
      Validators.pattern(this.nameRegex)
      ]]
    });
  }

  createEmailForm() {
    this.emailForm = this.fb.group({
      'email': ['', [
      Validators.required,
      Validators.pattern(this.emailRegex)
      ]]
    });
  }


  createPasswordForm() {
    this.passwordForm = this.fb.group({
      'old_password': ['', [
      Validators.required,
      Validators.minLength(8)
      ]],
      'new_password': ['', [
      Validators.required,
      Validators.minLength(8)
      ]],
      'confirm_new_password': ['', [
      Validators.required,
      Validators.minLength(8)
      ]]
    });
  }

  createOtherInfoForm() {
    this.otherInfoForm = this.fb.group({
      'city': [''],
      'phone_number': ['',
      Validators.required
      ],
      'about_me': [''],
      'birth_date': [''],
      'card_number': ['']
    });
  }



  onFormChange(formType) {

    let form = formType;

    for (let field in this.formErrors) {
      this.formErrors[field] = "";

      let control = form.get(field);

      if (control && control.dirty && !control.valid) {
        let message = this.validationMessages[field];
        for (let key in control.errors) {
          this.formErrors[field] += message[key] + " ";
        }
      }
    }
  }

  onRegionChange(regionName) {
    this.cityService.getCitiesByRegion(regionName)
    .subscribe(
      cities => {
        this.cities = cities;
      },
      err => {
        console.log(err);
      }
      );
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




