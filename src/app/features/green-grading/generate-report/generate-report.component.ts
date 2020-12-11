import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-generate-report',
  templateUrl: './generate-report.component.html',
  styleUrls: ['./generate-report.component.css']
})
export class GenerateReportComponent implements OnInit {
  currentScreen:any="screen1";
  constructor() { }

  ngOnInit(): void {

    $('.nav-links__item').removeClass('active');
    $('.nav-links__item').eq(3).addClass('active');
  }

  goNext(event){
    console.log(event);
    this.currentScreen=event;

  }

}