// Imports
import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { environment } from './../../environments/environment';

// Import RxJs required methods
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class CredentialsService {

  constructor(private http: Http) { }

  public validateUsername(username: string) {
    let headers = this.getCredentialsHeaders();
    return this.http.get(environment.api.uri + '/credentials/validateUsername?username=' + username,
      {
        headers: headers
      })
      .map((res: Response) => res.json());
  }

  public list() {
    let headers = this.getCredentialsHeaders();
    return this.http.get(environment.api.uri + '/credentials/list', {
      headers: headers
    }).map((res: Response) => res.json());
  }

  public create(username: string, emailAddress: string, password: string) {
    let headers = this.getCredentialsHeaders();
    return this.http.post(environment.api.uri + '/credentials/create', {
      username: username,
      emailAddress: emailAddress,
      password: password
    }, {
        headers: headers
      }).map((res: Response) => res.json());
  }
  

  private getCredentialsHeaders() {
    let headers = new Headers();
    headers.append('x-client-id', environment.clientId);
    headers.append('x-client-secret', environment.clientSecret);
    return headers;
  }
}
