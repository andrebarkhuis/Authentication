import { AuthService } from './../../../core/services/auth';
import * as jwt from 'jsonwebtoken';
import 'mocha';
import { expect } from 'chai';

describe('AuthService', () => {
    let authService: AuthService;

    beforeEach(function () {
        authService = new AuthService('', 'hello_world', 'foo bar', null);
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
});