// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `angular-cli.json`.

export const environment = {
  production: false,
  api: {
    uri: 'http://localhost:9009/api'
  },
  clientId: '852c700c-d072-4ffb-a3a3-aae6bd5e53f8',
  clientSecret: '0ebfe548-f599-4296-b0ab-787fba3e1668'
};
