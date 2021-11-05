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
  qrCodeTag: string;

  title = $localize`:@@generateQRCode.title.orderItemQRCode:Order item QR code`;

  languageCode;
  qrCodeLanguage = null;

  qrCodeSize = 200;

  constructor(
    public activeModal: NgbActiveModal
  ) { }

  ngOnInit(): void {
    this.initProduct().then();
  }

  async initProduct() {

    this.languageCode = 'en';
    this.qrCodeLanguage = this.languageCode;
  }

  cancel() {
    this.activeModal.close();
  }

  onConfirm() {
    this.activeModal.close();
  }

  get qrCodeString() {

    if (!this.qrCodeLanguage || !this.qrCodeTag) {
      return null;
    }

    if (this.qrCodeLanguage === 'de') { return environment.qrCodeBaseUrlDE + '/' + this.qrCodeTag; }
    if (this.qrCodeLanguage === 'en') { return environment.qrCodeBaseUrlEN + '/' + this.qrCodeTag; }
  }

  setQRCodeLanguage(lang: string) {
    this.qrCodeLanguage = lang;
  }

  copyToClipboard() {
    document.execCommand('copy');
  }
}
