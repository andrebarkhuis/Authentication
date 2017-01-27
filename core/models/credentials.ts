export class Credentials {

    clientId: string;
    username: string;
    password: string;

    constructor(clientId: string, username: string, password: string) {
        this.clientId = clientId;
        this.username = username;
        this.password = password;
    }
}