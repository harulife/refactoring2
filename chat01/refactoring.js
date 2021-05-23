const plays = require('./plays.json');
const invoices = require('./invoices.json');
const { statement: rawStatement } = require('./0. raw');


/**
 * 1. 함수 추출하기
 *  추출하기에 용이한 부분은 전체를 각각의 부분으로 나누는 부분을 찾아본다.
 *  switch, if 문과 같이 분기처리가 이루어지면서 확장성의 여지를 가진 코드뭉치를 별도의 함수로 추출할 필요가 있다.
 *  함수의 반환값을 정의하는 변수명을 result로 통일하여 쉽게 해당 변수의 역할을 알수 있게 하자.
 *  변수명을 지을때 부정관사(a/an)을 뢀용하자.
 *
 * 2. 임시 변수를 질의 함수로 바꾸기
 *  리펙토링 과정에서 임시 변수들로 인해 로컬 범위에 존재하는 이름이 늘어나서 추출 작업이 어려워진다.
 *  play 라는 임시변수를 playFor 질의 함수로 변경후 함수를 참조하도록 코드를 변경한다.
 *  마찬가지로 amountFor 함수의 결과값으로 할당받은 thisAmount 변수도 인라인 적용을 한다.
 *  이러한 지역 변수를 제거함으로써 얻는 장점은 추출 작업이 쉬어진다는 것이다.
 *  함수의 호출 빈도는 리펙토링 전보다 높아졌지만 성능에 큰 영향을 주지 않는다. 무엇보다 지역 변수를 제거함으로써 오는 장점은 추출 작업이 쉬어진다는 것이다
 *
 * 3. 반복문 쪼개기
 *  이 리펙토링은 성능과 밀첩한 관계가 생기게된다.
 *  하나의 순회 과정을 쪼개어 여러 순회 과정으로 중복하게 되면 성능에 영향을 미치는건 사실이다.
 *  하지만 리펙토링에 대한 성능이슈는 체감상 많은 성능이슈를 주지않은 경우도 많을 뿐더러 만약 성능이 크게 떨어졌다면 리펙토링후 성능 선 진행하면 된다.
 *  결론적으로 "특별한 경우가 아니라면 성능 이슈, 일단 무시하라" 라는 조언
 *
 * 4. 단계 쪼개기
 *  1단계 {createStatementData} - 데이터 처리
 *  2단계 {renderPlainText} - 데이터 포맷팅 & 출력
 *  중간 다리 구조로 result{} 로 얕은 복사 및 참조 처리
 *
 * 5. 객체 지향
 * */

function createPerformanceCalculator(aPerformance, play){
  switch(play.type){
    case 'tragedy':
      return new TragedyPerformanceCalculator(aPerformance, play);
    case 'comedy':
      return new ComedyPerformanceCalculator(aPerformance, play);
    default:
      throw new Error('알수 없는 장르: ', play.type)
  }
}

class PerformanceCalculator{
  constructor(aPerformance, play){
    this.performance = aPerformance;
    this.play = play;
  }
  get amount(){
    throw new Error('subClass responsibility')
  }
  get volumeCredit(){
    return Math.max(this.performance.audience - 30, 0)
  }
}

class TragedyPerformanceCalculator extends PerformanceCalculator{
  get amount(){
    let result = 40000;
    if(this.performance.audience > 30){
      result += 1000 * (this.performance.audience - 30);
    }
    return result;
  }
}

class ComedyPerformanceCalculator extends PerformanceCalculator{
  get amount(){
    let result = 30000;
    if(this.performance.audience > 20){
      result += 10000 + 500 * (this.performance.audience - 20);
    }
    result += 300 * this.performance.audience;
    return result;
  }

  get volumeCredit(){
    return super.volumeCredit + Math.floor(this.performance.audience / 5)
  }
}


function createStatementData(invoice, plays){
  const result = {};
  result.customer = invoice.customer;
  result.performances = invoice.performances.map(enrichPerformance);
  result.totalAmount = totalAmount(result);
  result.totalVolumeCredit = totalVolumeCredit(result);

  return result;

  function enrichPerformance(aPerformance){
    const calculator = createPerformanceCalculator(aPerformance, playFor(aPerformance));
    const result = Object.assign({}, aPerformance);
    result.play = calculator.play;
    result.amount = calculator.amount;
    result.volumeCredit = calculator.volumeCredit;
    return result;
  }

  function playFor(aPerformance){
    return plays[aPerformance.playID]
  }

  function totalAmount(data){
    return data.performances.reduce((total, p) => total + p.amount, 0)
  }

  function totalVolumeCredit(data){
    return data.performances.reduce((total, p) => total + p.volumeCredit, 0)
  }
}

function renderPlainText(data){
  let result = `청구 내역 (고객 명: ${data.customer})\n`;

  for(let perf of data.performances){
    result += `${perf.play.name}: ${usd(perf.amount)} (${perf.audience}석)\n`;
  }

  result += `총액: ${usd(data.totalAmount)}\n`;
  result += `적립 포인트: ${data.totalVolumeCredit}점\n`;
  return result;

  function usd(number){
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2}).format(number / 100);

  }
}

console.log('original and refactoring statement is', rawStatement(invoices, plays) === renderPlainText(createStatementData(invoices, plays)) ? 'same' : 'different')

