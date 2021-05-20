import { Component, Input, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { AuthService, CoffeeLabService } from '@services';

@Component({
    selector: 'app-questions',
    templateUrl: './questions.component.html',
    styleUrls: ['./questions.component.scss'],
})
export class QuestionsComponent implements OnInit {
    @Input() questions: any[] = [];
    @Input() viewMode = 'list';
    questionMenuItems: MenuItem[] = [];
    organizationId: any;
    pageDesc: string;

    constructor(
        private cookieService: CookieService,
        private router: Router,
        public coffeeLabService: CoffeeLabService,
        public authService: AuthService
    ) {
        this.pageDesc = this.router.url.split('/')[this.router.url.split('/').length - 2];
    }

    ngOnInit(): void {
        this.organizationId = +this.cookieService.get('roaster_id');
    }
}
