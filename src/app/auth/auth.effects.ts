import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import * as fromApp from '../shared/app.reducer';
import * as AuthActions from './auth.actions';

import { map, switchMap, tap } from 'rxjs/operators';
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
          user.user.updateProfile({ displayName: payload.name });

          user.user
            .getIdToken()
            .then((token) => {
             let db = this.db.database.ref('user/' + user.user.uid);
             db.child('displayName').set(payload.name);
             db.child('groups').set("");
             db.child('uid').set(user.user.uid)


              this.store.dispatch(
                  new AuthActions.LoginSuccess(
                  handleAuth(payload.name, user.user.uid, token, 3600)
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
    map((type) => {
     
      this.firebase.user.subscribe((data) => {
        if (data) {
          //  console.log(data.uid)
          let user = new User(data.displayName, data.uid);
          this.store.dispatch(new AuthActions.LoginSuccess(user));

          data.getIdTokenResult().then((data) => {
            var d = new Date(data.expirationTime).getTime();
            var e = new Date().getTime();
            var f = d - e;
            // console.log(f)
            autoLogout(f)
          });
        }
      });

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
  userID: string,
  token: string,
  expiraton: number
) {
  const expiratonDate = new Date(new Date().getTime() + expiraton * 1000);

  let user = new User(displayName, userID, token, expiratonDate);

  return user;
}
