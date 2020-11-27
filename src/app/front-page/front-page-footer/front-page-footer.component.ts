import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PublicControllerService } from 'src/api/api/publicController.service';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-front-page-footer',
  templateUrl: './front-page-footer.component.html',
  styleUrls: ['./front-page-footer.component.scss']
})
export class FrontPageFooterComponent implements OnInit {

  @Input()
  showSplitter: boolean = true;

  uuid = this.route.snapshot.params.uuid;
  soid = this.route.snapshot.params.soid;

  constructor(
    private route: ActivatedRoute,
    private publicController: PublicControllerService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.initLabel();
  }

  async initLabel() {
    let res = await this.publicController.getPublicProductLabelValuesUsingGET(this.uuid).pipe(take(1)).toPromise();
    if (res && res.status === "OK") {
      this.prepareSocial(res.data.fields);
    }
  }

  facebook = null;
  twitter = null;
  instagram = null;
  youtube = null;
  other = null;
  prepareSocial(data) {
    for (let item of data) {
      if (item.name === "company.mediaLinks.facebook" && item.value) {
        this.facebook = this.checkExternalLink(item.value);
      }
      if (item.name === "company.mediaLinks.twitter" && item.value) {
        this.twitter = this.checkExternalLink(item.value);
      }
      if (item.name === "company.mediaLinks.instagram" && item.value) {
        this.instagram = this.checkExternalLink(item.value);
      }
      if (item.name === "company.mediaLinks.youtube" && item.value) {
        this.youtube = this.checkExternalLink(item.value);
      }
      if (item.name === "company.mediaLinks.other" && item.value) {
        this.other = this.checkExternalLink(item.value);
      }
    }
  }

  checkExternalLink(link: string): string {
    if (!link) return '#';
    if (!link.startsWith('https://') && !link.startsWith('http://')) {
      return 'http://' + link;
    }
    return link;
  }


  goTo(page) {
    this.router.navigate(['/', 's', this.uuid, this.soid, page]);
  }

}
