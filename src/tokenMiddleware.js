import createTokenManager from './helpers';
import { STORAGE_KEY } from './constants';

export default function createTokenMiddleware(config, shouldValidate, dispatchOnInvalid) {
  if (!config) {
    throw new Error('You must provide a token manager configuration object!');
  }

  if (!shouldValidate || typeof(shouldValidate) !== 'function') {
    shouldValidate = (state, action) => true;
  }

  return (store) => (next) => (action) => {
    if (shouldValidate(store.getState(), action)) {
      const manager = createTokenManager(config);
      if (manager.expired && !localStorage.getItem(STORAGE_KEY)) {
        localStorage.setItem(STORAGE_KEY, window.location.href);
        if (dispatchOnInvalid) {
          next(dispatchOnInvalid);
        }
        manager.redirectForToken();
        return null;
      }
    }

    return next(action);
  }
};
