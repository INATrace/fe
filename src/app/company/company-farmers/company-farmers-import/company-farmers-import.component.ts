import { Component, OnInit } from '@angular/core';
import { Location} from '@angular/common';
import { FormControl } from '@angular/forms';
import { CompanyControllerService } from '../../../../api/api/companyController.service';
import { finalize, take } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { faFileExcel} from '@fortawesome/free-solid-svg-icons';
import { ApiUserCustomer } from '../../../../api/model/apiUserCustomer';
import { GlobalEventManagerService } from '../../../core/global-event-manager.service';
import { LanguageCodeHelper } from '../../../language-code-helper';
import { SelectedUserCompanyService } from '../../../core/selected-user-company.service';
import { ApiUserCustomerImportRowValidationError } from "../../../../api/model/apiUserCustomerImportRowValidationError";

@Component({
  selector: 'app-company-farmers-import',
  templateUrl: './company-farmers-import.component.html',
  styleUrls: ['./company-farmers-import.component.scss']
})
export class CompanyFarmersImportComponent implements OnInit {

  private companyId: number;
  fileForm = new FormControl();

  mimeError = $localize`:@@companyDetail.farmers.uploadSpreadsheet.error:Upload only file types XLS or XLSX.`;

  faFileExcel = faFileExcel;
  
  duplicates: Array<ApiUserCustomer> = [];

  validationErrors: Array<ApiUserCustomerImportRowValidationError> = [];

  importInProgress = false;

  farmerImportTemplateHref = '';

  constructor(
      private companyControllerService: CompanyControllerService,
      private toastService: ToastrService,
      private location: Location,
      private globalEventsManager: GlobalEventManagerService,
      private selUserCompanyService: SelectedUserCompanyService
  ) { }

  ngOnInit(): void {
    this.selUserCompanyService.selectedCompanyProfile$.pipe(take(1)).subscribe(cp => {
      if (cp) {
        this.companyId = cp.id;

        // Depending on the selected user company, set the appropriate farmer import template for download
        const companyCountryCode = cp.headquarters?.country?.code;
        if (companyCountryCode === 'RW') {
          this.farmerImportTemplateHref = '/assets/farmer-import/Template_list_of_farmers_Rwanda_en.xlsx';
        } else if (companyCountryCode === 'HN') {
          this.farmerImportTemplateHref = '/assets/farmer-import/Plantilla_listado_de_agricultores_Honduras_es.xlsx';
        } else if (LanguageCodeHelper.getCurrentLocale() === 'es') {
          this.farmerImportTemplateHref = '/assets/farmer-import/Plantilla_listado_de_agricultores_otros_paises_es.xlsx';
        } else {
          this.farmerImportTemplateHref = '/assets/farmer-import/Template_list_of_farmers_other_countries_en.xlsx';
        }
      }
    });
  }

  import() {

    if (this.importInProgress) {
      return;
    }

    if (this.fileForm && this.fileForm.value) {

      this.importInProgress = true;
      this.globalEventsManager.showLoading(true);

      this.companyControllerService.importFarmersSpreadsheet(this.companyId, this.fileForm.value.id)
          .pipe(
              take(1),
              finalize(() => {
                this.importInProgress = false;
                this.globalEventsManager.showLoading(false);
              })
          )
          .subscribe(value => {
            if (value) {

              // If there are validation errors present, display error
              if (value.validationErrors && value.validationErrors.length > 0) {

                this.toastService.error($localize`:@@companyDetail.farmers.import.validationErrors.message:There are validation errors in the provided spreadsheet of farmers. Please check them below.`);
                this.validationErrors = value.validationErrors;
                return;
              } else {

                if (value.successful === 0 && value.duplicates && value.duplicates.length === 0) {
                  this.toastService.error($localize`:@@companyDetail.farmers.import.noFarmers.error:No farmers imported`);
                  return;
                }
                if (value.successful > 0 && value.duplicates && value.duplicates.length === 0) {
                  this.toastService.success($localize`:@@companyDetail.farmers.import.success.label:Farmers successfully imported. Please check the data on Company > Farmers tab`);
                  this.location.back();
                  return;
                }
                if (value.duplicates && value.duplicates.length > 0) {
                  this.toastService.warning($localize`:@@companyDetail.farmers.import.duplicates.error:Some duplicate farmers with same name, surname and village were found. Please accept or reject duplicates`);
                  this.duplicates = value.duplicates;
                  return;
                }
              }
            }
          });
    }
  }

  acceptDuplicate(user: ApiUserCustomer, index: number) {
    this.companyControllerService.addUserCustomer(this.companyId, user)
        .pipe(take(1))
        .subscribe(() => this.toastService.success($localize`:@@companyDetail.farmers.import.success.single: Farmer successfully imported`),
                () => {},
            () => this.duplicates.splice(index, 1));
  }

  rejectDuplicate(user: ApiUserCustomer, index: number) {
    this.duplicates.splice(index, 1);
  }

}
