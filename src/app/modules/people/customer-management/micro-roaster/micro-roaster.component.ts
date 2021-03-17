import { Component, OnInit, ViewChild } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { DataTableDirective, DataTablesModule } from 'angular-datatables';
import { data } from 'jquery';
import { RoasterserviceService } from '@services';
import { ToastrService } from 'ngx-toastr';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { GlobalsService } from '@services';
import { environment } from 'src/environments/environment';
import { CustomerServiceService } from '../customer-service.service';
import { UserserviceService } from '@services';

@Component({
    selector: 'app-micro-roaster',
    templateUrl: './micro-roaster.component.html',
    styleUrls: ['./micro-roaster.component.css'],
})
export class MicroRoasterComponent implements OnInit {
    public mainData: any[];
    folderId: any;
    roasterId: any;
    odd = false;
    appLanguage?: any;
    microActive: any = 0;
    microRoasterWeb = 'https://qa-micro-roaster.sewnstaging.com';
    emailId: any;
    constructor(
        public router: Router,
        public cookieService: CookieService,
        private roasterService: RoasterserviceService,
        private toastrService: ToastrService,
        public modalService: BsModalService,
        public globals: GlobalsService,
        public customer: CustomerServiceService,
        public userService: UserserviceService,
    ) {
        this.roasterId = this.cookieService.get('roaster_id');
    }

    ngOnInit(): void {
        // Auth checking
        if (this.cookieService.get('Auth') === '') {
            this.router.navigate(['/auth/login']);
        }
        this.getMicroRoaster();
        this.language();
    }

    language() {
        this.appLanguage = this.globals.languageJson;
        this.microActive++;
    }

    shareDetails(size: any) {
        if (size.status === 'PENDING') {
            this.customer.emailId = size.email;
            // this.customer.headerValue="Micro-Roaster";
            this.customer.pendingMrDetails();
            this.router.navigate(['/people/pending-details']);
        } else {
            this.folderId = size.id;
            const navigationExtras: NavigationExtras = {
                queryParams: {
                    folderId: encodeURIComponent(this.folderId),
                },
            };

            this.router.navigate(['/people/micro-roaster-details'], navigationExtras);
        }
    }

    getMicroRoaster() {
        this.roasterService.getMicroRoasters(this.roasterId).subscribe((getRoaster: any) => {
            if (getRoaster.success === true) {
                if (getRoaster.result == null || getRoaster.result.length === 0) {
                    this.odd = true;
                    this.toastrService.error('Table Data is empty');
                } else {
                    this.odd = false;
                    this.mainData = getRoaster.result;
                }
                this.microActive++;
            } else {
                this.odd = true;
                this.toastrService.error('Error while getting the table list!');
            }
        });
    }

    // Function Name : CheckAll
    // Description: This function helps to check all roles of the role list.
    checkAll(ev: any) {
        // if(this.odd!){
        this.mainData.forEach((x) => (x.state = ev.target.checked));
        // }
    }

    // Function Name : IsAllchecked
    // Description: This function helps to check single role.
    isAllChecked() {
        // if(this.odd!){
        return this.mainData.every((_) => _.state);
        // }
    }
    deleteMicroRoaster(itemId: any) {
        this.userService.deleteMicroRoaster(this.roasterId, itemId).subscribe((deletedRoaster: any) => {
            if (deletedRoaster.success === true) {
                this.toastrService.success('Customer deleted sucessfully!');
                this.getMicroRoaster();
            } else {
                this.toastrService.error('Error while deleting customer');
            }
        });
    }
}
