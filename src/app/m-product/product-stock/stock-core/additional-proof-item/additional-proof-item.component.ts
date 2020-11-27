import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl } from '@angular/forms';
import { generateFormFromMetadata, defaultEmptyObject, dateAtMidnight, dateAtMidnightISOString, dbKey } from 'src/shared/utils';
import { environment } from 'src/environments/environment';
import { ChainActivityProof } from 'src/api-chain/model/chainActivityProof';
import { ChainActivityProofValidationScheme } from './validation';
import { EnumSifrant } from 'src/app/shared-services/enum-sifrant';
import { GenericEditableItemComponent } from 'src/app/shared/generic-editable-item/generic-editable-item.component';
import { ImageViewerComponent } from 'src/app/shared/image-viewer/image-viewer.component';
import { GlobalEventManagerService } from 'src/app/system/global-event-manager.service';
import { NgbModalImproved } from 'src/app/system/ngb-modal-improved/ngb-modal-improved.service';

@Component({
  selector: 'app-additional-proof-item',
  templateUrl: './additional-proof-item.component.html',
  styleUrls: ['./additional-proof-item.component.scss']
})
export class AdditionalProofItemComponent extends GenericEditableItemComponent<ChainActivityProof> {

  constructor(
    protected globalEventsManager: GlobalEventManagerService,
    protected router: Router,
    private modalService: NgbModalImproved
  ) {
    super(globalEventsManager)
  }

  @Input()
  disableDelete = false;

  @Input()
  formTitle = null;

  chainRootUrl: string = environment.chainRelativeFileUploadUrl;
  chainDownloadRootUrl: string = environment.chainRelativeFileDownloadUrl;

  ngOnInit(): void {
    if (dbKey(this.form.value) == null) {
      let today = dateAtMidnightISOString(new Date().toDateString());
      this.form.get('formalCreationDate').setValue(today);
    }
  }

  public generateForm(value: any): FormGroup {
    return generateFormFromMetadata(ChainActivityProof.formMetadata(), value, ChainActivityProofValidationScheme)
  }

  static createEmptyObject(): ChainActivityProof {
    let market = ChainActivityProof.formMetadata();
    return defaultEmptyObject(market) as ChainActivityProof
  }

  static emptyObjectFormFactory(): () => FormControl {
    return () => {
      let f = new FormControl(AdditionalProofItemComponent.createEmptyObject(), ChainActivityProofValidationScheme.validators)
      return f
    }
  }

  get addProofs() {
    let obj = {};
    obj['PAYMENT_LIST'] = $localize`:@@productLabelStockPurchaseOrdersModal.addProofs.paymentList:Payment list`;
    obj['PAYMENT_ORDER_APPROVED'] = $localize`:@@productLabelStockPurchaseOrdersModal.addProofs.paymentOrderApproved:Payment order approved`;
    obj['PAYMENT_PROOF'] = $localize`:@@productLabelStockPurchaseOrdersModal.addProofs.paymentProof:Payment proof`;
    obj['PURCHASE_SHEET'] = $localize`:@@productLabelStockPurchaseOrdersModal.addProofs.purchaseSheet:Purchase sheet`;
    obj['PURCHASE_SHEET_BANK_TRANSFER'] = $localize`:@@productLabelStockPurchaseOrdersModal.addProofs.purchaseSheetBankTransfer:Purchase sheet bank transfer`;
    obj['PURCHASE_SHEET_COLLECTOR'] = $localize`:@@productLabelStockPurchaseOrdersModal.addProofs.purchaseSheetCollector:Purchase sheet collector`;
    obj['RECEIPT'] = $localize`:@@productLabelStockPurchaseOrdersModal.addProofs.receipt:Receipt`;
    obj['RECEIPT_BANK_TRANSFER'] = $localize`:@@productLabelStockPurchaseOrdersModal.addProofs.receiptBankTransfer:Receipt bank transfer`;
    obj['RECEIPT_COLLECTOR'] = $localize`:@@productLabelStockPurchaseOrdersModal.addProofs.receiptCollector:Receipt collector`;
    return obj;
  }
  codebookAdditionalProofs = EnumSifrant.fromObject(this.addProofs);

  get name() {
    if (this.contentObject && this.contentObject.formalCreationDate && this.contentObject.type) {
      let tmpDate = new Date(this.contentObject.formalCreationDate);
      let day = tmpDate.getDate();
      let month = tmpDate.getMonth() + 1;
      let year = tmpDate.getFullYear();
      return this.addProofs[this.contentObject.type] + " (" + day + "." + month + "." + year + ")";
    }
    return ""
  }

  viewImage() {
    if (!this.form.get('document')) return;
    if (this.form.get('document').value && this.form.get('document').value.contentType.startsWith('image')) {

      const modalRef = this.modalService.open(ImageViewerComponent, { centered: true });
      Object.assign(modalRef.componentInstance, {
        modal: false,
        fileInfo: this.form.get('document').value,
        chainApi: true
      })

    }
  }

  isImageToShow() {
    return this.contentObject && this.contentObject.document && this.contentObject.document.storageKey && this.contentObject.document.contentType.startsWith('image');
  }
}
