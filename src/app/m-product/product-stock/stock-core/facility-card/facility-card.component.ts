import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { faThumbtack } from '@fortawesome/free-solid-svg-icons';
import { take } from 'rxjs/operators';
import { ProcessingActionService } from 'src/api-chain/api/processingAction.service';
import { SemiProductService } from 'src/api-chain/api/semiProduct.service';
import { ChainFacility } from 'src/api-chain/model/chainFacility';
import { ChainProcessingAction } from 'src/api-chain/model/chainProcessingAction';
import { CodebookTranslations } from 'src/app/shared-services/codebook-translations';
import { dbKey } from 'src/shared/utils';

@Component({
  selector: 'app-facility-card',
  templateUrl: './facility-card.component.html',
  styleUrls: ['./facility-card.component.scss']
})
export class FacilityCardComponent implements OnInit {

  @Input()
  facility: ChainFacility;
  @Input()
  chainProductId: string;
  @Input()
  productId: number;
  desc: string = "";

  // Currently not used
  // @Output() onSelectedFacility = new EventEmitter<ChainFacility>()

  actions: ChainProcessingAction[] = [];
  constructor(
    private chainSemiProductService: SemiProductService,
    private chainProcessingActionService: ProcessingActionService,
    private router: Router,
    private codebookTranslations: CodebookTranslations
  ) { }

  ngOnInit(): void {
    this.semiProductsIncluded();
    this.setProcessingActions();
  }

  whereIsIt(facility) {
    if (facility.location && facility.location.country) {
      if (facility.location.country.code === 'RW') {
        return facility.location.village;
      }
      else {
        return facility.location.city;
      }
    }
  }

  facilityType() {
    if (this.facility.facilityType.id === 'STORAGE') return 'af-card-icon-shape af-card-icon-shape--home'
    else if (this.facility.facilityType.id === 'DRYING_BED') return 'af-card-icon-shape af-card-icon-shape--proto'
    else if (this.facility.facilityType.id === 'HULLING_STATION') return 'af-card-icon-shape af-card-icon-shape--cogwheel'
    else if (this.facility.facilityType.id === 'WASHING_STATION') return 'af-card-icon-shape af-card-icon-shape--seedling'
    else return 'af-card-icon-shape af-card-icon-shape--cogwheel'
  }

  facilityTypeColor() {
    if (this.facility.facilityType.id === 'STORAGE' && !this.facility.isPublic) return 'af-card-section-content af-card-section-content--cyan'
    else if (this.facility.facilityType.id === 'STORAGE') return 'af-card-section-content af-card-section-content--green'
    else if (this.facility.facilityType.id === 'DRYING_BED') return 'af-card-section-content af-card-section-content--yellow'
    else if (this.facility.facilityType.id === 'HULLING_STATION') return 'af-card-section-content af-card-section-content--cyan'
    else if (this.facility.facilityType.id === 'WASHING_STATION' && this.facility.isCollectionFacility) return 'af-card-section-content af-card-section-content--red'
    else if (this.facility.facilityType.id === 'WASHING_STATION') return 'af-card-section-content af-card-section-content--orange'
    else return 'af-card-section-content af-card-section-content--cyan'
  }

  async semiProductsIncluded() {
    for (let item of this.facility.semiProductIds) {
      let res = await this.chainSemiProductService.getSemiProduct(item).pipe(take(1)).toPromise();
      if (res && res.status === "OK" && res.data) {
        this.desc += this.translateName(res.data) + ", ";
      }
    }
    if (this.desc.length > 0) this.desc = this.desc.substring(0, this.desc.length - 2);
  }

  async setProcessingActions() {
    let res = await this.chainProcessingActionService.listProcessingActionsForProductAndOrganization(this.chainProductId, this.facility.organizationId).pipe(take(1)).toPromise();
    if (res && res.status === "OK" && res.data) {
      this.actions = res.data.items;
      this.setMenuOptions();
    }
  }

  menuOptions: any[] = [
    // {
    //   name: $localize `:@@facilityCard.actions.listProcessingOrders: List processing orders`,
    //   _id: 'LIST_PROCESSING_ORDERS'
    // }
  ];
  setMenuOptions() {
    for (let action of this.actions) {
      for (let facSemi of this.facility.semiProductIds) {
        if (action.inputSemiProductId === facSemi) {
          this.menuOptions.push({
            name: this.codebookTranslations.translate(action, 'name'),
            _id: dbKey(action)
          })
          break;
        }
      }
    }
    // if (this.facility.isCollectionFacility) {
    //   this.menuOptions.push({
    //     name: $localize `:@@facilityCard.actions.addPurchaseOrder: Add purchase order`,
    //     _id: 'PURCHASE_ORDER'
    //   })
    // }
  }

  goTo(actionId) {
    // if (actionId === 'LIST_PROCESSING_ORDERS') {
    //   this.onSelectedFacility.next(this.facility)
    //   return
    // }
    if (actionId === 'PURCHASE_ORDER') {
      this.router.navigate(['product-labels', this.productId, 'stock', 'purchases', 'facility', dbKey(this.facility), 'processing', 'new']);
      return
    }
    this.router.navigate(['product-labels', this.productId, 'stock', 'processing', actionId, 'facility', dbKey(this.facility), 'new']);
  }

  dbKey = dbKey

  faThumbtack = faThumbtack

  translateName(obj) {
    return this.codebookTranslations.translate(obj, 'name');
  }
}
