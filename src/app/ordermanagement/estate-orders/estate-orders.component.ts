// AUTHOR : Sindhuja
// PAGE DESCRIPTION : This page contains functions of Estate Orders List,Search and Filters.
import { Component, OnInit, ViewChild } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { DashboardserviceService } from 'src/services/dashboard/dashboardservice.service';
import { DataTableDirective, DataTablesModule } from 'angular-datatables';
import { data } from 'jquery';
import { RoasterserviceService } from 'src/services/roasters/roasterservice.service';
import { ToastrService } from 'ngx-toastr';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { GlobalsService } from 'src/services/globals.service';

@Component({
	selector: 'app-estate-orders',
	templateUrl: './estate-orders.component.html',
	styleUrls: ['./estate-orders.component.css']
})
export class EstateOrdersComponent implements OnInit {
	estateterm: any;
	estatetermStatus: any;
	estatetermType: any;
	estatetermOrigin: any;
	displayNumbers: any;
	selected: Date[];
	rangeDates: any;
	showOrigin: boolean = true;
	showType: boolean = true;
	showStatus: boolean = true;
	showDisplay: boolean = true;
	searchTerm: any;
	odd: boolean = false;
	hideTable : boolean = false ; 

	@ViewChild(DataTableDirective, { static: false })
	datatableElement: DataTableDirective;
	showDateRange: any;

	@ViewChild('calendar')
	calendar: any;
	appLanguage: any;

	//dtInstance:DataTables.Api;

	// Static Estate Orders Data List
	public data: any;
	public mainData: any[];
	title = 'angulardatatables';
	dtOptions: DataTables.Settings = {
		language: { "search": '' }
	};
	estatetermOriginMob: any;
	showOriginMob: boolean = true;
	showTypeMob: boolean = true;
	showStatusMob: boolean = true;
	estatetermStatusMob: string;
	estatetermTypeMob: string;
	roasterId: any;
	estateOrdersActive:any =0;

