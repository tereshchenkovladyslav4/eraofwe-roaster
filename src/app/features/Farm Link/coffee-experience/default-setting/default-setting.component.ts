import { Component, OnInit } from '@angular/core';
import { GlobalsService } from '@services';
import { UserserviceService } from '@services';
import { ToastrService } from 'ngx-toastr';
import { CookieService } from 'ngx-cookie-service';
import { RoasterserviceService } from '@services';

@Component({
    selector: 'app-default-setting',
    templateUrl: './default-setting.component.html',
    styleUrls: ['./default-setting.component.css'],
})
export class DefaultSettingComponent implements OnInit {
    date1: Date;
    appLanguage?: any;
    coffeeDetailsActive: any = 0;
    roaster_id: string;
    website: any;
    description: any;
    image_id: any;
    image_url: any;
    video_id: any;
    video_url: any;
    tagsArray: any = [];
    certificatesArray: any = [];
    files: any;
    fileEvent: any;
    fileName: any;
    imageFileData: any;
    videoFileData: any;
    imageFileName: any;
    videoFileName: any;
    onResponse: boolean = false;
    onRequest: boolean = true;
    videoOnRequest: boolean = true;
    videoOnResponse: boolean = false;
    materialFileName: any;
    materialFileData: any;
    material_id: any;
    material_url: any;
    materialOnResponse: boolean = false;
    materialOnRequest: boolean = true;

    constructor(
        public globals: GlobalsService,
        private userService: UserserviceService,
        private toastrService: ToastrService,
        private cookieService: CookieService,
        private roasterService: RoasterserviceService,
    ) {
        this.roaster_id = this.cookieService.get('roaster_id');
    }

    ngOnInit(): void {
        this.language();

        $('body').on('change', '.custom-label__inputs', function () {
            var $this = $(this);

            if ($this.is(':checked')) {
                $this.parents('.custom-label').addClass('active');
                var totalChecked = $('.roastery-tags__checkboxes').find('.custom-label.active').length;
                console.log(totalChecked);

                if (totalChecked == 5) {
                    $('.roastery-tags__checkboxes')
                        .find('.custom-label')
                        .find('.custom-label__inputs')
                        .prop('disabled', true);
                    $('.roastery-tags__checkboxes')
                        .find('.custom-label.active')
                        .find('.custom-label__inputs')
                        .prop('disabled', false);
                }
            } else {
                $this.parents('.custom-label').removeClass('active');
                $('.roastery-tags__checkboxes')
                    .find('.custom-label')
                    .find('.custom-label__inputs')
                    .prop('disabled', false);
                $('.roastery-tags__checkboxes')
                    .find('.custom-label.active')
                    .find('.custom-label__inputs')
                    .prop('disabled', false);
            }
        });

        this.getDefaultSetting();
        this.getGeneralRoasterCertificates();
        this.getMarketingMaterial();
    }

    language() {
        this.appLanguage = this.globals.languageJson;
        this.coffeeDetailsActive++;
    }
    getDefaultSetting() {
        this.userService.getDefaultCoffeeExperience(this.roaster_id).subscribe((response) => {
            if (response['success'] == true) {
                this.website = response['result'].website;
                this.description = response['result'].description;
                this.image_id = response['result'].image_id;
                this.image_url = response['result'].image_url;
                this.video_id = response['result'].video_id;
                this.video_url = response['result'].video_url;
                this.tagsArray = response['result'].tags;
            } else {
                this.toastrService.error('Error while getting the Default settings of the Roaster');
            }
        });
    }

    getGeneralRoasterCertificates() {
        this.userService.getGeneralRoasterCertificates(this.roaster_id).subscribe((response) => {
            if (response['success'] == true) {
                this.certificatesArray = response['result'];
                console.log(this.certificatesArray);
            } else {
                this.toastrService.error('Error while getting certificates');
            }
        });
    }
    getMarketingMaterial() {
        this.userService.getMarketingMaterials(this.roaster_id).subscribe((response) => {
            if (response['success'] == true) {
                this.material_url = response['result'].url;
                this.materialFileName = response['result'].name;
                this.materialOnRequest = false;
                this.materialOnResponse = true;
            } else {
                // this.toastrService.error("Error while getting Marketing materials");
                this.materialOnRequest = true;
                this.materialOnResponse = false;
            }
        });
    }

    deleteCertificate(item: any) {
        this.userService.deleteCompanyCertificate(this.roaster_id, item.id).subscribe((response) => {
            if (response['success'] == true) {
                this.toastrService.success('The Certificate is deleted successfully');
            } else {
                this.toastrService.error('Error while deleting the Certificate');
            }
        });
    }

