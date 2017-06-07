import { userExpired, userFound, loadingUser } from './actions';
import { USER_EXPIRED, LOADING_USER, USER_FOUND } from './constants';
import co from 'co';
import url from 'url';

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

// the middleware handler function
export function* middlewareHandler(next, action, userManager) {
  // prevent an infinite loop of dispatches of these action types (issue #30)
  if (action.type === USER_EXPIRED || action.type === LOADING_USER) {
    return next(action);
  }

  // store user when found
  if (action.type === USER_FOUND) {
    storedUser = action.payload;
  }

  // prevent loading the user when the callback path is active
  if (userManager.settings && userManager.settings.redirect_uri) {
    const callbackPath = url.parse(userManager.settings.redirect_uri).pathname 
    if (window.location.pathname === callbackPath) {
      return next(action);
    }
  }

  if (!storedUser || storedUser.expired) {
    next(loadingUser());
    let user = yield userManager.getUser();
    if (!user || user.expired) {
      next(userExpired());
    } else {
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
    co(middlewareHandler(next, action, userManager));
  }
};
