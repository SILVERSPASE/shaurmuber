import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from './root/app.component';
import { HttpClientModule, HttpClientXsrfModule } from '@angular/common/http';
import { TextMaskModule } from 'angular2-text-mask';
import { routing } from './app.routing';
import { CookieModule } from 'ngx-cookie';
import { AgmCoreModule } from '@agm/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { HomeComponent } from './home/home.component';
import { FooterComponent } from './footer/footer.component';
import { AboutComponent } from './about/about.component';
import { OrderDetailComponent } from './orders/order-detail/order-detail.component';
import { OrdersComponent } from './orders/orders.component';
import { GooglePlacesComponent } from './orders/google-places/google-places.component';
import { OrderListComponent } from './orders/order-list/order-list.component';
import { OrderMapComponent } from './orders/order-map/order-map.component';
import { OrdersService } from './orders/order.service';
import { ProfileComponent } from './profile/profile.component';
import { LoginComponent } from './authentication/login/login.component';
import { RegistrationComponent } from './registration/registration.component';
import { OrderCreateComponent } from './orders/order-create/order-create.component';
import { OrderUpdateComponent } from './orders/order-update/order-update.component';
import { DatePickerModule} from 'angular-io-datepicker';
import { OverlayModule } from 'angular-io-overlay';
import { PaymentsComponent} from './payments/payments.component';
import { ChatService } from './chat/chat.service';
import { OtcComponent } from './otc/otc.component';
import { BasicsComponent } from './profile/basics/basics.component';
import { CommentsComponent } from './comments/comments.component';
import { PrivacySettingsComponent } from './profile/privacy-settings/privacy-settings.component';
import { NotificationsComponent } from './profile/notifications/notifications.component';
import { DeletedProfileComponent } from './profile/deleted-profile/deleted-profile.component';
import { DialogComponent } from './chat/dialog/dialog.component';
import { TabsModule, BsDatepickerModule } from 'ngx-bootstrap';
import { CityService } from './cities/service/city.service';
import { UserService } from './profile/user.service';
import { UserRegistrationService } from './shared/user.service';
import { NotFoundComponent } from './not-found/not-found.component';
import { NouisliderModule } from 'ng2-nouislider';
import {OrdersFilter} from "./orders/orders-filter/orders-filter";
import {ObjNgFor} from "./pipes/objNgFor-pipe";
import {AgmJsMarkerClustererModule} from "@agm/js-marker-clusterer";
import { PublicProfileComponent } from './public-profile/public-profile.component';
import { ProfileService } from './profile/profile.service';
import { PlacesComponent } from './profile/places/places.component';
import {NgxPaginationModule} from 'ngx-pagination';
import { DirectionsMapDirective } from './orders/order-map/order-map.directive';
import { PhotoCropperComponent } from './profile/photo-cropper/photo-cropper.component';
import { ImageCropperComponent } from 'ng2-img-cropper';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    HomeComponent,
    FooterComponent,
    AboutComponent,
    OrderDetailComponent,
    OrdersComponent,
    GooglePlacesComponent,
    OrderListComponent,
    OrderMapComponent,
    RegistrationComponent,
    ProfileComponent,
    LoginComponent,
    RegistrationComponent,
    OrderCreateComponent,
    OrderUpdateComponent,
    PaymentsComponent,
    OtcComponent,
    BasicsComponent,
    CommentsComponent,
    PrivacySettingsComponent,
    NotificationsComponent,
    DeletedProfileComponent,
    DialogComponent,
    NotFoundComponent,
    OrdersFilter,
    ObjNgFor,
    DirectionsMapDirective,
    PublicProfileComponent,
    PlacesComponent,
    PublicProfileComponent,
    PlacesComponent,
    DirectionsMapDirective,
    PhotoCropperComponent,
    ImageCropperComponent
  ],
  imports: [
    BrowserModule,
    NgbModule.forRoot(),
    TabsModule.forRoot(),
    NgxPaginationModule,
    routing,
    HttpClientModule,
    HttpClientXsrfModule.withOptions({
      cookieName: 'csrftoken',
      headerName: 'X-CSRFToken',
    }),
    CookieModule.forRoot(),
    CommonModule,
    ReactiveFormsModule,
    OverlayModule,
    DatePickerModule,
    FormsModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyBR6KausbfmVNDC6HM2uBhhp8OLaBL4rcE',
      libraries: ['places']
    }),
    TextMaskModule,
    ReactiveFormsModule,
    BsDatepickerModule.forRoot(),
    NouisliderModule,
    AgmJsMarkerClustererModule


  ],
  providers: [
    OrdersService,
    UserService,
    CityService,
    ChatService,
    UserRegistrationService,
    ProfileService
  ],
  bootstrap: [
      AppComponent,
  ]
})
export class AppModule { }
