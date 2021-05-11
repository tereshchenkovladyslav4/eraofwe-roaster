import { CommonModule } from '@angular/common';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { SharedModule } from 'src/app/shared/shared.module';

import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { OnboardCustomersComponent } from './onboard-customers/onboard-customers.component';
import { FeaturesRoutingModule } from './features-routing.module';
import { FeaturesComponent } from './features.component';
import { ProfileEditComponent } from './profile-edit/profile-edit.component';
import { ProfilePicComponent } from './profile-edit/profile-pic/profile-pic.component';
import { RoasterCompleteSetupComponent } from './roaster-complete-setup/roaster-complete-setup.component';
import { RoasterOnboardingComponent } from './roaster-onboarding/roaster-onboarding.component';
import { RoasterQuickSetupComponent } from './roaster-quick-setup/roaster-quick-setup.component';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { DataTablesModule } from 'angular-datatables';
import { MatProgressBarModule } from '@angular/material/progress-bar';

import { CoffeeExperienceComponent } from './Farm Link/coffee-experience/coffee-experience.component';

import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { CofeeExpeienceDetailsComponent } from './Farm Link/cofee-expeience-details/cofee-expeience-details.component';
import { ProfileLicenseComponent } from './profile-edit/profile-license/profile-license.component';
import { NotificationComponent } from './notification/notification.component';
import { RoasterOnboardComponent } from './roaster-onboard/roaster-onboard.component';
import { VatManagementComponent } from './vat-management/vat-management.component';
import { VatDetailsComponent } from './vat-management/vat-details/vat-details.component';
import { QAForumComponent } from './Farm Link/q-a-forum/q-a-forum.component';
import { AssignedComponent } from './Farm Link/q-a-forum/assigned/assigned.component';
import { ForumComponent } from './Farm Link/q-a-forum/forum/forum.component';
import { MyAnswersComponent } from './Farm Link/q-a-forum/my-answers/my-answers.component';
import { BatchSelectAnOrderComponent } from './batch-select-an-order/batch-select-an-order.component';
import { SuccessfulPageComponent } from './successful-page/successful-page.component';
import { EstateOrdersComponent } from './Farm Link/coffee-experience/estate-orders/estate-orders.component';
import { MicroRoasterOrdersComponent } from './Farm Link/coffee-experience/micro-roaster-orders/micro-roaster-orders.component';
import { HorecaOrdersComponent } from './Farm Link/coffee-experience/horeca-orders/horeca-orders.component';
import { DefaultSettingComponent } from './Farm Link/coffee-experience/default-setting/default-setting.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { RatingModule } from 'primeng/rating';
import { ListboxModule } from 'primeng/listbox';
import { PaginatorModule } from 'primeng/paginator';
import { RoasteryLicenseComponent } from './roastery-profile/roastery-license/roastery-license.component';

@NgModule({
    declarations: [
        OnboardCustomersComponent,
        RoasterOnboardingComponent,
        RoasterQuickSetupComponent,
        RoasterCompleteSetupComponent,
        FeaturesComponent,
        ProfileEditComponent,
        ProfilePicComponent,
        CoffeeExperienceComponent,
        ResetPasswordComponent,
        CofeeExpeienceDetailsComponent,
        ProfileLicenseComponent,
        NotificationComponent,
        RoasterOnboardComponent,
        VatManagementComponent,
        VatDetailsComponent,
        QAForumComponent,
        AssignedComponent,
        ForumComponent,
        MyAnswersComponent,
        BatchSelectAnOrderComponent,
        SuccessfulPageComponent,
        EstateOrdersComponent,
        MicroRoasterOrdersComponent,
        HorecaOrdersComponent,
        DefaultSettingComponent,
        RoasteryLicenseComponent,
    ],
    imports: [
        PaginatorModule,
        CommonModule,
        FeaturesRoutingModule,
        DragDropModule,
        MatChipsModule,
        MatIconModule,
        DataTablesModule,
        FormsModule,
        MatBottomSheetModule,
        Ng2SearchPipeModule,
        RatingModule,
        MatProgressBarModule,
        SharedModule,
        NgxChartsModule,
        ListboxModule,
    ],
})
export class FeaturesModule {}
