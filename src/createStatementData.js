/**
 * 我们观察到 enrichPerformance 是计算演出数据的关键，正是由他填充了数据结构。
 * 现在为了多态，我们需要创建一个类，通过这个类来调用 enrichPerformance 中调用的函数
 * 以方便扩展多态。
 */
// 演出计算器
class PerformanceCalculator {
  constructor(aPerformance, aPlay) {
    this.performance = aPerformance;
    this.play = aPlay;
  }
}

// 第一模块，只负责计算
export default function createStatementData(invoice, plays) {
  const statementData = {};
  statementData.customer = invoice.customer;
  statementData.performances = invoice.performances.map(enrichPerformance);
  statementData.totalAmount = totalAmount(statementData);
  statementData.totalVolumeCredits = totalVolumeCredits(statementData);
  return statementData;

  function enrichPerformance(aPerformance) {
    const calculator = new PerformanceCalculator(aPerformance, playFor(aPerformance));

    const result = Object.assign({}, aPerformance);
    result.play = calculator.play;
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
}

/**
 * 虽然代码函数增加了，但重构也带来了代码可读性的提高。
 * 额外的包装将混杂的逻辑分解成可辨别的两部分，分离了计算逻辑和打印样式。
 * 这种模块化有助于了解他们的协作关系。
 * 通过这些重构，我们可以轻而易举地添加打印样式，而无需顾虑计算逻辑。
 */

/**
 * 下面展望下个阶段的重构：支持更多类型的戏剧
 * 目前只支持戏剧和悲剧，如果需要添加其他类型的戏剧，我们只需要在计算函数里添加分支逻辑即可。
 * 但是这样的设计容易因代码堆积而腐败。
 * 现在我们开始尝试使用“类型多台”来取代“条件表达式”
 */
