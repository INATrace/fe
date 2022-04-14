import { Component, OnInit } from '@angular/core';
import { take } from 'rxjs/operators';
import { PublicControllerService } from '../../../api/api/publicController.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-b2c-page',
  templateUrl: './b2c-page.component.html',
  styleUrls: ['./b2c-page.component.scss']
})
export class B2cPageComponent implements OnInit {

  uuid = this.route.snapshot.params.uuid;

  constructor(
      private route: ActivatedRoute,
      private publicController: PublicControllerService
  ) { }

  loading = true;

  fields;

  headerColor: string;
  footerColor: string;

  ngOnInit(): void {
    this.publicController.getPublicProductLabelValuesUsingGET(this.uuid).pipe(take(1)).subscribe({
      next: (value) => {
        this.fields = value.data.fields;
        this.headerColor = value.data.businessToCustomerSettings.headerColor;
        this.footerColor = value.data.businessToCustomerSettings.footerColor;
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

}
