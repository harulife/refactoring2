const plays = require('./plays.json');
const invoices = require('./invoices.json');
const { statement: rawStatement } = require('./0. raw');

/**
 * 단계 쪼개기
 * 1단계 {createStatementData} - 데이터 처리
 * 2단계 {renderPlainText} - 데이터 포맷팅 & 출력
 * 중간 다리 구조로 result{} 로 얕은 복사 및 참조 처리
 *
 * */
function createStatementData(invoice, plays){
  const result = {};
  result.customer = invoice.customer;
  result.performances = invoice.performances.map(enrichPerformance);
  result.totalAmount = totalAmount(result);
  result.totalVolumeCredit = totalVolumeCredit(result);

  return result;

  function enrichPerformance(aPerformance){
    const result = Object.assign({}, aPerformance);
    result.play = playFor(result);
    result.amount = amountFor(result);
    result.volumeCredit = volumeCreditFor(result);
    return result;
  }

  function playFor(aPerformance){
    return plays[aPerformance.playID]
  }

  function amountFor(aPerformance){
    let result = 0;
    switch(aPerformance.play.type){
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
        throw new Error(`알수 없는 장르: ${aPerformance.play.type}`)
    }

    return result;
  }

  function volumeCreditFor(aPerformance){
    let result = 0;
    result += Math.max(aPerformance.audience - 30, 0);
    if('comedy' === aPerformance.play.type) result += Math.floor(aPerformance.audience / 5);
    return result
  }

  function totalAmount(data){
    return data.performances.reduce((total, p) => total + p.amount, 0);
  }

  function totalVolumeCredit(data){
    return data.performances.reduce((total, p) => total + p.volumeCredit, 0);
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

  function usd(aNumber){
    return new Intl.NumberFormat(
      'en-US',
      { style: 'currency', currency: 'USD', minimumFractionDigits: 2})
      .format(aNumber/100);
  }
}


console.log('original and refactoring statement is', rawStatement(invoices, plays) === renderPlainText(createStatementData(invoices, plays)) ? 'same' : 'different')
