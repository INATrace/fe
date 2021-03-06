import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-front-page-carousel',
  templateUrl: './front-page-carousel.component.html',
  styleUrls: ['./front-page-carousel.component.scss']
})
export class FrontPageCarouselComponent implements OnInit {

  constructor() { }

  @Input()
  slides;

  @Input()
  productionRecords: boolean = false;

  ngOnInit(): void {
  }

  currentSlide = 0;

  onPreviousClick() {
    const previous = this.currentSlide - 1;
    this.currentSlide = previous < 0 ? this.slides.length - 1 : previous;
  }

  onNextClick() {
    const next = this.currentSlide + 1;
    this.currentSlide = next === this.slides.length ? 0 : next;
  }

}
