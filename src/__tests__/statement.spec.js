import statement from '../statement';
const fs = require('fs');

describe('statement function', () => {
  test('处理原数据文件', () => {
    // 从文件中读取 JSON 数据
    const playsContent = fs.readFileSync('./data/plays.json', 'utf8');
    const invoicesContent = fs.readFileSync('./data/invoices.json', 'utf8');
    // 将 JSON 字符串转换为 JavaScript 对象
    const plays = JSON.parse(playsContent);
    const invoices = JSON.parse(invoicesContent);

    const expectedOutput = `Statement for BigCo\n` + `Hamlet: $650.00 (55 seats)\n` + `As You Like It: $580.00 (35 seats)\n` + `Othello: $500.00 (40 seats)\n` + `Amount owed is $1,730.00\n` + `You earned 47 credits\n`;

    const result = statement(invoices, plays);

    expect(result).toEqual(expectedOutput);
  });

  test('处理【观众人数 <= 30】的悲剧表演', () => {
    const invoice = {
      customer: 'John Doe',
      performances: [{ playID: 'hamlet', audience: 25 }],
    };
    const plays = {
      hamlet: { name: 'Hamlet', type: 'tragedy' },
    };

    const result = statement(invoice, plays);

    expect(result).toContain('Statement for John Doe');
    expect(result).toContain('Hamlet: $400.00 (25 seats)');
    expect(result).toContain('Amount owed is $400.00');
    expect(result).toContain('You earned 0 credits');
  });

  test('处理【观众人数 > 30】的悲剧表演', () => {
    const invoice = {
      customer: 'John Doe',
      performances: [{ playID: 'hamlet', audience: 35 }],
    };
    const plays = {
      hamlet: { name: 'Hamlet', type: 'tragedy' },
    };

    const result = statement(invoice, plays);

    expect(result).toContain('Statement for John Doe');
    expect(result).toContain('Hamlet: $450.00 (35 seats)');
    expect(result).toContain('Amount owed is $450.00');
    expect(result).toContain('You earned 5 credits');
  });

  test('处理【观众人数 <= 20】的喜剧表演', () => {
    const invoice = {
      customer: 'John Doe',
      performances: [{ playID: 'as-like', audience: 15 }],
    };
    const plays = {
      'as-like': { name: 'As You Like It', type: 'comedy' },
    };

    const result = statement(invoice, plays);

    expect(result).toContain('Statement for John Doe');
    expect(result).toContain('As You Like It: $345.00 (15 seats)');
    expect(result).toContain('Amount owed is $345.00');
    expect(result).toContain('You earned 3 credits');
  });

  test('处理【20 < 观众人数 <= 25】的喜剧表演', () => {
    const invoice = {
      customer: 'John Doe',
      performances: [{ playID: 'as-like', audience: 22 }],
    };
    const plays = {
      'as-like': { name: 'As You Like It', type: 'comedy' },
    };

    const result = statement(invoice, plays);

    expect(result).toContain('Statement for John Doe');
    expect(result).toContain('As You Like It: $476.00 (22 seats)');
    expect(result).toContain('Amount owed is $476.00');
    expect(result).toContain('You earned 4 credits');
  });

  test('处理【观众人数>25】的喜剧表演', () => {
    const invoice = {
      customer: 'John Doe',
      performances: [{ playID: 'as-like', audience: 30 }],
    };
    const plays = {
      'as-like': { name: 'As You Like It', type: 'comedy' },
    };

    const result = statement(invoice, plays);

    expect(result).toContain('Statement for John Doe');
    expect(result).toContain('As You Like It: $540.00 (30 seats)');
    expect(result).toContain('Amount owed is $540.00');
    expect(result).toContain('You earned 6 credits');
  });

  test('处理 unknown 类型的喜剧表演', () => {
    const invoice = {
      customer: 'John Doe',
      performances: [{ playID: 'unknown-play', audience: 20 }],
    };
    const plays = {
      'unknown-play': { type: 'unknown' },
    };

    expect(() => statement(invoice, plays)).toThrow('unknown type: unknown');
  });
});
