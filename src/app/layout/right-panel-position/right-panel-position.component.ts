import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-right-panel-position',
  templateUrl: './right-panel-position.component.html',
  styleUrls: ['./right-panel-position.component.scss']
})
export class RightPanelPositionComponent implements OnInit {
  @Input() full: string;
  @Input() content: string;
  @Input() half: string;

  constructor() { }

  ngOnInit(): void {
  }

}
