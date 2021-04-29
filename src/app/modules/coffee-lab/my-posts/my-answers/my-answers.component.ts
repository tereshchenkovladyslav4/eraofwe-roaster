import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CoffeeLabService } from '@services';
import { Subscription } from 'rxjs';
@Component({
    selector: 'app-my-answers',
    templateUrl: './my-answers.component.html',
    styleUrls: ['./my-answers.component.scss'],
})
export class MyAnswersComponent implements OnInit {
    answers: any[] = [];
    sortOptions = [
        { label: 'Latest', value: 'latest' },
        { label: 'Oldest', value: 'oldest' },
    ];
    sortBy = 'latest';
    pageDesc: string;
    isMyPostsPage = false;
    isLoading = false;
    forumDeleteSub: Subscription;

    constructor(private coffeeLabService: CoffeeLabService, private activateRoute: ActivatedRoute) {
        this.pageDesc = this.activateRoute.snapshot.routeConfig?.path;
    }

    ngOnInit(): void {
        this.getAnswers();
        if (this.pageDesc === 'my-posts') {
            this.isMyPostsPage = true;
        }
        this.forumDeleteSub = this.coffeeLabService.forumDeleteEvent.subscribe(() => {
            this.getAnswers();
        });
    }

    getAnswers(): void {
        this.isLoading = true;
        this.coffeeLabService.getMyForumList('answer').subscribe((res) => {
            this.answers = res.result.map((item) => {
                if (item.question_slug) {
                    const slug = 'slug';
                    const id = 'id';
                    item[slug] = item.question_slug;
                    item[id] = item.answer_id;
                }
                return item;
            });
            this.isLoading = false;
        });
    }
}
