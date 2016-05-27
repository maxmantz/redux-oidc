import { STORAGE_KEY } from './constants';
import { userExpired } from './actions';

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

// callback for the user manager's getUser().then()
export function getUserSuccessCallback(next, userManager, user, triggerAuthFlow, action) {
  if (!user || user.expired) {
    // IF: user is expired
    next(userExpired());
    if (triggerAuthFlow) {
      // IF: auth flow should be triggered
      userManager.signinRedirect({ data: {
          redirectUrl: window.location.href
        }
      });
    } else {
      return next(action);
    }
  } else {
    // ELSE: user is NOT expired
    localStorage.removeItem(STORAGE_KEY);
    storedUser = user;
    return next(action);
  }
}

export function getUserErrorCallback(error) {
  localStorage.removeItem(STORAGE_KEY);
  throw new Error(`Error loading user: ${error.message}`);
}

// the middleware creator function
export default function createOidcMiddleware(userManager, shouldValidate, triggerAuthFlow = true) {
  if (!userManager) {
    throw new Error('You must provide a user manager!');
  }

  if (!shouldValidate || typeof(shouldValidate) !== 'function') {
    // set the default shouldValidate()
    shouldValidate = (state, action) => true;
  }

  // the middleware
  return (store) => (next) => (action) => {
    if (shouldValidate(store.getState(), action) && !localStorage.getItem(STORAGE_KEY)) {
      // IF: validation should occur...
      if (!storedUser || storedUser.expired) {
        // IF: user hasn't been found or is expired...
        localStorage.setItem(STORAGE_KEY, true);
        userManager.getUser()
          .then((user) => getUserSuccessCallback(next, userManager, user, triggerAuthFlow, action))
          .catch(getUserErrorCallback);
      } else {
        // ELSE: user has been found and NOT is expired...
        return next(action);
      }
    } else {
      // ELSE: validation should NOT occur...
      return next(action);
    }
  }
};
