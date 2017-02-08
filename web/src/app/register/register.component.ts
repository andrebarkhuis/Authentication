// Imports
import { Component, OnInit } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { environment } from './../../environments/environment';

// Import RxJs required methods
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  username: string;
  emailAddress: string;
  password: string;
  confirmPassword: string;
  message: string;
  appSettings: any = environment.appSettings;
  queryString: any = window.location.search;

  constructor(private http: Http) { }

  ngOnInit() {
  }


  public register() {

    this.message = null;

    let clientId = this.getParameterByName('client_id');
    let responseType = this.getParameterByName('response_type');


    if (this.username == null || this.username == '') {
      this.message = 'Username cannot be empty';
      return;
    }

    if (this.emailAddress == null || this.emailAddress == '') {
      this.message = 'Email Address cannot be empty';
      return;
    }

    if (this.password == null || this.password == '') {
      this.message = 'Password cannot be empty';
      return;
    }

    if (this.password != this.confirmPassword) {
      this.message = 'Passwords does not match';
      return;
    }

    if (responseType == 'token') {
      this.http.post(environment.api.uri + '/credentials', {
        clientId: clientId,
        username: this.username,
        emailAddress: this.emailAddress,
        password: this.password
      })
        .map((res: Response) => res.json())
        .subscribe((result: any) => {
          if (result.token == null) {
            this.message = result.message;
          } else {
            window.location.href = this.getParameterByName('redirect_uri') + '?token=' + result.token;
          }
        }, (err: any) => {
          if (err instanceof Error) {
            this.message = err.message;
          } else if (err instanceof Response) {
            this.message = err.json().message;
          } else {
            this.message = 'Unexpected error occurred'
          }
        });
    } else {
      this.message = 'Response Type not supported';
    }

  }

  private getParameterByName(name: string) {

    let url = window.location.href;

    name = name.replace(/[\[\]]/g, "\\$&");
    let regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"), results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
  }
}
