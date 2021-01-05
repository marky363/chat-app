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
      return {
        ...state,
        invites: action.payload,
      };

    default:
      return state;
  }
}
