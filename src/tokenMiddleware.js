function createTokenMiddleware(options) {
  if (!options.tokenManagerConfig) {
    throw new Error('You must provide token manager configuration!');
  }

  return (store) => (next) => (action) => {
    const manager = createTokenManager(options.tokenManagerConfig);
    if (manager.expired && !localStorage.getItem('redirectTo')) {
      const storageKey = options.storageKey || 'redirectTo';
      localStorage.setItem(config.storageKey, window.location.href);
      tokenManager.redirectForToken();
      return null;
    }

    return next(action);
  }
};

export default createTokenMiddleware;
