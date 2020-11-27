import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'create-update-delete-buttons',
    templateUrl: './create-update-delete-buttons.component.html',
    styleUrls: ['./create-update-delete-buttons.component.scss']
})
export class CreateUpdateDeleteButtonsComponent implements OnInit {
    @Input()
    mode: 'create' | 'update' | 'delete' = 'create'

    @Output() onCancel = new EventEmitter<any>();
    @Output() onCreate = new EventEmitter<any>();
    @Output() onUpdate = new EventEmitter<any>();
    @Output() onDelete = new EventEmitter<any>();

    constructor() { }

    ngOnInit() {
    }

}
