import { ApplicationConfig, provideZoneChangeDetection, isDevMode } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideRouterStore } from '@ngrx/router-store';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { AdminEffects } from './store/effects/admin.effects';
import { routes } from './app.routes';
import { AuthEffects } from './store/effects/auth.effects';
import { authReducer } from './store/reducers/auth.reducers';
import { UserEffects } from './store/effects/user.effects';
import { userReducer } from './store/reducers/user.reducers';
import { DatePipe } from '@angular/common';
import { adminReducer } from './store/reducers/admin.reducers';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimationsAsync(),
    provideHttpClient(),
    provideRouterStore(),
    provideEffects([AuthEffects, UserEffects, AdminEffects]),
    provideStore({ 'Auth': authReducer, 'User': userReducer, 'Admin': adminReducer }),
    provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() }),
    DatePipe
  ]
};
