# redux-oidc
[![Build Status](https://travis-ci.org/maxmantz/redux-oidc.svg?branch=master)](https://travis-ci.org/maxmantz/redux-oidc)

A package for managing OpenID-Connect authentication in ReactJS / Redux apps. It wraps the popular oidc-client library to redux actions and reducers.

### Description

This package handles [OpenID-Connect](http://openid.net/connect/) authentication in [redux](http://redux.js.org/) apps. It enables redux apps to authenticate with an external OIDC authentication provider and handles the actions of the OpenID [implicit flow](http://openid.net/specs/openid-connect-implicit-1_0.html) or [authorization code flow](https://developer.okta.com/blog/2018/04/10/oauth-authorization-code-grant-type).

It uses the oidc-client-js library to manage OpenID Connect functionality.

It contains the following parts:
- *CallbackComponent*: A react component processing the signin callback from the OpenID-Connect provider,
- *SignoutCallbackComponent*: A react component processing the signout callback from the OpenID-Connect provider,
- *reducers & actions*: reducers and actions to handle OIDC events,
- *helpers*: create helpers to manage the oidc-client-js library

### Installation
`npm install --save redux-oidc`

#### Peer dependencies
This package wraps [oidc-client-ts](https://github.com/authts/oidc-client-ts) to use with ReactJS / Redux apps.
Install oidc-client like this:

`npm install --save oidc-client-ts`

In addition there is an optional dependency for [immutable.js](https://facebook.github.io/immutable-js/), if you want to use it.

### Version 4 released

*BREAKING CHANGE*: 
 - Replace oidc-client with oidc-client-ts package
 - Update peer dependency to support React 16, 17 & 18
 - Replace Webpack bundler with Vite
 - Replace mocha, sinon with Vitest
 - Update the [example app](https://github.com/founding-partner/redux-oidc-example) to work with `Vite` bunder, make sure to check its `README.md` file for the changes done. 
   - There is a catch in it, for the google auth to work, i have npm aliased `oidc-client` package in place of `oidc-client-ts`.
 - `immutable` is no longer a dependency. If you are using the immutable reducer, please check out the [docs](https://github.com/maxmantz/redux-oidc/blob/master/docs/API.md#immutable-reducer).

#### Documentation
You can find the docs for version 3 here:
- [API docs](docs/API.md),
- [actions](docs/Actions.md),
- [example app](https://github.com/founding-partner/redux-oidc-example)

#### Note for react-native users
This library doesn't fully support react-native apps. Please use [this](https://github.com/FormidableLabs/react-native-app-auth) library instead.

### Version 2

Check out the [wiki](https://github.com/maxmantz/redux-oidc/wiki) for further information for Version 2 (deprecated).

### Sample app
There is a sample application demonstrating the use of this package [here](https://github.com/founding-partner/redux-oidc-example).

### Tests
You have to install immutableJS for all the tests to pass: `npm install immutable --no-save`.
Then run `npm run test`.
