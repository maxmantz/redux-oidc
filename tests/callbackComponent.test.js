import './setup';
import expect from 'expect';
import React from 'react';
import CallbackComponent from '../src/CallbackComponent';
import sinon from 'sinon';
import { redirectSuccess } from '../src/actions';

describe('<CallbackComponent />', () => {
  let userManagerMock;
  let storeMock;
  let signinRedirectCallbackStub;
  let thenStub;
  let catchStub;
  let props;
  let propsMock;
  let removeItemStub;
  let successCallbackStub;
  let errorCallbackStub;
  let component;

  beforeEach(() => {
    catchStub = sinon.stub();
    thenStub = sinon.stub().returns({ catch: catchStub });
    removeItemStub = sinon.stub();
    signinRedirectCallbackStub = sinon.stub().returns({
      then: thenStub
    });
    successCallbackStub = sinon.stub();
    errorCallbackStub = sinon.stub();

    userManagerMock = {
      signinRedirectCallback: signinRedirectCallbackStub,
    };

    props = { successCallback: successCallbackStub, errorCallback: errorCallbackStub, userManager: userManagerMock };


    component = new CallbackComponent(props);
  });

  it('should call the userManager on componentDidMount', () => {
    component.componentDidMount();

    expect(signinRedirectCallbackStub.called).toEqual(true);
    expect(thenStub.called).toEqual(true);
    expect(catchStub.called).toEqual(true);
  });

  it('should handle redirect success correctly', () => {
    const user = { some: 'user' };
    component.onRedirectSuccess(user);

    expect(successCallbackStub.calledWith(user)).toEqual(true);
  });

  it('should call the redirect error callback when provided', () => {
    const error = { message: 'error'};

    component.onRedirectError(error);

    expect(errorCallbackStub.calledWith(error)).toEqual(true);
  });

  it('should throw an error when no error callback has been provided', () => {
    const error = { message: 'error' };

    props = { successCallback: successCallbackStub, userManager: userManagerMock };
    component = new CallbackComponent(props);

    expect(() => component.onRedirectError(error)).toThrow(/error/);
  });
});
