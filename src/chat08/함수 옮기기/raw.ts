
// 1.
function trackSummary(points){
  const totalTime = calculateTime();
  const totalDistance = calculateDistance();
  const pace = totalTime / 60 / totalDistance;
  return {
    time: totalTime,
    distance: totalDistance,
    pace: pace
  }

  function calculateDistance() {
    let result = 0;
    for(let i = 1; i < points.length; i++){
      result += distance(points[i-1], points[i]);
    }
    return result;
  }
  function distance(p1, p2){
    return p1 > p2
      ? p1
      : p1 === p2 ? 0 : p2
  }
  function calculateTime() {
    return 1;
  }
}


// 2.
class Account {
  daysOverdrawn: number
  type : {
    isPremium: boolean
  }

  get bankCharge() {
    let result = 4.5;
    if(this.daysOverdrawn > 0) result += this.overdraftCharge;
    return result;
  }

  get overdraftCharge() {
    if(this.type.isPremium){
      const baseCharge = 10;
      if(this.daysOverdrawn <= 7)
        return baseCharge;
      else
        return baseCharge + (this.daysOverdrawn - 7) * 0.85;
    } else
      return this.daysOverdrawn * 1.75;
  }
}
