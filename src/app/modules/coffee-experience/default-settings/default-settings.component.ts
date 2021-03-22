import { Component, Input, OnInit } from '@angular/core';
import { GlobalsService } from '@services';
import { UserserviceService } from '@services';
import { ToastrService } from 'ngx-toastr';
import { CookieService } from 'ngx-cookie-service';
import { MenuItem } from 'primeng/api';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

@Component({
    selector: 'app-default-settings',
    templateUrl: './default-settings.component.html',
    styleUrls: ['./default-settings.component.scss'],
})
export class DefaultSettingsComponent implements OnInit {
    isCoffeeDetailsPage = this.route.snapshot.routeConfig.path !== 'default-settings';
    date1: Date;
    appLanguage?: any;
    coffeeDetailsActive: any = 0;
    roasterId: any;
    defaultDetails: any = {
        description: '',
        website: '',
        tags: [],
        video_id: 0,
        image_id: 0,
    };
    tagOptionList: any = [];
    certificateDetails: any = [];
    imageDetails: any;
    videoDetails: any;
    isSent = false;
    fileImage: any;
    fileVideo: any;
    filesCount = 0;
    totalFilesNumber = 0;
    fileVideoId?: number;
    fileImageId?: number;
    isFailedToSave?: boolean;
    isSaving?: boolean;
    imageMenuItems: MenuItem[];
    videoMenuItems: MenuItem[];
    certificateMenuItems: MenuItem[];
    isImagePreviewPanel = false;
    isVideoPreviewPanel = false;
    coffeeExperienceLink = 'https://sewn.com/coffee-experience';
    orderID?: any;
    items = [];
    isEditableMode = false;

    constructor(
        public globals: GlobalsService,
        private userService: UserserviceService,
        private toastrService: ToastrService,
        public cookieService: CookieService,
        private route: ActivatedRoute,
        public location: Location,
    ) {
        this.roasterId = this.cookieService.get('roaster_id');
        this.setMenuItems();
    }

    ngOnInit(): void {
        this.language();
        if (this.isCoffeeDetailsPage) {
            if (this.route.snapshot.queryParams.estate_id) {
                this.orderID = decodeURIComponent(this.route.snapshot.queryParams.estate_id);
            } else if (this.route.snapshot.queryParams.micro_roasters_id) {
                this.orderID = decodeURIComponent(this.route.snapshot.queryParams.micro_roasters_id);
            } else if (this.route.snapshot.queryParams.hrc_id) {
                this.orderID = decodeURIComponent(this.route.snapshot.queryParams.hrc_id);
            }
            this.getOrderExperience();
        } else {
            this.getDefaultSetting();
        }
        this.tagOptionList = [
            { select: false, label: 'Investing locally' },
            { select: false, label: 'Waste management' },
            { select: false, label: 'Happy employees' },
            { select: false, label: 'Circular economy' },
            { select: false, label: 'Fossile free energy' },
            { select: false, label: 'Sustainability' },
            { select: false, label: 'Agroforestry' },
            { select: false, label: 'Reforestation' },
            { select: false, label: 'Pocket friendly' },
        ];
        this.items = [
            { label: 'Home', routerLink: '/features/welcome-aboard' },
            { label: 'Farm link' },
            { label: 'The Coffee Experience', routerLink: '/coffee-experience' },
            { label: this.isCoffeeDetailsPage ? 'Order #' + this.orderID : 'Default Settings' },
        ];
        this.getGeneralRoasterCertificates();
    }

    setMenuItems(): void {
        this.imageMenuItems = [
            {
                label: 'Update',
                icon: 'pi pi-refresh',
                command: () => {
                    this.updateImage();
                },
            },
            {
                label: 'Delete',
                icon: 'pi pi-times',
                command: () => {
                    this.deleteImage();
                },
            },
        ];
        this.videoMenuItems = [
            {
                label: 'Update',
                icon: 'pi pi-refresh',
                command: () => {
                    this.updateVideo();
                },
            },
            {
                label: 'Delete',
                icon: 'pi pi-times',
                command: () => {
                    this.deleteVideo();
                },
            },
        ];
        this.certificateMenuItems = [
            {
                label: 'Update',
                icon: 'pi pi-refresh',
                command: () => {},
            },
            {
                label: 'Delete',
                icon: 'pi pi-times',
                command: () => {},
            },
        ];
    }

    updateImage() {
        this.isImagePreviewPanel = false;
    }

    deleteImage() {
        this.isImagePreviewPanel = false;
        this.defaultDetails.image_id = 0;
    }

    updateVideo() {
        this.isVideoPreviewPanel = false;
    }

    deleteVideo() {
        this.isVideoPreviewPanel = false;
        this.defaultDetails.video_id = 0;
    }

    getOrderExperience() {
        if (this.route.snapshot.queryParams.micro_roasters_id) {
            this.userService.getMrOrdersCoffeeExperience(this.roasterId, this.orderID).subscribe((response: any) => {
                if (response.success) {
                    this.setPageData(response);
                } else {
                    this.getDefaultSetting();
                }
            });
        } else if (this.route.snapshot.queryParams.hrc_id) {
            this.userService.getHrcOrdersCoffeeExperience(this.roasterId, this.orderID).subscribe((response: any) => {
                if (response.success) {
                    this.setPageData(response);
                } else {
                    this.getDefaultSetting();
                }
            });
        }
    }

    getDefaultSetting() {
        this.userService.getDefaultCoffeeExperience(this.roasterId).subscribe((response: any) => {
            if (response.success) {
                this.setPageData(response);
            } else {
                this.toastrService.error('Error while getting the Default settings of the Roaster');
            }
        });
    }

