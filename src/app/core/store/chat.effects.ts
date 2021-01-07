import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireDatabase, AngularFireObject } from '@angular/fire/database';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';

import { map, mergeMap, switchMap, take, withLatestFrom } from 'rxjs/operators';
import {
  Invites,
  Group,
  Chat,
  Seens,
  getNormalTime,
} from '../../shared/chat.model';

import * as fromApp from '../../shared/app.reducer';
import * as ChatActions from '../store/chat.actions';
import { combineLatest, concat, of, Subscription } from 'rxjs';

@Injectable()
export class ChatEffects {
  @Effect({ dispatch: false })
  sendInvite = this.actions$.pipe(
    ofType(ChatActions.SEND_INVITE_TO_CHAT),
    map((action: ChatActions.StartChat) => action.payload),
    map((payload) => {
      this.auth.user.subscribe((data) => {
        console.log(payload.id);
        var conversationId = createConversationId(data.uid, payload.id);

        let date = Date.now();

        let db_grp = this.db.database.ref('group/' + conversationId);

        db_grp.child('members/' + data.uid).set(true);
        db_grp.child('members/' + payload.id).set(true);

        db_grp.child('createdAt').set(date);
        db_grp.child('createdBy').set(data.uid);
        db_grp.child('createdByName').set(data.displayName);
        db_grp.child('recentMessage').set({
          massageText: payload.message,
          sentBy: data.uid,
          sentAt: date,
          seen: false,
        });

        let db_msg = this.db.database.ref(
          'message/' + conversationId + '/messages'
        );
        db_msg.push({
          sentAt: date,
          sentBy: data.uid,
          message: payload.message,
          seen: false,
        });

        let db_usr = this.db.database.ref('user/' + data.uid + '/groups');
        db_usr.push(conversationId);

        let db_usr2 = this.db.database.ref('user/' + payload.id + '/invites');
        db_usr2.push().child(conversationId).set(true);
      });

      function createConversationId(uid1, uid2) {
        return uid1 > uid2 ? `${uid2}${uid1}` : `${uid1}${uid2}`;
      }
    })
  );

  @Effect({ dispatch: false })
  recieveInvites = this.actions$.pipe(
    ofType(ChatActions.RECIEVE_INVITES),
    switchMap(() => {
      return this.auth.user;
    }),
    map((user) => {
      let sub: Subscription;

      if (user) {
        sub = this.db
          .list('user/' + user.uid + '/invites')
          .valueChanges()
          .subscribe((dataUser) => {
            let array: Invites[] = [];

            let result = dataUser.reduce((a, c) => {
              let [[k, v]] = Object.entries(c);

              if (v === true) {
                this.db
                  .object('group/' + k + '')
                  .valueChanges()
                  .subscribe((dataGroup: Group) => {
                    var keys = Object.keys(dataGroup.members);
                    var filtered = keys
                      .filter((key) => key.valueOf() !== user.uid)
                      .toString();
                    this.db
                      .object<string>('user/' + filtered + '/photoUrl')
                      .valueChanges()
                      .subscribe((dataSecondUser) => {
                        let invite = new Invites(
                          k,
                          v,
                          dataGroup.createdByName,
                          dataGroup.recentMessage.massageText,
                          getNormalTime(dataGroup.recentMessage.sentAt),
    
                          dataSecondUser
                        );

                      
                        this.store.dispatch(
                          new ChatActions.StoreInvites(invite)
                        );
                      });
                  });
              }
              return '';
            }, {});
          });
      } else {
      }
    })
  );

  @Effect({ dispatch: false })
  acceptInvite = this.actions$.pipe(
    ofType(ChatActions.ACCEPT_INVITE),
    map((action: ChatActions.AcceptInvite) => action.payload),
    map((payload) => {
      this.auth.user.subscribe((user) => {
        let db_usr = this.db.database.ref('user/' + user.uid + '/groups');
        db_usr.push(payload);

        this.db.database
          .ref('user/' + user.uid + '/invites')
          .orderByChild(payload)
          .equalTo(true)
          .once('child_added', (data) => {
            data.ref.child(payload).set(false);
          });
        
        
      });
    })
  );

