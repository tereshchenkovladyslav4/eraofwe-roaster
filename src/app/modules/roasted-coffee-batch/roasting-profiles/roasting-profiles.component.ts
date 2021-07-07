import { Component, OnInit, TemplateRef } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { AuthService, RoasterserviceService, UserService } from '@services';
import { ToastrService } from 'ngx-toastr';
import { GlobalsService } from '@services';
import { FormBuilder } from '@angular/forms';
import { SharedServiceService } from '@app/shared/services/shared-service.service';
import { ConfirmComponent } from '@shared';
import { DialogService } from 'primeng/dynamicdialog';

@Component({
    selector: 'app-roasting-profiles',
    templateUrl: './roasting-profiles.component.html',
    styleUrls: ['./roasting-profiles.component.scss'],
})
export class RoastingProfilesComponent implements OnInit {
    roleId: any;
    termStatus: any;
    teamRole: any;
    roleID: string;
    roasterId: any;
    appLanguage?: any;
    profileID: any;
    roasterLevels = {
        1: 'Light',
        2: 'Light Medium',
        3: 'Medium',
        4: 'Medium Dark',
        5: 'Dark',
    };
    breadItems = [
        { label: 'Home', routerLink: '/roaster-dashboard' },
        { label: 'Inventory' },
        { label: 'Roasted coffee', routerLink: '/roasted-coffee-batch/roasted-coffee-batchs' },
        { label: 'Roasting profiles' },
    ];
    roastLevelArray: any = [];
    roastLevelFilter;
    roasterID: any = '';
    tableColumns = [];
    tableValue = [];
    totalCount = 0;
    termSearch = '';
    selectedProfiles = [];
    disableAction = false;
    isLoadingProfiles = false;

    constructor(
        public router: Router,
        public cookieService: CookieService,
        private roasterService: RoasterserviceService,
        private toastrService: ToastrService,
        public globals: GlobalsService,
        public userService: UserService,
        private fb: FormBuilder,
        public sharedService: SharedServiceService,
        private dialogService: DialogService,
        private authService: AuthService,
    ) {
        this.roasterId = this.authService.getOrgId();
    }

    ngOnInit(): void {
        this.appLanguage = this.globals.languageJson;
        if (this.sharedService.windowWidth <= this.sharedService.responsiveStartsAt) {
            this.sharedService.isMobileView = true;
        }
        this.loadFilterValues();
        this.tableColumns = [
            {
                field: 'roast_profile_name',
                header: 'Roast name',
                sortable: false,
                width: 25,
            },
            {
                field: 'roast_level',
                header: 'Roast level',
                sortable: false,
                width: 20,
            },
            {
                field: 'temperature',
                header: 'Temperature',
                width: 20,
            },
            {
                field: 'roast_duration',
                header: 'Duration',
                sortable: false,
                width: 20,
            },
            {
                field: 'actions',
                header: 'Actions',
                sortable: false,
                width: 15,
            },
        ];
    }

    loadFilterValues() {
        this.roastLevelArray = [
            { label: 'Light', value: 1 },
            { label: 'Light Medium', value: 2 },
            { label: 'Medium', value: 3 },
            { label: 'Medium Dark', value: 4 },
            { label: 'Dark', value: 5 },
        ];
    }

    setTeamRole(term: any, roleId: any) {
        this.teamRole = term;
        this.roleId = roleId;
    }

    getData(event = null): void {
        const queryParams = {
            sort_by: 'created_at',
            sort_order: 'desc',
            page: 1,
            per_page: 10,
            search_query: this.termSearch,
            roast_level: this.roastLevelFilter,
        };
        if (event) {
            if (event.sortField) {
                queryParams.sort_by = event.sortField;
                queryParams.sort_order = event.sortOrder === -1 ? 'desc' : 'asc';
            }
            queryParams.page = event.first / event.rows + 1;
        }
        this.getRoastingProfile(queryParams);
    }

    getRoastingProfile(queryParams: any) {
        this.tableValue = [];
        this.isLoadingProfiles = true;
        this.roasterService.getRoastingProfile(queryParams).subscribe(
            (data: any) => {
                this.isLoadingProfiles = false;
                if (data.success) {
                    this.tableValue = data.result;
                    this.totalCount = data.result_info.total_count;
                } else {
                    this.toastrService.error('Error while getting the roasting profile list!');
                }
            },
            (err) => {
                this.toastrService.error('Error while getting the roasting profile list!');
            },
        );
    }

    getRoastLevel(data: any) {
        if (data) {
            return this.roasterLevels[data];
        }
    }

    redirectToEdit(item) {
        if (!this.disableAction) {
            this.profileID = item;
            const navigationExtras: NavigationExtras = {
                queryParams: {
                    profileID: encodeURIComponent(this.profileID),
                },
            };
            this.router.navigate(['/roasted-coffee-batch/create-roasting-profile'], navigationExtras);
        }
    }
    menuClicked() {
        // Stop propagation
        this.disableAction = true;
        setTimeout(() => {
            this.disableAction = false;
        }, 100);
    }

    deleteRoastingProfile(id: number) {
        this.dialogService
            .open(ConfirmComponent, {
                data: {
                    type: 'delete',
                    desp: 'Are you sure you want to delete this profile?',
                },
                showHeader: false,
                styleClass: 'confirm-dialog',
            })
            .onClose.subscribe((action: any) => {
                if (action === 'yes') {
                    this.userService.deleteRoastingProfile(this.roasterId, id).subscribe(
                        (res) => {
                            if (res.success) {
                                this.toastrService.success('Roasted profile deleted successfully');
                                this.getData();
                            } else {
                                this.toastrService.error('Error while deleting roasting profile');
                            }
                        },
                        (err) => {
                            this.toastrService.error('Error while deleting roasting profile');
                        },
                    );
                }
            });
    }
}
