import { Component, OnInit, HostListener } from '@angular/core';
import { Location } from '@angular/common';
import { GlobalsService, GreenGradingService, AclService } from '@services';
import { ToastrService } from 'ngx-toastr';
import { GenerateReportService } from '../generate-report/generate-report.service';
import { MenuItem, LazyLoadEvent } from 'primeng/api';
import { LabelValue } from '@models';
import { OrderType } from '@enums';

@Component({
    selector: 'app-assign-orders',
    templateUrl: './assign-orders.component.html',
    styleUrls: ['./assign-orders.component.scss'],
})
export class AssignOrdersComponent implements OnInit {
    breadCrumbItems: MenuItem[];
    selectedOrderType: any;
    displayRowCounts = 10;
    term = '';

    tableData: any[] = [];
    tableColumns: any[] = [];
    selectedRows: any[] = [];
    isMobileView = false;
    totalCount = 0;

    loading = false;

    readonly displayOptions: LabelValue[] = [
        { label: '5', value: 5 },
        { label: '10', value: 10 },
        { label: '25', value: 25 },
        { label: '50', value: 50 },
    ];

    readonly orderTypeItems = [
        { label: 'Sample', value: OrderType.Sample },
        { label: 'Booked', value: OrderType.Booked },
    ];

    @HostListener('window:resize', ['$event'])
    onResize(event?) {
        this.initializeTable();
    }

    constructor(
        public globals: GlobalsService,
        public generateReportService: GenerateReportService,
        private greenGradingService: GreenGradingService,
        private toaster: ToastrService,
        private location: Location,
        private aclService: AclService,
    ) {}

    ngOnInit(): void {
        this.breadCrumbItems = [
            { label: this.globals.languageJson?.home, routerLink: '/features/micro-roaster-dashboard' },
            { label: this.globals.languageJson?.menu_sourcing },
            { label: this.globals.languageJson?.green_grading, routerLink: '/green-grading' },
            { label: this.globals.languageJson?.assign_orders },
        ];
        if (!this.aclService.checkPermission('cupping-management')) {
            this.toaster.error('You have no permission.');
            this.location.back();
        }
        this.initializeTable();
    }

    initializeTable() {
        if (window.innerWidth <= 767) {
            this.isMobileView = true;
            this.tableColumns = [
                {
                    field: 'order_id',
                    header: 'Order ID',
                    sortable: false,
                },
                {
                    field: 'estate_name',
                    header: 'Estate name',
                    sortable: false,
                },
                {
                    field: 'origin',
                    header: 'Origin',
                    sortable: false,
                },
                {
                    field: 'varieties',
                    header: 'Variety',
                    sortable: false,
                    isCut: true,
                },
            ];
        } else {
            this.isMobileView = false;
            this.tableColumns = [
                {
                    field: 'order_id',
                    header: 'Order ID',
                    sortable: false,
                    width: '90px',
                },
                {
                    field: 'estate_name',
                    header: 'Estate name',
                    sortable: false,
                    width: '132px',
                },
                {
                    field: 'order_date',
                    header: 'Date ordered',
                    sortable: true,
                },
                {
                    field: 'origin',
                    header: 'Origin',
                    sortable: false,
                },

                {
                    field: 'varieties',
                    header: 'Variety',
                    sortable: false,
                },
                {
                    field: 'order_type',
                    header: 'Type of order',
                    sortable: false,
                },

                {
                    field: 'type',
                    header: 'Type',
                    sortable: false,
                },
                {
                    field: 'assigned_to',
                    header: 'Assigned to',
                    sortable: false,
                },
            ];
        }
    }

    loadData(event?: LazyLoadEvent): void {
        let page = 1;
        if (event) {
            page = event.first / event.rows + 1;
        }
        setTimeout(() => (this.loading = true), 0); // To prevent expression has been checked error
        const options = {
            page,
            per_page: this.displayRowCounts,
            query: this.term,
            order_type: this.selectedOrderType,
            sort_by: event?.sortField ?? 'order_date',
            sort_order: event?.sortField ? (event?.sortOrder === 1 ? 'asc' : 'desc') : 'desc',
        };
        this.greenGradingService.getAssignOrder(options).subscribe((res: any) => {
            if (res.success === true) {
                this.tableData = res.result;
                this.generateReportService.totalRequestList = res.success ? res.result : [];
                this.totalCount = res.result_info.total_count;
            }
            this.loading = false;
            this.selectedRows = this.generateReportService.serviceRequestsList ?? [];
        });
    }
}
