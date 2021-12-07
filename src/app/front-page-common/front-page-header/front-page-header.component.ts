import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-front-page-header',
  templateUrl: './front-page-header.component.html',
  styleUrls: ['./front-page-header.component.scss']
})
export class FrontPageHeaderComponent implements OnInit {

  @Input()
  tab: string;

  @Input()
  doShowTabs = true;

  uuid = this.route.snapshot.params.uuid;
  qrTag = this.route.snapshot.params.qrTag;

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
  }

  goTo(tab) {
    if (tab) { this.router.navigate(['/', 'p-cd', this.uuid, this.qrTag, tab]).then(); }
    else { this.router.navigate(['/', 'p-cd', this.uuid, this.qrTag]).then(); }
  }

}
