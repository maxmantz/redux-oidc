# redux-oidc
A package for managing the [OpenID Connect](http://openid.net/connect/) authentication flow in [redux](https://github.com/reactjs/redux) apps.

[![Build Status](https://travis-ci.org/maxmantz/redux-oidc.svg?branch=master)](https://travis-ci.org/maxmantz/redux-oidc)

###Installation

`npm install --save redux-oidc`

###Description
This project was created to enable redux apps to use the recommended OpenID-Connect authentication flow for JavaScript apps ([OAuth2 implicit flow](http://oauthlib.readthedocs.org/en/latest/oauth2/grants/implicit.html)). It was created by me to connect my redux app to an API protected by
an [IdentityServer3](https://github.com/IdentityServer/IdentityServer3) authentication service, but it should work with other services as well as long as they are
implementing the OpenID Connect specification.

It uses the [oidc-token-manager](https://github.com/IdentityModel/oidc-token-manager) in the background to manage the calls to the token service.

It contains these parts:
- `TokenMiddleware`: `redux` middleware validating the access token present in `localStorage`.
- `CallbackComponent`: a `React` component to use for processing the token callback by the OpenID-Connect token service.
- `Helper methods`: methods to create `oidc-token-manager` instances and handle logouts.



The combination of these parts does the following in a redux app:
- verify token lifetime at every dispatch or when the provided `shouldValidate` function returns `true`.
- if the access token has expired, dispatch an action (optional) & trigger the authentication flow (OAuth2 implicit flow).
- if authentication was successful, perform an optional callback & redirect to the URI before the authentication flow was triggered (any route within the app),
- if authentication was unsuccessful, trigger an optional callback.
- logout the user via the helper methods provided.

It doesn't (yet) use any reducers as the nature of the OAuth implicit flow requires redirecting the browser to another host, thus losing the redux state in the process.
It does however include a function called `createTokenManager(config)` where you can create an `oidc-token-manager` instance to read data from the token into your reducers.


###Usage

NOTE: If your app runs into an error before the `CallbackComponent` gets rendered, on the next restart the token validation won't get triggered. This is because the redirectUri is stored in `localStorage` for the callback to process, which didn't take place. Simply remove `oidc.redirectTo` from your local storage and validation should trigger once again.

The `oidc-token-manager` stores it's data in local storage under the key `TokenManager.token`. Simply delete this if you wish to log out locally.

*Recommended:* Each `oidc-token-manager` needs a new instance of the configuration object passed into the constructor. Create this object to use it in the middleware and Callback component:

        const tokenManagerConfig = {
            client_id: 'redux-app', // your client id
            redirect_uri: `${window.location.protocol}//${window.location.hostname}:${window.location.port}/callback`, // your callback url
            response_type: 'id_token token', // the response type from the token service
            scope: 'openid profile', // the scopes to include
            authority: 'https://myTokenService.com' // the authority
        };

1. Register the middleware with the redux store.

        import { createStore, applyMiddleware, compose } from 'redux';
        import createTokenMiddleware from 'redux-oidc';
        
        const store = compose(
          applyMiddleware(createTokenMiddleware(tokenManagerConfig)) // call the middleware creator function with the config
        )(createStore);

2. Create a route in your app to point to the `redirect_uri` specified in the `tokenManagerOptions` & registered with the token service. In the component registered at that route,
include the `CallbackComponent`:

        import React from 'react';
        import { CallbackComponent } from 'redux-oidc';
        import { createTokenManagerConfig } from 'helpers';
        
        class CallbackPage extends React.Component {
          
          // this method gets called when the token validation fails
          onTokenValidationError = (error) => {
            console.log('Error getting token:', error);
          }
          
          // pass in custom content to render in the CallbackComponent
          get customContent() {
            return (
              <div>Redirecting...</div>
            );
          }
          
          render() {
            return (
              <CallbackComponent config={createTokenManagerConfig()} errorCallback={this.onTokenValidationError}>
                { this.customContent }
              </CallbackComponent>
            );
          }
        }
        
        export default CallbackPage;

That's all there is to do. 

Optionally you can create a TokenManager instance to read the token information into your reducers: 

        import { createTokenManager } from 'redux-oidc';
        import { createTokenManagerConfig } from 'helpers';
        
        function getInitialState() {
          const manager = createTokenManager(createTokenManagerConfig());
          
          if (!manager.expired) {
            return {
            profile: manager.profile,
            token: manager.access_token,
            ...
            };
          }
          
          return {};
        }
        
        export function myReducer(state = getInitialState(), action) {
          // your reducer logic...
        }

###API
#####`createTokenMiddleware(config, shouldValidate, dispatchOnInvalid)`

        import createTokenMiddleware from 'redux-oidc';
        import { compose, createStore, applyMiddleware } from 'redux';
        
        const config = {/* token manager config */};
        const shouldValidate = (state, action) => true; // this is the default
        const dispatchOnInvalid = { type: 'TOKEN_INVALID' };
        
        const tokenMiddleware = createTokenMiddleware(config, shouldValidate, dispatchOnInvalid);
        const store = compose(
                applyMiddleware(/* other middleware here */, tokenMiddleware)
        )(createStore);

Parameters:
- `config`: **(required)** a config object for the `oidc-token-manager`,
- `shouldValidate`: *(optional)* a function which receives the current `state` & `action` and returns `true` when token validation should occur or `false` when the token should not be validated,
- `dispatchOnInvalid`: *(optional)* a [redux standard action](http://redux.js.org/docs/basics/Actions.html) which is dispatched right before the authentication flow is triggered.

##### `CallbackComponent`

        import React from 'react';
        import { CallbackComponent } from 'redux-oidc';
        
        const config = {/* token manager config */};
        const successCallback = () => console.log('Successfully validated token!');
        const errorCallback = (error) => console.log('Error validating token callback:', error);
        const redirectOnSuccess = true // this is the default
        const customContent = (<div>Redirecting...</div>); // this is the default
        const redirectUri = "https://myAppRoot.com/custom"; // optional
        
        function MyCallbackpage(props) {
          return ( 
                <CallbackComponent 
                  config={config}
                  successCallback={successCallback}
                  errorCallback={errorCallback}
                  redirectOnSuccess={redirectOnSuccess}
                  redirectUri={redirectUri}
                 >
                 { customContent }
                </CallbackComponent>
          );
        }

Parameters:
- `config`: **(required)** a config object for the `oidc-token-manager` ,
- `successCallback`: *(optional)* a function called after the token callback was successful,
- `errorCallback`: *(optional)* a function which is called when the token callback returned an error,
- `redirectOnSuccess`: *(optional)* a boolean indicating whether or not the redirect to the previous url should be triggered,
- `redirectUri`: *(optional)* a custom uri to redirect to after the callback was successful.
  
##### `Helpers`      
The following helper methods are available to you. You can bind them to components like `<button/>`s or to your middleware (sagas, thunks etc.):

`import { createTokenManager, logout, logoutAtIdentityService, triggerAuthFlow } from 'redux-oidc'`

- `createTokenManager(config)`: takes a `config` object and returns an instance of `oidc-token-manager`,
- `logout(redirectTo)`: logs out the user locally redirects the browser to an url provided by `redirectTo`. `redirectTo` is optional,
- `logoutAtIdentityService(config)`: logs out the user at the identity service. Requires `config` object,
- `triggerAuthFlow(config, redirectTo)`: triggers the auth flow usually triggered by the middleware. Takes a `config` object and an optional URL to redirect to after authentication was successful.

`config` objects are objects required to create the token manager instances (see Usage).

### Silent refresh
The `oidc-token-manager` & this middleware (since v1.1.11-beta1) support the silent refresh of tokens without redirection. This has the advantage that a visible redirect does not happen & that the redux state does not get lost when the browser leaves your app. In order to enable this, simply configure the config object to allow silent renew, like this:

        const tokenManagerConfig = {
          //...
          silen_renew: true,
          silent_redirect_uri: '${window.location.protocol}//${window.location.hostname}:${window.location.port}/silentredirect.html'
        }

The caveat:
You have to configure webpack/grund/gulp to output a separate html module besides index.html to contain the token callback page. The configuration for this exceeds the scope of this documentation. If you use the [react-boilerplate](https://github.com/mxstbr/react-boilerplate) there is an example on how to create such a configuration in webpack.

###Tests

run `npm run test`

###Known issues
The `oidc-token-manager` currently doesn't work on Safari for Windows. There is a pending update which will remove this dependency and (hopefully) fix this issue.


This is very much in early development so I am happy for any issues/bug reports as well as suggestions for improvement.
