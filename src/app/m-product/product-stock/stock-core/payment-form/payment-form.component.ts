import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { OrganizationService } from 'src/api-chain/api/organization.service';
import { StockOrderService } from 'src/api-chain/api/stockOrder.service';
import { UserService } from 'src/api-chain/api/user.service';
import { ChainOrganization } from 'src/api-chain/model/chainOrganization';
import { ChainUserCustomer } from 'src/api-chain/model/chainUserCustomer';
import { ProductControllerService } from 'src/api/api/productController.service';
import { ActiveUserCustomersByOrganizationService } from 'src/app/shared-services/active-user-customers-by-organization.service';
import { AssociatedCompaniesService } from 'src/app/shared-services/associated-companies.service';
import { EnumSifrant } from 'src/app/shared-services/enum-sifrant';
import { environment } from 'src/environments/environment';
import { dbKey, formatDateWithDotsAtHour } from 'src/shared/utils';

@Component({
  selector: 'app-payment-form',
  templateUrl: './payment-form.component.html',
  styleUrls: ['./payment-form.component.scss']
})
export class PaymentFormComponent implements OnInit {

  @Input()
  form: FormGroup;
  @Input()
  payableFromForm = new FormControl(null);
  @Input()
  submitted: boolean = false;
  @Input()
  searchCompanies = new FormControl(null);
  @Input()
  searchFarmers = new FormControl(null);
  @Input()
  searchCollectors = new FormControl(null);
  @Input()
  collectorsCodebook: ActiveUserCustomersByOrganizationService;
  @Input()
  farmersCodebook: ActiveUserCustomersByOrganizationService;
  @Input()
  orderReferenceForm: FormControl = new FormControl(null);
  @Input()
  viewOnly: boolean = false;
  @Input()
  openBalance;
  @Input()
  purchased;
  @Input()
  mode: 'PURCHASE' | 'CUSTOMER' = 'PURCHASE';

  readonlyPaymentType: boolean = false;
  searchPreferredWayOfPayment = new FormControl(null);

  uploaderLabel: string = "";

  chainRootUrl: string = environment.chainRelativeFileUploadUrl;
  chainDownloadRootUrl: string = environment.chainRelativeFileDownloadUrl;

  confirmedByUser: string = null;
  confirmedAt: string = null;

  subConditional: Subscription;
  associatedCompaniesService: AssociatedCompaniesService;
  constructor(
    private chainUserService: UserService,
    private chainOrganizationService: OrganizationService,
    private stockOrderService: StockOrderService,
    private productController: ProductControllerService,
    private route: ActivatedRoute
  ) { }

  uploaderLabelStr = $localize`:@@paymentForm.attachment-uploader.receipt.label:Signed receipt (PDF/PNG/JPG)`;
  uploaderLabelRequiredStr = $localize`:@@paymentForm.attachment-uploader.receipt.required.label:Signed receipt (PDF/PNG/JPG)*`;
  labelDocumentStr = $localize`:@@paymentForm.attachment-uploader.document.label:Document (PDF/PNG/JPG)`;
  labelDocumentRequiredStr = $localize`:@@paymentForm.attachment-uploader.document.required.label:Document (PDF/PNG/JPG)*`;

  async initInitialData() {
    // if (!this.openBalance || !this.purchased) {
    let resp = await this.stockOrderService.getStockOrderById(this.form.get('stockOrderId').value).pipe(take(1)).toPromise();
    if (resp && resp.status === "OK" && resp.data && resp.data) {
      let data = resp.data
      this.form.get('productionDate').setValue(data.productionDate)
      if (this.mode === 'PURCHASE') {
        this.form.get('preferredWayOfPayment').setValue(data.preferredWayOfPayment)
        this.searchPreferredWayOfPayment.setValue(data.preferredWayOfPayment)
        this.searchPreferredWayOfPayment.disable();

        if (data.preferredWayOfPayment == 'CASH_VIA_COLLECTOR' && this.form && !this.form.get('paymentType').value) {
          this.form.get('paymentType').setValue('BANK')
          this.form.get('amountPaidToTheCollector').setValidators([Validators.required])
        } else if (data.preferredWayOfPayment != 'CASH_VIA_COLLECTOR' && this.form && !this.form.get('paymentType').value) {
          this.form.get('amountPaidToTheCollector').setValue(0)
          this.form.get('amountPaidToTheCollector').disable()
        }
        if (!this.openBalance) {
          this.openBalance = data.balance
        }
        if (!this.purchased) {
          this.purchased = data.fullfilledQuantity
        }
      } else {
        this.form.get('paymentType').setValue('BANK');
        this.readonlyPaymentType = true;
      }
    }

    this.associatedCompaniesService = new AssociatedCompaniesService(this.productController, this.route.snapshot.params.id, null)
    // }
  }


