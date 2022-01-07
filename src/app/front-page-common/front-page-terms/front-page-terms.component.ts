import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PublicControllerService } from 'src/api/api/publicController.service';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-front-page-terms',
  templateUrl: './front-page-terms.component.html',
  styleUrls: ['./front-page-terms.component.scss']
})
export class FrontPageTermsComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private publicController: PublicControllerService
  ) { }

  uuid = this.route.snapshot.params.uuid;
  title = $localize`:@@frontPage.terms.title:Terms of use`;

  termsText: string = null;

  ngOnInit(): void {
    this.initLabel().then();
  }

  async initLabel() {
    const res = await this.publicController.getPublicProductLabelValuesUsingGET(this.uuid).pipe(take(1)).toPromise();
    if (res && res.status === 'OK') {
      this.prepareData(res.data.fields);
    }
  }

  prepareData(data) {
    for (const item of data) {
      if (item.name === 'settings.termsOfUseText') {
        this.termsText = item.value;
      }
    }
  }
}
