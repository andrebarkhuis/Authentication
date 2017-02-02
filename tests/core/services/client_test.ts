import { ClientService } from './../../../api/src/core/services/client';
import { ClientRepository } from './../../../api/src/core/repositories/client';
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
            clientService.create('test-client-id')
                .then((result) => {
                    done();
                }).catch((err: Error) => {
                    done(err);
                });
        });
    });


    describe('exist', () => {
        it('should return true given existing client id', (done) => {
            clientService.exist('test-client-id')
                .then((result) => {
                    expect(result).to.be.true;
                    done();
                }).catch((err: Error) => {
                    done(err);
                });
        });

        it('should return false given non-existing client id', (done) => {
            clientService.exist('test-client-id-invalid')
                .then((result) => {
                    expect(result).to.be.false;
                    done();
                }).catch((err: Error) => {
                    done(err);
                });
        });
    });

    describe('validate', () => {
        it('should return true given valid client id and valid client secret', (done) => {
            clientService.validate('test-client-id', 'test-client-secret')
                .then((result) => {
                    expect(result).to.be.true;
                    done();
                }).catch((err: Error) => {
                    done(err);
                });
        });

        it('should return false given valid client id and invalid client secret', (done) => {
            clientService.validate('test-client-id', 'test-client-secret-invalid')
                .then((result) => {
                    expect(result).to.be.false;
                    done();
                }).catch((err: Error) => {
                    done(err);
                });
        });
    });
});