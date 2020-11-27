import { Component, OnInit, Input } from '@angular/core';
import { faCaretDown, faUser, faBars} from '@fortawesome/free-solid-svg-icons';
import { Router, ActivatedRoute } from '@angular/router';
import { UnsubscribeList } from 'src/shared/rxutils';
import { OrganizationService } from 'src/api-chain/api/organization.service';
import { take } from 'rxjs/operators';
import { AboutAppInfoService } from 'src/app/about-app-info.service';
import { AuthService } from 'src/app/system/auth.service';
import { GlobalEventManagerService } from 'src/app/system/global-event-manager.service';
import { ProductControllerService } from 'src/api/api/productController.service';

@Component({
  selector: 'app-user-box',
  templateUrl: './user-box.component.html',
  styleUrls: ['./user-box.component.scss']
})
export class UserBoxComponent implements OnInit {

  userProfile = null;
  displayName = "";
  displayCompany = "";
  productId = this.route.snapshot.params.id;

  @Input()
  whitetexts = false;

  faCaretDown = faCaretDown
  faUser = faUser
  faBars = faBars
  isConfirmedOnly: boolean = false;
  isAdmin: boolean = false;
  showProductNav: boolean = false;
  showSystemNav: boolean = false;
  showProductOrdersTabs: boolean = false;
  showProductMyStockTabs: boolean = false;
  showProductStakeholdersTabs: boolean = false;
  showSettingsTabs: boolean = false;
  showCompaniesTabs: boolean = false;

  constructor(
    private route: ActivatedRoute,
    public authService: AuthService,
    private router: Router,
    private aboutAppInfoService: AboutAppInfoService,
    private globalEventManager: GlobalEventManagerService,
    private chainOrganizationService: OrganizationService,
    private productController: ProductControllerService
  ) { }

  unsubsribeList = new UnsubscribeList()

  ngOnInit(): void {
    this.showProductNav = this.router.url.startsWith('/product-labels/');
    this.showSystemNav = this.router.url.startsWith('/companies') || this.router.url.startsWith('/users') || this.router.url.startsWith('/settings');
    this.showProductOrdersTabs = this.router.url.startsWith(`/product-labels/${this.productId}/orders`);
    this.showProductMyStockTabs = this.router.url.startsWith(`/product-labels/${this.productId}/stock`);
    this.showProductStakeholdersTabs = this.router.url.startsWith(`/product-labels/${this.productId}/stakeholders`);
    this.showSettingsTabs = this.router.url.startsWith('/settings/');
    this.showCompaniesTabs = this.router.url.startsWith('/companies/');

    this.userProfile = this.authService.currentUserProfile;
    this.unsubsribeList.add(
      this.authService.userProfile$.subscribe(val => {
        this.userProfile = val
        if (this.userProfile) {
          this.isConfirmedOnly = 'CONFIRMED_EMAIL' === this.userProfile.status;
          this.isAdmin = 'ADMIN' === this.userProfile.role;
          this.displayName = this.userProfile.name;
          this.setDisplayCompany();
          this.unsubsribeList.add(
            this.globalEventManager.selectedUserCompanyEmitter.subscribe(
              company => {
                if (company) this.displayCompany = company;
                else this.displayCompany = "";
              },
              error => { }
            )
          )
        }
      })
    )
  }

  ngOnDestroy() {
    this.unsubsribeList.cleanup()
  }

  logout() {
    this.authService.logout()
  }

  onUser() {
    this.router.navigate(['home'])
  }

  aboutUser() {
    this.router.navigate(['user-profile'], { queryParams: { returnUrl: this.router.routerState.snapshot.url } });
  }

  aboutApp() {
    this.aboutAppInfoService.openAboutApp();
  }

  async setDisplayCompany() {
    let id = localStorage.getItem("selectedUserCompany");
    if (!id) return;
    let res = await this.chainOrganizationService.getOrganization(id).pipe(take(1)).toPromise();
    if (res && res.status === "OK" && res.data) {
      this.globalEventManager.selectedUserCompany(res.data.name);
    }
  }

  goToProduct() {
    this.router.navigate(['/', 'product-labels'])
  }

  goTo(type) {
    let arr = type.split('/');
    return this.router.navigate(['/product-labels', this.productId].concat(arr));
  }

  async deleteCurrentProduct() {
    // if (this.changed) return;
    let productId = this.productId;
    let result = await this.globalEventManager.openMessageModal({
      type: 'warning',
      message: $localize`:@@productLabel.deleteCurrentProduct.warning.message:Are you sure you want to delete the product? This will delete all labels and batches attached to the product as well!`,
      options: { centered: true },
      dismissable: false
    });
    if (result != "ok") return
    let res = await this.productController.deleteProductUsingDELETE(productId).pipe(take(1)).toPromise()
    if (res && res.status == 'OK') {
      this.globalEventManager.push({
        action: 'success',
        notificationType: 'success',
        title: $localize`:@@productLabel.deleteCurrentProduct.success.title:Deleted`,
        message: $localize`:@@productLabel.deleteCurrentProduct.success.message:Product was successfuly deleted`
      })
      this.router.navigate(['/product-labels'])
      return;
    }
    this.globalEventManager.push({
      action: 'error',
      notificationType: 'error',
      title: $localize`:@@productLabel.deleteCurrentProduct.error.title:Error`,
      message: $localize`:@@productLabel.deleteCurrentProduct.error.message:Product cannot be deleted. Please try again.`
    })
  }

  goToCompany(type) {
    let companyId = this.route.snapshot.params.id;
    return this.router.navigate(['/companies', companyId, type]);
  }

}
