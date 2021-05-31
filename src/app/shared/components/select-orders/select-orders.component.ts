import { Component, EventEmitter, OnInit, Output, Input, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Router, ActivatedRoute } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { RoasterserviceService } from '@services';
import { ToastrService } from 'ngx-toastr';
import { GlobalsService } from '@services';
import * as moment from 'moment';
import { COUNTRY_LIST } from '@constants';

@Component({
    selector: 'app-select-orders',
    templateUrl: './select-orders.component.html',
    styleUrls: ['./select-orders.component.scss'],
})
export class SelectOrdersComponent implements OnInit {
    @Output() orderChange = new EventEmitter<any>();
    @Output() closeEvent = new EventEmitter<any>();
    @Input() selectedType;
    estateterm: any;
    loader = true;
    estatetermStatus: any;
    estatetermType: any;
    estatetermOrigin: any;
    displayNumbers: any;
    selected: Date[];
    searchTerm = '';
    originArray = [];
    originFilter: any;
    rangeDates: any;
    displayArray = [];
    displayFilter = 10;
    tableValue = [];
    tableColumns = [];
    selectedOrder: any;
    roasterID: any;
    totalCount = 0;
    orderType: any;
    orderID: any;

    @ViewChild(DataTableDirective, { static: false })
    datatableElement: DataTableDirective;
    showDateRange: any;
    roasterId: any;
    @ViewChild('calendar')
    calendar: any;

    public data: any;
    selectedEntry: any;
    selectId: any;
    batchId: any;
    ordId: any;
    selectedValue: any;
    customerStatus: any;
    statusType: any = [];
    roleType: { label: any; value: number }[];
    roles: any;

    constructor(
        public router: Router,
        public cookieService: CookieService,
        private roasterService: RoasterserviceService,
        private toastrService: ToastrService,
        public globals: GlobalsService,
        public route: ActivatedRoute,
    ) {
        this.roasterId = this.cookieService.get('roaster_id');
        this.data = {};
    }

    ngOnInit(): void {
        this.estatetermStatus = '';
        this.estatetermOrigin = '';
        this.estatetermType = '';
        this.displayNumbers = '10';
        this.statusType = [
            { label: this.globals.languageJson?.active, value: 'active' },
            { label: this.globals.languageJson?.inactive, value: 'inactive' },
        ];
        this.loadFilterValues();
        this.createRoasterTable();
        this.getTableData();
        if (this.selectedType !== 'orders') {
            this.getRoleList();
        }
        if (this.route.snapshot.queryParams.batchId && this.route.snapshot.queryParams.ordId) {
            this.batchId = decodeURIComponent(this.route.snapshot.queryParams.batchId);
            this.ordId = decodeURIComponent(this.route.snapshot.queryParams.ordId);
        }
    }

    createRoasterTable() {
        if (this.selectedType === 'orders') {
            this.tableColumns = [
                {
                    field: 'id',
                    header: this.globals.languageJson?.order_id,
                    sortable: true,
                    width: 7,
                },
                {
                    field: 'estate_name',
                    header: this.globals.languageJson?.estate_name,
                    sortable: true,
                    width: 14,
                },
                {
                    field: 'created_at',
                    header: this.globals.languageJson?.ordered_date,
                    sortable: true,
                    width: 10,
                },
                {
                    field: 'origin',
                    header: this.globals.languageJson?.origin,
                    sortable: true,
                    width: 8,
                },
                {
                    field: 'varieties',
                    header: this.globals.languageJson?.variety,
                    sortable: true,
                    width: 12,
                },

                {
                    field: 'quantity',
                    header: this.globals.languageJson?.quantity,
                    sortable: true,
                    width: 8,
                },

                {
                    field: 'cup_score',
                    header: this.globals.languageJson?.cupping_score,
                    sortable: true,
                    width: 10,
                },
            ];
        } else if (this.selectedType === 'users' || this.selectedType === 'sales-member') {
            this.tableColumns = [
                {
                    field: 'firstname',
                    header: this.globals.languageJson?.name,
                    sortable: true,
                    width: 20,
                },
                {
                    field: 'last_login_at',
                    header: this.globals.languageJson?.last_login,
                    sortable: true,
                    width: 15,
                },
                {
                    field: 'email',
                    header: this.globals.languageJson?.email,
                    sortable: true,
                    width: 20,
                },
                {
                    field: 'status',
                    header: this.globals.languageJson?.status,
                    sortable: true,
                    width: 15,
                },
                {
                    field: 'roles',
                    header: this.globals.languageJson?.all_roles,
                    sortable: true,
                    width: 25,
                },
            ];
        } else {
            this.tableColumns = [
                {
                    field: 'name',
                    header: this.globals.languageJson?.customer_name,
                    sortable: true,
                    width: 20,
                },
                {
                    field: 'created_at',
                    header: this.globals.languageJson?.ordered_date,
                    sortable: true,
                    width: 20,
                },
                {
                    field: 'email',
                    header: this.globals.languageJson?.email,
                    sortable: true,
                    width: 35,
                },
                {
                    field: 'status',
                    header: this.globals.languageJson?.status,
                    sortable: true,
                    width: 20,
                },
            ];
        }
    }

