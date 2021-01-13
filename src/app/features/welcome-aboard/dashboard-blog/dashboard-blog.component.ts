import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { GlobalsService } from 'src/services/globals.service';
import { WelcomeService } from '../welcome.service';

@Component({
  selector: 'app-dashboard-blog',
  templateUrl: './dashboard-blog.component.html',
  styleUrls: ['./dashboard-blog.component.scss'],
})
export class DashboardBlogComponent implements OnInit, OnDestroy {
  recentActivities: any[] = [];
  recentActivitiesSub: Subscription;

  constructor(public globals: GlobalsService, private welcomeSrv: WelcomeService) {}

  ngOnInit(): void {
    this.recentActivitiesSub = this.welcomeSrv.recentActivities$.subscribe((res: any) => {
      this.recentActivities = res;
    });
  }

  ngOnDestroy() {
    this.recentActivitiesSub.unsubscribe();
  }

  checkAll(ev: any) {
    this.recentActivities.forEach((x) => (x.state = ev.target.checked));
  }

  checkOne(ev: any) {
    console.log(ev);
  }

  isAllChecked() {
    return this.recentActivities.every((_) => _.state);
  }
}