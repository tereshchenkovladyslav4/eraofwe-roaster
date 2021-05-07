import { Component, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { DialogService } from 'primeng/dynamicdialog';
import { RoasterserviceService, GlobalsService } from '@services';
import { CookieService } from 'ngx-cookie-service';
import { ToastrService } from 'ngx-toastr';
import { MenuItem, LazyLoadEvent } from 'primeng/api';
import { ConfirmComponent } from '@shared';
import { COUNTRY_LIST } from '@constants';

@Component({
    selector: 'app-product-list',
    templateUrl: './product-list.component.html',
    styleUrls: ['./product-list.component.scss'],
})
export class ProductListComponent implements OnInit {
    appLanguage: any;
    roasterId: any;
    breadCrumbItems: MenuItem[];
    tableData: any[] = [];
    tableColumns: any[] = [];
    isMobileView = false;
    loading = false;

    selectedOrigin: any;
    selectedPriceRange: any;
    selectedStatus: any;
    keywords: string;
    totalCount = 0;
    mobileFields: any[] = [
        {
            field: 'status',
            header: 'Status',
        },
        {
            field: 'origin',
            header: 'Origin',
        },
        {
            field: 'estate_name',
            header: 'Estate',
        },
        {
            field: 'roast_level',
            header: 'Roast',
        },
        {
            field: 'price',
            header: 'Price',
            sortable: false,
        },
    ];

    priceRangeArray: any[] = [
        { label: '$0-$500', value: { price_min: '0', price_max: '500' } },
        { label: '$500-$1000', value: { price_min: '500', price_max: '1000' } },
    ];
    statusArray: any[] = [
        { label: 'In Stock', value: 'IN-STOCK' },
        { label: 'Sold', value: 'OUT-OF-STOCK' },
    ];

    originArray = COUNTRY_LIST;

    @HostListener('window:resize', ['$event'])
    onResize(event?) {
        this.initializeTable();
    }

    constructor(
        public dialogSrv: DialogService,
        public router: Router,
        public cookieService: CookieService,
        private roasterService: RoasterserviceService,
        private toastrService: ToastrService,
        public globals: GlobalsService,
    ) {}

    ngOnInit(): void {
        this.initializeTable();
        this.roasterId = this.cookieService.get('roaster_id');
        this.breadCrumbItems = [
            { label: this.globals.languageJson?.home, routerLink: '/' },
            { label: this.globals.languageJson?.e_commerce_catalog_management },
        ];
    }

    initializeTable() {
        this.isMobileView = window.innerWidth <= 767;
        if (this.isMobileView) {
            this.tableColumns = [
                {
                    field: 'name',
                    header: 'Product Name',
                    sortable: false,
                },
                {
                    field: 'featured_image',
                    header: 'image',
                    sortable: false,
                },
            ];
        } else {
            this.tableColumns = [
                {
                    field: 'name',
                    header: 'Product Name',
                    sortable: false,
                    width: '190px',
                },
                {
                    field: 'origin',
                    header: 'Origin',
                    sortable: false,
                },
                {
                    field: 'estate_name',
                    header: 'Estate Name',
                },
                {
                    field: 'roast_level',
                    header: 'Roast Level',
                    sortable: false,
                },
                {
                    field: 'weight',
                    header: 'Weight',
                    sortable: false,
                },
                {
                    field: 'status',
                    header: 'Status',
                    sortable: false,
                },
                {
                    field: 'price',
                    header: 'Price',
                    sortable: false,
                },
                {
                    field: 'actions',
                    header: 'Actions',
                    sortable: false,
                },
            ];
        }
    }

    loadData(event?: LazyLoadEvent) {
        let page = 1;
        if (event) {
            page = event.first / event.rows + 1;
        }
        setTimeout(() => (this.loading = true), 0);
        const options = {
            page,
            per_page: 10,
            name: this.keywords ?? '',
            status: this.selectedStatus ?? '',
            origin: this.selectedOrigin ?? '',
            price_min: this.selectedPriceRange?.price_min ?? '',
            price_max: this.selectedPriceRange?.price_max ?? '',
            sort_by: event?.sortField,
            sort_order: event?.sortOrder === 1 ? 'asc' : 'desc',
        };

        this.roasterService.getSelectProductDetails(this.roasterId, options).subscribe(
            (res: any) => {
                if (res.success) {
                    this.tableData = res.result ?? [];
                    this.totalCount = res.result_info.total_count;
                } else {
                    this.toastrService.error('Error while getting the agreement list!');
                }
                this.loading = false;
            },
            (err) => {
                this.loading = false;
                this.toastrService.error('Error while getting the agreement list!');
            },
        );
    }

    deleteproduct(deleteId): void {
        this.dialogSrv
            .open(ConfirmComponent, {
                data: {
                    type: 'delete',
                },
                showHeader: false,
                styleClass: 'confirm-dialog',
            })
            .onClose.subscribe((action: any) => {
                if (action === 'yes') {
                    this.roasterService.deleteProductDetails(this.roasterId, deleteId).subscribe(
                        (res) => {
                            if (res.success) {
                                this.toastrService.success('Product deleted successfully');
                                this.loadData();
                            } else {
                                this.toastrService.error('Error while deleting the product');
                            }
                        },
                        (err) => {
                            this.toastrService.error('Error while deleting the product');
                        },
                    );
                }
            });
    }

    getMenuItemsForItem(item) {
        const items = [
            {
                label: this.globals.languageJson?.edit_product,
                command: () => {
                    this.onViewDetails(item);
                },
            },
            {
                label: this.globals.languageJson?.delete,
                command: () => {
                    this.deleteproduct(item.id);
                },
            },
        ];
        return [{ items }];
    }

    onViewDetails(item) {
        this.router.navigate([`/e-commerce/product-details/${item.id}`]);
    }
}