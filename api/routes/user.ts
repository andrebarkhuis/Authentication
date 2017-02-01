// Imports 
import { Express, Request, Response } from "express";
import request from 'request';

// Imports core services 
import { ClientService } from './../../core/services/client';
import { UserService } from './../../core/services/user';

// Import core repositories
import { ClientRepository } from './../../core/repositories/client';
import { CredentialsRepository } from './../../core/repositories/credentials';

// Import configuration file
import { config } from './../config';

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
});


/**
 * @api {get} /user/list RETRIEVE LIST OF USERS
 * @apiName UserList
 * @apiGroup User
 *
 * @apiHeader {String} x-client-id Empty.
 * @apiHeader {String} x-client-secret Empty.
 * 
 * @apiSuccess {Object[]} response Empty.
 *
 */
router.get('/list', (req: Request, res: Response, next: Function) => {
    let userService = getUserService();
    let clientService = getClientService();

    userService.list(req.get('x-client-id')).then((result) => {
        res.json(result);
    }).catch((err: Error) => {
        res.json({
            success: false,
            message: err.message
        });
    });
});

// Get Instance of UserService
function getUserService() {
    let credentialsRepository = new CredentialsRepository(config.mongoDb);
    let userService = new UserService(credentialsRepository);
    return userService;
}

// Get Instance of ClientService
function getClientService() {
    let clientRepository = new ClientRepository(config.mongoDb);
    let clientService = new ClientService(clientRepository, config.admin.jwt.issuer, config.admin.jwt.secret);
    return clientService;
}


export = router;