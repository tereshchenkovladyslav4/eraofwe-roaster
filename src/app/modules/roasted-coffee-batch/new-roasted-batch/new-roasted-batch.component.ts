import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DestroyableComponent } from '@base-components';
import { OrganizationType, QuantityUnit } from '@enums';
import { environment } from '@env/environment';
import { Download, OrderDetails } from '@models';
import {
    CoffeeStoryService,
    DownloadService,
    InventoryService,
    OrganizationService,
    PurchaseService,
    RoasterService,
    UserService,
} from '@services';
import { ConfirmComponent } from '@shared';
import { convert2Kg, convertKg, maxValidator, minValidator, quantityMaxValidator } from '@utils';
import { ToastrService } from 'ngx-toastr';
import { SelectItem } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { takeUntil } from 'rxjs/operators';
import { RoastingProfileDialogComponent } from '../roasting-profile-dialog/roasting-profile-dialog.component';
import { SelectOrderTableComponent } from '../select-order-table/select-order-table.component';

@Component({
    selector: 'app-new-roasted-batch',
    templateUrl: './new-roasted-batch.component.html',
    styleUrls: ['./new-roasted-batch.component.scss'],
})
export class NewRoastedBatchComponent extends DestroyableComponent implements OnInit {
    readonly env = environment;
    selectable = true;
    removable = true;
    flavourProfile: any;
    roasterFlavourProfile: any;
    batchId: number;
    orderDetails: any = {};
    roastedBatchDetails: any = {};
    rating: any;
    coffeeStory: any;
    batchForm: FormGroup;
    roastProfileArray: SelectItem[] = [];
    weightTypeArray: SelectItem[] = [
        { label: 'lb', value: 'lb' },
        { label: 'kg', value: 'kg' },
    ];
    ordId: any;
    @ViewChild(SelectOrderTableComponent, { static: false })
    selectOrd: SelectOrderTableComponent;
    breadItems = [
        { label: 'Home', routerLink: '/' },
        { label: 'Inventory', routerLink: '/' },
        {
            label: 'Roasted coffee batches',
            routerLink: '/roasted-coffee-batch/roasted-coffee-batchs',
        },
        { label: 'New roasted coffee batch' },
    ];
    showOrder: boolean;
    isLoadingCoffeeBatch = false;
    remainingTotalQuantity = 0;

    constructor(
        private coffeeStorySrv: CoffeeStoryService,
        private dialogSrv: DialogService,
        private downloadService: DownloadService,
        private fb: FormBuilder,
        private organizationService: OrganizationService,
        private purchaseService: PurchaseService,
        private roasterService: RoasterService,
        private route: ActivatedRoute,
        private router: Router,
        private toastrService: ToastrService,
        private userService: UserService,
        private inventorySrv: InventoryService,
    ) {
        super();
    }

    ngOnInit(): void {
        this.batchId = this.route.snapshot.queryParams.batchId;
        this.ordId = this.route.snapshot.queryParams.ordId;
        this.getData();
        this.batchForm = this.fb.group({
            roast_batch_name: ['', Validators.compose([Validators.required])],
            order_id: [this.ordId || null, Validators.compose([Validators.required])],
            roasting_profile_id: ['', Validators.compose([Validators.required])],
            green_coffee_quantity: [
                null,
                Validators.compose([
                    Validators.required,
                    minValidator('roasting_profile_quantity'),
                    (control: AbstractControl) =>
                        quantityMaxValidator('green_coffee_unit', this.remainingTotalQuantity)(control),
                ]),
            ],
            green_coffee_unit: [QuantityUnit.lb],
            roasting_profile_quantity: [
                null,
                Validators.compose([Validators.required, maxValidator('green_coffee_quantity')]),
            ],
            waste_quantity: [{ value: '', disabled: true }],
            aroma: [null],
            acidity: [null],
            body: [null],
            flavour: [null],
            processing: { value: null, disabled: true },
            roaster_notes: [''],
            roaster_ref_no: { value: '', disabled: true },
            batch_ref_no: [''],
        });

        this.batchForm.controls.green_coffee_quantity.valueChanges
            .pipe(takeUntil(this.unsubscribeAll$))
            .subscribe(() => {
                this.setWasteQuantityValue();
            });
        this.batchForm.controls.roasting_profile_quantity.valueChanges
            .pipe(takeUntil(this.unsubscribeAll$))
            .subscribe(() => {
                this.setWasteQuantityValue();
            });
    }

