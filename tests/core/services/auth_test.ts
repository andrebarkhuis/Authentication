// Imports
import * as mongodb from 'mongo-mock';
import 'mocha';
import { expect } from 'chai';

// Imports services
import { AuthService } from './../../../api/src/core/services/auth';

// Import repositories
import { CredentialsRepository } from './../../../api/src/core/repositories/credentials';

describe('AuthService', () => {
    let authService: AuthService;
    let credentialsRepository: CredentialsRepository;

    beforeEach(function (done: Function) {
        let mongoDbConfig = {
            server: 'localhost',
            database: 'authentication'
        };

        let mongoClient = mongodb.MongoClient;

        credentialsRepository = new CredentialsRepository(mongoDbConfig, mongoClient);

        authService = new AuthService('', 'hello_world', 'foo bar', {
            github: {
                clientId: '',
                clientSecret: ''
            },
            google: {
                clientId: '',
                clientSecret: ''
            }
        }, credentialsRepository);

        mongoClient.connect('mongodb://' + mongoDbConfig.server + ':27017/' + mongoDbConfig.database, (err: Error, db: mongodb.Db) => {
            var collection = db.collection('credentials');
            collection.remove({}, (err: Error, result: any) => {
                credentialsRepository.create('test-client-id', 'test-username', 'test-email-address', 'test-password').then((result) => {
                    done();
                }).catch((err: Error) => {
                    done(err);
                });
            });
        });
    });

    describe('authorize', () => {
        it('should return JWT token given clientId and username', () => {
            let result = authService.authorize('test-client-id', 'test-username');
            expect(result).to.be.not.null;
        });

        it('should return JWT token with vaild fields given clientId and username', () => {
            let token = authService.authorize('test-client-id', 'test-username');

            let decodedToken = authService.decodeToken(token);

            let iss = decodedToken.iss;
            let aud = decodedToken.aud;
            let username = decodedToken.username;

            expect(iss).to.be.eq('foo bar');
            expect(aud).to.be.eq('test-client-id');
            expect(username).to.be.eq('test-username');
        });
    });


    describe('decodeToken', () => {
        it('should return decoded token given valid token', () => {
            let token = authService.authorize('test-client-id', 'test-username');
            let result = authService.decodeToken(token);
            expect(result).to.be.not.null;
        });

        it('should return false given invalid token', () => {
            let token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWV9.TJVA95OrM7E2cBab30RMHrHDcEfxjoYZgeFONFh7HgQ';
            let result = authService.decodeToken(token);
            expect(result).to.be.null;
        });
    });

    describe('verify', () => {
        it('should return true given valid token', () => {
            let token = authService.authorize('test-client-id', 'test-username');
            let result = authService.verify(token);
            expect(result).to.be.true;
        });

        it('should return false given invalid token', () => {
            let token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWV9.TJVA95OrM7E2cBab30RMHrHDcEfxjoYZgeFONFh7HgQ';
            let result = authService.verify(token);
            expect(result).to.be.false;
        });
    });

    describe('encodeState', () => {
        it('should return encoded state given client id and redirect uri', () => {
            let result = authService.encodeState('test-client-id', 'test-redirect-uri');
            expect(result).to.be.not.null;
        });

        it('should return null given client id and redirect uri as null', () => {
            let result = authService.encodeState('test-client-id', null);
            expect(result).to.be.null;
        });
    });

    describe('decodeState', () => {
        it('should return decoded state given encoded state', () => {
            let encodedState = authService.encodeState('test-client-id', 'test-redirect-uri');
            let decodedState = authService.decodeState(encodedState);
            expect(decodedState.clientId).to.be.eq('test-client-id');
            expect(decodedState.redirectUri).to.be.eq('test-redirect-uri');
        });
    });

    describe('createClientAuths', () => {
        it('should return oauth object given client id and redirect uri', () => {
            let result = authService.createClientAuths('test-client-id', 'test-redirect-uri');
            expect(result).to.be.not.null;
        });
    });

    describe('authenticate', () => {
        it('should return true given valid client id, valid username and valid password', () => {
            return authService.authenticate('test-client-id', 'test-username', 'test-password').then((result: boolean) => {
                expect(result).to.be.true;
            });
        });

        it('should return true given invalid client id, valid username and valid password', () => {
            return authService.authenticate('invalid-test-client-id', 'test-username', 'test-password').then((result: boolean) => {
                expect(result).to.be.false;
            });
        });
    });
});