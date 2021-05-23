const plays = require('./plays.json');
const invoices = require('./invoices.json');
const { statement: rawStatement } = require('./0. raw');

function statement(invoice, plays){
  let totalAmount = 0;
  let volumeCredit = 0;
  let result = `청구 내역 (고객 명: ${invoice.customer})\n`;

  for(let perf of invoice.performances){
    // const play = plays[perf.playID];
    // const thisAmount = amountFor(perf, play);

    // const thisAmount = amountFor(perf)

    volumeCredit += Math.max(perf.audience - 30, 0);
    if('comedy' === playFor(perf).type) volumeCredit += Math.floor(perf.audience / 5);

    result += `${playFor(perf).name}: ${usd(amountFor(perf))} (${perf.audience}석)\n`;
    totalAmount += amountFor(perf);
  }

  result += `총액: ${usd(totalAmount)}\n`;
  result += `적립 포인트: ${volumeCredit}점\n`;
  return result;

  /**
   * 임시 변수를 질의 함수로 바꾸기
   * 리펙토링 과정에서 임시 변수들로 인해 로컬 범위에 존재하는 이름이 늘어나서 추출 작업이 어려워진다.
   * play 라는 임시변수를 playFor 질의 함수로 변경후 함수를 참조하도록 코드를 변경한다.
   * 마찬가지로 amountFor 함수의 결과값으로 할당받은 thisAmount 변수도 인라인 적용을 한다.
   * 이러한 지역 변수를 제거함으로써 얻는 장점은 추출 작업이 쉬어진다는 것이다.
   * */
  function playFor(aPerformance){
    return plays[aPerformance.playID]
  }

  function amountFor(aPerformance){
    let result = 0;
    switch(playFor(aPerformance).type){
      case "tragedy":
        result = 40000;
        if(aPerformance.audience > 30){
          result += 1000 * (aPerformance.audience - 30);
        }
        break;
      case "comedy":
        result = 30000;
        if(aPerformance.audience > 20){
          result += 10000 + 500 * (aPerformance.audience - 20);
        }
        result += 300 * aPerformance.audience;
        break;
      default:
        throw new Error(`알수 없는 장르: ${playFor(aPerformance).type}`)
    }

    return result;
  }

  function usd(aNumber){
    return new Intl.NumberFormat(
      'en-US',
      { style: 'currency', currency: 'USD', minimumFractionDigits: 2})
      .format(aNumber/100);
  }
}

console.log('original and refactoring statement is', rawStatement(invoices, plays) === statement(invoices, plays) ? 'same' : 'different')
