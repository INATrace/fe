import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { map, shareReplay, switchMap, catchError } from 'rxjs/operators';
import { UserControllerService } from 'src/api/api/userController.service';
import { of, Subscription } from 'rxjs';

@Component({
  selector: 'app-confirm-email',
  templateUrl: './confirm-email.component.html',
  styleUrls: ['./confirm-email.component.scss']
})
export class ConfirmEmailComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userController: UserControllerService
  ) { }

  activationToken$ = this.route.paramMap.pipe(
    map(m => m.get('token')),
    shareReplay(1)
  )

  sub: Subscription;
  ngOnInit(): void {
    this.sub = this.activationToken$.pipe(
      switchMap(token => this.userController.confirmEmailUsingPOST({ token: token }).pipe(
        catchError(val => of('_ERROR_'))
      ))
    ).subscribe(resp => {
      if(resp != '_ERROR_') {
        this.userController.getProfileForUserUsingGET()
          .subscribe(val => {
            localStorage.setItem('userProfile', JSON.stringify(val.data));
            this.router.navigate(['home']);
          }, error => {
            // console.log(error);
            localStorage.setItem('userProfile', null);
          })
      } else {
        // console.log("ACCOUNT NOT CONFIRMED!")
      }
    })
  }
  ngOnDestroy(){
    if(this.sub) this.sub.unsubscribe();
  }

}
