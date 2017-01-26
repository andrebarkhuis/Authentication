import { Express, Request, Response } from "express";
import { config } from './../config';
import { UserService } from './../../core/services/user';
import { ClientService } from './../../core/services/client';
import { CredentialsRepository } from './../../core/repositories/credentials';
import { ClientRepository } from './../../core/repositories/client';
import * as request from 'request';

let express = require('express');
let router = express.Router();

/**
 * @api {post} /user/create CREATE A NEW USER
 * @apiName UserCreate
 * @apiGroup User
 *
 * @apiHeader {String} x-client-id Empty.
 * @apiHeader {String} x-client-secret Empty.
 * 
 * @apiParam {String} username Empty.
 * @apiParam {String} password Empty.
 * 
 * @apiSuccess {Boolean} success Empty.
 * @apiSuccess {String} message Empty.
 *
 */
router.post('/create', (req: Request, res: Response, next: Function) => {
    let userService = getUserService();
    let clientService = getClientService();

    clientService.validate(req.get('x-client-id'), req.get('x-client-secret')).then((result) => {

        if (result == true) {

            userService.create(req.get('x-client-id'), req.body.username, req.body.password).then((result) => {
                res.json({
                    success: true,
                    message: null
                });
            }).catch((err: Error) => {
                res.json({
                    success: false,
                    message: err.message
                });
            });
        } else {
            throw Error('Invalid client credentials.');
        }
    }).catch((err: Error) => {
        res.json({
            success: false,
            message: err.message
        });
    });



});

function getUserService() {
    let credentialsRepository = new CredentialsRepository(config.mongoDb);
    let userService = new UserService(credentialsRepository);
    return userService;
}

function getClientService() {
    let clientRepository = new ClientRepository(config.mongoDb);
    let clientService = new ClientService(clientRepository);
    return clientService;
}


export = router;