  ngOnInit(): void {
    this.initInitialData().then(() => {


      this.uploaderLabel = this.uploaderLabelStr
      if (this.form.value && this.form.value.paymentStatus === "CONFIRMED") {
        this.viewOnly = true;
        this.setConfirmed();
      }
      if (this.mode === 'PURCHASE') {
        if (!this.form.get('paymentPurposeType').value) {
          this.form.get('paymentPurposeType').setValue('FIRST_INSTALLMENT')
        }
        this.searchCompanies.disable();
        this.searchCollectors.disable();
        this.searchFarmers.disable();
        if (this.form.get('paymentPurposeType').value == 'FIRST_INSTALLMENT') {
          this.uploaderLabel = this.uploaderLabelRequiredStr;
        }
      } else {
        this.searchCollectors.disable();
        this.searchFarmers.disable();
      }
      if (this.viewOnly) {
        this.form.get('paymentType').disable();
        this.form.get('paymentPurposeType').disable();
        this.form.get('receiptDocument').disable();
        this.form.get('formalCreationTime').disable();
        this.form.get('receiptDocumentType').disable();
        this.searchCompanies.disable();
        this.searchCollectors.disable();
        this.searchFarmers.disable();
        if (this.mode === 'CUSTOMER') {
          this.form.get('receiptDocumentType').setValue('RECEIPT');
          this.form.get('receiptDocumentType').disable();
        }
      } else {
        if (this.searchCollectors.value) {
          this.form.get('receiptDocumentType').setValue(null);
          this.uploaderLabel = this.labelDocumentStr;
          if (this.form.get('paymentPurposeType').value == 'FIRST_INSTALLMENT') {
            this.uploaderLabel = this.labelDocumentRequiredStr;
          }
        } else {
          this.form.get('receiptDocumentType').setValue('RECEIPT');
          this.form.get('receiptDocumentType').disable();
        }

        if (this.mode === 'PURCHASE') {
          if (this.openBalance > 0) {
            if (this.searchPreferredWayOfPayment.value === 'CASH_VIA_COLLECTOR') this.form.get('amountPaidToTheCollector').setValue(this.openBalance);
            else this.form.get('amount').setValue(this.openBalance);
          }
        }
      }
    })

    // this.subConditional = this.form.get('paymentType').valueChanges.subscribe(val => {
    //   if (val === 'CASH') {
    //     this.form.controls['receiptDocument'].setValidators([Validators.required]);
    //     this.form.controls['receiptDocument'].updateValueAndValidity();
    //   } else {
    //     this.form.controls['receiptDocument'].clearValidators();
    //     this.form.controls['receiptDocument'].updateValueAndValidity();
    //   }
    // });
  }

  ngOnDestroy() {
    if (this.subConditional) this.subConditional.unsubscribe();
  }

  changeReceiptDocumentLabel() {
    if (!this.viewOnly && this.searchCollectors.value) {
      if (this.form.get('paymentPurposeType').value == 'FIRST_INSTALLMENT') {
        this.uploaderLabel = this.labelDocumentRequiredStr;
      } else {
        this.uploaderLabel = this.labelDocumentStr;
      }
    } else {
      if (this.form.get('paymentPurposeType').value == 'FIRST_INSTALLMENT') {
        this.uploaderLabel = this.uploaderLabelRequiredStr;
      } else {
        this.uploaderLabel = this.uploaderLabelStr;
      }
    }
  }

  get paymentTypes() {
    let obj = {}
    obj['CASH'] = $localize`:@@paymentForm.paymentTypes.cash:Cash`;
    obj['BANK'] = $localize`:@@paymentForm.paymentTypes.bank:Bank`;
    return obj;
  }
  paymentTypesCodebook = EnumSifrant.fromObject(this.paymentTypes);

  get paymentPurposeTypes() {
    let obj = {}
    obj['ADVANCE_PAYMENT'] = $localize`:@@paymentForm.paymentPurposeTypes.advancedPayment:Advanced payment`;
    obj['FIRST_INSTALLMENT'] = $localize`:@@paymentForm.paymentPurposeTypes.firstInstallment:Cherry payment`;
    obj['SECOND_INSTALLMENT'] = $localize`:@@paymentForm.paymentPurposeTypes.secondInstallment:Member bonus`;
    obj['WOMEN_PREMIUM'] = $localize`:@@paymentForm.paymentPurposeTypes.womenPreminum:AF Women premium`;
    obj['INVOICE_PAYMENT'] = $localize`:@@paymentForm.paymentPurposeTypes.invoicePayment:Invoice payment`;
    return obj;
  }
  paymentPurposeTypesCodebook = EnumSifrant.fromObject(this.paymentPurposeTypes);

