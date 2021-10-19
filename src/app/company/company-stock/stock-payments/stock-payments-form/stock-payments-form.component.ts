import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { take, takeUntil } from 'rxjs/operators';
import { ProductControllerService } from 'src/api/api/productController.service';
import { AssociatedCompaniesService } from 'src/app/shared-services/associated-companies.service';
import { EnumSifrant } from 'src/app/shared-services/enum-sifrant';
import { environment } from 'src/environments/environment';
import { formatDateWithDotsAtHour } from 'src/shared/utils';
import { CompanyControllerService } from '../../../../../api/api/companyController.service';
import { CompanyUserCustomersByRoleService } from '../../../../shared-services/company-user-customers-by-role.service';
import { StockOrderControllerService } from '../../../../../api/api/stockOrderController.service';
import { ApiPayment } from '../../../../../api/model/apiPayment';
import { ApiStockOrder } from '../../../../../api/model/apiStockOrder';
import { ApiUserCustomer } from '../../../../../api/model/apiUserCustomer';
import { UserControllerService } from '../../../../../api/api/userController.service';
import PaymentTypeEnum = ApiPayment.PaymentTypeEnum;
import PreferredWayOfPaymentEnum = ApiStockOrder.PreferredWayOfPaymentEnum;
import PaymentPurposeTypeEnum = ApiPayment.PaymentPurposeTypeEnum;
import PaymentStatusEnum = ApiPayment.PaymentStatusEnum;
import ReceiptDocumentTypeEnum = ApiPayment.ReceiptDocumentTypeEnum;
import { Subject } from 'rxjs/internal/Subject';

export enum ModeEnum {
  PURCHASE = 'PURCHASE',
  CUSTOMER = 'CUSTOMER'
}

@Component({
  selector: 'app-stock-payments-form',
  templateUrl: './stock-payments-form.component.html',
  styleUrls: ['./stock-payments-form.component.scss']
})
export class StockPaymentsFormComponent implements OnInit, OnDestroy {

  @Input()
  paymentForm: FormGroup;
  @Input()
  orderReferenceForm = new FormControl(null);
  @Input()
  payableFromForm = new FormControl(null);
  @Input()
  searchCompaniesForm = new FormControl(null);
  @Input()
  searchCollectorsForm = new FormControl(null);
  @Input()
  searchFarmersForm = new FormControl(null);
  @Input()
  collectorsCodebook: CompanyUserCustomersByRoleService;
  @Input()
  farmersCodebook: CompanyUserCustomersByRoleService;
  @Input()
  submitted: boolean;
  @Input()
  viewOnly: boolean;
  @Input()
  openBalance: number;
  @Input()
  purchased: number;
  @Input()
  mode: ModeEnum = ModeEnum.PURCHASE;

  uploaderLabel: string;
  confirmedAt: string;
  confirmedByUser: string;
  readonlyPaymentType: boolean;
  currency: string;

  associatedCompaniesService: AssociatedCompaniesService;
  searchPreferredWayOfPayment = new FormControl(null);

  fileUploadUrl: string = environment.relativeFileUploadUrl;

  uploaderLabelStr = $localize`:@@paymentForm.attachment-uploader.receipt.label:Signed receipt (PDF/PNG/JPG)`;
  uploaderLabelRequiredStr = $localize`:@@paymentForm.attachment-uploader.receipt.required.label:Signed receipt (PDF/PNG/JPG)*`;
  labelDocumentStr = $localize`:@@paymentForm.attachment-uploader.document.label:Document (PDF/PNG/JPG)`;
  labelDocumentRequiredStr = $localize`:@@paymentForm.attachment-uploader.document.required.label:Document (PDF/PNG/JPG)*`;

  paymentTypesCodebook = EnumSifrant.fromObject({});
  paymentPurposeTypesCodebook = EnumSifrant.fromObject(this.paymentPurposeTypes);
  codebookAdditionalProofs = EnumSifrant.fromObject(this.addProofs);
  codebookPreferredWayOfPayment = EnumSifrant.fromObject(this.preferredWayOfPaymentList);
  codebookCurrencyCodes = EnumSifrant.fromObject(this.currencyCodes);
  
  private destroy$ = new Subject<boolean>();

  constructor(
      private route: ActivatedRoute,
      private companyControllerService: CompanyControllerService,
      private stockOrderControllerService: StockOrderControllerService,
      private productControllerService: ProductControllerService,
      private userControllerService: UserControllerService
  ) { }

