import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { GlobalsService, ReviewsService, UserserviceService } from '@services';
import { RoasterserviceService } from '@services';
import { OrganizationType } from '@enums';

@Component({
    selector: 'app-sewn-reviews',
    templateUrl: './reviews.component.html',
    styleUrls: ['./reviews.component.scss'],
})
export class ReviewsComponent implements OnInit {
    roasterId: any;
    reviews: any = [];
    isLoading?: boolean;
    summary: any;
    average: any;
    constructor(
        public globals: GlobalsService,
        private cookieService: CookieService,
        public userSrv: UserserviceService,
        private reviewRatingService: ReviewsService,
    ) {}

    ngOnInit(): void {
        this.roasterId = this.cookieService.get('roaster_id');
        this.getReviews();
    }

    getReviews(): void {
        this.isLoading = true;

        this.reviewRatingService.getReviews(this.roasterId, OrganizationType.ROASTER, {}).subscribe((res: any) => {
            if (res.success) {
                this.isLoading = false;
                this.reviews = res.result ? res.result : [];
            }
        });

        this.userSrv.getReviewsSummary(this.roasterId).subscribe((res: any) => {
            if (res.success) {
                this.summary = res.result.summary;
                this.average = res.result.average;
            }
        });
    }
}
