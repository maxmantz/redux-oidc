import './setup';
import expect from 'expect';
import SignoutCallbackComponent from '../src/SignoutCallbackComponent';
import sinon from 'sinon';

describe('<SignoutCallbackComponent />', () => {
  let userManagerMock;
  let signoutRedirectCallbackStub;
  let thenStub;
  let catchStub;
  let removeItemStub;
  let props;
  let successCallbackStub;
  let errorCallbackStub;
  let component;

  beforeEach(() => {
    catchStub = sinon.stub();
    thenStub = sinon.stub().returns({ catch: catchStub });
    removeItemStub = sinon.stub();
    signoutRedirectCallbackStub = sinon.stub().returns({
      then: thenStub
    });
    successCallbackStub = sinon.stub();
    errorCallbackStub = sinon.stub();

    userManagerMock = {
      signoutRedirectCallback: signoutRedirectCallbackStub,
    };

    props = { successCallback: successCallbackStub, errorCallback: errorCallbackStub, userManager: userManagerMock };


    component = new SignoutCallbackComponent(props);
  });

  it('should call the userManager on componentDidMount', () => {
    component.componentDidMount();

    expect(signoutRedirectCallbackStub.called).toEqual(true);
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
    component = new SignoutCallbackComponent(props);

    expect(() => component.onRedirectError(error)).toThrow(/error/);
  });
});