  ngOnInit(): void {

    this.currency = this.paymentForm.contains('currency') ? this.paymentForm.get('currency').value : '?';

    this.initInitialData().then(() => {

      this.uploaderLabel = this.uploaderLabelStr;

      if (this.paymentForm.value && this.paymentForm.value.paymentStatus === PaymentStatusEnum.CONFIRMED) {
        this.viewOnly = true;
        this.setConfirmed().then();
      }

      this.searchCollectorsForm.disable();
      this.searchFarmersForm.disable();

      if (this.mode === ModeEnum.PURCHASE) {
        this.searchCompaniesForm.disable();

        if (!this.paymentForm.get('paymentPurposeType').value) {
          this.paymentForm.get('paymentPurposeType').setValue(PaymentPurposeTypeEnum.FIRSTINSTALLMENT);
        }

        if (this.paymentForm.get('paymentPurposeType').value === PaymentPurposeTypeEnum.FIRSTINSTALLMENT) {
          this.uploaderLabel = this.uploaderLabelRequiredStr;
        }

      }

      if (this.viewOnly) {
        this.paymentForm.get('paymentType').disable();
        this.paymentForm.get('paymentPurposeType').disable();
        this.paymentForm.get('formalCreationTime').disable();
        this.paymentForm.get('receiptDocumentType').disable();
        this.paymentForm.get('receiptDocument').disable();

        this.searchCompaniesForm.disable();

        if (this.mode === ModeEnum.CUSTOMER) {
          this.paymentForm.get('receiptDocumentType').setValue(ReceiptDocumentTypeEnum.RECEIPT);
          this.paymentForm.get('receiptDocumentType').disable();
        }

      } else {
        if (this.searchCollectorsForm.value) {
          this.paymentForm.get('receiptDocumentType').setValue(null);
          this.uploaderLabel = this.labelDocumentStr;

          if (this.paymentForm.get('paymentPurposeType').value === PaymentPurposeTypeEnum.FIRSTINSTALLMENT) {
            this.uploaderLabel = this.labelDocumentRequiredStr;
          }

        } else {
          this.paymentForm.get('receiptDocumentType').setValue(ReceiptDocumentTypeEnum.RECEIPT);
          this.paymentForm.get('receiptDocumentType').disable();
        }

        if (this.mode === ModeEnum.PURCHASE) {
          if (this.openBalance > 0) {
            if (this.searchPreferredWayOfPayment.value === PreferredWayOfPaymentEnum.CASHVIACOLLECTOR) {
              this.paymentForm.get('amountPaidToTheCollector').setValue(this.openBalance);
            } else {
              this.paymentForm.get('amountPaidToTheFarmer').setValue(this.openBalance);
            }
          }
        }

      }
    });
  
    this.searchCollectorsForm.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(value => {
      this.paymentTypesCodebook = EnumSifrant.fromObject(
          this.createPaymentTypes(value !== null)
      );
    });
  }

  async initInitialData() {

    const stockOrderResp = await this.stockOrderControllerService.getStockOrderUsingGET(this.paymentForm.get('stockOrder').value.id)
        .pipe(take(1))
        .toPromise();

    if (stockOrderResp && stockOrderResp.status === 'OK' && stockOrderResp.data) {
      const stockOrder = stockOrderResp.data;

      this.paymentForm.get('productionDate').setValue(stockOrder.productionDate);
      this.paymentForm.get('preferredWayOfPayment').setValue(stockOrder.preferredWayOfPayment);

      if (this.mode === ModeEnum.PURCHASE) {
        this.searchPreferredWayOfPayment.setValue(stockOrder.preferredWayOfPayment);
        this.searchPreferredWayOfPayment.disable();

        if (stockOrder.preferredWayOfPayment === PreferredWayOfPaymentEnum.CASHVIACOLLECTOR
            && this.paymentForm && !this.paymentForm.get('paymentType').value) {
          this.paymentForm.get('paymentType').setValue(PaymentTypeEnum.BANK);
          this.paymentForm.get('amountPaidToTheCollector').setValidators([Validators.required]);

        } else if (stockOrder.preferredWayOfPayment !== PreferredWayOfPaymentEnum.CASHVIACOLLECTOR
            && this.paymentForm && !this.paymentForm.get('paymentType').value) {
          this.paymentForm.get('amountPaidToTheCollector').setValue(0);
          this.paymentForm.get('amountPaidToTheCollector').disable();
        }

        if (!this.openBalance) {
          this.openBalance = stockOrder.balance;
        }

        if (!this.purchased) {
          this.purchased = stockOrder.fulfilledQuantity;
        }

      } else {
        this.paymentForm.get('paymentType').setValue(PaymentTypeEnum.BANK);
        this.readonlyPaymentType = true;
      }
    }

    this.associatedCompaniesService = new AssociatedCompaniesService(this.productControllerService, this.route.snapshot.params.id, null);
  }

