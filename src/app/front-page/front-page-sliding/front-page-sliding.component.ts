import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-front-page-sliding',
  templateUrl: './front-page-sliding.component.html',
  styleUrls: ['./front-page-sliding.component.scss']
})
export class FrontPageSlidingComponent implements OnInit {

  @Input()
  tab: string;

  uuid = this.route.snapshot.params.uuid;
  qrTag = this.route.snapshot.params.qrTag;

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void { }

  goTo(tab) {
    if (tab) { this.router.navigate(['/', 'p-cd', this.uuid, this.qrTag, tab]).then(); }
    else { this.router.navigate(['/', 'p-cd', this.uuid, this.qrTag]).then(); }
  }

  onSwipeLeft() {
    if (this.tab === 'journey') { this.goTo('fair-prices'); }
    if (this.tab === 'fair-prices') { this.goTo('producers'); }
    if (this.tab === 'producers') { this.goTo('quality'); }
    if (this.tab === 'quality') { this.goTo('feedback'); }
    if (this.tab === 'feedback') { }
  }

  onSwipeRight() {
    if (this.tab === 'journey') { this.goTo(null); }
    if (this.tab === 'fair-prices') { this.goTo('journey'); }
    if (this.tab === 'producers') { this.goTo('fair-prices'); }
    if (this.tab === 'quality') { this.goTo('producers'); }
    if (this.tab === 'feedback') { this.goTo('quality'); }
  }

}
