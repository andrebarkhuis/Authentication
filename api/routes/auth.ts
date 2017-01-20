/// <reference path="./../typings/index.d.ts"/>
import { Express, Request, Response } from "express";

let express = require('express');
let router = express.Router();

router.get('/authorize', function (req: Request, res: Response, next: Function) {
   res.send('hello world');
});

export = router;
