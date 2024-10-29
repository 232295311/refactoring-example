export default function statement(invoice, plays) {
  let statementData = {};
  statementData.customer = invoice.customer;
  statementData.performances = invoice.performances.map(enrichPerformance);
  statementData.totalAmount = totalAmount(statementData);
  statementData.totalVolumeCredits = totalVolumeCredits(statementData);

  function enrichPerformance(aPerformance) {
    const result = Object.assign({}, aPerformance);
    result.play = playFor(result);
    result.amount = amountFor(result);
    result.volumeCredits = volumeCreditsFor(result);

    return result;
  }

  // 以管道代替循环（231）
  function totalAmount(data) {
    return data.performances.reduce((total, p) => total + p.amount, 0);
  }

  function totalVolumeCredits(data) {
    return data.performances.reduce((total, p) => total + p.volumeCredits, 0);
  }

  function volumeCreditsFor(aPerformance) {
    let result = 0; // 原函数中的 volumeCredits
    result += Math.max(aPerformance.audience - 30, 0);
    if ('comedy' === aPerformance.play.type) {
      result += Math.floor(aPerformance.audience / 5);
    }
    return result;
  }

  function amountFor(aPerformance) {
    let result = 0;
    switch (aPerformance.play.type) {
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
        throw new Error(`unknown type: ${aPerformance.play.type}`);
    }
    return result;
  }

  function playFor(aPerformance) {
    return plays[aPerformance.playID];
  }

  return renderPlainText(statementData);
}

// 拆分阶段（154），将大段代码拆分成各自独立的模块，每个模块单独维护一个主题。
// 现在我想拆成两个模块，第一模块负责计算，第二模块负责打印。
// 第一步，先提炼全部函数到第二模块的函数中
// 第二步，增加中转数据结构data，接下来的目的是逐渐将invoice 和 plays 转移到 data 中
// 第三步，转移invoice.customer
// 第四步，转移invoice.performances，消除invoice参数
// 第五步，打算转移plays，需要先转移playFor，新增map函数
// 第六步，转移plays成功，消除plays参数
// 第七步，转移 amountFor 和 volumeCreditsFor
// 第八步，转移 totalAmount 和 totalVolumeCredits
function renderPlainText(data) {
  let result = `Statement for ${data.customer}\n`;
  for (let perf of data.performances) {
    // print line for this order
    result += `${perf.play.name}: ${usd(perf.amount)} (${perf.audience} seats)\n`;
  }
  result += `Amount owed is ${usd(data.totalAmount)}\n`;
  result += `You earned ${data.totalVolumeCredits} credits\n`;
  return result;

  function usd(aNumber) {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 }).format(aNumber / 100);
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
