import { Component, Input } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { faStamp } from '@fortawesome/free-solid-svg-icons';
import { FileSaverService } from 'ngx-filesaver';
import { CommonControllerService } from 'src/api/api/commonController.service';
import { ApiDocument } from 'src/api/model/apiDocument';
import { ApiResponsibilityFarmerPicture } from 'src/api/model/apiResponsibilityFarmerPicture';
import { GenericEditableItemComponent } from 'src/app/shared/generic-editable-item/generic-editable-item.component';
import { GlobalEventManagerService } from 'src/app/core/global-event-manager.service';
// import { ApiResponsibilityFarmerPictureValidationScheme } from '../product-label/validation';
import { environment } from 'src/environments/environment';
import { defaultEmptyObject, generateFormFromMetadata } from 'src/shared/utils';
import { ApiResponsibilityFarmerPictureValidationScheme } from '../validation';


@Component({
  selector: 'app-farmer-story-photos',
  templateUrl: './farmer-story-photos.component.html',
  styleUrls: ['./farmer-story-photos.component.scss']
})
export class FarmerStoryPhotosComponent extends GenericEditableItemComponent<ApiResponsibilityFarmerPicture> {

    rootImageUrl: string = environment.relativeImageUplodadUrlAllSizes;

    constructor(
        protected globalEventsManager: GlobalEventManagerService,
        protected router: Router,
        private fileSaverService: FileSaverService,
        private commonController: CommonControllerService

    ) {
        super(globalEventsManager)
    }

    @Input()
    disableDelete = false

    @Input()
    title = null

    faStamp = faStamp;

    public generateForm(value: any): FormGroup {
        return generateFormFromMetadata(ApiResponsibilityFarmerPicture.formMetadata(), value, ApiResponsibilityFarmerPictureValidationScheme)
    }

    static createEmptyObject(): ApiResponsibilityFarmerPicture {
        let market = ApiResponsibilityFarmerPicture.formMetadata();
        return defaultEmptyObject(market) as ApiResponsibilityFarmerPicture
    }

    static emptyObjectFormFactory(): () => FormControl {
        return () => {
            let f = new FormControl(FarmerStoryPhotosComponent.createEmptyObject(), ApiResponsibilityFarmerPictureValidationScheme.validators)
            return f
        }
    }

    onDownload() {
      let apiDoc = this.form.get('document').value as ApiDocument
      if (apiDoc && apiDoc.storageKey) {
        let sub = this.commonController.getDocumentUsingGET(apiDoc.storageKey).subscribe(res => {
          this.fileSaverService.save(res, apiDoc.name);
          sub.unsubscribe()
        })
      }
    }
}



