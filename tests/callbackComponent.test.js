import ReactTestUtils from 'react-addons-test-utils';
import expect from 'expect';
import React from 'react';
import CallbackComponent from '../src/CallbackComponent.js';
import sinon from 'sinon';
import {findAllWithType} from 'react-shallow-testutils';
import { STORAGE_KEY } from '../src/constants';

describe('<CallbackComponent />', () => {
  let tokenManagerStub;
  let createTokenManagerStub;
  let processTokenCallbackAsyncStub;
  let thenStub;
  let getItemStub;
  let removeItemStub;
  let oldStorage;
  var oldWindow;
  beforeEach(() => {
    getItemStub = sinon.stub();
    removeItemStub = sinon.stub();

    oldStorage = localStorage;
    localStorage = {
      getItem: getItemStub,
      removeItem: removeItemStub
    };

    oldWindow = window;

    window = {
      location: {
        protocol: 'https:',
        hostname: 'localhost',
        port: 3000
      }
    };

    processTokenCallbackAsyncStub = sinon.stub();
    thenStub = sinon.stub();
    processTokenCallbackAsyncStub.returns({then: thenStub});
    const tokenManager = { processTokenCallbackAsync: processTokenCallbackAsyncStub };
    createTokenManagerStub = sinon.stub();
    createTokenManagerStub.returns(tokenManager);
    CallbackComponent.__Rewire__('createTokenManager', createTokenManagerStub);
  });

  it('should render its children & call the token manager', () => {
    // TODO: come up with a fix for the rendering errors
    /*
    const renderer = ReactTestUtils.createRenderer();

    var child = <div>Child</div>;

    const renderedComponent = renderer.render(<CallbackComponent>{child}</CallbackComponent>);

    expect(findAllWithType(renderedComponent, child).length).toEqual(1);
    expect(tokenManagerStub.called).toEqual(true);
    */
  });

  it('should call the tokenManagers processTokenCallbackAsync then() method', () => {
    const component = new CallbackComponent({});
    component.componentDidMount();

    expect(processTokenCallbackAsyncStub.called).toEqual(true);
    expect(thenStub.calledWith(component.onTokenCallbackSuccess, component.onTokenCallbackError)).toEqual(true);
  });

  it('should clear the redirect url redirect to the app root on success by default', () => {
    const component = new CallbackComponent({});
    component.onTokenCallbackSuccess();

    expect(removeItemStub.calledWith(STORAGE_KEY)).toEqual(true);
  });

  it('should call the success callback when provided', () => {
    const successCallback = sinon.stub();
    const component = new CallbackComponent({ successCallback });

    component.onTokenCallbackSuccess();

    expect(successCallback.called).toEqual(true);
  });

  it('should call the error callback when provided', () => {
    const errorCallback = sinon.stub();
    const error = 'some error';
    const component = new CallbackComponent({ errorCallback });

    component.onTokenCallbackError(error);

    expect(errorCallback.calledWith(error)).toEqual(true);
  });

  it('should handle localStorage correctly', () => {
    const component = new CallbackComponent({});

    component.onTokenCallbackSuccess();
    expect(getItemStub.calledOnce).toEqual(true);
    expect(removeItemStub.calledOnce).toEqual(true);
    component.onTokenCallbackError();
    expect(removeItemStub.calledTwice).toEqual(true);
  });

  it('should redirect to the custom redirectUri when provided', () => {
    const customRedirectUri = 'https://some.uri.com';
    const component = new CallbackComponent({redirectUri: customRedirectUri});

    component.onTokenCallbackSuccess();
    expect(window.location).toEqual(customRedirectUri);
  });

  it('should redirect to the url in localStorage when no redirectUri has been passed', () => {
    const redirectUrl = 'https://some.url.com';
    const component = new CallbackComponent({});
    getItemStub.returns(redirectUrl);
    component.onTokenCallbackSuccess();

    expect(window.location).toEqual(redirectUrl);
  });

  afterEach(() => {
    localStorage = oldStorage;
    window = oldWindow;
  });
});
