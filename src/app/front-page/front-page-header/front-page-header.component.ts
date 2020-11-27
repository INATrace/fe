import { trigger } from '@angular/animations';
import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { faLeaf } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-front-page-header',
  templateUrl: './front-page-header.component.html',
  styleUrls: ['./front-page-header.component.scss']
})
export class FrontPageHeaderComponent implements OnInit {

  @Input()
  tab: string;

  @Input()
  doShowTabs: boolean = true;

  uuid = this.route.snapshot.params.uuid;
  soid = this.route.snapshot.params.soid;

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
  }


  goTo(tab) {
    if (tab) this.router.navigate(['/', 'p-cd', this.uuid, this.soid, tab]);
    else this.router.navigate(['/', 'p-cd', this.uuid, this.soid]);
  }

}
