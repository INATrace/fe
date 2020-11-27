import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { faUser, faCaretDown } from '@fortawesome/free-solid-svg-icons';
import { BehaviorSubject, Subscription } from 'rxjs';
import { AuthService } from 'src/app/system/auth.service';

@Component({
  selector: 'app-landing-page-top-nav',
  templateUrl: './landing-page-top-nav.component.html',
  styleUrls: ['./landing-page-top-nav.component.scss']
})
export class LandingPageTopNavComponent implements OnInit {

  _showNavButtons$: BehaviorSubject<boolean>;
  _isLandingPage$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);

  public loggedId;
  public userProfile;
  constructor(
    private router: Router,
    public authService: AuthService
  ) { }

  faUser = faUser
  faCaretDown = faCaretDown;
  subUserProfile: Subscription;

  ngOnInit(): void {
    this._showNavButtons$ = new BehaviorSubject<boolean>(false);
    this._isLandingPage$.next(this.router.url === '/');
    this.authService.refreshUserProfile()
    this.subUserProfile = this.authService.userProfile$.subscribe(val => {
      this.userProfile = val
    })
  }

  toggleNavButtons(): void {
    this._showNavButtons$.next(!this._showNavButtons$.value);
  }

  ngOnDestroy() {
    if(this.subUserProfile) this.subUserProfile.unsubscribe()
    this.authService.userProfile$
  }
}
