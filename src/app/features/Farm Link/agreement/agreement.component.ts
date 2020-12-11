// AUTHOR : Vijaysimhareddy
// PAGE DESCRIPTION : This page contains functions of  Orders List,Search and Filters.

import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import {DashboardserviceService} from 'src/services/dashboard/dashboardservice.service';
import { DataTableDirective, DataTablesModule } from 'angular-datatables';
import { data } from 'jquery';
import { RoasterserviceService } from 'src/services/roasters/roasterservice.service';
import { ToastrService } from 'ngx-toastr';
import { GlobalsService } from 'src/services/globals.service';
import { RoasteryProfileService } from '../../roastery-profile/roastery-profile.service';

import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
@Component({
  selector: 'app-agreement',
  templateUrl: './agreement.component.html',
  styleUrls: ['./agreement.component.css']
})
export class AgreementComponent implements OnInit {
	appLanguage: any;
	// agreementsActive: any;
	searchTerm:any ;
    constructor(public router: Router,
		public cookieService: CookieService,
		public dashboard: DashboardserviceService,
		public roasterService : RoasterserviceService,
		public toastrService : ToastrService,
		public roasteryProfileService : RoasteryProfileService,
		private modalService: BsModalService,
		public globals: GlobalsService) {
	
	}



     ngOnInit(): void {
      //Auth checking
      if (this.cookieService.get("Auth") == "") {
        this.router.navigate(["/auth/login"]);
	  }
	
	  this.language();

    }
 	language(){
        this.appLanguage = this.globals.languageJson;
        // this.agreementsActive++;
	}



	
	

	  

	  
	

	 
}