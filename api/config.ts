export var config = {
    baseUri: 'http://api.developersworkspace.co.za',
    admin: {
        jwt: {
         issuer: null,
         secret: null   
        }
    },
    jwt: {
        issuer: 'DevelopersWorkspace.Authentication.Admin',
        secret: 'uZpCvyHZLn'
    },
    web: {
        uri: 'http://authentication.developersworkspace.co.za'
    },
    oauth: {
        github: {
            clientId: '2e5099132d37735f7e1e',
            clientSecret: '29d9ab22b8445f04808bd142dc1550adc0e0082a'
        },
        google: {
            clientId: '136693745519-hl3n0m72r4hpc1vpc49kgg804120vv5t.apps.googleusercontent.com',
            clientSecret: 'ily5DezHxdqm4xXrsqBIZ9pn'
        }
    },
    mongoDb: {
        server: 'mongo',
        database: 'authentication'
    }
}