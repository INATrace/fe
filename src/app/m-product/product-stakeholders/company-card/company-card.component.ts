import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-company-card',
  templateUrl: './company-card.component.html',
  styleUrls: ['./company-card.component.scss']
})
export class CompanyCardComponent implements OnInit {

  @Input()
  company;

  @Input()
  owner = false;

  @Output() onSelect = new EventEmitter<boolean>();

  constructor(
  ) { }

  ngOnInit(): void {
  }

  selectItem(item, preventEmit = false) {
    if (!preventEmit) {
      this.onSelect.next(item)
    }
  }
}
