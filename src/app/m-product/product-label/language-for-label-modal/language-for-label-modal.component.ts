import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormControl } from '@angular/forms';
import { EnumSifrant } from 'src/app/shared-services/enum-sifrant';

@Component({
  selector: 'app-language-for-label-modal',
  templateUrl: './language-for-label-modal.component.html',
  styleUrls: ['./language-for-label-modal.component.scss']
})
export class LanguageForLabelModalComponent implements OnInit {

  @Input()
  dismissable = true;

  @Input()
  title = null;

  @Input()
  instructionsHtml = null

  @Input()
  onSelectedCompany: (company: any) => {}

  form = new FormControl(null)

  constructor(
    public activeModal: NgbActiveModal,
  ) { }

  ngOnInit(): void {
  }

  cancel() {
    this.activeModal.close()
  }

  onConfirm() {
    if (this.form.value) {
      this.activeModal.close(this.form.value)
    }
  }

  get languageCodes() {
    let obj = {}
    obj['EN'] = $localize`:@@languageForLabelModal.languageCodes.en:EN`
    obj['DE'] = $localize`:@@languageForLabelModal.languageCodes.de:DE`
    return obj;
  }
  codebookLanguageCodes = EnumSifrant.fromObject(this.languageCodes)

}
