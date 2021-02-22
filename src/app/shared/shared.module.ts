import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { AnimateOnScrollModule } from 'ng2-animate-on-scroll';
import { DragDropModule } from '@angular/cdk/drag-drop';

import { ModalModule } from 'ngx-bootstrap/modal';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';

import { AutoCompleteModule } from 'primeng/autocomplete';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { CarouselModule } from 'primeng/carousel';
import { CheckboxModule } from 'primeng/checkbox';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { GalleriaModule } from 'primeng/galleria';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputSwitchModule } from 'primeng/inputswitch';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { InputTextModule } from 'primeng/inputtext';
import { MenuModule } from 'primeng/menu';
import { MultiSelectModule } from 'primeng/multiselect';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { RatingModule } from 'primeng/rating';
import { SelectButtonModule } from 'primeng/selectbutton';
import { SliderModule } from 'primeng/slider';
import { TableModule } from 'primeng/table';
import { TabMenuModule } from 'primeng/tabmenu';
import { TabViewModule } from 'primeng/tabview';
import { TooltipModule } from 'primeng/tooltip';
import { TreeModule } from 'primeng/tree';

import { ChartAllModule, AccumulationChartAllModule, RangeNavigatorAllModule } from '@syncfusion/ej2-angular-charts';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { ImageCropperModule } from 'ngx-image-cropper';
// import { RatingModule } from 'ng-starrating';
import { GalleryModule } from 'ng-gallery';
import { LightboxModule } from 'ng-gallery/lightbox';
import { MatVideoModule } from 'mat-video';
import { Ng2TelInputModule } from 'ng2-tel-input';

import { CountryPipe } from './pipes/country/country.pipe';
import { EstateBrandLinkPipe } from './pipes/link/estate-brand-link.pipe';
import { ProfileLinkPipe } from './pipes/link/profile-link.pipe';
import { ReviewLinkPipe } from './pipes/link/review-link.pipe';
import { RoasterBrandLinkPipe } from './pipes/link/roaster-brand-link.pipe';
import { OrderRatingLinkPipe } from './pipes/link/order-rating-link.pipe';
import { OrderLinkPipe } from './pipes/link/order-link.pipe';
import { FileNamePipe } from './pipes/file-name.pipe';
import { MonthPipe } from './pipes/month/month.pipe';
import { OrgTypePipe } from './pipes/org-type.pipe';
import { WordCountPipe } from './pipes/word-count/word-count.pipe';

import { WordLimitDirective } from './directives/word-limit.directive';

import { AvatarComponent } from './components/avatar/avatar.component';
import { BlankComponent } from './components/blank/blank.component';
import { EmptyComponent } from './components/empty/empty.component';
import { SelectComponent } from './components/select/select.component';
import { RemoteSensoringComponent } from './components/remote-sensoring/remote-sensoring.component';
import { WeatherChartComponent } from './components/remote-sensoring/weather-chart/weather-chart.component';
import { SoilChartComponent } from './components/remote-sensoring/soil-chart/soil-chart.component';
import { UvChartComponent } from './components/remote-sensoring/uv-chart/uv-chart.component';
import { VegetationChartComponent } from './components/remote-sensoring/vegetation-chart/vegetation-chart.component';
import { ImageMapComponent } from './components/remote-sensoring/image-map/image-map.component';
import { PieChartComponent } from './components/pie-chart/pie-chart.component';
import { MediaComponent } from './components/media/media.component';
import { VideoPlayerComponent } from './components/video-player/video-player.component';
import { BreadcrumbComponent } from './components/breadcrumb/breadcrumb.component';
import { ReadMoreComponent } from './components/read-more/read-more.component';
import { UploaderComponent } from './components/uploader/uploader.component';

