// Imports 
import { Express, Request, Response } from "express";
import request from 'request';

// Imports core services 
import { AuthService } from './../core/services/auth';
import { ClientService } from './../core/services/client';

// Imports repositories
import { CredentialsRepository } from './../core/repositories/credentials';
import { ClientRepository } from './../core/repositories/client';

// Import configuration file
import { config } from './../config';

import * as express from 'express';
let router = express.Router();

/**
 * @api {get} /auth/authorize RETRIEVE AN AUTHORIZATION GRANT
 * @apiName AuthAuthorize
 * @apiGroup Auth
 *
 * @apiParam {String} response_type Authorization grant type requested. If you want to follow Authorization Code Flow, use code and if you want to use Implicit Flow, use token.
 * @apiParam {String} client_id The unique identifier of the client you received from registration.
 * @apiParam {String} redirect_uri The URL you registered as the Callback URL during the client registration.
 * @apiParam {String} scope A list of space-delimited scopes of the access request.
 *
 */
router.get('/authorize', (req: Request, res: Response, next: Function) => {
    let authService = getAuthService();
    let responseType = req.query.response_type;

    if (responseType == 'token') {
        let clientId = req.query.client_id;
        let redirectUri = req.query.redirect_uri;
        let scope = req.query.scope;

        res.redirect(config.web.uri + '/login?client_id=' + clientId + '&redirect_uri=' + redirectUri + '&scope=' + scope + '&response_type=' + responseType);
    } else {
        res.status(400).send('Response Type not supported');
    }
});

/**
 * @api {get} /auth/verify VERIFY A JSON WEB TOKEN
 * @apiName AuthVerify
 * @apiGroup Auth
 *
 * @apiParam {String} token JSON Web Token (JWT) (RFC 7519).
 * 
 * @apiSuccess {Boolean} success If valid token, returns true, otherwise false.
 */
router.get('/verify', (req: Request, res: Response, next: Function) => {
    let authService = getAuthService();
    let result = authService.verify(req.query.token);

    res.json({
        success: result
    });
});

/**
 * @api {get} /auth/token RETRIEVE AN ACCESS TOKEN
 * @apiName AuthToken
 * @apiGroup Auth
 *
 * @apiParam {String} grant_type A grant type. If you want to follow Authorization Code Flow then use authorization_code and if you want to use Resource Owner Password Credentials Flow, use password.
 * @apiParam {String} username The resource owner username. Required if grant_type is equal to password.
 * @apiParam {String} password The resource owner password. Required if grant_type is equal to password.
 * @apiParam {String} client_id The unique identifier of the client you received from registration.
 * 
 * @apiSuccess {Boolean} token JSON Web Token (JWT) (RFC 7519).
 * @apiSuccess {Boolean} message Empty.
 * 
 */
router.get('/token', (req: Request, res: Response, next: Function) => {
    let authService = getAuthService();
    let grantType = req.query.grant_type;
    let username = req.query.username;
    let password = req.query.password;
    let clientId = req.query.client_id;

    if (grantType == 'password') {
        authService.authenticate(clientId, username, password).then((isValid) => {
            if (isValid) {
                let token = authService.authorize(clientId, username);
                res.json({
                    token: token
                });
            } else {
                res.status(401).json({
                    message: 'Invalid Credentials'
                });
            }
        }).catch((err: Error) => {
            res.status(500).json({
                message: err.message
            });
        });


    } else {
        res.status(400).json({
            message: 'Invalid Grant Type'
        });
    }
});

/**
 * @api {get} /auth/github AUTHENTICATE USING GITHUB
 * @apiName AuthGithub
 * @apiGroup Auth
 *
 * @apiParam {String} client_id The unique identifier of the client you received from registration.
 * @apiParam {String} redirect_uri The URL you registered as the Callback URL during the client registration.
 * 
 */
