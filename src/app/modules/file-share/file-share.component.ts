import { Component, OnInit, ɵɵresolveBody, TemplateRef } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { CookieService } from 'ngx-cookie-service';
import { RoasterserviceService } from 'src/services/roasters/roasterservice.service';
import { FileShareService } from './file-share.service';
import { MyfilesComponent } from './myfiles/myfiles.component';
import { Router, NavigationExtras } from '@angular/router';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { PlyrModule } from 'ngx-plyr';
import * as Plyr from 'plyr';

import { TypeaheadMatch } from 'ngx-bootstrap/typeahead/typeahead-match.class';
import { GlobalsService } from 'src/services/globals.service';

@Component({
    selector: 'app-file-share',
    templateUrl: './file-share.component.html',
    styleUrls: ['./file-share.component.scss'],
})
export class FileShareComponent implements OnInit {
    breadItems: any[];
    rangeDates: Date[];

    folder_name: string;
    folder_descr: string;
    invite: any = 'Invite people';
    folderNameError: string;
    descriptionError: string;
    roasterId: string;
    pinnedData: any = [];
    files: any;
    fileEvent: any;
    fileName: any;
    folderId: any;
    url: any;
    modalRef: BsModalRef;
    file_id: any;
    company_id: any;
    company_type: any;
    permission: any;
    user_id_value: any;

    country: any;

    countries: any[];

    filteredCountriesSingle: any[];

    selectedValue: string;
    selectedOption: any;

    typedValue: any;
    usersList: any[] = [];
    appLanguage?: any;
    shareMainActive: any = 0;
    unPinId: any;
    loadId: any;

    constructor(
        public router: Router,
        public toastrService: ToastrService,
        private cookieService: CookieService,
        private roasterService: RoasterserviceService,
        public fileService: FileShareService,
        public modalService: BsModalService,
        public globals: GlobalsService,
    ) {
        this.folderNameError = '';
        this.descriptionError = '';
        this.roasterId = this.cookieService.get('roaster_id');
    }

