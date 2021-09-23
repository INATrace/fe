import { Component, OnInit } from '@angular/core';
import { AuthorisedSideNavService } from '../services/authorised-side-nav.service';
import { AuthService } from 'src/app/core/auth.service';
import { Subscription } from 'rxjs';
import { AboutAppInfoService } from 'src/app/about-app-info.service';

@Component({
  selector: 'app-authorised-side-nav',
  templateUrl: './authorised-side-nav.component.html',
  styleUrls: ['./authorised-side-nav.component.scss']
})
export class AuthorisedSideNavComponent implements OnInit {

  model = 1;
  isAdmin: boolean = false;
  isConfirmedOnly: boolean = false;
  constructor(
    public sideNavService: AuthorisedSideNavService,
    private authService: AuthService,
    private aboutAppInfoService: AboutAppInfoService
  ) { }

  user = null
  sub: Subscription;

  ngOnInit() {
    this.sub = this.authService.userProfile$.subscribe(user => {
      this.user = user;
      this.isAdmin = user.role === 'ADMIN';
      this.isConfirmedOnly = user.status === 'CONFIRMED_EMAIL';
    })
  }

  ngOnDestroy() {
    if (this.sub) this.sub.unsubscribe();
  }

  aboutApp() {
    this.aboutAppInfoService.openAboutApp();
  }
}
