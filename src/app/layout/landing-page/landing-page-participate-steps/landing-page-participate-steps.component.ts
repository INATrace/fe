import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-landing-page-participate-steps',
  templateUrl: './landing-page-participate-steps.component.html',
  styleUrls: ['./landing-page-participate-steps.component.scss']
})
export class LandingPageParticipateStepsComponent implements OnInit {

  _isLandingPage$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);

  constructor(
    private router: Router
  ) { }

  ngOnInit(): void {
    this._isLandingPage$.next(this.router.url === '/');
  }

  goToGetStarted() {
    this.router.navigate(['/','products','new']);
  }
  goToGetRegister() {
    this.router.navigate(['/', 'register']);
  }
}
