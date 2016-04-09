import React, { PropTypes } from 'react';
import { createTokenManager } from './helpers';

class CallbackComponent extends React.Component {
  componentDidMount() {

    const { storageKey, tokenManagerConfig } = this.props.config;
    const { errorCallback } = this.props;

    const manager = createTokenManager(tokenManagerConfig);

    // process the token callback
    manager.processTokenCallbackAsync().then(() => {
      const redirectUri = localStorage.getItem(storageKey);
      localStorage.setItem(storageKey, null);
      window.location = redirectUri;
    }, (error) => {
      if (this.props.errorCallback) {
        this.props.errorCallback(error);
      }
    })
  }

  get defaultContent() {
    return <div>Redirecting...</div>;
  }

  get options() {
    return {
      storageKey: this.props.storageKey || 'oidc.redirectTo'
    }
  }

  render() {
    return (
      <div>
        { this.props.children || this.defaultContent }
      </div>
    );
  }
}
