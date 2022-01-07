import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-product-label-front-layout',
  templateUrl: './product-label-front-layout.component.html',
  styleUrls: ['./product-label-front-layout.component.scss']
})
export class ProductLabelFrontLayoutComponent implements OnInit {

  isGreenPaddingNeeded = false;
  isBreadcrumbsSpaceNeeded = false;
  drobtinice = [];

  constructor(
    private router: Router,
    public route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    //There must be a better way of doing this?
    if (this.router.url.startsWith('/p/')) {
      this.isGreenPaddingNeeded = true;
      this.isBreadcrumbsSpaceNeeded = false;
    } else {
      this.isGreenPaddingNeeded = false;
      this.isBreadcrumbsSpaceNeeded = true;
      this.drobtinice = this.route.snapshot.data.drobtinice;
      // console.log(this.drobtinice)
    }
  }

}
