import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-system-left-panel',
  templateUrl: './system-left-panel.component.html',
  styleUrls: ['./system-left-panel.component.scss']
})
export class SystemLeftPanelComponent implements OnInit {

  @Input()
  title: string = null;

  constructor(
    private router: Router
  ) { }

  ngOnInit(): void {
  }

}
