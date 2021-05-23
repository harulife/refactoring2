const plays = require('./plays.json');
const invoices = require('./invoices.json');
const { statement: rawStatement } = require('./0. raw');


/**
 * 반복문 쪼개기
 * 이 리펙토링은 성능과 밀첩한 관계가 생기게된다.
 * 하나의 순회 과정을 쪼개어 여러 순회 과정으로 중복하게 되면 성능에 영향을 미치는건 사실이다.
 * 하지만 리펙토링에 대한 성능이슈는 체감상 많은 성능이슈를 주지않은 경우도 많을 뿐더러 만약 성능이 크게 떨어졌다면 리펙토링후 성능 개선을 진행하면 된다.
 * 결론적으로 "특별한 경우가 아니라면 성능 이슈, 일단 무시하라" 라는 조언
 *
 * */
function totalVolumeCredits(){
  let result = 0;
  for(let perf of invoices.performances){
    result += Math.max(perf.audience - 30, 0);
    if('comedy' === playFor(perf).type) result += Math.floor(perf.audience / 5);
  }
  return result;
}

function totalAmount(){
  let result = 0;
  for(let perf of invoices.performances){
   result += amountFor(perf)
  }
  return result;
}

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

function statement(invoice, plays){
  // let totalAmount = 0;
  // let volumeCredit = 0;
  let result = `청구 내역 (고객 명: ${invoice.customer})\n`;

  for(let perf of invoice.performances){
    // volumeCredit += Math.max(perf.audience - 30, 0);
    // if('comedy' === playFor(perf).type) volumeCredit += Math.floor(perf.audience / 5);
    result += `${playFor(perf).name}: ${usd(amountFor(perf))} (${perf.audience}석)\n`;
    // totalAmount += amountFor(perf);
  }

  result += `총액: ${usd(totalAmount())}\n`;
  result += `적립 포인트: ${totalVolumeCredits()}점\n`;
  return result;
}

console.log('original and refactoring statement is', rawStatement(invoices, plays) === statement(invoices, plays) ? 'same' : 'different')
