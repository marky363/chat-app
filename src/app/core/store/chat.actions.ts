import {Action } from '@ngrx/store'
import { Invites, Chat } from 'src/app/shared/chat.model'


export const SEND_INVITE_TO_CHAT = '[Chat] - Starting chat'
export const RECIEVE_INVITES = '[Chat] - Recieving Invites'
export const STORE_INVITES = '[Chat] - Storing Invites'
export const ACCEPT_INVITE = '[Chat] - AcceptInvite'

export const RECIEVE_CHATS = '[Chat] - Recieving chats '
export const STORE_CHATS = '[Chat] - Storing chat'

export const SEND_MESSAGE = '[Chat] - Sending message'

export const SEEN = '[Chat] - Seen'
export const CANCEL_SUB = '[Chat] - Cancel Sub'

export class StartChat implements Action {
   
   readonly type = SEND_INVITE_TO_CHAT

   constructor(public payload: {id: string, message: string}){}
}
export class RecieveInvites implements Action {
   
   readonly type = RECIEVE_INVITES


}
export class StoreInvites implements Action {
   readonly type = STORE_INVITES;

   constructor(public payload: Invites){}
}


export class AcceptInvite implements Action {
   readonly type = ACCEPT_INVITE;

   constructor(public payload: string){}
}

export class RecieveChat implements Action {
   readonly type = RECIEVE_CHATS;
}

export class StoreChats implements Action {
   
   readonly type = STORE_CHATS

   constructor(public payload: Chat){}
}

export class SendMessage implements Action {
   readonly type = SEND_MESSAGE;
   
   constructor(public payload: {msg: string, groupID: string}){}
}

export class Seen implements Action {
   readonly type = SEEN

   constructor(public payload: string){}
}
export class CancelSub implements Action {
   readonly type = CANCEL_SUB
}

export type ChatActions = StartChat  | RecieveInvites | StoreInvites | StoreChats  | AcceptInvite