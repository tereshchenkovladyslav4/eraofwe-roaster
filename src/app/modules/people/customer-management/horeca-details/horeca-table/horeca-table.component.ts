import { Component, OnInit, ViewChild } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { DataTableDirective, DataTablesModule } from 'angular-datatables';
import { data } from 'jquery';
import { RoasterserviceService } from '@services';
import { ToastrService } from 'ngx-toastr';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { CustomerServiceService } from '../../customer-service.service';

@Component({
    selector: 'app-horeca-table',
    templateUrl: './horeca-table.component.html',
    styleUrls: ['./horeca-table.component.css'],
})
export class HorecaTableComponent implements OnInit {
    public mainData: any[] = [];
    folderId: any;
    estateId: any;
    roasterId: any;
    odd: boolean = false;
    itemId: any;

    constructor(
        public router: Router,
        public cookieService: CookieService,
        private roasterService: RoasterserviceService,
        private toastrService: ToastrService,
        public modalService: BsModalService,
        public customerService: CustomerServiceService,
    ) {
        this.estateId = this.cookieService.get('estate_id');
        this.roasterId = this.cookieService.get('roaster_id');
    }

    ngOnInit(): void {
        //Auth checking
        if (this.cookieService.get('Auth') == '') {
            this.router.navigate(['/auth/login']);
        }
        this.getHorecaTableData();
    }

    // Function Name : CheckAll
    // Description: This function helps to check all roles of the role list.
    checkAll(ev: any) {
        if (this.odd!) {
            this.mainData.forEach((x) => (x.state = ev.target.checked));
        }
    }

    // Function Name : IsAllchecked
    // Description: This function helps to check single role.
    isAllChecked() {
        if (this.odd!) {
            return this.mainData.every((_) => _.state);
        }
    }

    shareDetails(size: any) {
        if (size.id > 0) {
            this.itemId = size.id;
            let navigationExtras: NavigationExtras = {
                queryParams: {
                    itemId: encodeURIComponent(this.itemId),
                },
            };

            this.router.navigate(['/people/horeca-details'], navigationExtras);
        } else {
            console.log(size);
        }
    }

    getHorecaTableData() {
        this.roasterService.getHorecaTable(this.roasterId, this.customerService.horecaId).subscribe((data) => {
            if (data['success'] == true) {
                if (data['result'] == null || data['result'].length == 0) {
                    this.odd = true;
                    this.toastrService.error('Table Data is empty');
                } else {
                    this.odd = false;
                    console.log(data['result']);
                    this.mainData = data['result'];
                }
            } else {
                this.odd = true;
                this.toastrService.error('Error while getting the agreement list!');
            }
        });
    }
}
