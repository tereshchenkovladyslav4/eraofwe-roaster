import { Component, OnInit } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Location } from '@angular/common';
@Component({
    selector: 'app-onboard-customers',
    templateUrl: './onboard-customers.component.html',
    styleUrls: ['./onboard-customers.component.scss'],
})
export class OnboardCustomersComponent implements OnInit {
    buttonValue: string;

    constructor(private router: Router, private cookieService: CookieService, public location: Location) {}

    ngOnInit(): void {
        // Auth checking
        if (this.cookieService.get('Auth') === '') {
            this.router.navigate(['/auth/login']);
        }
    }
}
