// Imports
import express from 'express';
import bodyParser from 'body-parser';

// Import configuration file
import { config } from './config';

// Import Routes
import authRoute from './routes/auth';
import userRoute from'./routes/user';
import clientRoute from './routes/client';

// Import middleware
import admin from './middleware/admin';

export class WebApi {

    constructor(private app: express.Express, private port: number) {
        this.configureMiddleware(app);
        this.configureRoutes(app);
    }

    private configureMiddleware(app: express.Express) {
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({ extended: false }));
        app.use("/api/user", admin.requiresAdmin);
    }

    private configureRoutes(app: express.Express) {
        app.use("/api/auth", authRoute);
        app.use("/api/user", userRoute);
        app.use("/api/client", clientRoute);
    }

    public run() {
        this.app.listen(this.port);
    }
}


let port = config.port;
let api = new WebApi(express(), port);
api.run();
console.info(`Listening on ${port}`);