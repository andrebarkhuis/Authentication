// Imports
import { Express, Request, Response } from "express";

// Import core services
import { ClientService } from './../../core/services/client';

// Import core repositories
import { ClientRepository } from './../../core/repositories/client';

// Import configuration file
import { config } from './../config';


// Middleware: Requires 'x-client-id' and 'x-client-secret' which is validated against the ClientService
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

// Get Instance of ClientService
function getClientService() {
    let clientRepository = new ClientRepository(config.mongoDb);
    let clientService = new ClientService(clientRepository, config.admin.jwt.issuer, config.admin.jwt.secret);
    return clientService;
}
