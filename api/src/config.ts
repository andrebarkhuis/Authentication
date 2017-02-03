export var config = {
    // Hosted endpoint of api
    baseUri: 'http://localhost:9009',
    // Hosted port of api
    port: 9009,
    // Configurations for JWT of api
    jwt: {
        issuer: 'DevelopersWorkspace.Authentication',
        secret: 'hello_world'
    },
    // Configurations for Web UI
    web: {
        uri: 'http://localhost:4300'
    },
    // Configurations for supported OAuth2 of api
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
    // Configurations for MongoDb of api
    mongoDb: {
        server: 'localhost',
        database: 'authentication'
    },
    // Admin Site Configurations
    admin: {
        jwt: {
         issuer: 'DevelopersWorkspace.Authentication.Admin',
         secret: 'hello_world_admin'   
        }
    },
    // Super Admin Site Configurations
    superadmin: {
        jwt: {
         issuer: 'DevelopersWorkspace.Authentication.SuperAdmin',
         secret: 'hello_world_superadmin'   
        }
    },
}