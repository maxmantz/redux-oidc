import OidcTokenManager from '../libs/oidc-token-manager';

export function createTokenManager(config) {
  return new OidcTokenManager(config);
}

export function logoutAtIdentityService(config) {
  const manager = new OidcTokenManager(config);
  manager.redirectForLogout();
}

export function logout() {
  const manager = new OidcTokenManager();
  manager.removeToken();
}
