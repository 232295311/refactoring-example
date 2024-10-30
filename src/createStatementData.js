/**
 * 多态改造完成。多态的好处：以一个个的高阶用例(子类),去拆解复杂的条件逻辑（比如在switch里写一堆）。
 * 分为两种方式：
 * 1. 如例子中的amount：switch中每个条件，处理各自的条件逻辑，就可以针对每种分支逻辑单独创建一个类
 * 2. 如例子中的volumeCredits,有一个基础逻辑，在此之上根据条件有不同变体逻辑。
 *    就可以将基础逻辑放入超类，将每种变体逻辑放入不同子类，其中代码着重强调与基础逻辑的差异。
 */

// 演出计算器
class PerformanceCalculator {
  constructor(aPerformance, aPlay) {
    this.performance = aPerformance;
    this.play = aPlay;
  }

  get amount() {
    throw new Error('This is abstract function, which subclass must implement it.');
  }

  get volumeCredits() {
    return Math.max(this.performance.audience - 30, 0);
  }
}
// 子类-悲剧
class TragedyCalculator extends PerformanceCalculator {
  get amount() {
    let result = 40000;
    if (this.performance.audience > 30) {
      result += 1000 * (this.performance.audience - 30);
    }
    return result;
  }
}
// 子类-喜剧
class ComedyCalculator extends PerformanceCalculator {
  get amount() {
    let result = 30000;
    if (this.performance.audience > 20) {
      result += 10000 + 500 * (this.performance.audience - 20);
    }
    result += 300 * this.performance.audience;
    return result;
  }
  get volumeCredits() {
    return super.volumeCredits + Math.floor(this.performance.audience / 5);
  }
}

// 以工厂函数取代构造函数（334）
function createPerformanceCalculator(aPerformance, aPlay) {
  // 以多态取代条件表达式（272）
  switch (aPlay.type) {
    case 'tragedy':
      return new TragedyCalculator(aPerformance, aPlay);
    case 'comedy':
      return new ComedyCalculator(aPerformance, aPlay);
    default:
      throw new Error(`unknown type: ${aPlay.type}`);
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
    const calculator = createPerformanceCalculator(aPerformance, playFor(aPerformance));

    const result = Object.assign({}, aPerformance);
    result.play = calculator.play;
    result.amount = calculator.amount;
    result.volumeCredits = calculator.volumeCredits;

    return result;
  }

  // 以管道代替循环（231）
  function totalAmount(data) {
    return data.performances.reduce((total, p) => total + p.amount, 0);
  }

  function totalVolumeCredits(data) {
    return data.performances.reduce((total, p) => total + p.volumeCredits, 0);
  }

  function playFor(aPerformance) {
    return plays[aPerformance.playID];
  }
}
