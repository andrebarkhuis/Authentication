import { config } from './../config';
import { ClientService } from './../../core/services/client';
import { ClientRepository } from './../../core/repositories/client';
import { Express, Request, Response } from "express";

export function requiresAdmin(req: Request, res: Response, next: Function) {
    let clientService = getClientService();
    clientService.validate(req.get('x-client-id'), req.get('x-client-secret')).then((result) => {
        if (result == false) {
            throw Error('Invalid client credentials.');
        } else {
            next();
        }
    }).catch((err: Error) => {
        res.json({
            success: false,
            message: err.message
        });
    });
}


function getClientService() {
    let clientRepository = new ClientRepository(config.mongoDb);
    let clientService = new ClientService(clientRepository, config.admin.jwt.issuer, config.admin.jwt.secret);
    return clientService;
}