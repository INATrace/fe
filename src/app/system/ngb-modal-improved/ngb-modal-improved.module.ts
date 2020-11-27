import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModalImproved } from './ngb-modal-improved.service';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
    declarations: [],
    imports: [
        CommonModule,
        NgbModalModule
    ],
    providers: [
        NgbModalImproved
    ]
})
export class NgbModalImprovedModule { }