router.get('/github', (req: Request, res: Response, next: Function) => {
    let authService = getAuthService();
    let clientService = getClientService();

    if (req.query.client_id == null) {
        res.status(400).send('No client id provided.');
    } else if (req.query.redirect_uri == null) {
        res.status(400).send('No redirect uri provided.');
    } else {
        clientService.exist(req.query.client_id).then((result) => {
            if (result == false) {
                res.status(400).send('Invalid client id provided.');
            } else {
                let auth = authService.createClientAuths(req.query.client_id, req.query.redirect_uri);
                var uri = auth.githubAuth.code.getUri();
                res.redirect(uri);
            }
        }).catch((err: Error) => {
            res.status(500).send(err.message);
        });
    }
});

/**
 * @api {get} /auth/google AUTHENTICATE USING GOOGLE
 * @apiName AuthGoogle
 * @apiGroup Auth
 *
 * @apiParam {String} client_id The unique identifier of the client you received from registration.
 * @apiParam {String} redirect_uri The URL you registered as the Callback URL during the client registration.
 * 
 */
router.get('/google', (req: Request, res: Response, next: Function) => {
    let authService = getAuthService();
    let clientService = getClientService();

    if (req.query.client_id == null) {
        res.status(400).send('No client id provided.');
    } else if (req.query.redirect_uri == null) {
        res.status(400).send('No redirect uri provided.');
    } else {
        clientService.exist(req.query.client_id).then((result) => {
            if (result == false) {
                res.status(400).send('Invalid client id provided.');
            } else {
                let auth = authService.createClientAuths(req.query.client_id, req.query.redirect_uri);
                var uri = auth.googleAuth.code.getUri();
                res.redirect(uri);
            }
        }).catch((err: Error) => {
            res.status(500).send(err.message);
        });
    }
});

/**
 * @api {get} /auth/github/callback GITHUB CALLBACK
 * @apiName AuthGithubCallback
 * @apiGroup Auth
 *
 * @apiParam {String} code An authorization code, which can be used to obtain an access token.
 * @apiParam {String} state An opaque string value used to maintain state between the request and callback.
 * 
 */
router.get('/github/callback', (req: Request, res: Response, next: Function) => {
    let authService = getAuthService();
    let auth = authService.createClientAuths(null, null);
    auth.githubAuth.code.getToken(req.originalUrl)
        .then((user: any) => {
            request({
                url: 'https://api.github.com/user?access_token=' + user.accessToken,
                headers: {
                    'User-Agent': 'request'
                }
            }, (error, response, body) => {
                if (!error && response.statusCode == 200) {
                    let decodedState = authService.decodeState(req.query.state);
                    let token = authService.authorize(decodedState.clientId, JSON.parse(body).email);
                    res.redirect(decodedState.redirectUri + '?token=' + token);
                } else {
                    return res.status(500).send('An Error Occurred');
                }
            });
        }).catch((err: Error) => {
            return res.status(500).send(err.message);
        });
});


/**
 * @api {get} /auth/google/callback GOOGLE CALLBACK
 * @apiName AuthGoogleCallback
 * @apiGroup Auth
 *
 * @apiParam {String} code Empty.
 * @apiParam {String} state Empty.
 * 
 */
router.get('/google/callback', (req: Request, res: Response, next: Function) => {
    let authService = getAuthService();
    let decodedState = authService.decodeState(req.query.state);
    let auth = authService.createClientAuths(decodedState.clientId, decodedState.redirectUri);
    auth.googleAuth.code.getToken(req.originalUrl)
        .then((user: any) => {
            request('https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=' + user.accessToken, (error, response, body) => {
                if (!error && response.statusCode == 200) {

                    let token = authService.authorize(decodedState.clientId, JSON.parse(body).email);
                    res.redirect(decodedState.redirectUri + '?token=' + token);
                } else {
                    return res.status(500).send('An Error Occurred');
                }
            });
        }).catch((err: Error) => {
            return res.status(500).send(err.message);
        });
});


// Get Instance of AuthService
function getAuthService() {
    let credentialsRepository = new CredentialsRepository(config.mongoDb);
    let authService = new AuthService(config.baseUri, config.jwt.secret, config.jwt.issuer, config.oauth, credentialsRepository);
    return authService;
}

// Get Instance of ClientService
function getClientService() {
    let clientRepository = new ClientRepository(config.mongoDb);
    let clientService = new ClientService(clientRepository, config.admin.jwt.issuer, config.admin.jwt.secret);
    return clientService;
}


export = router;
