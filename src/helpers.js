import OidcTokenManager from '../libs/oidc-token-manager';

export function createTokenManager(config) {
  return new OidcTokenManager(config);
};
