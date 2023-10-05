import "../setup";

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import processSilentRenew from "../../src/helpers/processSilentRenew";
import createUserManager from "../../src/helpers/createUserManager"; // Assuming createUserManager is exported from this module

// Mock the createUserManager function
vi.mock("../../src/helpers/createUserManager", async () => {
  const actual = await vi.importActual("../../src/helpers/createUserManager");
  return {
    __esModule: true,
    default: vi.fn(),
  };
});

describe("helper - processSilentRenew()", () => {
  let signinSilentCallbackStub;

  beforeEach(() => {
    // Reset mocks before each test
    createUserManager.mockReset();
    signinSilentCallbackStub = vi.fn();
    createUserManager.mockReturnValue({
      signinSilentCallback: signinSilentCallbackStub,
    });
  });

  it("should handle the silent callback correctly", () => {
    processSilentRenew();
    expect(signinSilentCallbackStub).toHaveBeenCalled();
  });
});
