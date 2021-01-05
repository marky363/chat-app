import * as AuthActions from './auth.actions';
import {User} from './user.model'

export interface State {
   logged: boolean,
   user: User
}
const initialState: State = {
   logged: false, 
   user: null
};

export function AuthReducer(
  state = initialState,
  action: AuthActions.AuthActions
) {
  switch (action.type) {
    
    case AuthActions.LOGIN_SUCCESS:
      return {
        ...state,
        logged: true,
        user: action.payload
      }

    case AuthActions.LOGOUT:
     
      return {
        ...state,
        logged: false,
        user: null
      }
    default:
      return state;
  }
}
