import createTokenManager from './createTokenManager';

export default function logoutAtIdentityService(config) {
  const manager = createTokenManager(config);
  manager.redirectForLogout();
}
