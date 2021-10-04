import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-number-row',
  templateUrl: './number-row.component.html',
  styleUrls: ['./number-row.component.scss']
})
export class NumberRowComponent implements OnInit {

  @Input()
  label = null;
  constructor() { }

  ngOnInit(): void {
  }

}
