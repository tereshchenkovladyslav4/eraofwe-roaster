import { Component, OnInit, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { SharedServiceService } from '@app/shared/services/shared-service.service';
import { DashboardserviceService, GlobalsService, RoasterserviceService } from '@services';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { CookieService } from 'ngx-cookie-service';
import { ToastrService } from 'ngx-toastr';
import { MenuItem } from 'primeng/api';

@Component({
    selector: 'app-product-list',
    templateUrl: './product-list.component.html',
    styleUrls: ['./product-list.component.scss'],
})
export class ProductListComponent implements OnInit {
    breadCrumbItem: MenuItem[] = [];
    showStatus = false;
    showOrigin = false;
    statusFilter = '';
    originFilter = '';
    termSearch = '';
    showPrice = false;
    priceFilter = '';
    tableColumns = [];
    tableValue = [];
    totalCount = 0;
    selectedProducts = [];
    deleteProductID = '';
    modalRef: BsModalRef;
    roasterID: any = '';

    constructor(
        public router: Router,
        public cookieService: CookieService,
        public dashboard: DashboardserviceService,
        private roasterService: RoasterserviceService,
        private toastrService: ToastrService,
        public modalService: BsModalService,
        public globals: GlobalsService,
        public sharedService: SharedServiceService,
    ) {}

    ngOnInit(): void {
        this.sharedService.windowWidth = window.innerWidth;
        this.roasterID = this.cookieService.get('roaster_id');
        if (this.sharedService.windowWidth <= this.sharedService.responsiveStartsAt) {
            this.sharedService.isMobileView = true;
        }
        this.tableColumns = [
            {
                field: 'name',
                header: 'Product Name',
                sortable: false,
                width: 15,
            },
            {
                field: 'origin',
                header: 'Origin',
                sortable: false,
                width: 10,
            },
            {
                field: 'estate_name',
                header: 'Estate Name',
                width: 15,
            },
            {
                field: 'roast_level',
                header: 'Roast Level',
                sortable: false,
                width: 10,
            },
            {
                field: 'weight',
                header: 'Weight',
                sortable: false,
                width: 10,
            },
            {
                field: 'status',
                header: 'Status',
                sortable: false,
                width: 10,
            },
            {
                field: 'price',
                header: 'Price',
                sortable: false,
                width: 10,
            },
            {
                field: 'actions',
                header: 'Actions',
                sortable: false,
                width: 15,
            },
        ];
        this.supplyBreadCrumb();
    }
    supplyBreadCrumb(): void {
        const obj1: MenuItem = {
            label: this.globals.languageJson?.home,
            routerLink: '/features/welcome-aboard',
            disabled: false,
        };
        const obj2: MenuItem = {
            label: this.globals.languageJson?.products,
            disabled: true,
        };
        this.breadCrumbItem.push(obj1);
        this.breadCrumbItem.push(obj2);
    }
    getTableData(event?) {
        // const postData = {};
        // postData['role_id'] = this.filterRoleID ? this.filterRoleID : '';

        // postData['name'] = this.termSearch ? this.termSearch : '';
        // // eslint-disable-next-line no-constant-condition
        // postData['status'] = !this.termStatus ? undefined : this.termStatus == 'Status' ? '' : this.statusValue;
        // postData['per_page'] = 100;
        this.roasterService.getSelectProductDetails(this.roasterID).subscribe(
            (data) => {
                if (data['success']) {
                    this.tableValue = data['result'];
                } else {
                    this.toastrService.error('Error while getting the agreement list!');
                }
            },
            (err) => {
                this.toastrService.error('Error while getting the agreement list!');
            },
        );
    }
    setType(pricerange): void {
        console.log(pricerange);
    }
    setOrigin(origin): void {}
    setStatus(status): void {}
    deleteproduct(): void {}
    openDeleteModal(template1: TemplateRef<any>, deleteId: any) {
        this.modalRef = this.modalService.show(template1);
        this.deleteProductID = deleteId;
    }
}