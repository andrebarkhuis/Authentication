// Imports
import * as mongodb from 'mongo-mock';
import 'mocha';
import { expect } from 'chai';

// Imports services
import { CredentialsService } from './../../../api/src/core/services/credentials';

// Imports repositories
import { CredentialsRepository } from './../../../api/src/core/repositories/credentials';

describe('CredentialsService', () => {
    let credentialsService: CredentialsService;
    let credentialsRepository: CredentialsRepository;

    beforeEach(function (done: Function) {
        let mongoDbConfig = {
            server: 'localhost',
            database: 'authentication'
        };

        let mongoClient = mongodb.MongoClient;

        credentialsRepository = new CredentialsRepository(mongoDbConfig, mongoClient);

        credentialsService = new CredentialsService(credentialsRepository);

        mongoClient.connect('mongodb://' + mongoDbConfig.server + ':27017/' + mongoDbConfig.database, (err: Error, db: mongodb.Db) => {
            var collection = db.collection('credentials');
            collection.remove({}, (err: Error, result: any) => {
                credentialsRepository.create('test-client-id-existing', 'test-username-existing', 'test-email-address-existing', 'test-password-existing').then((result) => {
                    done();
                }).catch((err: Error) => {
                    done(err);
                });
            });
        });
    });

    describe('create', () => {
        it('should succeed given non-existing username', () => {
            return credentialsService.create('test-client-id--existing', 'test-username-non-existing', 'test-email-address-existing', 'test-password-existing')
                .then((result) => {
                });
        });
        it('should fail given existing username', (done: Function) => {
            credentialsService.create('test-client-id-existing', 'test-username-existing', 'test-email-address-non-existing', 'test-password-existing')
                .then((result) => {
                    done(new Error('Expected Error'));
                }).catch((err: Error) => {
                    done();
                });
        });
        it('should fail given existing email address', (done: Function) => {
            credentialsService.create('test-client-id-existing', 'test-username-non-existing', 'test-email-address-existing', 'test-password-existing')
                .then((result) => {
                    done(new Error('Expected Error'));
                }).catch((err: Error) => {
                    done();
                });
        });
        it('should succeed given existing username with different clientId', () => {
            return credentialsService.create('test-client-id-non-existing', 'test-username-existing', 'test-email-address-existing', 'test-password-existing')
                .then((result) => {
                });
        });
    });

    describe('list', () => {
        it('should return list given existing client id', () => {
            return credentialsService.list('test-client-id-existing')
                .then((result: any[]) => {
                    expect(result.length).to.be.eq(1);
                });
        });
        it('should return empty list given non-existing client id', () => {
            return credentialsService.list('test-client-id-non-existing')
                .then((result: any[]) => {
                    expect(result.length).to.be.eq(0);
                });
        });
    });

    describe('exist', () => {
        it('should return true given existing client id and username', () => {
            return credentialsService.exist('test-client-id-existing', 'test-username-existing')
                .then((result: boolean) => {
                    expect(result).to.be.true;
                });
        });
        it('should return false given non-existing client id and username', () => {
            return credentialsService.exist('test-client-id-non-existing', 'test-username-non-existing')
                .then((result: boolean) => {
                    expect(result).to.be.false;
                });
        });
    });
});