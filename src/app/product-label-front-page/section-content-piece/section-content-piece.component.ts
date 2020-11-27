import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-section-content-piece',
  templateUrl: './section-content-piece.component.html',
  styleUrls: ['./section-content-piece.component.scss']
})
export class SectionContentPieceComponent implements OnInit {

  @Input()
  title: string;

  @Input()
  content: string;

  @Input()
  href: string;

  @Input()
  target: string = '_blank';

  constructor() { }

  ngOnInit(): void {
  }

}
