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
            reject(new Error('Not Implemented.'));
        });
    }

    findByIdAndSecret(id: string, secret: string) {
        return new Promise((resolve: Function, reject: Function) => {
            if (id == 'lCve1IH1HN' && secret == 'wGnysHvTAX') {
                resolve(new Client('Developer\'s Workspace', 'lCve1IH1HN', 'wGnysHvTAX'));
            } else {
                resolve(null);
            }
        });
    }

    findById(id: string) {
        return new Promise((resolve: Function, reject: Function) => {
            if (id == 'lCve1IH1HN') {
                resolve(new Client('Developer\'s Workspace', 'lCve1IH1HN', 'wGnysHvTAX'));
            } else {
                resolve(null);
            }
        });
    }
}