  async setConfirmed() {

    this.confirmedAt = formatDateWithDotsAtHour(this.paymentForm.get('paymentConfirmedAtTime').value);

    const userResp = await this.userControllerService.getProfileForUserUsingGET(this.paymentForm.get('paymentConfirmedByUser').value)
        .pipe(take(1))
        .toPromise();

    if (userResp && userResp.status === 'OK' && userResp.data) {
      this.confirmedByUser = userResp.data.name + ' ' + userResp.data.surname;
    }

    const userCompanyResp = await this.companyControllerService.getCompanyUsingGET(this.paymentForm.get('paymentConfirmedByOrganization').value)
        .pipe(take(1))
        .toPromise();

    if (userCompanyResp && userCompanyResp.status === 'OK' && userCompanyResp.data) {
      this.confirmedByUser += ', ' + userCompanyResp.data.name;
    }
  }

  setFarmer(event: ApiUserCustomer) {
    if (event) {
      this.paymentForm.get('recipientUserCustomer').setValue(event);
    } else {
      this.paymentForm.get('recipientUserCustomer').setValue(null);
    }
    this.paymentForm.get('recipientUserCustomer').markAsDirty();
    this.paymentForm.get('recipientUserCustomer').updateValueAndValidity();
  }

  setCollector(event: ApiUserCustomer) {
    if (event) {
      this.paymentForm.get('representativeOfRecipientCompany').setValue(event);
      this.paymentForm.get('receiptDocumentType').setValue(null);
    } else {
      this.paymentForm.get('representativeOfRecipientCompany').setValue(null);
      this.paymentForm.get('receiptDocumentType').setValue(ReceiptDocumentTypeEnum.RECEIPT);
    }
    this.paymentForm.get('representativeOfRecipientCompany').markAsDirty();
    this.paymentForm.get('representativeOfRecipientCompany').updateValueAndValidity();
  }

  async setCompany(event) {
    if (event) {
      const companyResp = await this.companyControllerService.getCompanyUsingGET(event.company.id)
          .pipe(take(1))
          .toPromise();
      if (companyResp && companyResp.status === 'OK' && companyResp.data) {
        this.paymentForm.get('recipientCompany').setValue(companyResp.data);
      }
    } else {
      this.paymentForm.get('recipientCompany').setValue(null);
    }
    this.paymentForm.get('recipientCompany').markAsDirty();
    this.paymentForm.get('recipientCompany').updateValueAndValidity();
  }

  changeReceiptDocumentLabel() {
    if (!this.viewOnly && this.searchCollectorsForm.value) {
      if (this.paymentForm.get('paymentPurposeType').value === PaymentPurposeTypeEnum.FIRSTINSTALLMENT) {
        this.uploaderLabel = this.labelDocumentRequiredStr;
      } else {
        this.uploaderLabel = this.labelDocumentStr;
      }
    } else {
      if (this.paymentForm.get('paymentPurposeType').value === PaymentPurposeTypeEnum.FIRSTINSTALLMENT) {
        this.uploaderLabel = this.uploaderLabelRequiredStr;
      } else {
        this.uploaderLabel = this.uploaderLabelStr;
      }
    }
  }

  get totalPaid() {
    let totalPaid = 0;

    if (this.paymentForm && this.paymentForm.get('amountPaidToTheFarmer') && this.paymentForm.get('amountPaidToTheFarmer').value) {
      totalPaid += Number(this.paymentForm.get('amountPaidToTheFarmer').value);
    }

    if (this.paymentForm
        && this.searchPreferredWayOfPayment
        && this.searchPreferredWayOfPayment.value !== PreferredWayOfPaymentEnum.CASHVIACOLLECTOR
        && this.paymentForm.get('amountPaidToTheCollector')
        && this.paymentForm.get('amountPaidToTheCollector').value) {

      totalPaid += Number(this.paymentForm.get('amountPaidToTheCollector').value);
    }
    return totalPaid;
  }
  