    setWasteQuantityValue(): void {
        this.batchForm.controls.waste_quantity.setValue(
            `${
                this.batchForm.controls.green_coffee_quantity.value -
                this.batchForm.controls.roasting_profile_quantity.value
            } ${this.batchForm.value.green_coffee_unit}`,
        );
    }

    capitalizeFirstLetter(str: string) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    getData() {
        this.isLoadingCoffeeBatch = true;
        const promises = [];
        promises.push(new Promise((resolve, reject) => this.getRoastingProfile(resolve, reject)));
        if (this.ordId) {
            promises.push(new Promise((resolve, reject) => this.getOrderDetails(resolve, reject)));
        }
        if (this.batchId) {
            promises.push(new Promise((resolve, reject) => this.getRoastedBatch(resolve, reject)));
        }
        Promise.all(promises).then(() => {
            this.isLoadingCoffeeBatch = false;
            this.calcRemainningQuantity();
        });
        if (this.ordId && this.batchId) {
            this.getRoastedBatchStory();
        }
        this.getRoasterFlavourProfile();
    }

    getRoastingProfile(resolve?, reject?) {
        this.inventorySrv.getRoastingProfiles().subscribe((data) => {
            if (data.success) {
                this.roastProfileArray = (data.result || []).map((item: any) => {
                    return {
                        label: item.roast_name.length > 65 ? item.roast_name.slice(0, 65) + '...' : item.roast_name,
                        value: item.id,
                    };
                });
                this.roastProfileArray.push({ label: '', value: 'button' });
                if (resolve) {
                    resolve();
                }
            } else {
                this.toastrService.error('Error while getting the roasting profiles');
            }
        });
    }

    getRoastedBatch(resolve?, reject?) {
        this.userService.getRoastedBatchDetail(this.batchId).subscribe((res) => {
            if (res && res.result) {
                this.breadItems[3].label = this.capitalizeFirstLetter(res.result.roast_batch_name);
                const unit = res.result.green_coffee_unit;
                this.batchForm.patchValue({
                    ...res.result,
                    green_coffee_quantity: convertKg(res.result.green_coffee_quantity, unit),
                    roasting_profile_quantity: convertKg(res.result.roasting_profile_quantity, unit),
                    roaster_ref_no: this.orderDetails.order_reference,
                    processing: this.orderDetails.processing,
                });
                this.roastedBatchDetails = res.result;
                this.flavourProfile = (res.result.flavour_profile || []).map((item) => {
                    return { id: item.flavour_profile_id, name: item.flavour_profile_name };
                });
                this.setWasteQuantityValue();
                if (resolve) {
                    resolve();
                }
            }
        });
    }

    getRoasterFlavourProfile() {
        this.inventorySrv.getRoasterFlavourProfile().subscribe((data) => {
            if (data.success) {
                this.roasterFlavourProfile = data.result.map((item) => {
                    return { label: item.name, value: item };
                });
            } else {
                this.toastrService.error('Error while getting the roasting Flavor Profile');
            }
        });
    }

    getOrderDetails(resolve?, reject?) {
        this.purchaseService
            .getOrderDetailsById(this.ordId, OrganizationType.ESTATE)
            .subscribe((response: OrderDetails) => {
                if (response) {
                    this.orderDetails = response;
                    this.getRatingData(this.orderDetails.estate_id);
                    this.batchForm.controls.roaster_ref_no.setValue(this.orderDetails.order_reference);
                    this.batchForm.controls.processing.setValue(this.orderDetails.processing);
                    if (resolve) {
                        resolve();
                    }
                } else {
                    this.toastrService.error('Error while getting the order list');
                }
            });
    }

    getRatingData(estateId: number) {
        this.organizationService.getProfile(estateId, OrganizationType.ESTATE).subscribe({
            next: (result) => {
                if (result) {
                    this.rating = result.rating;
                } else {
                    this.rating = 0.0;
                }
            },
        });
    }

    getRoastedBatchStory() {
        this.coffeeStorySrv.getRoastedBatchStory(this.batchId).subscribe(
            (res: any) => {
                if (res.success && res.result) {
                    this.coffeeStory = res.result;
                }
            },
            (err) => {
                console.log(err);
            },
        );
    }

