import { Component, OnInit, Input } from '@angular/core';
import { formatDateWithDots } from 'src/shared/utils';

@Component({
  selector: 'app-last-seen-tag',
  templateUrl: './last-seen-tag.component.html',
  styleUrls: ['./last-seen-tag.component.scss']
})
export class LastSeenTagComponent implements OnInit {

  constructor() { }

  @Input()
  identifier;

  @Input()
  dateFormat;

  date;
  time;
  ngOnInit(): void {
    this.formatDateAndHour()
  }

  formatDateAndHour() {
    let date = new Date(this.dateFormat);
    this.date = formatDateWithDots(this.dateFormat);
    this.time = date.getHours() + ':' + date.getMinutes().toString().padStart(2, "0");
  }
}