    filterCall() {
        this.tableValue.map((org) => {
            COUNTRY_LIST.find((item) => {
                if (org.origin.toUpperCase() === item.isoCode) {
                    this.originArray.push(item);
                }
            });
        });
        this.originArray = this.originArray.filter((v, i, a) => a.findIndex((t) => t.isoCode === v.isoCode) === i);
        this.getTableData();
    }

    loadFilterValues() {
        this.displayArray = [
            { label: '10', value: 10 },
            { label: '20', value: 20 },
            { label: '50', value: 50 },
        ];
    }

    setOrigin(origindata: any) {
        this.estatetermOrigin = origindata;
        this.datatableElement.dtInstance.then((table) => {
            table.column(4).search(origindata).draw();
        });
    }
    setDisplay(data: any) {
        this.displayNumbers = data;
        $('select').val(data).trigger('change');
    }

    openCalendar(event: any) {
        this.calendar.showOverlay(this.calendar.inputfieldViewChild.nativeElement);
        event.stopPropagation();
    }
    onSelectionChange(value: any) {
        this.selectedEntry = value;
    }

    getTableData(event?) {
        this.tableValue = [];
        let page = 1;
        if (event) {
            page = event.first / event.rows + 1;
        }
        // setTimeout(() => (this.loader = true), 0);
        const postData: any = {
            origin: this.originFilter ? this.originFilter : '',
            search_query: this.searchTerm ? this.searchTerm : '',
            page,
            per_page: 10,
            sort_by: 'created_at',
            sort_order: 'desc',
            start_date: '',
            end_date: '',
            status: 'RECEIVED',
        };
        if (this.selectedType !== 'orders') {
            delete postData.status;
        }
        if (this.selectedType === 'users' || this.selectedType === 'sales-member') {
            postData.status = this.customerStatus ? this.customerStatus : '';
            postData.role_id = this.roles ? this.roles : '';
        }
        if (this.rangeDates && this.rangeDates.length === 2) {
            postData.start_date = moment(this.rangeDates[0], 'DD/MM/YYYY').format('YYYY-MM-DD');
            postData.end_date = moment(this.rangeDates[1], 'DD/MM/YYYY').format('YYYY-MM-DD');
        }
        let selectedType = this.selectedType;
        if (this.selectedType === 'sales-member') {
            selectedType = 'users';
        }
        this.roasterService.getListOrderDetails(this.roasterId, selectedType, postData).subscribe((data: any) => {
            if (data.success && data.result && data.result.length > 0) {
                this.tableValue = [];
                if (this.selectedType === 'micro-roasters' || this.selectedType === 'hrc') {
                    this.tableValue = data.result.filter((item) => {
                        return (item = item.id > 0);
                    });
                    this.totalCount = this.tableValue.length;
                } else {
                    this.totalCount = data.result_info?.total_count;
                    this.tableValue = data.result;
                }
                this.loader = false;
            }
        });
    }

    getRoleList() {
        this.roasterService.getRoles(this.roasterId).subscribe((res: any) => {
            if (res.success) {
                this.roleType = res.result.map((item) => {
                    const type = { label: item.name, value: item.id };
                    return type;
                });
            }
        });
    }

    onContinue() {
        if (this.selectedType === 'orders') {
            this.selectedValue = {
                orderId: this.selectedOrder.id,
                selectedType: this.selectedType,
            };
        } else if (this.selectedType === 'users') {
            this.selectedValue = {
                selectedType: this.selectedType,
                userId: this.selectedOrder.id,
                userName: this.selectedOrder.firstname + ' ' + this.selectedOrder.lastname,
            };
        } else if (this.selectedType === 'sales-member') {
            this.selectedValue = {
                selectedType: this.selectedType,
                userId: this.selectedOrder.id,
                userName: this.selectedOrder.firstname + ' ' + this.selectedOrder.lastname,
            };
        } else {
            this.selectedValue = {
                customerId: this.selectedOrder.id,
                customerName: this.selectedOrder.name,
            };
        }
        this.orderChange.emit(this.selectedValue);
        this.close();
    }

    close() {
        this.closeEvent.emit();
    }
}
