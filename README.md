# redux-oidc
Middleware component for managing the [OpenID Connect](http://openid.net/connect/) implicit authentication flow in [redux](https://github.com/reactjs/redux) apps.

##Installation

`npm install --save redux-oidc`

##Description
This project was created to enable redux apps to use the OpenID-Connect implicit authentication flow. It was created by me to connect my redux app to an API protected by
an [IdentityServer3](https://github.com/IdentityServer/IdentityServer3) authentication service, but it should work with other services as well as long as they are
implementing the OpenID Connect specification.

It contains two parts:
- `TokenMiddleware`: `redux` middleware validating the access token present in `localStorage`.
- `CallbackComponent`: a `React` component to use for processing the token callback by the OpenID-Connect token service.

It uses the [oidc-token-manager](https://github.com/IdentityModel/oidc-token-manager) in the background to manage the calls to the token service.

The combination of the two parts does the following in a redux app:
- verify token lifetime at every dispatch.
- if the access token has expired, trigger the authentication flow (OAuth implicit flow).
- if authentication was successful, redirect to the URI before the authentication flow was triggered (any route within the app),
- if authentication was unsuccessful, trigger an optional callback.

It doesn't (yet) use any reducers as the nature of the OAuth implicit flow requires redirecting the browser to another host, thus losing the redux state in the process.
It does however include a function called `createTokenManager(config)` where you can create an `oidc-token-manager` instance to read data from the token into your reducers.

##Usage
1. Register the middleware with the redux store.

        import { createStore, applyMiddleware, compose } from 'redux';
        import createTokenMiddleware from 'redux-oidc;
        
        // the configuration for the middleware
        const config = {
          storageKey: 'redirectTo', // the key in localStorage to store the redirect Url in
          
          tokenManagerOptions: { // the configuration object for the oidc-token-manager
            client_id: 'redux-app', // your client id
            redirect_uri: `${window.location.protocol}//${window.location.hostname}:${window.location.port}/callback`, // your callback url
            response_type: 'id_token token', // the response type from the token service
            scope: 'openid profile', // the scopes to include
            authority: 'https://myTokenService.com' // the authority
          }
        };
        
        const store = compose(
          applyMiddleware(createTokenMiddleware(config))
        )(createStore);

2. Create a route in your app to point to the `redirect_uri` specified in the `tokenManagerOptions` & registered with the token service. In the component registered at that route,
include the `CallbackComponent`:

        import React from 'react';
        import { CallbackComponent } from 'redux-oidc';
        
        // the same as in step 1
        const config = {
          storageKey: 'redirectTo', // the key in localStorage to store the redirect Url in
          
          tokenManagerOptions: { // the configuration object for the oidc-token-manager
            client_id: 'redux-app', // your client id
            redirect_uri: `${window.location.protocol}//${window.location.hostname}:${window.location.port}/callback`, // your callback url
            response_type: 'id_token token', // the response type from the token service
            scope: 'openid profile', // the scopes to include
            authority: 'https://myTokenService.com' // the authority
          }
        };
        
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
              <CallbackComponent config={config} errorCallback={this.onTokenValidationError}>
                { this.customContent }
              </CallbackComponent>
            );
          }
        }
        
        export default CallbackPage;

That's all there is to do. 

Optionally you can create a TokenManager instance to read the token information into your reducers: 

        import { createTokenManager } from 'redux-oidc';
        
        const tokenManagerConfig = {
          // provide the configuration here...
        };
        
        function getInitialState() {
          const manager = createTokenManager(tokenManagerConfig);
          
          if (!manager.expired) {
            return {
            profile: tokenManager.profile,
            token: tokenManager.access_token,
            ...
            };
          }
          
          return {};
        }
        
        export function myReducer(state = getInitialState(), action) {
          // your reducer logic...
        }
        
##TODOs
- Testing. Tests have been written, however the testing environment setup is giving me problems. Need to fix that ASAP.
- More options for the middleware & component - for example trigger token validation only on specific action types, etc.
- Provide a reducer & actions containing all the information obtained by the token manager (similar to the one in the example).

This is very much in early development so I am happy for any issues/bug reports as well as suggestions for improvement.


