// Imports 
import { Express, Request, Response } from "express";
import request from 'request';
import * as mongodb from 'mongodb';

// Imports services 
import { ClientService } from './../core/services/client';
import { CredentialsService } from './../core/services/credentials';

// Imports repositories
import { ClientRepository } from './../core/repositories/client';
import { CredentialsRepository } from './../core/repositories/credentials';

// Imports configuration file
import { config } from './../config';

import * as express from 'express';
let router = express.Router();

/**
 * @api {post} /credentials/create CREATE A NEW CREDENTIALS
 * @apiName CredentialsCreate
 * @apiGroup Credentials
 *
 * @apiHeader {String} x-client-id Empty.
 * @apiHeader {String} x-client-secret Empty.
 * 
 * @apiParam {String} username Empty.
 * @apiParam {String} emailAddress Empty.
 * @apiParam {String} password Empty.
 * 
 * @apiSuccess {Boolean} success Empty.
 * @apiSuccess {String} message Empty.
 *
 */
router.post('/create', (req: Request, res: Response, next: Function) => {
    let credentialsService = getCredentialsService();
    let clientService = getClientService();

    credentialsService.create(req.get('x-client-id'), req.body.username, req.body.username, req.body.password).then((result) => {
        res.json({
            success: true,
            message: null
        });
    }).catch((err: Error) => {
        res.status(500).json({
            success: false,
            message: err.message
        });
    });
});


/**
 * @api {get} /credentials/list RETRIEVE LIST OF CREDENTIALS
 * @apiName CredentialsList
 * @apiGroup Credentials
 *
 * @apiHeader {String} x-client-id Empty.
 * @apiHeader {String} x-client-secret Empty.
 * 
 * @apiSuccess {Object[]} response Empty.
 *
 */
router.get('/list', (req: Request, res: Response, next: Function) => {
    let credentialsService = getCredentialsService();
    let clientService = getClientService();

    credentialsService.list(req.get('x-client-id')).then((result) => {
        res.json(result);
    }).catch((err: Error) => {
        res.status(500).json({
            success: false,
            message: err.message
        });
    });
});


/**
 * @api {get} /credentials/validateUsername VALIDATES USERNAME
 * @apiName CredentialsValidateUsername
 * @apiGroup Credentials
 * 
 * @apiParam {String} username Empty.
 * @apiParam {String} clientId Empty.
 * 
 * @apiSuccess {Boolean} isValid Empty.
 * @apiSuccess {String} message Empty.
 *
 */
router.get('/validateUsername', (req: Request, res: Response, next: Function) => {
    
    let credentialsService = getCredentialsService();
    credentialsService.exist(req.get('x-client-id'), req.query.username).then((result) => {
        res.json({
            isValid: result == true? false : true,
            message: result == true? 'Username already exist' : null
        });
    }).catch((err: Error) => {
        res.status(500).json({
            success: false,
            message: err.message
        });
    });
});

/**
 * @api {post} /credentials/register CREATE A NEW CREDENTIALS
 * @apiName CredentialsRegister
 * @apiGroup Credentials
 * 
 * @apiParam {String} clientId Empty.
 * @apiParam {String} username Empty.
 * @apiParam {String} emailAddress Empty.
 * @apiParam {String} password Empty.
 * 
 * @apiSuccess {Boolean} success Empty.
 * @apiSuccess {String} message Empty.
 *
 */
router.post('/register', (req: Request, res: Response, next: Function) => {
    let credentialsService = getCredentialsService();
    let clientService = getClientService();
    
    credentialsService.create(req.body.clientId, req.body.username, req.body.emailAddress, req.body.password).then((result) => {
        res.json({
            success: true,
            message: null
        });
    }).catch((err: Error) => {
        res.status(500).json({
            success: false,
            message: err.message
        });
    });
});


// Get Instance of UserService
function getCredentialsService() {
    let mongoClient = new mongodb.MongoClient();
    let credentialsRepository = new CredentialsRepository(config.mongoDb, mongoClient);
    let credentialsService = new CredentialsService(credentialsRepository);
    return credentialsService;
}

// Get Instance of ClientService
function getClientService() {
    let mongoClient = new mongodb.MongoClient();
    let clientRepository = new ClientRepository(config.mongoDb, mongoClient);
    let clientService = new ClientService(clientRepository, config.admin.jwt.issuer, config.admin.jwt.secret);
    return clientService;
}


export = router;