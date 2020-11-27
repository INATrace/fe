import { Component, Host } from '@angular/core';
import { Router } from '@angular/router';
import { OrganizationService } from 'src/api-chain/api/organization.service';
import { ProductService } from 'src/api-chain/api/product.service';
import { UserService } from 'src/api-chain/api/user.service';
import { CommonControllerService } from 'src/api/api/commonController.service';
import { CompanyControllerService } from 'src/api/api/companyController.service';
import { ProductControllerService } from 'src/api/api/productController.service';
import { UserControllerService } from 'src/api/api/userController.service';
import { AuthorisedLayoutComponent } from 'src/app/layout/authorised/authorised-layout/authorised-layout.component';
import { GlobalEventManagerService } from 'src/app/system/global-event-manager.service';
import { NgbModalImproved } from 'src/app/system/ngb-modal-improved/ngb-modal-improved.service';
import { SettingsComponent } from '../settings.component';

@Component({
  selector: 'app-settings-additional',
  templateUrl: './settings-additional.component.html',
  styleUrls: ['../settings.component.scss']
})
export class SettingsAdditionalComponent extends SettingsComponent{

  rootTab = 0
  constructor(
    protected globalEventsManager: GlobalEventManagerService,
    protected commonController: CommonControllerService,
    protected modalService: NgbModalImproved,
    protected router: Router,
    protected productController: ProductControllerService,
    protected companyController: CompanyControllerService,
    protected userController: UserControllerService,
    protected chainOrganizationService: OrganizationService,
    protected chainUserService: UserService,
    protected chainProductService: ProductService,
    // protected tabCommunicationService: TabCommunicationService
    // @Host() public authorizedLayout: AuthorisedLayoutComponent,
  ) {
    super(globalEventsManager, commonController, modalService, router, productController, companyController, userController, chainOrganizationService, chainUserService, chainProductService)
  }


}
