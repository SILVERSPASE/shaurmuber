import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TabsetComponent } from 'ngx-bootstrap';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';

import { City } from '../cities/model/city';
import { CityService } from '../cities/service/city.service';
import { User } from '../shared/user';
import { UserRegistrationService } from '../shared/user.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.less'],
  providers: [DatePipe]
})
export class RegistrationComponent implements OnInit {
  model_date: any;
  regions: String[];
  cities: City[];

  registrationForm: FormGroup;
  PaymentForm: FormGroup;
  AdditionalInfoForm: FormGroup;
  user: User = new User();
  flag = true;
  minDate = new Date(1930, 1, 1);
  maxDate = new Date();
  @ViewChild('staticTabs') staticTabs: TabsetComponent;

  model: any = {};
  loading = false;
  closeResult: string;

  phone_mask: any[] = ['+', ' ', '(', '3', '8', '0', ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/];
  card_mask: any[] = [/\d/, /\d/, /\d/, /\d/];
  date_mask: any[] = [/\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/];
  emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  nameRegex = /^([^0-9]*)$/;

  formErrors = {
    "first_name": "",
    "last_name": "",
    "email": "",
    "phone_number": "",
    "birth_date": "",
    "password": "",
    "confirm_password": ""
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
    'password': {
      'required': 'Password is required!',
      'minlength': 'Your password is too short! Enter at least 8 characters!'
    },
    "confirm_password": {
      "required": "Retype password!",
    }
  };

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
    'Gorod Sevastopol',
  ];

  constructor(private fb: FormBuilder,
              private service: UserRegistrationService,
              private cityService: CityService,
              private datePipe: DatePipe,
              private modalService: NgbModal) {
    this.regions = this.REGIONS.sort();
  }

  ngOnInit() {
    this.user.city = 'Kyiv';
    this.cityService.getCitiesByRegion('Kyiv');
    this.disableTabs();
    this.buildAccountForm();
    this.buildPaymentForm();
    this.buildAdditionalInfoForm();
    this.cityService.getCities()
      .subscribe(
        cities => {
          this.cities = cities;
        },
        err => {
          console.log(err);
        }
      );
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
      return  `with: ${reason}`;
    }
  }

  private buildAccountForm() {
    this.registrationForm = this.fb.group({
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
      ]],
        'email': ['', [
        Validators.required,
        Validators.pattern(this.emailRegex)
      ]],
        'phone_number': ['', [
        Validators.required
      ]],
        'password': ['', [
        Validators.required,
        Validators.minLength(8)
      ]],
        'confirm_password': ['', [
        Validators.required
      ]]
    });
  }

  private buildPaymentForm() {
    this.PaymentForm = this.fb.group({
        "card_number1": [""],
        "card_number2": [""],
        "card_number3": [""],
        "card_number4": [""]
      }
    );
  }

  private buildAdditionalInfoForm() {
    this.AdditionalInfoForm = this.fb.group({
        "birth_date": [""],
        "city": [""],
        "about_me": [""]
      }
    );
  }

  registerAccount() {
    this.user.first_name = this.registrationForm.value.first_name;
    this.user.last_name = this.registrationForm.value.last_name;
    this.user.email = this.registrationForm.value.email;
    this.user.phone_number = this.registrationForm.value.phone_number;
    this.user.password = this.registrationForm.value.password;

    const password = (<HTMLInputElement>document.getElementById('password')).value;
    const confirm_password = (<HTMLInputElement>document.getElementById('confirm_password')).value;

    if (password != confirm_password) {
      (<HTMLInputElement>document.getElementById('confirm_password')).value = '';
      this.flag = false;
    } else {
        this.flag = true;
        this.selectTab(1);
    }
    return this.flag;
  }

  registerPayments() {
      this.user.card_number = "";
      this.user.card_number += this.PaymentForm.value.card_number1 +
      this.PaymentForm.value.card_number2 + this.PaymentForm.value.card_number3 +
      this.PaymentForm.value.card_number4;
      if (this.user.card_number.length < 16 && this.user.card_number.length > 0) {
          alert("Card number is invalid!");
      }else {
          this.selectTab(2);
      }
  }

  registerAdditionalInfo() {
      this.user.birth_date = this.datePipe.transform(this.AdditionalInfoForm.value.birth_date, "yyyy-MM-dd");
      this.user.city = this.AdditionalInfoForm.value.city;
      this.user.about_me = this.AdditionalInfoForm.value.about_me;
      this.registrationForm.patchValue(this.user);
      this.service.registerUser(this.user);
      console.log(this.user);

  }

  selectTab(tab_id: number) {
      this.staticTabs.tabs[tab_id].disabled = false;
      this.staticTabs.tabs[tab_id].active = true;
  }

  disableTabs() {
      this.staticTabs.tabs[1].disabled = true;
      this.staticTabs.tabs[2].disabled = true;
  }

  onValueChange(data?: any) {
    if (!this.registrationForm) return;
    let form = this.registrationForm;

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

}