  get addProofs() {
    let obj = {};
    obj['PURCHASE_SHEET'] = $localize`:@@paymentForm.addProofs.purchaseSheet:Purchase sheet`;
    obj['RECEIPT'] = $localize`:@@paymentForm.addProofs.receipt:Receipt`;
    return obj;
  }
  codebookAdditionalProofs = EnumSifrant.fromObject(this.addProofs);

  get preferredWayOfPaymentList() {
    let obj = {}
    obj['CASH_VIA_COOPERATIVE'] = $localize`:@@productLabelStockPurchaseOrdersModal.preferredWayOfPayment.cashViaCooperative:Cash via cooperative`
    obj['CASH_VIA_COLLECTOR'] = $localize`:@@productLabelStockPurchaseOrdersModal.preferredWayOfPayment.cashViaCollector:Cash via collector`
    obj['BANK_TRANSFER'] = $localize`:@@productLabelStockPurchaseOrdersModal.preferredWayOfPayment.bankTransfer:Bank transfer`
    obj['UNKNOWN'] = $localize`:@@productLabelStockPurchaseOrdersModal.preferredWayOfPayment.unknown:Unknown`
    return obj;
  }
  codebookPreferredWayOfPayment = EnumSifrant.fromObject(this.preferredWayOfPaymentList)

  get totalPaid() {
    let totalPaid = 0
    if (this.form && this.form.get('amount') && this.form.get('amount').value) {
      totalPaid += Number(this.form.get('amount').value)
    }
    if (this.form && this.searchPreferredWayOfPayment && this.searchPreferredWayOfPayment.value != 'CASH_VIA_COLLECTOR' && this.form.get('amountPaidToTheCollector') && this.form.get('amountPaidToTheCollector').value) {
      totalPaid += Number(this.form.get('amountPaidToTheCollector').value)
    }
    return totalPaid
  }

  async setConfirmed() {
    this.confirmedAt = formatDateWithDotsAtHour(this.form.get('paymentConfirmedAtTime').value);
    let res = await this.chainUserService.getUser(this.form.get('paymentConfirmedByUser').value).pipe(take(1)).toPromise();
    if (res && res.status === "OK" && res.data) this.confirmedByUser = res.data.name + " " + res.data.surname;
    let resOrg = await this.chainOrganizationService.getOrganization(this.form.get('paymentConfirmedByOrganization').value).pipe(take(1)).toPromise();
    if (resOrg && resOrg.status === "OK" && resOrg.data) this.confirmedByUser += ", " + resOrg.data.name;
  }

  setFarmer(event: ChainUserCustomer) {
    if (event) {
      this.form.get('recipientUserCustomerId').setValue(dbKey(event))
    } else {
      this.form.get('recipientUserCustomerId').setValue(null)
    }
    this.form.get('recipientUserCustomerId').markAsDirty();
    this.form.get('recipientUserCustomerId').updateValueAndValidity()
  }

  setCollector(event: ChainUserCustomer) {
    if (event) {
      this.form.get('representativeOfRecipientOrganizationId').setValue(dbKey(event))
      this.form.get('receiptDocumentType').setValue(null);
    } else {
      this.form.get('representativeOfRecipientOrganizationId').setValue(null);
      this.form.get('receiptDocumentType').setValue('RECEIPT');
    }
    this.form.get('representativeOfRecipientOrganizationId').markAsDirty();
    this.form.get('representativeOfRecipientOrganizationId').updateValueAndValidity()
  }

  async setCompany(event) {
    if (event) {
      let res = await this.chainOrganizationService.getOrganizationByCompanyId(event.company.id).pipe(take(1)).toPromise();
      if (res && res.status === 'OK' && res.data)
        this.form.get('recipientOrganizationId').setValue(dbKey(res.data))
    } else {
      this.form.get('recipientOrganizationId').setValue(null)
    }
    this.form.get('recipientOrganizationId').markAsDirty();
    this.form.get('recipientOrganizationId').updateValueAndValidity()
  }


  get currencyCodes() {
    let obj = {}
    obj['EUR'] = $localize`:@@customerDetail.currencyCodes.eur:EUR`
    obj['USD'] = $localize`:@@customerDetail.currencyCodes.usd:USD`
    obj['RWF'] = $localize`:@@customerDetail.currencyCodes.rwf:RWF`
    return obj;
  }
  codebookCurrencyCodes = EnumSifrant.fromObject(this.currencyCodes)

}
