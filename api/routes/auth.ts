/// <reference path="./../typings/index.d.ts"/>
import { Express, Request, Response } from "express";
import { config } from './../config';
import { AuthService } from './../../core/services/auth';
import * as request from 'request';

let express = require('express');
let router = express.Router();

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


router.get('/verify', (req: Request, res: Response, next: Function) => {
    let authService = getAuthService();
    let result = authService.verify(req.query.token);

    res.json(result);
});

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

router.get('/github', (req: Request, res: Response, next: Function) => {
    let authService = getAuthService();
    let auth = authService.createClientAuths(req.query.client_id, req.query.redirect_uri);
    var uri = auth.githubAuth.code.getUri();
    res.redirect(uri);
});

router.get('/google', (req: Request, res: Response, next: Function) => {
    let authService = getAuthService();
    let auth =  authService.createClientAuths(req.query.client_id, req.query.redirect_uri);
    var uri = auth.googleAuth.code.getUri();
    res.redirect(uri);
});

router.get('/github/callback', (req: Request, res: Response, next: Function) => {
    let authService = getAuthService();
    let auth =  authService.createClientAuths(req.query.client_id, req.query.redirect_uri);
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

router.get('/google/callback', (req: Request, res: Response, next: Function) => {
    let authService = getAuthService();
    let auth =  authService.createClientAuths(null, null);
    auth.googleAuth.code.getToken(req.originalUrl)
        .then((user: any) => {
            request('https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=' + user.accessToken, (error, response, body) => {
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

function getAuthService() {
    let authService = new AuthService(config.baseUri, config.jwt.secret, config.jwt.issuer, config.oauth, config.mongoDb);
    return authService;
}


export = router;
