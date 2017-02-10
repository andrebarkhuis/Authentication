export class Credentials {

    clientId: string;
    username: string;
    emailAddress: string;
    password: string;

    constructor(clientId: string, username: string, emailAddress: string, password: string) {
        this.clientId = clientId;
        this.username = username;
        this.emailAddress = emailAddress;
        this.password = password;
    }
}