const plays = require('../plays.json');
const invoices = require('../invoices.json');
const TragedyCalculator = require('./calculator/TragedyCalculator')
const ComedyCalculator = require('./calculator/ComedyCalculator')

function createPerformanceCalculator(aPerformance, play){
  switch(play.type){
    case 'tragedy':
      return new TragedyCalculator(aPerformance, play)
    case 'comedy':
      return new ComedyCalculator(aPerformance, play)
    default:
      throw new Error('알수 없는 장르: ', play.type)
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
    result.volumeCredit = calculator.volumeCredits;
    return result;
  }

  function playFor(aPerformance){
    return plays[aPerformance.playID]
  }

  // function amountFor(aPerformance){
  //   let result = 0;
  //   switch(aPerformance.play.type){
  //     case "tragedy":
  //       result = 40000;
  //       if(aPerformance.audience > 30){
  //         result += 1000 * (aPerformance.audience - 30);
  //       }
  //       break;
  //     case "comedy":
  //       result = 30000;
  //       if(aPerformance.audience > 20){
  //         result += 10000 + 500 * (aPerformance.audience - 20);
  //       }
  //       result += 300 * aPerformance.audience;
  //       break;
  //     default:
  //       throw new Error(`알수 없는 장르: ${aPerformance.play.type}`)
  //   }
  //
  //   return result;
  // }

  // function volumeCreditFor(aPerformance){
  //   let result = 0;
  //   result += Math.max(aPerformance.audience - 30, 0);
  //   if('comedy' === aPerformance.play.type) result += Math.floor(aPerformance.audience / 5);
  //   return result
  // }

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
      { "style": 'currency', "currency": 'USD', "minimumFractionDigits": 2})
      .format(aNumber/100);
  }
}


console.log(renderPlainText(createStatementData(invoices, plays)))
