import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { ToastrService } from 'ngx-toastr';
import { GlobalsService, ApiRequestService, AuthService, ResizeService } from '@services';
import * as moment from 'moment';
import { DialogService } from 'primeng/dynamicdialog';
import { ConfirmComponent } from '@app/shared';
import { AppKeyConfirmationComponent } from '@app/shared/components/app-key-confirmation/app-key-confirmation.component';
import { ResizeableComponent } from '@base-components';

@Component({
    selector: 'app-generated-keys',
    templateUrl: './generated-keys.component.html',
    styleUrls: ['./generated-keys.component.scss'],
})
export class GeneratedKeysComponent extends ResizeableComponent implements OnInit, OnChanges {
    @Input() searchRequestId;
    @Input() filterData;
    @Input() dateRange;
    @Input() perPage;
    sortOrder = '';
    sortType = '';
    termStatus: any;
    showStatus = true;
    paginationValue = false;
    totalRecords = 0;
    rows = 10;
    dateFrom: any;
    dateTo: any;
    pageNumber = 1;
    generatedKeyData: any[] = [];

    display: any;
    showDisplay = true;
    roasterID: number;
    loader = true;

    constructor(
        private apiRequestService: ApiRequestService,
        private authService: AuthService,
        private toastrService: ToastrService,
        protected resizeService: ResizeService,
        public cookieService: CookieService,
        public dialogSrv: DialogService,
        public globals: GlobalsService,
    ) {
        super(resizeService);
        this.termStatus = '';
        this.display = '10';
        this.roasterID = this.authService.getOrgId();
    }

    ngOnChanges(): void {
        if (this.dateRange?.length) {
            const [dateFrom, dateTo] = this.dateRange;
            this.dateFrom = dateFrom;
            this.dateTo = dateTo;
        } else {
            this.dateFrom = null;
            this.dateTo = null;
        }
        this.getGeneratedRoKeys();
    }

    ngOnInit(): void {}

    getTableData(event) {
        if (event.sortField) {
            this.sortOrder = event.sortOrder === 1 ? 'asc' : 'desc';
            this.sortType = event.sortField;
            const currentPage = event.first / this.rows;
            this.pageNumber = currentPage + 1;
            this.getGeneratedRoKeys();
        }
    }

    getGeneratedRoKeys() {
        const data = {
            roaster_id: this.roasterID,
            page: this.pageNumber,
            per_page: this.perPage ? this.perPage : 10,
            org_type: this.filterData ? this.filterData : '',
            query: this.searchRequestId,
        };
        if (this.dateFrom && this.dateTo) {
            const dateFrom = 'date_from';
            const dateTo = 'date_to';
            data[dateFrom] = moment(this.dateFrom).format('YYYY-MM-DD');
            data[dateTo] = moment(this.dateTo).format('YYYY-MM-DD');
        }
        if (this.searchRequestId) {
            const query = 'query';
            data[query] = this.searchRequestId;
        }
        if (this.sortOrder && this.sortType) {
            const sortBy = 'sort_by';
            data[sortBy] = this.sortType;
            const newLocal = 'sort_order';
            data[newLocal] = this.sortOrder;
        }
        this.apiRequestService.getGeneratedRoKeys(data).subscribe((res) => {
            if (res.success) {
                this.loader = false;
                this.generatedKeyData = res.result;
                this.totalRecords = res.result_info.total_count;
                this.rows = res.result_info.per_page;
                if (this.totalRecords > 10) {
                    this.paginationValue = true;
                } else {
                    this.paginationValue = false;
                }
            }
        });
    }

    resumeKey(item: any) {
        const data = {
            roaster_id: this.roasterID,
            api_key_id: item.id,
        };
        this.apiRequestService.enableRoApiKey(data).subscribe((res) => {
            if (res.success) {
                this.toastrService.success('Key has been reactivated!');
                item.is_active = true;
            }
        });
    }

    resume(item: any) {
        this.dialogSrv
            .open(AppKeyConfirmationComponent, {
                data: {
                    orgName: item.org_name,
                    status: 'resume',
                },
                showHeader: false,
                styleClass: 'confirm-dialog',
            })
            .onClose.subscribe((action: any) => {
                if (action === 'yes') {
                    this.resumeKey(item);
                }
            });
    }

    pause(item: any) {
        this.dialogSrv
            .open(AppKeyConfirmationComponent, {
                data: {
                    orgName: item.org_name,
                    status: 'pause',
                },
                showHeader: false,
                styleClass: 'confirm-dialog',
            })
            .onClose.subscribe((action: any) => {
                if (action === 'yes') {
                    this.pauseKey(item);
                }
            });
    }

    pauseKey(item: any) {
        const data = {
            roaster_id: this.roasterID,
            api_key_id: item.id,
        };
        this.apiRequestService.disableRoApiKey(data).subscribe((res) => {
            if (res.success) {
                this.toastrService.success('Key access has been paused');
                item.is_active = false;
            }
        });
    }

    deleteKey(id: any) {
        this.dialogSrv
            .open(ConfirmComponent, {
                data: {
                    type: 'delete',
                },
            })
            .onClose.subscribe((action: any) => {
                console.log('action--->>', action);
                if (action === 'yes') {
                    this.onConfirm(id);
                }
            });
    }

    onConfirm(id: any) {
        const data = {
            roaster_id: this.roasterID,
            api_key_id: id,
        };
        this.apiRequestService.deleteRoApiKey(data).subscribe((res) => {
            if (res.success) {
                this.toastrService.error('Key has been delete');
                const index = this.generatedKeyData.findIndex((item) => item.id === id);
                const temp = JSON.parse(JSON.stringify(this.generatedKeyData));
                temp.splice(index, 1);
                this.generatedKeyData = temp;
            }
        });
    }

    notifyCustomer(id: any) {
        const data = {
            roaster_id: this.roasterID,
            api_key_id: id,
        };
        this.apiRequestService.notifyRoCustomer(data).subscribe((res) => {
            if (res.success) {
                this.toastrService.success('Key has been reactivated!');
            }
        });
    }
}
