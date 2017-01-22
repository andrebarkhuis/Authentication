"use strict";
var auth_1 = require("./../../../core/services/auth");
require("mocha");
var chai_1 = require("chai");
describe('AuthService', function () {
    var authService;
    beforeEach(function () {
        authService = new auth_1.AuthService('hello_world', 'foo bar');
    });
    describe('authorize', function () {
        it('should return JWT token given clientId and username', function () {
            var result = authService.authorize('test-client-id', 'test-username');
            chai_1.expect(result).to.be.not["null"];
        });
        it('should return JWT token with vaild fields given clientId and username', function () {
            var token = authService.authorize('test-client-id', 'test-username');
            var decodedToken = authService.decodeToken(token);
            var iss = decodedToken.iss;
            var aud = decodedToken.aud;
            var username = decodedToken.username;
            chai_1.expect(iss).to.be.eq('foo bar');
            chai_1.expect(aud).to.be.eq('test-client-id');
            chai_1.expect(username).to.be.eq('test-username');
        });
    });
    describe('verify', function () {
        it('should return true given valid token', function () {
            var token = authService.authorize('test-client-id', 'test-username');
            var result = authService.verify(token);
            chai_1.expect(result).to.be["true"];
        });
        it('should return false given invalid token', function () {
            var token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWV9.TJVA95OrM7E2cBab30RMHrHDcEfxjoYZgeFONFh7HgQ';
            var result = authService.verify(token);
            chai_1.expect(result).to.be["false"];
        });
    });
});
