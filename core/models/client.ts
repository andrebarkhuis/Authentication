export class Client {

    name: string;
    id: string;
    secret: string;

    constructor(name: string, id: string, secret: string) {
        this.name = name;
        this.id = id;
        this.secret = secret;
    }
}