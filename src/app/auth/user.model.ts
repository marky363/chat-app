export class User {
  constructor(
     public name: string,
     public imgURL: string,
     public id?: string,
     public _tokenExpirationDate?: any,
     public _token?: string,
     
  ) {}

  get token(){
    if (!this._tokenExpirationDate || new Date() > this._tokenExpirationDate) {
       return null;
    }
    return this._token;
 }
}
