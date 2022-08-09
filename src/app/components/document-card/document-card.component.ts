import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FileSaverService } from 'ngx-filesaver';
import { take } from 'rxjs/operators';
import { DocumentService } from 'src/api-chain/api/document.service';
import { FormatPaymentPurposeTypePipe } from '../pipes/format-payment-purpose-type';

@Component({
  selector: 'app-document-card',
  templateUrl: './document-card.component.html',
  styleUrls: ['./document-card.component.scss']
})
export class DocumentCardComponent implements OnInit {

  @Input()
  report;

  @Input()
  mode: 'big' | 'folder' = "folder"
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private chainFileService: DocumentService,
    private fileSaverService: FileSaverService,
    private formatPaymentPurposeTypePipe: FormatPaymentPurposeTypePipe
  ) { }


  ngOnInit(): void {
  }

  isType(typ: string): boolean {
    if (typ === "PDF") return true
  }

  isFilePresent() {
    return (this.report && this.report.value || this.report.receiptDocument)
  }

  get fileInfo() {
    if (this.report.receiptDocument) return this.report.receiptDocument
    if (!this.report.value) return
    let documentData = this.report.value
    if (!documentData || documentData.length != 3) return;
    let res = documentData[2] && documentData[2].files && documentData[2].files.length > 0 && documentData[2].files[0]
    if (res) return res
    return this.report.fieldID
  }

  get documentType() {
    if (this.report.paymentPurposeType) return this.formatPaymentPurposeTypePipe.transform(this.report.paymentPurposeType)
    if (!this.report.value) return this.report.fieldID
    let documentData = this.report.value
    if (!documentData || documentData.length < 2) return this.report.fieldID
    let res = documentData[1].objectValue && documentData[1].objectValue.label
    if (res) return res
    return null
  }

  get documentDate() {
    if (this.report.formalCreationTime) return this.report.formalCreationTime
    if (!this.report.value) return null
    let documentData = this.report.value
    if (!documentData || documentData.length < 1) return null
    // console.log(documentData)
    return documentData[0].stringValue
  }

  async onDownload() {
    let fileInfo = this.fileInfo
    // console.log(fileInfo)
    if (fileInfo && fileInfo.storageKey) {
      let res = await this.chainFileService.getFile(fileInfo.storageKey).pipe(take(1)).toPromise()
      if (res) {
        this.fileSaverService.save(res, fileInfo.name)
      }
    }
  }

  navigateToStockOrder() {
    this.router.navigate(['/product-labels', this.route.snapshot.params.id, 'stock', 'stock-orders', 'stock-order', this.report.stockOrderId, 'view'], { queryParams: { returnUrl: this.router.routerState.snapshot.url } })
  }
}
