import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService, CoffeeLabService, GoogletranslateService } from '@services';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { insertAltAttr, maxWordCountValidator } from '@utils';

@Component({
    selector: 'app-translate-article',
    templateUrl: './translate-article.component.html',
    styleUrls: ['./translate-article.component.scss'],
})
export class TranslateArticleComponent implements OnInit {
    articleId: any;
    draftId: any;
    article: any;
    isLoading = false;
    articleForm: FormGroup;
    articleFormOriginal: FormGroup;
    isUploadingImage = false;
    imageIdList = [];
    isPosting = false;
    isCopying = false;
    coverImage: any;
    coverImageUrl: any;
    isCoverImageUploaded = false;
    coverImageId: any;
    copiedCoverImageId: any;
    copiedCoverImageUrl: any;
    images = [];
    selectedTabArticle = 'sv';
    isTranslationArticle = [];

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private coffeeLabService: CoffeeLabService,
        private toastrService: ToastrService,
        private formBuilder: FormBuilder,
        private location: Location,
        public authService: AuthService,
        private gtrans: GoogletranslateService,
    ) {
        this.articleForm = this.formBuilder.group({
            language: [''],
            title: ['', Validators.compose([Validators.required])],
            subtitle: ['', Validators.compose([Validators.required, maxWordCountValidator(30)])],
            content: [''],
        });
    }

    ngOnInit(): void {
        this.articleFormOriginal = this.formBuilder.group({
            title: [''],
            subtitle: [''],
        });
        this.articleId = this.route.snapshot.queryParamMap.get('origin_id');
        if (!this.articleId) {
            this.location.back();
        } else {
            this.getArticleById();
        }
        this.route.queryParams.subscribe(() => {
            this.draftId = this.route.snapshot.queryParamMap.get('draft_id');
            if (this.draftId) {
                this.getDraftById();
            }
        });
    }

    getArticleById(): void {
        this.isLoading = true;
        this.coffeeLabService.getForumDetails('article', this.articleId).subscribe((res: any) => {
            this.isLoading = false;
            if (res.success) {
                this.article = res.result;
                this.articleFormOriginal.patchValue(res.result);
                this.coverImageUrl = res.result.cover_image_url;
                this.article.translated_articles.forEach((element) => {
                    this.isTranslationArticle.push(element.language);
                });
                if (this.article.user_id !== this.authService.currentUser.id) {
                    this.copyCoverImage('noCopy');
                }
                this.handleChange();
                this.articleFormOriginal.disable();
            } else {
                this.toastrService.error('Error while get article');
                this.router.navigate(['/coffee-lab']);
            }
        });
    }

    handleChange(e?) {
        this.selectedTabArticle = e?.index === 1 ? 'es' : e?.index === 2 ? 'pt' : 'sv';
        const translateData = [this.article.title, this.article.subtitle, this.article.content];
        this.gtrans.translateCoffeeLab(translateData, this.selectedTabArticle).subscribe((translatedOutput: any) => {
            this.articleForm.patchValue({
                title: translatedOutput[0].translatedText,
                subtitle: translatedOutput[1].translatedText,
                content: translatedOutput[2].translatedText,
            });
        });
    }

    getDraftById(): void {
        this.coffeeLabService.getForumDetails('article', this.draftId).subscribe((res: any) => {
            if (res.success) {
                this.coverImageUrl = res.result.cover_image_url;
                this.coverImageId = res.result.cover_image_id;
                this.isCoverImageUploaded = true;
                this.images = res.result.images ?? [];
                this.articleForm.patchValue(res.result);
            } else {
                this.toastrService.error('Error while get draft');
            }
        });
    }

    onFileChange(event: any) {
        if (event.target.files?.length) {
            this.isCoverImageUploaded = false;
            this.coverImage = event.target.files[0];
            const reader = new FileReader();
            reader.readAsDataURL(this.coverImage);
            reader.onload = () => {
                this.coverImageUrl = reader.result;
            };
            this.coffeeLabService.uploadFile(this.coverImage, 'cl-articles').subscribe((res) => {
                if (res.result) {
                    this.coverImageId = res.result.id;
                    this.isCoverImageUploaded = true;
                    this.toastrService.success('Cover image has been successfully uploaded.');
                } else {
                    this.toastrService.error('failed to upload cover image.');
                    this.coverImage = null;
                    this.coverImageId = null;
                    this.coverImageUrl = null;
                    this.isCoverImageUploaded = false;
                }
            });
        }
    }

    onPost(status: string): void {
        this.articleForm.markAllAsTouched();
        if (this.articleForm.invalid) {
            return;
        }
        if (!this.articleForm.value.content && status === 'published') {
            this.toastrService.error('Please fill content.');
            return;
        }
        // if (this.article.user_id !== this.authService.currentUser.id) {
        //     if (!this.isCoverImageUploaded && status === 'published') {
        //         this.toastrService.error('Please upload cover image.');
        //         return;
        //     }
        // }

        this.isPosting = true;
        this.handlePost(status);
    }
    handlePost(status: string) {
        this.articleForm
            .get('content')
            .setValue(insertAltAttr(this.articleForm.value.content, `${this.articleForm.value.title} detail image`));
        let data: any = {
            ...this.articleForm.value,
            language: this.selectedTabArticle,
            status,
        };
        let coverImageId: number;
        if (this.article.user_id === this.authService.currentUser.id) {
            coverImageId = this.article.cover_image_id;
        } else {
            coverImageId = this.copiedCoverImageId;
        }
        data = {
            ...data,
            cover_image_id: coverImageId,
        };
        if (status === 'draft' && this.draftId) {
            this.coffeeLabService.updateForum('article', this.draftId, data).subscribe((res: any) => {
                this.isPosting = false;
                if (res.success) {
                    this.toastrService.success('You have updated a draft successfully.');
                    this.location.back();
                } else {
                    this.toastrService.error('Failed to update draft.');
                }
            });
        } else {
            this.coffeeLabService.translateForum('article', this.articleId, data).subscribe((res: any) => {
                this.isPosting = false;
                if (res.success) {
                    this.toastrService.success('You have posted a translated article successfully.');
                    this.router.navigate(['/coffee-lab/overview/articles']);
                } else {
                    this.toastrService.error('Failed to post translated article.');
                }
            });
        }
    }

    copyCoverImage(copy?: string) {
        if (this.isCopying) {
            return;
        }
        this.isCopying = true;
        this.coffeeLabService.copyFile(this.article.cover_image_id).subscribe((res: any) => {
            this.isCopying = false;
            if (res.success) {
                this.copiedCoverImageId = res.result.id;
                this.copiedCoverImageUrl = res.result.url;
                if (!copy) {
                    this.toastrService.success('Copied cover image successfully.');
                }
            } else {
                this.toastrService.error('Failed to copy cover image.');
            }
        });
    }
    pasteCoverImage() {
        this.coverImageUrl = this.copiedCoverImageUrl;
        this.coverImageId = this.copiedCoverImageId;
        this.isCoverImageUploaded = true;
    }

    deleteCoverImage(element: any) {
        this.coverImage = null;
        this.coverImageUrl = null;
        this.isCoverImageUploaded = false;
        this.coverImageId = null;
        element.value = '';
    }
}
