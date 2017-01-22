import express = require("express");
import bodyParser = require('body-parser');
import authRoute = require('./routes/auth');

export class WebApi {
    /**
     * @param app - express application
     * @param port - port to listen on
     */
    constructor(private app: express.Express, private port: number) {
        this.configureMiddleware(app);
        this.configureRoutes(app);
    }

    /**
     * @param app - express application
     */
    private configureMiddleware(app: express.Express) {
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({ extended: false }));
    }

    private configureRoutes(app: express.Express) {
        app.use("/api/auth", authRoute);
    }

    public run() {
        this.app.listen(this.port);
    }
}


let port = 9009;
let api = new WebApi(express(), port);
api.run();
console.info(`listening on ${port}`);