    ngOnInit(): void {
        this.breadItems = [
            { label: this.globals.languageJson?.home, routerLink: '/' },
            { label: this.globals.languageJson?.file_share },
        ];
        // this.appLanguage = this.globals.languageJson;
        this.language();

        $('.remove-quiker-file').on('click', function (e) {
            e.preventDefault();
        });

        $('.custom-radio input[type="radio"]').on('change', function () {
            var $this = $(this);
            var $value = $(this).val();

            if ($this.is(':checked')) {
                $(this).parents('.custom-radio-container').find('.custom-radio').removeClass('active');
                $(this).parents('.custom-radio').addClass('active');

                if ($value == 'Only me') {
                    $(this).parents('#createfolder').find('.invite-to').slideUp();
                } else {
                    $(this).parents('#createfolder').find('.invite-to').slideDown();
                }
            }
        });

        //Custom select box
        $('body').on('click', '.Custom-select-input__selctedText', function () {
            var selctbox = $(this).parents('.Custom-select-input').find('.Custom-select-input-list').slideToggle();
            $(this).parents('.Custom-select-input').find('.Custom-select-input__selctedText').toggleClass('active');
        });

        $('body').on('click', ' .Custom-select-input-list__item', function () {
            var $val = $(this).text();
            var $setVal = $(this).parents('.Custom-select-input').find('input');
            $setVal.val($val);
            $(this).parents('.Custom-select-input').find('.Custom-select-input__selctedText').text($val);
            $(this).parents('.Custom-select-input').find('.Custom-select-input-list').slideToggle();
            $(this).parents('.Custom-select-input').find('.Custom-select-input__selctedText').toggleClass('active');
        });

        /* pagination start */
        let listCount = 0;
        let elLen;
        let newliLen;

        $(document).ready(function () {
            var pLen = $('.pagination-content').length;
            console.log(pLen);
            for (var x = 0; x < pLen; x++) {
                var elements = $('.pagination-content')
                    .eq(x)
                    .find('.pagination-content-list .pagination-content-list__item');
                var index = 0;
                elLen = elements.length;
                newliLen = Math.floor(elLen / 4) + 1;
                var showNextFour = function (index) {
                    if (index >= elements.length) {
                        index = 0;
                    }

                    elements
                        .hide()
                        .slice(index, index + 4)
                        .show();
                };
                showNextFour(listCount);

                // $('.responsive-pagination-list')
                if (newliLen > 5) {
                    for (var i = 1; i <= 5; i++) {
                        var li = '<li class="responsive-pagination-list__item">' + i + '</li>';
                        $('.pagination-content').eq(x).find('.responsive-pagination-list').append(li);
                        $('.pagination-content')
                            .eq(x)
                            .find('.responsive-pagination-list')
                            .find('.responsive-pagination-list__item:first-child')
                            .addClass('active');
                    }
                } else {
                    for (var i = 1; i <= newliLen; i++) {
                        var li = '<li class="responsive-pagination-list__item">' + i + '</li>';
                        $('.pagination-content').eq(x).find('.responsive-pagination-list').append(li);
                        $('.pagination-content')
                            .eq(x)
                            .find('.responsive-pagination-list')
                            .find('.responsive-pagination-list__item:first-child')
                            .addClass('active');
                    }
                }
            }
        });

        //Next page
        $('body').on('click', '.responsive-pagination__next', function () {
            var step = $(this)
                .parents('.responsive-pagination')
                .find('.responsive-pagination-list')
                .find('.responsive-pagination-list__item.active');
            var steps = $(this)
                .parents('.responsive-pagination')
                .find('.responsive-pagination-list')
                .find('.responsive-pagination-list__item');
            var stepNext = $(this)
                .parents('.responsive-pagination')
                .find('.responsive-pagination-list')
                .find('.responsive-pagination-list__item.active')
                .next('.responsive-pagination-list__item');
            var stepLastVal = parseInt(
                $(this)
                    .parents('.responsive-pagination')
                    .find('.responsive-pagination-list')
                    .find('.responsive-pagination-list__item:last-child')
                    .text(),
            );
            $(this).parents('.pagination-content').find('.responsive-pagination__prev').removeClass('disable');
            var pageNew = parseInt($('.page-new').text());
            var pagefind = stepLastVal - pageNew;

            var elements = $(this)
                .parents('.pagination-content')
                .find('.pagination-content-list .pagination-content-list__item');
            elLen = elements.length;
            newliLen = Math.floor(elLen / 4) + 1;
            var index = 0;
            var showNextFour = function (index) {
                if (index >= elements.length) {
                    index = 0;
                }

                elements
                    .hide()
                    .slice(index, index + 4)
                    .show();
            };

            listCount = listCount + 4;
            showNextFour(listCount);

            var stepValue = stepNext.text();
            if (stepLastVal < newliLen) {
                stepNext.removeClass('active');
                stepNext.prev('.responsive-pagination-list__item').addClass('active');

                if (newliLen > 5) {
                    for (var i = 0; i <= 4; i++) {
                        var newStep = parseInt(steps.eq(i).text());

                        if (pageNew == stepLastVal - 1) {
                            return false;
                        } else {
                            steps.eq(i).text(newStep + 1);
                        }
                    }
                } else {
                    for (var i = 0; i <= newliLen; i++) {
                        var newStep = parseInt(steps.eq(i).text());

                        if (pageNew == stepLastVal - 1) {
                            return false;
                        } else {
                            steps.eq(i).text(newStep + 1);
                        }
                    }
                }
            } else {
                step.removeClass('active');
                stepNext.addClass('active');

                if (stepNext.is(':last-child')) {
                    $(this).addClass('disable');
                }
            }
        });

        //Prev page
        $('body').on('click', '.responsive-pagination__prev', function () {
            var step = $(this)
                .parents('.responsive-pagination')
                .find('.responsive-pagination-list')
                .find('.responsive-pagination-list__item.active:last');
            var steps = $(this)
                .parents('.responsive-pagination')
                .find('.responsive-pagination-list')
                .find('.responsive-pagination-list__item');
            var stepPrev = $(this)
                .parents('.responsive-pagination')
                .find('.responsive-pagination-list')
                .find('.responsive-pagination-list__item.active')
                .prev('.responsive-pagination-list__item');
            var stepFirst = $(this)
                .parents('.responsive-pagination')
                .find('.responsive-pagination-list')
                .find('.responsive-pagination-list__item:first-child');
            var stepLastVal = parseInt(
                $(this)
                    .parents('.responsive-pagination')
                    .find('.responsive-pagination-list')
                    .find('.responsive-pagination-list__item:last-child')
                    .text(),
            );
            var activeFirst = $(this)
                .parents('.responsive-pagination')
                .find('.responsive-pagination-list')
                .find('.responsive-pagination-list__item:first-child')
                .hasClass('active');

            listCount = listCount - 4;

            var elements = $(this)
                .parents('.pagination-content')
                .find('.pagination-content-list .pagination-content-list__item');
            elLen = elements.length;
            newliLen = Math.floor(elLen / 4) + 1;
            var index = 0;
            var showNextFour = function (index) {
                if (index >= elements.length) {
                    index = 0;
                }

                elements
                    .hide()
                    .slice(index, index + 4)
                    .show();
            };

            showNextFour(listCount);

            if (newliLen > 5) {
                for (var i = 0; i <= 4; i++) {
                    var newStep = parseInt(steps.eq(i).text());

                    if (stepLastVal <= 5) {
                        stepPrev.addClass('active');
                        step.removeClass('active');
                    } else {
                        steps.eq(i).text(newStep - 1);
                    }
                }
            } else {
                for (var i = 0; i <= newliLen; i++) {
                    var newStep = parseInt(steps.eq(i).text());

                    if (stepLastVal <= newliLen) {
                        stepPrev.addClass('active');
                        step.removeClass('active');
                    } else {
                        steps.eq(i).text(newStep - 1);
                    }
                }
            }

            if (stepFirst.text() == '1' && stepFirst.hasClass('active')) {
                $(this).addClass('disable');
                $(this).parents('.pagination-content').find('.responsive-pagination__next').removeClass('disable');
            }
        });

        $('body').on('click', '.responsive-pagination-list__item', function () {
            $(this)
                .parents('.pagination-content')
                .find('.responsive-pagination-list__item')
                .not(this)
                .removeClass('active');
            $(this).addClass('active');
            var liStep = parseInt($(this).text());
            listCount = 4;
            if (liStep == 1) {
                $(this).parents('.pagination-content').find('.responsive-pagination__prev').addClass('disable');
                $(this).parents('.pagination-content').find('.responsive-pagination__next').removeClass('disable');
                liStep = 0;
                listCount = 0;
                console.log(listCount);

                var elements = $(this)
                    .parents('.pagination-content')
                    .find('.pagination-content-list .pagination-content-list__item');
                elLen = elements.length;
                newliLen = Math.floor(elLen / 4) + 1;
                var index = 0;
                var showNextFour = function (index) {
                    if (index >= elements.length) {
                        index = 0;
                    }

                    elements
                        .hide()
                        .slice(index, index + 4)
                        .show();
                };

                showNextFour(listCount);
            } else {
                $(this).parents('.pagination-content').find('.responsive-pagination__prev').removeClass('disable');
                $(this).parents('.pagination-content').find('.responsive-pagination__next').removeClass('disable');
                listCount = liStep * listCount - 4;
                console.log(listCount);

                var elements = $(this)
                    .parents('.pagination-content')
                    .find('.pagination-content-list .pagination-content-list__item');
                elLen = elements.length;
                newliLen = Math.floor(elLen / 4) + 1;
                var index = 0;
                var showNextFour = function (index) {
                    if (index >= elements.length) {
                        index = 0;
                    }

                    elements
                        .hide()
                        .slice(index, index + 4)
                        .show();
                };

                showNextFour(listCount);
            }

            if (liStep == newliLen) {
                $(this).parents('.pagination-content').find('.responsive-pagination__next').addClass('disable');
            }
        });
        /* pagination ends */

        // Footer links

        $('body').on('click', '.footer-links__item', function () {
            $(this).parents('.footer-links').find('.footer-links__item').not(this).removeClass('active');
            $(this).addClass('active');
            $('.footer-links__item').find('.ft-dropdown').not(this).removeClass('active');

            $(this).find('.ft-dropdown').addClass('active');

            setTimeout(function () {
                $('.ft-dropdown').removeClass('active');
            }, 3500);
        });

        this.fileService.getPinnedFilesorFolders();
    }

