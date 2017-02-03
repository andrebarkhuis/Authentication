import { Component } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { environment } from './../environments/environment';

// Import RxJs required methods
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  username: string;
  password: string;
  message: string;

  constructor(private http: Http) {

  }

  login() {

    this.message = null;

    let clientId = this.getParameterByName('client_id');
    let responseType = this.getParameterByName('response_type');

    if (responseType == 'token') {
      this.http.get(environment.api.uri + '/auth/token?grant_type=password&username=' + this.username + '&password=' + this.password + '&client_id=' + clientId)
        .map((res: Response) => res.json())
        .subscribe((result: any) => {
          if (result.token == null) {
            this.message = result.message;
          } else {
            window.location.href = this.getParameterByName('redirect_uri') + '?token=' + result.token;
          }
        }, (err: Error) => {
          this.message = err.message;
        });
    } else {
      this.message = 'Reponse Type not supported';
    }
  }

  getParameterByName(name: string) {

    let url = window.location.href;

    name = name.replace(/[\[\]]/g, "\\$&");
    let regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"), results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
  }
}
