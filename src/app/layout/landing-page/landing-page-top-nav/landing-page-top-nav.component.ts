import { Component, OnDestroy, OnInit } from '@angular/core';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { BehaviorSubject, Subscription } from 'rxjs';
import { AuthService } from 'src/app/system/auth.service';

@Component({
  selector: 'app-landing-page-top-nav',
  templateUrl: './landing-page-top-nav.component.html',
  styleUrls: ['./landing-page-top-nav.component.scss']
})
export class LandingPageTopNavComponent implements OnInit, OnDestroy {

  showNavButtons$: BehaviorSubject<boolean>;

  public loggedId;
  public userProfile;
  constructor(
    public authService: AuthService
  ) { }

  faUser = faUser;
  subUserProfile: Subscription;

  ngOnInit(): void {
    this.showNavButtons$ = new BehaviorSubject<boolean>(false);
    this.authService.refreshUserProfile();
    this.subUserProfile = this.authService.userProfile$.subscribe(val => {
      this.userProfile = val;
    });
  }

  toggleNavButtons(): void {
    this.showNavButtons$.next(!this.showNavButtons$.value);
  }

  ngOnDestroy() {
    if (this.subUserProfile) { this.subUserProfile.unsubscribe(); }
  }
}
