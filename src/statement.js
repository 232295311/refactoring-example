// 提炼函数（106），如果你需要花时间浏览一段代码才能弄清它到底在干什么，那么就应该提炼它。
// 根据它做的事为它命名， 以后再读到这段代码的时候，一眼就能看出函数的用途，而不需要关心它如何达成该用途。
function amountFor(aPerformance, play) {
  let result = 0;
  switch (play.type) {
    case 'tragedy':
      result = 40000;
      if (aPerformance.audience > 30) {
        result += 1000 * (aPerformance.audience - 30);
      }
      break;
    case 'comedy':
      result = 30000;
      if (aPerformance.audience > 20) {
        result += 10000 + 500 * (aPerformance.audience - 20);
      }
      result += 300 * aPerformance.audience;
      break;
    default:
      throw new Error(`unknown type: ${play.type}`);
  }
  return result;
}
export default function statement(invoice, plays) {
  let totalAmount = 0;
  let volumeCredits = 0;
  let result = `Statement for ${invoice.customer}\n`;
  const format = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 }).format;
  for (let perf of invoice.performances) {
    const play = plays[perf.playID];
    let thisAmount = amountFor(perf, play);

    // add volume credits
    volumeCredits += Math.max(perf.audience - 30, 0);
    // add extra credit for every ten comedy attendees
    if ('comedy' === play.type) volumeCredits += Math.floor(perf.audience / 5);
    // print line for this order
    result += `${play.name}: ${format(thisAmount / 100)} (${perf.audience} seats)\n`;
    totalAmount += thisAmount;
  }
  result += `Amount owed is ${format(totalAmount / 100)}\n`;
  result += `You earned ${volumeCredits} credits\n`;
  return result;
}

/**
 * Statement for BigCo
 * Hamlet: $650.00 (55 seats)
 * As You Like It: $580.00 (35 seats)
 * Othello: $500.00 (40 seats)
 * Amount owed is $1,730.00
 * You earned 47 credits
 */
