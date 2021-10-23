import { Component, OnInit } from '@angular/core';
import { NgbModalImproved } from '../../../core/ngb-modal-improved/ngb-modal-improved.service';
import { ActivatedRoute } from '@angular/router';
import { FinalProductDetailModalComponent } from '../final-product-detail-modal/final-product-detail-modal.component';

@Component({
  selector: 'app-final-product',
  templateUrl: './final-product.component.html',
  styleUrls: ['./final-product.component.scss']
})
export class FinalProductComponent implements OnInit {

  title = $localize`:@@productLabelFinalProduct.title.finalProducts:Final products`;

  listReload: boolean;
  productId: number;
  allFinalProducts = 0;
  showedFinalProducts = 0;

  constructor(
      private route: ActivatedRoute,
      private modalService: NgbModalImproved,
  ) { }

  ngOnInit(): void {
    this.productId = this.route.snapshot.params.id;
  }

  newFinalProduct(){
    this.modalService.open(FinalProductDetailModalComponent, {
      centered: true
    }, {
      productId: this.productId,
      isUpdate: false,
      finalProduct: null,
      saveCallback: () => {
        // Trigger 'ngOnChanges' in list component to reload the list
        this.listReload = !this.listReload;
      }
    });
  }

  onShowFinalProducts(event) {
    this.showedFinalProducts = event;
  }

  onCountAllFinalProducts(event) {
    this.allFinalProducts = event;
  }

}
