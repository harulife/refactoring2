const Producer = require('./Producer')

class Province {
  constructor(doc) {
    this._name = doc.name;
    this._producers = [];
    this._totalProduction = 0;
    this._demand = doc.demand;
    this._price = doc.price;
    doc.producers.forEach(d => this.addProducer(new Producer(this, d)));
  }

  addProducer(arg){
    this._producers.push(arg);
    this._totalProduction += arg.production;
  }

  get price() { return this.price; }

  set price(arg) { this.price = arg }

  get totalProduction() { return this._totalProduction; }

  set totalProduction(arg) { this._totalProduction = arg }

  get shortfall() {
    return this._demand - this._totalProduction;
  }

  get profit() {
    return this.demandValue - this.demandCost
  }

  get demandValue() {
    return this.satisfiedDemand * this._price;
  }

  get satisfiedDemand() {
    return Math.min(this._demand, this._totalProduction);
  }

  get demandCost() {
    let remainingDemand = this._demand;
    let result = 0;
    this._producers
      .sort((a, b) => a.cost - b.cost)
      .forEach(p => {
        const contribution = Math.min(remainingDemand, p.production);
        remainingDemand -= contribution;
        result += contribution * p.cost;
      });
    return result;
  }
}

module.exports = Province
