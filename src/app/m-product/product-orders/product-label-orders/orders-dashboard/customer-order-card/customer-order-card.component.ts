import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { faThumbtack } from '@fortawesome/free-solid-svg-icons';
import { ProcessingActionService } from 'src/api-chain/api/processingAction.service';
import { SemiProductService } from 'src/api-chain/api/semiProduct.service';
import { ChainProcessingAction } from 'src/api-chain/model/chainProcessingAction';
import { ChainProductOrder } from 'src/api-chain/model/chainProductOrder';
import { CodebookTranslations } from 'src/app/shared-services/codebook-translations';
import { dbKey, formatDateWithDots } from 'src/shared/utils';

@Component({
  selector: 'app-customer-order-card',
  templateUrl: './customer-order-card.component.html',
  styleUrls: ['./customer-order-card.component.scss']
})
export class CustomerOrderCardComponent implements OnInit {

  @Input()
  order: ChainProductOrder;
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
    private route: ActivatedRoute,
    private codebookTranslations: CodebookTranslations
  ) { }

  ngOnInit(): void {
  }

  orderIcon() {
    return 'af-card-icon-shape af-card-icon-shape--seedling'
  }

  formatDate(productionDate) {
    if (productionDate) return formatDateWithDots(productionDate);
    return "";
  }

  cardColor() {
    return this.order.open
      ? 'af-card-section-content af-card-section-content--red'
      : 'af-card-section-content af-card-section-content--green'
  }

  dbKey = dbKey

  faThumbtack = faThumbtack

  womensOnlyText(order: ChainProductOrder) {
    if (!order) return ""
    if (order.requiredwomensOnly) return $localize`:@@orderCard.womensOnly.yes: Yes`
    return $localize`:@@orderCard.womensOnly.no: No`
  }

  translateName(obj) {
    return this.codebookTranslations.translate(obj, 'name');
  }

  onClick() {
    // console.log("ON CLICK")
    this.router.navigate([dbKey(this.order), 'order-explore', 'details'], { relativeTo: this.route.parent })
  }

  get ordersText() {
    return this.order.items.map(itm => {
      return `${ itm.semiProduct.name } (${ itm.measurementUnitType.weight * itm.totalQuantity } kg)`
    }).join(', ')
  }

  get weightText() {
    let sum = this.order.items.map(itm => itm.measurementUnitType.weight * itm.totalQuantity).reduce((a, b) => a + b, 0)
    return `${ sum } kg`
  }
}
