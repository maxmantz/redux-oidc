# redux-oidc

A rewrite is in process. Preliminary docs will be published soon.

### Reasons for the rewrite
- the old version was relying on the `oidc-token-manager` which was not npm compliant and had to be manually maintained, this version now uses the [oidc-client-js](https://github.com/IdentityModel/oidc-client-js/tree/dev) library which is written in ES6, fully tested and npm compatible,
- the old version also relied heavily on creating new instances of the token manager, which could cause unexpected behavior when more than one instance was active at the same time,
- the old version had nothing which pronounced the *redux* in `oidc-redux`. This version offers a reducer including dispatchable actions to handle OIDC interactions.

### Installation
`npm install --save redux-oidc`

### Description

This package handles [OpenID-Connect](http://openid.net/connect/) authentication in [redux](http://redux.js.org/) apps. It enables redux apps to authenticate with an external OIDC authentication provider and handles the actions of the OpenID [implicit flow](http://openid.net/specs/openid-connect-implicit-1_0.html).

It is built upon the [oidc-client-js](https://github.com/IdentityModel/oidc-client-js/tree/dev) library.

It contains the following parts:
- *token middleware*: [redux middleware]() to automatically check whether or not the current user is signed in & trigger the authentication flow,
- *CallbackComponent*: A react component processing the callback from the OpenID-Connect provider,
- *reducers & actions*: reducers and actions to handle OIDC events,
- *helpers*: create helpers to manage the oidc-client-js library

### Documentation

Check out the [wiki](https://github.com/maxmantz/redux-oidc/wiki) for further information.

### Tests
`npm run test`
