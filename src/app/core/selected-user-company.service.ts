import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class SelectedUserCompanyService {

  constructor(private authService: AuthService) {

    // TODO: implement company selection
    this.authService.userProfile$.subscribe(userProfile => console.log('U profile: ', userProfile));
  }

}
