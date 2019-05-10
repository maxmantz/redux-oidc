import { userExpired, userFound, loadingUser, loadUserError } from './actions';
import { USER_EXPIRED, LOADING_USER, USER_FOUND } from './constants';

// store the user here to prevent future promise calls to getUser()
export let storedUser = null;
// store the next middleware here so it can be accessed by the getUserCallback
export let nextMiddleware = null;

// helper function to set the stored next middleware (for testing)
export function setNext(newNext) {
  nextMiddleware = newNext;
}

// a function to get the next middleware (for testing)
export function getNext() {
  return nextMiddleware;
}

// helper function to set the stored user manually (for testing)
export function setStoredUser(user) {
  storedUser = user;
}

// helper function to remove the stored user manually (for testing)
export function removeStoredUser() {
  storedUser = null;
}

// callback function to the userManager's getUser
export function getUserCallback(user) {
  if (!user || user.expired) {
    nextMiddleware(userExpired());
  } else {
    storedUser = user;
    nextMiddleware(userFound(user));
  }
}

// callback for the userManager's getUser.catch
export function errorCallback(error) {
  console.error(`redux-oidc: Error loading user in oidcMiddleware: ${error.message}`);
  nextMiddleware(loadUserError());
}

// the middleware handler function
export function middlewareHandler(next, action, userManager) {
  // prevent an infinite loop of dispatches of these action types (issue #30 & #63)
  if (action.type === USER_EXPIRED || action.type === LOADING_USER || action.type === USER_FOUND) {
    return next(action);
  }

  nextMiddleware = next;

  if (!storedUser || storedUser.expired) {
    next(loadingUser());
    userManager.getUser()
      .then(getUserCallback)
      .catch(errorCallback);
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
    return middlewareHandler(next, action, userManager);
  }
};
