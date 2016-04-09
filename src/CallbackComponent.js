import React, { PropTypes } from 'react';
import createTokenManager from './helpers';
import { STORAGE_KEY } from './constants';

class CallbackComponent extends React.Component {
  componentDidMount() {

    const { storageKey, tokenManagerConfig } = this.props.config;
    const { errorCallback } = this.props;
    const manager = createTokenManager(tokenManagerConfig);
    const redirectUri = localStorage.getItem(STORAGE_KEY);

    // process the token callback
    manager.processTokenCallbackAsync().then(() => {
      localStorage.removeItem(STORAGE_KEY);
      window.location = redirectUri ? redirectUri : `${window.location.protocol}//${window.location.hostname}:${window.location.port}`;
    }, (error) => {
      if (this.props.errorCallback) {
        this.props.errorCallback(error);
      }
    })
  }

  get defaultContent() {
    return <div>Redirecting...</div>;
  }

  render() {
    return (
      <div>
        { this.props.children || this.defaultContent }
      </div>
    );
  }
}

export default CallbackComponent;
