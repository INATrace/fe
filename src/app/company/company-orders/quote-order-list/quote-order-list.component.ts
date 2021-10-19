import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-quote-order-list',
  templateUrl: './quote-order-list.component.html',
  styleUrls: ['./quote-order-list.component.scss']
})
export class QuoteOrderListComponent implements OnInit {

  @Input()
  mode: 'INPUT' | 'CUSTOMER' = 'INPUT';

  @Input()
  facilityId$ = new BehaviorSubject<number>(null);

  @Input()
  semiProductId$ = new BehaviorSubject<number>(null);

  @Input()
  companyId: number = null;

  @Input()
  companyCustomerId$ = new BehaviorSubject<number>(null);

  @Input()
  openOnly$ = new BehaviorSubject<boolean>(false);

  @Output()
  showing = new EventEmitter<number>();

  @Output()
  countAll = new EventEmitter<number>();

  constructor() { }

  ngOnInit(): void {
  }

}
