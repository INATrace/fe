import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { take } from 'rxjs/operators';
import { ProductService } from 'src/api-chain/api/product.service';
import { ChainProduct } from 'src/api-chain/model/chainProduct';
import { ProductControllerService } from 'src/api/api/productController.service';
import { LanguageCodeHelper } from 'src/app/language-code-helper';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-generate-qr-code-modal',
  templateUrl: './generate-qr-code-modal.component.html',
  styleUrls: ['./generate-qr-code-modal.component.scss']
})
export class GenerateQRCodeModalComponent implements OnInit {

  @Input()
  stockOrderId: string

  @Input()
  productId
  chainProduct: ChainProduct;

  title = $localize`:@@generateQRCode.title.orderItemQRCode:Order item QR code`;
  // instructionsHtml = $localize`:@@generateQRCode.instructionsHtml:Select a company you would like to continue with:`;

  constructor(
    public activeModal: NgbActiveModal,
    private route: ActivatedRoute,
    private productService: ProductControllerService,
    private chainProductService: ProductService
  ) { }

  ngOnInit(): void {
    this.initProduct()
  }

  languageCode;
  labelEntry;
  uuid;
  qrCodeLanguage = null

  async initProduct() {
    let resp = await this.chainProductService.getProductByAFId(this.productId).pipe(take(1)).toPromise()
    if (resp && resp.status === 'OK') {
      this.chainProduct = resp.data
    }
    this.languageCode = LanguageCodeHelper.getCurrentLocale().toLowerCase();
    this.labelEntry = this.chainProduct.labels.find(label => {
      return !!label.fields.find(x => x.name === 'settings.language' && ((x as any).value as string).toLowerCase() === this.languageCode)
    })
    if (this.labelEntry) {
      this.uuid = this.labelEntry.uuid
    }
    this.qrCodeLanguage = this.languageCode
  }

  cancel() {
    this.activeModal.close()
  }

  onConfirm() {
    this.activeModal.close()
  }

  get qrCodeString() {
    if (!this.uuid || !this.qrCodeLanguage || !this.stockOrderId) return null
    if (this.qrCodeLanguage === 'de') return environment.qrCodeBaseUrlDE + this.uuid + '/' + this.stockOrderId
    if (this.qrCodeLanguage === 'en') return environment.qrCodeBaseUrlEN + this.uuid + '/' + this.stockOrderId
  }

  setQRCodeLanguage(lang: string) {
    this.qrCodeLanguage = lang
    this.labelEntry = this.chainProduct.labels.find(label => {
      return !!label.fields.find(x => x.name === 'settings.language' && ((x as any).value as string).toLowerCase() === this.qrCodeLanguage)
    })
    if (this.labelEntry) {
      this.uuid = this.labelEntry.uuid
    }

    // let labelEntries = this.chainProduct.labels.filter(label => {
    //   return !!label.fields.find(x => x.name === 'settings.language' && ((x as any).value as string).toLowerCase() === this.qrCodeLanguage)
    // })
    // this.uuid = labelEntries[0].uuid
  }

  qrCodeSize = 210;

  copyToClipboard() {
    document.execCommand('copy');
  }
}
