import { userExpired, userFound, loadingUser } from './actions';
import co from 'co';


// store the user here to prevent future promise calls to getUser()
export let storedUser = null;

// helper function to set the stored user manually (for testing)
export function setStoredUser(user) {
  storedUser = user;
}

// helper function to remove the stored user manually (for testing)
export function removeStoredUser() {
  storedUser = null;
}


export function errorCallback(error) {
  console.error('Error in oidcMiddleware', error);
}

export function* middlewareHandler(next, action, userManager) {
  if (!storedUser || storedUser.expired) {
    next(loadingUser());
    let user = yield userManager.getUser();
    if (!user || user.expired) {
      next(userExpired());
    } else {
      storedUser = user;
      next(userFound(user));
    }
  }
  return next(action);
}

// the middleware creator function
export default function createOidcMiddleware(userManager) {
  if (!userManager || !userManager.getUser) {
    throw new Error('You must provide a user manager!');
  }

/*
  // check for an interrupted login attempt and clear storage if necessary
  co(function* () {
    let value = yield Promise.resolve(storage.get(STORAGE_KEY));

    if (value && locationService.currentPath.indexOf(callbackRoute) === -1) {
      yield Promise.resolve(storage.remove(STORAGE_KEY));
      // clear out any temporary data left behind by the userManager but keep the valid user data if present
      let keys = yield Promise.resolve(storage.getAllKeys());
      for (const key in keys) {
        if (key.indexOf('oidc') !== -1 && key.indexOf('oidc.user') === -1) {
          Promise.resolve(storage.remove(key));
        }
      }
    }
  });
  */

  // the middleware
  return (store) => (next) => (action) => {
    co(middlewareHandler(next, action, userManager)).catch(errorCallback);
  }
};
