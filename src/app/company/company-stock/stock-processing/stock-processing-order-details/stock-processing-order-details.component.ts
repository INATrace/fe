import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GlobalEventManagerService } from '../../../../core/global-event-manager.service';

@Component({
  selector: 'app-stock-processing-order-details',
  templateUrl: './stock-processing-order-details.component.html',
  styleUrls: ['./stock-processing-order-details.component.scss']
})
export class StockProcessingOrderDetailsComponent implements OnInit {

  title: string;

  constructor(
      private route: ActivatedRoute,
      private globalEventsManager: GlobalEventManagerService
  ) { }

  ngOnInit(): void {

    this.initInitialData().then(
        async () => {
          // TODO: add other initializations
        },
        reason => {
          this.globalEventsManager.showLoading(false);
          throw reason;
        }
    );
  }

  private async initInitialData() {

    const action = this.route.snapshot.data.action;
    if (!action) { return; }

    if (action === 'new') {

      this.title = $localize`:@@productLabelStockProcessingOrderDetail.newTitle:Add action`;

    } else if (action === 'update') {
      // TODO: handle update case
    } else {
      throw Error('Wrong action.');
    }

  }

}
