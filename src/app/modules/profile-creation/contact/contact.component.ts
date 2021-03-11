import { Component, OnInit } from '@angular/core';
import { RoasteryProfileService } from '../roastery-profile.service';
import { GlobalsService } from '@services';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { COUNTRY_LIST } from '@constants';
import { Country } from '@models';
@Component({
    selector: 'app-sewn-contact',
    templateUrl: './contact.component.html',
    styleUrls: ['./contact.component.scss'],
})
export class ContactComponent implements OnInit {
    nameError: string;
    emailError: string;
    phoneError: string;
    countryError: string;
    addressError: string;
    cityError: string;
    appLanguage?: any;

    contactForm: FormGroup;
    isSaveMode: boolean;
    countryList = COUNTRY_LIST;
    cityList = [];
    constructor(
        private fb: FormBuilder,
        public roasteryProfileService: RoasteryProfileService,
        public globals: GlobalsService,
    ) {
        this.nameError = '';
        this.emailError = '';
        this.phoneError = '';
        this.countryError = '';
        this.addressError = '';
        this.cityError = '';
    }

    ngOnInit(): void {
        this.initialForm();
        this.detectMode();
    }

    detectMode() {
        this.roasteryProfileService.saveMode$.subscribe((res: boolean) => {
            this.isSaveMode = res;
            if (res) {
                this.setFormValue();
            }
        });
    }

    initialForm() {
        this.contactForm = this.fb.group({
            email: ['', Validators.compose([Validators.required, Validators.email])],
            phone: ['', Validators.compose([Validators.required])],
            country: ['', Validators.compose([Validators.required])],
            state: ['', Validators.compose([Validators.required])],
            address_line1: ['', Validators.compose([Validators.required])],
            address_line2: ['', Validators.compose([Validators.required])],
            city: ['', Validators.compose([Validators.required])],
            zipcode: ['', Validators.compose([Validators.required])],
            fb_profile: ['', Validators.compose([Validators.required])],
            ig_profile: ['', Validators.compose([Validators.required])],
        });

        this.contactForm.controls.country.valueChanges.subscribe((updatedCountry: any) => {
            this.countryList.forEach((countryItem: Country) => {
                if (countryItem.isoCode === updatedCountry.toUpperCase()) {
                    this.cityList = countryItem.cities;
                }
            });
        });
    }

    setFormValue() {
        this.countryList.forEach((item: Country) => {
            if (item.isoCode === this.roasteryProfileService.roasteryProfileData.country.toUpperCase()) {
                this.cityList = item.cities;
            }
        });

        const formValue = {
            email: this.roasteryProfileService.roasteryProfileData.email,
            phone: this.roasteryProfileService.roasteryProfileData.phone,
            country: this.roasteryProfileService.roasteryProfileData.country.toUpperCase(),
            state: this.roasteryProfileService.roasteryProfileData.state,
            address_line1: this.roasteryProfileService.roasteryProfileData.address_line1,
            address_line2: this.roasteryProfileService.roasteryProfileData.address_line2,
            city: this.roasteryProfileService.roasteryProfileData.city,
            zipcode: this.roasteryProfileService.roasteryProfileData.zipcode,
            fb_profile: this.roasteryProfileService.roasteryProfileData.fb_profile,
            ig_profile: this.roasteryProfileService.roasteryProfileData.ig_profile,
        };

        this.contactForm.patchValue(formValue);
    }

    isControlHasError(controlName: string, validationType: string): boolean {
        const control = this.contactForm.controls[controlName];
        if (!control) {
            return false;
        }

        const result = control.hasError(validationType) && (control.dirty || control.touched);
        return result;
    }

    telInputObject(obj: any): void {
        if (this.roasteryProfileService.roasteryProfileData.phone) {
            obj.setNumber(this.roasteryProfileService.roasteryProfileData.phone);
        }
    }
}
