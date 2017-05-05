import '../setup';
import sinon from 'sinon';
import expect from 'expect';
import { loadUserHandler } from '../../src/helpers/loadUser';
import { userExpired, userFound } from '../../src/actions';

const coMocha = require('co-mocha');
const mocha = require('mocha');
coMocha(mocha);

describe('helper - loadUser()', () => {
  let userManagerMock;
  let storeMock;
  let getUserStub;
  let dispatchStub;

  beforeEach(() => {
    dispatchStub = sinon.stub();
    getUserStub = sinon.stub();

    userManagerMock = {
      getUser: getUserStub
    };

    storeMock = {
      dispatch: dispatchStub
    };
  });

  it('should dispatch a valid user to the store', function* () {
    const validUser = { some: 'user' };
    getUserStub.returns(validUser);

    yield* loadUserHandler(storeMock, userManagerMock);

    expect(dispatchStub.calledWith(userFound(validUser))).toEqual(true);
  });

  it('should dispatch USER_EXPIRED when no valid user is present', function* () {
    const invalidUser = { expired: true };
    getUserStub.returns(invalidUser);

    yield* loadUserHandler(storeMock, userManagerMock);

    expect(dispatchStub.calledWith(userExpired())).toEqual(true);
  });
});
