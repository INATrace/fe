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

  ngOnInit(): void {
    this.initLabel();
  }

  async initLabel() {
    let res = await this.publicController.getPublicProductLabelValuesUsingGET(this.uuid).pipe(take(1)).toPromise();
    if (res && res.status === "OK") {
      this.prepareData(res.data.fields);
    }
  }

  termsText: string = null;
  prepareData(data) {
    for (let item of data) {
      if (item.name === "settings.termsOfUseText") {
        this.termsText = item.value;
      }
    }
  }
}
