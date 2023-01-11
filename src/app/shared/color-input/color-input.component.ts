import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-color-input',
  templateUrl: './color-input.component.html',
  styleUrls: ['./color-input.component.scss']
})
export class ColorInputComponent implements OnInit {

  constructor() { }

  @Input()
  control: FormControl;

  @Input()
  disabled = false;

  ngOnInit(): void {
  }

}
