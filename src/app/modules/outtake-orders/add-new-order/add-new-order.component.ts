import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DownloadService, RoasterserviceService, UserserviceService } from '@services';
import { CookieService } from 'ngx-cookie-service';
import { Location } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogService } from 'primeng/dynamicdialog';
import { ConfirmComponent } from '@app/shared';
import { Download } from '@models';
import { GlobalsService } from '@services';

@Component({
    selector: 'app-add-new-order',
    templateUrl: './add-new-order.component.html',
    styleUrls: ['./add-new-order.component.scss'],
})
export class AddNewOrderComponent implements OnInit {
    roasterId: any;
    showOrderPanel = false;
    showCustomerPanel = false;
    selectedType: string;
    breadItems = [];
    customerTypeArray: any = [];
    roasterLableypeArray: any = [];
    preCleaned: any = [];
    addOrdersForm: FormGroup;
    weightTypeArray = [];
    rating: any;
    orderDetails: any;
    outtakeOrderId: any;
    coffeeExperienceLink: any;
    customerDetails: any;
    remainingTotalQuantity: any;
    customerType: any;
    outtakeOrderDetails: any;
    currentDate = new Date();
    userID: any;
    customerID: any;
    createdID: any;
    loginUserID: string;

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
        private router: Router,
        public globals: GlobalsService,
    ) {
        this.roasterId = this.cookieService.get('roaster_id');
        this.outtakeOrderId = this.activeRoute.snapshot.params.id;
        this.loginUserID = this.cookieService.get('user_id');
    }

    ngOnInit(): void {
        this.breadItems = [
            { label: this.globals.languageJson?.home, routerLink: '/dashboard' },
            { label: this.globals.languageJson?.order_management, routerLink: '/outtake-orders' },
            { label: this.globals.languageJson?.outtake_order, routerLink: '/outtake-orders' },
            {
                label: this.outtakeOrderId
                    ? this.globals.languageJson?.order_id + '#' + this.outtakeOrderId
                    : this.globals.languageJson?.add_new_order,
            },
        ];
        this.customerTypeArray = [
            { label: this.globals.languageJson?.partner, value: this.globals.languageJson?.hrc },
            { label: this.globals.languageJson?.micro_roaster, value: this.globals.languageJson?.mr },
        ];
        this.roasterLableypeArray = [
            { label: this.globals.languageJson?.light, value: 1 },
            { label: this.globals.languageJson?.light + ' ' + this.globals.languageJson?.medium, value: 2 },
            { label: this.globals.languageJson?.medium, value: 3 },
            { label: this.globals.languageJson?.medium + ' ' + this.globals.languageJson?.dark, value: 4 },
            { label: this.globals.languageJson?.dark, value: 5 },
        ];
        this.preCleaned = [
            { label: this.globals.languageJson?.yes, value: true },
            { label: this.globals.languageJson?.no, value: false },
        ];
        this.weightTypeArray = [
            { label: 'Kg', value: 'kg' },
            { label: 'Ton', value: 'ton' },
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
            total_price: ['', [Validators.required]],
            total_price_currency: ['SEK'],
            unit_price: ['', [Validators.required]],
            unit_currency: [''],
            quantity_unit: [''],
            roasted_coffee_total_quantity: [''],
            roasted_coffee_total_quantity_unit: ['kg'],
            pre_cleaned: [true],
            roasted_date: [''],
            roast_level: [''],
            roasting_time: [''],
            roasting_temperature: [''],
            tax_included_in_price: [false],
            vat_percentage: [''],
            machine_used: [''],
        });
        if (this.outtakeOrderId) {
            this.getOrder();
        }
        this.getAllUsers();
    }

    remainingQuantity(control: AbstractControl) {
        if (control.value) {
            if (control.value > this.remainingTotalQuantity) {
                return { isInvalid: true };
            } else {
                this.remainingTotalQuantity = this.orderDetails?.remaining_total_quantity - control.value;
            }
        }
    }

    getAllUsers() {
        this.roasterService.getsalesMemberDetails(this.roasterId, this.loginUserID).subscribe((res: any) => {
            if (res.success) {
                this.addOrdersForm.get('created_by').setValue(res.result.firstname + ' ' + res.result.lastname);
            }
        });
    }
    getOrderDetails() {
        this.roasterService
            .getViewOrderDetails(this.roasterId, this.addOrdersForm.get('order_id').value)
            .subscribe((res) => {
                this.orderDetails = res.result;
                this.addOrdersForm.get('roaster_ref_no').setValue(this.orderDetails?.order_reference);
                this.addOrdersForm.get('roaster_ref_no').disable();
                this.getRatingData(this.orderDetails?.estate_id);
                this.remainingTotalQuantity = this.orderDetails?.remaining_total_quantity;
            });
    }

    getCustomerDetails(event?) {
        this.addOrdersForm.get('customer_id').setValue('');
        if (this.addOrdersForm.get('customer_type').value || this.outtakeOrderDetails.customer_type) {
            if ((this.addOrdersForm.get('customer_type').value || this.outtakeOrderDetails.customer_type) === 'mr') {
                this.customerType = 'micro-roasters';
            } else {
                this.customerType = 'hrc';
            }
            this.roasterService
                .getCustomerDetails(this.roasterId, this.customerType, this.customerID)
                .subscribe((res) => {
                    if (res.success) {
                        this.customerDetails = res.result;
                        this.addOrdersForm.get('customer_id').setValue(this.customerDetails.name);
                        this.addOrdersForm.get('company_type').setValue(this.customerDetails.company_type);
                    }
                });
        }
    }

    getRatingData(value: any) {
        this.userService.getAvailableEstateList(this.roasterId, value).subscribe((data) => {
            if (data.success) {
                this.rating = data.result.rating;
            } else {
                this.rating = 0.0;
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

    getOrder() {
        this.roasterService.getViewOrder(this.roasterId, this.outtakeOrderId).subscribe((res) => {
            if (res.success) {
                this.outtakeOrderDetails = res.result;
                this.customerID = this.outtakeOrderDetails.customer_id;
                this.outtakeOrderDetails.order_date = new Date(this.outtakeOrderDetails.order_date);
                this.outtakeOrderDetails.roasted_date = new Date(this.outtakeOrderDetails.roasted_date);
                this.addOrdersForm.patchValue(this.outtakeOrderDetails);
                this.getSalesMember();
                this.getCustomerDetails();
                this.getOrderDetails();
                this.getCoffeeStory();
            }
        });
    }

    getSalesMember() {
        this.roasterService
            .getsalesMemberDetails(this.roasterId, this.outtakeOrderDetails.sales_member_id)
            .subscribe((res: any) => {
                if (res.success) {
                    this.addOrdersForm
                        .get('sales_member_id')
                        .setValue(res.result.firstname + ' ' + res.result.lastname);
                }
            });
        this.roasterService
            .getsalesMemberDetails(this.roasterId, this.outtakeOrderDetails.created_by)
            .subscribe((res: any) => {
                if (res.success) {
                    this.addOrdersForm.get('created_by').setValue(res.result.firstname + ' ' + res.result.lastname);
                }
            });
    }

    onSelectType(type: string) {
        if (type === 'customer-name') {
            if (this.addOrdersForm.get('customer_type').value === 'mr') {
                this.selectedType = this.globals.languageJson?.micro_roasters;
            } else if (this.addOrdersForm.get('customer_type').value === 'hrc') {
                this.selectedType = 'hrc';
            }
        } else {
            this.selectedType = type;
        }
    }

    selectOrder(event) {
        if (event.selectedType === 'orders') {
            this.addOrdersForm.get('order_id').setValue(event.orderId);
            this.getOrderDetails();
        } else if (event.selectedType === 'users') {
            this.addOrdersForm.get('created_by').setValue(event.userName);
            this.createdID = event.userId;
        } else if (event.selectedType === 'sales-member') {
            this.addOrdersForm.get('sales_member_id').setValue(event.userName);
            this.userID = event.userId;
        } else if (event.customerId) {
            this.addOrdersForm.get('customer_id').setValue(event.customerName);
            this.customerID = event.customerId;
            this.getCustomerDetails();
        }
    }

    addOrderDetails() {
        this.addOrdersForm.get('roaster_ref_no').enable();
        const data = this.addOrdersForm.value;
        this.addOrdersForm.get('roaster_ref_no').disable();
        data.sales_member_id = this.userID;
        data.order_created_by = this.createdID;
        data.company_type = this.addOrdersForm.get('company_type').value
            ? this.addOrdersForm.get('company_type').value
            : '';
        delete data.created_by;
        data.customer_id = this.customerID;
        if (data.order_date) {
            const orderDate = new Date(data.order_date);
            data.order_date =
                orderDate.getFullYear() +
                '-' +
                ('0' + (orderDate.getMonth() + 1)).slice(-2) +
                '-' +
                ('0' + orderDate.getDate()).slice(-2);
        }
        const roastedDate = new Date(data.roasted_date);
        if (data.customer_type === 'hrc') {
            data.roasted_date =
                roastedDate.getFullYear() +
                '-' +
                ('0' + (roastedDate.getMonth() + 1)).slice(-2) +
                '-' +
                ('0' + roastedDate.getDate()).slice(-2);
            data.roasting_time = parseInt(data.roasting_time, 10);
        } else {
            data.roasted_date = '';
            data.roasted_coffee_total_quantity = 0;
            data.roasted_coffee_total_quantity_unit = '';
            data.roast_level = 0;
            data.roasting_time = 0;
            data.roasting_temperature = 0;
        }
        if (this.outtakeOrderId) {
            this.roasterService.updateOrderDetails(this.roasterId, this.outtakeOrderId, data).subscribe((res) => {
                if (res.success) {
                    this.router.navigateByUrl('/outtake-orders');
                    this.toaster.success(this.globals.languageJson?.successfully_update);
                } else {
                    this.toaster.error(this.globals.languageJson?.unable_to_update);
                }
            });
        } else {
            data.unit_currency = 'SEK';
            data.quantity_unit = 'kg';
            this.roasterService.addOrderDetails(this.roasterId, data).subscribe((res) => {
                if (res.success) {
                    this.router.navigateByUrl('/outtake-orders');
                    this.toaster.success(this.globals.languageJson?.successfully_added);
                } else {
                    this.toaster.error(this.globals.languageJson?.unable_to_add);
                }
            });
        }
    }

    handleCopyCoffeeExperienceLink(): void {
        const textArea = document.createElement('textarea');
        textArea.value = this.coffeeExperienceLink.coffee_story_url;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand(this.globals.languageJson?.copy);
        this.toaster.success(this.globals.languageJson?.copied);
        textArea.remove();
    }

    onDownloadQr() {
        this.dialogSrv
            .open(ConfirmComponent, {
                data: {
                    title: this.globals.languageJson?.please_confirm,
                    desp: this.globals.languageJson?.are_you,
                },
                showHeader: false,
                styleClass: this.globals.languageJson?.confirm_dialog,
            })
            .onClose.subscribe((action: any) => {
                if (action === 'yes') {
                    this.downloadService.imageDownload(this.coffeeExperienceLink.qr_code_url).subscribe(
                        (res: Download) => {
                            if (res.state === this.globals.languageJson?.done) {
                                this.toaster.success(this.globals.languageJson?.downloaded_successfully);
                            }
                        },
                        (error) => {
                            this.toaster.error(this.globals.languageJson?.download_failed);
                        },
                    );
                }
            });
    }
}
