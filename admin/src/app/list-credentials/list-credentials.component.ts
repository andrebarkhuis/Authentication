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
  clients: any[];

  selectedClientName: any;

  constructor(private http: Http) { }

  ngOnInit() {
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

    this.clients = [
      {
        id: 'hello',
        text: 'hello'
      }
    ];
  }


}
