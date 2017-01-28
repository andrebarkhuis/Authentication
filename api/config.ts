export var config = {
    baseUri: 'http://api.worldofrations.com',
    admin: {
        jwt: {
         issuer: 'DevelopersWorkspace.Authentication.Admin',
         secret: 'uZpCvyHZLn'   
        }
    },
    jwt: {
        issuer: 'WorldOfRations.Authentication',
        secret: 'ml47Mpyg80'
    },
    web: {
        uri: 'http://authentication.worldofrations.com'
    },
    oauth: {
        github: {
            clientId: '7d1d77e588b7bf51d4ad',
            clientSecret: 'cc385239fcda30ace0be9330ee0afd9e1f64b52d'
        },
        google: {
            clientId: '749471567348-o8fvlu40jadtumao8cgmjotvr0nibuso.apps.googleusercontent.com',
            clientSecret: 'zehw7T5OujXvzcgtTgbDzGI9'
        }
    },
    mongoDb: {
        server: 'localhost',
        database: 'authentication'
    }
}