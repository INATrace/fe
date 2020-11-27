import { Component, OnInit, Input, ContentChild, ElementRef } from '@angular/core';
import { Observable } from 'rxjs';
import { Title } from '@angular/platform-browser';
import { RightPanelPositionComponent } from '../right-panel-position/right-panel-position.component';
import { environment } from 'src/environments/environment';
import { MenuShownService } from 'src/app/shared-services/menu-shown.service';

@Component({
  selector: 'general-layout',
  templateUrl: './general-layout.component.html',
  styleUrls: ['./general-layout.component.scss']
})
export class GeneralLayoutComponent implements OnInit {
    @Input()
    pageTitle: string = environment.appName;

    smallMenuShown$: Observable<boolean>;

    @ContentChild(RightPanelPositionComponent, {static: false})
    rightPanel: RightPanelPositionComponent;

    constructor(
        private menuShownService: MenuShownService,
        private titleService: Title
    ) {
        this.smallMenuShown$ = menuShownService.menuShown$;
    }

    ngOnInit() {
        this.titleService.setTitle(this.pageTitle);
    }

    hideMenu() {
        this.menuShownService.set(false);
    }
}