import { ConfirmComponent } from './components/confirm/confirm.component';
import { BlogCardComponent } from './components/blog-card/blog-card.component';
import { LoadingComponent } from './components/loading/loading.component';
import { BarChartComponent } from './components/bar-chart/bar-chart.component';
import { NgxEchartsModule } from 'ngx-echarts';
import * as echarts from 'echarts';
import { HorizontalBarComponent } from './components/horizontal-bar/horizontal-bar.component';
import { LineChartComponent } from './components/line-chart/line-chart.component';
import { TimeRangeComponent } from './components/time-range/time-range.component';
import { DayPickerComponent } from './components/day-picker/day-picker.component';
import { PhoneNumberComponent } from './components/phone-number/phone-number.component';
import { ReviewSummaryComponent } from './components/review-summary/review-summary.component';
import { ReviewsComponent } from './components/reviews/reviews.component';
import { ProgressBarModule } from 'primeng/progressbar';
// #region material
const MATMODULES = [];
// #endregion

// #region third libs
const THIRDMODULES = [
    AutocompleteLibModule,
    AnimateOnScrollModule,
    DragDropModule,
    ModalModule,
    PopoverModule,
    TypeaheadModule,
    AutoCompleteModule,
    BreadcrumbModule,
    ButtonModule,
    CalendarModule,
    CarouselModule,
    CheckboxModule,
    DialogModule,
    DropdownModule,
    DynamicDialogModule,
    GalleriaModule,
    InputNumberModule,
    InputSwitchModule,
    InputTextareaModule,
    InputTextModule,
    MenuModule,
    MultiSelectModule,
    OverlayPanelModule,
    ProgressSpinnerModule,
    RatingModule,
    SelectButtonModule,
    SliderModule,
    TableModule,
    TabMenuModule,
    TabViewModule,
    TooltipModule,
    TreeModule,
    ChartAllModule,
    AccumulationChartAllModule,
    RangeNavigatorAllModule,
    NgxChartsModule,
    ImageCropperModule,
    // RatingModule,
    GalleryModule,
    LightboxModule,
    MatVideoModule,
    Ng2TelInputModule,
    ProgressBarModule,
];
// #endregion

// #region your componets & directives
const COMPONENTS = [
    AvatarComponent,
    BlankComponent,
    EmptyComponent,
    SelectComponent,
    RemoteSensoringComponent,
    WeatherChartComponent,
    SelectComponent,
    SoilChartComponent,
    UvChartComponent,
    VegetationChartComponent,
    ImageMapComponent,
    BlankComponent,
    PieChartComponent,
    MediaComponent,
    VideoPlayerComponent,
    ReadMoreComponent,
    UploaderComponent,
    LoadingComponent,
    LineChartComponent,
    TimeRangeComponent,
    DayPickerComponent,
    BlogCardComponent,
    BarChartComponent,
    BreadcrumbComponent,
    HorizontalBarComponent,
    PhoneNumberComponent,
    ReviewSummaryComponent,
    ReviewsComponent,
];
const COMPONENTS_NOROUNT = [ConfirmComponent];
const DIRECTIVES = [WordLimitDirective];
const PIPES = [
    CountryPipe,
    EstateBrandLinkPipe,
    FileNamePipe,
    MonthPipe,
    ProfileLinkPipe,
    ReviewLinkPipe,
    RoasterBrandLinkPipe,
    OrderRatingLinkPipe,
    OrderLinkPipe,
    OrgTypePipe,
    WordCountPipe,
];
// #endregion

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        RouterModule,
        ReactiveFormsModule,
        ...MATMODULES,
        // third libs
        ...THIRDMODULES,
        NgxEchartsModule.forRoot({
            echarts,
        }),
    ],
    declarations: [
        // your components
        ...COMPONENTS,
        ...COMPONENTS_NOROUNT,
        ...DIRECTIVES,
        ...PIPES,
    ],
    entryComponents: COMPONENTS_NOROUNT,
    exports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule,
        ...MATMODULES,
        // third libs
        ...THIRDMODULES,
        // your components
        ...COMPONENTS,
        ...DIRECTIVES,
        ...PIPES,
    ],
})
export class SharedModule {}
