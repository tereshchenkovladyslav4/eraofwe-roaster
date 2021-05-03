import { Component, OnDestroy, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AuthService, CoffeeLabService } from '@services';
import { ActivatedRoute } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { takeUntil } from 'rxjs/operators';
import { Subject, Subscription } from 'rxjs';

@Component({
    selector: 'app-coffee-recipes-view',
    templateUrl: './coffee-recipes-view.component.html',
    styleUrls: ['./coffee-recipes-view.component.scss'],
})
export class CoffeeRecipesViewComponent implements OnInit, OnDestroy {
    destroy$: Subject<boolean> = new Subject<boolean>();
    isAvailableTranslation?: string;
    organizationId: any;
    label?: string;
    ingredientValue?: string;
    searchQuery = '';
    searchIngredient = '';
    coffeeRecipeData: any[] = [];
    isLoading = false;
    forumLanguage: string;
    forumDeleteSub: Subscription;
    translationsList: any[] = [
        {
            label: 'Yes',
            value: true,
        },
        {
            label: 'No',
            value: false,
        },
    ];

    labels: any[] = [
        {
            label: 'Easy',
            value: 'Easy',
        },
        {
            label: 'Intermediate',
            value: 'Intermediate',
        },
        {
            label: 'Hard',
            value: 'Hard',
        },
    ];
    orderList: any[] = [
        {
            label: 'Latest',
            value: 'latest',
        },
        {
            label: 'Oldest',
            value: 'oldest',
        },
    ];
    selectedOrder = 'latest';
    pageDesc: string | undefined;

    constructor(
        private toastService: ToastrService,
        private activateRoute: ActivatedRoute,
        private coffeeLab: CoffeeLabService,
        private cookieService: CookieService,
        public authService: AuthService,
    ) {
        this.pageDesc = this.activateRoute.snapshot.routeConfig?.path;
    }

    ngOnInit(): void {
        this.organizationId = +this.cookieService.get('roaster_id');
        this.coffeeLab.forumLanguage.pipe(takeUntil(this.destroy$)).subscribe((language) => {
            this.forumLanguage = language;
            this.getCoffeeRecipesData();
        });
        this.forumDeleteSub = this.coffeeLab.forumDeleteEvent.subscribe(() => {
            this.getCoffeeRecipesData();
        });
    }

    getCoffeeRecipesData(): void {
        this.isLoading = true;
        const params = {
            query: this.searchQuery,
            ingredient: this.searchIngredient,
            translations_available: this.isAvailableTranslation,
            sort_by: 'created_at',
            sort_order: this.selectedOrder === 'latest' ? 'desc' : 'asc',
            level: this.label?.toLowerCase(),
        };
        if (this.pageDesc === 'saved-posts') {
            this.coffeeLab.getSavedForumList('recipe').subscribe((res) => {
                if (res.success) {
                    this.coffeeRecipeData = res.result;
                    this.coffeeRecipeData.map((item) => {
                        item.description = this.getJustText(item.description);
                        return item;
                    });
                } else {
                    this.toastService.error('Cannot get Recipes data');
                }
                this.isLoading = false;
            });
        } else if (this.pageDesc === 'my-posts') {
            this.coffeeLab.getMyForumList('recipe').subscribe((res) => {
                if (res.success) {
                    this.coffeeRecipeData = res.result;
                    this.coffeeRecipeData.map((item) => {
                        item.description = this.getJustText(item.description);
                        return item;
                    });
                } else {
                    this.toastService.error('Cannot get Recipes data');
                }
                this.isLoading = false;
            });
        } else {
            this.coffeeLab.getFOrganizationForumList('recipe', params, this.forumLanguage).subscribe((res) => {
                if (res.success) {
                    console.log('response----->>>>>', res);
                    if (res.result) {
                        this.coffeeRecipeData = res.result;
                        this.coffeeRecipeData.map((item) => {
                            item.description = this.getJustText(item.description);
                            return item;
                        });
                    }
                    console.log('coffeeRecipeData Data---->>>', this.coffeeRecipeData);
                } else {
                    this.toastService.error('Cannot get Recipes data');
                }
                this.isLoading = false;
            });
        }
    }

    getJustText(content: any) {
        const contentElement = document.createElement('div');
        contentElement.innerHTML = content;
        const images = contentElement.querySelectorAll('img');
        images.forEach((image) => {
            image.parentNode.removeChild(image);
        });
        return contentElement.innerHTML;
    }

    ngOnDestroy(): void {
        this.destroy$.next(true);
        this.destroy$.unsubscribe();
        this.forumDeleteSub?.unsubscribe();
    }
}
