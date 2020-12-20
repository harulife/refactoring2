const plays = require('./plays.json');
const invoices = require('./invoices.json');
const result = require('./raw.js');


/**
 * 1. 함수 추출하기
 *  switch, if 문과 같이 분기처리가 이루어지면서 확장성을 가진 코드뭉치를 별도의 함수로 추출할 필요가 있다.
 *  -> amountFor(aPerformance)라는 함수로 추출
 * 2. 함수 반환 값에 대한 명명
 *  함수 반환 값으로 사용되는 변수명을 'result'로 통일
 * 3. 함수의 인수명에 대한 명명
 *  매개 변수의 명에 타입 이름을 접두사로 적는데, 만약 매개변수의 역할이 뚜렷하지 않는다면 부정관사를 사용
 * 4.유효, 지역범위안에 사용되는 지역, 임시변수를 질의 함수로 바꾸기
 *  play 변수를 playFor 함수로 추출 -> 변수를 추출한 함수 선언으로 바꾸기
 *  함수의 호출 빈도는 리펙토링 전보다 높아졌지만 성능에 큰 영향을 주지 않는다. 무엇보다 지역 변수를 제거함으로써 오는 장점은 추출 작업이 쉬어진다는 것이다
 * 5. totalAmount, volumeCredit 지역변수를 제거하는 단계
 *  1. 반복문 쪼개기
 *  2. 함수로 추출하기
 *  3. 변수 인라인 하기
 * */

function statement(invoice, plays){
  let result = `청구 내역 (고객 명: ${invoice.customer})\n`;

  for(let perf of invoice.performances){
    result += `${playFor(perf).name}: ${usd(amountFor(perf) )} (${perf.audience}석)\n`;
  }

  result += `총액: ${usd(totalAmount())}\n`;
  result += `적립 포인트: ${totalVolumeCredits(invoice)}점\n`;


  function usd(number){
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2}).format(number / 100);

  }

  function volumeCreditFor(aPerformance){
    let result = 0;
    result += Math.max(aPerformance.audience, 0);
    if("comedy" === playFor(aPerformance).type){
      result += Math.floor(aPerformance.audience / 5);
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

  function totalVolumeCredits(){
    let result = 0;
    for(let perf of invoice.performances){
      result += volumeCreditFor(perf);
    }
    return result;
  }

  function totalAmount(){
    let result = 0;
    for(let perf of invoice.performances){
      result += amountFor(perf);
    }
    return result
  }

  return result;
}



console.log('original and refactoring statement is', statement(invoices, plays) === result ? 'same' : 'different')