  @Effect({ dispatch: false })
  recieveGroups = this.actions$.pipe(
    ofType(ChatActions.RECIEVE_CHATS),
    switchMap(() => {
      return this.auth.user;
    }),
    map((res) => {
      let sub: Subscription;
      if (res) {
        sub = this.db
          .list<Group>('user/' + res.uid + '/groups')
          .valueChanges()
          .subscribe((data) => {
            data.forEach((item) => {
              this.db
                .object('group/' + item + '')
                .valueChanges()
                .subscribe((data: Group) => {
                  var keys = Object.keys(data.members);
                  var filtered = keys
                    .filter((key) => key.valueOf() !== res.uid)
                    .toString();
                  this.db
                    .object<string>('user/' + filtered + '/displayName')
                    .valueChanges()
                    .pipe(
                      mergeMap((filteredd) => {
                        return combineLatest([
                          of(filteredd),
                          this.db
                            .list<Seens>(
                              'message/' + item + '/messages',
                              (ref) => ref.orderByChild('seen').equalTo(false)
                            )
                            .valueChanges(),
                          this.db
                            .object<string>('user/' + filtered + '/photoUrl')
                            .valueChanges(),
                        ]);
                      })
                    )
                    .subscribe(([chatWith, seens, photoUrl]) => {
                      var mySeens = seens.filter(
                        (seen) => seen.sentBy == filtered
                      );

                      let date = new Date(data.recentMessage.sentAt);

                      var user = new Chat(
                        chatWith,
                        data.recentMessage.massageText,
                        data.recentMessage.sentBy,
                        filtered,
                        item,
                        mySeens.length,
                        date,
                        getNormalTime(date.getTime()),
                        data.recentMessage.sentAt,
                        photoUrl
                      );

                      this.store.dispatch(new ChatActions.StoreChats(user));
                    });
                });
            });
          });
      } else {
      }
    })
  );

  @Effect({ dispatch: false })
  sendMessage = this.actions$.pipe(
    ofType(ChatActions.SEND_MESSAGE),
    map((action: ChatActions.SendMessage) => action.payload),
    withLatestFrom(this.auth.user),
    map(([payload, user]) => {
      var date = Date.now();

      this.db.database.ref('message/' + payload.groupID + '/messages').push({
        sentAt: date,
        sentBy: user.uid,
        message: payload.msg,
        seen: false,
      });
      var db_grp = this.db.database.ref('group/' + payload.groupID);
      db_grp.child('recentMessage').set({
        massageText: payload.msg,
        sentBy: user.uid,
        sentAt: date,
      });
    })
  );

  sub: Subscription;

  @Effect({ dispatch: false })
  sendSeen = this.actions$.pipe(
    ofType(ChatActions.SEEN),
    map((action: ChatActions.Seen) => action.payload),
    withLatestFrom(this.auth.user),
    map(([payload, user]) => {
      this.sub = this.db
        .object<Seens[]>('message/' + payload + '/messages')
        .valueChanges()
        .pipe(
          take(1),
          map((res) => {
            var key = Object.entries(res);
            var items;

            items = key.filter((data) => {
              return data[1].seen === false;
            });
            return items;
          })
        )
        .subscribe((res) => {
          var mySeens = res.filter((seen) => seen[1].sentBy != user.uid);

          let i = 0;

          mySeens.forEach((seen, index) => {
            this.db.database
              .ref('message/' + payload + '/messages/' + seen[0])
              .update({
                seen: true,
              });
          });
        });
    })
  );

  @Effect({ dispatch: false })
  cancelSub = this.actions$.pipe(
    ofType(ChatActions.CANCEL_SUB),
    map(() => {
      if (this.sub) {
        this.sub.unsubscribe();
      }
    })
  );

  itemRef: AngularFireObject<any>;
  constructor(
    private actions$: Actions,
    private store: Store<fromApp.AppState>,
    private db: AngularFireDatabase,
    private auth: AngularFireAuth
  ) {}
}
