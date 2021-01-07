import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule, NgForm, NgModel } from '@angular/forms';
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

  numbers = [
    'https://bootdey.com/img/Content/avatar/avatar1.png',
    'https://bootdey.com/img/Content/avatar/avatar2.png',
    'https://bootdey.com/img/Content/avatar/avatar3.png',
    'https://bootdey.com/img/Content/avatar/avatar4.png',
    'https://bootdey.com/img/Content/avatar/avatar5.png',
    'https://bootdey.com/img/Content/avatar/avatar6.png',
    'https://bootdey.com/img/Content/avatar/avatar7.png',
    'https://bootdey.com/img/Content/avatar/avatar8.png',
  ];

  myAvatar = '';
  chooseMyAvatar(url) {
    this.myAvatar = url;
    this.Form.controls['avatar'].setValue(url);
  }

  @ViewChild('f') Form: NgForm;

  login(f: NgModel) {
    if (f.valid) {
    
      let user = new User(f.value.nick, f.value.avatar);
      this.store.dispatch(new AuthActions.Login(user));
    }
  }
  ngOnInit(): void {}
}
