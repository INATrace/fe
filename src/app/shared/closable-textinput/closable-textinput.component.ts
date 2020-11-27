import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-closable-textinput',
  templateUrl: './closable-textinput.component.html',
  styleUrls: ['./closable-textinput.component.scss']
})
export class ClosableTextinputComponent implements OnInit {

  constructor() { }

  @Input() form
  @Input() label
  @Input() placeholder

  showInput = true;
  ngOnInit(): void {
  }

  onToggle(event) {
    this.showInput = !event;
  }
}
