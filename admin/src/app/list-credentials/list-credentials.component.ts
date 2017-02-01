import { Component, OnInit } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { environment } from './../../environments/environment';

// Import RxJs required methods
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';


@Component({
  selector: 'app-list-credentials',
  templateUrl: './list-credentials.component.html',
  styleUrls: ['./list-credentials.component.css']
})
export class ListCredentialsComponent implements OnInit {

  credentials: any[];


  createNewCredentials = {
    onChange_Username: () => {
      this.onChange_CreateNewCredentialsModal_Username();
    },
    clients: [],
    message: null,
    init: () => {
      this.load_CreateNewCredentialsModal_Clients();
    }
  }

  constructor(private http: Http) { }

  ngOnInit() {



    this.createNewCredentials.init();

    this.credentials = [
      {
        clientId: 'test-client-id',
        username: 'test-username'
      },
      {
        clientId: 'test-client-id',
        username: 'test-username'
      },
      {
        clientId: 'test-client-id',
        username: 'test-username'
      }
    ];

  }

  load_CreateNewCredentialsModal_Clients() {
    this.http.get(environment.api.uri + '/data/clients')
      .map((res: Response) => res.json())
      .subscribe((result: any) => {
        this.createNewCredentials.clients = result;
      }, (err: Error) => {

      });
  }

  onChange_CreateNewCredentialsModal_Username() {
    this.http.get(environment.api.uri + '/data/validateUsername')
      .map((res: Response) => res.json())
      .subscribe((result: any) => {
        if (result.isValid) {
          this.createNewCredentials.message = null;
        } else {
          this.createNewCredentials.message = result.message;
        }
      }, (err: Error) => {

      });
  }


}
