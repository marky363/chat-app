import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import * as fromApp from '../shared/app.reducer';
import * as AuthActions from './auth.actions';

import { map, switchMap, take, tap } from 'rxjs/operators';
import { User } from './user.model';

import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireDatabase } from '@angular/fire/database';

@Injectable()
export class AuthEffects {
  @Effect({ dispatch: false })
  SaveLoginToStorage = this.actions$.pipe(
    ofType(AuthActions.LOGIN),
    map((action: AuthActions.Login) => action.payload),
    map((payload) => {
      // console.log(payload);
      this.firebase
        .signInAnonymously()
        .then((user) => {
          user.user.updateProfile({
            displayName: payload.name,
            photoURL: payload.imgURL,
          });

          user.user
            .getIdToken()
            .then((token) => {
              let db = this.db.database.ref('user/' + user.user.uid);
              db.child('displayName').set(payload.name);
              db.child('photoUrl').set(payload.imgURL);
              db.child('groups').set('');
              db.child('uid').set(user.user.uid);

              this.store.dispatch(
                new AuthActions.LoginSuccess(
                  handleAuth(
                    payload.name,
                    payload.imgURL,
                    user.user.uid,
                    token,
                    3600
                  )
                )
              );
            })
            .catch((error) => {
              console.log(error);
            });
        })
        .catch((error) => {
          console.log(error);
        });
    })
  );

  @Effect({ dispatch: false })
  autoLogin_autoLogOut = this.actions$.pipe(
    ofType(AuthActions.AUTO_LOGIN),
    switchMap(() => { return this.firebase.user.pipe(take(1)) }),
    map((data) => {
      
        if (data) {
           

          let user = new User(data.displayName, data.photoURL, data.uid);
          this.store.dispatch(new AuthActions.LoginSuccess(user));

          data.getIdTokenResult().then((data) => {
            var d = new Date(data.expirationTime).getTime();
            var e = new Date().getTime();
            var f = d - e;
            // console.log(f)
            autoLogout(f);
          });
        }
      

      function autoLogout(expirationTime: number) {
        //  setTimeout(() => {
        //    this.firebase.signOut();
        //   }, expirationTime);
      }
    })
  );

  @Effect({ dispatch: false })
  logout = this.actions$.pipe(
    ofType(AuthActions.LOGOUT),
    map(() => {
      this.firebase.signOut();
    })
  );

  constructor(
    private actions$: Actions,
    private store: Store<fromApp.AppState>,
    private firebase: AngularFireAuth,
    private db: AngularFireDatabase
  ) {}
}

function handleAuth(
  displayName: string,
  imageURL: string,
  userID: string,
  token: string,
  expiraton: number
) {
  const expiratonDate = new Date(new Date().getTime() + expiraton * 1000);

  let user = new User(displayName, imageURL, userID, token, expiratonDate);

  return user;
}
