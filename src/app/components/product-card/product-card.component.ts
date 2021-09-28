import { Component, OnInit, Input } from '@angular/core';
import { ApiProductListResponse } from '../../../api/model/apiProductListResponse';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss']
})
export class ProductCardComponent implements OnInit {

  @Input()
  product: ApiProductListResponse;

  constructor() { }

  ngOnInit(): void { }

}
