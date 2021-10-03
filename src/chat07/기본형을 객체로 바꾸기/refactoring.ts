// 주문 클래스
class Order{
  priority: Priority;
  constructor(data: { priority: string }) {
    this.priority = new Priority(data.priority);
  }
}

// 우선순위 클래스
class Priority{
  value: string = '';

  constructor(value: string | Priority){
    if(value instanceof Priority) return value;
    this.value = value;
  }

  static legalValues() { return ['low', 'normal', 'high', 'rust']; }

  toString() { return this.value; }

  get index() { return Priority.legalValues().findIndex(s => s === this.value); }

  equals(other: Priority) { return this.index === other.index; }

  higherThan(other: Priority) { return this.index > other.index; }

  lowerThan(other: Priority) { return this.index < other.index; }
}

const priorities = ['low', 'high'];
const orders = priorities.map(priority => new Order({ priority: priority }));

const highPriorityCount = orders
  .filter(order => order.priority.higherThan(new Priority('normal')))
  .length;

const equalPriorityCount = orders
  .filter(order => order.priority.equals(new Priority('normal')))
  .length;

console.log(highPriorityCount)
console.log(equalPriorityCount)
