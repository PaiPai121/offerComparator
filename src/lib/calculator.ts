import { Offer } from "@/types/offer";
import { calculateNetIncome } from "./taxCalculator";

export interface AnnualBreakdown {
  year: number;
  gross: number;
  net: number;
  fund: number;
  equity: number;
  totalValue: number;
  cumulative: number;
}

export function calculateTC(offer: Offer): AnnualBreakdown[] {
  const breakdown: AnnualBreakdown[] = [];
  let runningTotalValue = 0;

  const monthly = Number(offer.baseSalary?.monthly || 0);
  const months = Number(offer.baseSalary?.monthsPerYear || 12);
  const annualBase = monthly * months;
  
  // 固定奖金金额
  const fixedBonus = Number(offer.bonus?.fixed || 0);
  // 绩效奖金月数 (例如 2.0 代表 2个月工资作为奖金)
  const targetMonths = Number(offer.bonus?.targetPercent || 0); 
  const totalAnnualBonus = (monthly * targetMonths) + fixedBonus;
  
  const fundRate = Number(offer.insurance?.providentFundRate || 0.12);
  const userBase = Number(offer.insurance?.socialSecurityBase || 0);
  // 公积金封顶基数
  const cityCap = Number(offer.insurance?.maxCap || 35283);

  for (let i = 0; i < 4; i++) {
    const yearNum = i + 1;
    const signOn = i === 0 ? Number(offer.signOn?.year1 || 0) : (i === 1 ? Number(offer.signOn?.year2 || 0) : 0);
    const yearCashGross = annualBase + totalAnnualBonus + signOn;

    // 计算税后收益
    const netData = calculateNetIncome(yearCashGross, userBase, fundRate, cityCap);
    const currentEquity = Number(offer.equity?.totalValue || 0) * (offer.equity?.schedule?.[i] || 0);
    
    const yearlyValue = netData.net + netData.fundTotal + currentEquity;
    runningTotalValue += yearlyValue;

    breakdown.push({
      year: yearNum,
      gross: yearCashGross + currentEquity,
      net: netData.net,
      fund: netData.fundTotal,
      equity: currentEquity,
      totalValue: yearlyValue,
      cumulative: runningTotalValue,
    });
  }
  return breakdown;
}