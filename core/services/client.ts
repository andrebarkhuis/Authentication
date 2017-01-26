import { Client } from './../models/client';
import * as uuid from 'uuid';
import { ClientRepository } from './../repositories/client'

export class ClientService {

    constructor(private clientRepository: ClientRepository) {

    }

    create(name: string) {
        return new Promise((resolve: Function, reject: Function) => {
            let id: string = uuid.v4();
            let secret: string = uuid.v4();

            let client = new Client(name, id, secret);

            resolve(client);
        });
    }

    validate(id: string, secret: string) {
        return new Promise((resolve: Function, reject: Function) => {
            resolve(true);
        });
    }
}