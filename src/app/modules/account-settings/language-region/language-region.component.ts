import { Component, OnInit } from '@angular/core';
import * as moment from 'moment-timezone';
import { GlobalsService, UserService, UserserviceService } from '@services';
import { Location } from '@angular/common';
import { languages } from '@constants';
import { ToastrService } from 'ngx-toastr';
import { CookieService } from 'ngx-cookie-service';
import { MenuItem } from 'primeng/api';

@Component({
    selector: 'app-language-region',
    templateUrl: './language-region.component.html',
    styleUrls: ['./language-region.component.scss'],
})
export class LanguageRegionComponent implements OnInit {
    applicationLanguages: any[] = [
        {
            name: 'English',
            value: 'en',
        },
        {
            name: 'Swedish',
            value: 'sv',
        },
        {
            name: 'Spanish',
            value: 'es',
        },
        {
            name: 'Portuguese',
            value: 'pt',
        },
    ];
    languages: any[] = languages.sort((a: any, b: any) => (a.name < b.name ? -1 : 1));
    timezones: any[] = [];
    selectedConverseLanguages?: any = [];
    isLoading?: boolean;
    breadcrumbItems: MenuItem[];
    roasterId: any;
    apiCount = 0;
    userInfo?: any;

    constructor(
        private userService: UserService,
        private userOriginalService: UserserviceService,
        public location: Location,
        private toastr: ToastrService,
        private cookieService: CookieService,
        public globals: GlobalsService,
    ) {
        this.roasterId = this.cookieService.get('roaster_id');
    }

    ngOnInit(): void {
        const today = new Date();
        this.timezones = moment.tz.names().map((item) => {
            return {
                label: `(GMT ${moment(today).tz(item).format('Z')}) ${item}`,
                value: item,
            };
        });
        this.getUserInfo();
        this.getConverseLanguages();
        this.breadcrumbItems = [
            { label: this.globals.languageJson?.home, routerLink: '/dashboard' },
            { label: this.globals.languageJson?.account_settings, routerLink: '../../account-settings' },
            { label: this.globals.languageJson?.language_region },
        ];
    }

    getUserInfo(): void {
        this.isLoading = true;
        this.userOriginalService.getRoasterProfile(this.roasterId).subscribe((res: any) => {
            console.log('user info >>>>>>', res);
            this.apiCount += 1;
            if (this.apiCount === 2) {
                this.isLoading = false;
            }
            this.userInfo = res.result;
        });
    }

    getConverseLanguages(): void {
        this.isLoading = true;
        this.userOriginalService.getConverseLanguage().subscribe((res: any) => {
            this.apiCount += 1;
            if (this.apiCount === 2) {
                this.isLoading = false;
            }
            if (res.result?.languages?.length) {
                this.selectedConverseLanguages = res.result?.languages.map((languageValue: string) => {
                    return this.languages.find((language: any) => language.value === languageValue);
                });
            }
        });
    }

    handleAddConverseLanguage(language: string): void {
        if (this.selectedConverseLanguages.findIndex((item: string) => item === language) !== -1) {
            return;
        }
        this.selectedConverseLanguages.push(language);
        this.handleSaveConverseLanguages();
    }

    handleRemoveConverseLanguage(index: number): void {
        this.selectedConverseLanguages.splice(index, 1);
        this.handleSaveConverseLanguages();
    }

    onChangeUserInfo(): void {
        console.log('update user info >>>', this.userInfo);
        this.userOriginalService.updateRoasterProfile(this.roasterId, this.userInfo).subscribe();
    }

    handleSaveConverseLanguages(): void {
        if (this.selectedConverseLanguages.length) {
            this.userOriginalService
                .addConverseLanguage({
                    languages: this.selectedConverseLanguages.map((item: any) => item.value),
                })
                .subscribe();
        }
    }
}