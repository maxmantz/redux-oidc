/*
import expect from 'expect';
import React from 'react';
import CallbackComponent from '../src/CallbackComponent.js';
import sinon from 'sinon';
import { createTokenManager } from '../src/helpers.js';
import OidcTokenManager from '../libs/oidc-token-manager.js';

// require('./testdom')('<html><head></head><body></body></html>');
/*
describe('<CallbackComponent />', () => {
  let tokenManagerStub;
  let createTokenManagerStub;

  beforeEach(() => {
    const tokenManager = new OidcTokenManager();
    tokenManagerStub = sinon.stub(tokenManager, "processTokenCallbackAsync");
    tokenManagerStub.returns(null);
    createTokenManagerStub = sinon.stub(createTokenManager);
    createTokenManagerStub.returns(tokenManagerStub);
  });

  it('should render its children & call the token manager', () => {
    const tokenManagerStub = sinon.stub();
    const createTokenManagerStub = sinon.stub(createTokenManager);
    createTokenManagerStub.returns(tokenManagerStub);
    const children = (<div>Child</div>);
    const renderedComponent = shallow(<CallbackComponent>{ children }</CallbackComponent>);

    expect(renderedComponent.contains(children)).toEqual(true);
    expect(tokenManagerStub.called).toEqual(true);
  });

  afterEach(() => {
    tokenManagerStub.restore();
    createTokenManagerStub.restore();
  })
});

*/
