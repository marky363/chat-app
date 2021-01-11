import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromApp from "../shared/app.reducer"
import * as AuthActions from "./auth.actions"

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  tokenExpirationTimer: any;
  constructor(private store: Store<fromApp.AppState>) { }


  setLogoutTimer(expirationDuration: number) {
   
    this.tokenExpirationTimer = setTimeout(() => {
      this.store.dispatch(new AuthActions.LogOut());
    }, expirationDuration);

    
  }


  clearLogoutTimer() {
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
      this.tokenExpirationTimer = null;
    }
  }
}
