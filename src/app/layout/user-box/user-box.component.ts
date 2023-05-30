import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { faBars} from '@fortawesome/free-solid-svg-icons';
import { Router, ActivatedRoute } from '@angular/router';
import { UnsubscribeList } from 'src/shared/rxutils';
import { take } from 'rxjs/operators';
import { AboutAppInfoService } from 'src/app/about-app-info.service';
import { AuthService } from 'src/app/core/auth.service';
import { GlobalEventManagerService } from 'src/app/core/global-event-manager.service';
import { ProductControllerService } from 'src/api/api/productController.service';
import { CompanyControllerService } from '../../../api/api/companyController.service';
import { ApiUserGet } from '../../../api/model/apiUserGet';

@Component({
  selector: 'app-user-box',
  templateUrl: './user-box.component.html',
  styleUrls: ['./user-box.component.scss']
})
export class UserBoxComponent implements OnInit, OnDestroy {

  userProfile: ApiUserGet = null;
  displayName = '';
  displayCompany = '';
  productId = this.route.snapshot.params.id;

  faBars = faBars;

  isAdmin = false;
  isCompanyAdmin = false;
  companyId: number;

  showProductNav = false;
  showSystemNav = false;

  showProductStakeholdersTabs = false;

  showSettingsTabs = false;
  showCompaniesTabs = false;

  @Input()
  landingPageView = false;

  constructor(
    private route: ActivatedRoute,
    public authService: AuthService,
    private router: Router,
    private aboutAppInfoService: AboutAppInfoService,
    private globalEventManager: GlobalEventManagerService,
    private companyControllerService: CompanyControllerService,
    private productController: ProductControllerService
  ) { }

  unsubscribeList = new UnsubscribeList();

  ngOnInit(): void {

    this.showProductNav = this.router.url.startsWith('/product-labels/');

    this.showSystemNav =
      this.router.url.startsWith('/companies') ||
      this.router.url.startsWith('/users') ||
      this.router.url.startsWith('/settings') ||
      this.router.url.startsWith('/value-chains') ||
      this.router.url.startsWith('/currencies');

    this.showProductStakeholdersTabs = this.router.url.startsWith(`/product-labels/${this.productId}/stakeholders`);

    this.showSettingsTabs = this.router.url.startsWith('/settings/');
    this.showCompaniesTabs = this.router.url.startsWith('/companies/');

    this.companyId = Number(localStorage.getItem('selectedUserCompany'));

    this.unsubscribeList.add(
      this.authService.userProfile$.subscribe(val => {
        this.userProfile = val;
        if (this.userProfile) {
          this.isAdmin = 'SYSTEM_ADMIN' === this.userProfile.role;
          this.isCompanyAdmin = this.userProfile.companyIdsAdmin.includes(this.companyId);
          this.displayName = this.userProfile.name;
          // this.setDisplayCompany().then();
          this.unsubscribeList.add(
            this.globalEventManager.selectedUserCompanyEmitter.subscribe(
              company => {
                if (company) { this.displayCompany = company; }
                else { this.displayCompany = ''; }
              },
              () => { }
            )
          );
        }
      })
    );
  }

  ngOnDestroy() {
    this.unsubscribeList.cleanup();
  }

  logout() {
    this.authService.logout().then();
  }

  aboutUser() {
    this.router.navigate(['user-profile'], {queryParams: {returnUrl: this.router.routerState.snapshot.url}}).then();
   }

  companyProfile() {
    const id = localStorage.getItem('selectedUserCompany');
    if (!id) { return; }
    this.router.navigate(['companies', id, 'company']).then();
  }

  aboutApp() {
    this.aboutAppInfoService.openAboutApp();
  }

  private async setDisplayCompany() {
    const id = localStorage.getItem('selectedUserCompany');
    if (!id) { return; }
    const res = await this.companyControllerService.getCompanyUsingGET(Number(id)).pipe(take(1)).toPromise();
    if (res && res.status === 'OK' && res.data) {
      this.globalEventManager.selectedUserCompany(res.data.name);
    }
  }

  goTo(type) {
    const arr = type.split('/');
    return this.router.navigate(['/product-labels', this.productId].concat(arr));
  }

  async deleteCurrentProduct() {

    const productId = this.productId;
    const result = await this.globalEventManager.openMessageModal({
      type: 'warning',
      message: $localize`:@@productLabel.deleteCurrentProduct.warning.message:Are you sure you want to delete the product? This will delete all labels and batches attached to the product as well!`,
      options: { centered: true },
      dismissable: false
    });
    if (result !== 'ok') { return; }
    const res = await this.productController.deleteProductUsingDELETE(productId).pipe(take(1)).toPromise();
    if (res && res.status === 'OK') {
      this.globalEventManager.push({
        action: 'success',
        notificationType: 'success',
        title: $localize`:@@productLabel.deleteCurrentProduct.success.title:Deleted`,
        message: $localize`:@@productLabel.deleteCurrentProduct.success.message:Product was successfuly deleted`
      });
      this.router.navigate(['/product-labels']).then();
      return;
    }
    this.globalEventManager.push({
      action: 'error',
      notificationType: 'error',
      title: $localize`:@@productLabel.deleteCurrentProduct.error.title:Error`,
      message: $localize`:@@productLabel.deleteCurrentProduct.error.message:Product cannot be deleted. Please try again.`
    });
  }

  goToCompany(type) {
    const companyId = this.route.snapshot.params.id;
    return this.router.navigate(['/companies', companyId, type]);
  }

}
