import React, { PropTypes } from 'react';
import { STORAGE_KEY } from './constants';
import { redirectSuccess } from './actions';

class CallbackComponent extends React.Component {
  static propTypes = {
    successCallback: PropTypes.func.isRequired
  };

  static contextTypes = {
    userManager: PropTypes.object
  };

  componentDidMount() {
    let { successCallback } = this.props;

    this.context.userManager.signinRedirectCallback()
      .then(this.onRedirectSuccess)
      .catch(this.onRedirectError);
  }

  onRedirectSuccess = (user) => {
    localStorage.removeItem(STORAGE_KEY);
    this.context.store.dispatch(redirectSuccess(user));
    this.props.successCallback(user);
  };

  onRedirectError = (error) => {
    localStorage.removeItem(STORAGE_KEY);
    throw new Error(`Error handling redirect callback: ${error.message}`);
  };

  get defaultContent() {
    return <div>Redirecting...</div>;
  }

  render() {
    return (
      <div>
        {this.props.children || this.defaultContent}
      </div>
    );
  }
}

export default CallbackComponent;
