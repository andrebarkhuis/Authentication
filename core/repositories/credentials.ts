import * as mongodb from 'mongodb';

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

    validate(clientId: string, username: string, password: string) {
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

    findByUsername(clientId: string, username: string) {
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
                        } else {
                            resolve(result);
                        }
                        db.close();
                    });
                }
            });
        });
    }

    create(clientId: string, username: string, password: string) {
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
                        password: password
                    }, (err: Error, result: any) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve();
                        }
                        db.close();
                    });
                }
            });
        });
    }

}