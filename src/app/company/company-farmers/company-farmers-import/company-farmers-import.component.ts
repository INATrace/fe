import { Component, OnInit } from '@angular/core';
import { Location} from '@angular/common';
import { FormControl } from '@angular/forms';
import { CompanyControllerService } from '../../../../api/api/companyController.service';
import { take } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { faFileExcel} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-company-farmers-import',
  templateUrl: './company-farmers-import.component.html',
  styleUrls: ['./company-farmers-import.component.scss']
})
export class CompanyFarmersImportComponent implements OnInit {

  companyId: number;
  fileForm = new FormControl();

  mimeError = $localize`:@@companyDetail.farmers.uploadSpreadsheet.error:Upload only file types XLS or XLSX.`;

  faFileExcel = faFileExcel;

  constructor(
      private companyControllerService: CompanyControllerService,
      private toastService: ToastrService,
      private location: Location
  ) { }

  ngOnInit(): void {
    this.companyId = Number(localStorage.getItem('selectedUserCompany'));
  }

  import() {
    if (this.fileForm && this.fileForm.value) {
      this.companyControllerService.importFarmersSpreadsheetUsingPOST(this.companyId, this.fileForm.value.id).pipe(take(1)).subscribe(_ => {
        this.toastService.success($localize`:@@companyDetail.farmers.import.success.label:Farmers successfully imported. Please check the data on Company > Farmers tab`);
        this.location.back();
      });
    }
  }

}
