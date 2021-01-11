import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LeftBarComponent } from './core/left-bar/left-bar.component';
import { ChatPageComponent } from './core/chat-page/chat-page.component';
import { MainComponent } from './core/main/main.component';
import { FormsModule } from '@angular/forms';

import { StoreModule } from '@ngrx/store';
import * as fromApp from './shared/app.reducer';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from 'src/environments/environment';

import {AuthEffects} from "./auth/auth.effects";
import { ChatEffects } from "./core/store/chat.effects"

import { NgbModule } from '@ng-bootstrap/ng-bootstrap'

import { AngularFireModule } from '@angular/fire';

import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireDatabaseModule } from '@angular/fire/database';

import {ChatService} from "./core/chat.service";
import { NewchatComponent } from './core/left-bar/newchat/newchat.component'

const config = {
  apiKey: "AIzaSyDp4tO6mImjWmzizmI-Y5y-MXV7E_Igu7Q",
  authDomain: "chat-app-marky.firebaseapp.com",
  databaseURL: "https://chat-app-marky-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "chat-app-marky",
  storageBucket: "chat-app-marky.appspot.com",
  messagingSenderId: "491389757639",
  appId: "1:491389757639:web:6e07972a4d1f5f6746f6e2",
  measurementId: "G-GBJL6S6PS4"
};

@NgModule({
  declarations: [
    AppComponent,
    LeftBarComponent,
    ChatPageComponent,
    MainComponent,
    NewchatComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    StoreModule.forRoot(fromApp.appReducer),
    StoreDevtoolsModule.instrument({ logOnly: environment.production }),
    EffectsModule.forRoot([AuthEffects, ChatEffects]),
    NgbModule,

    AngularFireModule.initializeApp(config),
    AngularFireAuthModule, 
    AngularFireDatabaseModule,
  
  ],
  providers: [ChatService],
  bootstrap: [AppComponent]
})
export class AppModule { }
