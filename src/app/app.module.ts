// Core
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {NgbPaginationModule, NgbAlertModule, NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { ToastrModule } from 'ngx-toastr';
import {HttpModule} from '@angular/http';
import { FilterPipeModule } from 'ngx-filter-pipe';
// Components
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { RegisterationComponent } from './registeration/registeration.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HomeComponent } from './home/home.component';
import { RecoverPasswordComponent } from './recover-password/recover-password.component';


// FireBase
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { environment } from '../environments/environment';

//Services
import { AuthService } from './auth.service';
import {AuthGaurdService} from './auth-gaurd.service';
import { NavbarComponent } from './navbar/navbar.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { SpinnerComponent } from './ui/spinner/spinner.component';
import { AddUserComponent } from './add-user/add-user.component';
import { ModifyUserComponent } from './modify-user/modify-user.component';
import { AdminLoginComponent } from './admin-login/admin-login.component';
import { PricingComponent } from './pricing/pricing.component';
import { RatesComponent } from './rates/rates.component';
import { InvoiceComponent } from './invoice/invoice.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterationComponent,
    DashboardComponent,
    HomeComponent,
    RecoverPasswordComponent,
    NavbarComponent,
    SidebarComponent,
    EditProfileComponent,
    SpinnerComponent,
    AddUserComponent,
    ModifyUserComponent,
    AdminLoginComponent,
    PricingComponent,
    RatesComponent,
    InvoiceComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    FilterPipeModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFirestoreModule,
    NgbModule,
    AngularFireStorageModule,
    NgbPaginationModule,
    NgbAlertModule,
    RouterModule.forRoot([
      {path: '' , redirectTo: 'login', pathMatch: 'full'},
      {path: 'login', component: LoginComponent},
      {path: 'registeration', component: RegisterationComponent},
      {path: 'admin-login', component: AdminLoginComponent},
      {path: 'recover-password', component: RecoverPasswordComponent},
      {path: 'dashboard', component: DashboardComponent, children: [
        {path: 'home', component: HomeComponent},
        {path: 'edit-profile', component: EditProfileComponent},
        {path: 'add-user', component: AddUserComponent},
        {path: 'modify-user', component: ModifyUserComponent},
        {path: 'pricing', component: PricingComponent},
        {path: 'rates/:id', component: RatesComponent},
        {path: 'rates', component: RatesComponent},
        {path: 'invoice', component: InvoiceComponent}
      ], canActivate: [AuthGaurdService]}
    ])
    
  ],
  providers: [AuthService, AuthGaurdService],
  bootstrap: [AppComponent]
})
export class AppModule { }
