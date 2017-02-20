// Imports
import * as mongodb from 'mongo-mock';
import 'mocha';
import { expect } from 'chai';

// Imports services
import { ClientService } from './../../../api/src/core/services/client';

// Imports repositories
import { ClientRepository } from './../../../api/src/core/repositories/client';

describe('ClientService', () => {
    let clientService: ClientService;
    let clientRepository: ClientRepository;

    beforeEach(function (done: Function) {
        let mongoDbConfig = {
            server: 'localhost',
            database: 'authentication'
        };

        let mongoClient = mongodb.MongoClient;

        clientRepository = new ClientRepository(mongoDbConfig, mongoClient);

        clientService = new ClientService(clientRepository, '', '');

        mongoClient.connect('mongodb://' + mongoDbConfig.server + ':27017/' + mongoDbConfig.database, (err: Error, db: mongodb.Db) => {
            var collection = db.collection('credentials');
            collection.remove({}, (err: Error, result: any) => {
                clientRepository.create('test-client-name', 'test-client-id', 'test-client-secret').then((result) => {
                    done();
                }).catch((err: Error) => {
                    done(err);
                });
            });
        });

    });

    describe('create', () => {
        it('should succeed given name', () => {
            return clientService.create('test-client-id')
                .then((result) => {
                });
        });
    });


    describe('exist', () => {
        it('should return true given existing client id', () => {
            return clientService.exist('test-client-id')
                .then((result) => {
                    expect(result).to.be.true;
                });
        });
        it('should return false given non-existing client id', () => {
            return clientService.exist('test-client-id-invalid')
                .then((result) => {
                    expect(result).to.be.false;
                });
        });
    });

    describe('validate', () => {
        it('should return true given valid client id and valid client secret', () => {
            return clientService.validate('test-client-id', 'test-client-secret')
                .then((result) => {
                    expect(result).to.be.true;
                });
        });
        it('should return false given valid client id and invalid client secret', () => {
            return clientService.validate('test-client-id', 'test-client-secret-invalid')
                .then((result) => {
                    expect(result).to.be.false;
                });
        });
    });
});