    filterCall() {}

    openVideoModal(template: TemplateRef<any>, item: any) {
        this.modalRef = this.modalService.show(template);
        this.url = item.url;
        const player = new Plyr('#player');
        $('.popup-video').parents('.modal-content').addClass('video-content');

        // $('.popup-video').parents('.modal-content').css({
        //   "padding":"0px !important"
        // })
        // $('.popup-video').parents('.modal-body').css({
        //   "margin-top":"0 !important"
        // })
    }
    openUnpinModal(template1: TemplateRef<any>, unpinId: any) {
        this.modalRef = this.modalService.show(template1);
        this.unPinId = unpinId;
    }
    openDownloadModal(template2: TemplateRef<any>, downloadId: any) {
        this.modalRef = this.modalService.show(template2);
        this.loadId = downloadId;
    }

    closePopup() {
        this.modalRef.hide();
    }
    toggleVideo(event: any) {
        // this.videoplayer.nativeElement.play();
        event.toElement.play();
    }
    language() {
        this.appLanguage = this.globals.languageJson;
        this.shareMainActive++;
    }
    downloadFile(item: any) {
        if (confirm('Please confirm! you want to download?') == true) {
            const a = document.createElement('a');
            a.href = item.url;
            a.download = item.name;
            a.target = '_blank';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        }
    }

