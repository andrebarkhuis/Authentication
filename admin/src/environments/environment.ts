// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `angular-cli.json`.

export const environment = {
  production: false,
  api: {
    uri: 'http://localhost:9009/api'
  },
  clientId: '9c9af7e9-87f0-4b31-95d6-af0064c91dd9',
  clientSecret: 'f59fea75-9588-4cb4-852b-c9f2b8c75d8f'
};
