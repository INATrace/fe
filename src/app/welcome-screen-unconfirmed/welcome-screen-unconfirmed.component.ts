import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { AuthService } from '../core/auth.service';
import { ApiUserGet } from 'src/api/model/apiUserGet';
import { environment } from 'src/environments/environment';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-welcome-screen-unconfirmed',
  templateUrl: './welcome-screen-unconfirmed.component.html',
  styleUrls: ['./welcome-screen-unconfirmed.component.scss']
})
export class WelcomeScreenUnconfirmedComponent implements OnInit, OnDestroy {

  appName: string = environment.appName;
  user: ApiUserGet;
  companyId: number = null;
  sub: Subscription;

  constructor(
    public activeModal: NgbActiveModal,
    private router: Router,
    private authService: AuthService,
    ) { }


  ngOnInit(): void {
    this.sub = this.authService.userProfile$.subscribe(user => {
      this.user = user;
      if (this.user.companyIds && this.user.companyIds.length > 0) this.companyId = this.user.companyIds[0];
    })
  }

  ngOnDestroy(): void {
    if(this.sub) this.sub.unsubscribe();
  }

  closeModalAndRedirect(path: string, comId: number) {
    this.router.navigate([path + (!!comId ? comId : "")]);
    this.activeModal.close();
  }

  logout() {
    this.activeModal.close();
    this.authService.logout();

  }
}
