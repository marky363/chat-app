import { Component, HostListener, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromApp from "./shared/app.reducer";
import * as AuthActions from "./auth/auth.actions";
import * as ChatActions from "./core/store/chat.actions"
import { ActivatedRoute } from '@angular/router';
import { fromEvent, Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  // encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit {

  logged: boolean = false;

  openedChat: boolean = false;
  screenWidth: number;

  mobileDevice: boolean = false;





  constructor(private store:Store<fromApp.AppState>, private snapshot: ActivatedRoute){}

  ngOnInit(){
    this.getScreenSize()
    this.store.dispatch(new AuthActions.AutoLogin())
    this.store.select("authActions").subscribe(state => {
      this.logged = state.logged
      if(state.logged){
        this.store.dispatch(new ChatActions.RecieveInvites())
        this.store.dispatch(new ChatActions.RecieveChat())
      }
    })

  

 
    this.snapshot.queryParams.pipe().subscribe((query) => {
    
      if(query.chat != undefined){
       this.openedChat = true
      }else {
        this.openedChat = false
        // 519
      }
    })
  }


 
  @HostListener('window:resize', ['$event'])
  getScreenSize(event?) {

        this.screenWidth = window.innerWidth;
        if(window.innerWidth < 519){
          this.mobileDevice = true;
        } else {
          this.mobileDevice = false
        }
       
  }
}
