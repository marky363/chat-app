import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Store } from '@ngrx/store';
import { User } from 'src/app/auth/user.model';

import * as fromApp from "../../shared/app.reducer"
import * as AuthActions from "../../auth/auth.actions";
import * as ChatActions from "../store/chat.actions";
import { Chat, Invites,  } from 'src/app/shared/chat.model';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';


@Component({
  selector: 'app-left-bar',
  templateUrl: './left-bar.component.html',
  styleUrls: ['./left-bar.component.scss'],
  // encapsulation: ViewEncapsulation.None
})
export class LeftBarComponent implements OnInit {

  user: User;
  invitesBar: Invites[] = []

  chats: Chat[] = []

  openChat(uid){
    this.router.navigate([''], { queryParams: { chat:  uid } });
  }

  

  logout(){
   
    this.store.dispatch(new AuthActions.LogOut)
  }

  acceptInvite(id){
    this.store.dispatch(new ChatActions.AcceptInvite(id))
  }

  constructor(private store: Store<fromApp.AppState>, private router: Router) { }

  sortBy(prop: Chat[] ){
    var list = prop.slice().sort((x,y) => {
      
      return y.timestamp - x.timestamp
    })
   return list
  }

  ngOnInit(): void {

   

    this.store.select("authActions").subscribe(state => {
      this.user = state.user
    })

    this.store.select("chatActions")
    
    .subscribe(state => {
     
     this.chats = this.sortBy(state.chats);
     this.invitesBar = state.invites
  
     

     
    })

   
  }

}
