// Imports 
import { Express, Request, Response } from "express";
import request from 'request';

// Imports core services 
import { ClientService } from './../core/services/client';

// Import core repositories
import { ClientRepository } from './../core/repositories/client';

// Import configuration file
import { config } from './../config';

import * as express from 'express';
let router = express.Router();

/**
 * @api {get} /data/clients RETRIEVE LIST OF CLIENTS
 * @apiName DataClients
 * @apiGroup Data
 * 
 * @apiSuccess {Object[]} response Empty.
 *
 */
router.get('/clients', (req: Request, res: Response, next: Function) => {
    let clientService = getClientService();

    res.json([
        {
            id: '6465372126',
            text: 'Test Client 1'
        },
        {
            id: '2779146558',
            text: 'Test Client 2'
        },
        {
            id: '3931190214',
            text: 'Test Client 3'
        },
        {
            id: '1644878404',
            text: 'Test Client 4'
        }
    ]);
});


/**
 * @api {get} /data/validateUsername VALIDATES USERNAME
 * @apiName DataValidateUsername
 * @apiGroup Data
 * 
 * @apiParam {String} username Empty.
 * @apiParam {String} clientId Empty.
 * 
 * @apiSuccess {Boolean} isValid Empty.
 * @apiSuccess {String} message Empty.
 *
 */
router.get('/validateUsername', (req: Request, res: Response, next: Function) => {
    let clientService = getClientService();

    res.json({
        isValid: false,
        message: 'Username already exists'
    });
});


// Get Instance of ClientService
function getClientService() {
    let clientRepository = new ClientRepository(config.mongoDb);
    let clientService = new ClientService(clientRepository, config.admin.jwt.issuer, config.admin.jwt.secret);
    return clientService;
}


export = router;
