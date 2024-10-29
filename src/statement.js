export default function statement(invoice, plays) {
  let totalAmount = 0;
  let volumeCredits = 0;
  let result = `Statement for ${invoice.customer}\n`;
  const format = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 }).format;
  for (let perf of invoice.performances) {
    // 内联变量（123），函数内部，临时变量不一定比表达式更具表现力，采用内联手法消除变量
    let thisAmount = amountFor(perf, playFor(perf));

    // add volume credits
    volumeCredits += Math.max(perf.audience - 30, 0);
    // add extra credit for every ten comedy attendees
    if ('comedy' === playFor(perf).type) volumeCredits += Math.floor(perf.audience / 5);
    // print line for this order
    result += `${playFor(perf).name}: ${format(thisAmount / 100)} (${perf.audience} seats)\n`;
    totalAmount += thisAmount;
  }
  result += `Amount owed is ${format(totalAmount / 100)}\n`;
  result += `You earned ${volumeCredits} credits\n`;
  return result;
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

  // 以查询取代临时变量（178），不必要的变量会创建很多对应的具有局部作用域的临时变量，会使提炼函数变得更加复杂
  // 这样可以避免在多个函数中重复编写计算逻辑，每当在不同地方看到同一段临时变量计算逻辑，可以想法设法挪到同一个函数里
  function playFor(aPerformance) {
    return plays[aPerformance.playID];
  }
}

/**
 * Statement for BigCo
 * Hamlet: $650.00 (55 seats)
 * As You Like It: $580.00 (35 seats)
 * Othello: $500.00 (40 seats)
 * Amount owed is $1,730.00
 * You earned 47 credits
 */
