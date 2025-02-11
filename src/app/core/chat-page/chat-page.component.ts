import { Location } from '@angular/common';
import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { of, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { Chat, Message, getNormalTime } from 'src/app/shared/chat.model';

import * as fromApp from '../../shared/app.reducer';
import * as chatActions from '../store/chat.actions';


@Component({
  selector: 'app-chat-page',
  templateUrl: './chat-page.component.html',
  styleUrls: ['./chat-page.component.scss'],
  // encapsulation: ViewEncapsulation.None
})
export class ChatPageComponent implements OnInit, OnDestroy {
  @ViewChild('conversation') private scrollBottom: ElementRef;

  messageSelected: boolean = false;
  chatUID: string;
  chatWith: Chat;
  date: Date = new Date();
  sub: Subscription;

  messagesCount: number = 50;
  addMessages(num) {
    this.messagesCount = this.messagesCount + 20;
    console.log(this.messagesCount);
  }

  messages: Message[] = [];

  constructor(
    private store: Store<fromApp.AppState>,
    private snapshot: ActivatedRoute,
    private db: AngularFireDatabase,
    private router: Router
  ) {}

  interval = setInterval(() => {
    if (this.messages.length > 5 && this.chatWith != undefined) {
      this.scrollToBottom();

      clearInterval(this.interval);
    }
  }, 10);

 

  sendMessage(f: NgForm) {
    if(f.valid){
     this.store.dispatch(
      new chatActions.SendMessage({ msg: f.value.msg, groupID: this.chatUID })
    );
    f.reset()
    }
     
    
  }
  ngOnDestroy() {
    this.store.dispatch(new chatActions.CancelSub());
  }


  

  ngOnInit(): void {
    this.snapshot.queryParams.pipe().subscribe((query) => {
      this.chatUID = query.chat;
      if (this.chatUID == undefined) {
       
        this.store.dispatch(new chatActions.CancelSub());
      }

      if (this.sub) {
        this.sub.unsubscribe();
      }

      if (query.chat) {
        this.interval;

        this.messageSelected = true;

        this.store.select('chatActions').subscribe((state) => {
          this.chatWith = state.chats.find(
            (chat) => chat.groupID == this.chatUID
          );

          this.scrollToBottom();
        });
        this.scrollToBottom();
        this.sub = this.db
          .list<Message>('message/' + query.chat + '/messages', (ref) =>
            ref.orderByChild('sentAt').limitToLast(this.messagesCount)
          )
          .valueChanges()
          .pipe(
            map((res) => {
              let copyRes = res;
              copyRes.map((msg) => {
                msg.normalDate = getNormalTime(msg.sentAt);
              });
              return copyRes;
            })
          )
          .subscribe((data) => {
            this.store.dispatch(new chatActions.Seen(this.chatUID));

            this.messages = data;
           

            this.scrollToBottom();
          });
      } else {
        this.messageSelected = false;
      }
    });
  }

 
  scrollToBottom(): void {
    try {
      this.scrollBottom.nativeElement.scrollIntoView({ block: 'end' });
    } catch (err) {}
  }

  back() {
    this.router.navigate([""])
  }
}
