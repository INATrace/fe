import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { EnumSifrant } from 'src/app/shared-services/enum-sifrant';


@Component({
  selector: 'app-knowledge-blog-select-section-modal',
  templateUrl: './knowledge-blog-select-section-modal.component.html',
  styleUrls: ['./knowledge-blog-select-section-modal.component.scss']
})
export class KnowledgeBlogSelectSectionModalComponent implements OnInit {

  @Input()
  dismissable = true;

  @Input()
  title: string = null;

  @Input()
  instructionsHtml: string = null;

  @Input()
  skipItemId: number = null;

  @Input()
  onSelected: (section: any) => {};

  form = new FormControl(null);
  subs: Subscription[] = [];

  constructor(
    public activeModal: NgbActiveModal,
  ) { }

  ngOnDestroy(): void {
    this.subs.forEach(sub => sub.unsubscribe());
  }

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

  get statusList() {
    let obj = {}
    obj['FAIRNESS'] = $localize`:@@productLabelFrontFeedback.statusList.fairness:Fairness`
    obj['QUALITY'] = $localize`:@@productLabelFrontFeedback.statusList.quality:Quality`
    obj['PROVENANCE'] = $localize`:@@productLabelFrontFeedback.statusList.provenance:Provenance`
    return obj;
  }

  codebookStatus = EnumSifrant.fromObject(this.statusList)
}
