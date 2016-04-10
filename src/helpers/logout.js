import createTokenManager from './createTokenManager';

export default function logout(redirectTo) {
  const manager = createTokenManager();
  manager.removeToken();

  if (redirectTo) {
    window.location = redirectTo;
  }
}
