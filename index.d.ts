declare module "redux-oidc" {
  import { SignoutResponse, UserManager, UserManagerSettings, User } from "oidc-client";
  import { Map, fromJS } from "immutable";
  import { Middleware, Store } from "redux";
  import * as React from "react";

  export interface BaseAction {
    readonly type: string;
  }

  export interface Action<Payload> extends BaseAction {
    readonly payload?: Payload;
    readonly error?: boolean;
  }

  export interface UserState {
    readonly user?: User;
    readonly isLoadingUser: boolean;
  }

  export interface CallbackComponentProps {
    readonly userManager: UserManager;
    readonly successCallback: (user: User) => void;
    readonly errorCallback?: (error: Error) => void;
    readonly route?: string;
  }

  export class CallbackComponent extends React.Component<
    CallbackComponentProps
  > {}

  export interface SignoutCallbackComponentProps {
    readonly userManager: UserManager;
    readonly successCallback: (response: SignoutResponse) => void;
    readonly errorCallback?: (error: Error) => void;
    readonly route?: string;
  }

  export class SignoutCallbackComponent extends React.Component<
    SignoutCallbackComponentProps
  > {}

  export interface OidcProviderProps<TSTate> {
    readonly userManager: UserManager;
    readonly store: Store<TSTate>;
  }

  export class OidcProvider<TState> extends React.Component<
    OidcProviderProps<TState>
  > {}

  // Components
  export function createUserManager(options: UserManagerSettings): UserManager;
  export function processSilentRenew(): void;
  export function loadUser<TStore>(
    store: TStore,
    userManager: UserManager
  ): Promise<User>;
  export function reducer(
    state: UserState | undefined,
    action: Action<User | Error>
  ): UserState;
  export function immutableReducer(
    state: Map<string, any>,
    action: Action<User | Error>
  ): Map<string, any>;

  // Constants
  export const USER_EXPIRED: string;
  export const REDIRECT_SUCCESS: string;
  export const USER_LOADED: string;
  export const SILENT_RENEW_ERROR: string;
  export const SESSION_TERMINATED: string;
  export const USER_EXPIRING: string;
  export const USER_FOUND: string;
  export const LOADING_USER: string;
  export const LOAD_USER_ERROR: string;
  export const USER_SIGNED_OUT: string;

  // Actions
  export function userExpired(): BaseAction;
  export function redirectSuccess(): Action<User>;
  export function userFound(user: User): Action<User>;
  export function silentRenewError(error: Error): Action<Error>;
  export function sessionTerminated(): BaseAction;
  export function userExpiring(): BaseAction;
  export function loadingUser(): BaseAction;
  export function loadUserError(): BaseAction;
  export function userSignedOut(): BaseAction;

  export default function createOidcMiddleware(
    userManager: UserManager
  ): Middleware;
}