	constructor(public router: Router,
		public cookieService: CookieService,
		public dashboard: DashboardserviceService,
		private roasterService: RoasterserviceService,
		private toastrService: ToastrService,
		public modalService: BsModalService,
		public global: GlobalsService) {
		this.roasterId = this.cookieService.get('roaster_id');
		this.data = {};
		this.data =
			[{
				"id": "1000",
				"estatename": "Finca La Pampa",
				"dataordered": "24 Jan 2020",
				"origin": "Colombia",
				"quantity": "-",
				"typeoforder": "Sample",
				"status": "Shipped",
				"species": "Bourbon",
				"price": "-"
			},
			{ id: '1001', estatename: 'Gesha', dataordered: '21 Jan 2020', origin: 'Ethopia', quantity: '297kg', typeoforder: 'Booked', status: 'Shipped', species: 'Bourbon', price: '-' },
			{ id: '1002', estatename: 'Finca La Toboba', dataordered: '22 Apr 2020', origin: 'Ethopia', quantity: '29kg', typeoforder: 'Booked', status: 'Order confirmed', species: 'Bourbon', price: '$1,480' },
			{ id: '1003', estatename: 'Asoproaaa', dataordered: '24 Apr 2020', origin: 'Ethopia', quantity: '-', typeoforder: 'Booked', status: 'Order confirmed', species: 'Bourbon', price: '-' },
			{ id: '1004', estatename: 'Cafe Directo', dataordered: '25 May 2020', origin: 'Colombia', quantity: '-', typeoforder: 'Pre-Booked', status: 'Payment', species: 'Bourbon', price: '$1,480' },
			{ id: '1005', estatename: 'La Isabela', dataordered: '26 May 2020', origin: 'Colombia', quantity: '-', typeoforder: 'Pre-Booked', status: 'In transit', species: 'Bourbon', price: '-' },
			{ id: '1006', estatename: 'La Isabela', dataordered: '13 Oct 2020', origin: 'Colombia', quantity: '397kg', typeoforder: 'Sample', status: 'Order confirmed', species: 'Bourbon', price: '$6,560' },
			{ id: '1007', estatename: 'Cafe Directo', dataordered: '13 Dec 2020', origin: 'Ethopia', quantity: '297kg', typeoforder: 'Sample', status: 'Shipped', species: 'Bourbon', price: '-' },
			{ id: '1008', estatename: 'Asoproaaa', dataordered: '13 Jan 2019', origin: 'Colombia', quantity: '-', typeoforder: 'Pre-Booked', status: 'Harvest Ready', species: 'Bourbon', price: '-' },
			{ id: '1009', estatename: 'Finca La Toboba', dataordered: '14 Feb 2019', origin: 'Colombia', quantity: '-', typeoforder: 'Pre-Booked', status: 'Payment', species: 'Bourbon', price: '$3,200' },
			{ id: '1010', estatename: 'Gesha', dataordered: '14 Jun 2019', origin: 'Ethopia', quantity: '297kg', typeoforder: 'Pre-Booked', status: 'In transit', species: 'Bourbon', price: '-' },
			{ id: '1011', estatename: 'Finca La Pampa', dataordered: '13 Jul 2019', origin: 'Ethopia', quantity: '197kg', typeoforder: 'Booked', status: 'Order confirmed', species: 'Bourbon', price: '$2,377' },
			{ id: '1012', estatename: 'Finca La Pampa', dataordered: '13 Mar 2018', origin: 'Colombia', quantity: '257kg', typeoforder: 'Booked', status: 'Cancelled', species: 'Bourbon', price: '-' },
			{ id: '1013', estatename: 'Gesha', dataordered: '13 May 2018', origin: 'Colombia', quantity: '277kg', typeoforder: 'Booked', status: 'Received', species: 'Bourbon', price: '$2,377' },
			{ id: '1014', estatename: 'Finca La Toboba', dataordered: '17 Aug 2018', origin: 'Ethopia', quantity: '-', typeoforder: 'Booked', status: 'Cancelled', species: 'Bourbon', price: '$6,560' },
			{ id: '1015', estatename: 'Asoproaaa', dataordered: '13 Oct 2018', origin: 'Ethopia', quantity: '-', typeoforder: 'Sample', status: 'Received', species: 'Bourbon', price: '$3,200' },
			{ id: '1016', estatename: 'Finca La Toboba', dataordered: '19 Oct 2018', origin: 'Colombia', quantity: '297kg', typeoforder: 'Sample', status: 'Payment', species: 'Bourbon', price: '-' },
			{ id: '1017', estatename: 'Finca La Pampa', dataordered: '23 Nov 2018', origin: 'Colombia', quantity: '-', typeoforder: 'Booked', status: 'Cancelled', species: 'Bourbon', price: '$3,200' },
			];
		// this.mainData = this.data;
	}

