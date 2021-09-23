import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { ChainUserCustomerRole } from 'src/api-chain/model/chainUserCustomerRole';
import { faStamp } from '@fortawesome/free-solid-svg-icons';
import { generateFormFromMetadata, defaultEmptyObject } from 'src/shared/utils';
import { FormGroup, FormControl } from '@angular/forms';
import { ChainUserCustomerRoleValidationScheme } from '../collector-detail-modal/validation';
import { EnumSifrant } from 'src/app/shared-services/enum-sifrant';
import { GenericEditableItemComponent } from 'src/app/shared/generic-editable-item/generic-editable-item.component';
import { GlobalEventManagerService } from 'src/app/core/global-event-manager.service';

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

  readonly: boolean = false;


  ngOnInit() {
    if(this.codebookCoop && this.codebookCoop.keys.length === 1) {
      this.form.get('organizationId').setValue(this.codebookCoop.keys[0]);
      this.readonly = true;
    }
  }

  get name() {
    if (this.form.get('organizationId').value && this.assocCoop && this.form.get('role').value)
      return this.assocCoop[this.form.get('organizationId').value] + ", " + this.roles[this.form.get('role').value];
  }

  public generateForm(value: any): FormGroup {
    return generateFormFromMetadata(ChainUserCustomerRole.formMetadata(), value, ChainUserCustomerRoleValidationScheme)
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
