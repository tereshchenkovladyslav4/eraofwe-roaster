import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GlobalsService } from '@services';
import { CookieService } from 'ngx-cookie-service';
import { EstateProfileService } from './estate-profile.service';

@Component({
    selector: 'app-estate-profile',
    templateUrl: './estate-profile.component.html',
    styleUrls: ['./estate-profile.component.scss'],
})
export class EstateProfileComponent implements OnInit {
    breadItems = [{ label: 'home', routerLink: '/' }, { label: 'Estate Profile' }];
    tabIndex: number;
    estateId: any;

    constructor(
        public profileCreationService: EstateProfileService,
        public globals: GlobalsService,
        public cookieService: CookieService,
        private route: ActivatedRoute,
    ) {
        this.tabIndex = 0;
        this.estateId = this.route.snapshot.params?.id || ''; // 23
        this.profileCreationService.estateProfile(this.estateId);
    }

    ngOnInit(): void {}
}