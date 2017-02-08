// Imports
import { Component, OnInit } from '@angular/core';
import { environment } from './../../environments/environment';

// Imports services
import { CredentialsService } from './../services/credentials.service';
import { ClientService } from './../services/client.service';

@Component({
  selector: 'app-list-credentials',
  templateUrl: './list-credentials.component.html',
  styleUrls: ['./list-credentials.component.css']
})
export class ListCredentialsComponent implements OnInit {

  credentials: any[];

  createNewCredentialsModal = null;

  createNewCredentials = {
    username: null,
    message: null,
    onChange_Username: () => {
      this.onChange_CreateNewCredentialsModal_Username();
    },
    onClick_Create: () => {
      this.onClick_CreateNewCredentialsModal_Create();
    },
  }

  constructor(private credentialsService: CredentialsService, private clientService: ClientService) { }

  ngOnInit() {
    this.load_credentials();
  }

  bindModal(modal) {
    this.createNewCredentialsModal = modal;
  }

  load_credentials() {
    this.credentialsService.list().subscribe((result: any) => {
      this.credentials = result;
    }, (err: Error) => {

    });
  }

  clear_createNewCredentials() {
    this.createNewCredentials.message = null;
    this.createNewCredentials.username = null;
  }

  onClick_CreateNewCredentialsModal_Create() {
    this.credentialsService.validateUsername(this.createNewCredentials.username)
      .subscribe((result: any) => {
        if (result.isValid) {
          this.credentialsService.create(this.createNewCredentials.username, 'password')
            .subscribe((result: any) => {
              this.load_credentials();
              this.clear_createNewCredentials();
              this.createNewCredentialsModal.hide();
            }, (err: Error) => {
              this.createNewCredentials.message = err.message;
            });
        } else {
          this.createNewCredentials.message = result.message;
        }
      }, (err: Error) => {
        this.createNewCredentials.message = err.message;
      });
  }

  onChange_CreateNewCredentialsModal_Username() {
    this.credentialsService.validateUsername(this.createNewCredentials.username)
      .subscribe((result: any) => {
        if (result.isValid) {
          this.createNewCredentials.message = null;
        } else {
          this.createNewCredentials.message = result.message;
        }
      }, (err: Error) => {
        this.createNewCredentials.message = err.message;
      });
  }
}
