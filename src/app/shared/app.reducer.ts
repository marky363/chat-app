import { ActionReducerMap } from '@ngrx/store'; 
import * as fromAuth from '../auth/auth.reducer'
import * as fromChat from '../core/store/chat.reducer'



export interface AppState {
   authActions: fromAuth.State,
   chatActions: fromChat.State
}

export const appReducer: ActionReducerMap<AppState> = {
   authActions: fromAuth.AuthReducer,
   chatActions: fromChat.AuthReducer
}
