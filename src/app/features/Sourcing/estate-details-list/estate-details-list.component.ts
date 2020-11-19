import { Component, OnInit, TemplateRef} from '@angular/core';
import {GlobalsService} from 'src/services/globals.service';
import { ActivatedRoute } from '@angular/router';
import { SourcingService } from '../sourcing.service';
import { CookieService } from 'ngx-cookie-service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { RoasteryProfileService } from '../../roastery-profile/roastery-profile.service';
declare var $:any;
@Component({
  selector: 'app-estate-details-list',
  templateUrl: './estate-details-list.component.html',
  styleUrls: ['./estate-details-list.component.css']
})
export class EstateDetailsListComponent implements OnInit {
  appLanguage?: any;
  estateDetailsActive:any=0;

  modalRef: BsModalRef;
  public coffeedata: any[] = [
		{  estatename: 'Finca La Pampa', name: 'Organic washed Micro-lot',origin:'Colombia', species: 'Bourbon', price: '$7.4 USD / kg',quantity:'287 bags','image':'/assets/images/sourcing-image1.jpg',score:'84.5' },
		{  estatename: 'Gesha', name: 'Blend washed',origin:'Colombia',species: 'Bourbon', price: '$5.53USD / kg',quantity:'297 bags','image':'/assets/images/sourcing-image3.jpg',score:'88.0' },
		{  estatename: 'Finca La Toboba', name: 'FTO blend',origin:'Ethopia', species: 'Bourbon', price: '$8.92 USD /kg',quantity:'567 bags','image':'/assets/images/sourcing-image7.jpg',score:'81.5' },
		// {  estatename: 'Asoproaaa', name: 'Mebratu', origin:'Brazil',species: 'Bourbon', price: '$7.4 USD / kg',quantity:'953 bags','image':'/assets/images/sourcing-image5.jpg',score:'85.4' },
		// {  estatename: 'Cafe Directo', name: 'FTO Semi washed', origin:'Ethopia',species: 'Bourbon', price: '$5.6 USD / kg',quantity:'110 bags','image':'/assets/images/sourcing-image4.jpg',score:'82' },
		// {  estatename: 'La Isabela', name: 'Blend1',origin:'Colombia', species: 'Bourbon', price: '$8.92 USD /kg',quantity:'450 bags','image':'/assets/images/sourcing-image8.jpg',score:'84' }
  ];
  roaster_id: string;
  blogResult: string;
  countryValue: any;
  flavourName: any;
  constructor(private modalService:BsModalService,public globals: GlobalsService, private route : ActivatedRoute , public sourcing : SourcingService, public cookieService : CookieService,public profile:RoasteryProfileService) {
    this.route.queryParams.subscribe(params => {
      this.sourcing.detailList = params['listData'];
      this.sourcing.estateDetailList();
	  this.sourcing.lotsList();
    this.sourcing.flavourprofileList();
    this.sourcing.greenCoffee();
  });
  this.roaster_id = this.cookieService.get('roaster_id');
   }
   openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }
  ngOnInit(): void {
    this.language();
    this.blogResult = decodeURIComponent(this.route.snapshot.queryParams['dataLots']);
  
    
  }
  ngAfterViewInit(){
    if(this.blogResult == "true"){
      $('#nav-profile-tab3')[0].click();
      }
  }

  language(){
    this.appLanguage = this.globals.languageJson;
    this.estateDetailsActive++;
  }
  GetCountry(data:any){
    // console.log(data.toUpperCase());
    this.countryValue=this.profile.countryList.find(con =>con.isoCode == data.toUpperCase());
    // console.log(this.countryValue);
    return this.countryValue.name;
    // console.log(this.countryValue.name);
  }
  getFlavourName(flavourid:any){
		if(this.sourcing.flavourList){
		this.flavourName = this.sourcing.flavourList.find(flavour => flavour.id == flavourid).name;
		return this.flavourName;
		}
	}
}
