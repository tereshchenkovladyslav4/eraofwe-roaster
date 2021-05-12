import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DownloadService, RoasterserviceService, UserserviceService } from '@services';
import { CookieService } from 'ngx-cookie-service';
import { Location } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute } from '@angular/router';
import { DialogService } from 'primeng/dynamicdialog';
import { ConfirmComponent } from '@app/shared';
import { Download } from '@models';

@Component({
    selector: 'app-add-new-order',
    templateUrl: './add-new-order.component.html',
    styleUrls: ['./add-new-order.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class AddNewOrderComponent implements OnInit {
    roasterId: any;
    showOrderPanel = false;
    breadItems = [
        { label: 'Home', routerLink: '/dashboard' },
        { label: 'Order Management', routerLink: '/outtake-orders' },
        { label: 'Outtake Order', routerLink: '/outtake-orders' },
        { label: 'Add a new order' },
    ];
    customerTypeArray: any = [];
    preCleaned: any = [];
    addOrdersForm: FormGroup;
    weightTypeArray = [];
    orderDetails: any;
    outtakeOrderId: any;
    coffeeExperienceLink: any;
    customerDetails: any;
    remainingTotalQuantity: any;
    customerType: any;
    userDetails: any = [];
    allCustomer: any;
    outtakeOrderDetails: any;

    constructor(
        private roasterService: RoasterserviceService,
        private cookieService: CookieService,
        private fb: FormBuilder,
        public location: Location,
        private userService: UserserviceService,
        private toaster: ToastrService,
        private activeRoute: ActivatedRoute,
        public downloadService: DownloadService,
        public dialogSrv: DialogService,
    ) {
        this.roasterId = this.cookieService.get('roaster_id');
        this.outtakeOrderId = this.activeRoute.snapshot.params.id;
    }

    ngOnInit(): void {
        this.customerTypeArray = [
            { label: 'Partner', value: 'hrc' },
            { label: 'Micro Roaster', value: 'mr' },
        ];
        this.preCleaned = [
            { label: 'Yes', value: true },
            { label: 'No', value: false },
        ];
        this.weightTypeArray = [
            { label: 'kg', value: 'kg' },
            { label: 'lb', value: 'lb' },
        ];
        this.addOrdersForm = this.fb.group({
            product_name: ['', [Validators.required]],
            order_date: ['', [Validators.required]],
            order_id: ['', [Validators.required]],
            roaster_ref_no: [''],
            company_type: [''],
            created_by: [''],
            sales_member_id: ['', [Validators.required]],
            customer_id: ['', [Validators.required]],
            customer_type: ['', [Validators.required]],
            gc_total_quantity: ['', [this.remainingQuantity.bind(this)]],
            gc_total_quantity_unit: ['kg'],
            total_price: [''],
            total_price_currency: ['SEK'],
            unit_price: [''],
            unit_currency: [''],
            quantity_unit: [''],
            roasted_coffee_total_quantity: [''],
            roasted_coffee_total_quantity_unit: ['kg'],
            pre_cleaned: [true],
            roasted_date: [''],
            roast_level: [''],
            roasting_time: [''],
            roasting_temperature: [''],
            machine_used: [''],
        });
        if (this.outtakeOrderId) {
            this.getOrder();
        }
        this.getUserDetails();
    }

    remainingQuantity(control: AbstractControl) {
        if (control.value) {
            this.remainingTotalQuantity = this.orderDetails?.remaining_total_quantity - control.value;
        }
    }

    getOrderDetails() {
        this.roasterService
            .getViewOrderDetails(this.roasterId, this.addOrdersForm.get('order_id').value)
            .subscribe((res) => {
                this.orderDetails = res.result;
                this.remainingTotalQuantity = this.orderDetails.remaining_total_quantity;
            });
    }

    getCustomerDetails(event?) {
        this.allCustomer = [];
        if (this.addOrdersForm.get('customer_type').value) {
            if (this.addOrdersForm.get('customer_type').value === 'mr') {
                this.customerType = 'micro-roasters';
            } else if (this.addOrdersForm.get('customer_type').value === 'hrc') {
                this.customerType = 'hrc';
            }
            this.roasterService.getCustomerDetails(this.roasterId, this.customerType).subscribe((res) => {
                if (res.success) {
                    this.allCustomer = res.result;
                    this.getSingleCustomerDeatils();
                }
            });
        }
    }

    getSingleCustomerDeatils(event?) {
        this.roasterService
            .getSingleCustomerDetails(this.roasterId, this.customerType, this.addOrdersForm.get('customer_id').value)
            .subscribe((rep) => {
                if (rep.success) {
                    this.customerDetails = rep.result;
                }
            });
    }

    getCoffeeStory() {
        this.userService.getOuttakeCoffeeStory(this.roasterId, this.outtakeOrderId).subscribe((res: any) => {
            if (res.success) {
                this.coffeeExperienceLink = res.result;
            }
        });
    }

    getUserDetails() {
        this.roasterService.getUserDetails(this.roasterId).subscribe((res) => {
            this.userDetails = res.result;
            this.userDetails = this.userDetails.map((item) => {
                const userName = 'userName';
                item[userName] = item.firstname.concat(' ', item.lastname);
                return item;
            });
        });
    }

    getOrder() {
        this.roasterService.getViewOrder(this.roasterId, this.outtakeOrderId).subscribe((res) => {
            if (res.success) {
                this.outtakeOrderDetails = res.result;
                this.outtakeOrderDetails.order_date = new Date(this.outtakeOrderDetails.order_date);
                this.outtakeOrderDetails.roasted_date = new Date(this.outtakeOrderDetails.roasted_date);
                this.addOrdersForm.patchValue(this.outtakeOrderDetails);
                this.getCustomerDetails();
                this.getOrderDetails();
                this.getCoffeeStory();
            }
        });
    }

    selectOrder(event) {
        this.addOrdersForm.get('order_id').setValue(event.orderId);
        this.getOrderDetails();
        this.getCoffeeStory();
    }

    addOrderDetails() {
        const data = this.addOrdersForm.value;
        const orderDate = new Date(data.order_date);
        const roastedDate = new Date(data.roasted_date);
        data.order_date =
            orderDate.getFullYear() +
            '-' +
            ('0' + (orderDate.getMonth() + 1)).slice(-2) +
            '-' +
            ('0' + orderDate.getDate()).slice(-2);
        data.roasted_date =
            roastedDate.getFullYear() +
            '-' +
            ('0' + (roastedDate.getMonth() + 1)).slice(-2) +
            '-' +
            ('0' + roastedDate.getDate()).slice(-2);
        if (this.outtakeOrderId) {
            this.roasterService.updateOrderDetails(this.roasterId, this.outtakeOrderId, data).subscribe((res) => {
                if (res.success) {
                    this.toaster.success('Outtake Order updated successfully');
                } else {
                    this.toaster.error('Unable to update the outtake order');
                }
            });
        } else {
            data.unit_currency = 'SEK';
            data.quantity_unit = 'kg';
            this.roasterService.addOrderDetails(this.roasterId, data).subscribe((res) => {
                if (res.success) {
                    this.toaster.success('Outtake Order added successfully');
                } else {
                    this.toaster.error('Unable to add the outtake order');
                }
            });
        }
    }

    handleCopyCoffeeExperienceLink(): void {
        const textArea = document.createElement('textarea');
        textArea.value = this.coffeeExperienceLink.coffee_story_url;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('Copy');
        if (this.coffeeExperienceLink.coffee_story_url && document.execCommand('Copy')) {
            this.toaster.success('Copied link successfully');
        }
        textArea.remove();
    }

    onDownloadQr() {
        this.dialogSrv
            .open(ConfirmComponent, {
                data: {
                    title: 'Please confirm!',
                    desp: 'Are you sure want to download',
                },
                showHeader: false,
                styleClass: 'confirm-dialog',
            })
            .onClose.subscribe((action: any) => {
                if (action === 'yes') {
                    this.downloadService.imageDownload(this.coffeeExperienceLink.qr_code_url).subscribe(
                        (res: Download) => {
                            if (res.state === 'DONE') {
                                this.toaster.success('Downloaded successfully');
                            }
                        },
                        (error) => {
                            this.toaster.error('Download failed');
                        },
                    );
                }
            });
    }
}
