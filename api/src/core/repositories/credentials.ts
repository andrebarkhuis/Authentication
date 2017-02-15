// Imports
import * as mongodb from 'mongodb';

// Imports models
import { Credentials } from './../models/credentials';

export class CredentialsRepository {

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

    validate(clientId: string, username: string, password: string): Promise<Boolean> {
        return new Promise((resolve: Function, reject: Function) => {
            let mongoClient = new mongodb.MongoClient();
            mongoClient.connect('mongodb://' + this.mongoDbConfig.server + ':27017/' + this.mongoDbConfig.database, (err: Error, db: mongodb.Db) => {
                if (err) {
                    reject(err);
                } else {
                    var collection = db.collection('credentials');
                    collection.findOne({ clientId: clientId, username: username, password: password }, (err: Error, result: any) => {
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

    findByUsername(clientId: string, username: string): Promise<Credentials> {
        return new Promise((resolve: Function, reject: Function) => {
            let mongoClient = new mongodb.MongoClient();
            mongoClient.connect('mongodb://' + this.mongoDbConfig.server + ':27017/' + this.mongoDbConfig.database, (err: Error, db: mongodb.Db) => {
                if (err) {
                    reject(err);
                } else {
                    var collection = db.collection('credentials');
                    collection.findOne({ clientId: clientId, username: username }, (err: Error, result: any) => {
                        if (err) {
                            reject(err);
                        } else if (result == null) {
                            resolve(null);
                        } else {
                            resolve(new Credentials(result.clientId, result.username, result.emailAddress, result.password));
                        }
                        db.close();
                    });
                }
            });
        });
    }

    findByEmailAddress(clientId: string, emailAddress: string): Promise<Credentials> {
        return new Promise((resolve: Function, reject: Function) => {
            let mongoClient = new mongodb.MongoClient();
            mongoClient.connect('mongodb://' + this.mongoDbConfig.server + ':27017/' + this.mongoDbConfig.database, (err: Error, db: mongodb.Db) => {
                if (err) {
                    reject(err);
                } else {
                    var collection = db.collection('credentials');
                    collection.findOne({ clientId: clientId, emailAddress: emailAddress }, (err: Error, result: any) => {
                        if (err) {
                            reject(err);
                        } else if (result == null) {
                            resolve(null);
                        } else {
                            resolve(new Credentials(result.clientId, result.username, result.emailAddress, result.password));
                        }
                        db.close();
                    });
                }
            });
        });
    }

    create(clientId: string, username: string, emailAddress: string, password: string): Promise<Boolean> {
        return new Promise((resolve: Function, reject: Function) => {
            let mongoClient = new mongodb.MongoClient();
            mongoClient.connect('mongodb://' + this.mongoDbConfig.server + ':27017/' + this.mongoDbConfig.database, (err: Error, db: mongodb.Db) => {
                if (err) {
                    reject(err);
                } else {
                    var collection = db.collection('credentials');
                    collection.insertOne({
                        clientId: clientId,
                        username: username,
                        emailAddress: emailAddress,
                        password: password
                    }, (err: Error, result: any) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(true);
                        }
                        db.close();
                    });
                }
            });
        });
    }

    list(clientId: string): Promise<Credentials[]> {
        return new Promise((resolve: Function, reject: Function) => {
            let mongoClient = new mongodb.MongoClient();
            mongoClient.connect('mongodb://' + this.mongoDbConfig.server + ':27017/' + this.mongoDbConfig.database, (err: Error, db: mongodb.Db) => {
                if (err) {
                    reject(err);
                } else {
                    var collection = db.collection('credentials');
                    collection.find({
                        clientId: clientId
                    }).toArray((err, result) => {
                        resolve(result);
                        db.close();
                    });
                }
            });
        });
    }
}