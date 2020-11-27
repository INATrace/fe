import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { ThemeService } from 'src/app/shared-services/theme.service';
import { BehaviorSubject } from 'rxjs';
import { faTimes, faPen } from '@fortawesome/free-solid-svg-icons';
import { environment } from 'src/environments/environment';
import { ProductControllerService } from 'src/api/api/productController.service';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-label-selector-card',
  templateUrl: './label-selector-card.component.html',
  styleUrls: ['./label-selector-card.component.scss']
})
export class LabelSelectorCardComponent implements OnInit {

  appName: string = environment.appName;
  qrCodeLink: string = "";
  @Input()
  label = null

  @Input()
  isSelected = false;

  @Input()
  qrCodeSize = 110;

  @Input()
  currentLabelForm;

  @Input()
  changed: Boolean;

  @Output() onSelect = new EventEmitter<any>();
  @Output() onDelete = new EventEmitter<any>();
  @Output() onMouseOver = new EventEmitter<any>();
  @Output() onTitleChange = new EventEmitter<any>();

  faTimes = faTimes;
  faPen = faPen;

  constructor(
    public theme: ThemeService,
    private productController: ProductControllerService
  ) { }

  ngOnInit(): void {
    this.setQRCode();
  }

  async setQRCode() {
    if (this.label) {
      let res = await this.productController.getProductLabelContentUsingGET(this.label.id).pipe(take(1)).toPromise();
      if (res && res.status === 'OK' && res.data) {
        if (res.data.settings && res.data.settings.language === "DE") this.qrCodeLink = environment.qrCodeBaseUrlDE + this.label.uuid;
        else this.qrCodeLink = environment.qrCodeBaseUrlEN + this.label.uuid;
      }

    }
  }

  showDeleteButton$ = new BehaviorSubject<boolean>(false);
  enter(e) {
    this.showDeleteButton$.next(true)
  }

  leave(e) {
    this.showDeleteButton$.next(false)
  }

  delete(event) {
    event.stopPropagation();
    this.onDelete.next(this.label)
  }

  toogleEditTitle(event){
    if (this.isSelected) {
      event.stopPropagation();
      this.onTitleChange.emit(this.label);
    }
  }

  select(label) {
    if (!this.changed) this.onSelect.next({ label: label, preventEmit: false })
    else this.onSelect.next({ label: null, preventEmit: true})
  }

}
