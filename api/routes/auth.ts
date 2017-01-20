/// <reference path="./../typings/index.d.ts"/>
import { Express, Request, Response } from "express";
import { config } from './../config';
import { AuthService } from './../../core/services/auth';
import * as clientOAuth2 from 'client-oauth2';

let express = require('express');
let router = express.Router();

let githubAuth = new clientOAuth2({
    clientId: '2e5099132d37735f7e1e',
    clientSecret: '29d9ab22b8445f04808bd142dc1550adc0e0082a',
    accessTokenUri: 'https://github.com/login/oauth/access_token',
    authorizationUri: 'https://github.com/login/oauth/authorize',
    redirectUri: 'http://localhost:9009/api/auth/github/callback',
    scopes: 'user:email'
}, null)

router.get('/authorize', function (req: Request, res: Response, next: Function) {
    let authService = new AuthService();
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


router.get('/token', function (req: Request, res: Response, next: Function) {
    let authService = new AuthService();
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


router.get('/github', function (req, res) {
    var uri = githubAuth.code.getUri();
    res.redirect(uri);
});

router.get('/github/callback', function (req, res) {
    githubAuth.code.getToken(req.originalUrl)
        .then((user: any) => {
            console.log(user);

            return res.send(user.accessToken);
        }).catch((err: Error) => {
            return res.send('a');
        });
});

export = router;
