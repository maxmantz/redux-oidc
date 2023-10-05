import './setup';
import { describe, it, expect, vi, beforeEach } from "vitest";
import CallbackComponent from '../src/CallbackComponent';


describe('<CallbackComponent />', () => {
  let userManagerMock;
  let storeMock;
  let signinRedirectCallbackMock;
  let thenMock;
  let catchMock;
  let props;
  let propsMock;
  let removeItemMock;
  let successCallbackMock;
  let errorCallbackMock;
  let component;

  beforeEach(() => {
    catchMock = vi.fn();
    thenMock = vi.fn().mockReturnValue({ catch: catchMock })
    removeItemMock = vi.fn();
    signinRedirectCallbackMock = vi.fn().mockReturnValue({
      then: thenMock
    });
    successCallbackMock = vi.fn();
    errorCallbackMock = vi.fn();

    userManagerMock = {
      signinRedirectCallback: signinRedirectCallbackMock,
    };

    props = { successCallback: successCallbackMock, errorCallback: errorCallbackMock, userManager: userManagerMock };


    component = new CallbackComponent(props);
  });

  it('should call the userManager on componentDidMount', () => {
    component.componentDidMount();

    expect(signinRedirectCallbackMock).toHaveBeenCalled()
    expect(thenMock).toHaveBeenCalled()
    expect(catchMock).toHaveBeenCalled()
  });

  it('should handle redirect success correctly', () => {
    const user = { some: 'user' };
    component.onRedirectSuccess(user);

    expect(successCallbackMock).toHaveBeenCalledWith(user)
  });

  it('should call the redirect error callback when provided', () => {
    const error = { message: 'error'};

    component.onRedirectError(error);

    expect(errorCallbackMock).toHaveBeenCalledWith(error)
  });

  it('should throw an error when no error callback has been provided', () => {
    const error = { message: 'error' };

    props = { successCallback: successCallbackMock, userManager: userManagerMock };
    component = new CallbackComponent(props);

    expect(() => component.onRedirectError(error)).toThrow(/error/);
  });
});