    uploadImage(event: any) {
        this.files = event.target.files;
        this.fileEvent = this.files;
        console.log(this.fileEvent);
        this.imageFileName = this.files[0].name;
        // this.imageFileName = this.fileName;
        let fileList: FileList = this.fileEvent;
        // var parent_id = 0;
        if (fileList.length > 0) {
            let file: File = fileList[0];
            let formData: FormData = new FormData();
            formData.append('file', file, file.name);
            formData.append('name', this.imageFileName);
            formData.append('file_module', 'Coffee-Story');
            formData.append('parent_id', '0');
            // this.roasterId = this.cookieService.get("roaster_id");
            formData.append('api_call', '/ro/' + this.roaster_id + '/file-manager/files');
            formData.append('token', this.cookieService.get('Auth'));

            this.roasterService.uploadFiles(formData).subscribe((result) => {
                if (result['success'] == true) {
                    this.toastrService.success('The file ' + this.fileName + ' uploaded successfully');
                    this.imageFileData = result['result'];
                    this.image_id = result['result'].id;
                    this.image_url = result['result'].url;
                    this.onResponse = true;
                    this.onRequest = false;
                } else {
                    this.toastrService.error('Error while uploading the file');
                }
            });
        }
    }

    uploadVideo(event: any) {
        this.files = event.target.files;
        this.fileEvent = this.files;
        console.log(this.fileEvent);
        this.videoFileName = this.files[0].name;
        let fileList: FileList = this.fileEvent;
        // var parent_id = 0;
        if (fileList.length > 0) {
            let file: File = fileList[0];
            let formData: FormData = new FormData();
            formData.append('file', file, file.name);
            formData.append('name', this.videoFileName);
            formData.append('file_module', 'Coffee-Story');
            formData.append('parent_id', '0');
            // this.roasterId = this.cookieService.get("roaster_id");
            formData.append('api_call', '/ro/' + this.roaster_id + '/file-manager/files');
            formData.append('token', this.cookieService.get('Auth'));
            this.roasterService.uploadFiles(formData).subscribe((result) => {
                if (result['success'] == true) {
                    this.toastrService.success('The file ' + this.fileName + ' uploaded successfully');
                    this.videoFileData = result['result'];
                    this.video_id = result['result'].id;
                    this.video_url = result['result'].url;
                    this.videoOnResponse = true;
                    this.videoOnRequest = false;
                } else {
                    this.toastrService.error('Error while uploading the file');
                }
            });
        }
    }

    uploadMarketingMaterial(event: any) {
        this.files = event.target.files;
        this.fileEvent = this.files;
        console.log(this.fileEvent);
        this.materialFileName = this.files[0].name;
        let fileList: FileList = this.fileEvent;
        // var parent_id = 0;
        if (fileList.length > 0) {
            let file: File = fileList[0];
            let formData: FormData = new FormData();
            formData.append('file', file, file.name);
            formData.append('name', this.materialFileName);
            formData.append('file_module', 'marketing-materials');
            formData.append('parent_id', '0');
            // this.roasterId = this.cookieService.get("roaster_id");
            formData.append('api_call', '/ro/' + this.roaster_id + '/file-manager/files');
            formData.append('token', this.cookieService.get('Auth'));
            this.roasterService.uploadFiles(formData).subscribe((result) => {
                if (result['success'] == true) {
                    this.toastrService.success('The file ' + this.materialFileName + ' uploaded successfully');
                    this.materialFileData = result['result'];
                    this.material_id = result['result'].id;
                    this.material_url = result['result'].url;
                    this.materialOnResponse = true;
                    this.materialOnRequest = false;
                } else {
                    this.toastrService.error('Error while uploading the file');
                }
            });
        }
    }

    saveDefaultSetting() {
        if (
            this.website == '' ||
            this.description == '' ||
            this.image_id == undefined ||
            this.video_id == undefined ||
            this.tagsArray == []
        ) {
            this.toastrService.error('Please update all the details required');
        } else {
            var data = {
                description: this.description,
                website: this.website,
                tags: this.tagsArray,
                image_id: this.image_id,
                video_id: this.video_id,
            };
            this.userService.postDefaultCoffeeExperienceDetail(this.roaster_id, data).subscribe((response) => {
                if (response['success'] == true) {
                    this.toastrService.success('The Default settings updated Successfully');
                } else {
                    this.toastrService.error('Error while Updating.');
                }
            });
        }
    }

    getTagValue(event: any) {
        if (event.target.checked) {
            console.log(event.target.value);
            this.tagsArray.push(event.target.value);
            console.log(this.tagsArray);
        } else {
            console.log(event.target.value);
            const index = this.tagsArray.indexOf(event.target.value);
            if (index > -1) {
                this.tagsArray.splice(index, 1);
            }
            console.log(this.tagsArray);
        }
    }
}
