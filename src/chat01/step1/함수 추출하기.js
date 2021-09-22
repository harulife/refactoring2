const plays = require('../plays.json');
const invoices = require('../invoices.json');


/**
 * 함수 추출하기
 * 추출하기에 용이한 부분은 전체를 각각의 부분으로 나누는 부분을 찾아본다.
 * switch 와 같은 조건문은 조건에 따른 수행코드가 다를뿐더러 조건의 수가 유동적이기에 추출하기에 적합한 구문이다.
 * 함수로 만들때 함수가 수행하는 일을 함수명으로 명시한다.
 * 함수의 반환값을 정의하는 변수명을 result로 통일하여 쉽게 해당 변수의 역할을 알수 있게 하자.
 * 변수명을 지을때 부정관사(a/an)을 뢀용하자.
 */

function statement(invoice, plays){
  let totalAmount = 0;
  let volumeCredit = 0;
  let result = `청구 내역 (고객 명: ${invoice.customer})\n`;
  const format = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2}).format;

  for(let perf of invoice.performances){
    const play = plays[perf.playID];
    const thisAmount = amountFor(perf, play);

    // let thisAmount = 0;
    // switch(play.type){
    //   case "tragedy":
    //     thisAmount = 40000;
    //     if(perf.audience > 30){
    //       thisAmount += 1000 * (perf.audience - 30);
    //     }
    //     break;
    //   case "comedy":
    //     thisAmount = 30000;
    //     if(perf.audience > 20){
    //       thisAmount += 10000 + 500 * (perf.audience - 20);
    //     }
    //     thisAmount += 300 * perf.audience;
    //     break;
    //   default:
    //     throw new Error(`알수 없는 장르: ${play.type}`)
    // }

    volumeCredit += Math.max(perf.audience - 30, 0);
    if('comedy' === play.type) volumeCredit += Math.floor(perf.audience / 5);

    result += `${play.name}: ${format(thisAmount / 100)} (${perf.audience}석)\n`;
    totalAmount += thisAmount;
  }

  result += `총액: ${format(totalAmount/100)}\n`;
  result += `적립 포인트: ${volumeCredit}점\n`;
  return result;

  function amountFor(aPerformance, play){
    let result = 0;
    switch(play.type){
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
        throw new Error(`알수 없는 장르: ${play.type}`)
    }

    return result;
  }
}

