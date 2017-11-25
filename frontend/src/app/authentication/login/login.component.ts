import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LoginUser } from './login-user';
import { LoginService } from './login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less'],
  providers: [ LoginService ],
})

export class LoginComponent implements OnInit {

  constructor(
    private fb: FormBuilder,
    private loginService: LoginService,
  ) {}

  ngOnInit(): void {
    this.buildForm();
  }

  login():void {
    this.loginService.login(this.registrationForm.get('email').value, this.registrationForm.get('password').value);
  }


  registrationForm: FormGroup;
  user: LoginUser = new LoginUser();
  emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;


  formErrors = {
    "email": "",
    "password": "",
    "registrationForm": ""
  };

  validationMessages = {
    "email": {
      "required": "Email is required!",
      "pattern": "Email is invalid!"
    },
    "password": {
      "required": "Password is required!",
      "minlength": "Your password is too short! Enter at least 8 characters!"
    },
  };


  buildForm() {
    this.registrationForm = this.fb.group({
      "email": [this.user.email, [
        Validators.required,
        Validators.pattern(this.emailRegex)
      ]],
      "password": [this.user.password, [
        Validators.required,
        Validators.minLength(8)
      ]],
    });
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

}
