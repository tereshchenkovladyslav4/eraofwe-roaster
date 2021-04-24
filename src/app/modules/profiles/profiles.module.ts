import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MicroProfileComponent } from './micro-profile/micro-profile.component';
import { ProfilesComponent } from './profiles.component';
import { MicroAboutComponent } from './micro-profile/micro-about/micro-about.component';
import { MicroContactComponent } from './micro-profile/micro-contact/micro-contact.component';
import { MicroReviewsComponent } from './micro-profile/micro-reviews/micro-reviews.component';
import { MicroVirtualTourComponent } from './micro-profile/micro-virtual-tour/micro-virtual-tour.component';
import { ProfilesRoutingModule } from './profiles.routing.module';
import { FormsModule } from '@angular/forms';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { RatingModule } from 'ng-starrating';
import { SharedModule } from '@app/shared';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { EstateProfileComponent } from './estate-profile/estate-profile.component';
import { EstateReviewsComponent } from './estate-profile/estate-reviews/estate-reviews.component';
import { EstateContactComponent } from './estate-profile/estate-contact/estate-contact.component';
import { EstateAboutComponent } from './estate-profile/estate-about/estate-about.component';
import { EstateVirtulTourComponent } from './estate-profile/estate-virtul-tour/estate-virtul-tour.component';
import { GoogleMapsModule } from '@angular/google-maps';

@NgModule({
    declarations: [
        MicroProfileComponent,
        ProfilesComponent,
        MicroAboutComponent,
        MicroContactComponent,
        MicroReviewsComponent,
        MicroVirtualTourComponent,
        EstateProfileComponent,
        EstateAboutComponent,
        EstateReviewsComponent,
        EstateContactComponent,
        EstateVirtulTourComponent,
    ],
    imports: [
        CommonModule,
        ProfilesRoutingModule,
        FormsModule,
        Ng2SearchPipeModule,
        RatingModule,
        SharedModule,
        NgxChartsModule,
        GoogleMapsModule,
    ],
})
export class ProfilesModule {}