  createPaymentTypes(collector: boolean = false): object {
    const obj = {};
    
    obj['CASH'] = $localize`:@@paymentForm.paymentTypes.cash:Cash`;
    obj['BANK'] = $localize`:@@paymentForm.paymentTypes.bank:Bank`;
    if (collector) {
      obj['CASH_VIA_COLLECTOR'] = $localize`:@@productLabelStockPurchaseOrdersModal.preferredWayOfPayment.cashViaCollector:Cash via collector`;
    }
    obj['CHEQUE'] = $localize`:@@productLabelStockPurchaseOrdersModal.preferredWayOfPayment.cheque:Cheque`;
    obj['OFFSETTING'] = $localize`:@@productLabelStockPurchaseOrdersModal.preferredWayOfPayment.offsetting:Offsetting`;
  
    return obj;
  }

  get paymentPurposeTypes() {
    const obj = {};
    obj['ADVANCE_PAYMENT'] = $localize`:@@paymentForm.paymentPurposeTypes.advancedPayment:Advanced payment`;
    obj['FIRST_INSTALLMENT'] = $localize`:@@paymentForm.paymentPurposeTypes.firstInstallment:Base payment`;
    obj['SECOND_INSTALLMENT'] = $localize`:@@paymentForm.paymentPurposeTypes.secondInstallment:Member bonus`;
    obj['WOMEN_PREMIUM'] = $localize`:@@paymentForm.paymentPurposeTypes.womenPreminum:Women premium`;
    obj['INVOICE_PAYMENT'] = $localize`:@@paymentForm.paymentPurposeTypes.invoicePayment:Invoice payment`;
    obj['ORGANIC_BONUS'] = $localize`:@@paymentForm.paymentPurposeTypes.organicBonus:Organic bonus`;
    obj['FT_BONUS'] = $localize`:@@paymentForm.paymentPurposeTypes.ftBonus:FT bonus`;
    obj['FT_PREMIUM'] = $localize`:@@paymentForm.paymentPurposeTypes.ftPremium:FT premium`;
    obj['OTHER_BONUS'] = $localize`:@@paymentForm.paymentPurposeTypes.otherBonus:Other bonus`;
    return obj;
  }

  get addProofs() {
    const obj = {};
    obj['PURCHASE_SHEET'] = $localize`:@@paymentForm.addProofs.purchaseSheet:Purchase sheet`;
    obj['RECEIPT'] = $localize`:@@paymentForm.addProofs.receipt:Receipt`;
    return obj;
  }

  get preferredWayOfPaymentList() {
    const obj = {};
    obj['CASH'] = $localize`:@@productLabelStockPurchaseOrdersModal.preferredWayOfPayment.cash:Cash`;
    obj['CHEQUE'] = $localize`:@@productLabelStockPurchaseOrdersModal.preferredWayOfPayment.cheque:Cheque`;
    obj['OFFSETTING'] = $localize`:@@productLabelStockPurchaseOrdersModal.preferredWayOfPayment.offsetting:Offsetting`;
    obj['CASH_VIA_COOPERATIVE'] = $localize`:@@productLabelStockPurchaseOrdersModal.preferredWayOfPayment.cashViaCooperative:Cash via cooperative`;
    obj['CASH_VIA_COLLECTOR'] = $localize`:@@productLabelStockPurchaseOrdersModal.preferredWayOfPayment.cashViaCollector:Cash via collector`;
    obj['BANK_TRANSFER'] = $localize`:@@productLabelStockPurchaseOrdersModal.preferredWayOfPayment.bankTransfer:Bank transfer`;
    obj['UNKNOWN'] = $localize`:@@productLabelStockPurchaseOrdersModal.preferredWayOfPayment.unknown:Unknown`;
    return obj;
  }

  get currencyCodes() {
    const obj = {};
    obj['EUR'] = $localize`:@@customerDetail.currencyCodes.eur:EUR`;
    obj['USD'] = $localize`:@@customerDetail.currencyCodes.usd:USD`;
    obj['RWF'] = $localize`:@@customerDetail.currencyCodes.rwf:RWF`;
    return obj;
  }

  get modeEnum(): typeof ModeEnum {
    return ModeEnum;
  }

  get preferredWayOfPayment(): typeof PreferredWayOfPaymentEnum {
    return PreferredWayOfPaymentEnum;
  }

  ngOnDestroy() {
    this.destroy$.next(true);
  }
}
