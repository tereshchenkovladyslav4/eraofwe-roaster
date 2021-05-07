import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '@shared';
import { ECommerceRoutingModule } from './e-commerce-routing.module';

import { ProductListComponent } from './product-list/product-list.component';
import { ProductDetailsComponent } from './product-details/product-details.component';
import { VarientDetailsComponent } from './varient-details/varient-details.component';

@NgModule({
    declarations: [ProductListComponent, ProductDetailsComponent, VarientDetailsComponent],
    imports: [CommonModule, FormsModule, SharedModule, ECommerceRoutingModule],
})
export class ECommerceModule {}