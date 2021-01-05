export class Invites {
  constructor(
    public id: string,
    public status: any,
    public createdBy?: string,
    public messsage?: string
  ) {}
}
export class InviteFromDB {
  constructor(
    public createdAt: string,
    public createdBy: string,
    public createdByName: string,
    public members: {},
    public recentMessage: {
      massageText: string,
      sentBy: string
    }
    
  ) {}
}
export class Group {
  constructor(
    public createdAt: string,
    public createdBy: string,
    public createdByName: string,
    public members: Array<[]>/* { id: string; accepted: boolean } */,
    public recentMessage: { massageText: string; sentBy: string, sentAt: number }
  ) {}
}
export class Chat {
  constructor(
    public name: any,
    public lastMessage: string,
    public sentBy: string,
    public uid?: string,
    public groupID?: any,
   public seen?: number,
    public date?: Date,


  ){}
}
export class Message {
  constructor(
    public message: any,
    public sentAt: Date,
    public sentBy: any,
    public seen: boolean
  ){}
}

export class Seens {
  constructor(
    public message: string,
    public seen: boolean,
    public sentAt: number,
    public sentBy: string,

  ){}
}
