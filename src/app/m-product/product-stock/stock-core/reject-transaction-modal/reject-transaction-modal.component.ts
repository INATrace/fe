import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { InputTransactionsForStockOrderStandalone } from 'src/app/shared-services/input-transactions-for-stock-order-standalone.service';
import { faTimes, faCheck } from '@fortawesome/free-solid-svg-icons';
import { ChainTransaction } from 'src/api-chain/model/chainTransaction';
import { generateFormFromMetadata } from 'src/shared/utils';
import { ItemsList } from '@ng-select/ng-select/lib/items-list';
import { TransactionService } from 'src/api-chain/api/transaction.service';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-reject-transaction-modal',
  templateUrl: './reject-transaction-modal.component.html',
  styleUrls: ['./reject-transaction-modal.component.scss']
})
export class RejectTransactionModalComponent implements OnInit {

  @Input()
  dismissable = true;
  @Input()
  title = null;
  @Input()
  instructionsHtml = null
  @Input()
  stockOrderId = null

  transactions;
  faCheck = faCheck
  faTimes = faTimes

  approveRejectForm: FormArray = new FormArray([]);;
  constructor(
    public activeModal: NgbActiveModal,
    private chainTransactionService: TransactionService
  ) { }

  ngOnInit(): void {
    this.prepare();
  }

  async prepare () {
    let res = await this.chainTransactionService.listInputTransactionsForProductUnitId(this.stockOrderId).pipe(take(1)).toPromise();
    if (res && res.status === "OK" && res.data) {
      for (let item of res.data.items) {
        if (item.status === "PENDING") {
          let form = generateFormFromMetadata(ChainTransaction.formMetadata(), item);
          form.addControl('approved', new FormControl(true));
          this.approveRejectForm.push(form);
        }
      }
    }
  }

  cancel() {
    this.activeModal.close()
  }

  async onConfirm() {
    if (!this.checkValidity) return;
    for (let item of this.approveRejectForm.controls) {
      if (item.value.rejectComment) {
        let res = await this.chainTransactionService.cancelTransactions(item.value._id, item.value.rejectComment).pipe(take(1)).toPromise();
      } else {
        let res = await this.chainTransactionService.approveTransactions(item.value._id).pipe(take(1)).toPromise();
      }
    }
      this.activeModal.close()
  }

  rejectTransaction(tx) {
    tx.get('approved').setValue(false);
  }

  approveTransaction(tx) {
    tx.get('approved').setValue(true);
    tx.get('rejectComment').setValue(null);
  }

  setColor(item) {
    if (item.value.approved) return 'approved';
    return 'del-icon'
  }

  get checkValidity() {
    for (let item of this.approveRejectForm.controls) {
      if (item.value.approved != null && !item.value.approved && !item.value.rejectComment) {
        return false;
      }
    }
    if (this.approveRejectForm.controls.length === 0) return false;
    return true;
  }


}
