import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

@Component({
    selector: 'app-api-request-details',
    templateUrl: './api-request-details.component.html',
    styleUrls: ['./api-request-details.component.css'],
})
export class ApiRequestDetailsComponent implements OnInit {
    termStatus: any;
    btnToggle = true;
    statusChange: string;
    modalRef: BsModalRef;
    resetButtonValue: string;
    showStatus: boolean = true;

    constructor(private modalService: BsModalService) {
        this.termStatus = '';
    }

    @ViewChild('pausetemplate') private pausetemplate: any;
    @ViewChild('deletetemplate') private deletetemplate: any;

    openModal(template: TemplateRef<any>) {
        this.modalRef = this.modalService.show(template);
    }
    ngOnInit(): void {
        this.resetButtonValue = 'Generate Key';
    }
    activeStatus() {
        this.btnToggle = !this.btnToggle;
        if (this.btnToggle == true) {
            this.statusChange = 'ACTIVE';
        } else {
            this.statusChange = 'INACTIVE';
        }
    }

    setStatus(term: any) {
        this.termStatus = term;
        console.log(this.termStatus);
    }

    toggleStatus() {
        this.showStatus = !this.showStatus;
        if (this.showStatus == false) {
            document.getElementById('status_id').style.border = '1px solid #30855c';
        } else {
            document.getElementById('status_id').style.border = '1px solid #d6d6d6';
        }
    }

    delete() {
        this.openModal(this.deletetemplate);
    }
    pause() {
        this.openModal(this.pausetemplate);
    }
}
