import { STORAGE_KEY } from './constants';
import { userExpired } from './actions';

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

  return (store) => (next) => (action) => {
    // should the token be validated?
    if (shouldValidate(store.getState(), action) && !window.localStorage.getItem(STORAGE_KEY)) {
      // set the localStorage key so that the validation won't trigger after the redirect
      window.localStorage.setItem(STORAGE_KEY, true);
      userManager.getUser().then((user) => {
        if (!user || user.expired) {
          // dispatch the action
          next(userExpired());
          if (triggerAuthFlow) {
            const state = { };

            userManager.signinRedirect({ data: {
              redirectUrl: window.location.href
            }
            }).catch((error) => {
              window.localStorage.removeItem(STORAGE_KEY);
              throw new Error(`Error signing in: ${error.message}`)
            });
          }
        } else {
          window.localStorage.removeItem(STORAGE_KEY, true);
          return next(action);
        }
      });

    } else {
      return next(action);
    }
  }
};
