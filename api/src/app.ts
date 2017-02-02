// Imports
import express = require("express");
import bodyParser = require("body-parser");

// Import configuration file
import { config } from './config';

// Import Routes
import * as authRouter from './routes/auth';
import * as credentialsRouter from './routes/credentials';
import * as clientRouter from './routes/client';

// Import middleware
import * as admin from './middleware/admin';
import { CORS } from './middleware/common';

export class WebApi {

    constructor(private app: express.Express, private port: number) {
        this.configureMiddleware(app);
        this.configureRoutes(app);
    }

    private configureMiddleware(app: express.Express) {
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({ extended: false }));
        app.use(CORS);
        app.use("/api/credentials", admin.requiresAdmin);
        
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