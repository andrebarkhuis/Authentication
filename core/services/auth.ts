import * as uuid from 'uuid';
import * as jwt from 'jsonwebtoken';
import { config } from './../config';

export class AuthService {

    authorize(clientId: string, username: string) {
        let token = jwt.sign({ username: username }, config.jwt.secret, {
            expiresIn: 3600,
            audience: clientId,
            issuer: config.jwt.issuer,
            jwtid: uuid.v4()
        });

        return token;
    }

    verify(token: string) {
        try {
            let decoded = jwt.verify(token, config.jwt.secret, {
                issuer: config.jwt.issuer
            });
            return true;
        } catch (err) {
            return false;
        }
    }

    authenticate(clientId: string, username: string, password: string) {
        return true;
    }
}