export class Invites {
  constructor(
    public id: string,
    public status: any,
    public createdBy?: string,
    public messsage?: string,
    public normalDate?: string
  ) {}
}
export class InviteFromDB {
  constructor(
    public createdAt: string,
    public createdBy: string,
    public createdByName: string,
    public members: {},
    public recentMessage: {
      massageText: string;
      sentBy: string;
    }
  ) {}
}
export class Group {
  constructor(
    public createdAt: string,
    public createdBy: string,
    public createdByName: string,
    public members: Array<[]> /* { id: string; accepted: boolean } */,
    public recentMessage: {
      massageText: string;
      sentBy: string;
      sentAt: number;
    }
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
    public normalDate?: string
  
  ) {}
}
export class Message {
  constructor(
    public message: any,
    public sentAt: Date,
    public sentBy: any,
    public seen: boolean,
    public normalDate?: string
   
  ) {}
}

export class Seens {
  constructor(
    public message: string,
    public seen: boolean,
    public sentAt: number,
    public sentBy: string
  ) {}
}

export function getNormalTime(date) {
  let currentDate = new Date();
  let currentDateTime = currentDate.getTime();

  const diff = currentDateTime - date;

  let newDate = new Date(date);

  const msg_DayOfMonth = newDate.getDate();
  const msg_Month = newDate.getMonth();
  const msg_Year = newDate.getFullYear();
  const msg_Hours = newDate.getHours();
  const msg_Minutes = newDate.getMinutes();

  function pad(n) {
    return n < 10 ? '0' + n : n;
  }
  let Time = pad(msg_Hours) + ':' + pad(msg_Minutes);
  let DateAndTime = Time + ' ' + pad(msg_DayOfMonth) + '/' + pad(msg_Month + 1);
  let DateAndTimeAndYear = DateAndTime + '/' + msg_Year;

  if (diff < 8640000) {
    return Time
  } else if (date < 1609455600000) {
    return DateAndTimeAndYear
  } else {
   return DateAndTime 
  }
}
