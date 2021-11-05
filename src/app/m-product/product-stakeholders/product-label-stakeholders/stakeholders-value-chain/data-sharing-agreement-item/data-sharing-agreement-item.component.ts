import { Component, OnInit } from '@angular/core';
import { GenericEditableItemComponent } from '../../../../../shared/generic-editable-item/generic-editable-item.component';
import { GlobalEventManagerService } from '../../../../../core/global-event-manager.service';
import { ApiProductDataSharingAgreement } from '../../../../../../api/model/apiProductDataSharingAgreement';

@Component({
  selector: 'app-data-sharing-agreement-item',
  templateUrl: './data-sharing-agreement-item.component.html',
  styleUrls: ['./data-sharing-agreement-item.component.scss']
})
export class DataSharingAgreementItemComponent extends GenericEditableItemComponent<ApiProductDataSharingAgreement> implements OnInit {

  constructor(
    protected globalEventsManager: GlobalEventManagerService,
  ) {
    super(globalEventsManager);
  }

  ngOnInit(): void {
  }

}
