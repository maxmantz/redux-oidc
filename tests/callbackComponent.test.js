import './setup';
import ReactTestUtils from 'react-addons-test-utils';
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
  let dispatchStub;
  let props;
  let contextMock;
  let oldStorage;
  let removeItemStub;
  let successCallbackStub;
  let component;

  beforeEach(() => {
    catchStub = sinon.stub();
    thenStub = sinon.stub().returns({ catch: catchStub });
    dispatchStub = sinon.stub();
    removeItemStub = sinon.stub();
    signinRedirectCallbackStub = sinon.stub().returns({
      then: thenStub
    });
    successCallbackStub = sinon.stub();

    userManagerMock = {
      signinRedirectCallback: signinRedirectCallbackStub
    };
    storeMock = {
      dispatch: dispatchStub
    };

    props = { successCallback: successCallbackStub };

    contextMock = {
      userManager: userManagerMock,
      store: {
        dispatch: dispatchStub
      }
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
    expect(dispatchStub.calledWith(redirectSuccess(user))).toEqual(true);
    expect(successCallbackStub.calledWith(user)).toEqual(true);
  });

  it('should handle redirect errors correctly', () => {
    const error = { message: 'error' };

    expect(() => component.onRedirectError(error)).toThrow(/error/);
    expect(removeItemStub.calledWith(STORAGE_KEY)).toEqual(true);
  });
});
