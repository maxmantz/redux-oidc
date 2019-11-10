# redux-oidc Version 4 API Documentation

### Helpers

##### createUserManager
A shorthand for creating a userManager instance.

Usage:
```
import { createUserManager } from 'redux-oidc';

const settings = {
  // the user manager settings for oidc-client
};

const userManager = createUserManager(settings);
```
Arguments:
- settings: the userManager configuration object. See the [oidc-client wiki](https://github.com/IdentityModel/oidc-client-js/wiki#configuration) for further information.

Returns:
A userManager instance.

##### loadUser
Loads potentially existing user data into the redux store, thus eliminating a new authentication roundtrip to the authentication server when a tab is closed or a new tab is opened.

Usage:
```
import { loadUser } from 'redux-oidc';

// this should be placed directly after you configure your redux-store

loadUser(store, userManager);
```

Arguments:
- store: the redux store,
- userManager: the userManager instance

##### processSilentRenew
Processes the silent renewal of tokens.

Usage:
```
// in your silent_renew.html
import { processSilentRenew } from 'redux-oidc';

processSilentRenew();
```

Arguments: none

### Reducers
There are two reducers which can be registered with your redux-store:

##### Standard reducer
`import { reducer } from 'redux-oidc';`

or

##### Immutable reducer
This reducer is to be used for configurations with immutable.js.
```
import immutable from 'immutable';
import { createImmutableReducer } from 'redux-oidc';

const reducer = createImmutableReducer(immutable);
```


### React components
##### CallbackComponent / SignoutCallbackComponent
The component to handle the token callback from the authentication server.
*Note:* Register this component at the token callback route you've configured with your authentication server.

Usage:
```
import { CallbackComponent } from 'redux-oidc';

 const successCallback = (user) => {
   console.log(user);
 };

 const errorCallback = (error) => {
   console.error(error);
 };

 return (
   // ...
   <CallbackComponent successCallback={successCallback} errorCallback={errorCallback}>
     <div>Redirecting...</div>
   </CallbackComponent>
 );
```

Props:
```
// the content to render
children: PropTypes.element.isRequired,

// the userManager
userManager: PropTypes.object.isRequired,

// a function invoked when the callback succeeds
successCallback: PropTypes.func.isRequired,

// a function invoked when the callback fails
errorCallback: PropTypes.func
```

##### OidcProvider
This components sets up the userManager event handlers to dispatch the required actions.

Usage:
```
import { Provider } from 'react-redux';
import { OidcProvider } from 'redux-oidc';

// at the root of your application

ReactDOM.render(<Provider store={store}>
    <OidcProvider userManager={userManager} store={store}>
      <App />
    </OidcProvider>
  </Provider>, document.getElementById('app'));
```

Props:
```
// the user manager from oidc-client
userManager: PropTypes.object.isRequired,

// the redux-store
store: PropTypes.object.isRequired,
```

### DEPRECATED
##### oidcMiddleware
Verifies the existing user object on every action dispatch.
*Warning:* the middleware is deprecated because checking the user validity on every action dispatch causes unnecessary overhead. This should only be used if you don't have silent renewal of tokens configured.

Usage:
```
import { createOidcMiddleware } from 'redux-oidc';

const middleware = createOidcMiddleware(userManager);

// then set up the redux-store with this middleware
```
Arguments:
- userManager: the userManager instance

Returns:
- the middleware
