// Imports
import { Express, Request, Response } from "express";
import * as express from 'express';

// Adds headers to enable CORS
export function CORS(req: Request, res: Response, next: Function) {
    res.set('Access-Control-Allow-Origin', '*');
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    res.set('Access-Control-Allow-Headers', 'Content-Type, x-client-id, x-client-secret');

    next();
}

// Adds headers to enable CORS
export function allowHeadAndOptions(req: Request, res: Response, next: Function) {

    if (req.method == 'HEAD' || req.method == 'OPTIONS') {
        res.send();
    } else {
        next();
    }
}