import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AuthState } from '../reducers/auth.reducers';

export const selectAuthState = createFeatureSelector<AuthState>('auth');
export const selectAccessToken = createSelector(selectAuthState, state => state.accessToken);
export const selectAuthError = createSelector(selectAuthState, state => state.error);
export const selectUser = createSelector(selectAuthState, state => state.user);
export const selectIsLoading = createSelector(selectAuthState, state => state.isLoading);
