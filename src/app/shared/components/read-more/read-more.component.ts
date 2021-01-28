import { Component, ElementRef, OnInit, Input, ViewChild, AfterViewInit } from '@angular/core';

@Component({
    selector: 'app-read-more',
    templateUrl: './read-more.component.html',
    styleUrls: ['./read-more.component.scss'],
})
export class ReadMoreComponent implements OnInit, AfterViewInit {
    @ViewChild('contentDom') contentDom: ElementRef;
    @ViewChild('buttonDom') buttonDom: ElementRef;
    @Input() content: any;
    @Input() rows = 1;
    public contentVisibility = false;
    lineHeight = 16;

    constructor() {}

    ngOnInit() {
        if (this.content.length < 10) {
            this.content =
                'There are many kinds of narratives and organizing principles. Science is driven by evidence gathered in experiments,e many kinds of narratives and organizing principles. Science is driven by evidence gathered in experie many kinds of narratives and organizing principles. Science is driven by evidence gathered in experie many kinds of narratives and organizing principles. Science is driven by evidence gathered in experie many kinds of narratives and organizing principles. Science is driven by evidence gathered in experie many kinds of narratives and organizing principles. Science is driven by evidence gathered in experi and by the falsification of extant theories and their replacement with newer, asymptotically truer, ones. Other systems – religion,v';
        }
    }

    ngAfterViewInit() {
        this.lineHeight = +window.getComputedStyle(this.contentDom.nativeElement).lineHeight.replace('px', '');
        if (this.contentDom.nativeElement.scrollHeight <= this.lineHeight * this.rows) {
            this.buttonDom.nativeElement.style.display = 'none';
        }
    }

    public toggleContent(event) {
        event.stopPropagation();
        event.preventDefault();
        this.contentVisibility = !this.contentVisibility;
    }
}
