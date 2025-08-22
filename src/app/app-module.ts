import { NgModule, isDevMode, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { App } from './app';

// NgRx
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreRouterConnectingModule } from '@ngrx/router-store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

@NgModule({
  declarations: [App],
  imports: [
    BrowserModule,
    AppRoutingModule,
    StoreModule.forRoot({}),                // root reducers
    EffectsModule.forRoot([]),              // root effects
    StoreRouterConnectingModule.forRoot(),  // router <-> store
    StoreDevtoolsModule.instrument({        // Redux DevTools
      maxAge: 25,
      logOnly: !isDevMode()
    }),
  ],
  providers: [provideBrowserGlobalErrorListeners()],
  bootstrap: [App]
})
export class AppModule {}
