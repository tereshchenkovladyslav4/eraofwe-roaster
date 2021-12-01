import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PostType } from '@enums';
import { environment } from '@env/environment';
import { AuthService, ChatHandlerService, CoffeeLabService, UserService } from '@services';
import { ToastrService } from 'ngx-toastr';
import { MessageService } from 'primeng/api';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
@Component({
    selector: 'app-aticle-details',
    templateUrl: './article-detail.component.html',
    styleUrls: ['./article-detail.component.scss'],
    providers: [MessageService],
})
export class ArticleDetailComponent implements OnInit, OnDestroy {
    readonly PostType = PostType;
    relatedData: any[] = [];
    detailsData: any;
    idOrSlug: string | number = '';
    commentData: any[] = [];
    allComments: any[] = [];
    showCommentBtn = true;
    isLoading = true;
    destroy$: Subject<boolean> = new Subject<boolean>();
    buttonList = [{ button: 'Roasting' }, { button: 'Coffee grinding' }, { button: 'Milling' }, { button: 'Brewing' }];
    comment: string;
    language: string;
    stickySecData: any;
    orginalUserData: any;
    isSaveArticle = false;
    isMyPost = false;
    isSavedPost = false;
    isLikedBtn = true;
    showToaster = false;
    constructor(
        public coffeeLabService: CoffeeLabService,
        public authService: AuthService,
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private messageService: MessageService,
        private toastrService: ToastrService,
        private userService: UserService,
        private chatHandler: ChatHandlerService,
    ) {
        this.activatedRoute.params.subscribe((params) => {
            this.idOrSlug = params.idOrSlug;
            const language = this.activatedRoute.snapshot.queryParamMap.get('language');
            this.language = language || this.coffeeLabService.currentForumLanguage;
            this.getDetails(true);
        });
        this.activatedRoute.queryParams.subscribe((queryParams) => {
            this.isMyPost = queryParams.isMyPost;
            this.isSavedPost = queryParams.isSavedPost;
        });
    }

    ngOnInit(): void {
        window.scroll(0, 0);
        this.coffeeLabService.forumDeleteEvent.pipe(takeUntil(this.destroy$)).subscribe(() => {
            this.router.navigate(['/coffee-lab/overview/articles']);
        });
    }

    getArticleList(): any {
        const params = {
            count: 11,
        };
        this.relatedData = [];
        this.coffeeLabService.getPopularList('article', params).subscribe((res: any) => {
            if (res.success) {
                this.relatedData = res.result.filter((item) => item.id !== this.detailsData.id);
                this.relatedData = this.relatedData.slice(0, 10);
            }
        });
    }

    onShare(): void {
        this.coffeeLabService.copyContext(`${environment.adminWeb}/coffee-lab/articles/${this.detailsData.slug}`);
    }

    getDetails(isReloading: boolean): void {
        this.isLoading = isReloading;
        this.coffeeLabService.getForumDetails('article', this.idOrSlug).subscribe((res: any) => {
            if (res.success) {
                this.detailsData = res.result;
                this.getArticleList();
                this.isSaveArticle = this.detailsData.is_saved;
                if (this.detailsData?.original_article_state && this.detailsData?.original_article_state === 'ACTIVE') {
                    this.getOriginalUserDetail(this.detailsData.original_article);
                }
                this.getUserDetail(this.detailsData);
                this.getCommentsData();
                if (res.result.original_article_id) {
                    this.messageService.clear();
                    this.messageService.add({
                        key: 'translate',
                        severity: 'success',
                        closable: false,
                    });
                }
                this.isLoading = false;
            } else {
                this.toastrService.error('Cannot get detail data');
            }
        });
    }

    getCommentsData(): void {
        this.coffeeLabService.getCommentList('article', this.detailsData.slug).subscribe((res: any) => {
            if (res.success) {
                this.allComments = res.result;
                this.commentData = this.allComments?.slice(0, 3);
                if (this.allComments?.length > 3) {
                    this.showCommentBtn = true;
                } else {
                    this.showCommentBtn = false;
                }
            }
        });
    }

