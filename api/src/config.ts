export var config = {
    // Hosted endpoint of api
    baseUri: 'http://authentication.developersworkspace.co.za:9009',
    // Hosted port of api
    port: 9009,
    // Configurations for JWT of api
    jwt: {
        issuer: 'DevelopersWorkspace.Authentication',
        secret: 'hello_world'
    },
    // Configurations for Web UI
    web: {
        uri: 'http://authentication.developersworkspace.co.za:9010'
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
        server: 'mongo',
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
    // Default client configurations
    defaultClientId: '87025144872751362692',
    defaultClientSecret: '69447957834022926586',
    // App Settings Configurations
    appSettings: {
        allowSelfRegistration: true
    }
}