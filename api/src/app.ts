// Imports
import express = require("express");
import bodyParser = require("body-parser");

// Imports configuration file
import { config } from './config';

// Imports routes
import * as authRouter from './routes/auth';
import * as credentialsRouter from './routes/credentials';
import * as clientRouter from './routes/client';

// Imports middleware
import {requiresAdmin, requiresSuperAdmin } from './middleware/admin';
import { CORS, allowHead } from './middleware/common';

// Imports repositories
import { ClientRepository } from './core/repositories/client';

export class WebApi {

    constructor(private app: express.Express, private port: number) {
        this.configureMiddleware(app);
        this.configureRoutes(app);
        this.init();
    }

    private init() {
        let clientRepository = new ClientRepository(config.mongoDb);

        clientRepository.findById(config.defaultClientId).then((client) => {
            if (client == null) {
                clientRepository.create('Default Client', config.defaultClientId, config.defaultClientSecret).then((result) => {
                    console.log('Default client created.');
                }).catch((err: Error) => {
                    console.log(err);
                });
            }else {
                 console.log('Default client already exist.');
            }
        });
    }

    private configureMiddleware(app: express.Express) {
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({ extended: false }));
        app.use(CORS);
        app.use(allowHead);
        app.use("/api/credentials", requiresAdmin);
        app.use("/api/client", requiresSuperAdmin);
        
    }

    private configureRoutes(app: express.Express) {
        app.use("/api/auth", authRouter);
        app.use("/api/credentials", credentialsRouter);
        app.use("/api/client", clientRouter);
    }

    public run() {
        this.app.listen(this.port);
    }
}


let port = config.port;
let api = new WebApi(express(), port);
api.run();
console.info(`Listening on ${port}`);