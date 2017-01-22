import { Express, Request, Response } from "express";
import { config } from './../config';
import { AuthService } from './../../core/services/auth';
import * as request from 'request';

let express = require('express');
let router = express.Router();

/**
 * @api {get} /auth/authorize Authorize
 * @apiName Authorize
 * @apiGroup Auth
 *
 * @apiParam {String} response_type Empty.
 * @apiParam {String} client_id Empty.
 * @apiParam {String} redirect_uri Empty.
 * @apiParam {String} scope Empty.
 *
 */
router.get('/authorize', (req: Request, res: Response, next: Function) => {
    let authService = getAuthService();
    let responseType = req.query.response_type;

    if (responseType == 'token') {
        let clientId = req.query.client_id;
        let redirectUri = req.query.redirect_uri;
        let scope = req.query.scope;

        res.redirect(config.web.uri + '?client_id=' + clientId + '&redirect_uri=' + redirectUri + '&scope=' + scope + '&response_type=' + responseType);
    } else {
        res.send('Reponse Type not supported');
    }
});

/**
 * @api {get} /auth/verify Verify
 * @apiName Verify
 * @apiGroup Auth
 *
 * @apiParam {String} token Empty.
 * 
 * @apiSuccess {Boolean} success Empty.
 */
router.get('/verify', (req: Request, res: Response, next: Function) => {
    let authService = getAuthService();
    let result = authService.verify(req.query.token);

    res.json({
        success: result
    });
});

/**
 * @api {get} /auth/token Token
 * @apiName Token
 * @apiGroup Auth
 *
 * @apiParam {String} grant_type Empty.
 * @apiParam {String} username Empty.
 * @apiParam {String} password Empty.
 * @apiParam {String} client_id Empty.
 * 
 * @apiSuccess {Boolean} token Empty.
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
        var isValid = authService.authenticate(clientId, username, password);

        if (isValid) {
            let token = authService.authorize(clientId, username);
            res.json({
                token: token
            });
        } else {
            res.json({
                message: 'Invalid Credentials'
            });
        }
    } else {
        res.json({
            message: 'Invalid Grant Type'
        });
    }
});

/**
 * @api {get} /auth/github Github
 * @apiName Github
 * @apiGroup Auth
 *
 * @apiParam {String} client_id Empty.
 * @apiParam {String} redirect_uri Empty.
 * 
 */
router.get('/github', (req: Request, res: Response, next: Function) => {
    let authService = getAuthService();
    let auth = authService.createClientAuths(req.query.client_id, req.query.redirect_uri);
    var uri = auth.githubAuth.code.getUri();
    res.redirect(uri);
});

/**
 * @api {get} /auth/google Google
 * @apiName Google
 * @apiGroup Auth
 *
 * @apiParam {String} client_id Empty.
 * @apiParam {String} redirect_uri Empty.
 * 
 */
router.get('/google', (req: Request, res: Response, next: Function) => {
    let authService = getAuthService();
    let auth =  authService.createClientAuths(req.query.client_id, req.query.redirect_uri);
    var uri = auth.googleAuth.code.getUri();
    res.redirect(uri);
});

/**
 * @api {get} /auth/github/callback Github Callback
 * @apiName Github Callback
 * @apiGroup Auth
 *
 * @apiParam {String} code Empty.
 * @apiParam {String} state Empty.
 * 
 */
router.get('/github/callback', (req: Request, res: Response, next: Function) => {
    let authService = getAuthService();
    let auth =  authService.createClientAuths(null, null);
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
                    return res.send('An Error Occurred');
                }
            });
        }).catch((err: Error) => {
            return res.send(err.message);
        });
});


/**
 * @api {get} /auth/google/callback Google Callback
 * @apiName Google Callback
 * @apiGroup Auth
 *
 * @apiParam {String} code Empty.
 * @apiParam {String} state Empty.
 * 
 */
router.get('/google/callback', (req: Request, res: Response, next: Function) => {
    let authService = getAuthService();
    let decodedState = authService.decodeState(req.query.state);
    let auth =  authService.createClientAuths(decodedState.clientId, decodedState.redirectUri);
    auth.googleAuth.code.getToken(req.originalUrl)
        .then((user: any) => {
            request('https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=' + user.accessToken, (error, response, body) => {
                if (!error && response.statusCode == 200) {
                    
                    let token = authService.authorize(decodedState.clientId, JSON.parse(body).email);
                    res.redirect(decodedState.redirectUri + '?token=' + token);
                } else {
                    return res.send('An Error Occurred');
                }
            });
        }).catch((err: Error) => {
            return res.send(err.message);
        });
});

function getAuthService() {
    let authService = new AuthService(config.baseUri, config.jwt.secret, config.jwt.issuer, config.oauth, config.mongoDb);
    return authService;
}


export = router;
