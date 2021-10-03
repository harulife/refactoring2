const users = {
  'user01': {
    name: 'minwoo',
    created_at: new Date(),
    schedule: {
      '09': {
        '01': 'reading book',
        '02': 'singing',
        '03': 'meeting friend'
      }
    }
  }
}

class User {
  readonly data;
  constructor(data) {
    this.data = data;
  }

  schedule(userId, month, day){
    return this.data[userId].schedule[month][day];
  }

  rawData(){
    return JSON.parse(JSON.stringify(this.data));
  }
}

const user = new User(users);

function compareUsage(userId, month, day){
  const work = user.rawData().schedule(userId, month, day);
  return work;
}
