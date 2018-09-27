# Actions
This chapter lists all redux actions used by this library, their associated constants and their effect on the reducer.
*NOTE:* These actions are dispatched when the event listeners described [here](https://github.com/IdentityModel/oidc-client-js/wiki#events) are fired.

### USER_EXPIRED
`import { USER_EXPIRED } from 'redux-oidc';`

Dispatched when:
- no valid user is found on startup,
- a valid user object expires.

Effects on reducer:
- sets the `user` object to `null` and `isLoadingUser` to `false`.

### SILENT_RENEW_ERROR
`import { SILENT_RENEW_ERROR } from 'redux-oidc';`

Dispatched when:
- the silent renewal process fails

Effects on reducer:
- sets the `user` object to `null` and `isLoadingUser` to `false`.


### USER_EXPIRING
`import { USER_EXPIRING } from 'redux-oidc';`

Dispatched when:
- 5 minutes before the access token expires (oidc-client default)

Effects on reducer:

none

### SESSION_TERMINATED
`import { SESSION_TERMINATED } from 'redux-oidc';`

Dispatched when:
- the user logs out (with a call to the userManager function)

Effects on reducer:
- sets the `user` object to `null` and `isLoadingUser` to `false`.

### USER_FOUND
`import { USER_FOUND } from 'redux-oidc';`;

Dispatched when:
- a valid user is found (on startup, after token refresh or token callback).

Effects on reducer:
- updates the user object with the new user object.

### LOADING_USER
`import { LOADING_USER } from 'redux-oidc';`

Dispatched when:
- the user object has expired and a new user is about to be loaded (middlware only!)

Effects on reducer:
- sets the `isLoadingUser` flag to `true`.


### USER_SIGNED_OUT
`import { USER_SIGNED_OUT } from 'redux-oidc';`

Dispatched when:
- the user is logged out at the auth server.

Effects on reducer:
- sets the `user` object to `null` and `isLoadingUser` to `false`.

### LOAD_USER_ERROR
`import { LOAD_USER_ERROR } from 'redux-oidc';`

Dispatched when:
- the user manager's loading process produces an error.

Effects on reducer:
- none
