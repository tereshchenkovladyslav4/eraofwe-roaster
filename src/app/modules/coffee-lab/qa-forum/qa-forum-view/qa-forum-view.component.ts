import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService, CoffeeLabService } from '@services';
import { ToastrService } from 'ngx-toastr';
import { Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: 'app-qa-forum-view',
    templateUrl: './qa-forum-view.component.html',
    styleUrls: ['./qa-forum-view.component.scss'],
})
export class QaForumViewComponent implements OnInit, OnDestroy {
    viewModeItems: any[] = [{ value: 'list' }, { value: 'grid' }];
    viewMode = 'list';
    sortOptions = [
        { label: 'Latest', value: 'latest' },
        { label: 'Most Answered', value: 'most_answered' },
        { label: 'Oldest', value: 'oldest' },
    ];
    filterOptions = [
        {
            label: 'Coffee experts',
            value: false,
        },
        {
            label: 'End consumers',
            value: true,
        },
    ];
    sortBy = 'latest';
    filterBy: any;
    questions: any[] = [];
    isLoading = false;
    keyword = '';
    destroy$: Subject<boolean> = new Subject<boolean>();
    forumLanguage: string;

    constructor(
        private coffeeLabService: CoffeeLabService,
        private toastService: ToastrService,
        public authService: AuthService,
    ) {}

    ngOnInit(): void {
        window.scroll(0, 0);
        this.coffeeLabService.forumLanguage.pipe(takeUntil(this.destroy$)).subscribe((language) => {
            this.forumLanguage = language;
            this.getQuestions();
        });
        this.coffeeLabService.forumDeleteEvent.pipe(takeUntil(this.destroy$)).subscribe(() => {
            this.getQuestions();
        });
    }

    getQuestions(): void {
        const params = {
            query: this.keyword,
            is_consumer: this.filterBy,
            sort_by: this.sortBy === 'most_answered' ? 'most_answered' : 'posted_at',
            sort_order: this.sortBy === 'most_answered' ? 'desc' : this.sortBy === 'latest' ? 'desc' : 'asc',
            publish: true,
            page: 1,
            per_page: 10000,
        };
        this.isLoading = true;
        this.coffeeLabService.getForumList('question', params, this.forumLanguage).subscribe((res: any) => {
            this.isLoading = false;
            console.log('questions >>>', res);
            if (res.success) {
                this.questions = res.result?.questions;
            } else {
                this.toastService.error('Cannot get forum data');
            }
        });
    }

    ngOnDestroy(): void {
        this.destroy$.next(true);
        this.destroy$.unsubscribe();
    }
}
