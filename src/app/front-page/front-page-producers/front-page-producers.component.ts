import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PublicControllerService } from 'src/api/api/publicController.service';
import { take } from 'rxjs/operators';
import { DomSanitizer } from '@angular/platform-browser';
import { StockOrderService } from 'src/api-chain/api/stockOrder.service';
import { OrganizationService } from 'src/api-chain/api/organization.service';
import { ViewportScroller } from '@angular/common';
import { PublicService } from 'src/api-chain/api/public.service';

@Component({
  selector: 'app-front-page-producers',
  templateUrl: './front-page-producers.component.html',
  styleUrls: ['./front-page-producers.component.scss']
})
export class FrontPageProducersComponent implements OnInit {

  pageYoffset = 0;
  @HostListener('window:scroll', ['$event']) onScroll(event) {
    this.pageYoffset = window.pageYOffset;
  }

  constructor(
    private route: ActivatedRoute,
    private publicController: PublicControllerService,
    private sanitizer: DomSanitizer,
    private chainPublicController: PublicService,
    private chainOrganizationController: OrganizationService,
    private scroll: ViewportScroller
  ) { }

  tab: string = null;
  uuid = this.route.snapshot.params.uuid;

  titleFarmers = $localize`:@@frontPage.producers.title.meetFarmers:Meet the farmers`;
  titleCooperative = $localize`:@@frontPage.producers.title.meetCooperative:Meet the cooperative`;
  titleOwner = $localize`:@@frontPage.producers.title.meetOwner:The brand Angelique’s Finest owned by local producers`;

  videoRWurl = null;
  videoMeetTheFarmers = null;
  picsMeetTheFarmers: any[] = [];
  picsProduction: any[] = [];

  companyName: string = null;
  companyLogo = null;
  companyHeadquarters = null;
  companyAbout: string = null;
  companyEmail: string = null;
  companyNumber: string = null;
  companyPage: string = null;

  coopAbout: string = null;


  email = $localize`:@@frontPage.producers.title.email:Contact E-mail`;
  phone = $localize`:@@frontPage.producers.title.phone:Contact phone number`;
  webPage = $localize`:@@frontPage.producers.title.webPage:Company webpage URL`;
  headquarters = $localize`:@@frontPage.producers.title.headquarters:Company headquarters`;

  companyNameCooperative: string = null; //TODO

  lang: string = 'EN';
  soid = this.route.snapshot.params.soid;
  // soid = "f454a462-0d97-42b8-9888-f8844d945bf3";

  ngOnInit(): void {
    this.tab = this.route.snapshot.data.tab;
    this.init();
  }

  scrollToTop() {
    this.scroll.scrollToPosition([0, 0]);
  }

  async init() {
    let res = await this.publicController.getPublicProductLabelValuesUsingGET(this.uuid).pipe(take(1)).toPromise();
    if (res && res.status === "OK" && res.data) {
      for (let item of res.data.fields) {
        if (item.name === 'settings.language') this.lang = item.value;
      }
      // this.prepareData(res.data.fields);
    }

    //TODO

    if (this.soid != 'EMPTY') {

      let res = await this.chainPublicController.getB2CDataForStockOrder(this.soid, false, true).pipe(take(1)).toPromise();
      if (res && res.status === "OK" && res.data && res.data.length >= 1) {
        this.companyNameCooperative = res.data[0].cooperativeName;

        //Rambagira 17
        //Icyerekezo 10
        if (res.data[0].cooperativeAFId === 3) {
          let resRA = await this.publicController.getPublicCompanyUsingGET(17, this.lang).pipe(take(1)).toPromise();
          if (resRA && resRA.status === "OK" && resRA.data) {
            for (let data of resRA.data.documents) {
              if (data.type == "LINK" && data.category == "VIDEO") {
                this.videoMeetTheFarmers = this.sanitizer.bypassSecurityTrustResourceUrl(data.link.replace("youtu.be", "youtube.com/embed"));;
              }
              if (data.type == "FILE" && data.category == "MEET_THE_FARMER") {
                this.picsMeetTheFarmers.push(data);
              }
            }
          }
        } else if (res.data[0].cooperativeAFId === 1) {
          let resRA = await this.publicController.getPublicCompanyUsingGET(10, this.lang).pipe(take(1)).toPromise();
          if (resRA && resRA.status === "OK" && resRA.data) {
            for (let data of resRA.data.documents) {
              if (data.type == "LINK" && data.category == "VIDEO") {
                this.videoMeetTheFarmers = this.sanitizer.bypassSecurityTrustResourceUrl(data.link.replace("youtu.be", "youtube.com/embed"));;
              }
              if (data.type == "FILE" && data.category == "MEET_THE_FARMER") {
                this.picsMeetTheFarmers.push(data);
              }
            }
          }
        }

        let resCOOP = await this.publicController.getPublicCompanyUsingGET(res.data[0].cooperativeAFId, this.lang).pipe(take(1)).toPromise();
        if (resCOOP && resCOOP.status === "OK" && resCOOP.data) {
          if (resCOOP.data.about) this.coopAbout = resCOOP.data.about;
          for (let data of resCOOP.data.documents) {
            if (data.type == "FILE" && data.category == "PRODUCTION_RECORD") {
              this.picsProduction.push(data);
            }
          }
        }

      }
    }
    //Rwashoscco 2
    let resRW = await this.publicController.getPublicCompanyUsingGET(2, this.lang).pipe(take(1)).toPromise();
    if (resRW && resRW.status === "OK" && resRW.data) {
      for (let data of resRW.data.documents) {
        if (data.type == "LINK" && data.category == "VIDEO") {
          this.videoRWurl = this.sanitizer.bypassSecurityTrustResourceUrl(data.link.replace("youtu.be", "youtube.com/embed"));
        }
      }
    }

  }


  prepareData(data) {
    for (let item of data) {
      if (item.name === "company.name") {
        this.companyName = item.value;
      }
      if (item.name === "company.logo") {
        this.companyLogo = item.value;
      }
      if (item.name === "company.headquarters") {
        this.companyHeadquarters = item.value;
      }
      if (item.name === "company.about") {
        this.companyAbout = item.value;
      }
      if (item.name === "company.email") {
        this.companyEmail = item.value;
      }
      if (item.name === "company.phone") {
        this.companyNumber = item.value;
      }
      if (item.name === "company.webPage") {
        this.companyPage = item.value;
      }
    }
  }

}
