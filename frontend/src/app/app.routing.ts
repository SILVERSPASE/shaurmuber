import {ModuleWithProviders} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {ProfileComponent} from './profile/profile.component';
import {BasicsComponent} from './profile/basics/basics.component';
import {CommentsComponent} from './comments/comments.component';
import {PrivacySettingsComponent} from './profile/privacy-settings/privacy-settings.component';
import {NotificationsComponent} from './profile/notifications/notifications.component';
import {DeletedProfileComponent} from './profile/deleted-profile/deleted-profile.component';
import {LoginComponent} from './authentication/login/login.component';
import {RegistrationComponent} from './registration/registration.component';
import {OrdersComponent} from './orders/orders.component';
import {HomeComponent} from './home/home.component';
import {AboutComponent} from './about/about.component';
import {OrderCreateComponent} from './orders/order-create/order-create.component';
import {OrderUpdateComponent} from './orders/order-update/order-update.component';
import {PaymentsComponent} from './payments/payments.component';
import {DialogComponent} from './chat/dialog/dialog.component';
import {OtcComponent} from './otc/otc.component';
import {NotFoundComponent} from './not-found/not-found.component';
import {PublicProfileComponent} from './public-profile/public-profile.component';
import {PlacesComponent} from './profile/places/places.component';

const appRoutes: Routes = [
  {
    path: '',
    redirectTo: '',
    pathMatch: 'full',
    component: HomeComponent,
  },
  {
    path: 'about',
    component: AboutComponent,
  },
  {
    path: 'profile',
    component: ProfileComponent,
    data: {
      title: 'Profile'
    },
    children: [
      {path: '', component: BasicsComponent},
      {path: 'comments', component: CommentsComponent},
      {path: 'notifications', component: NotificationsComponent},
      {path: 'privacy_policy', component: PrivacySettingsComponent}
    ]
  },
  {
    path: 'deleted_profile',
    component: DeletedProfileComponent,
    data: {
      title: 'Deleted profile'
    }
  },
  {
    path: 'login',
    component: LoginComponent,
    data: {
      title: 'Login'
    }
  },
  {
    path: 'registration',
    component: RegistrationComponent,
    data: {
      title: 'Registration'
    }
  },
  {
    path: 'orders',
    component: OrdersComponent,
    data: {
      title: 'Orders'
    }
  },
  {
    path: 'dialog/:id',
    component: DialogComponent
  },
  {
    path: 'otc/:uuid',
    component: OtcComponent
  },
  {
    path: 'create-order',
    component: OrderCreateComponent,
    data: {
      title: 'Orders'
    }
  },
  {
    path: 'update-order',
    component: OrderUpdateComponent,
    data: {
      title: 'Orders'
    }
  },
  {
    path: 'payments',
    component: PaymentsComponent,
    data: {
      title: 'Payments'
    }
  },
  {
    path: 'u/:uuid',
    component: PublicProfileComponent,
  },
  {
    path: 'profile/places',
    component: PlacesComponent,
  },
  {
    path: '404',
    component: NotFoundComponent,
  },
  {
    path: 'u/:uuid/comments',
    component: CommentsComponent,
  },
  {
    path: '**',
    redirectTo: '404',
}];


export const appRoutingProviders: any[] = [];
export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes, {useHash: false});
