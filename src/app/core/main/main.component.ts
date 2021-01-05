import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';

import * as fromApp from '../../shared/app.reducer';
import * as AuthActions from '../../auth/auth.actions';
import { User } from 'src/app/auth/user.model';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent implements OnInit {
  constructor(private store: Store<fromApp.AppState>) {}
  nick: string;

  login() {
    let user = new User(this.nick);
    this.store.dispatch(new AuthActions.Login(user));
  }
  ngOnInit(): void {}
}
