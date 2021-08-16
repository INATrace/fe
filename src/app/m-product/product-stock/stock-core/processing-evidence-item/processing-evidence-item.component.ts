import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ChainActivityProof } from 'src/api-chain/model/chainActivityProof';
import { environment } from 'src/environments/environment';
import { FormControl, FormGroup } from '@angular/forms';
import { defaultEmptyObject, generateFormFromMetadata } from 'src/shared/utils';
import { ChainActivityProofValidationScheme } from './validation';
import { take } from 'rxjs/operators';
import { EnumSifrant } from 'src/app/shared-services/enum-sifrant';
import { GenericEditableItemComponent } from 'src/app/shared/generic-editable-item/generic-editable-item.component';
import { ImageViewerComponent } from 'src/app/shared/image-viewer/image-viewer.component';
import { GlobalEventManagerService } from 'src/app/system/global-event-manager.service';
import { NgbModalImproved } from 'src/app/system/ngb-modal-improved/ngb-modal-improved.service';
import { ProcessingEvidenceTypeService } from 'src/app/shared-services/processing_evidence_types.service';
import { CodebookTranslations } from 'src/app/shared-services/codebook-translations';
import { ProcessingEvidenceTypeControllerService } from '../../../../../api/api/processingEvidenceTypeController.service';

@Component({
  selector: 'app-processing-evidence-item',
  templateUrl: './processing-evidence-item.component.html',
  styleUrls: ['./processing-evidence-item.component.scss']
})
export class ProcessingEvidenceItemComponent extends GenericEditableItemComponent<ChainActivityProof> implements OnInit{

  constructor(
    protected globalEventsManager: GlobalEventManagerService,
    protected router: Router,
    private modalService: NgbModalImproved,
    private codebookTranslations: CodebookTranslations,
    private processingEvidenceTypeController: ProcessingEvidenceTypeControllerService
  ) {
    super(globalEventsManager);
  }

  @Input()
  disableDelete = false;

  @Input()
  formTitle = null;

  @Input()
  typeAsObject = false;

  chainRootUrl: string = environment.chainRelativeFileUploadUrl;
  chainDownloadRootUrl: string = environment.chainRelativeFileDownloadUrl;

  codebookAdditionalProofs;
  typesOfProofs = {};

  codebookProcessingEvidenceType: ProcessingEvidenceTypeService;

  static createEmptyObject(): ChainActivityProof {
    const market = ChainActivityProof.formMetadata();
    return defaultEmptyObject(market) as ChainActivityProof;
  }

  static emptyObjectFormFactory(): () => FormControl {
    return () => {
      return new FormControl(ProcessingEvidenceItemComponent.createEmptyObject(), ChainActivityProofValidationScheme.validators);
    };
  }

  ngOnInit(): void {
    this.codebookProcessingEvidenceType =
        new ProcessingEvidenceTypeService(this.processingEvidenceTypeController, this.codebookTranslations, 'DOCUMENT');
    this.addProofs().then();
  }

  public generateForm(value: any): FormGroup {
    return generateFormFromMetadata(ChainActivityProof.formMetadata(), value, ChainActivityProofValidationScheme);
  }

  get typeCodebook() {
    if (this.typeAsObject) { return this.codebookProcessingEvidenceType; }
    return this.codebookAdditionalProofs;
  }

  async addProofs() {
    const obj = {};
    const res = await this.processingEvidenceTypeController.getProcessingEvidenceTypeListUsingGET().pipe(take(1)).toPromise();
    if (res && res.status === 'OK' && res.data) {
      for (const item of res.data.items) {
        obj[item.id] = item.label;
      }
    }
    this.typesOfProofs = obj;
    this.codebookAdditionalProofs = EnumSifrant.fromObject(obj);
  }

  get name() {
    if (this.contentObject && this.contentObject.formalCreationDate && this.contentObject.type) {
      const tmpDate = new Date(this.contentObject.formalCreationDate);
      const day = tmpDate.getDate();
      const month = tmpDate.getMonth() + 1;
      const year = tmpDate.getFullYear();
      if (this.typeAsObject) {
        return this.contentObject.type.label + ' (' + day + '.' + month + '.' + year + ')';
      }
      return this.addProofs[this.contentObject.type] + ' (' + day + '.' + month + '.' + year + ')';
    }
    return '';
  }

  viewImage() {
    if (!this.form.get('document')) { return; }
    if (this.form.get('document').value && this.form.get('document').value.contentType.startsWith('image')) {

      const modalRef = this.modalService.open(ImageViewerComponent, { centered: true });
      Object.assign(modalRef.componentInstance, {
        modal: false,
        fileInfo: this.form.get('document').value,
        chainApi: true
      });
    }
  }

  isImageToShow() {
    return this.contentObject && this.contentObject.document &&
        this.contentObject.document.storageKey && this.contentObject.document.contentType.startsWith('image');
  }

}
