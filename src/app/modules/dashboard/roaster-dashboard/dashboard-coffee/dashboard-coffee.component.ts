import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { GlobalsService } from '@services';
import { WelcomeService } from '../welcome.service';

@Component({
    selector: 'app-dashboard-coffee',
    templateUrl: './dashboard-coffee.component.html',
    styleUrls: ['./dashboard-coffee.component.scss'],
})
export class DashboardCoffeeComponent implements OnInit, OnDestroy {
    stock: any;
    stockSub: Subscription;
    orders: any[] = [];
    ordersSub: Subscription;
    public chartData: any[] = [];
    orderTypes = {
        GC_ORDER: {
            color: '#f19634',
            name: 'Booked',
        },
        GC_ORDER_SAMPLE: {
            color: '#629b20',
            name: 'Sample',
        },
        PREBOOK_LOT: {
            color: '#8872ef',
            name: 'Prebook',
        },
    };
    constructor(private router: Router, public globals: GlobalsService, private welcomeSrv: WelcomeService) {}

    ngOnInit(): void {
        this.stockSub = this.welcomeSrv.stock$.subscribe((res: any) => {
            this.stock = res;
            if (this.stock) {
                this.makeChartData();
            }
        });
        this.ordersSub = this.welcomeSrv.orders$.subscribe((res: any) => {
            if (res) {
                this.orders = res;
            }
        });
    }

    ngOnDestroy() {
        this.stockSub.unsubscribe();
        this.ordersSub.unsubscribe();
    }

    makeChartData() {
        const tempData = [];
        this.stock.stock_stats.forEach((element) => {
            tempData.push({
                name: element.cup_score,
                value: (element.available_quantity / 1000).toFixed(1),
            });
        });
        this.chartData = tempData;
    }

    goToOrderDetails(item: any) {
        this.router.navigateByUrl(`/ordermanagement/order-booked?data=${item.type}&id=${item.id}`);
    }
}
