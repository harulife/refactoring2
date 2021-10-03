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

// write
console.log(users['user01'].schedule['09']['01']);

// read

function compareUsage(userId, month, day){
  const work = users[userId].schedule[month][day];
}
