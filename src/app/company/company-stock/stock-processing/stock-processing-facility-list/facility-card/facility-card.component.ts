import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { SemiProductService } from 'src/api-chain/api/semiProduct.service';
import { CodebookTranslations } from 'src/app/shared-services/codebook-translations';
import { ApiFacility } from '../../../../../../api/model/apiFacility';
import { ApiProcessingAction } from '../../../../../../api/model/apiProcessingAction';
import { ProcessingActionControllerService } from '../../../../../../api/api/processingActionController.service';
import { ApiPaginatedResponseApiProcessingAction } from '../../../../../../api/model/apiPaginatedResponseApiProcessingAction';
import StatusEnum = ApiPaginatedResponseApiProcessingAction.StatusEnum;

@Component({
  selector: 'app-facility-card',
  templateUrl: './facility-card.component.html',
  styleUrls: ['./facility-card.component.scss']
})
export class FacilityCardComponent implements OnInit {

  @Input()
  facility: ApiFacility;

  @Input()
  companyId: number;

  description = '';

  actions: ApiProcessingAction[] = [];

  menuOptions: { id: any; name: string }[] = [];

  constructor(
    private chainSemiProductService: SemiProductService,
    private processingActionControllerService: ProcessingActionControllerService,
    private router: Router,
    private codebookTranslations: CodebookTranslations
  ) { }

  ngOnInit(): void {
    this.semiProductsIncluded().then();
    this.setProcessingActions().then();
  }

  whereIsIt(facility: ApiFacility) {

    if (facility.facilityLocation && facility.facilityLocation.address && facility.facilityLocation.address.country) {

      if (facility.facilityLocation.address.country.code === 'RW') {
        return facility.facilityLocation.address.village;
      }
      else {
        return facility.facilityLocation.address.city;
      }
    }
  }

  facilityType() {
    if (this.facility.facilityType.code === 'STORAGE') { return 'af-card-icon-shape af-card-icon-shape--home'; }
    else if (this.facility.facilityType.code === 'DRYING_BED') { return 'af-card-icon-shape af-card-icon-shape--proto'; }
    else if (this.facility.facilityType.code === 'HULLING_STATION') { return 'af-card-icon-shape af-card-icon-shape--cogwheel'; }
    else if (this.facility.facilityType.code === 'WASHING_STATION') { return 'af-card-icon-shape af-card-icon-shape--seedling'; }
    else { return 'af-card-icon-shape af-card-icon-shape--cogwheel'; }
  }

  facilityTypeColor() {
    if (this.facility.facilityType.code === 'STORAGE' && !this.facility.isPublic) { return 'af-card-section-content af-card-section-content--cyan'; }
    else if (this.facility.facilityType.code === 'STORAGE') { return 'af-card-section-content af-card-section-content--green'; }
    else if (this.facility.facilityType.code === 'DRYING_BED') { return 'af-card-section-content af-card-section-content--yellow'; }
    else if (this.facility.facilityType.code === 'HULLING_STATION') { return 'af-card-section-content af-card-section-content--cyan'; }
    else if (this.facility.facilityType.code === 'WASHING_STATION' && this.facility.isCollectionFacility) { return 'af-card-section-content af-card-section-content--red'; }
    else if (this.facility.facilityType.code === 'WASHING_STATION') { return 'af-card-section-content af-card-section-content--orange'; }
    else { return 'af-card-section-content af-card-section-content--cyan'; }
  }

  async semiProductsIncluded() {
    for (const item of this.facility.facilitySemiProductList) {
      this.description += this.translateName(item) + ', ';
    }

    if (this.description.length > 0) {
      this.description = this.description.substring(0, this.description.length - 2);
    }
  }

  async setProcessingActions() {

    const res = await this.processingActionControllerService
      .listProcessingActionsByCompanyUsingGET(this.companyId).pipe(take(1)).toPromise();

    if (res && res.status === StatusEnum.OK && res.data) {
      this.actions = res.data.items;
      this.setMenuOptions();
    }
  }

  setMenuOptions() {
    for (const action of this.actions) {
      for (const facilitySemiProd of this.facility.facilitySemiProductList) {
        if (action.inputSemiProduct.id === facilitySemiProd.id) {
          this.menuOptions.push({
            id: action.id,
            name: this.codebookTranslations.translate(action, 'name')
          });
          break;
        }
      }
    }
  }

  goTo(actionId) {

    if (actionId === 'PURCHASE_ORDER') {
      this.router.navigate(['my-stock', 'purchases', 'facility', this.facility.id, 'processing', 'new']).then();
      return;
    }
    this.router.navigate(['my-stock', 'processing', actionId, 'facility', this.facility.id, 'new']).then();
  }

  translateName(obj) {
    return this.codebookTranslations.translate(obj, 'name');
  }
}
