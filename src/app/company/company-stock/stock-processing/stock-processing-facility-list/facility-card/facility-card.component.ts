import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiFacility } from '../../../../../../api/model/apiFacility';
import { ApiProcessingAction } from '../../../../../../api/model/apiProcessingAction';

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

  @Input()
  actions: ApiProcessingAction[] = [];

  description = '';

  menuOptions: { id: any; name: string }[] = [];

  constructor(
    private router: Router
  ) { }

  ngOnInit(): void {
    this.semiAndFinalProductsIncluded().then();
    this.setMenuOptions();
  }

  whereIsIt(facility: ApiFacility) {

    if (facility.facilityLocation && facility.facilityLocation.address && facility.facilityLocation.address.country) {

      if (facility.facilityLocation.address.country.code === 'RW') {
        return facility.facilityLocation.address.village;
      } else if (facility.facilityLocation.address.country.code === 'HN') {
        return facility.facilityLocation.address.hondurasVillage;
      }
      else {
        return facility.facilityLocation.address.city;
      }
    }
  }

  facilityType() {

    switch (this.facility.facilityType.code) {
      case 'WASHING_STATION':
      case 'BENEFICIO_HUMEDO':
        return 'af-card-icon-shape af-card-icon-shape--seedling';
      case 'DRYING_BED':
        return 'af-card-icon-shape af-card-icon-shape--proto';
      case 'STORAGE':
      case 'ALMACEN':
      case 'GREEN_COFFEE_STORAGE':
      case 'ALMACEN_CAFE_ORO':
      case 'ROASTED_COFFEE_STORAGE':
        return 'af-card-icon-shape af-card-icon-shape--home';
      case 'HULLING_STATION':
      case 'MAQUILADO_CAFE':
      case 'BENEFICIO_SECO':
        return 'af-card-icon-shape af-card-icon-shape--cogwheel';
      default:
        return 'af-card-icon-shape af-card-icon-shape--cogwheel';
    }
  }

  facilityTypeColor() {

    switch (this.facility.facilityType.code) {
      case 'WASHING_STATION':
      case 'BENEFICIO_HUMEDO':
        if (this.facility.isCollectionFacility) {
          return 'af-card-section-content af-card-section-content--red';
        } else {
          return 'af-card-section-content af-card-section-content--orange';
        }
      case 'DRYING_BED':
        return 'af-card-section-content af-card-section-content--yellow';
      case 'STORAGE':
      case 'ALMACEN':
        return 'af-card-section-content af-card-section-content--cyan';
      case 'HULLING_STATION':
      case 'MAQUILADO_CAFE':
      case 'BENEFICIO_SECO':
        return 'af-card-section-content af-card-section-content--cyan';
      case 'GREEN_COFFEE_STORAGE':
      case 'ALMACEN_CAFE_ORO':
      case 'ROASTED_COFFEE_STORAGE':
        if (this.facility.isPublic) {
          return 'af-card-section-content af-card-section-content--green';
        } else {
          return 'af-card-section-content af-card-section-content--cyan';
        }
      default:
        return 'af-card-section-content af-card-section-content--cyan';
    }
  }

  private async semiAndFinalProductsIncluded() {

    for (const item of this.facility.facilitySemiProductList) {
      this.description += item.name + ', ';
    }

    for (const item of this.facility.facilityFinalProducts) {
      this.description += `${item.name} (${item.product.name})` + ', ';
    }

    if (this.description.length > 0) {
      this.description = this.description.substring(0, this.description.length - 2);
    }
  }

  private setMenuOptions() {

    for (const action of this.actions) {

      const facilitySemiProd = this.facility.facilitySemiProductList.find(f => f.id === action.inputSemiProduct?.id);
      if (facilitySemiProd) {
        this.menuOptions.push({
          id: action.id,
          name: action.name
        });
      }

      const facilityFinalProd = this.facility.facilityFinalProducts.find(f => f.id === action.inputFinalProduct?.id);
      if (facilityFinalProd) {
        this.menuOptions.push({
          id: action.id,
          name: action.name
        });
      }
    }
  }

  goTo(actionId) {
    this.router.navigate(['my-stock', 'processing', actionId, 'facility', this.facility.id, 'new']).then();
  }

}
