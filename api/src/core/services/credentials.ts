// Imports repositories
import { CredentialsRepository } from './../repositories/credentials'

// Imports models
import { Credentials } from './../models/credentials';

export class CredentialsService {

    constructor(private credentialsRepository: CredentialsRepository) {

    }

    create(clientId: string, username: string, emailAddress: string, password: string): Promise<Boolean> {
        return this.credentialsRepository.findByUsername(clientId, username).then((usernameResult: Credentials) => {
            if (usernameResult == null) {
                return this.credentialsRepository.findByEmailAddress(clientId, emailAddress).then((emailAddressResult: Credentials) => {
                    if (emailAddressResult == null) {
                        return this.credentialsRepository.create(clientId, username, emailAddress, password).then((result: Boolean) => {
                            return result;
                        });
                    } else {
                        throw new Error('Email address already exist.');
                    }
                });
            } else {
                throw new Error('Username already exist.');
            }
        });

    }

    list(clientId: string): Promise<Credentials[]> {
        return this.credentialsRepository.list(clientId).then((result: Credentials[]) => {
            return result;
        });
    }

    exist(clientId: string, username: string): Promise<Boolean> {

        return this.credentialsRepository.findByUsername(clientId, username).then((result) => {
            if (result == null) {
                return false;
            } else {
                return true;
            }
        });
    }
}