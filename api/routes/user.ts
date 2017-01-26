import { Express, Request, Response } from "express";
import { config } from './../config';
import { UserService } from './../../core/services/user';
import { CredentialsRepository } from './../../core/repositories/credentials';
import * as request from 'request';

let express = require('express');
let router = express.Router();

/**
 * @api {post} /user/create CREATE A NEW USER
 * @apiName UserCreate
 * @apiGroup User
 *
 * @apiParam {String} username Empty.
 * @apiParam {String} password Empty.
 * 
 * @apiSuccess {Boolean} success Empty.
 * @apiSuccess {String} message Empty.
 *
 */
router.post('/create', (req: Request, res: Response, next: Function) => {
    let userService = getUserService();
    
    userService.create('', req.body.username, req.body.password).then((result) => {
        res.json({
            success: true,
            message: null
        });
    }).catch((err: Error) => {
        res.json({
            success: false,
            message: err.message
        });
    });

});

function getUserService() {
    let credentialsRepository = new CredentialsRepository(config.mongoDb);
    let userService = new UserService(credentialsRepository);
    return userService;
}


export = router;
