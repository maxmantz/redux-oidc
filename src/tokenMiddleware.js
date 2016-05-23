import { STORAGE_KEY } from './constants';
import { userExpired, userFound } from './actions';

export function successCallback(next, dispatchOnSuccess) {
  if (!dispatchOnSuccess) {
    return;
  }

  switch (typeof(dispatchOnSuccess)) {
    case 'function':
      next(dispatchOnSuccess());
      break;
    case 'object':
      next(dispatchOnSuccess);
      break;
    default:
      return;
  }
}

export default function createTokenMiddleware(userManager, shouldValidate, triggerAuthFlow = true) {
  if (!userManager) {
    throw new Error('You must provide a user manager!');
  }

  if (!shouldValidate || typeof(shouldValidate) !== 'function') {
    shouldValidate = (state, action) => true;
  }

  // variable for loading the user data on first run
  let firstRun = true;

  // store the user here to prevent future promise calls
  let user;

  return (store) => (next) => (action) => {
    // should the token be validated?
    if (shouldValidate(store.getState(), action) && !window.localStorage.getItem(STORAGE_KEY)) {
      if (!user || user.expired || firstRun) {
        window.localStorage.setItem(STORAGE_KEY, true);
        userManager.getUser().then((user) => {
          if (!user || user.expired) {
            firstRun = false;
            // dispatch the action
            next(userExpired());
            if (triggerAuthFlow) {
              // trigger the auth flow with the redirectUrl
              userManager.signinRedirect({ data: {
                redirectUrl: window.location.href
              }
              }).catch((error) => {
                window.localStorage.removeItem(STORAGE_KEY);
                throw new Error(`Error signing in: ${error.message}`);
              });
            }
          } else {
            window.localStorage.removeItem(STORAGE_KEY);
            if (firstRun) {
              firstRun = false;
              // dispatch the loaded user
              next(userFound(user));
            }
            return next(action);
          }
        })
        .catch((error) => {
          window.localStorage.removeItem(STORAGE_KEY);
          throw new Error(`Error loading user: ${error.message}`);
        });
      }
    } else {
      return next(action);
    }
  }
};

function getUser(userManager, triggerAuthFlow) {

}
