import React, { PropTypes } from 'react';
import { redirectSuccess } from './actions';

class CallbackComponent extends React.Component {
  static propTypes = {
    // the userManager
    userManager: PropTypes.object.isRequired,

    // a function invoked when the callback succeeds
    successCallback: PropTypes.func.isRequired,

    // a function invoked when the callback fails
    errorCallback: PropTypes.func,

    // the route this component is registered in (react-router or similar library)
    route: PropTypes.string
  };

  componentDidMount() {
    this.props.userManager.signinRedirectCallback(this.props.route)
      .then((user) => this.onRedirectSuccess(user))
      .catch((error) => this.onRedirectError(error));
  }

  onRedirectSuccess = (user) => {
    this.props.successCallback(user);
  };

  onRedirectError = (error) => {
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
