import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { ChainActivityProof } from 'src/api-chain/model/chainActivityProof';
import { environment } from 'src/environments/environment';
import { FormGroup, FormControl } from '@angular/forms';
import { generateFormFromMetadata, defaultEmptyObject, dateAtMidnight } from 'src/shared/utils';
import { ChainActivityProofValidationScheme } from './validation';
import { CodebookService } from 'src/api-chain/api/codebook.service';
import { take } from 'rxjs/operators';
import { EnumSifrant } from 'src/app/shared-services/enum-sifrant';
import { GenericEditableItemComponent } from 'src/app/shared/generic-editable-item/generic-editable-item.component';
import { ImageViewerComponent } from 'src/app/shared/image-viewer/image-viewer.component';
import { GlobalEventManagerService } from 'src/app/system/global-event-manager.service';
import { NgbModalImproved } from 'src/app/system/ngb-modal-improved/ngb-modal-improved.service';
import { ProcessingEvidenceTypeaService } from 'src/app/shared-services/processing_evidence_types.service';
import { CodebookTranslations } from 'src/app/shared-services/codebook-translations';

@Component({
  selector: 'app-processing-evidence-item',
  templateUrl: './processing-evidence-item.component.html',
  styleUrls: ['./processing-evidence-item.component.scss']
})
export class ProcessingEvidenceItemComponent extends GenericEditableItemComponent<ChainActivityProof> {


  constructor(
    protected globalEventsManager: GlobalEventManagerService,
    protected router: Router,
    private modalService: NgbModalImproved,
    private chainCodebookService: CodebookService,
    private codebookTranslations: CodebookTranslations
  ) {
    super(globalEventsManager)
  }

  @Input()
  disableDelete = false;

  @Input()
  formTitle = null;

  @Input()
  typeAsObject = false

  chainRootUrl: string = environment.chainRelativeFileUploadUrl;
  chainDownloadRootUrl: string = environment.chainRelativeFileDownloadUrl;

  codebookAdditionalProofs;
  typesOfProofs = {};

  codebookProcessingEvidenceType: ProcessingEvidenceTypeaService;

  ngOnInit(): void {
    this.codebookProcessingEvidenceType = new ProcessingEvidenceTypeaService(this.chainCodebookService, this.codebookTranslations, 'DOCUMENT');
    this.addProofs();
  }

  public generateForm(value: any): FormGroup {
    return generateFormFromMetadata(ChainActivityProof.formMetadata(), value, ChainActivityProofValidationScheme)
  }

  static createEmptyObject(): ChainActivityProof {
    let market = ChainActivityProof.formMetadata();
    return defaultEmptyObject(market) as ChainActivityProof
  }

  static emptyObjectFormFactory(): () => FormControl {
    return () => {
      let f = new FormControl(ProcessingEvidenceItemComponent.createEmptyObject(), ChainActivityProofValidationScheme.validators)
      return f
    }
  }

  get typeCodebook() {
    if(this.typeAsObject) return this.codebookProcessingEvidenceType
    return this.codebookAdditionalProofs
  }

  async addProofs() {
    let obj = {};
    let res = await this.chainCodebookService.getProcessingEvidenceTypeList().pipe(take(1)).toPromise();
    if(res && res.status === 'OK' && res.data) {
      for (let item of res.data.items) {
        obj[item.id] = item.label;
      }
    }
    this.typesOfProofs = obj;
    this.codebookAdditionalProofs = EnumSifrant.fromObject(obj);
  }


  get name() {
    if (this.contentObject && this.contentObject.formalCreationDate && this.contentObject.type) {
      let tmpDate = new Date(this.contentObject.formalCreationDate);
      let day = tmpDate.getDate();
      let month = tmpDate.getMonth() + 1;
      let year = tmpDate.getFullYear();
      if(this.typeAsObject) {
        return this.contentObject.type.label + " (" + day + "." + month + "." + year + ")";
      }
      return this.addProofs[this.contentObject.type] + " (" + day + "." + month + "." + year + ")";
    }
    return ""
  }

  viewImage() {
    if (!this.form.get('document')) return;
    if (this.form.get('document').value && this.form.get('document').value.contentType.startsWith('image')) {

      const modalRef = this.modalService.open(ImageViewerComponent, { centered: true });
      Object.assign(modalRef.componentInstance, {
        modal: false,
        fileInfo: this.form.get('document').value,
        chainApi: true
      })

    }
  }

  isImageToShow() {
    return this.contentObject && this.contentObject.document && this.contentObject.document.storageKey && this.contentObject.document.contentType.startsWith('image');
  }

}
