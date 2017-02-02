import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { ListCredentialsComponent } from './list-credentials/list-credentials.component';

import { CredentialsService } from './services/credentials.service';
import { ClientService } from './services/client.service';

import { ModalModule } from 'ng2-bootstrap';
import { SelectModule } from 'ng2-select';

var router = RouterModule.forRoot([
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'credentials',
    component: ListCredentialsComponent
  }
]);


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ListCredentialsComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    router,
    ModalModule.forRoot(),
    SelectModule
  ],
  providers: [ CredentialsService, ClientService ],
  bootstrap: [AppComponent]
})
export class AppModule { }
