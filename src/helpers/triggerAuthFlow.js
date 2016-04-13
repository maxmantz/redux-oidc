import createTokenManager from './createTokenManager';
import { STORAGE_KEY } from '../constants';

export default function triggerAuthFlow(config, redirectTo) {
  if (!config) {
    throw new Error('You must provide a token manager config!');
  }

  if (redirectTo) {
    window.localStorage.setItem(STORAGE_KEY, redirectTo);
  }
  else {
    window.localStorage.setItem(STORAGE_KEY, window.location.href);
  }

  const manager = createTokenManager(config);

  manager.removeToken();

  manager.redirectForToken();
}