    onSelect(event: TypeaheadMatch): void {
        this.selectedOption = event.item;
        console.log(this.selectedOption.id);
        this.user_id_value = this.selectedOption.id;
        this.company_id = this.selectedOption.organization_id;
        this.company_type = this.selectedOption.organization_type;
    }

    getUsersList(e: any) {
        this.typedValue = e.target.value;
        if (this.typedValue.length > 4) {
            this.roasterService.getUsersList(this.typedValue).subscribe((data) => {
                if (data['success'] == true) {
                    this.usersList = data['result'];
                } else {
                    this.toastrService.error('Error while fetching users list');
                }
            });
        }
    }

    unpinFileorFolder(id: any) {
        // if (confirm("Please confirm! you want to unpin?") == true) {
        this.roasterService.unpinFileorFolder(this.roasterId, id).subscribe((data) => {
            if (data['success'] == true) {
                this.toastrService.success('The Selected file is unpinned successfully');
                setTimeout(() => {
                    this.fileService.getPinnedFilesorFolders();
                }, 2500);
            } else {
                this.toastrService.error('Error while unpinning the File');
            }
        });
        // }
    }

    shareDetails(size: any) {
        this.folderId = size.id;
        let navigationExtras: NavigationExtras = {
            queryParams: {
                folderId: encodeURIComponent(this.folderId),
            },
        };

        this.router.navigate(['/features/file-share-details'], navigationExtras);
    }

    closeCard() {
        var closeCard = document.getElementById('closeId');
        closeCard.classList.add('closeCard');
    }

    myFileUpload(event: any) {
        this.files = event.target.files;
        this.fileEvent = this.files;
        console.log(this.fileEvent);
        this.fileName = this.files[0].name;
        let fileList: FileList = this.fileEvent;
        // var parent_id = 0;
        if (fileList.length > 0) {
            let file: File = fileList[0];
            let formData: FormData = new FormData();
            formData.append('file', file, file.name);
            formData.append('name', this.fileName);
            formData.append('file_module', 'File-Share');
            formData.append('parent_id', '0');
            this.roasterId = this.cookieService.get('roaster_id');
            formData.append('api_call', '/ro/' + this.roasterId + '/file-manager/files');
            formData.append('token', this.cookieService.get('Auth'));
            this.roasterService.uploadFiles(formData).subscribe((result) => {
                if (result['success'] == true) {
                    this.toastrService.success('The file ' + this.fileName + ' uploaded successfully');
                    this.fileService.getFilesandFolders();
                } else {
                    this.toastrService.error('Error while uploading the file');
                }
            });
        }
    }

