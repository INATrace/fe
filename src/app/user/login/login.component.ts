import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { EmailValidator } from 'src/shared/validation';
import { UserControllerService } from 'src/api/api/userController.service';
import { Router, ActivatedRoute } from '@angular/router';
import { GlobalEventManagerService } from 'src/app/core/global-event-manager.service';
import { BehaviorSubject } from 'rxjs';
import { ApiResponseApiUser } from 'src/api/model/apiResponseApiUser';
import { AuthService } from '../../core/auth.service';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  submitted: boolean = false;
  biggerTextInput: boolean = true;
  _loginErrorStatus$: BehaviorSubject<string>;
  userProfile: ApiResponseApiUser;

  faEye = faEye;
  faEyeSlash = faEyeSlash

  showPass: boolean = false;

  loginForm = new FormGroup({
    username: new FormControl(null, [Validators.required, EmailValidator()]),
    password: new FormControl(null, Validators.required),
  })

  constructor(
    private userController: UserControllerService,
    private router: Router,
    protected globalEventsManager: GlobalEventManagerService,
    private route: ActivatedRoute,
    private authService: AuthService,
  ) {
   }

  ngOnInit(): void {
    this._loginErrorStatus$ = new BehaviorSubject<string>("");
  }

  _username = null
  enterUsername(input) {
    this._username = input
  }

  _password = null
  enterPassword(input) {
    this._password = input;
  }
  // convenience getter for easy access to form fields
  get f() { return this.loginForm.controls; }

  login() {
    this.submitted = true;
    if(this.loginForm.invalid) return;
    let goTo = this.route.snapshot.url.slice(1).map(x => x.path)
    if(goTo.length == 0) {
        goTo = ['home']
    }
    this.authService.login(this.loginForm.get('username').value, this.loginForm.get('password').value, goTo)
  }

  showPassword() {
    this.showPass = !this.showPass
  }

}