    setPageData(response: any): void {
        this.defaultDetails = response.result;
        if (this.defaultDetails.image_url) {
            this.isImagePreviewPanel = true;
        }
        if (this.defaultDetails.video_url) {
            this.isVideoPreviewPanel = true;
        }
        if (this.defaultDetails && this.defaultDetails.tags && this.defaultDetails.tags.length) {
            this.tagOptionList.map((item: any) => {
                item.select = !!this.defaultDetails.tags.find((tag: any) => tag === item.label);
                return item;
            });
        }
    }

    getGeneralRoasterCertificates() {
        this.userService.getGeneralRoasterCertificates(this.roasterId).subscribe((response: any) => {
            if (response.success === true) {
                this.certificateDetails = response.result;
            } else {
                this.toastrService.error('Error while getting certificates');
            }
        });
    }

    onChangeTag(index: number): void {
        if (!this.isEditableMode) {
            return;
        }
        if (this.tagOptionList.filter((item: any) => item.select).length >= 5 && !this.tagOptionList[index].select) {
            return;
        }
        this.tagOptionList[index].select = !this.tagOptionList[index].select;
    }

    viewCertificate(item) {
        const a = document.createElement('a');
        a.href = item.public_url;
        a.target = '_blank';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }

    onChooseFile(target: any, parameter: string) {
        const file = target.files[0];
        if (!file) {
            return;
        }
        this[parameter] = file;
        const reader = new FileReader();

        reader.readAsDataURL(file);

        reader.onload = (event: any) => {
            if (parameter === 'fileVideo') {
                this.isVideoPreviewPanel = true;
                this.defaultDetails.video_url = event.target.result;
            } else {
                this.isImagePreviewPanel = true;
                this.defaultDetails.image_url = event.target.result;
            }
        };
    }

    onCancel(): void {
        this.isEditableMode = false;
        this.getDefaultSetting();
    }

    onSave() {
        this.isSent = true;
        if (!this.defaultDetails.description) {
            return false;
        }
        this.isFailedToSave = false;
        this.isSaving = true;
        this.totalFilesNumber = 0;
        this.filesCount = 0;
        if (this.fileVideo) {
            this.totalFilesNumber++;
        }
        if (this.fileImage) {
            this.totalFilesNumber++;
        }
        if (this.fileVideo) {
            this.userService.uploadFile(this.roasterId, this.fileVideo, 'Coffee-Story').subscribe(
                (res: any) => {
                    this.fileVideoId = res.result?.id;
                    this.filesCount++;
                    if (this.filesCount === this.totalFilesNumber) {
                        this.handleSaveData();
                    }
                },
                () => {
                    this.handleFailedToSaveData();
                    return;
                },
            );
        }
        if (this.fileImage) {
            this.userService.uploadFile(this.roasterId, this.fileImage, 'Coffee-Story').subscribe(
                (res: any) => {
                    this.fileImageId = res.result?.id;
                    this.filesCount++;
                    if (this.filesCount === this.totalFilesNumber) {
                        this.handleSaveData();
                    }
                },
                () => {
                    this.handleFailedToSaveData();
                    return;
                },
            );
        }
        if (!this.totalFilesNumber) {
            this.handleSaveData();
        }
    }

    handleFailedToSaveData(): void {
        if (!this.isFailedToSave) {
            this.toastrService.error('Error while uploading the file');
            this.isFailedToSave = true;
            this.isSaving = false;
        }
    }

    handleSaveData(): void {
        const data = {
            website: this.defaultDetails.website,
            description: this.defaultDetails.description,
            tags: this.tagOptionList.filter((item: any) => item.select).map((item: any) => item.label),
            image_id: this.fileImageId || this.defaultDetails.image_id,
            video_id: this.fileVideoId || this.defaultDetails.video_id,
        };
        if (this.route.snapshot.queryParams.micro_roasters_id) {
            this.userService.postMrOrdersCoffeeExperience(this.roasterId, this.orderID, data).subscribe(
                (res: any) => {
                    this.isSaving = false;
                    if (res.success) {
                        this.handleAfterSuccess();
                    } else {
                        this.toastrService.error('Error while saving the details');
                    }
                },
                (err) => {
                    this.isSaving = false;
                    this.toastrService.error('Error while saving the details');
                },
            );
        } else if (this.route.snapshot.queryParams.hrc_id) {
            this.userService.postHrcOrdersCoffeeExperience(this.roasterId, this.orderID, data).subscribe(
                (res: any) => {
                    this.isSaving = false;
                    if (res.success) {
                        this.handleAfterSuccess();
                    } else {
                        this.toastrService.error('Error while saving the details');
                    }
                },
                (err) => {
                    this.isSaving = false;
                    this.toastrService.error('Error while saving the details');
                },
            );
        } else {
            this.userService.postDefaultCoffeeExperienceDetail(this.roasterId, data).subscribe(
                (res: any) => {
                    this.isSaving = false;
                    if (res.success) {
                        this.handleAfterSuccess();
                    } else {
                        this.toastrService.error('Error while saving the details');
                    }
                },
                (err) => {
                    this.isSaving = false;
                    this.toastrService.error('Error while saving the details');
                },
            );
        }
    }

    handleAfterSuccess(): void {
        this.isEditableMode = false;
        this.toastrService.success('Details saved successfully');
    }

    language() {
        this.appLanguage = this.globals.languageJson;
        this.coffeeDetailsActive++;
    }

    handleCopyCoffeeExperienceLink(): void {
        const textArea = document.createElement('textarea');
        textArea.value = this.coffeeExperienceLink;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('Copy');
        textArea.remove();
    }
}