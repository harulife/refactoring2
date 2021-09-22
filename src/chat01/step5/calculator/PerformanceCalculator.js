class PerformanceCalculator{
  constructor(aPerformance, play) {
    this.performance = aPerformance;
    this.play = play;
  }

  get amount(){
    throw new Error('subclass responsibility')
  }

  get volumeCredits(){
    return Math.max(this.performance.audience - 30, 0)
  }
}

module.exports = PerformanceCalculator
