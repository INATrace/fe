import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { PublicControllerService } from 'src/api/api/publicController.service';
import { environment } from 'src/environments/environment';
import { take } from 'rxjs/operators';
import { ApiLogRequest } from 'src/api/model/apiLogRequest';


@Component({
  selector: 'app-qr-code-redirect',
  templateUrl: './qr-code-redirect.component.html',
  styleUrls: ['./qr-code-redirect.component.scss']
})
export class QrCodeRedirectComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private publicController: PublicControllerService
  ) { }

  ngOnInit(): void {
    let labelId = this.route.snapshot.paramMap.get('uuid');
    let urlA = this.router.url.split("/");
    if (urlA.length >= 2) {
      if (urlA[1] === "q-cd") {
        let soId = this.route.snapshot.paramMap.get('soid');
        this.router.navigate(['p-cd', labelId, soId], { replaceUrl: true });
      }
      if (urlA[1] === "q") {
        this.router.navigate(['p', labelId], { replaceUrl: true });
      }
    }
    this.publicController.logPublicRequestUsingPOST({ token: environment.tokenForPublicLogRoute, type: ApiLogRequest.TypeEnum.VISITQR, logKey: labelId})
    .pipe(take(1)).toPromise();
  }

}