    calcRemainningQuantity() {
        this.remainingTotalQuantity =
            this.orderDetails.remaining_total_quantity + (this.roastedBatchDetails?.green_coffee_quantity || 0);
    }

    changeUnit() {
        this.setWasteQuantityValue();
        this.batchForm.get('green_coffee_quantity').updateValueAndValidity();
    }

    updateRoastedBatch(productObj) {
        this.userService.updateRoastedBatchDetail(this.batchId, productObj).subscribe(
            (res) => {
                if (res && res.success) {
                    this.toastrService.success('The Roasted Batch has been updated.');
                    this.router.navigate(['/roasted-coffee-batch/roasted-coffee-batchs']);
                } else if (res.messages) {
                    this.toastrService.error('Order Id ' + res.messages.order_id[0].replace('_', ' ') + '.');
                } else {
                    this.toastrService.error('Error while updating the roasted batch');
                }
            },
            (err) => {
                this.toastrService.error('Error while updating the roasted batch');
            },
        );
    }

    createRoastedBatch(productObj) {
        this.userService.addRoastedBatches(productObj).subscribe(
            (res) => {
                if (res && res.success) {
                    this.toastrService.success('The Roasted Batch  has been added.');
                    this.router.navigate(['/roasted-coffee-batch/roasted-coffee-batchs']);
                } else if (res.messages) {
                    this.toastrService.error('Order Id ' + res.messages.order_id[0].replace('_', ' ') + '.');
                } else {
                    this.toastrService.error('Error while adding the roasted batch ');
                }
            },
            (err) => {
                this.toastrService.error('Error while adding the roasted batch ');
            },
        );
    }

    onSave() {
        if (this.batchForm.invalid) {
            this.batchForm.markAllAsTouched();
            this.toastrService.error('Please fill all data');
            return;
        }

        const unit = this.batchForm.value.green_coffee_unit;
        const productObj = {
            ...this.batchForm.getRawValue(),
            flavour_profile: this.flavourProfile?.length ? this.flavourProfile.map((ele) => ele.id) : null,
            green_coffee_quantity: convert2Kg(this.batchForm.value.green_coffee_quantity, unit),
            roasting_profile_quantity: convert2Kg(this.batchForm.value.roasting_profile_quantity, unit),
            waste_quantity: convert2Kg(
                this.batchForm.controls.green_coffee_quantity.value -
                    this.batchForm.controls.roasting_profile_quantity.value,
                unit,
            ),
            roasting_profile_unit: unit,
        };

        if (this.batchId) {
            this.updateRoastedBatch(productObj);
        } else {
            this.createRoastedBatch(productObj);
        }
    }

    setOrder(id: number) {
        this.showOrder = false;
        if (id) {
            this.ordId = id;
            this.batchForm.get('order_id').setValue(id);
            this.getOrderDetails();
            const promises = [];
            promises.push(new Promise((resolve, reject) => this.getOrderDetails(resolve, reject)));
            Promise.all(promises).then(() => {
                this.calcRemainningQuantity();
            });
        }
    }

    onDownloadQr() {
        this.dialogSrv
            .open(ConfirmComponent, {
                data: {
                    title: 'Please confirm!',
                    desp: 'Are you sure want to download',
                },
            })
            .onClose.subscribe((action: any) => {
                if (action === 'yes') {
                    this.downloadService.imageDownload(this.coffeeStory.qr_code_url, 'qr-code.svg').subscribe(
                        (res: Download) => {
                            if (res.progress === 100) {
                                this.toastrService.success('Downloaded successfully');
                            }
                        },
                        (error) => {
                            this.toastrService.error('Download failed');
                        },
                    );
                }
            });
    }

    onCopy(): void {
        this.toastrService.success('Successfully copied');
    }

    createRoastingProfile() {
        this.dialogSrv.open(RoastingProfileDialogComponent, {}).onClose.subscribe((data: any) => {
            if (data?.success) {
                this.roastProfileArray.splice(this.roastProfileArray.length - 1, 0, {
                    label: data.newItem.roast_profile_name,
                    value: data.newItem.id,
                });
                this.batchForm.get('roasting_profile_id').setValue(data.newItem.id);
            }
        });
    }
}
