import { ClientService } from './../../../core/services/client';
import { ClientRepository } from './../../../core/repositories/client';
import 'mocha';
import { expect } from 'chai';

describe('ClientService', () => {
    let clientService: ClientService;
    let clientRepository: ClientRepository;

    beforeEach(function (done: Function) {
        let mongoDbConfig = {
            server: 'localhost',
            database: 'authentication'
        };

        clientRepository = new ClientRepository(mongoDbConfig);

        clientService = new ClientService(clientRepository, '', '');

        clientRepository.clear().then((result) => {
            clientRepository.create('test-client-name', 'test-client-id', 'test-client-secret').then((result) => {
                done();
            }).catch((err: Error) => {
                done(err);
            });
        }).catch((err: Error) => {
            done(err);
        });
    });

    describe('create', () => {
        it('should succeed given name', (done) => {
            let result = clientService.create('test-client-id')
                .then((result) => {
                    done();
                }).catch((err: Error) => {
                    done(err);
                });
        });
    });

    describe('validate', () => {
        it('should return true given valid client id and valid client secret', (done) => {
            let result = clientService.validate('test-client-id', 'test-client-secret')
                .then((result) => {
                    expect(result).to.be.true;
                    done();
                }).catch((err: Error) => {
                    done(err);
                });
        });

        it('should return false given valid client id and invalid client secret', (done) => {
            let result = clientService.validate('test-client-id', 'test-client-secret-invalid')
                .then((result) => {
                    expect(result).to.be.false;
                    done();
                }).catch((err: Error) => {
                    done(err);
                });
        });
    });
});