import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { take } from 'rxjs/operators';
import { PublicControllerService } from 'src/api/api/publicController.service';
import { Subscription } from 'rxjs';
import { GlobalEventManagerService } from 'src/app/core/global-event-manager.service';

@Component({
  selector: 'app-front-page-first',
  templateUrl: './front-page-first.component.html',
  styleUrls: ['./front-page-first.component.scss']
})
export class FrontPageFirstComponent implements OnInit, OnDestroy {

  uuid = this.route.snapshot.params.uuid;
  qrTag = this.route.snapshot.params.qrTag;

  productName: string = null;
  unpublishedText = '';
  published = true;
  sub: Subscription;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private publicController: PublicControllerService,
    private globalEventManager: GlobalEventManagerService
  ) { }

  ngOnInit(): void {
    this.initializeUnpublishedText().then();
    this.initLabel().then();
    this.sub = this.globalEventManager.isProductLabelPublishedEmitter.subscribe(
      uuid => {
        if (uuid === this.uuid) {
          this.published = false;
        }
      },
      () => { }
    );
  }

  ngOnDestroy(): void {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }

  goToJourney() {
    this.router.navigate(['/', 'p-cd', this.uuid, this.qrTag, 'journey']).then();
  }

  onSwipeLeft() {
    this.goToJourney();
  }

  async initLabel() {
    const res = await this.publicController.getPublicProductLabelValuesUsingGET(this.uuid).pipe(take(1)).toPromise();
    if (res && res.status === 'OK') {
      for (const item of res.data.fields) {
        if (item.name === 'name') {
          this.productName = item.value;
        }
      }
    }
  }

  async initializeUnpublishedText() {
    const resp = await this.publicController
      .getPublicGlobalSettingsUsingGET(this.globalEventManager.globalSettingsKeys('UNPUBLISHED_PRODUCT_LABEL_TEXT')).pipe(take(1)).toPromise();
    if (resp && resp.data && resp.data.value) {
      this.unpublishedText = resp.data.value;
    }
  }

}
