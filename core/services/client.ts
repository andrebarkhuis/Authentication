import { Client } from './../models/client';
import * as uuid from 'uuid';
import { ClientRepository } from './../repositories/client';
import * as jwt from 'jsonwebtoken';

export class ClientService {

    constructor(private clientRepository: ClientRepository, private jwtIssuer: string, private jwtSecret: string) {

    }

    validateJSONWebToken(token: string) {
        try {
            let decoded = jwt.verify(token, this.jwtSecret, {
                issuer: this.jwtIssuer
            });
            return true;
        } catch (err) {
            return false;
        }
    }

    create(name: string) {
        return new Promise((resolve: Function, reject: Function) => {
            let id: string = uuid.v4();
            let secret: string = uuid.v4();

            let client = new Client(name, id, secret);

            this.clientRepository.create(name, id, secret).then((result) => {
                resolve(client);
            }).catch((err: Error) => {
                reject(err);
            });
        });
    }

    validate(id: string, secret: string) {
        return new Promise((resolve: Function, reject: Function) => {
            this.clientRepository.findByIdAndSecret(id, secret).then((result: Client) => {
                if (result == null) {
                    resolve(false);
                } else {
                    resolve(true);
                }
            }).catch((err: Error) => {
                reject(err);
            });
        });
    }

    exist(id) {
        return new Promise((resolve: Function, reject: Function) => {
            this.clientRepository.findById(id).then((result: Client) => {
                if (result == null) {
                    resolve(false);
                } else {
                    resolve(true);
                }
            }).catch((err: Error) => {
                reject(err);
            });
        });
    }

}