    onRealtedRoute(slug: string, isOrginal: boolean, language?: string) {
        if (this.isMyPost) {
            this.router.navigate(['/coffee-lab/articles/' + slug], {
                queryParams: {
                    isMyPost: true,
                },
            });
        } else if (this.isSavedPost) {
            this.router.navigate(['/coffee-lab/articles/' + slug], {
                queryParams: {
                    isSavedPost: true,
                },
            });
        } else {
            this.router.navigateByUrl('/coffee-lab/articles/' + slug);
        }
        if (isOrginal) {
            this.coffeeLabService.forumLanguage.next(language);
        }
        window.scrollTo(0, 0);
    }

    viewAllComments() {
        this.commentData = this.allComments;
        this.showCommentBtn = false;
    }

    getOriginalUserDetail(userDetails: any): void {
        this.userService.getUserDetail(userDetails.user_id, userDetails.organisation_type).subscribe((res) => {
            if (res.success) {
                this.orginalUserData = res.result;
            }
        });
    }

    getUserDetail(userDetails: any): void {
        this.userService.getUserDetail(userDetails.user_id, userDetails.organisation_type).subscribe((res) => {
            if (res.success) {
                this.stickySecData = res.result;
            }
        });
    }

    onPost(): void {
        const data = {
            comment: this.comment,
            status: 'PUBLISHED',
            language: this.language,
        };
        this.coffeeLabService.postComment('article', this.detailsData.id, data).subscribe((res: any) => {
            if (res.success) {
                this.toastrService.success('You have posted a comment successfully.');
                this.comment = '';
                this.getCommentsData();
            } else {
                this.toastrService.error('Failed to post comment.');
            }
        });
    }

    ngOnDestroy(): void {
        this.destroy$.next(true);
        this.destroy$.unsubscribe();
    }

    onFocusCommentBox() {
        document.getElementById('text-article-focus').focus();
    }

    onSave(articleId: number): void {
        this.coffeeLabService.saveForum('article', articleId).subscribe((res: any) => {
            if (res.success) {
                this.isSaveArticle = true;
                this.toastrService.success('Successfully saved');
            } else {
                this.toastrService.error('Error while save post');
            }
        });
    }

    onSameSave(articleId: number) {
        this.coffeeLabService.unSaveFormByType('article', articleId).subscribe((res: any) => {
            if (res.success) {
                this.toastrService.success(`You have removed the article successfully from saved posts.`);
                this.isSaveArticle = false;
            } else {
                this.toastrService.error(`Failed to remmove a article from saved posts.`);
            }
        });
    }

    openChat() {
        this.chatHandler.openChatThread({
            user_id: this.stickySecData.id,
            org_type: this.stickySecData.organization_type.toLowerCase(),
            org_id: this.stickySecData.organization_id,
        });
    }

    onBack() {
        if (this.isMyPost) {
            this.router.navigateByUrl('/coffee-lab/overview/my-posts/article');
        } else if (this.isSavedPost) {
            this.router.navigateByUrl('/coffee-lab/overview/saved-posts/article');
        } else {
            this.router.navigateByUrl('/coffee-lab/overview/articles');
        }
    }

    onLike(articleId: number) {
        this.isLikedBtn = false;
        this.coffeeLabService.updateLike('article', articleId).subscribe((res) => {
            if (res.success) {
                this.detailsData.is_liked = true;
                this.detailsData.likes = this.detailsData.likes + 1;
                this.isLikedBtn = true;
            }
        });
    }

    onUnLike(articleId: number) {
        this.isLikedBtn = false;
        this.coffeeLabService.updateUnLike('article', articleId).subscribe((res) => {
            if (res.success) {
                this.detailsData.is_liked = false;
                this.detailsData.likes = this.detailsData.likes - 1;
                this.isLikedBtn = true;
            }
        });
    }

    toastCalled(event) {
        if (event) {
            this.showToaster = true;
        }
    }
}