	ngOnInit(): void {
		//Auth checking
		if (this.cookieService.get("Auth") == "") {
			this.router.navigate(["/auth/login"]);
		}
		// this.appLanguage = this.global.languageJson;
		this.language();

		this.dtOptions = {
			//ajax: this.data,
			data: this.mainData,
			pagingType: 'full_numbers',
			pageLength: 10,
			lengthMenu: [[10, 25, 50, 100, -1], [10, 25, 50, 100, "All"]],
			processing: false,
			// placeholder: 'search here',
			// searchPlaceholder : this.appLanguage.all,
			language: {
				search: "",
				emptyTable: this.appLanguage.no_table_data
			},
			columns: [
				// {title: '<input type="checkbox" value="">' , data: null, className: "select-checkbox", defaultContent:'<input type="checkbox" value="">'},
				{
					title: '<label class="bestate-check "><input type="checkbox"  name="estate_all" [checked]="isAllCheckedEstate()" (change)="checkAllEstate($event)"><span class="estatecheckmark"></span></label>',

					defaultContent: '<label class="bestate-check"><input type="checkbox" name="sizecb[]" value="data.id" [(ngModel)]="data.state"  /><span class="estatecheckmark"></span>',
				},
				{
					title: this.appLanguage.order_id,
					data: 'id'
				}, {
					title: this.appLanguage.estate_name,
					data: 'estate_name'
				}, {
					title: this.appLanguage.date_ordered,
					data: 'created_at'
				},
				{
					title: this.appLanguage.origin,
					data: 'origin',

				},
				{
					title: this.appLanguage.species,
					data: 'species',

				},
				{
					title: this.appLanguage.price,
					data: 'price'
				},
				{
					title: this.appLanguage.quantity,
					data: 'quantity'
				}, {
					title: this.appLanguage.order_type,
					data: 'type',
					className: 'typeoforderclass'
				}, {
					title: this.appLanguage.status,
					data: 'status',
					className: 'status-es'
				},

				{
					title: this.appLanguage.action,
					defaultContent: "View order",
					className: "view-order"
				}
			],
			createdRow: (row: Node, data: any, index: number) => {
				const self = this;
				if ($(row).children('td.typeoforderclass').html() == "Booked") {
					$(row).children('td.typeoforderclass').html('<span class="typeoforder-Booked">&#9679; Booked</span>');

				}
				if ($(row).children('td.typeoforderclass').html() == "Sample") {
					$(row).children('td.typeoforderclass').html('<span class="typeoforder-Sample">&#9679; Sample</span>');

				}
				if ($(row).children('td.typeoforderclass').html() == "Pre-Booked") {
					$(row).children('td.typeoforderclass').html('<span class="typeoforder-Pre-Booked">&#9679; Pre-Booked</span>');

				}
			},
			rowCallback: (row: Node, data: any, index: number) => {
				const self = this;
				$('td', row).click(function () {
					let navigationExtras: NavigationExtras = {
						queryParams: {
							"data": encodeURIComponent(data.status),
						}
					}
					if (data.typeoforder == "Booked") {
						self.router.navigate(["/ordermanagement/order-booked"], navigationExtras);
					}
					else if (data.typeoforder == "Sample") {
						self.router.navigate(["/ordermanagement/order-sample"], navigationExtras);
					}
					else if (data.typeoforder == "Pre-Booked") {
						self.router.navigate(["/ordermanagement/order-prebook"], navigationExtras);
					}
				})
			}

		};
		this.estatetermStatus = '';
		this.estatetermOrigin = '';
		this.estatetermType = '';
		this.displayNumbers = '10';
		this.estatetermOriginMob = '';
		this.estatetermStatusMob = '';
		this.estatetermTypeMob = '';
		$(document).ready(function () {
			$(".dataTables_length").ready(function () {
				$(".dataTables_length").hide()
				$(".dataTables_info").hide();

			});
			$("input[type='search']").ready(function () {
				// $(".dataTables_filter>label").css("color","#FFF");
				$("input[type='search']").attr("placeholder", "Search by order id, estate name");
			});
		});

		// $(document).ready(function(){
		// 	$('.order-raised').click(function() {
		// 		$('li', $('.raised-mobile').parent()).removeClass('highlight');
		// 		$(this).addClass('highlight');
		// 		$('.raised-mobile').addClass("active");
		// 	});

		//   });




		/* pagination start */
		let listCount = 0;
		let elLen;
		let newliLen;

		$(document).ready(function () {
			var pLen = $('.pagination-content').length;
			console.log(pLen)
			for (var x = 0; x < pLen; x++) {
				var elements = $('.pagination-content').eq(x).find(".pagination-content-list .pagination-content-list__item");
				var index = 0;
				elLen = elements.length;
				newliLen = Math.floor(elLen / 4) + 1;
				var showNextFour = function (index) {
					if (index >= elements.length) {
						index = 0;
					}


					elements.hide().slice(index, index + 4).show();

				}
				showNextFour(listCount);

				// $('.responsive-pagination-list')
				if (newliLen > 5) {
					for (var i = 1; i <= 5; i++) {
						var li = '<li class="responsive-pagination-list__item">' + i + '</li>';
						$('.pagination-content').eq(x).find('.responsive-pagination-list').append(li);
						$('.pagination-content').eq(x).find('.responsive-pagination-list').find('.responsive-pagination-list__item:first-child').addClass('active');
					}

				}

				else {
					for (var i = 1; i <= newliLen; i++) {
						var li = '<li class="responsive-pagination-list__item">' + i + '</li>';
						$('.pagination-content').eq(x).find('.responsive-pagination-list').append(li);
						$('.pagination-content').eq(x).find('.responsive-pagination-list').find('.responsive-pagination-list__item:first-child').addClass('active');
					}
				}

			}

		});


		//Next page
		$('body').on('click', '.responsive-pagination__next', function () {
			var step = $(this).parents('.responsive-pagination').find('.responsive-pagination-list').find('.responsive-pagination-list__item.active');
			var steps = $(this).parents('.responsive-pagination').find('.responsive-pagination-list').find('.responsive-pagination-list__item');
			var stepNext = $(this).parents('.responsive-pagination').find('.responsive-pagination-list').find('.responsive-pagination-list__item.active').next('.responsive-pagination-list__item');
			var stepLastVal = parseInt($(this).parents('.responsive-pagination').find('.responsive-pagination-list').find('.responsive-pagination-list__item:last-child').text());
			$(this).parents('.pagination-content').find('.responsive-pagination__prev').removeClass('disable');
			var pageNew = parseInt($('.page-new').text());
			var pagefind = stepLastVal - pageNew;



			var elements = $(this).parents('.pagination-content').find(".pagination-content-list .pagination-content-list__item");
			elLen = elements.length;
			newliLen = Math.floor(elLen / 4) + 1;
			var index = 0;
			var showNextFour = function (index) {
				if (index >= elements.length) {
					index = 0;
				}

				elements.hide().slice(index, index + 4).show();

			}


			listCount = listCount + 4;
			showNextFour(listCount);

			var stepValue = stepNext.text();
			if (stepLastVal < newliLen) {
				stepNext.removeClass('active');
				stepNext.prev('.responsive-pagination-list__item').addClass('active');

				if (newliLen > 5) {
					for (var i = 0; i <= 4; i++) {
						var newStep = parseInt(steps.eq(i).text());

						if (pageNew == (stepLastVal - 1)) {
							return false;
						}

						else {
							steps.eq(i).text(newStep + 1);
						}
					}
				}

				else {
					for (var i = 0; i <= newliLen; i++) {
						var newStep = parseInt(steps.eq(i).text());

						if (pageNew == (stepLastVal - 1)) {
							return false;
						}

						else {
							steps.eq(i).text(newStep + 1);
						}
					}
				}

			}


			else {
				step.removeClass('active');
				stepNext.addClass('active')


				if (stepNext.is(':last-child')) {
					$(this).addClass('disable');

				}

			}




		});



		//Prev page
		$('body').on('click', '.responsive-pagination__prev', function () {
			var step = $(this).parents('.responsive-pagination').find('.responsive-pagination-list').find('.responsive-pagination-list__item.active:last');
			var steps = $(this).parents('.responsive-pagination').find('.responsive-pagination-list').find('.responsive-pagination-list__item');
			var stepPrev = $(this).parents('.responsive-pagination').find('.responsive-pagination-list').find('.responsive-pagination-list__item.active').prev('.responsive-pagination-list__item');
			var stepFirst = $(this).parents('.responsive-pagination').find('.responsive-pagination-list').find('.responsive-pagination-list__item:first-child');
			var stepLastVal = parseInt($(this).parents('.responsive-pagination').find('.responsive-pagination-list').find('.responsive-pagination-list__item:last-child').text());
			var activeFirst = $(this).parents('.responsive-pagination').find('.responsive-pagination-list').find('.responsive-pagination-list__item:first-child').hasClass('active');



			listCount = listCount - 4;

			var elements = $(this).parents('.pagination-content').find(".pagination-content-list .pagination-content-list__item");
			elLen = elements.length;
			newliLen = Math.floor(elLen / 4) + 1;
			var index = 0;
			var showNextFour = function (index) {
				if (index >= elements.length) {
					index = 0;
				}

				elements.hide().slice(index, index + 4).show();

			}


			showNextFour(listCount);

			if (newliLen > 5) {

				for (var i = 0; i <= 4; i++) {
					var newStep = parseInt(steps.eq(i).text());



					if (stepLastVal <= 5) {
						stepPrev.addClass('active');
						step.removeClass('active');
					}

					else {
						steps.eq(i).text(newStep - 1);
					}
				}
			}

			else {
				for (var i = 0; i <= newliLen; i++) {
					var newStep = parseInt(steps.eq(i).text());



					if (stepLastVal <= newliLen) {
						stepPrev.addClass('active');
						step.removeClass('active');
					}

					else {
						steps.eq(i).text(newStep - 1);
					}
				}
			}



			if (stepFirst.text() == '1' && stepFirst.hasClass('active')) {
				$(this).addClass('disable');
				$(this).parents('.pagination-content').find('.responsive-pagination__next').removeClass('disable');
			}


		});




		$('body').on('click', '.responsive-pagination-list__item', function () {
			$(this).parents('.pagination-content').find('.responsive-pagination-list__item').not(this).removeClass('active');
			$(this).addClass('active');
			var liStep = parseInt($(this).text());
			listCount = 4;
			if (liStep == 1) {
				$(this).parents('.pagination-content').find('.responsive-pagination__prev').addClass('disable');
				$(this).parents('.pagination-content').find('.responsive-pagination__next').removeClass('disable');
				liStep = 0;
				listCount = 0;
				console.log(listCount)

				var elements = $(this).parents('.pagination-content').find(".pagination-content-list .pagination-content-list__item");
				elLen = elements.length;
				newliLen = Math.floor(elLen / 4) + 1;
				var index = 0;
				var showNextFour = function (index) {
					if (index >= elements.length) {
						index = 0;
					}

					elements.hide().slice(index, index + 4).show();

				}


				showNextFour(listCount);
			}

			else {
				$(this).parents('.pagination-content').find('.responsive-pagination__prev').removeClass('disable');
				$(this).parents('.pagination-content').find('.responsive-pagination__next').removeClass('disable');
				listCount = (liStep * listCount) - 4;
				console.log(listCount)

				var elements = $(this).parents('.pagination-content').find(".pagination-content-list .pagination-content-list__item");
				elLen = elements.length;
				newliLen = Math.floor(elLen / 4) + 1;
				var index = 0;
				var showNextFour = function (index) {
					if (index >= elements.length) {
						index = 0;
					}

					elements.hide().slice(index, index + 4).show();

				}


				showNextFour(listCount);
			}


			if (liStep == newliLen) {
				$(this).parents('.pagination-content').find('.responsive-pagination__next').addClass('disable');
			}


		});

		/* pagination ends */
		this.getEstateOrdersData();//get table data

	}
	language(){
		this.appLanguage = this.global.languageJson;
		this.estateOrdersActive++;
	}
	//  Function Name : Check box function.
	//  Description   : This function helps to Check all the rows of the Users list.
	checkAllEstate(ev) {
		this.data.forEach(x => (x.state = ev.target.checked));
	}