    // Open Popup
    popupPrivew(e) {
        var PrivewPopup = document.querySelector('.priview-popup-fileshare');
        var SetImg = PrivewPopup.querySelector('.img');
        var url = e.target.getAttribute('src');
        SetImg.setAttribute('src', url);
        PrivewPopup.classList.add('active');
        document.body.classList.add('popup-open');

        setTimeout(function () {
            PrivewPopup.querySelector('.priview-popup-fileshare__img').classList.add('active');
        }, 50);
    }

    // Close Popup
    popupClose() {
        var PrivewPopup = document.querySelector('.priview-popup-fileshare');
        PrivewPopup.classList.remove('active');
        document.body.classList.remove('popup-open');
        PrivewPopup.querySelector('.priview-popup-fileshare__img').classList.remove('active');
    }

    createFolder() {
        if (this.folder_name == '' || this.folder_name == null || this.folder_name == undefined) {
            this.folderNameError = 'Please enter your password';
            document.getElementById('folder_name').style.border = '1px solid #D50000 ';
            setTimeout(() => {
                this.folderNameError = '';
            }, 3000);
        } else if (this.folder_descr == '' || this.folder_descr == null || this.folder_descr == undefined) {
            this.descriptionError = 'Please enter your password';
            document.getElementById('folder_descr').style.border = '1px solid #D50000 ';
            setTimeout(() => {
                this.descriptionError = '';
            }, 3000);
        } else {
            var data = {
                name: this.folder_name,
                description: this.folder_descr,
                file_module: 'File-Share',
            };

            this.roasterService.createFolder(this.roasterId, data).subscribe((data) => {
                console.log(data);
                if (data['success'] == true) {
                    if (this.invite == 'Invite people') {
                        this.file_id = data['result'].id;
                        var permission = document.getElementById('permission').innerHTML;
                        if (permission == 'Can view') {
                            this.permission = 'VIEW';
                        } else if (permission == 'Can edit') {
                            this.permission = 'EDIT';
                        }
                        var shareData = {
                            user_id: this.user_id_value,
                            permission: this.permission,
                            company_type: this.company_type,
                            company_id: this.company_id,
                        };
                        console.log(shareData);
                        this.roasterService.shareFolder(this.roasterId, this.file_id, shareData).subscribe((res) => {
                            if (res['success'] == true) {
                                console.log(data);
                                this.fileService.getFilesandFolders();

                                this.toastrService.success('New folder ' + this.folder_name + ' has been created.');

                                this.folder_name = '';
                                this.folder_descr = '';
                                this.selectedOption = '';
                            } else {
                                console.log(data);
                                this.toastrService.error('Error! while sharing the created folder');
                            }
                        });
                    } else {
                        console.log(data);
                        // Calling the Grade info component by creating object of the component and accessing its methods

                        // let callFileandFolders = new MyfilesComponent(this.router,this.cookieService,this.dashboard,this.roasterService,this.toastrService,this.fileService,this.modalService);
                        // callFileandFolders.getFilesandFolders();
                        // location.reload();

                        this.fileService.getFilesandFolders();

                        this.toastrService.success('New folder ' + this.folder_name + ' has been created.');

                        this.folder_name = '';
                        this.folder_descr = '';
                        this.selectedOption = '';
                        this.invite = 'Invite people';
                        $('.custom-radio input[type="radio"]').on('change', function () {
                            var $this = $(this);
                            var $value = $(this).val();

                            if ($this.is(':checked')) {
                                $(this).parents('.custom-radio-container').find('.custom-radio').removeClass('active');
                                $(this).parents('.custom-radio').addClass('active');

                                if ($value == 'Only me') {
                                    $(this).parents('#createfolder').find('.invite-to').slideUp();
                                } else {
                                    $(this).parents('#createfolder').find('.invite-to').slideDown();
                                }
                            }
                        });
                    }
                } else {
                    this.toastrService.error('Error while creating Folder.');
                }
            });
        }
    }
}
