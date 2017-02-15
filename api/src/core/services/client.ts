// Imports
import * as uuid from 'uuid';
import * as jwt from 'jsonwebtoken';

// Imports models
import { Client } from './../models/client';

// Imports repositories
import { ClientRepository } from './../repositories/client';

export class ClientService {

    constructor(private clientRepository: ClientRepository, private jwtIssuer: string, private jwtSecret: string) {

    }

    validateJSONWebToken(token: string): Boolean {
        try {
            let decoded = jwt.verify(token, this.jwtSecret, {
                issuer: this.jwtIssuer
            });
            return true;
        } catch (err) {
            return false;
        }
    }

    create(name: string): Promise<Client> {
        let id: string = uuid.v4();
        let secret: string = uuid.v4();

        let client = new Client(name, id, secret);

        return this.clientRepository.create(name, id, secret).then((result) => {
            return client;
        });
    }

    validate(id: string, secret: string): Promise<Boolean> {
        return this.clientRepository.findByIdAndSecret(id, secret).then((result: Client) => {
            if (result == null) {
                return false;
            } else {
                return true;
            }
        });
    }

    exist(id): Promise<Boolean> {
        return this.clientRepository.findById(id).then((result: Client) => {
            if (result == null) {
                return false;
            } else {
                return true;
            }
        });
    }

}