	//  Function Name : Single Check box function.
	//  Description   : This function helps to Check that single row isChecked.
	isAllCheckedEstate() {
		return this.data.every(_ => _.state);
	}
	setStatus(term: any) {
		this.estatetermStatus = term;
		this.datatableElement.dtInstance.then(table => {
			table.column(9).search(this.estatetermStatus).draw();
		});
	}

	setOrigin(origindata: any) {
		this.estatetermOrigin = origindata;
		this.datatableElement.dtInstance.then(table => {
			table.column(4).search(origindata).draw();
		});
	}
	setOriginMob(term: any) {
		this.estatetermOriginMob = term;

	}
	setTypeMob(term: any) {
		this.estatetermTypeMob = term;

	}
	setStatusMob(term: any) {
		this.estatetermStatusMob = term;

	}

	setType(data: any) {
		this.estatetermType = data;
		this.datatableElement.dtInstance.then(table => {
			table.column(8).search(data).draw();
		});
	}
	setDisplay(data: any) {
		this.displayNumbers = data;
		$("select").val(data).trigger('change');

	}

	openCalendar(event: any) {
		this.calendar.showOverlay(this.calendar.inputfieldViewChild.nativeElement);
		event.stopPropagation();
	}

	filterDate(event: any) {
		if (this.rangeDates[0] != null && this.rangeDates[1] != null) {
			var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
			var fDate = new Date(this.rangeDates[0]);
			var fromDate = JSON.stringify(fDate);
			fromDate = fromDate.slice(1, 11);
			var fSplit = fromDate.split("-");

			var fDateString = fSplit[2] + " " + months[parseInt(fSplit[1]) - 1] + " " + fSplit[0];
			var tDate = new Date(this.rangeDates[1]);
			var toDate = JSON.stringify(tDate);
			toDate = toDate.slice(1, 11);
			var tSplit = toDate.split("-");
			var tDateString = tSplit[2] + " " + months[parseInt(tSplit[1]) - 1] + " " + tSplit[0];
			console.log(tDate.getTime());
			console.log(fDate.getTime());
			this.showDateRange = fDateString + " - " + tDateString;
			this.calendar.overlayVisible = false;


			$.fn.dataTable.ext.search.push(
				function (settings, data, dataIndex) {
					var min = new Date(fDateString).getTime();
					var max = new Date(tDateString).getTime();
					var startDate = new Date(data[3]).getTime();
					console.log(startDate);
					if (min == null && max == null) return true;
					if (min == null && startDate <= max) return true;
					if (max == null && startDate >= min) return true;
					if (startDate <= max && startDate >= min) return true;
					return false;
				}
			);
			this.datatableElement.dtInstance.then(table => {
				table.draw();
			});

		}
	}

