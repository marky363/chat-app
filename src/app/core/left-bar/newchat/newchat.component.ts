import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Store } from '@ngrx/store';
import * as fromApp from "../../../shared/app.reducer";
import * as chatActions from "../../store/chat.actions"

@Component({
  selector: 'app-newchat',
  templateUrl: './newchat.component.html',
  styleUrls: ['./newchat.component.scss']
})
export class NewchatComponent implements OnInit {

  constructor(private store: Store<fromApp.AppState>) { }

  ngOnInit(): void {
  }

  sendInvite(f: NgForm) {
    if (f.valid) {
      this.store.dispatch(
        new chatActions.StartChat({ id: f.value.uid, message: f.value.message })
      );
      f.reset();
    }
  }

}
