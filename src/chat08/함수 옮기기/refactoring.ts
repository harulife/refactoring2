function trackSummary(points){
  const totalTime = calculateTime();
  const pace = totalTime / 60 / totalDistance(points);
  return {
    time: totalTime,
    distance: totalDistance(points),
    pace: pace
  }

  function calculateTime() {
    return 1;
  }
}

function totalDistance(points) {
  let result = 0;
  for(let i = 1; i < points.length; i++){
    result += distance(points[i-1], points[i]);
  }
  return result;

  function distance(p1, p2){
    return p1 > p2
      ? p1
      : p1 === p2 ? 0 : p2
  }
}

// 2.
class Account {
  daysOverdrawn: number
  type : AccountType
  
  constructor(type) {
    this.type = new AccountType(type);
  }

  get bankCharge() {
    let result = 4.5;
    if(this.daysOverdrawn > 0) result += this.overdraftCharge;
    return result;
  }

  get overdraftCharge() {
    return this.type.overdraftCharge(this.daysOverdrawn);
  }
}

class AccountType {
  isPremium: boolean;

  constructor(type) {
    this.isPremium = type.isPremium;
  }

  overdraftCharge(daysOverdrawn) {
    if(this.isPremium){
      const baseCharge = 10;
      if(daysOverdrawn <= 7)
        return baseCharge;
      else
        return baseCharge + (daysOverdrawn - 7) * 0.85;
    } else
      return daysOverdrawn * 1.75;
  }
}
