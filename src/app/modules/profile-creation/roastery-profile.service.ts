import { Injectable } from '@angular/core';
import { UserserviceService } from '@services';
import { CookieService } from 'ngx-cookie-service';
import { RoasterserviceService } from '@services';
import { ToastrService } from 'ngx-toastr';
import { ProfilePhotoService } from './profile-photo/profile-photo.service';
import { Router } from '@angular/router';
import { COUNTRY_LIST } from '@constants';
import { BehaviorSubject } from 'rxjs';
import { OrganizationProfile } from '@models';
@Injectable({
    providedIn: 'root',
})
export class RoasteryProfileService {
    countryList = [];

    public editMode = new BehaviorSubject(true);
    public editMode$ = this.editMode.asObservable();

    public saveMode = new BehaviorSubject(false);
    public saveMode$ = this.saveMode.asObservable();

    public avatarImageChanged = new BehaviorSubject(null);
    public avatarImageChanged$ = this.avatarImageChanged.asObservable();

    public mainSubFormInvalid = false;
    public aboutFormInvalid = false;
    public contactFormInvalid = false;
    public toUpdateProfileData: OrganizationProfile;
    public roasteryProfileData: OrganizationProfile;

    cities: Array<any> = [];

    userId: string;
    roasterId: string;
    roasterUsers: any = [];
    empName: any = '';
    roasterContacts: any = [];
    single: { name: string; value: any }[];
    showDelete = false;
    bannerUrl?: string;
    bannerFile?: any;
    bannerFileId?: any;
    profileInfo?: any;
    isSaving?: boolean;

    constructor(
        public userService: UserserviceService,
        public cookieService: CookieService,
        public roasterService: RoasterserviceService,
        public toastrService: ToastrService,
        public profilePhotoService: ProfilePhotoService,
        public router: Router,
    ) {
        this.userId = this.cookieService.get('user_id');
        this.roasterId = this.cookieService.get('roaster_id');
        this.roasterProfile();
        this.countryList = COUNTRY_LIST;
    }

    public editProfileData(subData: any) {
        this.toUpdateProfileData = {
            ...this.roasteryProfileData,
            ...subData,
        };
    }

    roasterProfile() {
        this.userService.getRoasterAccount(this.roasterId).subscribe((result: any) => {
            if (result.success) {
                console.log('roaster details: ', result);
                this.roasteryProfileData = result.result;
                this.toUpdateProfileData = result.result;

                this.profilePhotoService.croppedImage = this.roasteryProfileData.company_image_url;

                this.single = [
                    {
                        name: 'Female',
                        value: this.roasteryProfileData.female_employee_count
                            ? this.roasteryProfileData.female_employee_count
                            : 0,
                    },
                    {
                        name: 'Male',
                        value: this.roasteryProfileData.male_employee_count
                            ? this.roasteryProfileData.male_employee_count
                            : 0,
                    },
                ];
            }
        });

        this.roasterService.getRoasterUsers(this.roasterId).subscribe((data: any) => {
            if (data.success) {
                this.roasterUsers = data.result;

                console.log(this.roasterUsers);
            }
        });

        this.getcontactList();
    }

    getcontactList() {
        this.roasterService.getRoasterContacts(this.roasterId).subscribe((res: any) => {
            if (res.success) {
                this.roasterContacts = res.result;
                console.log(this.roasterContacts);
            }
        });
    }

    //  Function Name :Change Country.
    // Description: This function helps to get the values of cities according to selcted country.
    changeCountry(count) {
        console.log('changing country selection >>>>>>>>>>>>>>>', count);
        this.cities = COUNTRY_LIST.find((con) => con.isoCode === count).cities;
    }

    b64toBlob(b64Data, contentType, sliceSize) {
        contentType = contentType || '';
        sliceSize = sliceSize || 512;

        const byteCharacters = atob(b64Data);
        const byteArrays = [];

        for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
            const slice = byteCharacters.slice(offset, offset + sliceSize);

            const byteNumbers = new Array(slice.length);
            for (let i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
            }

            const byteArray = new Uint8Array(byteNumbers);

            byteArrays.push(byteArray);
        }

