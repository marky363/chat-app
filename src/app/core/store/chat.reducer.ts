import { act } from '@ngrx/effects';
import { find } from 'rxjs/operators';
import { Invites, Chat } from 'src/app/shared/chat.model';
import * as ChatActions from './chat.actions';

export interface State {
  chats: Chat[];
  invites: Invites[];
}
const initialState: State = {
  chats: [],
  invites: [],
};

export function AuthReducer(
  state = initialState,
  action: ChatActions.ChatActions
) {
  switch (action.type) {
    case ChatActions.STORE_CHATS:
      var originalState = [...state.chats];

      if (state.chats.length == 0) {
        originalState = [...state.chats, action.payload];
      } else {
        const findID = state.chats.findIndex(
          (msg) => msg.uid === action.payload.uid
        );

        if (findID == -1) {
          originalState = [...state.chats, action.payload];
        } else {
          const selectedMessage = state.chats[findID];
          const UpdatedMessage = {
            ...selectedMessage,
            ...action.payload,
          };
          originalState = [...state.chats];
          originalState[findID] = UpdatedMessage;
        }
      }

      return {
        ...state,
        chats: originalState,
      };

    case ChatActions.STORE_INVITES:

      var orgState = [...state.invites];

      if (state.invites.length == 0) {
        orgState = [...state.invites, action.payload];
      } else {
        const findID = state.invites.findIndex(
          (usr) => usr.createdBy === action.payload.createdBy
        );

        if (findID == -1) {
          orgState = [...state.invites, action.payload];
        } else {
          const selectedMessage = state.invites[findID];
          const UpdatedMessage = {
            ...selectedMessage,
            ...action.payload,
          };
          orgState = [...state.invites];
          orgState[findID] = UpdatedMessage;
        }
      }

     
      return {
        ...state,
        invites: orgState
      };

      case ChatActions.ACCEPT_INVITE:

       



      return {
        ...state,
        invites: state.invites.filter(invites => {
          return invites.id != action.payload
        })

      }

    default:
      return state;
  }
}
