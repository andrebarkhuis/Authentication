import { CredentialsService } from './../../../api/src/core/services/credentials';
import { CredentialsRepository } from './../../../api/src/core/repositories/credentials';
import 'mocha';
import { expect } from 'chai';

describe('UserService', () => {
    let credentialsService: CredentialsService;
    let credentialsRepository: CredentialsRepository;

    beforeEach(function (done: Function) {
        let mongoDbConfig = {
            server: 'localhost',
            database: 'authentication'
        };

        credentialsRepository = new CredentialsRepository(mongoDbConfig);

        credentialsService = new CredentialsService(credentialsRepository);

        credentialsRepository.clear().then((result) => {
            credentialsRepository.create('test-client-id', 'test-username', 'test-password').then((result) => {
                done();
            }).catch((err: Error) => {
                done(err);
            });
        }).catch((err: Error) => {
            done(err);
        });
    });

    describe('create', () => {
        it('should succeed given non-existing username', (done) => {
            credentialsService.create('test-client-id1', 'test-username1', 'test-password1')
                .then((result) => {
                    done();
                }).catch((err: Error) => {
                    done(err);
                });
        });

        it('should fail given existing username', (done) => {
            credentialsService.create('test-client-id', 'test-username', 'test-password')
                .then((result) => {
                    done(new Error('Expected Error'));
                }).catch((err: Error) => {
                    done();
                });
        });

        it('should succeed given existing username with different clientId', (done) => {
            credentialsService.create('test-client-id1', 'test-username', 'test-password')
                .then((result) => {
                    done();
                }).catch((err: Error) => {
                    done(err);
                });
        });
    });

    describe('list', () => {
        it('should return list given valid client id', (done) => {
            credentialsService.list('test-client-id')
                .then((result: any[]) => {
                    expect(result.length).to.be.eq(1);
                    done();
                }).catch((err: Error) => {
                    done(err);
                });
        });

        it('should return empty list given invalid client id', (done) => {
            credentialsService.list('test-client-id-invalid')
                .then((result: any[]) => {
                    expect(result.length).to.be.eq(0);
                    done();
                }).catch((err: Error) => {
                    done(err);
                });
        });
    });

    describe('exist', () => {
        it('should return true given existing client id and username', (done) => {
            credentialsService.exist('test-client-id', 'test-username')
                .then((result: boolean) => {
                    expect(result).to.be.true;
                    done();
                }).catch((err: Error) => {
                    done(err);
                });
        });

        it('should return false given existing client id and username', (done) => {
            credentialsService.exist('test-client-id-invalid', 'test-username-invalid')
                .then((result: boolean) => {
                    expect(result).to.be.false;
                    done();
                }).catch((err: Error) => {
                    done(err);
                });
        });
    });
});