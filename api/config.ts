export var config = {
    baseUri: 'http://localhost:9009',
    admin: {
        jwt: {
         issuer: 'DevelopersWorkspace.Authentication.Admin',
         secret: 'hello_world_admin'   
        }
    },
    jwt: {
        issuer: 'DevelopersWorkspace.Authentication',
        secret: 'hello_world'
    },
    web: {
        uri: 'http://localhost:4300'
    },
    oauth: {
        github: {
            clientId: '',
            clientSecret: ''
        },
        google: {
            clientId: '',
            clientSecret: ''
        }
    },
    mongoDb: {
        server: 'localhost',
        database: 'authentication'
    }
}