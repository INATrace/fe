import { Component } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { BehaviorSubject, combineLatest, Observable, of, Subscribable, Subscription } from 'rxjs';
import { catchError, filter, map, share, shareReplay, switchMap, take } from 'rxjs/operators';
import { OrderService } from 'src/api-chain/api/order.service';
import { ProductService } from 'src/api-chain/api/product.service';
import { StockOrderService } from 'src/api-chain/api/stockOrder.service';
import { ChainProduct } from 'src/api-chain/model/chainProduct';
import { ChainProductOrder } from 'src/api-chain/model/chainProductOrder';
import { ChainStockOrder } from 'src/api-chain/model/chainStockOrder';
import { WeightedAggregateAny } from 'src/api-chain/model/weightedAggregateAny';
import { ProductControllerService } from 'src/api/api/productController.service';
import { GenerateQRCodeModalComponent } from 'src/app/components/generate-qr-code-modal/generate-qr-code-modal.component';
import { CodebookTranslations } from 'src/app/shared-services/codebook-translations';
import { NgbModalImproved } from 'src/app/system/ngb-modal-improved/ngb-modal-improved.service';
import { environment } from 'src/environments/environment';
import { UnsubscribeList } from 'src/shared/rxutils';
import { dbKey, getPath } from 'src/shared/utils';
import { CustomerOrderViewComponent } from '../customer-order-view.component';


@Component({
  selector: 'app-customer-order-details',
  templateUrl: './customer-order-details.component.html',
  styleUrls: ['./customer-order-details.component.scss']
})
export class CustomerOrderDetailsComponent extends CustomerOrderViewComponent {

  rootTab = 0
  constructor(
    protected router: Router,
    protected route: ActivatedRoute,
    private chainStockOrderService: StockOrderService,
    private modalService: NgbModalImproved,
    private chainOrderService: OrderService,
    private productController: ProductControllerService,
    private chainProductService: ProductService,
    protected codebookTranslations: CodebookTranslations
  ) {
    super(router, route)
  }

  productId = this.route.snapshot.params.id;
  orderID = this.route.snapshot.params.orderId;
  product;


  confirmation$ = this.route.params.pipe(
    map(val => {
      return val.orderId
    }),
    switchMap(orderId => {
      return this.chainOrderService.getQuoteRequirementsVerification(orderId)
    }),
    map(val => {
      if (val && val.status === "OK") {
        return val.data
      }
      return null
    }),
    shareReplay(1)
  )

  order$ = this.route.params.pipe(
    map(val => {
      return val.orderId
    }),
    switchMap(orderId => {
      return this.chainOrderService.getOrder(orderId)
    }),
    map(val => {
      if (val && val.status === "OK") {
        return val.data
      }
      return null
    }),
    shareReplay(1)
  )

  producers$ = this.confirmation$.pipe(
    map(val => {
      if (val) {
        return val.producers
      }
      return []
    }),
    shareReplay(1)
  )

  producersString$ = this.producers$.pipe(
    map(val => {
      if (val.length == 0) return 'N/A'
      return val.map(el => el.name).join(", ")
    }),
    shareReplay(1)
  )

  public reloadDataPing$ = new BehaviorSubject<boolean>(false);
  public reloadPage() {
    setTimeout(() => this.reloadDataPing$.next(true), environment.reloadDelay)
  }

  product$ = this.route.params.pipe(
    map(val => val.id),
    switchMap(id => {
      return this.productController.getProductUsingGET(id).pipe(
        catchError(val => of(null))
      )
    }),
    map(resp => {
      if (resp && resp.status === 'OK') return resp.data
      return null
    }),
    shareReplay(1)
  )


  extractFields(fieldId: string) {
    return this.confirmation$.pipe(
      map(val => {
        let res = val.requirements.filter(x => x.fieldId === fieldId)
        let together = []
        res.forEach(aggs => {
          together = [...together, ...aggs.aggregates]
        })
        return together
      }),
      shareReplay(1)
    )
  }
  // showedOrders;
  // allOrders;
  // public onShow(event, type?: string) {
  //   this.showedOrders = event;
  // }

  // public onCount(event, type?: string) {
  //   this.allOrders = event;
  // }

  // openOnly: boolean = true;

  // public openOnly$ = new BehaviorSubject<boolean>(this.openOnly);

  // public setOpenOnly(openOnly: boolean) {
  //   this.openOnly = openOnly;
  //   this.openOnly$.next(openOnly)
  // }

  unsubscribeList = new UnsubscribeList()

  sub1: Subscription;
  sub2: Subscription;

  chainProduct: ChainProduct;

  cuppingFormReport$;
  samplingDeliveryNote$;
  orderDocs$;
  paymentDocs$;
  fairnessDocs$;
  provenanceDocs$;
  qualityDocs$;
  fairnessCount$;
  provenanceCount$;
  qualityCount$;
  progress$;

