import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { GlobalsService } from '@services';

@Component({
    selector: 'app-myorders',
    templateUrl: './myorders.component.html',
    styleUrls: ['./myorders.component.css'],
})
export class MyordersComponent implements OnInit {
    appLanguage?: any;
    myOrdersActive: any = 0;

    constructor(public router: Router, public cookieService: CookieService, public globals: GlobalsService) {}

    ngOnInit(): void {
        //Auth checking
        if (this.cookieService.get('Auth') == '') {
            this.router.navigate(['/auth/login']);
        }

        this.language();
    }
    language() {
        this.appLanguage = this.globals.languageJson;
        this.myOrdersActive++;
    }
}
