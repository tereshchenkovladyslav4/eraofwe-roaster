import { Component, OnInit,TemplateRef, ViewChild } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { RoasteryProfileService } from '../../../roastery-profile/roastery-profile.service';
import { Router, ActivatedRoute } from '@angular/router';
import {GlobalsService} from 'src/services/globals.service';
import { RoasterserviceService } from 'src/services/roasters/roasterservice.service';
import { SourcingService } from '../../sourcing.service';
import { CookieService } from 'ngx-cookie-service';
import { Toast, ToastrService } from 'ngx-toastr';
import { UserserviceService } from 'src/services/users/userservice.service';


@Component({
  selector: 'app-available-confirm-order',
  templateUrl: './available-confirm-order.component.html',
  styleUrls: ['./available-confirm-order.component.css']
})
export class AvailableConfirmOrderComponent implements OnInit {
  quantity:any;
  quantity1:any;
  price:number=450;
  confirmOrderError:any;
  modalRef: BsModalRef;
  appLanguage?: any;


  country : string = '';
state: string = '';
address1 : string;
address2 : string;
zipcode: string;
city: string;
countryError: string;
addressError : string;
zipError:string;
cityError:string;
service: string = "Import & Delivery service";
serviceAmount: number = 4500;
available_bags:number = 266;
terms:boolean = false;
termError:string;
availableConfirmActive:any=0;
  gc_id: any;
  roaster_id: string;
  shippingAddress_id: any;
  billingAddress_id: any;
  estate_id: any;
  addressArray: any ;
  ship_unit_price: any;
  min_quantity: any;

constructor(private modalService: BsModalService,
  public confirmOrderService : RoasteryProfileService,
  public router:Router,
  public globals: GlobalsService,
  private route : ActivatedRoute,
  public sourcing : SourcingService,
  private cookieService : CookieService,
  private toastrService : ToastrService,
  private roasterService : RoasterserviceService,
  private userService : UserserviceService,
  public  profileservice  : RoasteryProfileService
  ) {
    this.roaster_id = this.cookieService.get('roaster_id');

    this.route.queryParams.subscribe(params => {
      this.sourcing.harvestData = params['gc_id'];

      this.sourcing.availableDetailList();
     
      });
   }
@ViewChild('confirmtemplate') private confirmtemplate: any;

openModal(template: TemplateRef<any>) {
  this.modalRef = this.modalService.show(template);

}
ngOnInit(): void {
  this.quantity="";
  this.quantity1="";
  this.confirmOrderError="";
  this.countryError= "";
  this.addressError = "";
  this.zipError= "";
  this.cityError="";
  this.termError="";
  // this.price="$450";
  this.language();  
}
language(){
	this.appLanguage = this.globals.languageJson;
	this.availableConfirmActive++;
  }

placeOrder(){
  if(this.quantity=="" || this.quantity == null || this.quantity == undefined){
    this.confirmOrderError = "Please enter quantity";
    document.getElementById('quantityId').style.border = "1px solid #D50000";
    setTimeout(() => {
      this.confirmOrderError = "";
      document.getElementById('quantityId').style.border = "1px solid #d6d6d6 ";
    }, 3000);
  }
  else if(this.quantity>this.available_bags){
	this.confirmOrderError = "Please enter quantity in range of available for sale";
    document.getElementById('quantityId').style.border = "1px solid #D50000";
    setTimeout(() => {
      this.confirmOrderError = "";
      document.getElementById('quantityId').style.border = "1px solid #d6d6d6 ";
    }, 3000);

  }
  else if(this.terms == false){
	this.termError="Please accept the terms and conditions";
	setTimeout(() => {
		this.termError = "";
	  }, 3000);
  }
  else{
  this.openModal(this.confirmtemplate);
  }
}
placeOrderMob(){
  if(this.quantity1=="" || this.quantity1 == null || this.quantity1 == undefined){
    this.confirmOrderError = "Please enter quantity";
    document.getElementById('quantity_id').style.border = "1px solid #D50000";
    setTimeout(() => {
      this.confirmOrderError = "";
      document.getElementById('quantity_id').style.border = "1px solid #d6d6d6 ";
    }, 3000);
  }
  else{
  this.openModal(this.confirmtemplate);
  }
}
editAddress(){
  document.getElementById("edit-shipping").style.display = "none";
  document.getElementById("form-address").style.display = "block";

}
saveAddress(){
  if(this.country=="" || this.country == null || this.country == undefined){
    this.countryError= "Please select your country";
    document.getElementById('country').style.border = "1px solid #D50000 ";
    setTimeout(() => {
      this.countryError = "";
      document.getElementById('country').style.border = "1px solid #d6d6d6 ";
    }, 3000);
  }
  else if(this.address1=="" || this.address1 == null || this.address1 == undefined){
    this.addressError = "Please enter address";
    document.getElementById('address1').style.border = "1px solid #D50000 ";
    setTimeout(() => {
      this.addressError = "";
      document.getElementById('address1').style.border = "1px solid #d6d6d6 ";
    }, 3000);
  }
  else if(this.city=="" || this.city == null || this.city == undefined){
    this.cityError = "Please enter city";
    document.getElementById('city').style.border = "1px solid #D50000 ";
    setTimeout(() => {
      this.cityError = "";
      document.getElementById('city').style.border = "1px solid #d6d6d6 ";
    }, 3000);
  }
  else if(this.zipcode=="" || this.zipcode == null || this.zipcode == undefined){
    this.zipError = "Please enter zipcode";
    document.getElementById('zipcode').style.border = "1px solid #D50000 ";
    setTimeout(() => {
      this.zipError = "";
      document.getElementById('zipcode').style.border = "1px solid #d6d6d6 ";
    }, 3000);
  }
  else{

    var data = {
      "type": "shipping",
      "address_line1": this.address1,
      "address_line2": this.address2,
      "city": this.city,
      "state": this.state,
      "country": this.country,
      "zipcode": this.zipcode
    }
    this.userService.addAddresses(this.roaster_id,data).subscribe(
      response => {
        if(response['success']==true){
          this.shippingAddress_id = response['result'].id;
          this.toastrService.success("Address has been added")
        }
        else{
          this.toastrService.error("Error while adding the address")
        }
      }
    )
    document.getElementById("edit-shipping").style.display = "block";
    document.getElementById("form-address").style.display = "none";
  }
}

//  Function Name :Country Selection .
// Description: To select a country.

changeCountry() {
  // console.log("the selected country is : " + this.country);
  this.confirmOrderService.changeCountry(this.country);
}
onKeyPress(event: any) {
  if (event.target.value == "") {
    document.getElementById(event.target.id).style.border = "1px solid #D50000";
  } else {
    document.getElementById(event.target.id).style.border = "1px solid #d6d6d6";
  }
}


done(){

 
  var data = {
    'quantity_count' : this.quantity,
    'shipping_address_id' : this.shippingAddress_id,
    'billing_address_id' : this.shippingAddress_id,
    'is_fully_serviced_delivery' : this.service == "Import & Delivery service" ? true : false
  }
this.roasterService.placeOrder(this.roaster_id,this.sourcing.harvestData,data).subscribe(
data => {
  if(data['success'] == true ){
    this.toastrService.success("Order has been placed Successfully");

    this.router.navigate(["/features/order-placed"]);
  }
  else{
    this.toastrService.error("Error while Placing the order");
    
  }
}
)
}

ngAfterViewInit(){
  if(this.service == "Import & Delivery service"){
    this.userService.getShippingInfo(this.roaster_id,this.sourcing.estate_id).subscribe(
      response => {
        console.log(response);
        this.addressArray = response['result']['warehouse_address'];
        console.log(this.addressArray);
        this.address1 = this.addressArray.address_line1;
        this.address2 = this.addressArray.address_line2;
        this.city = this.addressArray.city;
        this.country = this.profileservice.countryList.find(con => con.isoCode == this.addressArray.country.toUpperCase()).name;
        this.state = this.addressArray.state;
        this.zipcode = this.addressArray.zipcode;
        this.ship_unit_price = response['result'].unit_price;
        this.min_quantity = response['result'].minimum_quantity;
        
      }
    )
  }
  else{
    this.userService.getAddresses(this.roaster_id).subscribe(
      response => {
        this.addressArray = response['result'][0];
        this.address1 = this.addressArray.address_line1;
        this.address2 = this.addressArray.address_line2;
        this.city = this.addressArray.city;
        this.country = this.profileservice.countryList.find(con => con.isoCode == this.addressArray.country.toUpperCase()).name;
        this.state = this.addressArray.state;
        this.zipcode = this.addressArray.zipcode;
      }
    )
  }
}


}