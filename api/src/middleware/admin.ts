// Imports
import { Express, Request, Response } from "express";

// Import core services
import { ClientService } from './../core/services/client';

// Import core repositories
import { ClientRepository } from './../core/repositories/client';

// Import configuration file
import { config } from './../config';


export function requiresAdmin(req: Request, res: Response, next: Function) {

    if (req.originalUrl == '/api/credentials/register') {
        next();
        return;
    }

    let clientService = getAdminClientService();
    if (req.get('x-client-id') != null && req.get('x-client-secret') != null) {
        clientService.validate(req.get('x-client-id'), req.get('x-client-secret')).then((result) => {
            if (result == false) {
                res.status(401).json({
                    success: false,
                    message: 'Unauthorized'
                });
            } else {
                next();
            }
        }).catch((err: Error) => {
            res.status(500).json({
                success: false,
                message: err.message
            });
        });
    } else if (req.get('Authorization') != null) {
        let authorizationHeader = req.get('Authorization');
        let jwt = authorizationHeader.split(' ')[1];
        let isValid = clientService.validateJSONWebToken(jwt);
        if (isValid) {
            clientService.create(req.body.name).then((result: any) => {
                res.json(result);
            }).catch((err: Error) => {
                res.status(500).json({
                    success: false,
                    message: err.message
                });
            });
        } else {
            res.status(401).json({
                success: false,
                message: 'Invalid jwt token'
            });
        }
    } else {
        res.status(401).json({
            success: false,
            message: 'Unauthorized'
        });
    }
}


export function requiresSuperAdmin(req: Request, res: Response, next: Function) {
    let clientService = getSuperAdminClientService();
    if (req.get('x-client-id') != null && req.get('x-client-secret') != null) {
        clientService.validate(req.get('x-client-id'), req.get('x-client-secret')).then((result) => {
            if (result == false) {
                res.status(401).json({
                    success: false,
                    message: 'Unauthorized'
                });
            } else {
                next();
            }
        }).catch((err: Error) => {
            res.status(500).json({
                success: false,
                message: err.message
            });
        });
    } else if (req.get('Authorization') != null) {
        let authorizationHeader = req.get('Authorization');
        let jwt = authorizationHeader.split(' ')[1];
        let isValid = clientService.validateJSONWebToken(jwt);
        if (isValid) {
            clientService.create(req.body.name).then((result: any) => {
                res.json(result);
            }).catch((err: Error) => {
                res.status(500).json({
                    success: false,
                    message: err.message
                });
            });
        } else {
            res.status(401).json({
                success: false,
                message: 'Invalid jwt token'
            });
        }
    } else {
        res.status(401).json({
            success: false,
            message: 'Unauthorized'
        });
    }
}


// Get Instance of ClientService
function getAdminClientService() {
    let clientRepository = new ClientRepository(config.mongoDb);
    let clientService = new ClientService(clientRepository, config.admin.jwt.issuer, config.admin.jwt.secret);
    return clientService;
}


// Get Instance of ClientService
function getSuperAdminClientService() {
    let clientRepository = new ClientRepository(config.mongoDb);
    let clientService = new ClientService(clientRepository, config.superadmin.jwt.issuer, config.superadmin.jwt.secret);
    return clientService;
}
