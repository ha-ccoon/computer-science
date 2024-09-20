export interface Invoice {
  customer: string;
  performances: Performance[];
}

export interface Performance {
  playID: string;
  audience: number;
}

type Type = 'tragedy' | 'comedy';

export interface PlayInfo {
  name: string;
  type: Type;
}

interface Plays extends Record<string, PlayInfo> {}

export default function statement(invoice: Invoice, plays: Plays) {
  // get play name
  function playFor(aPerformance: Performance) {
    return plays[aPerformance.playID];
  }

  // get the cost of the play
  function amountFor(aPerformance: Performance) {
    let result = 0;

    switch (playFor(aPerformance).type) {
      case 'tragedy': // 비극
        result = 40000;

        if (aPerformance.audience > 30) {
          result += 1000 * (aPerformance.audience - 30);
        }
        break;
      case 'comedy': // 희극
        result = 30000;

        if (aPerformance.audience > 20) {
          result += 10000 + 500 * (aPerformance.audience - 20);
        }
        result += 300 * aPerformance.audience;

        break;

      default:
        throw new Error(`알 수 없는 장르 : ${playFor(aPerformance).type}`);
    }

    return result;
  }

  // local variables
  let totalAmount = 0;
  let volumeCredits = 0;

  let result = `청구내역 (고객명: ${invoice.customer})\n`;

  const format = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format;

  function volumeCreditsFor(perf: Performance) {
    let result = 0;

    result += Math.max(perf.audience - 30, 0);

    if ('comedy' === playFor(perf).type) {
      result += Math.floor(perf.audience / 5);
    }

    return result;
  }

  for (let perf of invoice.performances) {
    volumeCredits += volumeCreditsFor(perf);

    result += `${playFor(perf).name} : ${format(amountFor(perf) / 100)} (${
      perf.audience
    }석)\n`;
    totalAmount += amountFor(perf);
  }

  result += `총액: ${format(totalAmount / 100)}\n`;
  result += `적립 포인트: ${volumeCredits}점\n`;

  return result;
}
