/// <reference path="./../typings/index.d.ts"/>
import { Express, Request, Response } from "express";
import { config } from './../config';
import { AuthService } from './../../core/services/auth';

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

export = router;
