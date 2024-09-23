import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { GenericEditableItemComponent } from 'src/app/shared/generic-editable-item/generic-editable-item.component';
import { GlobalEventManagerService } from 'src/app/core/global-event-manager.service';
import { defaultEmptyObject, generateFormFromMetadata } from 'src/shared/utils';
import { ApiCertification } from 'src/api/model/apiCertification';
import { faStamp } from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';
import { FileSaverService } from 'ngx-filesaver';
import { CommonControllerService } from 'src/api/api/commonController.service';
import { ApiDocument } from 'src/api/model/apiDocument';
import { ApiCertificationValidationScheme } from 'src/app/m-product/product-label/validation';

enum CertificationTypes {
  EU_ORGANIC = 'EU_ORGANIC',
  RAINFOREST_ALLIANCE = 'RAINFOREST_ALLIANCE',
  CARBON_NEUTRAL = 'CARBON_NEUTRAL',
  FAIRTRADE = 'FAIRTRADE'
}

@Component({
  selector: 'app-certification-and-standard-item',
  templateUrl: './certification-and-standard-item.component.html',
  styleUrls: ['./certification-and-standard-item.component.scss']
})
export class CertificationAndStandardItemComponent extends GenericEditableItemComponent<ApiCertification> implements OnInit {

  constructor(
    protected globalEventsManager: GlobalEventManagerService,
    protected router: Router,
    private fileSaverService: FileSaverService,
    private commonController: CommonControllerService
  ) {
    super(globalEventsManager);
  }

  certificationTypes = CertificationTypes;

  @Input()
  readOnly = false;

  @Input()
  disableEdit = false;

  @Input()
  disableDelete = false;

  @Input()
  viewOnly = false;

  @Input()
  formTitle = null;

  faStamp = faStamp;

  static createEmptyObject(): ApiCertification {
    const market = ApiCertification.formMetadata();
    return defaultEmptyObject(market) as ApiCertification;
  }

  static emptyObjectFormFactory(): () => FormControl {
    return () => {
      return new FormControl(CertificationAndStandardItemComponent.createEmptyObject(), ApiCertificationValidationScheme.validators);
    };
  }

  ngOnInit() {
    if (this.viewOnly) {
      this.form.get('type').disable();
      this.form.get('validity').disable();
    }
  }

  public generateForm(value: any): FormGroup {
    return generateFormFromMetadata(ApiCertification.formMetadata(), value, ApiCertificationValidationScheme);
  }

  onDownload() {
    const apiDoc = this.form.get('certificate').value as ApiDocument;
    if (apiDoc && apiDoc.storageKey) {
      const sub = this.commonController.getDocument(apiDoc.storageKey).subscribe(res => {
        this.fileSaverService.save(res, apiDoc.name);
        sub.unsubscribe();
      });
    }
  }

}
