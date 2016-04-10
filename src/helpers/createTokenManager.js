import OidcTokenManager from '../../libs/oidc-token-manager';

export default function createTokenManager(config) {
  return new OidcTokenManager(config);
}
