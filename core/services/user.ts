import { CredentialsRepository } from './../repositories/credentials'

export class UserService {

    constructor(private credentialsRepository: CredentialsRepository) {

    }

    create(clientId: string, username: string, password: string) {
        return new Promise((resolve: Function, reject: Function) => {
            this.credentialsRepository.findByUsername(clientId, username).then((result) => {
                if (result == null) {
                    this.credentialsRepository.create(clientId, username, password).then((result) => {
                        resolve();
                    }).catch((err: Error) => {
                        reject(err);
                    });
                } else {
                    throw new Error('Username already exist.');
                }
            }).catch((err: Error) => {
                reject(err);
            })
        });
    }

    list(clientId: string) {
        return new Promise((resolve: Function, reject: Function) => {
            this.credentialsRepository.list(clientId).then((result) => {
                resolve(result);
            }).catch((err: Error) => {
                reject(err);
            })
        });
    }
}