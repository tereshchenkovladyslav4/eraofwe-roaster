import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-info-tooltip',
  templateUrl: './info-tooltip.component.html',
  styleUrls: ['./info-tooltip.component.scss']
})
export class InfoTooltipComponent implements OnInit {
  @Input() title = '';
  @Input() description = '';

  constructor() { }

  ngOnInit(): void {
  }

}
