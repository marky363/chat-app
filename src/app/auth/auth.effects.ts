import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import * as fromApp from '../shared/app.reducer';
import * as AuthActions from './auth.actions';
import * as ChatActions from '../core/store/chat.actions';

import { catchError, map, switchMap, take, tap } from 'rxjs/operators';
import { User } from './user.model';

import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireDatabase } from '@angular/fire/database';
import firebase from 'firebase/app';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { from, Observable, of } from 'rxjs';
import { Chat } from '../shared/chat.model';

const handleAuthentication = (
  name: string,
  imageURL: string,
  userID: string,
  expiresIn: number,
  token?: string
) => {
  const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);

  const user = new User(name, imageURL, userID, expirationDate);

  return new AuthActions.LoginSuccess(user);
};

@Injectable()
export class AuthEffects {
  @Effect()
  SaveLoginToStorage = this.actions$.pipe(
    ofType(AuthActions.LOGIN),
    map((action: AuthActions.Login) => action.payload),
    switchMap((payload) => {
      return from(this.auth.signInAnonymously()).pipe(
        map((user) => {
          user.user.updateProfile({
            displayName: payload.name,
            photoURL: payload.imgURL,
          });
          return user;
        }),
        switchMap((user) => {
          return from(user.user.getIdToken()).pipe(
            map((token) => {
              let db = this.db.database.ref('user/' + user.user.uid);
              db.child('displayName').set(payload.name);
              db.child('photoUrl').set(payload.imgURL);
              db.child('groups').set('');
              db.child('uid').set(user.user.uid);
              this.AuthService.setLogoutTimer(3600000);
              return handleAuthentication(
                payload.name,
                payload.imgURL,
                user.user.uid,
                3600,
                token
              );
            })
          );
        })
      );
    })
  );

  @Effect({ dispatch: false })
  autoLogin_autoLogOut = this.actions$.pipe(
    ofType(AuthActions.AUTO_LOGIN),
    switchMap(() => {
      return this.auth.user.pipe(take(1));
    }),
    map((data) => {
      if (data) {
        let user = new User(data.displayName, data.photoURL, data.uid);
        this.store.dispatch(new AuthActions.LoginSuccess(user));

        data.getIdTokenResult().then((data) => {
          var d = new Date(data.expirationTime).getTime();
          var e = new Date().getTime();
          var f = d - e;

          this.AuthService.setLogoutTimer(f);
        });
      }
    })
  );

  @Effect({ dispatch: false })
  logout = this.actions$.pipe(
    ofType(AuthActions.LOGOUT),
    map(() => this.store.dispatch(new ChatActions.CancelSub())),
    map(() => {
      this.router.navigate(['']);
      this.auth.signOut();
      this.AuthService.clearLogoutTimer();
    })
  );
  @Effect()
  googleLogin = this.actions$.pipe(
    ofType(AuthActions.LOGIN_GOOGLE),
    switchMap(() => {
      return from(
        this.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider())
      ).pipe(
        map((user) => {
          let newUser = user.additionalUserInfo.isNewUser;

          if (newUser) {
            let db = this.db.database.ref('user/' + user.user.uid);
            db.child('displayName').set(user.user.displayName);
            db.child('photoUrl').set(user.user.photoURL);
            db.child('groups').set('');
            db.child('uid').set(user.user.uid);
            this.AuthService.setLogoutTimer(3600000);
            return handleAuthentication(
              user.user.displayName,
              user.user.photoURL,
              user.user.uid,
              3600
            );
          } else {
            this.AuthService.setLogoutTimer(3600000);
            return handleAuthentication(
              user.user.displayName,
              user.user.photoURL,
              user.user.uid,
              3600
            );
          }
        })
      );
    })
  );

  constructor(
    private actions$: Actions,
    private store: Store<fromApp.AppState>,
    private auth: AngularFireAuth,
    private db: AngularFireDatabase,
    private router: Router,
    private AuthService: AuthService
  ) {}
}
