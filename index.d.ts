declare module 'redux-oidc' {
    import { UserManager, UserManagerSettings, User } from 'oidc-client';
    import { Action, BaseAction } from 'redux-actions';
    import { Map, fromJS } from 'immutable';
    import { Middleware, Store } from 'redux';
    import * as React from 'react';

    export interface UserState {
        user?: User;
        isLoadingUser: boolean;
    }

    export interface CallbackComponentProps {
        userManager: UserManager;
        successCallback: (user: User) => void;
        errorCallback?: (error: Error) => void;
        route?: string;
    }

    export class CallbackComponent extends React.Component<CallbackComponentProps> { }

    export interface OidcProviderProps<TSTate> {
        userManager: UserManager;
        store: Store<TSTate>;
    }

    export class OidcProvider<TState> extends React.Component<OidcProviderProps<TState>> { }

    // Components
    export function createUserManager(options: UserManagerSettings): UserManager;
    export function processSilentRenew(): void;
    export function loadUser<TStore>(store: TStore, userManager: UserManager): Promise<User>;
    export function reducer(state: UserState, action: Action<User | Error>): UserState;
    export function immutableReducer(state: Map<string, any>, action: Action<User | Error>): Map<string, any>;

    // Constants
    export const USER_EXPIRED: string;
    export const REDIRECT_SUCCESS: string;
    export const USER_LOADED: string;
    export const SILENT_RENEW_ERROR: string;
    export const SESSION_TERMINATED: string;
    export const USER_EXPIRING: string;
    export const USER_FOUND: string;
    export const LOADING_USER: string;
    export const USER_SIGNED_OUT: string;

    // Actions
    export function userExpired(): BaseAction;
    export function redirectSuccess(): Action<User>;
    export function userFound(): Action<User>;
    export function silentRenewError(): Action<Error>;
    export function sessionTerminated(): BaseAction;
    export function userExpiring(): BaseAction;
    export function loadingUser(): BaseAction;
    export function userSignedOut(): BaseAction;

    export default function createOidcMiddleware(userManager: UserManager): Middleware;
}
