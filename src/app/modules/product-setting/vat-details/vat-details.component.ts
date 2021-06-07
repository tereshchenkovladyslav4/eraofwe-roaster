import { Component, Input, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AuthService, UserserviceService } from '@services';
import { CookieService } from 'ngx-cookie-service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { COUNTRY_LIST } from '@constants';
import { ApiResponse } from '@models';

@Component({
    selector: 'app-vat-details',
    templateUrl: './vat-details.component.html',
    styleUrls: ['./vat-details.component.scss'],
})
export class VatDetailsComponent implements OnInit {
    public readonly COUNTRY_LIST = COUNTRY_LIST;
    roasterId: any;
    resetButtonValue = 'Save';
    eachId: any;
    mrList: any;
    editIndex = null;
    transaction: FormGroup;
    @Input() mobile = false;
    @Input() feature;

    get detailsFormControl() {
        return this.transaction.controls;
    }

    constructor(
        private toastrService: ToastrService,
        public cookieService: CookieService,
        public userService: UserserviceService,
        private fb: FormBuilder,
        private authService: AuthService,
    ) {
        this.roasterId = this.authService.getOrgId();
    }

    ngOnInit(): void {
        this.transaction = this.fb.group({
            country: [null, Validators.compose([Validators.required])],
            transaction_type: [null, Validators.compose([Validators.required])],
            vat_percentage: [null, Validators.compose([Validators.required])],
            vat_type: [this.feature],
        });
        this.getVatDetails();
    }

    getVatDetails() {
        this.userService.getRoasterVatDetails(this.roasterId, this.feature).subscribe((res: ApiResponse<any>) => {
            if (res.success) {
                this.mrList = res.result || [];
            }
        });
    }

    addNewTranscation() {
        if (!this.editIndex) {
            this.editIndex = this.mrList.length;
            this.mrList.push({
                country: null,
                transaction_type: null,
                vat_percentage: null,
            });
            this.transaction = this.fb.group({
                country: [null, Validators.compose([Validators.required])],
                transaction_type: [null, Validators.compose([Validators.required])],
                vat_percentage: [null, Validators.compose([Validators.required])],
                vat_type: [this.feature],
            });
        } else {
            this.toastrService.error('Please save the unsaved changes.');
        }
    }

    deleteRow(index) {
        this.mrList.splice(index, 1);
        this.editIndex = null;
    }

    cancelItem(item, index) {
        if (item.id) {
            this.editIndex = null;
        } else {
            this.deleteRow(index);
        }
    }

    addNewVatItem(body) {
        this.userService.addVatDetails(this.roasterId, body).subscribe((result) => {
            if (result.success) {
                this.resetButtonValue = 'Save';
                this.toastrService.success(`VAT Details added successfully`);
                this.getVatDetails();
                this.editIndex = null;
            } else {
                this.toastrService.error('Error while adding VAT details');
                this.resetButtonValue = 'Save';
            }
        });
    }

    editVAT(vatItem: any, index = null) {
        if (this.editIndex === null) {
            this.eachId = vatItem.id;
            this.editIndex = index;
            this.transaction = this.fb.group({
                country: [vatItem.country.toUpperCase(), Validators.compose([Validators.required])],
                transaction_type: [vatItem.transaction_type, Validators.compose([Validators.required])],
                vat_percentage: [vatItem.vat_percentage, Validators.compose([Validators.required])],
                vat_type: [this.feature],
            });
        } else {
            this.toastrService.error('Please save the unsaved changes.');
        }
    }

    saveVATDetails(vatId: any, data) {
        const updateData = data;
        if (!vatId) {
            this.addNewVatItem(updateData);
            return;
        }
        this.userService.updateMrVat(this.roasterId, updateData, vatId).subscribe((result) => {
            if (result.success) {
                this.toastrService.success(`VAT Details updated successfully`);
                this.getVatDetails();
                this.editIndex = null;
            } else {
                this.toastrService.error('Error while adding VAT details');
            }
        });
    }

    deleteEachVat(deleteId: any) {
        this.userService.deleteMrVat(this.roasterId, deleteId).subscribe((result) => {
            if (result.success) {
                this.toastrService.success(`VAT deleted successfully`);
                this.getVatDetails();
                this.editIndex = null;
            } else {
                this.toastrService.error('Error while deleting VAT details');
            }
        });
    }
}