        const blob = new Blob(byteArrays, { type: contentType });
        return blob;
    }

    saveRoasterProfile() {
        //      public mainSubFormInvalid: boolean;
        // public aboutFormInvalid: boolean;
        // public contactFormInvalid: boolean;
        if (this.mainSubFormInvalid || this.aboutFormInvalid || this.contactFormInvalid) {
            this.toastrService.error('Please fill all required fields');
            return;
        }
        this.isSaving = true;
        if (this.bannerFile) {
            this.userService.uploadFile(this.roasterId, this.bannerFile, 'Cover-Image').subscribe((res) => {
                console.log('banner file upload result >>>>>>', res);
                if (res.success) {
                    this.bannerFileId = res.result.id;
                    this.toUpdateProfileData.banner_file_id = res.result.id;
                    this.updateRoasterAccount();
                } else {
                    this.isSaving = false;
                    this.toastrService.error('Error while uploading banner image, please try again.');
                }
            });
        } else {
            this.updateRoasterAccount();
        }
    }

    updateRoasterAccount(): void {
        const data: OrganizationProfile = this.toUpdateProfileData;
        // const data: RoasteryProfile = this.roasteryProfileData;

        console.log('to save data: ', data);

        this.userService.updateRoasterAccount(this.roasterId, data).subscribe((response: any) => {
            if (response.success === true) {
                console.log(response);
                const base64Rejex = /^data:image\/(?:gif|png|jpeg|bmp|webp)(?:;charset=utf-8)?;base64,(?:[A-Za-z0-9]|[+/])+={0,2}/;
                const isBase64Valid = base64Rejex.test(this.profilePhotoService.croppedImage); // base64Data is the base64 string

                if (isBase64Valid === false) {
                    if (this.empName === '') {
                        this.toastrService.success('Roaster profile details updated successfully');
                        this.saveMode.next(false);
                        this.editMode.next(true);
                        this.empName = '';
                        this.roasterProfile();
                    } else {
                        const contactData = {
                            user_id: parseInt(this.empName, 10),
                        };
                    }
                } else {
                    console.log('entering here');
                    const ImageURL = this.profilePhotoService.croppedImage;
                    // Split the base64 string in data and contentType
                    const block = ImageURL.split(';');
                    // Get the content type of the image
                    const contentType = block[0].split(':')[1]; // In this case "image/gif"
                    // get the real base64 content of the file
                    const realData = block[1].split(',')[1]; // In this case "R0lGODlhPQBEAPeoAJosM...."

                    // Convert it to a blob to upload
                    const blob = this.b64toBlob(realData, contentType, 0);

                    const formData: FormData = new FormData();
                    formData.append('file', blob);
                    formData.append('api_call', '/ro/' + this.roasterId + '/company-image');
                    formData.append('token', this.cookieService.get('Auth'));
                    this.userService.uploadProfileImage(formData).subscribe((result: any) => {
                        console.log(result);
                        if (result.success) {
                            if (this.empName === '') {
                                this.toastrService.success('Roaster profile details updated successfully');
                                this.saveMode.next(false);
                                this.editMode.next(true);
                                this.empName = '';
                                this.roasterProfile();
                            } else {
                            }
                        } else {
                            console.log(result);
                            this.isSaving = false;
                            this.toastrService.error('Error while uploading company image, please try again.');
                        }
                    });
                }
            } else {
                this.isSaving = false;
                this.toastrService.error('Error while updating details, please try again.');
            }
        });
    }

    handleBannerImageFile(inputElement: any) {
        this.bannerFile = inputElement.files[0];
        if (!this.bannerFile) {
            return;
        }
        if (this.bannerFile.type.split('/')[0] !== 'image') {
            return;
        }
        if (this.bannerFile.size >= 2097152) {
            this.toastrService.error('File size is too big to upload');
            return;
        }

        const reader = new FileReader();

        reader.readAsDataURL(this.bannerFile);

        reader.onload = (event: any) => {
            this.bannerUrl = event.target.result;
        };
    }

    handleDeleteBannerImage(): void {
        console.log('banner file id ', this.bannerFileId);
        this.userService.deleteFile(this.roasterId, this.bannerFileId).subscribe((res) => {
            this.toastrService.success('Deleted Banner Image');
            console.log('remove banner file res', res);
        });
    }

    editRoasterProfile() {
        this.isSaving = false;
        this.showDelete = true;
        this.editMode.next(false);
        this.saveMode.next(true);
    }

    preview() {
        this.bannerUrl = this.roasteryProfileData.banner_url;
        this.profilePhotoService.croppedImage = this.roasteryProfileData.company_image_url;
        this.editMode.next(true);
        this.saveMode.next(false);
    }
}
