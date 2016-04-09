import createTokenManager from './helpers';
import { STORAGE_KEY } from './constants';

export default function createTokenMiddleware(config) {
  if (!config.tokenManagerConfig) {
    throw new Error('You must provide a token manager configuration object!');
  }

  return (store) => (next) => (action) => {
    const manager = createTokenManager(config.tokenManagerConfig);
    if (manager.expired && !localStorage.getItem(STORAGE_KEY)) {
      window.localStorage.setItem(STORAGE_KEY, window.location.href);

      manager.redirectForToken();
      return null;
    }

    return next(action);
  }
};
