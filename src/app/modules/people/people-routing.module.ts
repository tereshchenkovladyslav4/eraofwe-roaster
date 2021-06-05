import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PeopleComponent } from './people.component';
import { CustomerManagementComponent } from './customer-management/customer-management.component';
import { CustomerDetailsComponent } from './customer-management/customer-details/customer-details.component';
import { AuthGuard } from '@guards';

const routes: Routes = [
    {
        path: '',
        component: PeopleComponent,
        children: [
            {
                path: 'customer-management',
                component: CustomerManagementComponent,
                canActivate: [AuthGuard],
            },
            {
                path: 'customer-details/:id',
                component: CustomerDetailsComponent,
            },
            {
                path: '',
                redirectTo: 'customer-management',
                pathMatch: 'full',
            },
        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class PeopleRoutingModule {}
