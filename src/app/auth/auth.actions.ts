import {Action } from '@ngrx/store'
import { User } from './user.model'

export const LOGIN = '[Auth] - Loggin User'
export const LOGIN_SUCCESS = '[Auth] - Loggin User Success'
export const AUTO_LOGIN = '[Auth] - Auto Logging User'
export const LOGOUT = '[Auth] - Logged Out'

export class Login implements Action {
   readonly type = LOGIN

   constructor(public payload: User){}
}
export class AutoLogin implements Action {
   readonly type = AUTO_LOGIN

}
export class LogOut implements Action {
   readonly type = LOGOUT
}
export class LoginSuccess implements Action {
   readonly type = LOGIN_SUCCESS

   constructor(public payload: User){}
}

export type AuthActions = Login | AutoLogin | LogOut | LoginSuccess