import createTokenManager from './helpers/createTokenManager';
import { STORAGE_KEY } from './constants';

export default function createTokenMiddleware(config, shouldValidate, dispatchOnInvalid) {
  if (!config) {
    throw new Error('You must provide a token manager configuration object!');
  }

  const silent = config.silent_renew;
  const manager = createTokenManager(config);

  if (!shouldValidate || typeof(shouldValidate) !== 'function') {
    shouldValidate = (state, action) => true;
  }

  return (store) => (next) => (action) => {
    if (shouldValidate(store.getState(), action)) {
      if (!silent) {
        if (manager.expired && !localStorage.getItem(STORAGE_KEY)) {
          localStorage.setItem(STORAGE_KEY, window.location.href);
          if (dispatchOnInvalid) {
            next(dispatchOnInvalid);
          }
          manager.redirectForToken();
          return null;
        }
      } else {
        if (manager.expired) {
          if (dispatchOnInvalid) {
            next(dispatchOnInvalid);
          }
          manager.renewTokenSilentAsync();
          return null;
        }
      }
    }

    return next(action);
  }
};
