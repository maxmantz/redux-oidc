import './setup';
import ReactTestUtils from 'react-dom/test-utils';
import expect from 'expect';
import React from 'react';
import CallbackComponent from '../src/CallbackComponent';
import sinon from 'sinon';
import { STORAGE_KEY } from '../src/constants';
import { redirectSuccess } from '../src/actions';

describe('<CallbackComponent />', () => {
  let userManagerMock;
  let storeMock;
  let signinRedirectCallbackStub;
  let thenStub;
  let catchStub;
  let props;
  let contextMock;
  let oldStorage;
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
      signinRedirectCallback: signinRedirectCallbackStub
    };

    props = { successCallback: successCallbackStub, errorCallback: errorCallbackStub };

    contextMock = {
      userManager: userManagerMock
    };

    oldStorage = localStorage;
    localStorage = {
      removeItem: removeItemStub
    };

    component = new CallbackComponent(props);
  });

  afterEach(() => {
    localStorage = oldStorage;
  });

  it('should call the userManager on componentDidMount', () => {
    component.context = Object.assign({}, { ...component.context }, { ...contextMock });
    component.componentDidMount();

    expect(signinRedirectCallbackStub.called).toEqual(true);
    expect(thenStub.called).toEqual(true);
    expect(catchStub.called).toEqual(true);
  });

  it('should handle redirect success correctly', () => {
    const user = { some: 'user' };
    component.context = Object.assign({}, { ...component.context }, { ...contextMock });
    component.onRedirectSuccess(user);

    expect(removeItemStub.calledWith(STORAGE_KEY)).toEqual(true);
    expect(successCallbackStub.calledWith(user)).toEqual(true);
  });

  it('should call the redirect error callback when provided', () => {
    const error = { message: 'error'};

    component.onRedirectError(error);

    expect(errorCallbackStub.calledWith(error)).toEqual(true);
  });

  it('should throw an error when no error callback has been provided', () => {
    const error = { message: 'error' };

    props = { successCallback: successCallbackStub };
    component = new CallbackComponent(props);

    expect(() => component.onRedirectError(error)).toThrow(/error/);
    expect(removeItemStub.calledWith(STORAGE_KEY)).toEqual(true);
  });

  it('should call the signinSilentCallback with a route when it has been provided', () => {
    const route = '/some/route';
    props = { ...props, route };
    component = new CallbackComponent(props);
    component.context = Object.assign({}, { ...component.context }, { ...contextMock });

    component.componentDidMount();

    expect(signinRedirectCallbackStub.calledWith(route)).toEqual(true);
  });
});
