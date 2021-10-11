import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { ChainUserCustomerRole } from 'src/api-chain/model/chainUserCustomerRole';
import { faStamp } from '@fortawesome/free-solid-svg-icons';
import { generateFormFromMetadata, defaultEmptyObject } from 'src/shared/utils';
import { FormGroup, FormControl } from '@angular/forms';
import {
  ApiUserCustomerCooperativeValidationScheme,
  ChainUserCustomerRoleValidationScheme
} from '../collector-detail-modal/validation';
import { EnumSifrant } from 'src/app/shared-services/enum-sifrant';
import { GenericEditableItemComponent } from 'src/app/shared/generic-editable-item/generic-editable-item.component';
import { GlobalEventManagerService } from 'src/app/core/global-event-manager.service';
import { ApiUserCustomerCooperative } from '../../../../api/model/apiUserCustomerCooperative';
import UserCustomerTypeEnum = ApiUserCustomerCooperative.UserCustomerTypeEnum;

@Component({
  selector: 'app-producers-item',
  templateUrl: './producers-item.component.html',
  styleUrls: ['./producers-item.component.scss']
})
export class ProducersItemComponent extends GenericEditableItemComponent<ChainUserCustomerRole> {

  constructor(
    protected globalEventsManager: GlobalEventManagerService,
    protected router: Router
  ) {
    super(globalEventsManager)
  }
  @Input()
  disableDelete = false

  @Input()
  formTitle = null

  faStamp = faStamp;

  @Input()
  codebookCoop

  @Input()
  assocCoop

  @Input()
  type: UserCustomerTypeEnum;

  readonly: boolean = false;


  ngOnInit() {
    if (this.type && this.form.get('userCustomerType') && this.form.get('userCustomerType').value == null) {
      this.form.get('userCustomerType').setValue(this.type);
    }
    if(this.codebookCoop && this.codebookCoop.keys.length === 1) {
      this.form.get('company.id').setValue(this.codebookCoop.keys[0]);
      this.readonly = true;
    }
  }

  get name() {
    if (this.form.get('company').value && this.form.get('company.name').value && this.form.get('userCustomerType').value) {
      let typeText = this.form.get('userCustomerType').value;
      if (typeText) {
        if (typeText === UserCustomerTypeEnum.FARMER) {
          typeText = $localize`:@@collectorDetail.roles.farmer:Farmer`;
        } else if (typeText === UserCustomerTypeEnum.COLLECTOR) {
          typeText = $localize`:@@collectorDetail.roles.collector:Collector`;
        }
      }
      return this.form.get('company.name').value + ', ' + typeText;
    }
    if (this.form.get('company').value && this.form.get('company.id').value) {
      return this.assocCoop[this.form.get('company.id').value.toString()] + ', ' + this.form.get('userCustomerType').value;
    }
  }

  public generateForm(value: any): FormGroup {
    return generateFormFromMetadata(ApiUserCustomerCooperative.formMetadata(), value, ApiUserCustomerCooperativeValidationScheme);
  }

  static createEmptyObject(): ChainUserCustomerRole {
    let market = ChainUserCustomerRole.formMetadata();
    return defaultEmptyObject(market) as ChainUserCustomerRole
  }

  static emptyObjectFormFactory(): () => FormControl {
    return () => {
      let f = new FormControl(ProducersItemComponent.createEmptyObject(), ChainUserCustomerRoleValidationScheme.validators)
      return f
    }
  }

  get roles() {
    let obj = {}
    obj['FARMER'] = $localize`:@@collectorDetail.roles.farmer:Farmer`;
    obj['COLLECTOR'] = $localize`:@@collectorDetail.roles.collector:Collector`;
    return obj;
  }

  codebookRoles = EnumSifrant.fromObject(this.roles)

}
