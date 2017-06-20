import React from 'react';
import PropTypes from 'prop-types';
import { STORAGE_KEY } from './constants';
import { redirectSuccess } from './actions';

class CallbackComponent extends React.Component {
  static propTypes = {
    successCallback: PropTypes.func.isRequired,
    errorCallback: PropTypes.func,
    route: PropTypes.string
  };

  static contextTypes = {
    userManager: PropTypes.object
  };

  componentDidMount() {
    this.context.userManager.signinRedirectCallback(this.props.route)
      .then((user) => this.onRedirectSuccess(user))
      .catch((error) => this.onRedirectError(error));
  }

  onRedirectSuccess = (user) => {
    localStorage.removeItem(STORAGE_KEY);
    this.props.successCallback(user);
  };

  onRedirectError = (error) => {
    localStorage.removeItem(STORAGE_KEY);

    if (this.props.errorCallback) {
      this.props.errorCallback(error);
    } else {
      throw new Error(`Error handling redirect callback: ${error.message}`);
    }
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