	toggleOrigin() {
		this.showOrigin = !this.showOrigin;
		if (this.showOrigin == false) {
			document.getElementById('origin_id').style.border = "1px solid #30855c";
		}
		else {
			document.getElementById('origin_id').style.border = "1px solid #d6d6d6";

		}
	}
	toggleOriginMob() {
		this.showOriginMob = !this.showOriginMob;
		if (this.showOriginMob == false) {
			document.getElementById('OrginMob-id').style.border = "1px solid #30855c";
		}
		else {
			document.getElementById('OrginMob-id').style.border = "1px solid #d6d6d6";

		}
	}
	toggleType() {
		this.showType = !this.showType;
		if (this.showType == false) {
			document.getElementById('type_id').style.border = "1px solid #30855c";
		}
		else {
			document.getElementById('type_id').style.border = "1px solid #d6d6d6";

		}
	}
	toggleTypeMob() {
		this.showTypeMob = !this.showTypeMob;
		if (this.showTypeMob == false) {
			document.getElementById('type_id_Mob').style.border = "1px solid #30855c";
		}
		else {
			document.getElementById('type_id_Mob').style.border = "1px solid #d6d6d6";

		}
	}
	toggleStatus() {
		this.showStatus = !this.showStatus;
		if (this.showStatus == false) {
			document.getElementById('status_id').style.border = "1px solid #30855c";
		}
		else {
			document.getElementById('status_id').style.border = "1px solid #d6d6d6";

		}
	}
	toggleStatusMob() {
		this.showStatusMob = !this.showStatusMob;
		if (this.showStatusMob == false) {
			document.getElementById('status_id_Mob').style.border = "1px solid #30855c";
		}
		else {
			document.getElementById('status_id_Mob').style.border = "1px solid #d6d6d6";

		}
	}
	toggleDisplay() {
		this.showDisplay = !this.showDisplay;
		if (this.showDisplay == false) {
			document.getElementById('display_id').style.border = "1px solid #30855c";
		}
		else {
			document.getElementById('display_id').style.border = "1px solid #d6d6d6";

		}
	}

