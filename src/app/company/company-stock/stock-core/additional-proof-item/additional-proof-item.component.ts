import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroup } from '@angular/forms';
import { dateAtMidnightISOString, defaultEmptyObject, generateFormFromMetadata } from 'src/shared/utils';
import { environment } from 'src/environments/environment';
import { ApiActivityProofValidationScheme } from './validation';
import { EnumSifrant } from 'src/app/shared-services/enum-sifrant';
import { GenericEditableItemComponent } from 'src/app/shared/generic-editable-item/generic-editable-item.component';
import { ImageViewerComponent } from 'src/app/shared/image-viewer/image-viewer.component';
import { GlobalEventManagerService } from 'src/app/core/global-event-manager.service';
import { NgbModalImproved } from 'src/app/core/ngb-modal-improved/ngb-modal-improved.service';
import { ApiActivityProof } from '../../../../../api/model/apiActivityProof';

@Component({
  selector: 'app-additional-proof-item',
  templateUrl: './additional-proof-item.component.html',
  styleUrls: ['./additional-proof-item.component.scss']
})
export class AdditionalProofItemComponent extends GenericEditableItemComponent<ApiActivityProof> implements OnInit {

  constructor(
    protected globalEventsManager: GlobalEventManagerService,
    protected router: Router,
    private modalService: NgbModalImproved
  ) {
    super(globalEventsManager);
  }

  @Input()
  disableDelete = false;

  @Input()
  formTitle = null;

  codebookAdditionalProofs = EnumSifrant.fromObject(this.addProofs);

  static createEmptyObject(): ApiActivityProof {
    const object = ApiActivityProof.formMetadata();
    return defaultEmptyObject(object) as ApiActivityProof;
  }

  static emptyObjectFormFactory(): () => FormControl {
    return () => {
      return new FormControl(AdditionalProofItemComponent.createEmptyObject(), ApiActivityProofValidationScheme.validators);
    };
  }

  get addProofs() {
    const obj = {};
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

  ngOnInit(): void {
    if (this.form.value?.id == null) {
      const today = dateAtMidnightISOString(new Date().toDateString());
      this.form.get('formalCreationDate').setValue(today);
    }
  }

  public generateForm(value: any): FormGroup {
    return generateFormFromMetadata(ApiActivityProof.formMetadata(), value, ApiActivityProofValidationScheme);
  }

  get name() {
    if (this.contentObject && this.contentObject.formalCreationDate && this.contentObject.type) {
      const tmpDate = new Date(this.contentObject.formalCreationDate);
      const day = tmpDate.getDate();
      const month = tmpDate.getMonth() + 1;
      const year = tmpDate.getFullYear();
      return this.addProofs[this.contentObject.type] + ' (' + day + '.' + month + '.' + year + ')';
    }
    return '';
  }

  viewImage() {

    if (!this.form.get('document')) { return; }

    if (this.form.get('document').value && this.form.get('document').value.contentType.startsWith('image')) {

      const modalRef = this.modalService.open(ImageViewerComponent, { centered: true });
      Object.assign(modalRef.componentInstance, {
        modal: false,
        fileInfo: this.form.get('document').value
      });
    }
  }

  isImageToShow() {
    return this.contentObject && this.contentObject.document && this.contentObject.document.storageKey && this.contentObject.document.contentType.startsWith('image');
  }

}
