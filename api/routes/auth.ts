/// <reference path="./../typings/index.d.ts"/>
import { Express, Request, Response } from "express";
import { config } from './../config';
import { AuthService } from './../../core/services/auth';
import * as base64 from 'base-64';
import * as utf8 from 'utf8';
import * as clientOAuth2 from 'client-oauth2';

let express = require('express');
let router = express.Router();


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
    let auth = createAuth(req.query.uri);
    var uri = auth.githubAuth.code.getUri();
    res.redirect(uri);
});

router.get('/google', function (req, res) {
    let auth = createAuth(req.query.uri);
    var uri = auth.googleAuth.code.getUri();
    res.redirect(uri);
});

router.get('/github/callback', function (req, res) {
    let auth = createAuth('');
    auth.githubAuth.code.getToken(req.originalUrl)
        .then((user: any) => {
            console.log(user);

            return res.send(user.accessToken);
        }).catch((err: Error) => {
            return res.send('a');
        });
});

router.get('/google/callback', function (req, res) {
    let auth = createAuth('');
    auth.googleAuth.code.getToken(req.originalUrl)
        .then((user: any) => {
            console.log(user);

            return res.send(user.accessToken);
        }).catch((err: Error) => {
            return res.send('a');
        });
});


function createAuth(redirectUri: string) {

    var bytes = utf8.encode(redirectUri);
    var encodedRedirectUri = base64.encode(bytes);

    let githubAuth = new clientOAuth2({
        clientId: '2e5099132d37735f7e1e',
        clientSecret: '29d9ab22b8445f04808bd142dc1550adc0e0082a',
        accessTokenUri: 'https://github.com/login/oauth/access_token',
        authorizationUri: 'https://github.com/login/oauth/authorize',
        redirectUri: 'http://localhost:9009/api/auth/github/callback',
        scopes: 'user:email',
        state: encodedRedirectUri
    }, null);

    let googleAuth = new clientOAuth2({
        clientId: '136693745519-hl3n0m72r4hpc1vpc49kgg804120vv5t.apps.googleusercontent.com',
        clientSecret: 'ily5DezHxdqm4xXrsqBIZ9pn',
        accessTokenUri: 'https://www.googleapis.com/oauth2/v4/token',
        authorizationUri: 'https://accounts.google.com/o/oauth2/v2/auth',
        redirectUri: 'http://localhost:9009/api/auth/google/callback',
        scopes: 'https://www.googleapis.com/auth/userinfo.email',
        state: encodedRedirectUri
    }, null);

    return {
        githubAuth: googleAuth,
        googleAuth: googleAuth
    };
}

export = router;