  ngOnInit() {
    // this.organizationId = localStorage.getItem("selectedUserCompany");
    // this.facilityCodebook = new ActiveFacilitiesForOrganizationCodebookService(this.chainFacilityService, this.organizationId, this.codebookTranslations)
    // setSelectedIdFieldFromQueryParams(this, this.route, 'facilityId', this.facilityForStockOrderForm, this.facilityCodebook, (val) => this.facilityForStockOrderChanged(val))

    this.unsubscribeList.add(this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        // console.log("NAV:", event.url, getPath(this.route.snapshot), event.url === getPath(this.route.snapshot))
        if (event.url === getPath(this.route.snapshot)) {
          this.reloadPage()
        }
      }
    }))

    this.unsubscribeList.add(this.product$.subscribe(val => {
      this.product = val
    }))

    this.cuppingFormReport$ = this.extractFields('CUPPING_FORM_REPORT')
    this.samplingDeliveryNote$ = this.extractFields('SAMPLE_DELIVERY_NOTE')

    this.fairnessDocs$ = this.confirmation$.pipe(
      map(val => {
        let filtered = val.requirements.filter(x => x.fairness)
        let aggs: WeightedAggregateAny[] = []
        filtered.forEach(item => {
          item.aggregates.forEach(agg => {
            if (agg.isDocument) {
              if (!aggs.find(x => agg.stockOrderId === x.stockOrderId && agg.fieldID === x.fieldID)) {
                aggs.push(agg)
              }
            }
          })
        })
        return aggs
      }),
      shareReplay(1)
    )

    this.fairnessCount$ = this.fairnessDocs$.pipe(
      map((val: WeightedAggregateAny[]) => {
        let ok = val.filter(x => x.value)
        return [ok.length, val.length]
      }),
      shareReplay(1)
    )

    this.provenanceDocs$ = this.confirmation$.pipe(
      map(val => {
        let filtered = val.requirements.filter(x => x.provenance)
        let aggs: WeightedAggregateAny[] = []
        filtered.forEach(item => {
          item.aggregates.forEach(agg => {
            if (agg.isDocument) {
              if (!aggs.find(x => agg.stockOrderId === x.stockOrderId && agg.fieldID === x.fieldID)) {
                aggs.push(agg)
              }
            }
          })
        })
        return aggs
      }),
      shareReplay(1)
    )

    this.provenanceCount$ = this.provenanceDocs$.pipe(
      map((val: WeightedAggregateAny[]) => {
        let ok = val.filter(x => x.value)
        return [ok.length, val.length]
      }),
      shareReplay(1)
    )

    this.qualityDocs$ = this.confirmation$.pipe(
      map(val => {
        let filtered = val.requirements.filter(x => x.quality)
        let aggs: WeightedAggregateAny[] = []
        filtered.forEach(item => {
          item.aggregates.forEach(agg => {
            if (agg.isDocument) {
              if (!aggs.find(x => agg.stockOrderId === x.stockOrderId && agg.fieldID === x.fieldID)) {
                aggs.push(agg)
              }
            }
          })
        })
        return aggs
      }),
      shareReplay(1)
    )

    this.qualityCount$ = this.qualityDocs$.pipe(
      map((val: WeightedAggregateAny[]) => {
        let ok = val.filter(x => x.value)
        return [ok.length, val.length]
      }),
      shareReplay(1)
    )

    this.progress$ = combineLatest(this.fairnessCount$, this.provenanceCount$, this.qualityCount$,
      (fairness: any, provenance: any, quality: any) => {
        let ok = fairness[0] + provenance[0] + quality[0]
        let all = fairness[1] + provenance[1] + quality[1]
        return Math.round(ok/all*100)
      })

    this.orderDocs$ = this.confirmation$.pipe(
      map(val => {
        let filtered = val.requirements.filter(x => !x.quality && !x.fairness && !x.provenance)
        let aggs: WeightedAggregateAny[] = []
        filtered.forEach(item => {
          item.aggregates.forEach(agg => {
            if (agg.isDocument) {
              if (!aggs.find(x => agg.stockOrderId === x.stockOrderId && agg.fieldID === x.fieldID)) {
                aggs.push(agg)
              }
            }
          })
        })
        return aggs
      }),
      shareReplay(1)
    )

    // this.initializeProduct()
  }


  // async initializeProduct() {
  //   let resp = await this.chainProductService.getProductByAFId(this.productId).pipe(take(1)).toPromise()
  //   if (resp && resp.status === 'OK') {
  //     this.chainProduct = resp.data
  //   }
  // }

  itemsQuantityString(order: ChainProductOrder) {
    let kilos = order.items.map(ord => {
      let weightConv = ord.measurementUnitType.weight || 1
      return ord.totalQuantity * weightConv
    }).reduce((a, b) => a + b)
    return `${ kilos } kg`
  }

  generateQRCodes(stockOrder: ChainStockOrder) {
    const modalRef = this.modalService.open(GenerateQRCodeModalComponent, {
      centered: true,
      backdrop: 'static',
      keyboard: false
    });
    Object.assign(modalRef.componentInstance, {
      stockOrderId: dbKey(stockOrder),
      productId: this.productId
    })
    // let company = await modalRef.result;

  }

  ngOnDestroy() {
    this.unsubscribeList.cleanup()
  }

}
