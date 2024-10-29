export default function statement(invoice, plays) {
  let result = `Statement for ${invoice.customer}\n`;

  for (let perf of invoice.performances) {
    // print line for this order
    result += `${playFor(perf).name}: ${usd(amountFor(perf) / 100)} (${perf.audience} seats)\n`;
  }

  result += `Amount owed is ${usd(totalAmount() / 100)}\n`;
  result += `You earned ${totalVolumeCredits()} credits\n`;
  return result;

  function totalAmount() {
    let result = 0;
    for (let perf of invoice.performances) {
      result += amountFor(perf);
    }
    return result;
  }

  function totalVolumeCredits() {
    let result = 0;
    for (let perf of invoice.performances) {
      result += volumeCreditsFor(perf);
    }
    return result;
  }

  // 移除format变量，典型的“将函数赋值给临时变量”的场景，将其替换为一个明确声明的函数；
  // format并未清晰表意，而formatAsUSD又太长。因为它强调格式化货币数字，所以改变函数声明（124）为usd；
  function usd(aNumber) {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 }).format(aNumber);
  }

  // 提炼函数（106），如果你需要花时间浏览一段代码才能弄清它到底在干什么，那么就应该提炼它。
  // 根据它做的事为它命名， 以后再读到这段代码的时候，一眼就能看出函数的用途，而不需要关心它如何达成该用途。
  // 改变函数声明（124），函数改名、加减参数、参数改为对象 等等，只要让函数的意图更清晰，就可以使用该方法。
  function amountFor(aPerformance) {
    let result = 0;
    switch (playFor(aPerformance).type) {
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
        throw new Error(`unknown type: ${playFor(aPerformance).type}`);
    }
    return result;
  }

  // 以查询取代临时变量（178），不必要的变量会创建很多对应的具有局部作用域的临时变量，会使提炼函数变得更加复杂
  // 这样可以避免在多个函数中重复编写计算逻辑，每当在不同地方看到同一段临时变量计算逻辑，可以想法设法挪到同一个函数里
  function playFor(aPerformance) {
    return plays[aPerformance.playID];
  }

  function volumeCreditsFor(perf) {
    let result = 0; // 原函数中的 volumeCredits
    result += Math.max(perf.audience - 30, 0);
    if ('comedy' === playFor(perf).type) {
      result += Math.floor(perf.audience / 5);
    }
    return result;
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
