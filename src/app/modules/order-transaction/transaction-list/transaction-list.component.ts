import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { GlobalsService, ResizeService, OrderTransactionPrimeTableService, AuthService } from '@services';
import { CookieService } from 'ngx-cookie-service';
import { FormGroup, FormControl } from '@angular/forms';
import { Table } from 'primeng/table';
import { ResizeableComponent } from '@base-components';
import { takeUntil } from 'rxjs/operators';
import * as moment from 'moment';

@Component({
    selector: 'app-transaction-list',
    templateUrl: './transaction-list.component.html',
    styleUrls: ['./transaction-list.component.scss'],
})
export class TransactionListComponent extends ResizeableComponent implements OnInit {
    breadItems = [
        { label: this.globals.languageJson?.home, routerLink: '/' },
        { label: this.globals.languageJson?.order_management, routerLink: '/' },
        { label: this.globals.languageJson?.order_management, routerLink: '/' },
        { label: this.globals.languageJson?.order_transactions },
    ];

    public readonly perPageItemList = [
        { label: 'Display 10', value: 10 },
        { label: 'Display 20', value: 20 },
        { label: 'Display 25', value: 25 },
        { label: 'Display 50', value: 50 },
    ];

    public readonly channelItemList = [
        { label: 'HoReCa Outtake', value: 'OUTTAKE_ROASTED' },
        { label: 'Micro-Roaster Outtake', value: 'OUTTAKE_GREEN' },
        { label: 'B2B', value: 'B2B' },
        { label: 'B2C', value: 'B2C' },
        { label: 'Micro-roaster', value: 'MICRO_ROASTER' },
    ];

    public readonly orderTypeItemList = [
        { label: 'Subscription', value: 'subscription' },
        { label: 'One time', value: 'one-time' },
    ];
    public readonly paymentTypeList = [
        { label: 'Klarna', value: 'klarna' },
        { label: 'Swish', value: 'swish' },
        { label: 'Invoice', value: 'invoice' },
    ];

    public readonly channelItemMap = {};
    public readonly orderTypeItemMap = {};
    public readonly paymentTypeMap = {};

    fcSearchQuery: FormControl;
    fCDocumentDateRange: FormControl;
    fCOrderType: FormControl;
    fcPaymentType: FormControl;
    fCperPage: FormControl;
    fCchannel: FormControl;
    uiForm: FormGroup;

    roasterId: any;

    @ViewChild('markedTable', { static: true }) table: Table;

    @HostListener('window:resize', ['$event'])
    onResize(event?) {
        this.initializeTable();
    }

    constructor(
        public globals: GlobalsService,
        public primeTableService: OrderTransactionPrimeTableService,
        protected resizeService: ResizeService,
        private authService: AuthService,
    ) {
        super(resizeService);
        this.roasterId = this.authService.getOrgId();
        this.channelItemMap = {};
        this.channelItemList.forEach((lisItem) => {
            this.channelItemMap[lisItem.value] = lisItem.label;
        });
        this.orderTypeItemMap = {};
        this.orderTypeItemList.forEach((lisItem) => {
            this.orderTypeItemMap[lisItem.value] = lisItem.label;
        });
        this.paymentTypeMap = {};
        this.paymentTypeList.forEach((x) => {
            this.paymentTypeMap[x.value] = x.label;
        });
    }

    ngOnInit(): void {
        this.primeTableService.orderTypeItemMap = this.orderTypeItemMap;
        this.primeTableService.rows = this.perPageItemList[0].value;
        this.primeTableService.sortBy = 'document_date';
        this.primeTableService.sortOrder = 'desc';
        this.primeTableService.url = `/ro/${this.roasterId}/transactions`;
        this.primeTableService.roasterId = this.roasterId;

        this.fcSearchQuery = new FormControl('');
        this.fCDocumentDateRange = new FormControl(null);
        this.fCperPage = new FormControl(this.perPageItemList[0].value);
        this.fCchannel = new FormControl(null);
        this.fCOrderType = new FormControl(null);
        this.fcPaymentType = new FormControl(null);
        this.uiForm = new FormGroup({
            fcSearchQuery: this.fcSearchQuery,
            fCDocumentDateRange: this.fCDocumentDateRange,
            fCperPage: this.fCperPage,
            fCchannel: this.fCchannel,
            fcPaymentType: this.fcPaymentType,
            fCOrderType: this.fCOrderType,
        });

        this.initializeTable();
        this.updateServiceValues();
        this.table.reset();

        this.uiForm.valueChanges.pipe(takeUntil(this.unsubscribeAll$)).subscribe((value) => {
            this.updateServiceValues();
            setTimeout(() => {
                this.table.reset();
            }, 0);
        });
    }

    updateServiceValues() {
        const value = this.uiForm.value;
        this.primeTableService.rows = value.fCperPage || this.perPageItemList[0].value;
        this.primeTableService.searchQuery = value.fcSearchQuery;

        const startDate =
            value.fCDocumentDateRange && value.fCDocumentDateRange[0]
                ? moment(value.fCDocumentDateRange[0]).format('yyyy-MM-DD')
                : '';
        const endDate =
            value.fCDocumentDateRange && value.fCDocumentDateRange[1]
                ? moment(value.fCDocumentDateRange[1]).add(1, 'day').format('yyyy-MM-DD')
                : '';

        this.primeTableService.documentToDate = startDate;
        this.primeTableService.documentFromDate = endDate;
        this.primeTableService.paymentMode = value.fcPaymentType;
        this.primeTableService.orderType = value.fCOrderType;
        this.primeTableService.channel = value.fCchannel;
    }

    initializeTable() {
        const commonColumns = [
            {
                field: 'account_name',
                header: 'Cust. name',
                sortable: false,
                width: 100,
            },
            {
                field: 'channel',
                header: 'Channel',
                sortable: false,
                width: 100,
            },
            {
                field: 'document_number',
                header: 'Doc. no.',
                sortable: false,
                width: 100,
            },
            {
                field: 'document_date',
                header: 'Doc. date',
                sortable: true,
                width: 120,
            },
            {
                field: 'document_type',
                header: 'Doc. type',
                sortable: false,
                width: 100,
            },
            {
                field: 'order_type',
                header: 'Order type',
                sortable: false,
                width: 100,
            },
            {
                field: 'payment_type',
                header: 'Mode',
                sortable: false,
                width: 100,
            },
            {
                field: 'total_amount',
                header: 'Total amt.',
                sortable: false,
                width: 160,
            },
            {
                field: 'vat_amount',
                header: 'VAT',
                sortable: false,
                width: 140,
            },
            {
                field: 'commission_amount',
                header: 'Commission',
                sortable: false,
                width: 140,
            },
        ];
        this.primeTableService.windowWidth = window.innerWidth;
        if (this.primeTableService.windowWidth <= this.primeTableService.responsiveStartsAt) {
            this.primeTableService.isMobileView = true;
            this.primeTableService.allColumns = [
                {
                    field: 'mobile-details',
                    header: 'Details',
                    sortable: false,
                    width: 100,
                },
                ...commonColumns,
            ];
        } else {
            this.primeTableService.isMobileView = false;
            this.primeTableService.allColumns = [
                {
                    field: 'account_number',
                    header: 'Cust. ID',
                    sortable: false,
                    width: 100,
                },
                ...commonColumns,
            ];
        }
    }

    get isDateSelected(): boolean {
        return (
            this.fCDocumentDateRange.value &&
            (this.fCDocumentDateRange.value[0] || this.fCDocumentDateRange.value[1]) &&
            this.fCDocumentDateRange.dirty
        );
    }
}
