import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-system-left-panel',
  templateUrl: './system-left-panel.component.html',
  styleUrls: ['./system-left-panel.component.scss']
})
export class SystemLeftPanelComponent implements OnInit {

  @Input()
  title: string = null;

  @Input()
  isAdmin = false;

  constructor() { }

  ngOnInit(): void {
  }

}
