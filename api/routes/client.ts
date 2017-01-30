// Imports 
import { Express, Request, Response } from "express";
import request from 'request';

// Imports core services 
import { ClientService } from './../../core/services/client';

// Import core repositories
import { ClientRepository } from './../../core/repositories/client';

// Import configuration file
import { config } from './../config';

let express = require('express');
let router = express.Router();

/**
 * @api {post} /client/create CREATE A NEW CLIENT
 * @apiName ClientCreate
 * @apiGroup Client
 *
 * @apiHeader {String} Authorization Empty.
 * 
 * @apiParam {String} name Empty.
 * 
 * @apiSuccess {Boolean} success Empty.
 * @apiSuccess {String} message Empty.
 *
 */
router.post('/create', (req: Request, res: Response, next: Function) => {
    let clientService = getClientService();
    let authorizationHeader = req.get('Authorization');

    if (authorizationHeader == null) {
        res.json({
            success: false,
            message: 'No jwt token provided'
        });
    } else {
        let jwt = authorizationHeader.split(' ')[1];
        let isValid = clientService.validateJSONWebToken(jwt);

        if (isValid) {
            clientService.create(req.body.name).then((result: any) => {
                res.json(result);
            }).catch((err: Error) => {
                res.json({
                    success: false,
                    message: err.message
                });
            });
        } else {
            res.json({
                success: false,
                message: 'Invalid jwt token'
            });
        }
    }
});


// Get Instance of ClientService
function getClientService() {
    let clientRepository = new ClientRepository(config.mongoDb);
    let clientService = new ClientService(clientRepository, config.admin.jwt.issuer, config.admin.jwt.secret);
    return clientService;
}


export = router;
