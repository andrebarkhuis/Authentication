// Imports 
import { Express, Request, Response } from "express";
import * as express from 'express';
import request from 'request';
import * as mongodb from 'mongodb';

// Imports core services 
import { ClientService } from './../core/services/client';

// Imports repositories
import { ClientRepository } from './../core/repositories/client';

// Imports configuration file
import { config } from './../config';


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
    clientService.create(req.body.name).then((result: any) => {
        res.json(result);
    }).catch((err: Error) => {
        res.status(500).json({
            success: false,
            message: err.message
        });
    });
});


// Get Instance of ClientService
function getClientService() {
    let mongoClient = new mongodb.MongoClient();
    let clientRepository = new ClientRepository(config.mongoDb, mongoClient);
    let clientService = new ClientService(clientRepository, config.superadmin.jwt.issuer, config.superadmin.jwt.secret);
    return clientService;
}


export = router;
