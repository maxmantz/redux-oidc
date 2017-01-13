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

  // the middleware
  return (store) => (next) => (action) => {
    co(middlewareHandler(next, action, userManager)).catch(errorCallback);
  }
};
