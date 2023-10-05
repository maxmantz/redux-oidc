import '../setup';
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import createUserManager from '../../src/helpers/createUserManager';
import { UserManager } from 'oidc-client-ts';
// Mock the UserManager dependency
vi.mock('oidc-client-ts', () => ({
  UserManager: vi.fn(),
}));

describe('helper - createUserManager()', () => {
  let userManagerMock;
  
  beforeEach(() => {
    // Reset mocks before each test
    UserManager.mockReset();
    userManagerMock = { config: vi.fn() };
    UserManager.mockImplementation(() => userManagerMock);
  });

  it('should return an UserManager instance', () => {
    const config = { some: 'config' };
    const userManager = createUserManager(config);
    expect(userManager).toBeTypeOf('object');
    expect(UserManager).toHaveBeenCalledWith(config);
  });
});