	OrderDetails($event, group) {
		console.log("the incoming data  are " + group.typeoforder + "..." + group.status);


		let navigationExtras: NavigationExtras = {
			queryParams: {
				"data": encodeURIComponent(group.status),
			}
		}
		if (group.typeoforder == "Booked") {
			this.router.navigate(["/ordermanagement/order-booked"], navigationExtras);
		}
		else if (group.typeoforder == "Sample") {
			this.router.navigate(["/ordermanagement/order-sample"], navigationExtras);
		}
		else if (group.typeoforder == "Pre-Booked") {
			this.router.navigate(["/ordermanagement/order-prebook"], navigationExtras);
		}

	}
	getEstateOrdersData() {
		this.roasterService.getEstateOrders(this.roasterId).subscribe(
			data => {
				if (data['success'] == true) {
					if (data['result'] == null || data['result'].length == 0) {
						this.odd = true;							
						this.hideTable = true ; 
						// this.toastrService.error(this.appLanguage.no_table_data);
					}
					else {
						this.odd = false;
						this.hideTable = false ; 
						this.mainData = data['result'];
					}
					this.estateOrdersActive++;
				}
				else {
					this.estateOrdersActive++;
					this.odd = true;
					this.toastrService.error(this.appLanguage.error_message);
				}
			}
		)
	}
}
