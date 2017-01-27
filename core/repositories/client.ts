import * as mongodb from 'mongodb';
import { Client } from './../models/client';

export class ClientRepository {

    constructor(private mongoDbConfig: any) { }

    clear() {
        return new Promise((resolve: Function, reject: Function) => {
            let mongoClient = new mongodb.MongoClient();
            mongoClient.connect('mongodb://' + this.mongoDbConfig.server + ':27017/' + this.mongoDbConfig.database, (err: Error, db: mongodb.Db) => {
                if (err) {
                    reject(err);
                } else {
                    db.dropDatabase().then((result) => {
                        resolve();
                        db.close();
                    }).catch((err: Error) => {
                        reject(err);
                        db.close();
                    });
                }
            });
        });
    }

    create(name: string, id: string, secret: string) {
        return new Promise((resolve: Function, reject: Function) => {
            let mongoClient = new mongodb.MongoClient();
            mongoClient.connect('mongodb://' + this.mongoDbConfig.server + ':27017/' + this.mongoDbConfig.database, (err: Error, db: mongodb.Db) => {
                if (err) {
                    reject(err);
                } else {
                    var collection = db.collection('clients');
                    collection.insertOne({ clientId: id, clientSecret: secret, name: name }, (err: Error, result: any) => {
                        if (err) {
                            reject(err);
                        } else {
                            if (result == null) {
                                resolve(false);
                            } else {
                                resolve(true);
                            }
                        }
                        db.close();
                    });
                }
            });
        });
    }

    findByIdAndSecret(id: string, secret: string) {
        return new Promise((resolve: Function, reject: Function) => {
            let mongoClient = new mongodb.MongoClient();
            mongoClient.connect('mongodb://' + this.mongoDbConfig.server + ':27017/' + this.mongoDbConfig.database, (err: Error, db: mongodb.Db) => {
                if (err) {
                    reject(err);
                } else {
                    var collection = db.collection('clients');
                    collection.findOne({ clientId: id, clientSecret: secret }, (err: Error, result: any) => {
                        if (err) {
                            reject(err);
                        } else if (result == null) {
                            resolve(null);
                        } else {
                            resolve(new Client(result.name, result.clientId, result.clientSecret));
                        }
                        db.close();
                    });
                }
            });
        });
    }
}